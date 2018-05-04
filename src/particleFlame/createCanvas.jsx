import React from "react";
import vert from "./vertexShader.glsl";
import frag from "./fragmentShader.glsl";
const webGLStart = (canvas, gl, vs, fs) => {
    const create_program = (vs, fs) => {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.transformFeedbackVaryings(program, ["outPosition", "outVelocity", "outExistenceFrame", "outAccel"], gl.SEPARATE_ATTRIBS);
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
    const create_texture = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        grad.addColorStop(0, "rgba(255,10,0,0.8)");
        grad.addColorStop(0.5, "rgba(200,100,0,0.2)");
        grad.addColorStop(0.9, "rgba(100,100,000,0.1)");
        grad.addColorStop(1, "rgba(255,255,255,0.0)");
        ctx.fillStyle = grad;
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, false);
        ctx.fill();
        const img = new Image();
        img.addEventListener("load", () => {
            const tex = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            texture = tex;
        });
        img.src = canvas.toDataURL("image/png", 1.0);
    }
    const prg = create_program(
        create_shader(vs, gl.VERTEX_SHADER),
        create_shader(fs, gl.FRAGMENT_SHADER)
    );
    const uniLocation = [];
    uniLocation[0] = gl.getUniformLocation(prg, "pointSize");
    uniLocation[1] = gl.getUniformLocation(prg, "frame");
    uniLocation[2] = gl.getUniformLocation(prg, "resolution");

    const particleNum = 1000;
    const position = new Array(particleNum * 3).fill(0);
    const doubleAccel = [];
    const number = [];
    const velocity = new Array(particleNum * 3).fill(0);
    const accel = new Array(particleNum * 3).fill(0);
    const existenceFrame = new Array(particleNum).fill(0);
    for (let i = 0; i < particleNum; i++) {
        number[i] = i;
        doubleAccel[i * 3] = Math.random() > 0.5 ? 0.0000258 - (Math.random()) * 0.000001 : -0.0000258 + (Math.random()) * 0.000001;
        doubleAccel[i * 3 + 1] = 0.00005 * Math.random();
        doubleAccel[i * 3 + 2] = Math.random() > 0.5 ? 0.0000258 - (Math.random()) * 0.000001 : -0.0000258 + (Math.random()) * 0.000001;
    }

    const attLocation = [];
    const attStride = [];

    let vPosition = create_vbo(position);
    attLocation[0] = gl.getAttribLocation(prg, "position");
    attStride[0] = 3;

    let vDoubleAccel = create_vbo(doubleAccel);
    attLocation[1] = gl.getAttribLocation(prg, "doubleAccel");
    attStride[1] = 3;

    const vNumber = create_vbo(number);
    attLocation[2] = gl.getAttribLocation(prg, "number");
    attStride[2] = 1;

    let vVelocity = create_vbo(velocity);
    attLocation[3] = gl.getAttribLocation(prg, "velocity");
    attStride[3] = 3;

    let vExistenceFrame = create_vbo(existenceFrame);
    attLocation[4] = gl.getAttribLocation(prg, "existenceFrame");
    attStride[4] = 1;

    let vAccel = create_vbo(accel);
    attLocation[5] = gl.getAttribLocation(prg, "accel");
    attStride[5] = 3;

    const vTransformFeedback = [gl.createBuffer(), gl.createBuffer(), gl.createBuffer(), gl.createBuffer()];
    const transformFeedback = [gl.createTransformFeedback(), gl.createTransformFeedback(), gl.createTransformFeedback(), gl.createTransformFeedback()];

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[0]);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[1]);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[2]);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[3]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vTransformFeedback[0]);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT * 3 * particleNum, gl.DYNAMIC_COPY);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, vTransformFeedback[1]);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT * 3 * particleNum, gl.DYNAMIC_COPY);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, vTransformFeedback[2]);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT * particleNum, gl.DYNAMIC_COPY);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, vTransformFeedback[3]);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT * 3 * particleNum, gl.DYNAMIC_COPY);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let texture;
    gl.activeTexture(gl.TEXTURE0);
    create_texture();

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);

    gl.clearColor(242 / 255, 242 / 255, 232 / 255, 1.0);

    let frame = 0;
    const render = () => {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1f(uniLocation[0], 10 + (canvas.width - 150) / 50);
        gl.uniform1f(uniLocation[1], frame);
        gl.uniform2fv(uniLocation[2], [canvas.width, canvas.height]);
        set_attribute([vPosition, vDoubleAccel, vNumber, vVelocity, vExistenceFrame, vAccel], attLocation, attStride);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, vTransformFeedback[0]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, vTransformFeedback[1]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, vTransformFeedback[2]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 3, vTransformFeedback[3]);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, particleNum);
        gl.endTransformFeedback();
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, null);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 3, null);
        let temp = vPosition;
        vPosition = vTransformFeedback[0];
        vTransformFeedback[0] = temp;
        let temp2 = vVelocity;
        vVelocity = vTransformFeedback[1];
        vTransformFeedback[1] = temp2;
        let temp3 = vExistenceFrame;
        vExistenceFrame = vTransformFeedback[2];
        vTransformFeedback[2] = temp3;
        let temp4 = vAccel;
        vAccel = vTransformFeedback[3];
        vTransformFeedback[3] = temp4;
        gl.flush();
        frame++;        
    };
    return render;
};

class CreateCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.requestId=0;
    }
    componentDidMount() {
        this.updateCanvas();
    }
    componentWillUnmount(){
        cancelAnimationFrame(this.requestId);
    }
    updateCanvas() {        
        this.canvas.width = this.props.style.width;
        this.canvas.height = this.props.style.height;
        this.gl = this.canvas.getContext("webgl2");
        const render=webGLStart(this.canvas,this.gl,vert(),frag());
        const loop=()=>{            
            render();
            this.requestId=requestAnimationFrame(loop);
        }
        loop();
    }
    handleResize(w,h){
        this.canvas.width = w;
        this.canvas.height = h;
        this.gl.viewport(0,0,w,h);        
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
