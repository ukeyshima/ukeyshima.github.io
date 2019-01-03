#version 300 es
precision highp float;
uniform sampler2D sphereColor;
uniform sampler2D sphereDepth;
uniform sampler2D cubeColor;
uniform sampler2D cubeDepth;
uniform vec2 resolution;
uniform float weight[10];
out vec4 outColor;
in vec2 vTextureCoord;
void main(void){     
    vec2 tFrag = 1.0 / resolution;   
    vec3  color = vec3(0.0);
    float cube_depth = texture(cubeDepth,vTextureCoord).r;
    float sphere_depth = texture(cubeDepth,vec2(vTextureCoord.x,1.0-vTextureCoord.y)).r;
    if(length(texture(sphereColor,vec2(vTextureCoord.x,1.0-vTextureCoord.y)).xyz)<0.01)sphere_depth=1000.0;
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, -9.0)*tFrag)).rgb * weight[9];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, -8.0)*tFrag)).rgb * weight[8];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, -7.0)*tFrag)).rgb * weight[7];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, -6.0)*tFrag)).rgb * weight[6];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, -5.0)*tFrag)).rgb * weight[5];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, -4.0)*tFrag)).rgb * weight[4];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, -3.0)*tFrag)).rgb * weight[3];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, -2.0)*tFrag)).rgb * weight[2];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, -1.0)*tFrag)).rgb * weight[1];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, 0.0)*tFrag)).rgb * weight[0];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, 1.0)*tFrag)).rgb * weight[1];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, 2.0)*tFrag)).rgb * weight[2];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, 3.0)*tFrag)).rgb * weight[3];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, 4.0)*tFrag)).rgb * weight[4];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, 5.0)*tFrag)).rgb * weight[5];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, 6.0)*tFrag)).rgb * weight[6];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, 7.0)*tFrag)).rgb * weight[7];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, 8.0)*tFrag)).rgb * weight[8];
    color += texture(cubeColor, (vTextureCoord + vec2( 0.0, 9.0)*tFrag)).rgb * weight[9];       
     if(sphere_depth > cube_depth){
         outColor = vec4(color, 1.0);                
     }else{
         outColor=mix(texture(sphereColor,vec2(vTextureCoord.x,1.0-vTextureCoord.y)),vec4(color,1.0),0.4);
     }    
}