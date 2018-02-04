window.addEventListener("load", function () {
    var httpObj = new XMLHttpRequest();
    httpObj.open("get", "data.json", true);
    httpObj.addEventListener("load", function () {
        var json = JSON.parse(this.responseText);
        var c = document.getElementById("canvas");
        var cw = window.innerWidth;
        var ch = window.innerHeight;
        c.width = cw; c.height = ch;
        var gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
        var gpgpuProgram = create_gpgpu_program(create_shader("gpgpuVs"), create_shader("gpgpuFs"));
        var gpgpuUniLocation = [];
        var gpgpuAttLocation = [];
        var gpgpuAttStride = [];
        var particleNum = 30;
        var position = new Array(particleNum * 3).fill(0).map(function(e,i,a){
            if (i % 3 == 0) {
                return 10.0+(Math.random()) * 10.0;
            } else if (i % 3 == 1) {
                return 5.0+(Math.random()) * 5.0;
            } else {
                return 0 ;
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
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[0]);

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
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

        var gpgpuOutputVao = gl.createVertexArray();
        gl.bindVertexArray(gpgpuInputVao);
        gl.bindBuffer(gl.ARRAY_BUFFER, feedback[1]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboList[0]), gl.DYNAMIC_COPY);
        gl.enableVertexAttribArray(gpgpuAttLocation[0]);
        gl.vertexAttribPointer(gpgpuAttLocation[0], gpgpuAttStride[0], gl.FLOAT, false, 0, 0);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback[1]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedback[1]);

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
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

        let gpgpuVaos = [gpgpuInputVao, gpgpuOutputVao];

        var mainProgram = create_main_program(create_shader("vs"), create_shader("fs"));
        var mainUniLocation = [];
        mainUniLocation[0] = gl.getUniformLocation(mainProgram, "resolution");
        mainUniLocation[1] = gl.getUniformLocation(mainProgram, "time");
        var mainAttLocation = [];
        var mainAttStride = [];
        var obj = {
            "position": json.data.attributes.position.array,
            "normal": json.data.attributes.normal.array,
            "index": json.data.index.array
        }
        mainAttLocation[0] = gl.getAttribLocation(mainProgram, "position");
        mainAttStride[0] = 3;
        mainAttLocation[1] = gl.getAttribLocation(mainProgram, "normal");
        mainAttStride[1] = 3;
        mainAttLocation[2] = gl.getAttribLocation(mainProgram, "offset");
        mainAttStride[2] = 3;

        var mainInputVao = gl.createVertexArray();
        gl.bindVertexArray(mainInputVao);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.position), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(mainAttLocation[0]);
        gl.vertexAttribPointer(mainAttLocation[0], mainAttStride[0], gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.normal), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(mainAttLocation[1]);
        gl.vertexAttribPointer(mainAttLocation[1], mainAttStride[1], gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, feedback[0]);
        gl.enableVertexAttribArray(mainAttLocation[2]);
        gl.vertexAttribPointer(mainAttLocation[2], mainAttStride[2], gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(mainAttLocation[2], 1);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(obj.index), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        var mainOutputVao = gl.createVertexArray();
        gl.bindVertexArray(mainOutputVao);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.position), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(mainAttLocation[0]);
        gl.vertexAttribPointer(mainAttLocation[0], mainAttStride[0], gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.normal), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(mainAttLocation[1]);
        gl.vertexAttribPointer(mainAttLocation[1], mainAttStride[1], gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, feedback[1]);
        gl.enableVertexAttribArray(mainAttLocation[2]);
        gl.vertexAttribPointer(mainAttLocation[2], mainAttStride[2], gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(mainAttLocation[2], 1);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(obj.index), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        let mainVaos = [mainInputVao, mainOutputVao];

        gl.clearColor(242 / 255, 242 / 255, 232 / 255, 1.0);
        var startTime = new Date().getTime();
        let frame = 0;
        (function render() {
            gl.clear(gl.COLOR_BUFFER_BIT);
            let dist = 1 - frame,
                vao = gpgpuVaos[frame],
                vbo = feedback[dist],
                trans = transformFeedback[dist];
            gl.useProgram(gpgpuProgram);
            gl.bindVertexArray(vao);
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, trans);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, vbo);
            gl.enable(gl.RASTERIZER_DISCARD);
            gl.beginTransformFeedback(gl.POINTS);
            gl.drawArrays(gl.POINTS, 0, particleNum);
            gl.endTransformFeedback();
            gl.disable(gl.RASTERIZER_DISCARD);
            gl.bindVertexArray(null);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
            gl.useProgram(mainProgram);
            gl.uniform2fv(mainUniLocation[0],[cw,ch]);
            gl.uniform1f(mainUniLocation[1],(new Date().getTime()-startTime)*0.001);
            gl.bindVertexArray(mainVaos[dist]);
            gl.drawElementsInstanced(gl.TRIANGLES, new Int16Array(obj.index).length, gl.UNSIGNED_SHORT, 0, particleNum);
            gl.flush();
            requestAnimationFrame(render);
        })();

        function create_shader(id) {
            var shader;
            var scriptElement = document.getElementById(id);
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
    });
    httpObj.send(null);

});