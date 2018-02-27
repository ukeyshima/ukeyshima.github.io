window.addEventListener("load", function () {
    var model = new XMLHttpRequest();
    var mainVertexShaderText = new XMLHttpRequest();
    var mainFragmentShaderText = new XMLHttpRequest();
    var gpgpuVertexShaderText = new XMLHttpRequest();
    var gpgpuFragmentShaderText = new XMLHttpRequest();
    model.open("get", "data.json", true);
    mainVertexShaderText.open("get", "../autumn/mainVertexShader.glsl", true);
    mainFragmentShaderText.open("get", "../autumn/mainFragmentShader.glsl", true);
    gpgpuVertexShaderText.open("get", "../autumn/gpgpuVertexShader.glsl", true);
    gpgpuFragmentShaderText.open("get", "../autumn/gpgpuFragmentShader.glsl", true);
    var object, mainVs, mainFs, gpgpuVs, gpgpuFs;
    model.addEventListener("load", function () {
        object = JSON.parse(this.responseText);
        if (mainVs && mainFs && gpgpuVs && gpgpuFs) {
            glStart();
        }
    });
    model.send(null);
    mainVertexShaderText.addEventListener("load", function () {
        mainVs = this.responseText;
        if (object && mainFs && gpgpuVs && gpgpuFs) {
            glStart();
        }
    });
    mainVertexShaderText.send(null);
    mainFragmentShaderText.addEventListener("load", function () {
        mainFs = this.responseText;
        if (mainVs && object && gpgpuVs && gpgpuFs) {
            glStart();
        }
    });
    mainFragmentShaderText.send(null);
    gpgpuVertexShaderText.addEventListener("load", function () {
        gpgpuVs = this.responseText;
        if (mainVs && mainFs && object && gpgpuFs) {
            glStart();
        }
    });
    gpgpuVertexShaderText.send(null);
    gpgpuFragmentShaderText.addEventListener("load", function () {
        gpgpuFs = this.responseText;
        if (mainVs && mainFs && gpgpuVs && object) {
            glStart();
        }
    });
    gpgpuFragmentShaderText.send(null);
    function glStart() {
        var c = document.getElementById("canvas");
        var cw = window.innerWidth;
        var ch = window.innerHeight;
        c.width = cw; c.height = ch;
        var gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
        var gpgpuProgram = create_gpgpu_program(create_vertex_shader(gpgpuVs), create_fragment_shader(gpgpuFs));
        var gpgpuUniLocation = [];
        var gpgpuAttLocation = [];
        var gpgpuAttStride = [];
        var particleNum = 30;
        var position = new Array(particleNum * 3).fill(0).map(function (e, i, a) {
            if (i % 3 == 0) {
                return 20.0 + (Math.random()) * 10.0;
            } else if (i % 3 == 1) {
                return 5.0 + (Math.random()) * 5.0;
            } else {
                return (Math.random()) * 2.0 - 1.0;
            }
        });
        gpgpuAttLocation[0] = gl.getAttribLocation(gpgpuProgram, "position");
        gpgpuAttStride[0] = 3;
        var velocity = new Array(particleNum * 3).fill(0).map(function (e, i, a) {
            if (i % 3 == 0) {
                return (-Math.random()) * 0.15;
            } else if (i % 3 == 1) {
                return (-Math.random()) * 0.1;
            } else {
                return (-Math.random()) * 0.15;
            }
        });
        gpgpuAttLocation[1] = gl.getAttribLocation(gpgpuProgram, "velocity");
        gpgpuAttStride[1] = 3;
        var startPosition = [].concat(position);
        gpgpuAttLocation[2] = gl.getAttribLocation(gpgpuProgram, "startPosition");
        gpgpuAttStride[2] = 3;

        let feedback = [gl.createBuffer(), gl.createBuffer()];
        let transformFeedback = [gl.createTransformFeedback(), gl.createTransformFeedback()];

        let vboList = [position, velocity, startPosition];

        let gpgpuInputVao = gl.createVertexArray();
        gl.bindVertexArray(gpgpuInputVao);
        gl.bindBuffer(gl.ARRAY_BUFFER, feedback[0]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[0]), gl.DYNAMIC_COPY);
        gl.enableVertexAttribArray(gpgpuAttLocation[0]);
        gl.vertexAttribPointer(gpgpuAttLocation[0], gpgpuAttStride[0], gl.FLOAT, false, 0, 0);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[0]);

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

        var gpgpuOutputVao = gl.createVertexArray();
        gl.bindVertexArray(gpgpuInputVao);
        gl.bindBuffer(gl.ARRAY_BUFFER, feedback[1]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[0]), gl.DYNAMIC_COPY);
        gl.enableVertexAttribArray(gpgpuAttLocation[0]);
        gl.vertexAttribPointer(gpgpuAttLocation[0], gpgpuAttStride[0], gl.FLOAT, false, 0, 0);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[1]);

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

        let gpgpuVaos = [gpgpuInputVao, gpgpuOutputVao];

        var mainProgram = create_main_program(create_vertex_shader(mainVs), create_fragment_shader(mainFs));
        var mainUniLocation = [];
        mainUniLocation[0] = gl.getUniformLocation(mainProgram, "resolution");
        mainUniLocation[1] = gl.getUniformLocation(mainProgram, "time");
        var mainAttLocation = [];
        var mainAttStride = [];
        var obj = {
            "position": object.data.attributes.position.array,
            "normal": object.data.attributes.normal.array,
            "index": object.data.index.array
        }
        mainAttLocation[0] = gl.getAttribLocation(mainProgram, "position");
        mainAttStride[0] = 3;
        mainAttLocation[1] = gl.getAttribLocation(mainProgram, "offset");
        mainAttStride[1] = 3;

        var mainInputVao = gl.createVertexArray();
        gl.bindVertexArray(mainInputVao);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.position), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(mainAttLocation[0]);
        gl.vertexAttribPointer(mainAttLocation[0], mainAttStride[0], gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, feedback[0]);
        gl.enableVertexAttribArray(mainAttLocation[1]);
        gl.vertexAttribPointer(mainAttLocation[1], mainAttStride[1], gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(obj.index), gl.DYNAMIC_COPY);
        gl.vertexAttribDivisor(mainAttLocation[1], 1);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[0]);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        var mainOutputVao = gl.createVertexArray();
        gl.bindVertexArray(mainOutputVao);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.position), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(mainAttLocation[0]);
        gl.vertexAttribPointer(mainAttLocation[0], mainAttStride[0], gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, feedback[1]);
        gl.enableVertexAttribArray(mainAttLocation[1]);
        gl.vertexAttribPointer(mainAttLocation[1], mainAttStride[1], gl.FLOAT, false, 0, 0);
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(obj.index), gl.DYNAMIC_COPY);
        gl.vertexAttribDivisor(mainAttLocation[1], 1);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[1]);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        let mainVaos = [mainInputVao, mainOutputVao];
        gl.clearColor(242 / 255, 242 / 255, 232 / 255, 1.0);
        var startTime = new Date().getTime();
        let frame = 0;
        (function render() {
            gl.clear(gl.COLOR_BUFFER_BIT);
            let dist = 1 - frame;
            gl.useProgram(gpgpuProgram);
            gl.bindVertexArray(gpgpuVaos[frame]);
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[dist]);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[dist]);
            gl.enable(gl.RASTERIZER_DISCARD);
            gl.beginTransformFeedback(gl.POINTS);
            gl.drawArrays(gl.POINTS, 0, particleNum);
            gl.endTransformFeedback();
            let arrBuffer = new Float32Array(particleNum);
            gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, arrBuffer);
            console.log(arrBuffer);
            //console.log(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));
            gl.disable(gl.RASTERIZER_DISCARD);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
            gl.bindVertexArray(null);
            gl.useProgram(mainProgram);
            gl.uniform2fv(mainUniLocation[0], [cw, ch]);
            gl.uniform1f(mainUniLocation[1], (new Date().getTime() - startTime) * 0.001);
            gl.bindVertexArray(mainVaos[dist]);
            //  gl.drawElementsInstanced(gl.TRIANGLES, new Int16Array(obj.index).length, gl.UNSIGNED_SHORT, 0, particleNum);            
            gl.drawArraysInstanced(gl.TRIANGLES, 0, obj.position.length / 4, particleNum);
            gl.bindVertexArray(null);
            gl.flush();
            requestAnimationFrame(render);
        })();

        function create_vertex_shader(script) {
            var shader = gl.createShader(gl.VERTEX_SHADER);;
            gl.shaderSource(shader, script);
            gl.compileShader(shader);
            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                return shader;
            } else {
                alert(gl.getShaderInfoLog(shader));
                console.log(gl.getShaderInfoLog(shader));
            }
        }
        function create_fragment_shader(script) {
            var shader = gl.createShader(gl.FRAGMENT_SHADER);;
            gl.shaderSource(shader, script);
            gl.compileShader(shader);
            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                return shader;
            } else {
                alert(gl.getShaderInfoLog(shader));
                console.log(gl.getShaderInfoLog(shader));
            }
        }
        function create_gpgpu_program(vs, fs) {
            var program = gl.createProgram();
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.transformFeedbackVaryings(program, ["outPosition"], gl.SEPARATE_ATTRIBS);
            gl.linkProgram(program);
            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                gl.useProgram(program);
                return program;
            } else {
                return null;
            }
        }
        function create_main_program(vs, fs) {
            var program = gl.createProgram();
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                gl.useProgram(program);
                return program;
            } else {
                return null;
            }
        }
        window.addEventListener("resize", function (e) {
            cw = e.target.innerWidth;
            ch = e.target.innerHeight;
            c.width = cw;
            c.height = ch;
            gl.viewport(0, 0, cw, ch);
        });
    }
});