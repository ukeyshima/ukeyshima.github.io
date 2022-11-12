#version 300 es
precision highp float;

uniform sampler2D velocityTexture;
uniform sampler2D pressureTexture;
uniform float gradientScale;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    float pN = texelFetch(pressureTexture, coord + ivec2(0, 1), 0).x;
    float pS = texelFetch(pressureTexture, coord - ivec2(0, 1), 0).x;
    float pE = texelFetch(pressureTexture, coord + ivec2(1, 0), 0).x;
    float pW = texelFetch(pressureTexture, coord - ivec2(1, 0), 0).x;

    vec2 grad = vec2(pE - pW, pN - pS) * gradientScale;
    vec2 v = texelFetch(velocityTexture, coord, 0).xy - grad;

    outColor = vec4(v.x, v.y, 0.0, 1.0);
}