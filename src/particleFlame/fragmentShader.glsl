#version 300 es
    precision highp float;
    uniform vec2 resolution;
    uniform float frame;
    uniform sampler2D tex;
    out vec4 outColor;
    in float outExistenceFrame;
    in vec3 outPosition;
float rand(float co){
    return fract(sin(co*78.233) * 435.5453);
}
void main(void){
    vec2 p=(gl_FragCoord.xy*2.0-resolution)/min(resolution.x,resolution.y);
    vec4 smpColor=texture(tex, gl_PointCoord);
    smpColor.g=4.0*sqrt(0.001-pow(outPosition.x,2.0)*pow(outPosition.y+0.9,2.0));
    smpColor*=outExistenceFrame/20.0;
    smpColor.a*=1.0-outExistenceFrame/50.0;
    smpColor.a*=4.0*sqrt(0.5-pow(outPosition.x,2.0));
    if(smpColor.a==0.0)discard;
    else outColor=smpColor+rand(p.y*frame)*0.2;
}