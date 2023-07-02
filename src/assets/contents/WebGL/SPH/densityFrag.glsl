#version 300 es
precision mediump float;
precision mediump isampler2D;

uniform ivec3 gridNum;
uniform vec3 simAreaCenter;
uniform vec3 simAreaSize;
uniform float smoothLen;
uniform float mass;

uniform sampler2D positionTexture;
uniform isampler2D gridIndexTexture;
uniform sampler2D gridIndexReferenceTexture;

layout(location = 0) out vec4 outDensity;

#define PI 3.141592

ivec2 getCoord(int instanceIndex) {
    ivec2 resolution = textureSize(positionTexture, 0);
    return ivec2(instanceIndex % resolution.x, instanceIndex / resolution.x);
}

int getInstanceIndex(int id) {
    ivec2 coord = getCoord(id);
    return texelFetch(gridIndexTexture, coord, 0).x;
}

ivec3 getGridPos(vec3 position) {
    vec3 np = (position - simAreaCenter) / simAreaSize + vec3(0.5);
    ivec3 gridPos = ivec3(np * vec3(gridNum));
    gridPos.x = clamp(gridPos.x, 0, gridNum.x - 1);
    gridPos.y = clamp(gridPos.y, 0, gridNum.y - 1);
    gridPos.z = clamp(gridPos.z, 0, gridNum.z - 1);
    return gridPos;
}

int getGridIndex(ivec3 gridPos) {
    return gridPos.x + gridPos.z * gridNum.x + gridPos.y * gridNum.x * gridNum.z;
}

ivec2 getGridCoord(int gridIndex) {
    ivec2 resolution = textureSize(gridIndexReferenceTexture, 0);
    return ivec2(gridIndex % resolution.x, gridIndex / resolution.x);
}

float poly6(float r, float h) {
    return r > 0.0 && r <= h ? 315.0 / (64.0 * PI * pow(h, 9.0)) * (h * h - r * r) * (h * h - r * r) * (h * h - r * r) : 0.0;
}

float getDensity(vec3 pos) {
    float density = 0.0;
    ivec3 gridPos = getGridPos(pos);
    for(int x = max(gridPos.x - 1, 0); x <= min(gridPos.x + 1, gridNum.x - 1); x++) {
        for(int y = max(gridPos.y - 1, 0); y <= min(gridPos.y + 1, gridNum.y - 1); y++) {
            for(int z = max(gridPos.z - 1, 0); z <= min(gridPos.z + 1, gridNum.z - 1); z++) {
                int neighborGridIndex = getGridIndex(ivec3(x, y, z));
                ivec2 gridCoord = getGridCoord(neighborGridIndex);
                ivec2 firstIndex = ivec2(round(texelFetch(gridIndexReferenceTexture, gridCoord, 0).xy));
                for(int i = firstIndex.x; i <= firstIndex.y; i++) {
                    int instanceIndex = getInstanceIndex(i);
                    ivec2 coord = getCoord(instanceIndex);
                    vec3 otherPos = texelFetch(positionTexture, coord, 0).xyz;
                    vec3 diff = otherPos - pos;
                    float dist = sqrt(dot(diff, diff));
                    dist = max(dist, 0.0001);
                    density += poly6(dist, smoothLen) * mass;
                }
            }
        }
    }
    return density;
}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec3 pos = texelFetch(positionTexture, coord, 0).xyz;
    float density = getDensity(pos);
    outDensity = vec4(density, density, density, 1.0);
}