#version 300 es
precision mediump float;
uniform samplerCube cubeTexture;
in vec3 vPosition;
out vec4 outColor;
void main(void){
    outColor=texture(cubeTexture,vPosition);    
}