#version 300 es
precision highp float;

uniform vec2 resolution;
uniform vec3 simAreaCenter;
uniform vec3 simAreaSize;
uniform vec3 gridNum;

uniform sampler2D positionTexture;

layout(location = 0) out uvec4 outIndex;

#define FLOAT_MAX float(0xffffffffu)

uint getInstanceIndex(vec2 fragCoord) {
    return uint(fragCoord.x) + uint(fragCoord.y) * uint(resolution.x);
}

uint getGridIndex(vec3 position) {
    vec3 np = (position - simAreaCenter) / simAreaSize + vec3(0.5);
    uvec3 ip = uvec3(floor(np * gridNum));
    return ip.x + ip.y * uint(gridNum.x) + ip.z * uint(gridNum.x * gridNum.y);
}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec3 pos = texelFetch(positionTexture, coord, 0).xyz;
    uint index = getInstanceIndex(gl_FragCoord.xy);
    uint gridIndex = getGridIndex(pos);
    outIndex = uvec4(index, gridIndex, 0, 0);
}