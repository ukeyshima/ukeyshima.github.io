#version 300 es
precision highp float;
precision highp usampler2D;
precision highp isampler2D;

uniform float deltaTime;
uniform vec2 indexResolution;
uniform vec2 gridIndexResolution;
uniform vec3 gridNum;
uniform float maxSpeed;
uniform float maxForce;
uniform float separationRadius;
uniform float alignmentRadius;
uniform float cohesionRadius;
uniform float separationWeight;
uniform float alignmentWeight;
uniform float cohesionWeight;
uniform vec3 simAreaCenter;
uniform vec3 simAreaSize;
uniform vec3 cameraAreaCenter;
uniform float cameraAreaSize;
uniform float wallWeight;
uniform vec3 mouse;

uniform sampler2D velocityTexture;
uniform sampler2D positionTexture;
uniform usampler2D indexTexture;
uniform isampler2D gridIndexTexture;

layout(location = 0) out vec4 outVelocity;
layout(location = 1) out vec4 outPosition;

vec3 limit(vec3 vec, float max) {
    float length = sqrt(dot(vec, vec));
    return (length > max && length > 0.0) ? vec.xyz * (max / length) : vec.xyz;
}

int getInstanceIndex(ivec2 coord) {
    return coord.x + coord.y * int(indexResolution.x);
}

ivec2 getCoord(int instanceIndex) {
    return ivec2(instanceIndex % int(indexResolution.x), instanceIndex / int(indexResolution.x));
}

int getGridIndex(int instanceIndex) {
    ivec2 coord = getCoord(instanceIndex);
    return int(texelFetch(indexTexture, coord, 0).y);
}

ivec2 getGridCoord(int gridIndex) {
    return ivec2(gridIndex % int(gridIndexResolution.x), gridIndex / int(gridIndexResolution.x));
}

int getNeighborGridIndex(int gridIndex, int x, int y, int z) {
    return gridIndex + x + y * int(gridNum.x) + z * int(gridNum.x * gridNum.y);
}

vec3 getForce(int instanceIndex, vec3 pos, vec3 vel) {
    vec3 separationForce;
    vec3 alignmentForce;
    vec3 cohesionForce;
    float separationCount;
    float alignmentCount;
    float cohesionCount;
    int gridIndex = getGridIndex(instanceIndex);
    for(int x = -1; x <= 1; x++) {
        for(int y = -1; y <= 1; y++) {
            for(int z = -1; z <= 1; z++) {
                int neighborGridIndex = getNeighborGridIndex(gridIndex, x, y, z);
                if(neighborGridIndex < 0 || neighborGridIndex > int(gridNum.x * gridNum.y * gridNum.z))
                    continue;
                ivec2 gridCoord = getGridCoord(neighborGridIndex);
                ivec2 firstLastIndex = texelFetch(gridIndexTexture, gridCoord, 0).xy;

                for(int i = firstLastIndex.x; i <= firstLastIndex.y; i++) {
                    ivec2 coord = getCoord(i);
                    vec3 otherPos = texelFetch(positionTexture, coord, 0).xyz;
                    vec3 otherVel = texelFetch(velocityTexture, coord, 0).xyz;
                    vec3 diff = pos - otherPos;
                    float dist = sqrt(dot(diff, diff));

                    separationForce += dist > 0.0 && dist <= separationRadius ? normalize(diff) / dist : vec3(0.0);
                    separationCount += dist > 0.0 && dist <= separationRadius ? 1.0 : 0.0;
                    alignmentForce += dist > 0.0 && dist <= alignmentRadius ? otherVel : vec3(0.0);
                    alignmentCount += dist > 0.0 && dist <= alignmentRadius ? 1.0 : 0.0;
                    cohesionForce += dist > 0.0 && dist <= cohesionRadius ? otherPos : vec3(0.0);
                    cohesionCount += dist > 0.0 && dist <= cohesionRadius ? 1.0 : 0.0;
                }

            }
        }
    }
    separationForce = separationCount < 1.0 ? vec3(0.0) : limit(normalize(separationForce / separationCount) * maxSpeed - vel, maxForce) * separationWeight;
    alignmentForce = alignmentCount < 1.0 ? vec3(0.0) : limit(normalize(alignmentForce / alignmentCount) * maxSpeed - vel, maxForce) * alignmentWeight;
    cohesionForce = cohesionCount < 1.0 ? vec3(0.0) : limit(normalize(cohesionForce / cohesionCount - pos) * maxSpeed - vel, maxForce) * cohesionWeight;
    return separationForce + alignmentForce + cohesionForce;
}

vec3 avoidWall(vec3 pos) {
    vec3 acc = vec3(0.0, 0.0, 0.0);
    acc.x = (pos.x < simAreaCenter.x - simAreaSize.x * 0.5) ? acc.x + 1.0 : acc.x;
    acc.x = (pos.x > simAreaCenter.x + simAreaSize.x * 0.5) ? acc.x - 1.0 : acc.x;
    acc.y = (pos.y < simAreaCenter.y - simAreaSize.y * 0.5) ? acc.y + 1.0 : acc.y;
    acc.y = (pos.y > simAreaCenter.y + simAreaSize.y * 0.5) ? acc.y - 1.0 : acc.y;
    acc.z = (pos.z < simAreaCenter.z - simAreaSize.z * 0.5) ? acc.z + 1.0 : acc.z;
    acc.z = (pos.z > simAreaCenter.z + simAreaSize.z * 0.5) ? acc.z - 1.0 : acc.z;
    return acc;
}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    int instanceIndex = getInstanceIndex(coord);

    vec3 vel = texelFetch(velocityTexture, coord, 0).xyz;
    vec3 pos = texelFetch(positionTexture, coord, 0).xyz;

    vec3 force = getForce(instanceIndex, pos, vel);
    force += avoidWall(pos) * wallWeight;

    vel += force * deltaTime;
    pos += vel * deltaTime;
    outVelocity = vec4(vel, 0.0);
    outPosition = vec4(pos, 0.0);
}