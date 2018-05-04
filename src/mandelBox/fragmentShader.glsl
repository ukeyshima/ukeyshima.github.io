#version 300 es
precision highp float;
uniform float time;
uniform vec2 resolution;
out vec4 outColor;

vec3 rotate(vec3 p, float angle, vec3 axis){
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}


float sphereDistFunc(vec3 p){
    return length(p)-1.0;
}

float mBoxDistFunc(vec3 p){
float scale =3.0;
  const int n = 10;
  vec4 q0 = vec4 (p, 1.0);
  vec4 q = q0;
  for ( int i = 0; i < n; i++ ) {
    q.xyz = clamp( q.xyz, -1.0, 1.0 ) * 2.0 - q.xyz;
    q = q * scale / clamp( dot( q.xyz, q.xyz ), 0.5, 1.0 ) + q0;
  }
  return length( q.xyz ) / abs( q.w );
}

float distFunc(vec3 p,float t){
    p=rotate(p,t,vec3(1.0,1.0,1.0));
    return mBoxDistFunc(p);
}

vec3 genNormal(vec3 p,float t){
    float d=0.001;
    return normalize(vec3(
        distFunc(p+vec3(d,0.0,0.0),t)-distFunc(p+vec3(-d,0.0,0.0),t),
        distFunc(p+vec3(0.0,d,0.0),t)-distFunc(p+vec3(0.0,-d,0.0),t),
        distFunc(p+vec3(0.0,0.0,d),t)-distFunc(p+vec3(0.0,0.0,-d),t)
        ));
}
vec3 lightPos=vec3(100.0,100.0,0.0);
vec3 cDir=normalize(vec3(0.0,0.0,1.0));
vec3 cUp=normalize(vec3(0.0,1.0,0.0));
float dipth=1.0;

void main(void){
    vec2 p=(gl_FragCoord.xy*2.0-resolution)/min(resolution.x,resolution.y);
    vec3 cPos=vec3(0.0,1.5+cos(time),0.75-sin(time));
    vec3 cSide=normalize(cross(cDir,cUp));
    vec3 ray=normalize(cSide*p.x+cUp*p.y+cDir*dipth);
    
    vec3 rPos=cPos;
    float rLen=0.0;
    float distance=0.0;
    vec3 color=vec3(242.0/255.0,242.0/255.0,232.0/255.0);

    for(float i=0.0;i<80.0;i++){
        distance=distFunc(rPos,time);
        if(abs(distance)<0.01){
            vec3 normal=genNormal(rPos,time);
            float specular=pow(clamp(dot(normal,lightPos-rPos),0.0,1.0),50.0);
            color=vec3(0.5*cos(time),0.2,0.5*sin(time))+vec3(specular)*0.7;
            break;           
        }
        rLen+=distance;
        rPos=cPos+rLen*ray;
    }
    outColor=vec4(color,1.0);
}