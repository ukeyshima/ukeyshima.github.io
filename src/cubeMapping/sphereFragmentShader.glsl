#version 300 es   
precision highp float;   
uniform samplerCube cubeTexture;    
in vec3 vPosition;
in vec3 vNormal;
in vec3 vEyePosition;
in float vDepth;
layout (location = 0) out vec4 outColor0;
layout (location = 1) out vec4 outColor1;
void main(void){
  outColor0 = texture(cubeTexture,reflect(vPosition-vEyePosition,normalize(vNormal)));
  outColor0.w=0.6;
  outColor1 = vec4(vec3((vDepth + 1.0) / 2.0), 1.0);
}