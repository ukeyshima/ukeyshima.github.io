#version 300 es
precision highp float;

uniform sampler2D velocityTexture;
uniform sampler2D temperatureTexture;
uniform sampler2D densityTexture;
uniform float timeStep;
uniform float ambientTemperature;
uniform float sigma;
uniform float kappa;
uniform vec2 buoyancyDirection;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec2 v = texelFetch(velocityTexture, coord, 0).xy;
    float t = texelFetch(temperatureTexture, coord, 0).x;
    float d = texelFetch(densityTexture, coord, 0).x;
    vec2 result = t > ambientTemperature ? v + (timeStep * (t - ambientTemperature) * sigma - d * kappa) * buoyancyDirection : v;

    outColor = vec4(result.x, result.y, 0.0, 1.0);
}