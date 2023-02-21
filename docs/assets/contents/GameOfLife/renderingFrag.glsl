#version 300 es
precision mediump float;
precision mediump isampler2D;

uniform isampler2D tex;
uniform vec2 resolution;

layout(location = 0) out vec4 outColor;

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution;
    float c = float(texture(tex, uv));
    outColor = vec4(c, c, c, 1.0);
}