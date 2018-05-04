import React from "react";
import data from "./data.json";
import gpgpuVert from "./gpgpuVertexShader.glsl";
import gpgpuFrag from "./gpgpuFragmentShader.glsl";
import mainVert from "./mainVertexShader.glsl";
import mainFrag from "./mainFragmentShader.glsl";

const webGLStart = (canvas, gl, object, vs1, fs1, vs2, fs2) => {
  const create_program = (vs, fs, isGpgpuProgram) => {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    if (isGpgpuProgram)
      gl.transformFeedbackVaryings(
        program,
        ["outPosition"],
        gl.SEPARATE_ATTRIBS
      );
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

  const gpgpuProgram = create_program(
    create_shader(vs1, gl.VERTEX_SHADER),
    create_shader(fs1, gl.FRAGMENT_SHADER),
    true
  );
  const gpgpuUniLocation = [];
  const gpgpuAttLocation = [];
  const gpgpuAttStride = [];
  const particleNum = 70;
  const position = new Array(particleNum * 3).fill(0).map((e, i, a) => {
    if (i % 3 == 0) {
      return 20.0 + Math.random() * 10.0;
    } else if (i % 3 == 1) {
      return 5.0 + Math.random() * 5.0;
    } else {
      return Math.random() * 2.0 - 1.0;
    }
  });
  gpgpuAttLocation[0] = gl.getAttribLocation(gpgpuProgram, "position");
  gpgpuAttStride[0] = 3;
  const velocity = new Array(particleNum * 3).fill(0).map((e, i, a) => {
    if (i % 3 == 0) {
      return -Math.random() * 0.15;
    } else if (i % 3 == 1) {
      return -Math.random() * 0.1;
    } else {
      return -Math.random() * 0.15;
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
  gl.vertexAttribPointer(
    gpgpuAttLocation[0],
    gpgpuAttStride[0],
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(gpgpuAttLocation[1]);
  gl.vertexAttribPointer(
    gpgpuAttLocation[1],
    gpgpuAttStride[1],
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[2]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(gpgpuAttLocation[2]);
  gl.vertexAttribPointer(
    gpgpuAttLocation[2],
    gpgpuAttStride[2],
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

  gpgpuVaos[1] = gl.createVertexArray();
  gl.bindVertexArray(gpgpuVaos[1]);
  gl.bindBuffer(gl.ARRAY_BUFFER, feedback[1]);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[0]), gl.DYNAMIC_COPY);
  gl.enableVertexAttribArray(gpgpuAttLocation[0]);
  gl.vertexAttribPointer(
    gpgpuAttLocation[0],
    gpgpuAttStride[0],
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(gpgpuAttLocation[1]);
  gl.vertexAttribPointer(
    gpgpuAttLocation[1],
    gpgpuAttStride[1],
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[2]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(gpgpuAttLocation[2]);
  gl.vertexAttribPointer(
    gpgpuAttLocation[2],
    gpgpuAttStride[2],
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[1]);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

  const mainProgram = create_program(
    create_shader(vs2, gl.VERTEX_SHADER),
    create_shader(fs2, gl.FRAGMENT_SHADER),
    false
  );

  const mainUniLocation = [];
  mainUniLocation[0] = gl.getUniformLocation(mainProgram, "resolution");
  mainUniLocation[1] = gl.getUniformLocation(mainProgram, "time");
  const mainAttLocation = [];
  const mainAttStride = [];

  const obj = {
    position: object.data.attributes.position.array,
    normal: object.data.attributes.normal.array,
    index: object.data.index.array
  };
  mainAttLocation[0] = gl.getAttribLocation(mainProgram, "position");
  mainAttStride[0] = 3;
  mainAttLocation[1] = gl.getAttribLocation(mainProgram, "offset");
  mainAttStride[1] = 3;

  const mainVaos = [];
  mainVaos[0] = gl.createVertexArray();
  gl.bindVertexArray(mainVaos[0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(obj.position),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(mainAttLocation[0]);
  gl.vertexAttribPointer(
    mainAttLocation[0],
    mainAttStride[0],
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, feedback[0]);
  gl.enableVertexAttribArray(mainAttLocation[1]);
  gl.vertexAttribPointer(
    mainAttLocation[1],
    mainAttStride[1],
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Int16Array(obj.index),
    gl.DYNAMIC_COPY
  );
  gl.vertexAttribDivisor(mainAttLocation[1], 1);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[0]);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  mainVaos[1] = gl.createVertexArray();
  gl.bindVertexArray(mainVaos[1]);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(obj.position),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(mainAttLocation[0]);
  gl.vertexAttribPointer(
    mainAttLocation[0],
    mainAttStride[0],
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, feedback[1]);
  gl.enableVertexAttribArray(mainAttLocation[1]);
  gl.vertexAttribPointer(
    mainAttLocation[1],
    mainAttStride[1],
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Int16Array(obj.index),
    gl.STATIC_DRAW
  );
  gl.vertexAttribDivisor(mainAttLocation[1], 1);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[1]);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  gl.clearColor(242 / 255, 242 / 255, 232 / 255, 1.0);
  const startTime = new Date().getTime();
  let dist = 1;
  let requestId;
  const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
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
    gl.useProgram(mainProgram);
    gl.uniform2fv(mainUniLocation[0], [canvas.width, canvas.height]);
    gl.uniform1f(
      mainUniLocation[1],
      (new Date().getTime() - startTime) * 0.001
    );
    gl.bindVertexArray(mainVaos[dist]);
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      new Int16Array(obj.index).length,
      gl.UNSIGNED_SHORT,
      0,
      particleNum
    );
    //gl.drawArraysInstanced(gl.TRIANGLES, 0, obj.position.length / 4, particleNum);
    gl.bindVertexArray(null);
    gl.flush();
    dist = 1 - dist;
    //id = requestAnimationFrame(render);
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
  handleResize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
  }
  async updateCanvas() {
    this.canvas.width = this.props.style.width;
    this.canvas.height = this.props.style.height;
    this.gl = this.canvas.getContext("webgl2");
    const render = await webGLStart(
      this.canvas,
      this.gl,
      data,
      gpgpuVert(),
      gpgpuFrag(),
      mainVert(),
      mainFrag()
    );
    const loop = () => {
      render();
      this.requestId = requestAnimationFrame(loop);
    };
    loop();
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
