#version 300 es
precision mediump float;

flat in ivec3 vertColor;

layout(location = 0) out vec4 outColor;

void main(void) {
    outColor = vec4(vec3(vertColor), 0.0);
}