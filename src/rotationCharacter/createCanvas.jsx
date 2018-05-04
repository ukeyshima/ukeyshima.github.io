import React from "react";
import vert from "./vertexShader.glsl";
import frag from "./fragmentShader.glsl";
import img0 from "./texture/0.png";
import img1 from "./texture/1.png";
import img2 from "./texture/2.png";
import img3 from "./texture/3.png";
import img4 from "./texture/4.png";
import img5 from "./texture/5.png";
import img6 from "./texture/6.png";
import img7 from "./texture/7.png";
import img8 from "./texture/8.png";
import img9 from "./texture/9.png";
const loadImg = [img0, img1, img2, img3, img4, img5, img6, img7, img8, img9];
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
  const set_attribute = (vbo, attL, attS) => {
    vbo.forEach((e, i, a) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, e);
      gl.enableVertexAttribArray(attL[i]);
      gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
    });
  };
  const create_texture = num => {
    const img = new Image();
    img.addEventListener("load", function() {
      const tex = gl.createTexture();
      gl.activeTexture(eval(`gl.TEXTURE${num}`));
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
      texture[num] = tex;
    });
    img.src = loadImg[num];
  };
  const prg = create_program(
    create_shader(vs, gl.VERTEX_SHADER),
    create_shader(fs, gl.FRAGMENT_SHADER)
  );
  const uniLocation = [];
  uniLocation[0] = gl.getUniformLocation(prg, "texture0");
  uniLocation[1] = gl.getUniformLocation(prg, "texture1");
  uniLocation[2] = gl.getUniformLocation(prg, "texture2");
  uniLocation[3] = gl.getUniformLocation(prg, "texture3");
  uniLocation[4] = gl.getUniformLocation(prg, "texture4");
  uniLocation[5] = gl.getUniformLocation(prg, "texture5");
  uniLocation[6] = gl.getUniformLocation(prg, "texture6");
  uniLocation[7] = gl.getUniformLocation(prg, "texture7");
  uniLocation[8] = gl.getUniformLocation(prg, "texture8");
  uniLocation[9] = gl.getUniformLocation(prg, "texture9");
  uniLocation[10] = gl.getUniformLocation(prg, "time");

  const attLocation = [];
  const attStride = [];

  const particleNum = 10;
  const position = new Array(particleNum * 3).fill(0);
  const vPosition = create_vbo(position);
  attLocation[0] = gl.getAttribLocation(prg, "position");
  attStride[0] = 3;
  const id = new Array(particleNum).fill(0).map((e, i, a) => i);
  const vId = create_vbo(id);
  attLocation[1] = gl.getAttribLocation(prg, "id");
  attStride[1] = 1;
  set_attribute([vPosition, vId], attLocation, attStride);
  gl.clearColor(242.0 / 255.0, 242.0 / 255.0, 232.0 / 255.0, 1.0);
  const texture = [];
  for (let i = 0; i < 10; i++) {
    create_texture(i);
  }
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
  const startTime = new Date().getTime();
  const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0; i < 10; i++) {
      eval("gl.activeTexture(gl.TEXTURE" + i + ");");
      gl.bindTexture(gl.TEXTURE_2D, texture[i]);
      gl.uniform1i(uniLocation[i], i);
    }
    gl.uniform1f(uniLocation[10], (new Date().getTime() - startTime) * 0.001);
    gl.drawArrays(gl.POINTS, 0, particleNum);
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
  updateCanvas() {
    this.canvas.width = this.props.style.width;
    this.canvas.height = this.props.style.height;
    this.gl = this.canvas.getContext("webgl2");
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
