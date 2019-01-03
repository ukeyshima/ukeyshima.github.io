#version 300 es   
    precision highp float;   
    in float vTime;
    in float fogFactor;
    out vec4 outColor;
      void main(void){ 
        vec3 color=mix(vec3(242.0/255.0,242.0/255.0,232.0/255.0), vec3(0.1,0.0,0.0), fogFactor);        
        outColor=vec4(color,1.0);
      }