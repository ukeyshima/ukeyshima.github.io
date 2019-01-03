precision mediump float;
uniform vec2 resolution;
uniform vec3 color;
#define PI 3.141592

void main(void){
    vec2 p = (gl_FragCoord.xy ) / resolution.x;         
    vec3 c=(mod(p.x,0.1)-0.05)*(mod(p.y,0.1)-0.05)<0.0?vec3(1.0):vec3(0.5);    
    gl_FragColor=vec4(length(color)<0.01?c*0.2:c*color,p.x);
}