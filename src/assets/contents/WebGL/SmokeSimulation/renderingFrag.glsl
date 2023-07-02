#version 300 es
precision lowp float;

uniform sampler2D tex;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    float c = texelFetch(tex, coord, 0).x;

    float c1 = clamp(c * 4.0, 0.0, 1.0);
    float c2 = clamp(c * 4.0, 1.0, 2.0) - 1.0;
    float c3 = clamp(c * 4.0, 2.0, 3.0) - 2.0;
    float c4 = clamp(c * 4.0, 3.0, 4.0) - 3.0;

    vec3 color1 = vec3(0.0, 0.0, 0.0);
    vec3 color2 = vec3(0.8, 0.8, 0.8);
    vec3 color3 = vec3(1.0, 0.0, 0.0);
    vec3 color4 = vec3(1.0, 0.8, 0.0);
    vec3 color5 = vec3(0.0, 0.2, 0.9);

    vec3 color = color1;
    color = mix(color, color2, c1);
    color = mix(color, color3, c2);
    color = mix(color, color4, c3);
    color = mix(color, color5, c4);

    outColor = vec4(color, 1.0);
}