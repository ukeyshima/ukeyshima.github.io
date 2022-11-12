#version 300 es
precision highp float;

uniform sampler2D sourceTexture;
uniform float fill;
uniform vec2 texelSizeInverse;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec2 uv = gl_FragCoord.xy * texelSizeInverse.xy * vec2(1.0, texelSizeInverse.x / texelSizeInverse.y);
    float source = texelFetch(sourceTexture, coord, 0).x;
    float d = length((uv - vec2(0.5, 0.03)));
    float impulse = d < 0.05 ? min((0.05 - d) * 0.5, 1.0) : 0.0;
    float result = source * (1.0 - impulse) + fill * impulse;

    outColor = vec4(max(0.0, result), 0.0, 0.0, 1.0);
}