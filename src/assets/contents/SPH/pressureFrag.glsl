#version 300 es
precision mediump float;
precision mediump isampler2D;
precision mediump usampler2D;

uniform float pressureStiffness;
uniform float restDensity;

uniform sampler2D densityTexture;

layout(location = 0) out vec4 outPressure;

float tait(float density, float r) {
    return pressureStiffness * max(pow(density / restDensity, r) - 1.0, 0.0);
}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    float density = texelFetch(densityTexture, coord, 0).x;
    float pressure = tait(density, 7.0);
    outPressure = vec4(pressure, pressure, pressure, 1.0);
}