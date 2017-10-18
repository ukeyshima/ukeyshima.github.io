window.addEventListener("load", function () {
    const result = document.getElementById("result");
    result.width = window.innerWidth;
    result.height = window.innerHeight * 0.2;
    const ctx = result.getContext("2d");
    ctx.fillStyle = "#113311";
    ctx.fillRect(0, 0, result.width, result.height);
    const c = document.getElementById("calculation");
    let cw = window.innerWidth;
    let ch = Math.floor(window.innerHeight * 0.8);
    c.width = cw; c.height = ch;
    const gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");

    const prg = create_program(create_shader("vs"), create_shader("fs"));

    const uniLocation = new Array();
    uniLocation[0] = gl.getUniformLocation(prg, "resolution");
    uniLocation[1] = gl.getUniformLocation(prg, "mouse");
    uniLocation[2] = gl.getUniformLocation(prg, "click");
    uniLocation[3] = gl.getUniformLocation(prg, "usegpu");

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
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2fv(uniLocation[0], [cw, ch]);
    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
    gl.flush();

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
    window.addEventListener("resize", function (e) {
        cw = e.target.innerWidth;
        ch = Math.floor(e.target.innerHeight * 0.8);
        c.width = cw;
        c.height = ch;
        gl.viewport(0, 0, cw, ch);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2fv(uniLocation[0], [cw, ch]);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
        gl.flush();
    });
    let keyBuffer = new Array();
    let script = "";
    let c2 = document.createElement("canvas");
    let gl2 = c2.getContext("webgl2");
    let vertexShader;
    let fragmentShader;
    let program2;
    let vTransformFeedback = gl2.createBuffer();
    let transformFeedback = gl2.createTransformFeedback();
    let usegpu=false;
    c.addEventListener("mousedown", function (e) {
        gl.uniform2fv(uniLocation[1], [e.clientX, e.clientY-result.height]);
        gl.uniform1i(uniLocation[2], true);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2fv(uniLocation[0], [cw, ch]);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
        gl.flush();
        let keyNumber = Math.floor((ch - (e.clientY-result.height)) / (ch / 5.0)) * 4.0 + Math.floor((e.clientX) / (cw / 4.0));
        let operator = "undifined";
        switch (keyNumber) {
            case 0:
                keyNumber = "0";
                break;
            case 1:
                keyNumber = "0";
                break;
            case 2:
                operator = ".";
                break;
            case 3:
                operator = "=";
                break;
            case 4:
                keyNumber = "1";
                break;
            case 5:
                keyNumber = "2";
                break;
            case 6:
                keyNumber = "3";
                break;
            case 7:
                operator = "+";
                break;
            case 8:
                keyNumber = "4";
                break;
            case 9:
                keyNumber = "5";
                break;
            case 10:
                keyNumber = "6";
                break;
            case 11:
                operator = "-";
                break;
            case 12:
                keyNumber = "7";
                break;
            case 13:
                keyNumber = "8";
                break;
            case 14:
                keyNumber = "9";
                break;
            case 15:
                operator = "*";
                break;
            case 16:
                keyBuffer = new Array();
                script = "";
                ctx.fillStyle = "#113311";
                ctx.fillRect(0, 0, result.width, result.heights);
                break;
            case 17:
                usegpu=!usegpu;
                gl.uniform1i(uniLocation[3], usegpu);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
                gl.flush();
                break;
            case 18:


                break;
            case 19:
                operator = "/";
                break;
                defalut:
                break;
        }
        if (keyNumber != 16 && keyNumber != 17 && keyNumber != 18) {
            if (keyBuffer.length > 0) {
                if (keyBuffer[keyBuffer.length - 1].type == "number") {
                    if (operator == "undifined") {
                        keyBuffer.push({ type: "number", key: keyNumber });
                        if (script == "0") {
                            script = keyNumber;
                        } else {
                            script += keyNumber;
                        }
                    } else {
                        keyBuffer.push({ type: "operator", key: operator });
                        if (operator == ".") {
                            if (Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/")) != -1) {
                                if (script.slice(Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/"))).indexOf(".") == -1) {
                                    script += operator;
                                }
                            } else {
                                if (script.indexOf(".") == -1) {
                                    script += operator;
                                }
                            }
                        } else if (operator == "=") {
                            if (Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/")) != -1) {
                                if (script.slice(Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/"))).indexOf(".") == -1) {
                                    script += ".0";
                                }
                            } else {
                                if (script.indexOf(".") == -1) {
                                    script += ".0";
                                }
                            }

                            let result =usegpu? "" + calculate():""+calculate2();
                            keyBuffer = new Array();
                            keyBuffer.push({ type: "number", key: result });
                            script = result;
                        } else {
                            if (Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/")) != -1) {
                                if (script.slice(Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/"))).indexOf(".") == -1) {
                                    script += ".0" + operator;
                                } else {
                                    script += operator;
                                }
                            } else {
                                if (script.indexOf(".") == -1) {
                                    script += ".0" + operator;
                                } else {
                                    script += operator;
                                }
                            }
                        }
                    }
                } else {
                    if (operator == "undifined") {
                        keyBuffer.push({ type: "number", key: keyNumber });
                        script += keyNumber;
                    }
                }
            } else if (operator == ".") {
                script = "0.";
            } else if (operator != "undifined") {
                console.log("error!");
            } else {
                keyBuffer.push({ type: "number", key: keyNumber });
                script += keyNumber;
            }
        }
        let script2=script;
        if (Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/")) != -1) {
            if (script.slice(Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/"))).indexOf(".") == -1 && script.slice(Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/")))!="+" && script.slice(Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/")))!="-" &&  script.slice(Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/")))!="*" &&  script.slice(Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/")))!="/") {
                console.log(script.slice(Math.max(script.lastIndexOf("+"), script.lastIndexOf("-"), script.lastIndexOf("*"), script.lastIndexOf("/"))));
                script2 += ".0";
            }
        } else {
            if (script.indexOf(".") == -1 && script!="") {
                script2 += ".0";
            }
        }
        let fontSize = result.height*0.6;
        if (script.length * fontSize*0.7 > result.width ) fontSize = result.width/ script.length/0.7;
        ctx.font = fontSize + "px 'ＭＳ Ｐゴシック'";
        ctx.fillStyle = "#113311";
        ctx.fillRect(0, 0, result.width, result.height);
        ctx.fillStyle = "#bbbbbb";
        ctx.textBaseline = "middle";
        ctx.textAlign = "right";
        ctx.fillText(script2, result.width, result.height / 2);
    });
    c.addEventListener("mouseup", function (e) {
        gl.uniform1i(uniLocation[2], false);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
        gl.flush();
    });
    function calculate() {
        let scriptText = "#version 300 es \n out float result; void main(void){result=";
        scriptText += script;
        scriptText += ";}";
        //let script="#version 300 es \n out float result; void main(void){ result=0.0; for(int i=0;i<1000000000;i++){result++;}}";
        //console.log(script);
        vertexShader = gl2.createShader(gl2.VERTEX_SHADER);
        gl2.shaderSource(vertexShader, scriptText);
        gl2.compileShader(vertexShader);
        /*if (!gl2.getShaderParameter(vertexShader, gl2.COMPILE_STATUS)) {
            alert("vertexShader2:"+gl2.getShaderInfoLog(vertexShader));
            console.log(gl2.getShaderInfoLog(vertexShader));
        }*/
        scriptText = "#version 300 es \n void main(void){}";
        fragmentShader = gl2.createShader(gl2.FRAGMENT_SHADER);
        gl2.shaderSource(fragmentShader, scriptText);
        gl2.compileShader(fragmentShader);
        /*if (!gl2.getShaderParameter(fragmentShader, gl2.COMPILE_STATUS)) {
            alert("fragmentShader2:"+gl2.getShaderInfoLog(fragmentShader));
            console.log(gl2.getShaderInfoLog(fragmentShader));
        }*/
        program2 = gl2.createProgram();
        gl2.attachShader(program2, vertexShader);
        gl2.attachShader(program2, fragmentShader);
        gl2.transformFeedbackVaryings(program2, ["result"], gl2.SEPARATE_ATTRIBS);
        gl2.linkProgram(program2);
        gl2.useProgram(program2);
        /*if (gl2.getProgramParameter(program, gl2.LINK_STATUS)) {
            gl2.useProgram(program);
        } else {
            alert("program_error");
        }*/
        vTransformFeedback = gl2.createBuffer();
        transformFeedback = gl2.createTransformFeedback();

        gl2.bindBuffer(gl2.ARRAY_BUFFER, vTransformFeedback);
        gl2.bufferData(gl2.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT, gl2.DYNAMIC_COPY);
        gl2.bindBuffer(gl2.ARRAY_BUFFER, null);
        gl2.bindTransformFeedback(gl2.TRANSFORM_FEEDBACK, transformFeedback);
        gl2.bindBufferBase(gl2.TRANSFORM_FEEDBACK_BUFFER, 0, vTransformFeedback);
        gl2.beginTransformFeedback(gl2.POINTS);
        gl2.drawArrays(gl2.POINTS, 0, 1);
        gl2.endTransformFeedback();
        var arrBuffer = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
        arrBuffer = new Float32Array(arrBuffer);
        gl2.getBufferSubData(gl2.TRANSFORM_FEEDBACK_BUFFER, 0, arrBuffer);
        return arrBuffer[0];
    }
    function calculate2() {
        return eval(script);
    }
});