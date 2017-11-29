window.addEventListener("load", function () {
    const c = document.getElementById("canvas");
    let cw = window.innerHeight;
    let ch = window.innerHeight;
    c.width = cw; c.height = ch;
    const gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
    const prg = create_program(create_shader(0, gl), create_shader(1, gl), gl);
    const uniLocation = new Array();
    uniLocation[0] = gl.getUniformLocation(prg, "time");
    uniLocation[1] = gl.getUniformLocation(prg, "resolution");
    uniLocation[2] = gl.getUniformLocation(prg, "tex");

    const position = [
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ];
    const textureCoord = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ];

    const vPosition = create_vbo(position, gl);
    const vTextureCoord = create_vbo(textureCoord, gl);
    const vAttLocation = new Array();
    vAttLocation[0] = gl.getAttribLocation(prg, "position");
    const vAttStride = new Array();
    vAttStride[0] = 3;
    set_attribute([vPosition], vAttLocation, vAttStride, gl);

    const index = [
        0, 2, 1,
        1, 2, 3
    ];
    const vIndex = create_ibo(index, gl);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    let video = document.getElementById("video");
    let localStream = null;
    navigator.getUserMedia({ video: true, audio: false },
        function (stream) { video.src = window.URL.createObjectURL(stream); },
        function (err) { console.log(err); });

    const videoTexture = gl.createTexture(gl.TEXTURE_2D);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, videoTexture);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    texture = videoTexture;

    const startTime = new Date().getTime();
    (function () {
        let time = (new Date().getTime() - startTime) * 0.001;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uniLocation[0], time);
        gl.uniform2fv(uniLocation[1], [cw, ch]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uniLocation[2], 0);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        gl.flush();
        requestAnimationFrame(arguments.callee);
    })();
    window.addEventListener("resize", function (e) {
        cw = e.target.innerWidth;
        ch = e.target.innerHeight;
        c.width = cw;
        c.height = ch;
        gl.viewport(0, 0, cw, ch);
    });
    function create_shader(id, gl) {
        let shader;
        const scriptElement = document.getElementsByTagName("script");
        if (!scriptElement[id]) { return; }
        switch (scriptElement[id].type) {
            case "vertexShader":
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;
            case "fragmentShader":
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default:
                return;
        }
        gl.shaderSource(shader, scriptElement[id].text);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        } else {
            alert(gl.getShaderInfoLog(shader));
            console.log(gl.getShaderInfoLog(shader));
        }
    }
    function create_program(vs, fs, gl) {
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
    function create_vbo(data, gl) {
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    }
    function create_ibo(data, gl) {
        const ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return ibo;
    }
    function set_attribute(vbo, attL, attS, gl) {
        for (var i in vbo) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
            gl.enableVertexAttribArray(attL[i]);
            gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
        }
    }
});