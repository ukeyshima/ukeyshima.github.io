#version 300 es
precision highp float;

uniform sampler2D sourceTexture;
uniform float fill;
uniform float time;
uniform vec2 texelSizeInverse;

layout(location = 0) out vec4 outColor;

#define FLOAT_MAX float(0xffffffffu)

uvec3 pcg3d(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return v;
}

vec3 pcg3d01(uvec3 v) {
    return vec3(pcg3d(v)) / FLOAT_MAX;
}

float vNoise(vec3 p) {
    uvec3 i = uvec3(floor(p));
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(pcg3d01(i).x, pcg3d01(i + uvec3(1, 0, 0)).x, f.x), mix(pcg3d01(i + uvec3(0, 1, 0)).x, pcg3d01(i + uvec3(1, 1, 0)).x, f.x), f.y), mix(mix(pcg3d01(i + uvec3(0, 0, 1)).x, pcg3d01(i + uvec3(1, 0, 1)).x, f.x), mix(pcg3d01(i + uvec3(0, 1, 1)).x, pcg3d01(i + uvec3(1, 1, 1)).x, f.x), f.y), f.z);
}

float fbm(vec3 p) {
    float amp = 1.0;
    float freq = 1.0;
    float value = 0.0;
    float maxValue = 0.0;
    for(float i = 0.0; i < 5.0; i++) {
        value += amp * vNoise(p * freq);
        maxValue += amp;
        amp *= 0.5;
        freq *= 2.0;
    }
    return value / maxValue;
}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec2 uv = gl_FragCoord.xy * texelSizeInverse.xy * vec2(1.0, texelSizeInverse.x / texelSizeInverse.y);

    float source = texelFetch(sourceTexture, coord, 0).x;
    float impulse = fbm(vec3(uv.x * 15.0, uv.y * 20.0, time * 0.5));
    impulse = pow(impulse, 7.0);
    impulse *= 1.0 - smoothstep(0.1, 0.3, uv.y);
    float result = source * (1.0 - impulse) + fill * impulse;

    outColor = vec4(max(0.0, result), 0.0, 0.0, 1.0);
}