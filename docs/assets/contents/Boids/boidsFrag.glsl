#version 300 es
precision mediump float;

in vec4 vsColor;

layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outDepth;

void main(void) {
    outColor = vsColor;
    outDepth = vec4(1.0, 0.0, 0.0, 1.0);
}