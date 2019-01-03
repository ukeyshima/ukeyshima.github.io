#version 300 es
    precision highp float;  
    uniform sampler2D tex;  
    uniform vec2 resolution;
    uniform float frameCount;
    in vec2 vTextureCoord;
    out vec4 outColor;
    #define PI 3.141592

    const float wallReflectRatio=0.2;    
    const float floorReflectRatio=0.5;    
    const float sphereReflectRatio=0.9;
    const float boxReflectRatio=0.3;

    const vec3 backColor=vec3(0.5,0.5,0.9);
    const vec3 backCenter=vec3(0.0,3.0,3.0);
    const vec3 backSize=vec3(6.0,3.0,0.01);
    
    const vec3 floorCenter=vec3(0.0);
    const vec3 floorSize=vec3(6.0,0.01,3.0);    
    const vec3 sideColor=vec3(0.5,0.5,0.9);
    const vec3 rightCenter=vec3(6.0,3.0,0.0);
    const vec3 rightSize=vec3(0.01,3.0,3.0);
    const vec3 leftCenter=vec3(-6.0,3.0,0.0);
    const vec3 leftSize=vec3(0.01,3.0,3.0);    
    const vec3 topColor=vec3(0.5,0.5,0.9);
    const vec3 topCenter=vec3(0.0,6.0,0.0);
    const vec3 topSize=vec3(6.0,0.01,3.0);    
    const vec3 sphereColor=vec3(0.9,0.1,0.1);
    const vec3 sphereCenter=vec3(-2.0,2.0,1.0);
    const float sphereSize=2.0;    
    const vec3 boxColor=vec3(0.1,0.9,0.9);
    const vec3 boxCenter=vec3(3.0,1.0,-1.0);
    const vec3 boxSize=vec3(1.0);    
    const vec3 lightPos=vec3(0.0,3.0,-3.0);
    const vec3 cPos=vec3(0.0,3.5,-5.0);
    const vec3 cDir=vec3(0.0,-0.1,1.0);    

    float boxDistFunc(vec3 p,vec3 b){
        return length(max(abs(p)-b,0.0))-0.01;
    }            

    float sphereDistFunc(vec3 p,float s){
        return length(p)-s;
    } 

    float distFunc(vec3 p){                
        float boxd=boxDistFunc(p-boxCenter,boxSize);
        float backd=boxDistFunc(p-backCenter,backSize);
        float floord=boxDistFunc(p-floorCenter,floorSize);
        float rightd=boxDistFunc(p-rightCenter,rightSize);
        float leftd=boxDistFunc(p-leftCenter,leftSize);
        float topd=boxDistFunc(p-topCenter,topSize);
        float sphere=sphereDistFunc(p-sphereCenter,sphereSize);
        return min(min(min(min(min(min(boxd,backd),floord),rightd),leftd),topd),sphere);
    }

    vec3 genNormal(vec3 p){
        float d=0.001;
        return normalize(vec3(
            distFunc(p+vec3(d,0.0,0.0))-distFunc(p+vec3(-d,0.0,0.0)),
            distFunc(p+vec3(0.0,d,0.0))-distFunc(p+vec3(0.0,-d,0.0)),
            distFunc(p+vec3(0.0,0.0,d))-distFunc(p+vec3(0.0,0.0,-d))
        ));
    }        

    float random (vec3 p) {
        return fract(sin(dot(p,vec3(12.9898,78.233,135.1241)))* 43758.5453123);
    }
    
    vec3 random3(vec3 p){
        return fract(vec3(sin(dot(p,vec3(82.9471,67.4192,74.1231)))*48101.3838718,sin(dot(p,vec3(73.1245,93.4719,47.4910)))*86019.1284912,sin(dot(p,vec3(63.1938,48.3951,97.4131)))*84193.192481))*2.0-1.0;
    }
    
    vec3 getReflectRayColor(inout vec3 ray,inout vec3 origin,float t,inout bool hit){                
        vec3 color=vec3(1.0);        
        float distance=0.0;        
        vec3 rPos=origin;
        float maxDist=20.0;
        for(int i=0;i<100;i++){
            distance=distFunc(rPos);
            if(abs(distance)<0.01){
                vec3 normal=genNormal(rPos);                
                if(distance==boxDistFunc(rPos-boxCenter,boxSize)){
                    color=boxColor;
                    ray=random(rPos*frameCount)<boxReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*frameCount));
                }else if(distance==boxDistFunc(rPos-backCenter,backSize)){
                    color=backColor;
                    ray=random(rPos*frameCount)<wallReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*frameCount));
                }else if(distance==boxDistFunc(rPos-floorCenter,floorSize)){
                    vec3 floorColor=(mod(rPos.x,1.0)-0.5)*(mod(rPos.z,1.0)-0.5)<0.0?vec3(0.0):vec3(1.0);                                                           
                    color=floorColor;
                    ray=random(rPos*frameCount)<floorReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*frameCount));                                        
                }else if(distance==boxDistFunc(rPos-rightCenter,rightSize)){                    
                    color=sideColor;
                    ray=random(rPos*frameCount)<wallReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*frameCount));                                        
                }else if(distance==boxDistFunc(rPos-leftCenter,leftSize)){                                        
                    color=sideColor;
                    ray=random(rPos*frameCount)<wallReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*frameCount));                                        
                }else if(distance==boxDistFunc(rPos-topCenter,topSize)){                    
                    color=topColor;
                    ray=random(rPos*frameCount)<wallReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*frameCount));                                        
                }else if(distance==sphereDistFunc(rPos-sphereCenter,sphereSize)){                    
                    color=sphereColor;
                    ray=random(rPos*frameCount)<sphereReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*frameCount));                                        
                }                              
                origin=rPos+normal*0.011;                
                hit=true;
                break;
            }            
            rPos+=distance*ray;
            if(length(rPos-origin)>maxDist){
                hit=false;
                break;
            } 
        }
        return color;
    }
    
    void main(void){
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);        
        vec3 color=vec3(0.0);                
            vec3 cUp=mat3(1.0,0.0,0.0,
                        0.0,0.0,-1.0,
                        0.0,1.0,0.0)*cDir;
            vec3 cSide=cross(cDir,cUp);
            float depth=1.0;
            vec3 ray=normalize(cSide*p.x+cUp*p.y+cDir*depth);
            float distance=0.0;
            float rLen=0.0;
            vec3 rPos=cPos;                
            float maxDist=10.0;
            float alpha=0.2;
            bool hit=false;
            for(int i=0;i<7;i++){
                color+=alpha*getReflectRayColor(ray,rPos,frameCount,hit);
                alpha*0.3;
                if(!hit)break;
            }           
        color=(color+texture(tex,vec2(vTextureCoord.x,-vTextureCoord.y)).rgb*(frameCount-1.0))/frameCount;                
        outColor=vec4(color,1.0);
    }