precision mediump float;
uniform vec2 resolution;
#define PI 3.141592

vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);             
    vec3 color = step(length(p),1.0)*(0.03/length(p)+hsv2rgb(vec3(atan(p.x,p.y)/2.0/PI,length(p),1.0)));	    
    gl_FragColor=vec4(color,1.0);
}