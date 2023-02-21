#version 300 es
precision highp float;
precision highp isampler2D;

uniform isampler2D indexTexture;
uniform int inc;
uniform int dir;

layout(location = 0) out ivec2 outIndex;

int getInstanceIndex(ivec2 fragCoord) {
    ivec2 resolution = textureSize(indexTexture, 0);
    return fragCoord.x + fragCoord.y * resolution.x;
}

ivec2 getCoord(int instanceIndex) {
    ivec2 resolution = textureSize(indexTexture, 0);
    return ivec2(instanceIndex % resolution.x, instanceIndex / resolution.x);
}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    int index = getInstanceIndex(coord);

    bool asc = (dir & index) == 0;
    bool first = (index & inc) == 0;
    int firstIndex = first ? index : index - inc;
    int secondIndex = first ? index + inc : index;

    ivec2 firstColor = texelFetch(indexTexture, getCoord(firstIndex), 0).xy;
    ivec2 secondColor = texelFetch(indexTexture, getCoord(secondIndex), 0).xy;

    bool swap = (asc && firstColor.y > secondColor.y) || (!asc && firstColor.y < secondColor.y);

    outIndex = swap ? (first ? secondColor : firstColor) : (first ? firstColor : secondColor);
}