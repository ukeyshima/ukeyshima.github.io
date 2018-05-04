#version 300 es
    precision highp float;
    uniform float time;
    uniform vec2  resolution;
    out vec4 outColor;
    float random(vec2 p){
        return fract(sin(dot(p.xy,vec2(12.9898,78.233)))*43758.5453123)*2.0-1.0;
    }
    float boxDistFunc(vec3 p,vec3 b,vec3 c){
        return length(max(abs(p-c)-b,0.0));
    }
    float floorDistFunc(vec3 p){
        vec3 q=p;
        q.xz=mod(p.xz,1.0)-0.5;
        return boxDistFunc(q,vec3(0.4,abs(random(floor(p.xz)))+abs(2.0*floor(p.z/2.0)*sin(time*1.3*random(floor(p.xz)))),0.4),vec3(0.0,0.0,0.0));
    }
    float distFunc(vec3 p){
        return floorDistFunc(p);
    }
    vec3 genNormal(vec3 p){
        float d=0.001;
        return normalize(vec3(
            distFunc(p+vec3(d,0.0,0.0))-distFunc(p+vec3(-d,0.0,0.0)),
            distFunc(p+vec3(0.0,d,0.0))-distFunc(p+vec3(0.0,-d,0.0)),
            distFunc(p+vec3(0.0,0.0,d))-distFunc(p+vec3(0.0,0.0,-d))
            ));
    }
    vec3 getRayColor(inout vec3 ray,inout vec3 origin,out bool hit){
        float distance=0.0;
        float rLen=0.0;
        vec3 rPos=origin;
        vec3 color=vec3(1.0);
        float maxDist=30.0;
        float marchCount=0.0;
        for(int i=0;i<100;i++){
            distance=distFunc(rPos);
            if(abs(distance)<0.01){
                if(distance==floorDistFunc(rPos)){
                    color=vec3(0.7,0.3,0.7);
                }
                break;
            }
            rLen += min(min((step(0.0,ray.x)-fract(rPos.x))/ray.x, (step(0.0,ray.z)-fract(rPos.z))/ray.z)+0.01,distance);
            rPos=origin+rLen*ray;
            if(rLen>maxDist){
                break;
            }
            marchCount++;
        }
        hit=false;
    if(abs(distance)<0.01){
        color+=marchCount/100.0/pow(rLen,2.0);
        vec3 normal=genNormal(rPos);
        origin=rPos+normal*0.02;
        ray=normalize(reflect(ray,normal));
        hit=true;
    }
        return color;
    }
    vec3 pixelColor(vec2 p){
        vec3 cPos=vec3(0.0,1.5+time,time);
        vec3 cDir=vec3(0.0,0.0,1.0);
        vec3 cUp=vec3(0.0,1.0,0.0);
        vec3 cSide=cross(cDir,cUp);
        float depth=1.0;
        vec3 ray=normalize(cSide*p.x+cUp*p.y+cDir*depth);
        vec3 origin=cPos;
        vec3 color=vec3(0.0);
        vec3 alpha=vec3(242.0/255.0,242.0/255.0,232.0/255.0);
        bool hit;
        for(int i=0;i<3;i++){
            color+=alpha*getRayColor(ray,origin,hit);
            alpha*=0.3;
            if(!hit)break;
        }
       return color;
    }
    
    void main(void){
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        vec3 color=pixelColor(p);
        outColor=vec4(color,1.0);
    }