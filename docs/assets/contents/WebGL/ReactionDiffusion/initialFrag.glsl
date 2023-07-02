#version 300 es
precision lowp float;

uniform vec2 resolution;

layout(location = 0) out vec4 outColor;

void main(void) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float A = 1.0;
    float B = step(length(p), 0.1);
    vec3 color = vec3(A, B, 0.0);
    outColor = vec4(color, 1.0);
}