#version 300 es
precision lowp float;

uniform sampler2D tex;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    float A = texelFetch(tex, coord, 0).r;
    float B = texelFetch(tex, coord, 0).g;

    outColor = vec4(vec3(1.0 - (A - B)), 1.0);
}