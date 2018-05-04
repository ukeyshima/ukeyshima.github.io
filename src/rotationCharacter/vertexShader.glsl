#version 300 es
    layout (location = 0)in vec3 position;  
    layout (location = 1)in float id;                      
    uniform float time;
    out vec3 vertexColor; 
    out float useTexture0;
    out float useTexture1;
    out float useTexture2;
    out float useTexture3;
    out float useTexture4;
    out float useTexture5;
    out float useTexture6;
    out float useTexture7;
    out float useTexture8;
    out float useTexture9;
    vec3 random(float p){
        return fract(vec3(sin(p*78.233)*43758.5453123,
        sin(p*48.1933)*37171.1284818,
        sin(p*61.1241)*47191.123121));
    }
    #define PI 3.141592     
      void main(void){        
        gl_PointSize=300.0;  
        vec3 p=position;                
        useTexture0=0.0;
        useTexture1=0.0;
        useTexture2=0.0;
        useTexture3=0.0;
        useTexture4=0.0;
        useTexture5=0.0;
        useTexture6=0.0;
        useTexture7=0.0;
        useTexture8=0.0;
        useTexture9=0.0;
       if(id==0.0){
        useTexture0=1.0;
       }else if(id==1.0){
        useTexture1=1.0;
       }else if(id==2.0){
        useTexture2=1.0;
      }else if(id==3.0){
        useTexture3=1.0;
      }else if(id==4.0){
        useTexture4=1.0;
      }else if(id==5.0){
        useTexture5=1.0;
      }else if(id==6.0){
        useTexture6=1.0;
      }else if(id==7.0){
        useTexture7=1.0;
      }else if(id==8.0){
        useTexture8=1.0;
      }else if(id==9.0){
        useTexture9=1.0;
      }
        float t=clamp(pow(time,4.0),0.0,time/PI*118.0);
        p.x=0.8*cos(t+PI*2.0/10.0*id);
        p.y=0.8*sin(t+PI*2.0/10.0*id);        
        //vertexColor=random(float(id)+t);
        gl_Position = vec4(p, 1.0);               
      }