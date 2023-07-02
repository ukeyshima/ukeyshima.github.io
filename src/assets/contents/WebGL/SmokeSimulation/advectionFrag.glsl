#version 300 es
precision highp float;

uniform sampler2D velocityTexture;
uniform sampler2D sourceTexture;
uniform float timeStep;
uniform float dissipation;
uniform vec2 texelSizeInverse;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec2 v = texelFetch(velocityTexture, coord, 0).xy;
    vec2 uv = (gl_FragCoord.xy - v.xy * timeStep) * texelSizeInverse.xy;
    vec2 result = dissipation * texture(sourceTexture, uv).xy;

    outColor = vec4(result.x, result.y, 0.0, 0.0);
}