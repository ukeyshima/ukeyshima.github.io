window.addEventListener("load", function () {
    const c = document.getElementById("canvas");
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    c.width = cw; c.height = ch;
    const gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
    const prg = create_program(create_shader("vs"), create_shader("fs"));
    const uniLocation = new Array();
    uniLocation[0] = gl.getUniformLocation(prg, "time");
    uniLocation[1] = gl.getUniformLocation(prg, "resolution");

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
    
    const vAttLocation = new Array();
    const vAttStride = new Array();

    let vPosition = create_vbo(position);
    vAttLocation[0] = gl.getAttribLocation(prg, "position");
    vAttStride[0] = 3;

    set_attribute([vPosition], vAttLocation, vAttStride);

    let vIndex = create_ibo(index);    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const startTime = new Date().getTime();
    (function () {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uniLocation[0], (new Date().getTime()-startTime)*0.001);
        gl.uniform2fv(uniLocation[1], [cw, ch]);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
        gl.flush();
        requestAnimationFrame(arguments.callee);
    })();


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
    window.addEventListener("resize",function(e){
        cw=e.target.innerWidth;
        ch=e.target.innerHeight;
        c.width=cw;
        c.height=ch;
        gl.viewport(0,0,cw,ch);
     });    
});