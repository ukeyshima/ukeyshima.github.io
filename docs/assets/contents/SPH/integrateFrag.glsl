#version 300 es
precision highp float;
precision highp isampler2D;
precision highp usampler2D;
precision highp sampler2D;

uniform vec3 simAreaCenter;
uniform vec3 simAreaSize;
uniform vec3 gravity;
uniform float wallStiffness;
uniform float timeStep;

uniform sampler2D velocityTexture;
uniform sampler2D positionTexture;
uniform sampler2D accelerationTexture;

layout(location = 0) out vec4 outVelocity;
layout(location = 1) out vec4 outPosition;

void avoidWall(vec3 pos, inout vec3 acceleration) {
    acceleration.x += max(dot(vec4(pos, 1.0), vec4(-1.0, 0.0, 0.0, simAreaCenter.x - simAreaSize.x * 0.5)), 0.0) * wallStiffness;
    acceleration.x += min(dot(vec4(pos, 1.0), vec4(-1.0, 0.0, 0.0, simAreaCenter.x + simAreaSize.x * 0.5)), 0.0) * wallStiffness;
    acceleration.y += max(dot(vec4(pos, 1.0), vec4(0.0, -1.0, 0.0, simAreaCenter.y - simAreaSize.y * 0.5)), 0.0) * wallStiffness;
    acceleration.y += min(dot(vec4(pos, 1.0), vec4(0.0, -1.0, 0.0, simAreaCenter.y + simAreaSize.y * 0.5)), 0.0) * wallStiffness;
    acceleration.z += max(dot(vec4(pos, 1.0), vec4(0.0, 0.0, -1.0, simAreaCenter.z - simAreaSize.z * 0.5)), 0.0) * wallStiffness;
    acceleration.z += min(dot(vec4(pos, 1.0), vec4(0.0, 0.0, -1.0, simAreaCenter.z + simAreaSize.z * 0.5)), 0.0) * wallStiffness;
}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec3 position = texelFetch(positionTexture, coord, 0).xyz;
    vec3 velocity = texelFetch(velocityTexture, coord, 0).xyz;
    vec3 acceleration = texelFetch(accelerationTexture, coord, 0).xyz;
    acceleration += gravity;
    avoidWall(position, acceleration);

    velocity += timeStep * acceleration;
    position += timeStep * velocity;

    outVelocity = vec4(velocity, 1.0);
    outPosition = vec4(position, 1.0);
}