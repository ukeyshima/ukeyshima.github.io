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

void main(void) {
    uvec2 coord = uvec2(gl_FragCoord.xy);
    vec3 vel = vec3(pcg3d(uvec3(coord, 0))) / FLOAT_MAX;
    vec3 pos = vec3(pcg3d(uvec3(coord, 100))) / FLOAT_MAX;
    vel = vel - 0.5;
    pos = pos - 0.5;
    pos *= simAreaSize + vec3(30.0, 30.0, 30.0);
    pos -= simAreaCenter;
    outVelocity = vec4(vel, 0.0);
    outPosition = vec4(pos, 0.0);
}