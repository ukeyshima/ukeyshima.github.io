#version 300 es
precision mediump float;

uniform float timeStep;

uniform sampler2D velocityTexture;
uniform sampler2D positionTexture;
uniform sampler2D accelerationTexture;

layout(location = 0) out vec4 outVelocity;
layout(location = 1) out vec4 outPosition;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec3 position = texelFetch(positionTexture, coord, 0).xyz;
    vec3 velocity = texelFetch(velocityTexture, coord, 0).xyz;
    vec3 acceleration = texelFetch(accelerationTexture, coord, 0).xyz;

    velocity += timeStep * acceleration;
    position += timeStep * velocity;

    outVelocity = vec4(velocity, 1.0);
    outPosition = vec4(position, 1.0);
}