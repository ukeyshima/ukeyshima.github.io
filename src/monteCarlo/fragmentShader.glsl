#version 300 es
precision highp float; 
uniform sampler2D tex; 
in vec2 vTextureCoord;
out vec4 outColor;
    
void main(void){                 
    vec3 color=texture(tex,vec2(vTextureCoord.x,-vTextureCoord.y)).rgb;                    
    outColor=vec4(color,1.0);
}