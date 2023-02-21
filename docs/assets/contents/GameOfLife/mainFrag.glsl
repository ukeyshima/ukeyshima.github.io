#version 300 es
precision mediump float;
precision mediump isampler2D;

uniform isampler2D tex;

layout(location = 0) out ivec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    int life = texelFetch(tex, coord, 0).r;

    int neighbourLife = 0;
    for(int x = -1; x <= 1; x++) {
        for(int y = -1; y <= 1; y++) {
            if(x == 0 && y == 0) continue;
            ivec2 neighbourCoord = coord + ivec2(x, y);
            neighbourLife += texelFetch(tex, neighbourCoord, 0).r;
        }
    }

    if(life == 1) {
        life = neighbourLife < 2 || neighbourLife > 3 ? 0 : 1;
    } else {
        life = neighbourLife == 3 ? 1 : 0;
    }

    outColor = ivec4(life, life, life, life);
}