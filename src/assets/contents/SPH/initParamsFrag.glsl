#version 300 es
precision mediump float;

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

void main(void) {
    uvec2 coord = uvec2(gl_FragCoord.xy);

    vec3 vel = pcg3d01(uvec3(coord, 0));
    vel = vel - 0.5;
    vec3 pos = pcg3d01(uvec3(coord, 100));
    pos = pos - 0.5;
    pos *= simAreaSize;
    pos.xz *= 0.5;
    pos -= simAreaCenter;

    outVelocity = vec4(vel, 1.0);
    outPosition = vec4(pos, 1.0);
}