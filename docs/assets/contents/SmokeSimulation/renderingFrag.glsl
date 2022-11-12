#version 300 es
precision lowp float;

uniform sampler2D tex;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec3 color = texelFetch(tex, coord, 0).xxx;
    outColor = vec4(color, 1.0);
}