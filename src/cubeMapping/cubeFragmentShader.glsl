#version 300 es
precision mediump float;
uniform samplerCube cubeTexture;
in vec3 vPosition;
in float vDepth;
layout (location = 0) out vec4 outColor0;
layout (location = 1) out vec4 outColor1;
void main(void){
    outColor0=texture(cubeTexture,vPosition);       
    outColor1 = vec4(vec3((vDepth + 1.0) / 2.0), 1.0);
}