#version 300 es
precision highp float;

uniform vec3 simAreaCenter;
uniform vec3 simAreaSize;

layout(location = 0) out vec4 outVelocity;
layout(location = 1) out vec4 outPosition;

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

void main(void) {
    uvec2 coord = uvec2(gl_FragCoord.xy);

    vec3 vel = pcg3d01(uvec3(coord, 0));
    vel = vel - 0.5;
    vec3 pos = pcg3d01(uvec3(coord, 100));
    for(int i = 0; i < 300; i++) {
        vec3 p = pcg3d01(uvec3(coord, i));
        float v = pow(vNoise(p * 5.0), 4.0) * 4.0;
        if(v > 0.8) {
            pos = p;
            break;
        }
    }
    pos = pos - 0.5;
    pos *= simAreaSize;
    pos.z *= 0.01;
    pos -= simAreaCenter;

    outVelocity = vec4(vel, 0.0);
    outPosition = vec4(pos, 0.0);
}