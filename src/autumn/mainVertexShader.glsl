#version 300 es
  layout (location = 0)in vec3 position;                     
  layout (location = 1)in vec3 offset;     
  uniform vec2 resolution;
  uniform float time;
  out float vTime;
  out float fogFactor;
  #define PI 3.141592

  const mat4 identity=mat4(
    1.0,0.0,0.0,0.0,
    0.0,1.0,0.0,0.0,
    0.0,0.0,1.0,0.0,
    0.0,0.0,0.0,1.0
  );

  mat4 translate(mat4 m,vec3 v){
    return mat4(
      m[0][0],m[0][1],m[0][2],m[0][3],
      m[1][0],m[1][1],m[1][2],m[1][3],
      m[2][0],m[2][1],m[2][2],m[2][3],
      m[0][0]*v.x+m[1][0]*v.y+m[2][0]*v.z+m[3][0],
      m[0][1]*v.x+m[1][1]*v.y+m[2][1]*v.z+m[3][1],
      m[0][2]*v.x+m[1][2]*v.y+m[2][2]*v.z+m[3][2],
      m[0][3]*v.x+m[1][3]*v.y+m[2][3]*v.z+m[3][3]
    );
  }

  mat4 rotate(mat4 mat, float angle, vec3 axis){
    mat4 dest;
    if(length(axis)==0.0){return identity;}
    axis=normalize(axis);
    float d = sin(angle);
    float e = cos(angle);
    float f = 1.0 - e;
    float g = mat[0][0];
    float h = mat[0][1];
    float i = mat[0][2];
    float j = mat[0][3];
    float k = mat[1][0];
    float l = mat[1][1];
    float m = mat[1][2];
    float n = mat[1][3];
    float o = mat[2][0];
    float p = mat[2][1];
    float q = mat[2][2];
    float r = mat[2][3];
    float s = axis.x * axis.x * f + e;
    float t = axis.y * axis.x * f + axis.z * d;
    float u = axis.z * axis.x * f - axis.y * d;
    float v = axis.x * axis.y * f - axis.z * d;
    float w = axis.y * axis.y * f + e;
    float x = axis.z * axis.y * f + axis.x * d;
    float y = axis.x * axis.z * f + axis.y * d;
    float z = axis.y * axis.z * f - axis.x * d;
    float A = axis.z * axis.z * f + e;
    if(angle != 0.0){
      dest[3][0] = mat[3][0]; dest[3][1] = mat[3][1];
      dest[3][2] = mat[3][2]; dest[3][3] = mat[3][3];        
    } else {
      dest = mat;
    }
    dest[0][0]  = g * s + k * t + o * u;
    dest[0][1]  = h * s + l * t + p * u;
    dest[0][2]  = i * s + m * t + q * u;
    dest[0][3]  = j * s + n * t + r * u;
    dest[1][0]  = g * v + k * w + o * x;
    dest[1][1]  = h * v + l * w + p * x;
    dest[1][2]  = i * v + m * w + q * x;
    dest[1][3]  = j * v + n * w + r * x;
    dest[2][0]  = g * y + k * z + o * A;
    dest[2][1]  = h * y + l * z + p * A;
    dest[2][2] = i * y + m * z + q * A;
    dest[2][3] = j * y + n * z + r * A;
    return dest;
    }
  mat4 scale(mat4 mat, vec3 vec){
    return mat4(
      mat[0][0]*vec.x,mat[0][1]*vec.x,mat[0][2]*vec.x,mat[0][3]*vec.x,
      mat[1][0]*vec.y,mat[1][1]*vec.y,mat[1][2]*vec.y,mat[1][3]*vec.y,
      mat[2][0]*vec.z,mat[2][1]*vec.z,mat[2][2]*vec.z,mat[2][3]*vec.z,
      mat[3][0],mat[3][1],mat[3][2],mat[3][3]
    );
  }
  mat4 lookAt(vec3 eye, vec3 center, vec3 up){
    vec3 z=eye-center;
    if(z==vec3(0.0)){return identity;}    
    z = normalize(z);
    vec3 x=vec3(up.y*z.z-up.z*z.y,up.z*z.x-up.x*z.z,up.x*z.y-up.y*z.x);
    x=length(x)==0.0?vec3(0.0):normalize(x);
    vec3 y=vec3(z.y*x.z-z.z*x.y,z.z*x.x-z.x*x.z,z.x*x.y-z.y*x.x);
    y=length(y)==0.0?vec3(0.0):normalize(y);
    return mat4(x.x,y.x,z.x,0.0,
                x.y,y.y,z.y,0.0,
                x.z,y.z,z.z,0.0,
                -dot(x,eye),-dot(y,eye),-dot(z,eye),1.0);
  }

  mat4 perspective(float fovy, float aspect, float near, float far){
    float t = near * tan(fovy * PI / 360.0);
    float r = t * aspect;
    float a = r * 2.0;
    float b = t * 2.0;
    float c = far - near;
    mat4 dest=mat4(
      near*2.0/a,0.0,0.0,0.0,
      0.0,near*2.0/b,0.0,0.0,
      0.0,0.0,-(far+near)/c,-1.0,
      0.0,0.0,-(far*near*2.0)/c,0.0
    );
    return dest;
  }

  const float near = 0.1;
  const float far  = 40.0;
  const float linerDepth = 1.0 / (far - near);

    void main(void){               
      vTime=time;
      vec3 p=position+offset;
      const vec3 eyePosition=vec3(0.0,0.0,0.0);
      mat4 mMatrix=identity;   
      mMatrix=translate(mMatrix,position+offset);
      mMatrix=rotate(mMatrix,time,vec3(1.0,0.0,1.0));     
      mMatrix=translate(mMatrix,-position-offset);
      mat4 vMatrix=lookAt(eyePosition,vec3(0.0,0.0,0.0),vec3(0.0,1.0,0.0));
      mat4 pMatrix=perspective(90.0,resolution.x/resolution.y,0.1,1000.0);
      mat4 mvpMatrix=pMatrix*vMatrix*mMatrix;       
      vec3 pos = (mMatrix * vec4(p, 1.0)).xyz;
      float linerPos = length(eyePosition - pos) * linerDepth;
      fogFactor = clamp((1.0 - linerPos) / (1.0 - 0.5), 0.0, 1.0);
      gl_Position =mvpMatrix*vec4(p, 1.0);               
    }