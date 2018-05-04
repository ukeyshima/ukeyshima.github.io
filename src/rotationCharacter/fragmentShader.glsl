#version 300 es   
  precision highp float;  
  uniform sampler2D texture0;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform sampler2D texture3;
  uniform sampler2D texture4;
  uniform sampler2D texture5;
  uniform sampler2D texture6;
  uniform sampler2D texture7;
  uniform sampler2D texture8;
  uniform sampler2D texture9;        
  in float useTexture0;
  in float useTexture1;
  in float useTexture2;
  in float useTexture3;
  in float useTexture4;
  in float useTexture5;
  in float useTexture6;
  in float useTexture7;
  in float useTexture8;
  in float useTexture9;
  in vec3 vertexColor;
 out vec4 outColor;
 void main(void){ 
   vec4 color=vec4(0.0);
   if(useTexture0==1.0){
    color = texture(texture0, gl_PointCoord);
   }else if(useTexture1==1.0){
     color = texture(texture1, gl_PointCoord);
   }else if(useTexture2==1.0){
     color = texture(texture2, gl_PointCoord);
   }else if(useTexture3==1.0){
     color = texture(texture3, gl_PointCoord);
   }else if(useTexture4==1.0){
     color = texture(texture4, gl_PointCoord);
   }else if(useTexture5==1.0){
     color = texture(texture5, gl_PointCoord);
   }else if(useTexture6==1.0){
     color = texture(texture6, gl_PointCoord);
   }else if(useTexture7==1.0){
     color = texture(texture7, gl_PointCoord);
   }else if(useTexture8==1.0){
     color = texture(texture8, gl_PointCoord);
   }else if(useTexture9==1.0){
     color = texture(texture9, gl_PointCoord);
   }
   if(length(color.xyz)>0.1){
     color.w=0.0;
   }else{
    color.w=0.7;
   }
   outColor=vec4(color.xyz+vertexColor,color.w);  
 }