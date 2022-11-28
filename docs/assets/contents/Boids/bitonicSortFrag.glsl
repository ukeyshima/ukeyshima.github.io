#version 300 es
precision highp float;
precision highp usampler2D;

uniform usampler2D indexTexture;
uniform vec2 resolution;
uniform int mainBlockStep;
uniform int subBlockStep;

layout(location = 0) out uvec4 outIndex;

uint getInstanceIndex(vec2 fragCoord) {
    return uint(fragCoord.x) + uint(fragCoord.y) * uint(resolution.x);
}

ivec2 getCoord(uint instanceIndex) {
    return ivec2(instanceIndex % uint(resolution.x), instanceIndex / uint(resolution.x));
}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    uint index = getInstanceIndex(gl_FragCoord.xy);

    uint distance = 1u << uint(mainBlockStep - subBlockStep);
    bool ascendingOrder = ((index >> uint(mainBlockStep)) & 2u) == 0u;
    bool first = (index & distance) == 0u;

    uint targetIndex = first ? index | distance : index & ~distance;

    uvec4 color = texelFetch(indexTexture, coord, 0);
    uvec4 targetColor = texelFetch(indexTexture, getCoord(targetIndex), 0);

    bool swap = (ascendingOrder && first && color.y > targetColor.y) ||
        (ascendingOrder && !first && color.y <= targetColor.y) ||
        (!ascendingOrder && first && color.y < targetColor.y) ||
        (!ascendingOrder && !first && color.y >= targetColor.y);

    outIndex = swap ? targetColor : color;
}