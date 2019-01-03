import React from "react";
import gpgpuVert from "./gpgpuVertexShader.glsl";
import gpgpuFrag from "./gpgpuFragmentShader.glsl";
import cubeVert from "./cubeVertexShader.glsl";
import cubeFrag from "./cubeFragmentShader.glsl";
import sphereVert from "./sphereVertexShader.glsl";
import sphereFrag from "./sphereFragmentShader.glsl";
import horiGaussVert from "./horizontalGaussianFilterVertexShader.glsl";
import horiGaussFrag from "./horizontalGaussianFilterFragmentShader.glsl";
import vertGaussVert from "./verticalGaussianFilterVertexShader.glsl";
import vertGaussFrag from "./verticalGaussianFilterFragmentShader.glsl";
import posx from "./posx.jpg";
import posy from "./posy.jpg";
import posz from "./posz.jpg";
import negx from "./negx.jpg";
import negy from "./negy.jpg";
import negz from "./negz.jpg";
const glsl = [
  gpgpuVert(),
  gpgpuFrag(),
  cubeVert(),
  cubeFrag(),
  sphereVert(),
  sphereFrag(),
  horiGaussVert(),
  horiGaussFrag(),
  vertGaussVert(),
  vertGaussFrag()
];
const cubeSource = [posx, posy, posz, negx, negy, negz];

