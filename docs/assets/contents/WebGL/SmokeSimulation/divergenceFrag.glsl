#version 300 es
precision highp float;

uniform sampler2D velocityTexture;
uniform float halfInverseCellSize;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec2 vN = texelFetch(velocityTexture, coord + ivec2(0, 1), 0).xy;
    vec2 vS = texelFetch(velocityTexture, coord - ivec2(0, 1), 0).xy;
    vec2 vE = texelFetch(velocityTexture, coord + ivec2(1, 0), 0).xy;
    vec2 vW = texelFetch(velocityTexture, coord - ivec2(1, 0), 0).xy;

    float result = halfInverseCellSize * (vE.x - vW.x + vN.y - vS.y);

    outColor = vec4(result, 0.0, 0.0, 1.0);
}