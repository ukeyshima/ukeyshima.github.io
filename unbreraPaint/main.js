window.addEventListener("load", function () {
    var drawFrame = document.getElementById("drawFrame");
    var draw = document.getElementById("draw");
    var unbreraGUIFrontFrame = document.getElementById("unbreraGUIFrontFrame");
    var unbreraGUIFrame = document.getElementById("unbreraGUIFrame");
    var unbreraGUI = document.getElementById("unbreraGUI");
    var drawColor = document.getElementById("drawColor");
    var drawContext = draw.getContext("2d");
    var unbreraGUIContext = unbreraGUI.getContext("2d");
    var drawColorGl = drawColor.getContext("webgl");
    var drawWidth = draw.clientWidth;
    var drawHeight = draw.clientWidth;
    draw.width = drawWidth;
    draw.height = drawHeight;
    var unbreraGUIWidth = unbreraGUIFrame.clientWidth * 30;
    var unbreraGUIHeight = unbreraGUIFrame.clientHeight;
    unbreraGUI.width = unbreraGUIWidth;
    unbreraGUI.height = unbreraGUIHeight;
    var drawColorWidth = drawColor.clientWidth;
    var drawColorHeight = drawColor.clientWidth;
    drawColor.width = drawColorWidth;
    drawColor.height = drawColorHeight;
    drawContext.fillStyle = "#fff";
    drawContext.fillRect(0, 0, drawWidth, drawHeight);
    drawContext.lineJoin = "round";
    drawContext.lineCap = "round";
    unbreraGUIContext.fillStyle = "#222";
    unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
    var drawFlag = false;
    var prevX, prevY;
    var strokeWidth = 1;
    var strokeColor = "rgb(0,0,0)";
    draw.addEventListener("mousedown", function (e) {
        drawFlag = true;
        prevX = e.layerX;
        prevY = e.layerY;
    });
    var undoStackDelta = [];
    draw.addEventListener("mousemove", function (e) {
        if (!drawFlag) return;
        var x = e.layerX;
        var y = e.layerY;
        drawContext.strokeStyle = strokeColor;
        drawContext.lineWidth = strokeWidth;
        drawContext.beginPath();
        drawContext.moveTo(prevX, prevY);
        drawContext.lineTo(x, y);
        drawContext.stroke();
        drawContext.closePath();
        prevX = x;
        prevY = y;
        undoStackDelta.push({
            x: e.layerX,
            y: e.layerY,
            color: strokeColor,
            width: strokeWidth,
        });
    });
    document.addEventListener("mouseup", function (e) {
        if (drawFlag) {
            drawFlag = false;
            var state = draw.toDataURL("image/webp", 1.0);
            execute(undoStackDelta, state);
            undoStackDelta = [];
        }
    });
    var drawThickness = document.getElementById("drawThickness");
    var drawThicknessPreview = document.getElementById("drawThicknessPreview");
    strokeWidth = drawThicknessPreview.innerHTML;
    drawThickness.addEventListener("change", function (e) {
        strokeWidth = e.target.value;
    }, false);
    drawThickness.addEventListener("input", function (e) {
        drawThicknessPreview.innerHTML = e.target.value;
    });
    drawColor.addEventListener("mousedown", function (e) {
        render();
        var u8 = new Uint8Array(4);
        drawColorGl.readPixels(e.layerX, this.clientWidth - e.layerY, 1, 1, drawColorGl.RGBA, drawColorGl.UNSIGNED_BYTE, u8);
        strokeColor = "rgb(" + u8[0] + "," + u8[1] + "," + u8[2] + ")";
    });
    var drawColorVertexShader = `
        attribute vec3 position;
        void main(void){
            gl_Position = vec4(position, 1.0);
        }
    `;
    var drawColorFragmentShader = `
        precision mediump float;
        uniform vec2 resolution;
        #define PI 3.141592
        vec3 hsv2rgb(vec3 c){
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        void main(void){
            vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);             
            vec3 color = step(length(p),1.0)*hsv2rgb(vec3(atan(p.x,p.y)/2.0/PI,length(p)*1.5,1.0));	
            gl_FragColor=vec4(color,1.0);
        }
    `;
    var drawColorProgram = create_program(create_shader(drawColorVertexShader, drawColorGl.VERTEX_SHADER, drawColorGl), create_shader(drawColorFragmentShader, drawColorGl.FRAGMENT_SHADER, drawColorGl), drawColorGl);
    var position = [
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ];
    var index = [
        0, 2, 1,
        1, 2, 3
    ];
    var uniLocation = new Array();
    var attLocation = new Array();
    var attStride = new Array();
    uniLocation[0] = drawColorGl.getUniformLocation(drawColorProgram, "resolution");
    var vPosition = create_vbo(position, drawColorGl);
    attLocation[0] = drawColorGl.getAttribLocation(drawColorProgram, "position");
    attStride[0] = 3;
    set_attribute([vPosition], attLocation, attStride, drawColorGl);
    var vIndex = create_ibo(index, drawColorGl);
    drawColorGl.viewport(0, 0, drawColorWidth, drawColorHeight);
    render();
    function render() {
        drawColorGl.bindBuffer(drawColorGl.ELEMENT_ARRAY_BUFFER, vIndex);
        drawColorGl.clearColor(0.0, 0.0, 0.0, 1.0);
        drawColorGl.clear(drawColorGl.COLOR_BUFFER_BIT);
        drawColorGl.uniform2fv(uniLocation[0], [drawColorWidth, drawColorHeight]);
        drawColorGl.drawElements(drawColorGl.TRIANGLES, index.length, drawColorGl.UNSIGNED_SHORT, 0);
        drawColorGl.flush();
    }
    function create_shader(text, usage, gl) {
        var shader = gl.createShader(usage);
        gl.shaderSource(shader, text);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        } else {
            alert(gl.getShaderInfoLog(shader));
            console.log(gl.getShaderInfoLog(shader));
        }
    }
    function create_program(vs, fs, gl) {
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
    function create_vbo(data, gl) {
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    }
    function create_ibo(data, gl) {
        var ibo = gl.createBuffer();
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
    window.addEventListener("resize", function (e) {
        drawWidth = draw.clientWidth;
        drawHeight = draw.clientWidth;
        draw.width = drawWidth;
        draw.height = drawHeight;
        drawContext.lineJoin = "round";
        drawContext.lineCap = "round";
        drawColorWidth = drawColor.clientWidth;
        drawColorHeight = drawColor.clientWidth;
        drawColor.width = drawColorWidth;
        drawColor.height = drawColorHeight;
        drawColorGl.viewport(0, 0, drawColorWidth, drawColorHeight);
        render();
        var img = new Image();
        img.onload = function () {
            drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
        }
        img.src = lastUndoStack().state;
    });

    var unbreraGUISizeChange=false;
    unbreraGUIFrontFrame.addEventListener("mousedown", function (e) {
        unbreraGUISizeChange = true;
    });
    unbreraGUIFrame.addEventListener("mousemove", function (e) {
        if (unbreraGUISizeChange) {
            let x = Math.floor(e.clientX - unbreraGUIFrame.getBoundingClientRect().left);
            unbreraGUIFrame.style.width = Math.floor(unbreraGUIFrame.clientWidth - x) + "px";
            drawFrame.style.width = Math.floor(drawFrame.clientWidth + x) + "px";
            drawWidth = draw.clientWidth;
            drawHeight = draw.clientWidth;
            draw.width = drawWidth;
            draw.height = drawHeight;
            drawContext.lineJoin = "round";
            drawContext.lineCap = "round";
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
            }
            img.src = lastUndoStack().state;
        }
    });    
    drawFrame.addEventListener("mousemove", function (e) {        
        if (unbreraGUISizeChange) {            
            let x = Math.floor(e.clientX - drawFrame.getBoundingClientRect().left);            
            unbreraGUIFrame.style.width = Math.floor(unbreraGUIFrame.clientWidth + (drawFrame.clientWidth - x)) + "px";                                                
            drawFrame.style.width = Math.floor(x) + "px";            
            drawWidth = draw.clientWidth;
            drawHeight = draw.clientWidth;
            draw.width = drawWidth;
            draw.height = drawHeight;
            drawContext.lineJoin = "round";
            drawContext.lineCap = "round";
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
            }
            img.src = lastUndoStack().state;
        }
    });
    
    unbreraGUIFrontFrame.addEventListener("mouseup", function (e) {
        if (unbreraGUISizeChange) {
            unbreraGUISizeChange = false;
        }
    });
    unbreraGUIFrame.addEventListener("mouseup", function (e) {
        if (unbreraGUISizeChange) {
            unbreraGUISizeChange = false;
        }
    });
    drawFrame.addEventListener("mouseup", function (e) {
        if (unbreraGUISizeChange) {
            unbreraGUISizeChange = false;
        }
    });
    var undoStack;
    var redoStack;
    var defalutDrawState = draw.toDataURL("image/webp", 1.0);
    var lastUnbraPoint;
    var lastUnbraNum;
    var unbraId;
    var undoStackObj = function (delta, state, branchPointId, isBranchPoint, branchStack) {
        this.delta = delta;
        this.state = state;
        this.branchPointId = branchPointId;
        this.isBranchPoint = isBranchPoint;
        this.branchStack = branchStack;
    }
    initUndoStack();
    unbreraGUIContext.fillStyle = "#222";
    unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
    createUnbreraGUI(undoStack, 50, 200, 0);
    function initUndoStack() {
        unbraId = 0;
        undoStack = [new undoStackObj([], defalutDrawState, 0, false, [])];
        redoStack = [];
        lastUnbraPoint = undoStack[0];
        lastUnbraNum = 0;
    };
    function undo() {
        if (hasUndo()) {
            var stack = undoStack.pop();
            redoStack.push(stack);
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
            }
            img.src = lastUndoStack().state;
            unbreraGUIContext.fillStyle = "#222";
            unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
            createUnbreraGUI(undoStack, 50, 200, 0);
        }
    }
    function redo() {
        if (hasRedo()) {
            var stack = redoStack.pop();
            undoStack.push(stack);
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
            }
            img.src = lastUndoStack().state;
            unbreraGUIContext.fillStyle = "#222";
            unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
            createUnbreraGUI(undoStack, 50, 200, 0);
        }
    }

    function execute(delta, state) {
        if (hasRedo()) {
            if (lastUndoStack().branchStack.length == 0) {
                if (!redoStack.some(function (e, i, a) { return e.isBranchPoint })) {
                    for (let i = 0; i < redoStack.length; i++) {
                        lastUnbraPoint.branchStack[unbraId].shift();
                    }
                }
            }
            lastUnbraNum = undoStack.length - 1;
            lastUnbraPoint = undoStack[lastUnbraNum];
            lastUnbraPoint.isBranchPoint = true;
            if (lastUnbraPoint.branchStack.length == 0) {
                let num = redoStack.indexOf(redoStack.slice().reverse().find(function (e, i, a) {
                    return e.isBranchPoint;
                }));
                if (num < 0) {
                    lastUnbraPoint.branchStack[0] = redoStack.slice();
                } else {
                    lastUnbraPoint.branchStack[0] = redoStack.slice(num, redoStack.length);
                }
                lastUnbraPoint.branchStack[0].forEach(function (e, i, a) {
                    e.branchPointId = 0;
                });
            }
            lastUnbraPoint.branchStack.push([]);
            unbraId = lastUnbraPoint.branchStack.length - 1;
        }
        undoStack.push(new undoStackObj(delta, state, unbraId, false, []));
        redoStack = [];
        lastUnbraPoint.branchStack[unbraId] = undoStack.slice(lastUnbraNum + 1, undoStack.length).reverse();
        unbreraGUIContext.fillStyle = "#222";
        unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
        createUnbreraGUI(undoStack, 50, 200, 0);
    }
    function hasUndo() {
        return undoStack.length > 1;
    }
    function hasRedo() {
        return redoStack.length > 0;
    }
    function lastUndoStack() {
        return undoStack[undoStack.length - 1];
    }
    function unbra() {
        let branchPointStack = undoStack.slice().filter(function (e, i, a) {
            e.indexNum = i;
            return e.isBranchPoint;
        });
        let currentId = branchPointStack.map(function (e, i, a) {
            return e.branchPointId;
        });
        if (!lastUndoStack().isBranchPoint) {
            currentId.push(lastUndoStack().branchPointId);
        }
        let lastNumber = currentId.slice().reverse().find(function (e, i, a) {
            return e > 0;
        });
        let nextBranchPointNum = currentId.lastIndexOf(lastNumber) - 1;
        let nextBranchPoint = branchPointStack[nextBranchPointNum];
        let targetBranchId = lastNumber - 1;
        let nextBranchPointIndex = nextBranchPoint.indexNum;
        let j = undoStack.length - (nextBranchPointIndex + 1);
        for (let i = 0; i < j; i++) {
            undo();
        }
        (function (stack) {
            let j = stack.length;
            for (let i = 0; i < j; i++) {
                var deltaStack = stack[j - 1 - i];
                undoStack.push(deltaStack);
            }
            if (stack[0].isBranchPoint) {
                arguments.callee(stack[0].branchStack[stack[0].branchStack.length - 1].slice());
            }
        })(nextBranchPoint.branchStack[targetBranchId]);
        var img = new Image();
        img.onload = function () {
            drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
        }
        img.src = lastUndoStack().state;
        redoStack = [];
        lastUnbraNum = undoStack.lastIndexOf(undoStack.slice().reverse().find(function (e, i, a) {
            return e.isBranchPoint;
        }));
        lastUnbraPoint = undoStack[lastUnbraNum];
        unbraId = lastUndoStack().branchPointId;
    };
    function rebra() {
        let branchPointStack = undoStack.slice().filter(function (e, i, a) {
            e.indexNum = i;
            return e.isBranchPoint;
        });
        let currentId = branchPointStack.map(function (e, i, a) {
            return e.branchPointId;
        });
        if (!lastUndoStack().isBranchPoint) {
            currentId.push(lastUndoStack().branchPointId);
        }
        let targetBranchId = 0;
        let nextBranchPoint = branchPointStack.slice().reverse().find(function (e, i, a) {
            targetBranchId = currentId.slice().reverse()[i] + 1;
            return e.branchStack.length > currentId.slice().reverse()[i] + 1;
        });
        let nextBranchPointIndex = nextBranchPoint.indexNum;
        let j = undoStack.length - (nextBranchPointIndex + 1);
        for (let i = 0; i < j; i++) {
            undo();
        }
        (function (stack) {
            let j = stack.length;
            for (let i = 0; i < j; i++) {
                var deltaStack = stack[j - 1 - i];
                undoStack.push(deltaStack);
            }
            if (stack[0].isBranchPoint) {
                arguments.callee(stack[0].branchStack[0].slice());
            }
        })(nextBranchPoint.branchStack[targetBranchId]);
        var img = new Image();
        img.onload = function () {
            drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
        }
        img.src = lastUndoStack().state;
        redoStack = [];
        lastUnbraNum = undoStack.lastIndexOf(undoStack.slice().reverse().find(function (e, i, a) {
            return e.isBranchPoint;
        }));
        lastUnbraPoint = undoStack[lastUnbraNum];
        unbraId = lastUndoStack().branchPointId;
    };

    function createUnbreraGUI(stack, x, y, i) {
        for (let i = 0; i < stack.length; i++) {
            if (i < stack.length - 1) {
                unbreraGUIContext.strokeStyle = "#38e";
                unbreraGUIContext.lineWidth = 5;
                unbreraGUIContext.beginPath();
                unbreraGUIContext.moveTo(x + i * 150 + 50, y + 50);
                unbreraGUIContext.lineTo(x + (i + 1) * 150 + 50, y + 50);
                unbreraGUIContext.stroke();
            }
            let img = new Image();
            img.addEventListener("load", function () {
                unbreraGUIContext.drawImage(img, x + i * 150, y, 100, 100)
            });
            img.src = stack[i].state;
            if (stack[i].isBranchPoint) {
                for (let j = 0; j < stack[i].branchStack.length; j++) {
                    unbreraGUIContext.strokeStyle = "#38e";
                    unbreraGUIContext.lineWidth = 5;
                    unbreraGUIContext.beginPath();
                    unbreraGUIContext.moveTo(x + i * 150 + 50, y + 50);
                    unbreraGUIContext.lineTo(x + (i + 1) * 150 + 50, y + 150 * j + 50);
                    unbreraGUIContext.stroke();
                    let img = new Image();
                    img.addEventListener("load", function () {
                        unbreraGUIContext.drawImage(img, x + i * 150, y, 100, 100)
                    });
                    img.src = stack[i].state;
                    createUnbreraGUI(stack[i].branchStack[j].slice().reverse(), x + (i + 1) * 150, y + 150 * j, i + j);
                }
                break;
            }
        }
    }
    function undoRedoKeydown(e) {
        e = window.event || e;
        if (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
            redo();
        } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
            undo();
        }
    }
    function unbraRebraKeydown(e) {
        e = window.event || e;
        if (e.key === '¸' && e.altKey && e.shiftKey) {
            rebra();
        } else if (e.key === 'Ω' && e.altKey) {
            unbra();
        }
    }
    document.addEventListener("keydown", undoRedoKeydown);
    document.addEventListener("keydown", unbraRebraKeydown);
});