#version 300 es
precision highp float;
precision highp usampler2D;
precision highp isampler2D;

uniform float deltaTime;
uniform float time;
uniform vec2 paramsResolution;
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
uniform float wallWeight;

uniform sampler2D velocityTexture;
uniform sampler2D positionTexture;
uniform isampler2D gridIndexTexture;

#define FLOAT_MAX float(0xffffffffu)

layout(location = 0) out vec4 outVelocity;
layout(location = 1) out vec4 outPosition;

vec3 limit(vec3 vec, float max) {
    float length = sqrt(dot(vec, vec));
    return (length > max && length > 0.0) ? vec.xyz * (max / length) : vec.xyz;
}

ivec2 getCoord(int instanceIndex) {
    return ivec2(instanceIndex % int(paramsResolution.x), instanceIndex / int(paramsResolution.x));
}

uint getGridIndex(vec3 position) {
    vec3 np = (position - simAreaCenter) / simAreaSize + vec3(0.5);
    uvec3 ip = uvec3(floor(np * gridNum));
    return ip.x + ip.y * uint(gridNum.x) + ip.z * uint(gridNum.x * gridNum.y);
}

ivec2 getGridCoord(int gridIndex) {
    return ivec2(gridIndex % int(gridIndexResolution.x), gridIndex / int(gridIndexResolution.x));
}

int getNeighborGridIndex(int gridIndex, int x, int y, int z) {
    return gridIndex + x + y * int(gridNum.x) + z * int(gridNum.x * gridNum.y);
}

bool isNeighborGridIndexInSimulationArea(int gridIndex, int x, int y, int z) {
    ivec3 gridPos;
    gridPos.z = gridIndex / int(gridNum.x * gridNum.y);
    gridPos.y = (gridIndex % int(gridNum.x * gridNum.y)) / int(gridNum.x);
    gridPos.x = (gridIndex % int(gridNum.x * gridNum.y)) % int(gridNum.x);

    return (gridPos.x + x) >= 0 && (gridPos.x + x) < int(gridNum.x) &&
        (gridPos.y + y) >= 0 && (gridPos.y + y) < int(gridNum.y) &&
        (gridPos.z + z) >= 0 && (gridPos.z + z) < int(gridNum.z);
}

vec3 getForce(vec3 pos, vec3 vel) {
    vec3 separationForce = vec3(0.0);
    vec3 alignmentForce = vec3(0.0);
    vec3 cohesionForce = vec3(0.0);
    float separationCount = 0.0;
    float alignmentCount = 0.0;
    float cohesionCount = 0.0;
    int gridIndex = int(getGridIndex(pos));
    for(int x = -1; x <= 1; x++) {
        for(int y = -1; y <= 1; y++) {
            for(int z = -1; z <= 1; z++) {
                int neighborGridIndex = getNeighborGridIndex(gridIndex, x, y, z);
                if(!isNeighborGridIndexInSimulationArea(gridIndex, x, y, z))
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

uvec3 pcg3d(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return v;
}

vec3 pcg3d01(uvec3 v) {
    return vec3(pcg3d(v)) / FLOAT_MAX;
}

vec3 vNoise3d(vec3 p) {
    uvec3 i = uvec3(floor(p));
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(pcg3d01(i), pcg3d01(i + uvec3(1, 0, 0)), f.x), mix(pcg3d01(i + uvec3(0, 1, 0)), pcg3d01(i + uvec3(1, 1, 0)), f.x), f.y), mix(mix(pcg3d01(i + uvec3(0, 0, 1)), pcg3d01(i + uvec3(1, 0, 1)), f.x), mix(pcg3d01(i + uvec3(0, 1, 1)), pcg3d01(i + uvec3(1, 1, 1)), f.x), f.y), f.z);
}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);

    vec3 vel = texelFetch(velocityTexture, coord, 0).xyz;
    vec3 pos = texelFetch(positionTexture, coord, 0).xyz;

    vec3 force = getForce(pos, vel);
    force += avoidWall(pos) * wallWeight;
    force += vNoise3d(vec3(pos.xy, time)) * 2.0 - 1.0;

    vel += force * deltaTime;
    vel = limit(vel, maxSpeed);
    pos += vel * deltaTime;
    outVelocity = vec4(vel, 0.0);
    outPosition = vec4(pos, 0.0);
}