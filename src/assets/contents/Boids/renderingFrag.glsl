#version 300 es
precision lowp float;
precision highp sampler2D;

uniform sampler2D tex;
uniform vec2 resolution;
uniform float time;
#define FLOAT_MAX float(0xffffffffu)

layout(location = 0) out vec4 outColor;

uint pcg(uint v) {
    uint state = v * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

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
    for(float i = 0.0; i < 3.0; i++) {
        value += amp * vNoise(p * freq);
        maxValue += amp;
        amp *= 0.5;
        freq *= 2.0;
    }
    return value / maxValue;

}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec2 uv = vec2(gl_FragCoord.xy / resolution);

    vec3 color = vec3(texelFetch(tex, coord, 0).xyz);

    color += fbm(vec3(uv * 500.0, 0.1 * time)) * 0.5 - 0.5;
    color += pow(fbm(vec3(uv * 5.0, 0.2 * time)), 2.0) * 0.5;

    color -= 0.1 * pcg3d01(uvec3(uint(coord.y) - uint(coord.y) % pcg(uint(coord.x)), uint(coord.x), 0)).xxx;
    color -= 0.1 * pcg3d01(uvec3(uint(coord.x) - uint(coord.x) % pcg(uint(coord.y)), uint(coord.y), 0)).xxx;

    outColor = vec4(color, 1.0);
}