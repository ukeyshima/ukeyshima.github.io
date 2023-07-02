#version 300 es
precision mediump float;

uniform vec3 simAreaCenter;
uniform vec3 simAreaSize;
uniform ivec3 gridNum;

uniform sampler2D positionTexture;

layout(location = 0) out ivec2 outIndex;

int getInstanceIndex(ivec2 fragCoord) {
    ivec2 resolution = textureSize(positionTexture, 0);
    return fragCoord.x + fragCoord.y * resolution.x;
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

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec3 pos = texelFetch(positionTexture, coord, 0).xyz;
    int index = getInstanceIndex(coord);
    ivec3 gridPos = getGridPos(pos);
    int gridIndex = getGridIndex(gridPos);
    outIndex = ivec2(index, gridIndex);
}