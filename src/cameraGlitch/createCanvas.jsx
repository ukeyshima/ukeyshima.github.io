import React from "react";
import vert from "./vertexShader.glsl";
import frag from "./fragmentShader.glsl";

const webGLStart = (canvas, gl, vs, fs, video) => {
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
  const prg = create_program(
    create_shader(vs, gl.VERTEX_SHADER),
    create_shader(fs, gl.FRAGMENT_SHADER)
  );
  const uniLocation = new Array();
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
  const textureCoord = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];

  const vPosition = create_vbo(position);
  const vTextureCoord = create_vbo(textureCoord);
  const vAttLocation = new Array();
  vAttLocation[0] = gl.getAttribLocation(prg, "position");
  const vAttStride = new Array();
  vAttStride[0] = 3;
  set_attribute([vPosition], vAttLocation, vAttStride);

  const index = [0, 2, 1, 1, 2, 3];
  const vIndex = create_ibo(index);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const videoTexture = gl.createTexture(gl.TEXTURE_2D);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, videoTexture);
  //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  const texture = videoTexture;

  const startTime = new Date().getTime();
  const render = () => {
    let time = (new Date().getTime() - startTime) * 0.001;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uniLocation[0], time);
    gl.uniform2fv(uniLocation[1], [canvas.width, canvas.height]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uniLocation[2], 0);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.flush();
  };
  return render;
};

class Video extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      window.navigator.mozGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia(
      { video: true, audio: false },
      stream => (this.video.src = window.URL.createObjectURL(stream)),
      err => console.log(err)
    );
    this.props.updatevideo(this.video);
  }
  render() {
    return (
      <video
        style={{
          visibility: "hidden",
          height: 0,
          width: 0
        }}
        ref={e => (this.video = e)}
      />
    );
  }
}

class CreateCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.video = null;
    this.requestId = 0;
  }
  async componentDidMount() {
    this.canvas.width = this.props.style.width;
    this.canvas.height = this.props.style.height;
    this.gl = this.canvas.getContext("webgl2");
    const render = webGLStart(this.canvas, this.gl, vert(), frag(), this.video);
    const loop = () => {
      render();
      this.requestId = requestAnimationFrame(loop);
    };
    loop();
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.requestId);
  }
  handleResize(w,h){
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0,0,w,h);        
  }  
  updateVideo(video) {
    this.video = video;
  }
  render() {
    return (
      <div>
        <Video updatevideo={this.updateVideo.bind(this)} />
        <canvas {...this.props} ref={e => (this.canvas = e)} />
      </div>
    );
  }
}
export default CreateCanvas;
