#version 300 es
in vec3 vertex;
in float instanceIndex;

out float vsDepth;
out vec4 vsColor;

uniform vec2 paramsResolution;
uniform mat4 mMatrix;
uniform mat4 vpMatrix;
uniform vec3 simAreaSize;
uniform int instanceNum;
uniform float time;
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;

#define PI 3.141592
#define FLOAT_MAX float(0xffffffffu)

ivec2 getCoord(int instanceIndex) {
    instanceIndex = instanceIndex < instanceNum ? instanceIndex : instanceIndex - instanceNum;
    return ivec2(instanceIndex % int(paramsResolution.x), instanceIndex / int(paramsResolution.x));
}

float atan2(in float y, in float x) {
    return x == 0.0 ? sign(y) * PI / 2.0 : atan(y, x);
}

mat4 rotationZ(float t) {
    return mat4(cos(t), sin(t), 0.0, 0.0, -sin(t), cos(t), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
}

uint pcg(uint v) {
    uint state = v * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

void main(void) {
    ivec2 coord = getCoord(int(instanceIndex));
    vec3 position = texelFetch(positionTexture, coord, 0).xyz;
    vec3 velocity = texelFetch(velocityTexture, coord, 0).xyz;

    mat4 rotZ = rotationZ(PI * 3.0 / 2.0 + atan2(velocity.y, velocity.x));

    position.x += int(instanceIndex) < instanceNum ? 0.0 : position.x < 0.0 ? simAreaSize.x : -simAreaSize.x;

    float rand = float(pcg(uint(instanceIndex))) / FLOAT_MAX * 2.0 - 1.0;
    float velocityMagnitude = length(velocity);
    float wing = smoothstep(0.2, 0.6, abs(vertex.x)) * abs(vertex.x) / 2.0;
    float flapAmp = rand + 0.1 * velocityMagnitude;
    float flapFreq = 2.0 + rand * 0.3 - 0.1 * velocityMagnitude;

    vec4 vertex = vec4(vertex, 1.0);
    vertex.z += wing * flapAmp * sin(flapFreq * time);
    vertex = mMatrix * vertex;
    vertex = rotZ * vertex;
    vertex.xyz += position;
    vertex = vpMatrix * vertex;

    vec3 color = vec3(clamp(vertex.z * 0.5 + 0.5, 0.5, 1.0)) * (velocity.xyz * 0.5 + vec3(0.5));

    gl_Position = vertex;
    vsColor = vec4(color, 0.9);
}