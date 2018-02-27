#version 300 es
    precision mediump float;    
    uniform vec2 resolution; 
    uniform float time;    
    uniform sampler2D tex;
    uniform int useTexture;
    uniform float count;
    out vec4 outColor;
    in vec2 vTextureCoord;
    #define PI 3.141592

    float boxDistFunc(vec3 p,vec3 b){
        return length(max(abs(p)-b,0.0))-0.01;
    }               
    float sphereDistFunc(vec3 p,float s){
        return length(p)-s;
    } 
    float distFunc(vec3 p){                
        float boxd=boxDistFunc(p-vec3(1.0,0.5,-2.0),vec3(0.5,0.5,0.5));
        float backd=boxDistFunc(p-vec3(0.0,3.0,3.0),vec3(3.0,3.0,0.01));
        float floord=boxDistFunc(p-vec3(0.0,0.0,0.0),vec3(3.0,0.01,3.0));
        float rightd=boxDistFunc(p-vec3(3.0,3.0,0.0),vec3(0.01,3.0,3.0));
        float leftd=boxDistFunc(p-vec3(-3.0,3.0,0.0),vec3(0.01,3.0,3.0));
        float topd=boxDistFunc(p-vec3(0.0,6.0,0.0),vec3(3.0,0.01,3.0));
        float sphere=sphereDistFunc(p-vec3(-1.0,1.0,1.0),1.0);
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

    float random (vec3 p) {
        return fract(sin(dot(p,vec3(12.9898,78.233,135.1241)))* 43758.5453123);
    }
    
    vec3 random3(vec3 p){
        return fract(vec3(sin(dot(p,vec3(82.9471,67.4192,74.1231)))*48101.3838718,sin(dot(p,vec3(73.1245,93.4719,47.4910)))*86019.1284912,sin(dot(p,vec3(63.1938,48.3951,97.4131)))*84193.192481))*2.0-1.0;
    }
    vec3 boxColor=vec3(0.7,0.3,0.7);
    float boxReflectRatio=0.3;
    vec3 backColor=vec3(0.9,0.0,0.0);
    float backReflectRatio=0.3;
    vec3 floorColor;
    float floorReflectRatio=0.5;
    vec3 sideColor=vec3(0.0,1.0,0.0);
    float sideReflectRatio=0.3;
    vec3 topColor=vec3(0.0,0.0,1.0);
    float topReflectRatio=0.3;
    vec3 sphereColor=vec3(1.0);
    float sphereReflectRatio=0.9;
    vec3 lightPos=vec3(0.0,3.0,-3.0);        
    vec3 cPos=vec3(0.0,4.0,-5.0);
    vec3 cDir=vec3(0.0,-0.2,1.0);    
    vec3 getReflectRayColor(inout vec3 ray,inout vec3 origin,float t,inout bool hit){                
        vec3 color=vec3(0.0);        
        float distance=0.0;
        float rLen=0.0;
        vec3 rPos=origin;
        float maxDist=10.0;
        for(int i=0;i<100;i++){
            distance=distFunc(rPos);
            if(abs(distance)<0.01){
                vec3 normal=genNormal(rPos);
                /*vec3 halfLE=normalize(lightPos-cDir);
                vec3 specular=vec3(pow(clamp(dot(normal,halfLE),0.0,1.0),10.0));
                float shadow=genShadow(rPos+normal*0.001,lightPos);*/
                if(distance==boxDistFunc(rPos-vec3(1.0,0.5,-2.0),vec3(0.5,0.5,0.5))){                           
                    //color=(boxColor*vec3(clamp(dot(lightPos,normal),0.0,1.0))+specular)*max(0.9,shadow);                      
                    color=boxColor;
                    ray=random(rPos*time)<boxReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*time));                                        
                }else if(distance==boxDistFunc(rPos-vec3(0.0,3.0,3.0),vec3(3.0,3.0,0.01))){                    
                    //color=(backColor*vec3(clamp(dot(lightPos,normal),0.0,1.0))+specular)*max(0.9,shadow);                                          
                    color=backColor;
                    ray=random(rPos*time)<backReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*time));                    
                }else if(distance==boxDistFunc(rPos-vec3(0.0,0.0,0.0),vec3(3.0,0.01,3.0))){
                    floorColor=(mod(rPos.x,1.0)-0.5)*(mod(rPos.z,1.0)-0.5)<0.0?vec3(0.0):vec3(1.0);
                    //color=(floorColor*vec3(clamp(dot(lightPos,normal),0.0,1.0))+specular)*max(0.9,shadow);                                          
                    color=floorColor;
                    ray=random(rPos*time)<floorReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*time));                    
                }else if(distance==boxDistFunc(rPos-vec3(3.0,3.0,0.0),vec3(0.01,3.0,3.0))){
                    //color=(sideColor*vec3(clamp(dot(lightPos,normal),0.0,1.0))+specular)*max(0.9,shadow);                                          
                    color=sideColor;
                    ray=random(rPos*time)<sideReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*time));                    
                }else if(distance==boxDistFunc(rPos-vec3(-3.0,3.0,0.0),vec3(0.01,3.0,3.0))){                    
                    //color=(sideColor*vec3(clamp(dot(lightPos,normal),0.0,1.0))+specular)*max(0.9,shadow);                                          
                    color=sideColor;
                    ray=random(rPos*time)<sideReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*time));                    
                }else if(distance==boxDistFunc(rPos-vec3(0.0,6.0,0.0),vec3(3.0,0.01,3.0))){
                    //color=(topColor*vec3(clamp(dot(lightPos,normal),0.0,1.0))+specular)*max(0.9,shadow);                                          
                    color=topColor;
                    ray=random(rPos*time)<topReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*time));                    
                }else if(distance==sphereDistFunc(rPos-vec3(-1.0,1.0,1.0),1.0)){
                    //color=(sphereColor*vec3(clamp(dot(lightPos,normal),0.0,1.0))+specular)*max(0.9,shadow);                                          
                    color=sphereColor;
                    ray=random(rPos*time)<sphereReflectRatio?normalize(reflect(ray,normal)):normalize(random3(rPos*time));                    
                }               
               // ray=normalize(reflect(ray,normal));               
                origin=rPos+normal*0.011;                
                hit=true;
                break;
            }
            rLen += distance;
            rPos=origin+rLen*ray;
            if(rLen>maxDist){
                hit=false;
                break;
            } 
        }
        return color;
    }
    
    void main(void){
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);        
        vec3 color=vec3(0.0);        
        if(count!=0.0 && !bool(useTexture)){            
            color=texture(tex,vec2(vTextureCoord.x,-vTextureCoord.y)).rgb;            
        }else{             
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
                color+=alpha*getReflectRayColor(ray,rPos,time,hit);
                alpha*0.3;
                if(!hit)break;
            } 
            if(bool(useTexture)){
                color=(color+texture(tex,vec2(vTextureCoord.x,-vTextureCoord.y)).rgb*(count-1.0))/count;                
            }
        }            
        outColor=vec4(color,1.0);
    }