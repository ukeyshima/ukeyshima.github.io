#version 300 es
precision highp float;
precision highp usampler2D;

uniform vec2 resolution;
uniform vec2 indexResolution;
uniform int instanceNum;
uniform usampler2D indexTexture;

layout(location = 0) out ivec4 outGridIndex;

#define FLOAT_MAX float(0xffffffffu)

ivec2 getCoord(int instanceIndex) {
  return ivec2(instanceIndex % int(indexResolution.x), instanceIndex / int(indexResolution.x));
}

int getGridIndex(int instanceIndex) {
  ivec2 coord = getCoord(instanceIndex);
  return int(texelFetch(indexTexture, coord, 0).y);
}

int getGridIndex(ivec2 coord) {
  return coord.x + coord.y * int(resolution.x);
}

int binarySearchMin(int target, int from, int to) {
  while(from < to) {
    int middle = (from + to) / 2;
    int gridIndex = getGridIndex(middle);

    from = target <= gridIndex ? from : middle + 1;
    to = target <= gridIndex ? middle : to;
  }

  return getGridIndex(from) == target ? from : -1;
}

int binarySearchMax(int target, int from, int to) {
  while(from < to) {
    int middle = (from + to) / 2;
    int gridIndex = getGridIndex(middle);

    from = target >= gridIndex ? middle + 1 : from;
    to = target >= gridIndex ? to : middle;
  }

  return getGridIndex(from - 1) == target ? from - 1 : 1;
}

ivec2 binarySearchRange(int target, int from, int to) {
  from = binarySearchMin(target, from, to);
  to = from == -1 ? -1 : binarySearchMax(target, from, to);
  return ivec2(from, to);
}

void main(void) {
  ivec2 coord = ivec2(gl_FragCoord.xy);
  int gridIndex = getGridIndex(coord);
  ivec2 indexRange = binarySearchRange(gridIndex, 0, instanceNum + 1);

  outGridIndex = ivec4(indexRange.x, indexRange.y, 0, 0);
}