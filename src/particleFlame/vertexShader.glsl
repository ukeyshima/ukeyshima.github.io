#version 300 es
layout (location=0)in vec3 position;
layout (location=1)in vec3 doubleAccel;
layout (location=2)in float number;
layout (location=3)in vec3 velocity; 
layout (location=4)in float existenceFrame;
layout (location=5)in vec3 accel;
uniform float pointSize;
uniform float frame;
uniform vec2 resolution;
out vec3 outPosition;
out vec3 outVelocity;
out float outExistenceFrame;
out vec3 outAccel;
 float rand(float co){
    return fract(sin(co*32.233) * 75.545);
}
void main(void){
    vec3 p=position.xyz;
   if(p.x>1.0||p.x<-1.0||p.y>1.0){
        vec3 a=vec3(0.0);
        a.x=doubleAccel.x>0.0?(-0.0018-(rand(number*0.01)*0.0001)):(0.0018+(rand(number*0.01)*0.0001));
        a.z=doubleAccel.z>0.0?(-0.0018-(rand(number*0.03)*0.0001)):(0.0018+(rand(number*0.03)*0.0001));
        outAccel=a;
        outExistenceFrame=0.0;
        vec3 v=vec3(0.0);
        v.x=a.x<0.0?0.048-(rand(number*0.02)*0.04):-0.048+(rand(number*0.02)*0.04);
        v.y=0.03-rand(number*0.01)*0.02;
        v.z=a.z<0.0?0.048-(rand(number*0.04)*0.04):-0.048+(rand(number*0.04)*0.04);
        outVelocity=v;
        outPosition=vec3((rand(number*0.06)*2.0-1.0)*0.1,-0.8+(rand(number*0.05)*2.0-1.0)*0.1,(rand(number*0.06)*2.0-1.0)*0.1);
    }else{
        outExistenceFrame=existenceFrame+1.0;
        outAccel=accel+doubleAccel;
        outVelocity=velocity+outAccel;
        outPosition=position+outVelocity;
    }
    gl_Position=vec4(outPosition,1.0);
    gl_PointSize=pointSize*rand(number*0.1)+existenceFrame/3.0;
}