const webGLStart = (canvas, gl, shader) => {
  const create_program = (vs, fs, isGpgpuProgram) => {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    if (isGpgpuProgram) gl.transformFeedbackVaryings(program, ["outPosition"], gl.SEPARATE_ATTRIBS);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program); return program;
    } else {
      return null;
    }
  };
  const create_shader = (text, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, text);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      alert(gl.getShaderInfoLog(shader));
      console.log(gl.getShaderInfoLog(shader));
    }
  };
  let cubeTexture;
  const create_cube_texture = source => {
    const target = [
      gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
    ];
    const img = [];
    const cubeTextureLoaded = [];
    for (let i = 0; i < 6; i++) {
      img[i] = new Image();
      img[i].src = source[i];
      img[i].onload = () => {
        cubeTextureLoaded[i] = true;
        if (cubeTextureLoaded[0] && cubeTextureLoaded[1] && cubeTextureLoaded[2] && cubeTextureLoaded[3] && cubeTextureLoaded[4] && cubeTextureLoaded[5]) {
          genelate_cubeMap();
        }
      };
    }
    const genelate_cubeMap = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
      for (let j = 0; j < 6; j++) {
        gl.texImage2D(target[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
      }
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      cubeTexture = tex;
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    };
  };
  const create_framebuffer_MRT = (width, height, count) => {
    const frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    const fTextures = [];
    for (let i = 0; i < count; i++) {
      fTextures[i] = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, fTextures[i]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, fTextures[i], 0);
    }

    const depthRenderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { f: frameBuffer, d: depthRenderBuffer, t: fTextures };
  };

  const gpgpuProgram = create_program(
    create_shader(shader[0], gl.VERTEX_SHADER),
    create_shader(shader[1], gl.FRAGMENT_SHADER),
    true
  );
  const gpgpuAttLocation = [];
  const gpgpuAttStride = [];
  const particleNum = 100;
  const position = new Array(particleNum * 3).fill(0).map((e, i, a) => {
    if (i % 3 == 0) {
      return Math.random() * 70.0 - 35.0;
    } else if (i % 3 == 1) {
      return -Math.random() * 25.0 - 50;
    } else {
      return Math.random() * 70.0 - 35.0;
    }
  });
  gpgpuAttLocation[0] = gl.getAttribLocation(gpgpuProgram, "position");
  gpgpuAttStride[0] = 3;
  const velocity = new Array(particleNum * 3).fill(0).map((e, i, a) => {
    if (i % 3 == 0) {
      return 0.0;
    } else if (i % 3 == 1) {
      return Math.random() * 0.1;
    } else {
      return 0.0;
    }
  });
  gpgpuAttLocation[1] = gl.getAttribLocation(gpgpuProgram, "velocity");
  gpgpuAttStride[1] = 3;
  const startPosition = [].concat(position);
  gpgpuAttLocation[2] = gl.getAttribLocation(gpgpuProgram, "startPosition");
  gpgpuAttStride[2] = 3;

  const feedback = [gl.createBuffer(), gl.createBuffer()];
  const transformFeedback = gl.createTransformFeedback();
  const vboList = [position, velocity, startPosition];

  const gpgpuVaos = [];
  gpgpuVaos[0] = gl.createVertexArray();
  gl.bindVertexArray(gpgpuVaos[0]);
  gl.bindBuffer(gl.ARRAY_BUFFER, feedback[0]);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[0]), gl.DYNAMIC_COPY);
  gl.enableVertexAttribArray(gpgpuAttLocation[0]);
  gl.vertexAttribPointer(gpgpuAttLocation[0], gpgpuAttStride[0], gl.FLOAT, false, 0, 0);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(gpgpuAttLocation[1]);
  gl.vertexAttribPointer(gpgpuAttLocation[1], gpgpuAttStride[1], gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[2]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(gpgpuAttLocation[2]);
  gl.vertexAttribPointer(gpgpuAttLocation[2], gpgpuAttStride[2], gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

  gpgpuVaos[1] = gl.createVertexArray();
  gl.bindVertexArray(gpgpuVaos[1]);
  gl.bindBuffer(gl.ARRAY_BUFFER, feedback[1]);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[0]), gl.DYNAMIC_COPY);
  gl.enableVertexAttribArray(gpgpuAttLocation[0]);
  gl.vertexAttribPointer(gpgpuAttLocation[0], gpgpuAttStride[0], gl.FLOAT, false, 0, 0);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(gpgpuAttLocation[1]);
  gl.vertexAttribPointer(gpgpuAttLocation[1], gpgpuAttStride[1], gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[2]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(gpgpuAttLocation[2]);
  gl.vertexAttribPointer(gpgpuAttLocation[2], gpgpuAttStride[2], gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[1]);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

  const cubeProgram = create_program(
    create_shader(shader[2], gl.VERTEX_SHADER),
    create_shader(shader[3], gl.FRAGMENT_SHADER),
    false
  );

  const cubeUniLocation = [];
  cubeUniLocation[0] = gl.getUniformLocation(cubeProgram, "cubeTexture");
  cubeUniLocation[1] = gl.getUniformLocation(cubeProgram, "resolution");
  cubeUniLocation[2] = gl.getUniformLocation(cubeProgram, "eyePosition");
  cubeUniLocation[3] = gl.getUniformLocation(cubeProgram, "viewPoint");
  const cube = side => {
    const hs = side * 0.5;
    const pos = [
      -hs, -hs, hs, hs,
      -hs, hs, hs, hs,
      hs, -hs, hs, hs,
      -hs, -hs, -hs, -hs,
      hs, -hs, hs, hs,
      -hs, hs, -hs, -hs,
      -hs, hs, -hs, -hs,
      hs, hs, hs, hs,
      hs, hs, hs, -hs,
      -hs, -hs, -hs, hs,
      -hs, -hs, hs, -hs,
      hs, -hs, -hs, hs,
      hs, -hs, -hs, hs,
      hs, -hs, hs, hs,
      hs, hs, -hs, hs,
      -hs, -hs, -hs, -hs,
      -hs, hs, -hs, hs,
      hs, -hs, hs, -hs
    ];
    const nor = [
      -1.0, -1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0, 1.0,
      1.0, -1.0, 1.0, 1.0,
      -1.0, -1.0, -1.0, -1.0,
      1.0, -1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0, -1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, -1.0,
      -1.0, -1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0, -1.0,
      1.0, -1.0, -1.0, 1.0,
      1.0, -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0, 1.0,
      1.0, 1.0, -1.0, 1.0,
      -1.0, -1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0, 1.0,
      1.0, -1.0, 1.0, -1.0
    ];

    const idx = [
      0, 1, 2, 0,
      2, 3, 4, 5,
      6, 4, 6, 7,
      8, 9, 10, 8,
      10, 11, 12, 13,
      14, 12, 14, 15,
      16, 17, 18, 16,
      18, 19, 20, 21,
      22, 20, 22, 23
    ];
    return { p: pos, n: nor, i: idx };
  };

  const cubeAttribute = cube(2.0);

  const cubeAttLocation = [];
  cubeAttLocation[0] = gl.getAttribLocation(cubeProgram, "position");
  const cubeAttStride = [];
  cubeAttStride[0] = 3;

  const cubeVao = gl.createVertexArray();
  gl.bindVertexArray(cubeVao);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeAttribute.p), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(cubeAttLocation[0]);
  gl.vertexAttribPointer(cubeAttLocation[0], cubeAttStride[0], gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(cubeAttribute.i), gl.STATIC_DRAW);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  create_cube_texture(cubeSource);
  gl.activeTexture(gl.TEXTURE0);

  const sphereProgram = create_program(create_shader(shader[4], gl.VERTEX_SHADER), create_shader(shader[5], gl.FRAGMENT_SHADER), false);

  const sphereUniLocation = [];
  sphereUniLocation[0] = gl.getUniformLocation(sphereProgram, "resolution");
  sphereUniLocation[1] = gl.getUniformLocation(sphereProgram, "time");
  sphereUniLocation[2] = gl.getUniformLocation(sphereProgram, "cubeTexture");
  sphereUniLocation[3] = gl.getUniformLocation(sphereProgram, "eyePosition");
  sphereUniLocation[4] = gl.getUniformLocation(sphereProgram, "viewPoint");
  const sphereAttLocation = [];
  const sphereAttStride = [];

  const sphere = (row, column, rad) => {
    const pos = [],
      nor = [],
      idx = [];
    for (let i = 0; i <= row; i++) {
      let r = Math.PI / row * i;
      const ry = Math.cos(r);
      const rr = Math.sin(r);
      for (let ii = 0; ii <= column; ii++) {
        const tr = Math.PI * 2 / column * ii;
        const tx = rr * rad * Math.cos(tr);
        const ty = ry * rad;
        const tz = rr * rad * Math.sin(tr);
        const rx = rr * Math.cos(tr);
        const rz = rr * Math.sin(tr);
        pos.push(tx, ty, tz);
        nor.push(rx, ry, rz);
      }
    }
    for (let i = 0; i < row; i++) {
      for (let ii = 0; ii < column; ii++) {
        const r = (column + 1) * i + ii;
        idx.push(r, r + 1, r + column + 2);
        idx.push(r, r + column + 2, r + column + 1);
      }
    }
    return { p: pos, n: nor, i: idx };
  };

  const sphereAttribute = sphere(64, 64, 0.3);

  sphereAttLocation[0] = gl.getAttribLocation(sphereProgram, "position");
  sphereAttStride[0] = 3;
  sphereAttLocation[1] = gl.getAttribLocation(sphereProgram, "normal");
  sphereAttStride[1] = 3;
  sphereAttLocation[2] = gl.getAttribLocation(sphereProgram, "offset");
  sphereAttStride[2] = 3;

  const sphereVaos = [];
  sphereVaos[0] = gl.createVertexArray();
  gl.bindVertexArray(sphereVaos[0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereAttribute.p), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(sphereAttLocation[0]);
  gl.vertexAttribPointer(sphereAttLocation[0], sphereAttStride[0], gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereAttribute.n), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(sphereAttLocation[1]);
  gl.vertexAttribPointer(sphereAttLocation[1], sphereAttStride[1], gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, feedback[0]);
  gl.enableVertexAttribArray(sphereAttLocation[2]);
  gl.vertexAttribPointer(sphereAttLocation[2], sphereAttStride[2], gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(sphereAttribute.i), gl.DYNAMIC_COPY);
  gl.vertexAttribDivisor(sphereAttLocation[2], 1);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[0]);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  sphereVaos[1] = gl.createVertexArray();
  gl.bindVertexArray(sphereVaos[1]);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereAttribute.p), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(sphereAttLocation[0]);
  gl.vertexAttribPointer(sphereAttLocation[0], sphereAttStride[0], gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereAttribute.n), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(sphereAttLocation[1]);
  gl.vertexAttribPointer(sphereAttLocation[1], sphereAttStride[1], gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, feedback[1]);
  gl.enableVertexAttribArray(sphereAttLocation[2]);
  gl.vertexAttribPointer(sphereAttLocation[2], sphereAttStride[2], gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(sphereAttribute.i), gl.DYNAMIC_COPY);
  gl.vertexAttribDivisor(sphereAttLocation[2], 1);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[1]);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  const horizontalGaussianProgram = create_program(
    create_shader(shader[6], gl.VERTEX_SHADER),
    create_shader(shader[7], gl.FRAGMENT_SHADER),
    false
  );

  const horizontalGaussianUniLocation = [];
  horizontalGaussianUniLocation[0] = gl.getUniformLocation(horizontalGaussianProgram, "cubeColor");
  horizontalGaussianUniLocation[1] = gl.getUniformLocation(horizontalGaussianProgram, "resolution");
  horizontalGaussianUniLocation[2] = gl.getUniformLocation(horizontalGaussianProgram, "weight");
  const horizontalGaussianAttLocation = [];
  const horizontalGaussianAttStride = [];

  const gaussianPosition = [
    -1.0, 1.0, 0.0, 1.0,
    1.0, 0.0, -1.0, -1.0,
    0.0, 1.0, -1.0, 0.0
  ];
  const gaussianIndex = [0, 2, 1, 1, 2, 3];
  let weight = new Array(10);
  let t = 0.0;
  const d = 100;
  for (let i = 0; i < weight.length; i++) {
    const r = 1.0 + 2.0 * i;
    let w = Math.exp(-0.5 * (r * r) / d);
    weight[i] = w;
    if (i > 0) {
      w *= 2.0;
    }
    t += w;
  }
  for (let i = 0; i < weight.length; i++) {
    weight[i] /= t;
  }
  const gaussianTextureCoord = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];

  horizontalGaussianAttLocation[0] = gl.getAttribLocation(horizontalGaussianProgram, "position");
  horizontalGaussianAttStride[0] = 3;
  horizontalGaussianAttLocation[1] = gl.getAttribLocation(horizontalGaussianProgram, "textureCoord");
  horizontalGaussianAttStride[1] = 2;

  const horizontalGaussianVao = gl.createVertexArray();
  gl.bindVertexArray(horizontalGaussianVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gaussianPosition), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(horizontalGaussianAttLocation[0]);
  gl.vertexAttribPointer(horizontalGaussianAttLocation[0], horizontalGaussianAttStride[0], gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gaussianTextureCoord), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(horizontalGaussianAttLocation[1]);
  gl.vertexAttribPointer(horizontalGaussianAttLocation[1], horizontalGaussianAttStride[1], gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(gaussianIndex), gl.STATIC_DRAW);
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  const verticalGaussianProgram = create_program(
    create_shader(shader[8], gl.VERTEX_SHADER),
    create_shader(shader[9], gl.FRAGMENT_SHADER),
    false
  );

  const verticalGaussianUniLocation = [];
  verticalGaussianUniLocation[0] = gl.getUniformLocation(verticalGaussianProgram, "sphereColor");
  verticalGaussianUniLocation[1] = gl.getUniformLocation(verticalGaussianProgram, "sphereDepth");
  verticalGaussianUniLocation[2] = gl.getUniformLocation(verticalGaussianProgram, "cubeColor");
  verticalGaussianUniLocation[3] = gl.getUniformLocation(verticalGaussianProgram, "cubeDepth");
  verticalGaussianUniLocation[4] = gl.getUniformLocation(verticalGaussianProgram, "resolution");
  verticalGaussianUniLocation[5] = gl.getUniformLocation(verticalGaussianProgram, "weight");

  const verticalGaussianAttLocation = [];
  const verticalGaussianAttStride = [];

  verticalGaussianAttLocation[0] = gl.getAttribLocation(verticalGaussianProgram, "position");
  verticalGaussianAttStride[0] = 3;
  verticalGaussianAttLocation[1] = gl.getAttribLocation(verticalGaussianProgram, "textureCoord");
  verticalGaussianAttStride[1] = 2;

  const verticalGaussianVao = gl.createVertexArray();
  gl.bindVertexArray(verticalGaussianVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gaussianPosition), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(verticalGaussianAttLocation[0]);
  gl.vertexAttribPointer(verticalGaussianAttLocation[0], verticalGaussianAttStride[0], gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gaussianTextureCoord), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(verticalGaussianAttLocation[1]);
  gl.vertexAttribPointer(verticalGaussianAttLocation[1], verticalGaussianAttStride[1], gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(gaussianIndex), gl.STATIC_DRAW);
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


  const fBuffer = [];
  const bufferList = [
    gl.COLOR_ATTACHMENT0,
    gl.COLOR_ATTACHMENT1
  ];
  fBuffer[0] = create_framebuffer_MRT(canvas.width, canvas.height, 2);
  fBuffer[1] = create_framebuffer_MRT(canvas.width, canvas.height, 2);
  fBuffer[2] = create_framebuffer_MRT(canvas.width, canvas.height, 2);

  // gl.enable(gl.CULL_FACE);    
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);

  let eyePosition = [0.0, 0.0, 0.0];
  let viewPoint = [0.0, 0.0, 0.0];

  const startTime = new Date().getTime();
  let dist = 1;

  const render = () => {
    const time = (new Date().getTime() - startTime) * 0.001;

    eyePosition[0] = 30.0 * Math.sin(time / 20.0);
    eyePosition[2] = 30.0 * Math.cos(time / 20.0);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.useProgram(gpgpuProgram);
    gl.bindVertexArray(gpgpuVaos[1 - dist]);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[dist]);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, particleNum);
    gl.endTransformFeedback();
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    gl.bindVertexArray(null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer[0].f);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(sphereProgram);
    gl.bindVertexArray(sphereVaos[dist]);
    gl.uniform2fv(sphereUniLocation[0], [canvas.width, canvas.height]);
    gl.uniform1f(sphereUniLocation[1], time);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
    gl.uniform1i(sphereUniLocation[2], 0);
    gl.uniform3fv(sphereUniLocation[3], eyePosition);
    gl.uniform3fv(sphereUniLocation[4], viewPoint);
    gl.drawBuffers(bufferList);
    gl.drawElementsInstanced(gl.TRIANGLES, new Int16Array(sphereAttribute.i).length, gl.UNSIGNED_SHORT, 0, particleNum);
    //gl.drawArraysInstanced(gl.TRIANGLES, 0, sphereAttribute.p.length / 4, particleNum);
    gl.bindVertexArray(null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.disable(gl.DEPTH_TEST);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer[1].f);
    gl.useProgram(cubeProgram);
    gl.bindVertexArray(cubeVao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
    gl.uniform1i(cubeUniLocation[0], 0);
    gl.uniform2fv(cubeUniLocation[1], [canvas.width, canvas.height]);
    gl.uniform3fv(cubeUniLocation[2], eyePosition);
    gl.uniform3fv(cubeUniLocation[3], viewPoint);
    gl.drawBuffers(bufferList);
    gl.drawElements(gl.TRIANGLES, cubeAttribute.i.length, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer[2].f);
    gl.useProgram(horizontalGaussianProgram);
    gl.bindVertexArray(horizontalGaussianVao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fBuffer[1].t[0]);
    gl.uniform1i(horizontalGaussianUniLocation[0], 0);
    gl.uniform2fv(horizontalGaussianUniLocation[1], [canvas.width, canvas.height]);
    gl.uniform1fv(horizontalGaussianUniLocation[2], weight);
    gl.drawBuffers(bufferList);
    gl.drawElements(gl.TRIANGLES, gaussianIndex.length, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.useProgram(verticalGaussianProgram);
    gl.clearColor(242 / 255, 242 / 255, 232 / 255, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindVertexArray(verticalGaussianVao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fBuffer[0].t[0]);
    gl.uniform1i(verticalGaussianUniLocation[0], 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, fBuffer[0].t[1]);
    gl.uniform1i(verticalGaussianUniLocation[1], 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, fBuffer[2].t[0]);
    gl.uniform1i(verticalGaussianUniLocation[2], 2);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, fBuffer[1].t[1]);
    gl.uniform1i(verticalGaussianUniLocation[3], 3);
    gl.uniform2fv(verticalGaussianUniLocation[4], [canvas.width, canvas.height]);
    gl.uniform1fv(verticalGaussianUniLocation[5], weight);
    gl.drawElements(gl.TRIANGLES, gaussianIndex.length, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);

    // gl.flush();
    dist = 1 - dist;
  };
  return render;
};

class CreateCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.requestId = 0;
  }
  componentDidMount() {
    this.updateCanvas();
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.requestId);
  }
  updateCanvas() {
    this.canvas.width = this.props.style.width;
    this.canvas.height = this.props.style.height;
    this.gl = this.canvas.getContext("webgl2");
    const render = webGLStart(this.canvas, this.gl, glsl);
    const loop = () => {
      render();
      this.requestId = requestAnimationFrame(loop);
    };
    loop();
  }
  handleResize(w, h) {
    /*this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0,0,w,h);*/
  }
  render() {
    return (
      <canvas
        {...this.props}
        ref={e => {
          this.canvas = e;
        }}
      />
    );
  }
}
export default CreateCanvas;
