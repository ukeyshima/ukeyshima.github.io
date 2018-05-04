import React from "react";
import vert from "./vertexShader.glsl";
import frag from "./fragmentShader.glsl";
const webGLStart = (canvas, gl, vs, fs) => {
  const create_program = (vs, fs) => {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
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
  const create_vbo = data => {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_COPY);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  };
  const create_ibo = data => {
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Int16Array(data),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  };
  const set_attribute = (vbo, attL, attS) => {
    vbo.forEach((e, i, a) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, e);
      gl.enableVertexAttribArray(attL[i]);
      gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
    });
  };
  const create_framebuffer = (width, height) => {
    const frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    const depthRenderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      width,
      height
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      depthRenderBuffer
    );
    const fTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      fTexture,
      0
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { f: frameBuffer, d: depthRenderBuffer, t: fTexture };
  };
  const prg = create_program(
    create_shader(vs, gl.VERTEX_SHADER),
    create_shader(fs, gl.FRAGMENT_SHADER)
  );
  const uniLocation = [];
  uniLocation[0] = gl.getUniformLocation(prg, "resolution");
  uniLocation[1] = gl.getUniformLocation(prg, "time");
  uniLocation[2] = gl.getUniformLocation(prg, "tex");
  uniLocation[3] = gl.getUniformLocation(prg, "useTexture");
  uniLocation[4] = gl.getUniformLocation(prg, "count");

  const position = [
    -1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    -1.0,
    -1.0,
    0.0,
    1.0,
    -1.0,
    0.0
  ];
  const index = [0, 2, 1, 1, 2, 3];
  const textureCoord = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];

  const attLocation = [];
  const attStride = [];

  const vPosition = create_vbo(position);
  attLocation[0] = gl.getAttribLocation(prg, "position");
  attStride[0] = 3;
  const vTextureCoord = create_vbo(textureCoord);
  attLocation[1] = gl.getAttribLocation(prg, "textureCoord");
  attStride[1] = 2;

  const vIndex = create_ibo(index);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);

  const fBuffer = [];
  fBuffer[0] = create_framebuffer(canvas.width, canvas.height);
  fBuffer[1] = create_framebuffer(canvas.width, canvas.height);

  const startTime = new Date().getTime();
  gl.clearColor(1.0, 0.0, 0.0, 1.0);
  let count = 0;
  return (() => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer[0].f);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2fv(uniLocation[0], [canvas.width, canvas.height]);
    gl.uniform1f(uniLocation[1], (new Date().getTime() - startTime) * 0.001);
    gl.uniform1i(uniLocation[2], 0);
    gl.uniform1i(uniLocation[3], false);
    gl.uniform1f(uniLocation[4], 0);
    set_attribute([vPosition, vTextureCoord], attLocation, attStride);
    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);    
    let dist = 0;
    const renderLoop = () => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer[dist].f);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2fv(uniLocation[0], [canvas.width, canvas.height]);
      gl.uniform1f(uniLocation[1], (new Date().getTime() - startTime) * 0.001);
      gl.uniform1i(uniLocation[3], true);
      gl.uniform1f(uniLocation[4], count);
      gl.bindTexture(gl.TEXTURE_2D, fBuffer[1 - dist].t);
      set_attribute([vPosition], attLocation, attStride);
      gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindTexture(gl.TEXTURE_2D, fBuffer[dist].t);
      gl.uniform1i(uniLocation[3], false);
      gl.uniform1f(uniLocation[4], count);
      set_attribute([vPosition], attLocation, attStride);
      gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
      dist = 1 - dist;
      gl.flush();      
      count++; 
    };
    return renderLoop;
  })();
};

class CreateCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.timeoutId = 0;
  }
  componentDidMount() {
    this.updateCanvas();
  }
  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }
  updateCanvas() {    
    this.canvas.width = this.props.style.width;
    this.canvas.height = this.props.style.height;
    this.gl = this.canvas.getContext("webgl2");
    const render = webGLStart(this.canvas,this.gl,vert(),frag());  
    const loop = () => {
      render();      
      this.timeoutId = setTimeout(loop, 200);
    };
    loop();
  }
  handleResize(w,h){
/*    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0,0,w,h);        */
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
