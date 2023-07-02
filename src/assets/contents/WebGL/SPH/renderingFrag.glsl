#version 300 es
precision mediump float;

in vec3 vertColor;

layout(location = 0) out vec4 outColor;

void main(void) {
    outColor = vec4(vertColor, 1.0);
}