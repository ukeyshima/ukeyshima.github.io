class WebGL2 {
  static defaultVertexShader = `#version 300 es
  in vec3 position;
  void main() {
      gl_Position = vec4(position, 1.0);
  }`;
  static planeVertexPosition = [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0];
  static planeVertexIndex = [0, 2, 1, 1, 2, 3];

  constructor(canvas, shaderInfo) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2');
    this.useTextureFloatExtension();
    this.useTextureFloatLinearExtension();
    this.webglPrograms = shaderInfo.reduce((preInfo, info) => {
      const vs = this.createShader(info.vsText, this.gl.VERTEX_SHADER);
      const fs = this.createShader(info.fsText, this.gl.FRAGMENT_SHADER);
      const program = this.createProgram(vs, fs);
      return {
        ...preInfo,
        [info.name]: {
          program: program,
          uniLocations: info.uniList.reduce((pre, cur) => ({ ...pre, [cur]: this.gl.getUniformLocation(program, cur) }), {}),
          attLocations: info.attList.reduce(
            (pre, cur) => ({
              ...pre,
              [cur.location]: { ...cur, ...{ location: this.gl.getAttribLocation(program, cur.location) } },
            }),
            {}
          ),
        },
      };
    }, {});
  }

  createShader(text, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, text);
    this.gl.compileShader(shader);
    if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      return shader;
    } else {
      console.log(this.gl.getShaderInfoLog(shader));
    }
  }

  createProgram(vs, fs) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);
    this.gl.linkProgram(program);
    if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      this.gl.useProgram(program);
      return program;
    } else {
      console.log(this.gl.getProgramInfoLog(program));
      return null;
    }
  }

  useTextureFloatExtension() {
    const extension = this.gl.getExtension('EXT_color_buffer_float');
    if (!extension) {
      console.log('no floating point texture support');
    }
  }

  useTextureFloatLinearExtension() {
    const extension = this.gl.getExtension('OES_texture_float_linear');
    if (!extension) {
      console.log('no floating point texture linear support');
    }
  }

  setAttribute(array, location, stride) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(array), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(location);
    this.gl.vertexAttribPointer(location, stride, this.gl.FLOAT, false, 0, 0);
  }

  setIndex(index) {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(index), this.gl.STATIC_DRAW);
  }

  createVAO(attributes, attribDivisours, index) {
    const vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(vao);
    attributes.forEach((attribute) => this.setAttribute(attribute.array, attribute.location, attribute.stride));
    attribDivisours.forEach((attribDivisour) => this.gl.vertexAttribDivisor(attribDivisour.location, attribDivisour.stride));
    this.setIndex(index);
    this.gl.bindVertexArray(null);
    return vao;
  }

  createFrameBuffer(width, height) {
    const frameBuffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);
    const fTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, fTexture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA16F, width, height, 0, this.gl.RGBA, this.gl.HALF_FLOAT, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, fTexture, 0);
    const depthRenderBuffer = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthRenderBuffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthRenderBuffer);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    return { f: frameBuffer, d: depthRenderBuffer, t: fTexture };
  }

  createFrameBufferMRT(width, height, count) {
    const frameBuffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);
    const fTextures = [];
    for (let i = 0; i < count; i++) {
      fTextures[i] = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, fTextures[i]);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA16F, width, height, 0, this.gl.RGBA, this.gl.HALF_FLOAT, null);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
      this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0 + i, this.gl.TEXTURE_2D, fTextures[i], 0);
    }
    const depthRenderBuffer = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthRenderBuffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthRenderBuffer);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    return { f: frameBuffer, d: depthRenderBuffer, ts: fTextures };
  }
}
