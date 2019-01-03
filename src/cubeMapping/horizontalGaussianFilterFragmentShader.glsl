#version 300 es
precision highp float;
uniform sampler2D cubeColor;
uniform float weight[10];
uniform vec2 resolution;
layout (location = 0) out vec4 outColor;
in vec2 vTextureCoord;
void main(void){     
    vec2 tFrag = 1.0 / resolution;   
    vec3  color = vec3(0.0);
    color += texture(cubeColor, (vTextureCoord + vec2(-9.0, 0.0)*tFrag)).rgb * weight[9];
    color += texture(cubeColor, (vTextureCoord + vec2(-8.0, 0.0)*tFrag)).rgb * weight[8];
    color += texture(cubeColor, (vTextureCoord + vec2(-7.0, 0.0)*tFrag)).rgb * weight[7];
    color += texture(cubeColor, (vTextureCoord + vec2(-6.0, 0.0)*tFrag)).rgb * weight[6];
    color += texture(cubeColor, (vTextureCoord + vec2(-5.0, 0.0)*tFrag)).rgb * weight[5];
    color += texture(cubeColor, (vTextureCoord + vec2(-4.0, 0.0)*tFrag)).rgb * weight[4];
    color += texture(cubeColor, (vTextureCoord + vec2(-3.0, 0.0)*tFrag)).rgb * weight[3];
    color += texture(cubeColor, (vTextureCoord + vec2(-2.0, 0.0)*tFrag)).rgb * weight[2];
    color += texture(cubeColor, (vTextureCoord + vec2(-1.0, 0.0)*tFrag)).rgb * weight[1];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, 0.0)*tFrag)).rgb * weight[0];
    color += texture(cubeColor, (vTextureCoord + vec2( 1.0, 0.0)*tFrag)).rgb * weight[1];
    color += texture(cubeColor, (vTextureCoord + vec2( 2.0, 0.0)*tFrag)).rgb * weight[2];
    color += texture(cubeColor, (vTextureCoord + vec2( 3.0, 0.0)*tFrag)).rgb * weight[3];
    color += texture(cubeColor, (vTextureCoord + vec2( 4.0, 0.0)*tFrag)).rgb * weight[4];
    color += texture(cubeColor, (vTextureCoord + vec2( 5.0, 0.0)*tFrag)).rgb * weight[5];
    color += texture(cubeColor, (vTextureCoord + vec2( 6.0, 0.0)*tFrag)).rgb * weight[6];
    color += texture(cubeColor, (vTextureCoord + vec2( 7.0, 0.0)*tFrag)).rgb * weight[7];
    color += texture(cubeColor, (vTextureCoord + vec2( 8.0, 0.0)*tFrag)).rgb * weight[8];
    color += texture(cubeColor, (vTextureCoord + vec2( 9.0, 0.0)*tFrag)).rgb * weight[9];    
    outColor = vec4(color, 1.0);        
}