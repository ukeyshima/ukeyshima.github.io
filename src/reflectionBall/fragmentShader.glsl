#version 300 es
precision highp float;
uniform float time;
uniform vec2  resolution;
out vec4 outColor;
#define PI 3.141592
const vec3 lightPos=vec3(0.0,5.0,5.0);
const vec3 ambientColor=vec3(0.05);
const vec3 cPos=vec3(0.0,3.0,12.0);
const vec3 cDir=vec3(0.0,-.2,-1.0);
const vec3 cUp=vec3(0.0,1.0,0.0);

float sphereDistFunc(vec3 p,vec3 c,float radius){
    return length(p-c)-radius;
}
float planeDistFunc(vec3 p){
    vec3 pos=vec3(0.0,1.0,0.0);
    vec3 n=normalize(pos);
    return dot(p,n)+2.0;
}

float distFunc(vec3 p){
    float obj1,obj2,obj3,obj4,obj5;
    obj1=sphereDistFunc(p,vec3(0.0,cos(time),0.0),2.0);
    obj2=planeDistFunc(p);
    obj3=sphereDistFunc(p,vec3(5.0*(2.0+cos(1.2*time))*sin(time),-1.0,5.0*cos(time)),1.0);
    obj4=sphereDistFunc(p,vec3(5.0*(3.0+cos(1.5*time))*sin(time+PI*2.0/3.0),-1.0,5.0*cos(time+PI*2.0/3.0)),1.0);
    obj5=sphereDistFunc(p,vec3(5.0*(2.0+sin(1.7*time))*sin(time+PI*4.0/3.0),-1.0,5.0*cos(time+PI*4.0/3.0)),1.0);
    return min(min(min(min(obj1,obj2),obj3),obj4),obj5);
}

vec3 genNormal(vec3 p){
    float d=0.001;
    return normalize(vec3(
        distFunc(p+vec3(d,0.0,0.0))-distFunc(p+vec3(-d,0.0,0.0)),
        distFunc(p+vec3(0.0,d,0.0))-distFunc(p+vec3(0.0,-d,0.0)),
        distFunc(p+vec3(0.0,0.0,d))-distFunc(p+vec3(0.0,0.0,-d))
        ));
}
float genShadow(vec3 o,vec3 lightPos){
    vec3 lightVec=normalize(lightPos);
    float h=0.0;
    float c=0.001;
    float r=1.0;
    float shadowCoef=0.5;
    for(int i=0;i<30;i++){
    h=distFunc(o+lightVec*c);
    if(h<0.02)return shadowCoef;
    r=min(r,h*16.0/c);
    c+=h;
    }
    return 1.0+shadowCoef*(r-1.0);
}

vec3 getRayColor(inout vec3 ray,inout vec3 origin){
    float distance=0.0;
    float rLen=0.0;
    vec3 rPos=origin;
    vec3 color=vec3(0.62);
    vec3 normal,specular,halfLE;
    float shadow;
    float maxDist=70.0;
    for(int i=0;i<120;i++){
        distance=distFunc(rPos);
        if(abs(distance)<0.01){
             if(distance==planeDistFunc(rPos)){
                color=(mod(rPos.x,6.0)<3.0&&mod(rPos.z,6.0)<3.0 ||mod(rPos.x,6.0)>3.0&&mod(rPos.z,6.0)>3.0)?vec3(1.0):vec3(0.0);
             }else if(distance==sphereDistFunc(rPos,vec3(0.0,cos(time),0.0),2.0)){
                color=vec3(0.0,1.0,1.0);
             }else if(distance==sphereDistFunc(rPos,vec3(5.0*(2.0+cos(1.2*time))*sin(time),-1.0,5.0*cos(time)),1.0)){
                color=vec3(1.0,0.0,0.0);
            }else if(distance==sphereDistFunc(rPos,vec3(5.0*(3.0+cos(1.5*time))*sin(time+PI*2.0/3.0),-1.0,5.0*cos(time+PI*2.0/3.0)),1.0)){
                color=vec3(1.0,1.0,0.0);
            }else if(distance==sphereDistFunc(rPos,vec3(5.0*(2.0+sin(1.7*time))*sin(time+PI*4.0/3.0),-1.0,5.0*cos(time+PI*4.0/3.0)),1.0)){
                color=vec3(1.0,0.0,1.0);
            }
            normal=genNormal(rPos);
            origin=rPos+normal*0.02;
            ray=normalize(reflect(ray,normal));
            halfLE=normalize(lightPos-cDir);
            specular=vec3(pow(clamp(dot(normal,halfLE),0.0,1.0),50.0));
            shadow=genShadow(rPos+normal*0.001,lightPos);
            color=(color*vec3(clamp(dot(lightPos,normal),0.0,1.0))+specular+ambientColor)*max(0.5,shadow)+rLen/100.0*0.8;
            break;
        }
        rLen+=distance;
        rPos=origin+rLen*ray;
        if(rLen>maxDist){
            break;
        }
    }
        return color;
    
}

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);    
    const vec3 cSide=cross(cDir,cUp);
    const float targetDepth=1.0;
    vec3 ray=normalize(cSide*p.x+cUp*p.y+cDir*targetDepth);
    vec3 origin=cPos;
    vec3 destColor=vec3(0.0);
    vec3 alpha=vec3(0.7,0.7,0.67);
    for(int i=0;i<3;i++){
        destColor+=alpha*getRayColor(ray,origin);
        alpha*=0.7;
    }
    outColor=vec4(destColor,1.0);
}