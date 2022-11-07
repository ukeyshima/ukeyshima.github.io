#version 300 es
precision highp float;

uniform sampler2D tex;
uniform float da;
uniform float db;
uniform float f;
uniform float k;
uniform float dt;
uniform vec3 mouse;
uniform vec2 resolution;

layout(location = 0) out vec4 outColor;

vec3 laplacian(vec2 uv) {
    vec2 texelSize = 1.0 / resolution;
    vec3 sum = vec3(0.0);
    sum += texture(tex, uv).rgb * -1.0;
    sum += texture(tex, uv + vec2(-texelSize.x, 0)).rgb * 0.2;
    sum += texture(tex, uv + vec2(texelSize.x, 0)).rgb * 0.2;
    sum += texture(tex, uv + vec2(0, -texelSize.y)).rgb * 0.2;
    sum += texture(tex, uv + vec2(0, texelSize.y)).rgb * 0.2;
    sum += texture(tex, uv + vec2(-texelSize.x, -texelSize.y)).rgb * 0.05;
    sum += texture(tex, uv + vec2(-texelSize.x, texelSize.y)).rgb * 0.05;
    sum += texture(tex, uv + vec2(texelSize.x, -texelSize.y)).rgb * 0.05;
    sum += texture(tex, uv + vec2(texelSize.x, texelSize.y)).rgb * 0.05;
    return sum;
}

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 mouseUV = mouse.xy / resolution.xy;
    vec3 color = texture(tex, uv).rgb;
    vec3 l = laplacian(uv);

    float A = color.r;
    float B = color.g;

    float F = f;

    if(mouse.z > 0.0) {
        vec2 aspect = vec2(1.0, resolution.y / resolution.x);
        F *= step(0.05, length((mouseUV.xy - uv.xy) * aspect));
    }

    A = A + (da * l.r - A * B * B + F * (1.0 - A)) * dt;
    B = B + (db * l.g + A * B * B - (k + F) * B) * dt;

    color = vec3(A, B, 0.0);

    outColor = vec4(color, 1.0);
}