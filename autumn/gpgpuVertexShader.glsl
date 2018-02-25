#version 300 es
    layout (location = 0)in vec3 position;                   
    layout (location = 1)in vec3 velocity;                                 
    layout (location = 2)in vec3 startPosition;
    out vec3 outPosition;
      void main(void){        
        gl_PointSize=50.0;           
        outPosition=position+velocity;
          if(outPosition.x>40.0 || outPosition.x<-40.0 || outPosition.y<-40.0 || outPosition.y>40.0 || outPosition.z<-40.0 || outPosition.z>40.0){
            outPosition=startPosition;
          } 
        gl_Position = vec4(outPosition, 1.0);               
      }