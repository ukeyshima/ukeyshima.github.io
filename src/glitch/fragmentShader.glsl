precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D tex;
#define PI 3.141592

float random(vec2 p){
    float q = dot(p,vec2(127.1,311.7));
    return fract(sin(q)*437.53);
}
vec4 glitch(vec2 p){
    float b=0.5;
    vec4 c=texture2D(tex,p);
   float t=time-mod(time,0.3);
    vec2 q=p-mod(p,b);
    for(float i=0.0;i<15.0;i++){
       if(random(q)>0.3){
           q=p-mod(p,b);
       }else{
           break;
       }
        b*=random(vec2(mod(time,1.5)))<0.3?1.0:clamp(sin(t/10.0-5.5),0.65-random(vec2(t/10.0-5.5)),0.65+random(vec2(t/10.0-5.5)));
      // b*=0.65;
    }
    c.a-=random(vec2(mod(time,1.5)))<0.3?0.0:0.3*random(q);
    c.rgb+=random(vec2(mod(time,1.5)))<0.3?vec3(0.0):vec3(random(q),random(vec2(q.y,0.0)),random(vec2(0.0,q.x)));
    c.rgb-=random(vec2(mod(time,1.5)))<0.3 && random(q)<0.01 ? vec3(0.0):texture2D(tex,p+vec2(random(q),0.0)).rgb;
    c.xyz-=random(vec2(mod(time,1.5)))<0.3?vec3(0.0):vec3(0.3*random(vec2(0.0,p.y+time/10.0)));
    c.xyz-=random(vec2(0.0,p.y-time/5.0-mod(p.y-time/5.0,0.02)))>0.9?texture2D(tex,p+vec2(0.0,random(q))).rgb:vec3(0.0);
    return c;
}
void main(void){
    vec2 p=vec2(gl_FragCoord.x/resolution.x,-gl_FragCoord.y/resolution.y);
    vec4 color=glitch(p);
    gl_FragColor = color;
}