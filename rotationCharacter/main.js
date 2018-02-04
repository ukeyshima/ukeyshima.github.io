window.addEventListener("load", function () {
    var c = document.getElementById("canvas");
    var cw = window.innerWidth;
    var ch = window.innerHeight;
    let size=Math.min(cw,ch);
    c.width=size;
    c.height=size;
    cw=size;
    ch=size;
    c.style.width=size+"px";
    c.style.height=size+"px";
    var gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
    var prg = create_program(create_shader("vs"), create_shader("fs"));
    var uniLocation = [];
    uniLocation[0]=gl.getUniformLocation(prg,"texture0");
    uniLocation[1]=gl.getUniformLocation(prg,"texture1");
    uniLocation[2]=gl.getUniformLocation(prg,"texture2");
    uniLocation[3]=gl.getUniformLocation(prg,"texture3");
    uniLocation[4]=gl.getUniformLocation(prg,"texture4");
    uniLocation[5]=gl.getUniformLocation(prg,"texture5");
    uniLocation[6]=gl.getUniformLocation(prg,"texture6");
    uniLocation[7]=gl.getUniformLocation(prg,"texture7");
    uniLocation[8]=gl.getUniformLocation(prg,"texture8");
    uniLocation[9]=gl.getUniformLocation(prg,"texture9");
    uniLocation[10]=gl.getUniformLocation(prg,"time");

    var attLocation = [];
    var attStride = [];

    var particleNum = 10;
    var position = new Array(particleNum * 3).fill(0);
    let vPosition = create_vbo(position);

    attLocation[0] = gl.getAttribLocation(prg, "position");
    attStride[0] = 3;    
    
    gl.clearColor(242.0/255.0,242.0/255.0,232.0/255.0, 1.0);
    var startTime = new Date().getTime();

    let texture =[];
    for(let i=0;i<10;i++){
        create_texture(i);        
    }
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
    (function render() {
        gl.clear(gl.COLOR_BUFFER_BIT); 
        gl.useProgram(prg);           
        
        for(let i=0;i<10;i++){
            eval("gl.activeTexture(gl.TEXTURE"+i+");");
            gl.bindTexture(gl.TEXTURE_2D, texture[i]);   
            gl.uniform1i(uniLocation[i], i); 
        }
    
        gl.uniform1f(uniLocation[10],(new Date().getTime()-startTime)*0.001);                                 
        set_attribute([vPosition],attLocation,attStride);
        gl.drawArrays(gl.POINTS, 0, particleNum);                
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
    function create_program(vs, fs) {
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

   function create_vbo(data) {
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    }
    function set_attribute(vbo, attL, attS) {
        for (var i in vbo) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
            gl.enableVertexAttribArray(attL[i]);
            gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
        }
    }
    function create_texture(num) {        
        eval(`const img = new Image();
        img.addEventListener("load", function () {
            const tex = gl.createTexture();
            gl.activeTexture(gl.TEXTURE`+num+`);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D,0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            texture[`+num+`] = tex;
        });
        img.src = "texture/`+num+`.png";`);
    }
    
    window.addEventListener("resize", function (e) {
        cw = e.target.innerWidth;
        ch = e.target.innerHeight;
        let size=Math.min(cw,ch);
        c.width = size;
        c.height = size;
        c.style.width=size+"px";
        c.style.height=size+"px";
        gl.viewport(0, 0, size, size);
    });
});