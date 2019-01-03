import React from 'react';
import { inject, observer } from 'mobx-react';
import vert from './opacityPropertyAreaVertexShader.glsl';
import frag from './opacityPropertyAreaFragmentShader.glsl';

const length = a => {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
};

const render = (gl, color, uniLocation) => {
  length(color) < 0.01
    ? gl.clearColor(1.0, 1.0, 1.0, 0.0)
    : gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform3fv(uniLocation[1], color);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  gl.flush();
};
const webGLStart = (canvas, gl, vs, fs, color) => {
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
  const drawColorProgram = create_program(
    create_shader(vs, gl.VERTEX_SHADER),
    create_shader(fs, gl.FRAGMENT_SHADER)
  );
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
  const uniLocation = [];
  const attLocation = [];
  const attStride = [];
  uniLocation[0] = gl.getUniformLocation(drawColorProgram, 'resolution');
  uniLocation[1] = gl.getUniformLocation(drawColorProgram, 'color');
  const vPosition = create_vbo(position);
  attLocation[0] = gl.getAttribLocation(drawColorProgram, 'position');
  attStride[0] = 3;
  set_attribute([vPosition], attLocation, attStride);
  const vIndex = create_ibo(index);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);
  gl.uniform2fv(uniLocation[0], [canvas.width, canvas.height]);
  gl.uniform3fv(uniLocation[1], color);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
  render(gl, color, uniLocation);
  return uniLocation;
};

@inject(({ state }, props) => {
  return {
    colorArray: state.colorArray,
    updateOpacity: state.updateOpacity,
    updateOpacityAreaRender: state.updateOpacityAreaRender,
    updateOpacityAreaGlContext: state.updateOpacityAreaGlContext,
    updateOpacityAreaUniLocation: state.updateOpacityAreaUniLocation
  };
})
export default class OpacityPropertyArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseX: this.props.style.width,
      mouseY: this.props.style.height / 2 + 5
    };
  }
  componentDidMount() {
    this.canvas.width = this.props.style.width;
    this.canvas.height = this.props.style.height;
    this.gl = this.canvas.getContext('webgl');
    this.uniLocation = webGLStart(
      this.canvas,
      this.gl,
      vert(),
      frag(),
      this.props.colorArray.map(e => e / 255)
    );
    this.props.updateOpacityAreaGlContext(this.gl);
    this.props.updateOpacityAreaUniLocation(this.uniLocation);
    this.props.updateOpacityAreaRender(render);
  }
  handleMouseDown = e => {
    const event = e.nativeEvent;
    const color = this.props.colorArray;
    render(this.gl, color.map(e => e / 255), this.uniLocation);
    const u8 = new Uint8Array(4);
    this.gl.readPixels(
      event.layerX,
      this.props.style.height - event.layerY,
      1,
      1,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      u8
    );
    this.props.updateOpacity(u8[3] / 255);
    this.setState({
      mouseX: event.layerX,
      mouseY: event.layerY
    });
  };
  render() {
    return (
      <div
        touch-action='none'
        style={{
          margin: 0,
          padding: 0,
          height: this.props.style.height,
          position: 'relative'
        }}
      >
        <canvas
          style={this.props.style}
          ref={e => {
            this.canvas = e;
          }}
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleMouseDown}
        />
        <svg
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
            left: this.state.mouseX - 5,
            top: this.state.mouseY - 5
          }}
        >
          <circle cx='5' cy='5' r='5' fill='#fff' stroke='#000' />
        </svg>
      </div>
    );
  }
}
