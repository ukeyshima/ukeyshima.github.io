#version 300 es
precision mediump float;

uniform mat4 vpMatrix;
uniform sampler2D positionTexture;
uniform sampler2D densityTexture;

out vec3 vertColor;

ivec2 getCoord(int instanceIndex) {
    ivec2 resolution = textureSize(positionTexture, 0);
    return ivec2(instanceIndex % resolution.x, instanceIndex / resolution.x);
}

void main(void) {
    ivec2 coord = getCoord(gl_InstanceID);
    vec3 position = texelFetch(positionTexture, coord, 0).xyz;
    float density = texelFetch(densityTexture, coord, 0).x;

    float t = pow(max(density, 0.0) * 0.000045, 7.0) * 50.0;
    vec3 col = mix(vec3(0.9), vec3(0.2, 0.6, 0.9), t);
    vertColor = col;

    gl_PointSize = 3.0;
    gl_Position = vpMatrix * vec4(position, 1.0);
}