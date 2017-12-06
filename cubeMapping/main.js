let cubeTexture = null;
window.addEventListener("load", function () {
    const c = document.getElementById("canvas");
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    c.width = cw; c.height = ch;
    const gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");   
    const prg = create_program(create_shader("vs", gl), create_shader("fs", gl), gl);
    const uniLocation = new Array();
    uniLocation[0] = gl.getUniformLocation(prg, "time");
    uniLocation[1] = gl.getUniformLocation(prg, "cubeTexture");
    uniLocation[2] = gl.getUniformLocation(prg, "useTexture");
    uniLocation[3] = gl.getUniformLocation(prg, "object");
    uniLocation[4] = gl.getUniformLocation(prg, "resolution");

    let cubeData = cube(2.0);
    let cPosition = create_vbo(cubeData.p, gl);
    let cNormal = create_vbo(cubeData.n, gl);
    let cVBOList = [cPosition, cNormal];

    let sphereData = sphere(64, 64, 0.3);
    let sPosition = create_vbo(sphereData.p, gl);
    let sNormal = create_vbo(sphereData.n, gl);
    let sVBOList = [sPosition, sNormal];

    let attLocation = new Array();
    attLocation[0] = gl.getAttribLocation(prg, "position");
    attLocation[1] = gl.getAttribLocation(prg, "normal");
    let attStride = new Array();
    attStride[0] = 3;
    attStride[1] = 3;

    let cIndex = create_ibo(cubeData.i, gl);
    let sIndex = create_ibo(sphereData.i, gl);

    let cubeSource = ["posx.jpg", "posy.jpg", "posz.jpg", "negx.jpg", "negy.jpg", "negz.jpg"];
    create_cube_texture(cubeSource, gl);
    gl.activeTexture(gl.TEXTURE0);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    const startTime = new Date().getTime();

    (function () {
        let time = (new Date().getTime() - startTime) * 0.001;
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);        

        gl.uniform2fv(uniLocation[4], [cw, ch]);
        gl.uniform1f(uniLocation[0], time);

        set_attribute(cVBOList, attLocation, attStride, gl);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cIndex);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
        gl.uniform1i(uniLocation[1], 0);
        gl.uniform1i(uniLocation[2], true);
        gl.uniform1i(uniLocation[3], 0);
        gl.drawElements(gl.TRIANGLES, cubeData.i.length, gl.UNSIGNED_SHORT, 0);    

        for(let i=1;i<100;i++){
            set_attribute(sVBOList, attLocation, attStride, gl);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sIndex);
            gl.uniform1i(uniLocation[2], false);
            gl.uniform1i(uniLocation[3], i);
            gl.drawElements(gl.TRIANGLES, sphereData.i.length, gl.UNSIGNED_SHORT, 0); 
        }

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
});
function create_shader(id, gl) {
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
    for (let i in vbo) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
        gl.enableVertexAttribArray(attL[i]);
        gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
    }
}
function create_texture(source, gl) {
    let img = new Image();
    img.addEventListener("load", function () {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        texture = tex;
    }, false);
    img.src = source;
}

function create_cube_texture(source, gl) {
    let target = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];
    let img = new Array();
    let cubeTextureLoaded = new Array();
    for (let i = 0; i < 6; i++) {
        img[i] = new Image();
        img[i].src = source[i];
        img[i].onload = function () {
            cubeTextureLoaded[i] = true;
            if (cubeTextureLoaded[0] && cubeTextureLoaded[1] && cubeTextureLoaded[2] && cubeTextureLoaded[3] && cubeTextureLoaded[4] && cubeTextureLoaded[5]) {
                genelateCubeMap();
            }
        }
    }
    function genelateCubeMap() {
        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
        for (let j = 0; j < 6; j++) {
            gl.texImage2D(target[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
        }
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        cubeTexture = tex;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }
}
function cube(side) {
    var hs = side * 0.5;
    var pos = [
        -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, hs,
        -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs, -hs,
        -hs, hs, -hs, -hs, hs, hs, hs, hs, hs, hs, hs, -hs,
        -hs, -hs, -hs, hs, -hs, -hs, hs, -hs, hs, -hs, -hs, hs,
        hs, -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs,
        -hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs
    ];
    var nor = [
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
    ];

    var idx = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ];
    return { p: pos, n: nor, i: idx };
}

function sphere(row, column, rad) {
    var pos = new Array(), nor = new Array(),idx = new Array();
    for (var i = 0; i <= row; i++) {
        var r = Math.PI / row * i;
        var ry = Math.cos(r);
        var rr = Math.sin(r);
        for (var ii = 0; ii <= column; ii++) {
            var tr = Math.PI * 2 / column * ii;
            var tx = rr * rad * Math.cos(tr);
            var ty = ry * rad;
            var tz = rr * rad * Math.sin(tr);
            var rx = rr * Math.cos(tr);
            var rz = rr * Math.sin(tr);
            pos.push(tx, ty, tz);
            nor.push(rx, ry, rz);                        
        }
    }
    r = 0;
    for (i = 0; i < row; i++) {
        for (ii = 0; ii < column; ii++) {
            r = (column + 1) * i + ii;
            idx.push(r, r + 1, r + column + 2);
            idx.push(r, r + column + 2, r + column + 1);
        }
    }
    return { p: pos, n: nor, i: idx };
}