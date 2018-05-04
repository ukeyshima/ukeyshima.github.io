#version 300 es   
    precision highp float;   
    uniform samplerCube cubeTexture;    
    in vec3 vPosition;
    in vec3 vNormal;
    in vec3 vEyePosition;
    out vec4 outColor;
      void main(void){                    
        outColor=texture(cubeTexture,reflect(vPosition-vEyePosition,normalize(vNormal)));
        outColor.w=0.5;     
      }