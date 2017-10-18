window.addEventListener("load", function () {
    const c = document.getElementById("canvas");
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    c.width = cw; c.height = ch;
    const gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
    const prg = create_program(create_shader("vs"), create_shader("fs"));
    const uniLocation = new Array();
    uniLocation[0] = gl.getUniformLocation(prg, "pointSize");
    uniLocation[1] = gl.getUniformLocation(prg, "frame");
    uniLocation[2] = gl.getUniformLocation(prg, "resolution");
    // uniLocation[3] = gl.getUniformLocation(prg, "tex");

    const particleNum = 1000;
    const position = new Array();
    const doubleAccel = new Array();
    const number = new Array();
    const velocity = new Array();
    const accel = new Array();
    const existenceFrame = new Array();
    for (let i = 0; i < particleNum * 3; i++) {
        position[i] = 0.0;
        velocity[i] = 0.0;
        accel[i] = 0.0;
    }
    for (let i = 0; i < particleNum; i++) {
        number[i] = i;
        existenceFrame[i] = 0;
        doubleAccel[i * 3] = Math.random() > 0.5 ? 0.0000258 - (Math.random()) * 0.00001 : -0.0000258 + (Math.random()) * 0.00001;
        doubleAccel[i * 3 + 1] = 0.00005 * Math.random();
        doubleAccel[i * 3 + 2] = Math.random() > 0.5 ? 0.0000258 - (Math.random()) * 0.00001 : -0.0000258 + (Math.random()) * 0.00001;
    }

    const vAttLocation = new Array();
    const vAttStride = new Array();

    let vPosition = create_vbo(position);
    vAttLocation[0] = gl.getAttribLocation(prg, "position");
    vAttStride[0] = 3;

    let vDoubleAccel = create_vbo(doubleAccel);
    vAttLocation[1] = gl.getAttribLocation(prg, "doubleAccel");
    vAttStride[1] = 3;

    const vNumber = create_vbo(number);
    vAttLocation[2] = gl.getAttribLocation(prg, "number");
    vAttStride[2] = 1;

    let vVelocity = create_vbo(velocity);
    vAttLocation[3] = gl.getAttribLocation(prg, "velocity");
    vAttStride[3] = 3;

    let vExistenceFrame = create_vbo(existenceFrame);
    vAttLocation[4] = gl.getAttribLocation(prg, "existenceFrame");
    vAttStride[4] = 1;

    let vAccel = create_vbo(accel);
    vAttLocation[5] = gl.getAttribLocation(prg, "accel");
    vAttStride[5] = 3;

    set_attribute([vPosition, vDoubleAccel, vNumber, vVelocity, vExistenceFrame, vAccel], vAttLocation, vAttStride);

    const vTransformFeedback = [gl.createBuffer(), gl.createBuffer(), gl.createBuffer(), gl.createBuffer()];
    const transformFeedback = [gl.createTransformFeedback(), gl.createTransformFeedback(), gl.createTransformFeedback(), gl.createTransformFeedback()];

    gl.bindBuffer(gl.ARRAY_BUFFER, vTransformFeedback[0]);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT * 3 * particleNum, gl.DYNAMIC_COPY);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vTransformFeedback[1]);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT * 3 * particleNum, gl.DYNAMIC_COPY);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vTransformFeedback[2]);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT * particleNum, gl.DYNAMIC_COPY);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[2]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vTransformFeedback[3]);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT * 3 * particleNum, gl.DYNAMIC_COPY);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[3]);

    let texture;
    create_texture();

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);

    gl.clearColor(242/255, 242/255, 242/255, 1.0);

  //    new_canvas();
    let frame = 0.0;
    (function () {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1f(uniLocation[0], 10+(cw-150)/50);
        gl.uniform1f(uniLocation[1], frame);
        gl.uniform2fv(uniLocation[2], [cw, ch]);
        //      gl.uniform1i(uniLocation[3], 0);
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
        //console.log(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));
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
        requestAnimationFrame(arguments.callee);
    })();

    document.addEventListener("mousedown", function () {
        var arrBuffer = new ArrayBuffer(particleNum*3 * Float32Array.BYTES_PER_ELEMENT);
        arrBuffer=new Float32Array(arrBuffer);
        gl.getBufferSubData(gl.ARRAY_BUFFER, 0, arrBuffer);
    });

    function create_shader(id) {
        let shader;
        const scriptElement = document.getElementById(id);
        if (!scriptElement) { return; }
        switch (scriptElement.type) {
            case "x-shader/x-vertex":
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;
            case "x-shader/x-fragment":
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default:
                return;
        }
        gl.shaderSource(shader, scriptElement.text);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        } else {
            alert(gl.getShaderInfoLog(shader));
            console.log(gl.getShaderInfoLog(shader));
        }
    }
    function create_program(vs, fs) {
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
    }
    function create_vbo(data) {
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_COPY);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    }
    function create_ibo(data) {
        const ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return ibo;
    }
    function set_attribute(vbo, attL, attS) {
        for (let i in vbo) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
            gl.enableVertexAttribArray(attL[i]);
            gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
        }
    }
    function create_texture() {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        //document.body.appendChild(canvas);
        ctx.beginPath();
        const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        grad.addColorStop(0, "rgba(255,10,0,0.8)");
        grad.addColorStop(0.5, "rgba(200,100,0,0.2)");
        grad.addColorStop(0.9, "rgba(100,100,000,0.1)");
        grad.addColorStop(1, "rgba(255,255,255,0.0)");
        ctx.fillStyle = grad;
        //   ctx.fillStyle="rgba(255,0,0,0.3)";
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, false);
        ctx.fill();
        const img = new Image();
        img.addEventListener("load", function () {
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

    function new_canvas() {
        const canvas = document.getElementById("canvas2");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        ctx.textAlign = "center";
        ctx.globalAlpha = 0.0;
        let frameCount=0;
        let titleTextAlpha=0.0;
        let footerTextAlpha=0.0;
        (function(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            titleTextAlpha+=titleTextAlpha>0.7 || frameCount<230?0.0:0.0025
            ctx.globalAlpha=titleTextAlpha;
            ctx.font = "50px 'Georgia'";
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillText("webGL portfolio", canvas.width / 2, canvas.height / 2.5);
            footerTextAlpha+=footerTextAlpha>0.7 || frameCount<270?0.0:0.0025
            ctx.globalAlpha=footerTextAlpha;
            ctx.font = "20px 'Georgia'";
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillText("@shimashimaotoko", canvas.width / 2, canvas.height *6/7);
            frameCount++;
            requestAnimationFrame(arguments.callee);
        })();
    }
    window.addEventListener("resize",function(e){
        cw=e.target.innerWidth;
        ch=e.target.innerHeight;
        c.width=cw;
        c.height=ch;
        console.log(cw);
        gl.viewport(0,0,cw,ch);
     });
});