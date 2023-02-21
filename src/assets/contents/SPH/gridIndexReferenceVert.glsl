#version 300 es
precision mediump float;
precision mediump isampler2D;

uniform int instanceNum;
uniform ivec2 resolution;

uniform isampler2D gridIndexTexture;

flat out ivec3 vertColor;

ivec2 getCoord(int instanceIndex) {
    ivec2 resolution = textureSize(gridIndexTexture, 0);
    return ivec2(instanceIndex % resolution.x, instanceIndex / resolution.x);
}

vec2 getPosition(int gridIndex) {
    ivec2 coord = ivec2(gridIndex % resolution.x, gridIndex / resolution.x);
    vec2 position = vec2(coord) * 2.0 / vec2(resolution);
    return position;
}

void main(void) {
    ivec2 coord = getCoord(gl_InstanceID);
    ivec2 leftCoord = getCoord(gl_InstanceID - 1);
    ivec2 rightCoord = getCoord(gl_InstanceID + 1);
    int gridIndex = texelFetch(gridIndexTexture, coord, 0).y;
    int leftGridIndex = gl_InstanceID > 0 ? texelFetch(gridIndexTexture, leftCoord, 0).y : -1;
    int rightGridIndex = gl_InstanceID < instanceNum - 1 ? texelFetch(gridIndexTexture, rightCoord, 0).y : -1;

    vertColor = ivec3(0);
    vertColor.x = (gridIndex != leftGridIndex) ? gl_InstanceID : 0;
    vertColor.y = (gridIndex != rightGridIndex) ? gl_InstanceID : 0;

    vec4 position = vec4(0.0, 0.0, 0.0, 1.0);
    position.xy *= (gridIndex != leftGridIndex) || (gridIndex != rightGridIndex) ? vec2(1.0) : vec2(0.0);
    position.xy += vec2(-1.0) + 1.0 / vec2(resolution) + getPosition(gridIndex);

    gl_Position = position;
    gl_PointSize = 1.0;
}