#version 300 es
precision highp float;

uniform sampler2D pressureTexture;
uniform sampler2D divergenceTexture;
uniform float alpha;
uniform float inverseBeta;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    float pN = texelFetch(pressureTexture, coord + ivec2(0, 1), 0).x;
    float pS = texelFetch(pressureTexture, coord - ivec2(0, 1), 0).x;
    float pE = texelFetch(pressureTexture, coord + ivec2(1, 0), 0).x;
    float pW = texelFetch(pressureTexture, coord - ivec2(1, 0), 0).x;

    float bC = texelFetch(divergenceTexture, coord, 0).x;

    outColor = vec4((pW + pE + pS + pN + alpha * bC) * inverseBeta);
}