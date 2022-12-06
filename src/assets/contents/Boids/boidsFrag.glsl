#version 300 es
precision lowp float;

in vec4 vsColor;

layout(location = 0) out vec4 outColor;

void main(void) {
    outColor = vsColor;
}