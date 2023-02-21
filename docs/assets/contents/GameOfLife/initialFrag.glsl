#version 300 es
precision mediump float;
precision mediump isampler2D;

layout(location = 0) out ivec4 outColor;

uniform vec2 resolution;

#define FLOAT_MAX float(0xffffffffu)

uint pcg(uint v) {
    uint state = v * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

float pcg01(uint v) {
    return float(pcg(v)) / FLOAT_MAX;
}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec2 uv = gl_FragCoord.xy / resolution;
    int c = int(step(pcg01(uint(coord.x) * uint(coord.y)), 0.5));
    c *= int(step(length(uv - 0.5), 0.5));

    outColor = ivec4(c, c, c, c);
}