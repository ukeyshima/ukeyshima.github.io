window.addEventListener("load", () => {
    const c = document.getElementById("canvas");
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    c.width = cw; c.height = ch;
    const gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
    let vs, fs;
    const vertexShaderText = new XMLHttpRequest();
    vertexShaderText.open("get", "vertexShader.glsl", true);
    vertexShaderText.addEventListener("load", function () {
        vs = this.responseText;
        if (fs) {
            webGLStart();
        }
    });
    vertexShaderText.send(null);

    const fragmentShaderText = new XMLHttpRequest();
    fragmentShaderText.open("get", "fragmentShader.glsl", true);
    fragmentShaderText.addEventListener("load", function () {
        fs = this.responseText;
        if (vs) {
            webGLStart();
        }
    });
    fragmentShaderText.send(null);

    const webGLStart = () => {
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
        }
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
        }
        const create_vbo = (data) => {
            const vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_COPY);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            return vbo;
        }
        const create_ibo = (data) => {
            const ibo = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            return ibo;
        }
        const set_attribute = (vbo, attL, attS) => {
            for (let i in vbo) {
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
                gl.enableVertexAttribArray(attL[i]);
                gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
            }
        }
        const create_framebuffer = (width, height) => {
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var depthRenderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
            var fTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, fTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return { f: frameBuffer, d: depthRenderBuffer, t: fTexture };
        }
        let texture;
        function create_texture() {
            const canvas = document.createElement("canvas");
            canvas.width = cw;
            canvas.height = ch;            
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, cw, ch);
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
        const prg = create_program(create_shader(vs, gl.VERTEX_SHADER), create_shader(fs, gl.FRAGMENT_SHADER));
        const uniLocation = new Array();
        uniLocation[0] = gl.getUniformLocation(prg, "resolution");
        uniLocation[1] = gl.getUniformLocation(prg, "time");
        uniLocation[2] = gl.getUniformLocation(prg, "tex");
        uniLocation[3] = gl.getUniformLocation(prg, "useTexture");
        uniLocation[4] = gl.getUniformLocation(prg, "count");

        const position = [
            -1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0
        ];
        const index = [
            0, 2, 1,
            1, 2, 3
        ];
        const textureCoord = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ];

        const attLocation = new Array();
        const attStride = new Array();

        let vPosition = create_vbo(position);
        attLocation[0] = gl.getAttribLocation(prg, "position");
        attStride[0] = 3;
        const vTextureCoord = create_vbo(textureCoord);
        attLocation[1] = gl.getAttribLocation(prg, "textureCoord");
        attStride[1] = 2;

        let vIndex = create_ibo(index);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);

        const fBuffer = [];
        fBuffer[0] = create_framebuffer(cw, ch);
        fBuffer[1] = create_framebuffer(cw, ch);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        const startTime = new Date().getTime();
        create_texture();

        let count = 0;
        const render = () => {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer[0].f);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform2fv(uniLocation[0], [cw, ch]);
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
                gl.uniform2fv(uniLocation[0], [cw, ch]);
                gl.uniform1f(uniLocation[1], (new Date().getTime() - startTime) * 0.001);
                gl.uniform1i(uniLocation[3], true);
                gl.uniform1f(uniLocation[4], count);
                gl.bindTexture(gl.TEXTURE_2D, fBuffer[1-dist].t);
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
                //requestAnimationFrame(renderLoop);
                setTimeout(renderLoop, 200);
            };
            renderLoop();
        };
        render();

        window.addEventListener("resize", (e) => {
        /*    cw = e.target.innerWidth;
            ch = e.target.innerHeight;
            c.width = cw;
            c.height = ch;            
            gl.viewport(0, 0, cw, ch);*/
        });
    }
});