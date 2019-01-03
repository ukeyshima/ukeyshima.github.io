import React from "react";
import vert from "./vertexShader.glsl";
import frag from "./fragmentShader.glsl";
import loadTex from "./texture.jpg";
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
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
  let texture;
  const create_texture = () => {
    const img = new Image();    
    img.src = loadTex;
    img.onload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
      texture = tex;
    };
  };
  const prg = create_program(
    create_shader(vs, gl.VERTEX_SHADER),
    create_shader(fs, gl.FRAGMENT_SHADER)
  );
  const uniLocation = [];
  uniLocation[0] = gl.getUniformLocation(prg, "time");
  uniLocation[1] = gl.getUniformLocation(prg, "resolution");
  uniLocation[2] = gl.getUniformLocation(prg, "tex");

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

  const vPosition = create_vbo(position, gl);
  const attLocation = new Array();
  attLocation[0] = gl.getAttribLocation(prg, "position");
  const attStride = new Array();
  attStride[0] = 3;
  set_attribute([vPosition], attLocation, attStride, gl);
  const index = [0, 2, 1, 1, 2, 3];
  const vIndex = create_ibo(index);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);
  gl.activeTexture(gl.TEXTURE0);
  create_texture();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  const startTime = new Date().getTime();
  const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1f(uniLocation[0], (new Date().getTime() - startTime) * 0.001);
    gl.uniform2fv(uniLocation[1], [canvas.width, canvas.height]);
    gl.uniform1i(uniLocation[2], 0);
    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
    gl.flush();
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
  async updateCanvas() {
    this.canvas.width = this.props.style.width;
    this.canvas.height = this.props.style.height;
    this.gl = this.canvas.getContext("webgl");
    const render = webGLStart(this.canvas, this.gl, vert(), frag());
    const loop = () => {
      render();
      this.requestId = requestAnimationFrame(loop);
    };
    loop();
  }
  handleResize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
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
