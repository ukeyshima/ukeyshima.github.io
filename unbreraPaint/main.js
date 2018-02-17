window.addEventListener("load", function () {
    var drawFrame = document.getElementById("drawFrame");
    var draw = document.getElementById("draw");
    var drawWidth = draw.clientWidth;
    var drawHeight = draw.clientWidth;
    draw.width = drawWidth;
    draw.height = drawHeight;
    var drawContext = draw.getContext("2d");
    drawContext.fillStyle = "#fff";
    drawContext.fillRect(0, 0, drawWidth, drawHeight);
    drawContext.lineJoin = "round";
    drawContext.lineCap = "round";
    var unbreraGUIFrontFrame = document.getElementById("unbreraGUIFrontFrame");
    var unbreraGUIFrame = document.getElementById("unbreraGUIFrame");
    var unbreraGUI = document.getElementById("unbreraGUI");
    var unbreraGUIWidth = unbreraGUIFrame.clientWidth * 30;
    var unbreraGUIHeight = unbreraGUIFrame.clientHeight;
    unbreraGUI.width = unbreraGUIWidth;
    unbreraGUI.height = unbreraGUIHeight;
    var unbreraGUIContext = unbreraGUI.getContext("2d");
    unbreraGUIContext.fillStyle = "#222";
    unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
    var drawColor = document.getElementById("drawColor");
    var drawColorWidth = drawColor.clientWidth;
    var drawColorHeight = drawColor.clientWidth;
    drawColor.width = drawColorWidth;
    drawColor.height = drawColorHeight;
    var drawColorGl = drawColor.getContext("webgl");
    var preview = document.getElementById("preview");
    var commandPreview = document.getElementById("commandPreview");
    var commandOperation = document.getElementById("commandOperation");
    var drawFlag = false;
    var prevX, prevY;
    var strokeWidth = 1;
    var strokeColor = "rgb(0,0,0)";
    var prevImage;
    var drawRectFlag;
    var drawCircleFlag;
    draw.addEventListener("mousedown", function (e) {
        if (!drawRectEvent && !drawCircleEvent) {
            drawFlag = true;
        }
        if (drawRectEvent) drawRectFlag = true;
        if (drawCircleEvent) drawCircleFlag = true;
        prevImage = draw.toDataURL("image/webp", 1.0);
        prevX = e.layerX;
        prevY = e.layerY;
    });
    var undoStackDelta = [];
    draw.addEventListener("mousemove", function (e) {
        if (drawFlag) {
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
        } else if (drawRectFlag) {
            var x = e.layerX;
            var y = e.layerY;
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
                drawContext.fillStyle = strokeColor;
                drawContext.fillRect(prevX, prevY, x - prevX, y - prevY);
            }
            img.src = prevImage;
        } else if (drawCircleFlag) {
            var x = e.layerX;
            var y = e.layerY;
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
                drawContext.fillStyle = strokeColor;
                drawContext.beginPath();
                drawContext.arc(prevX, prevY, dist(prevX, prevY, x, y), 0, Math.PI * 2, false);
                drawContext.fill();
            }
            img.src = prevImage;
        }
    });
    function dist(x, y, tx, ty) {
        return Math.sqrt((tx - x) * (tx - x) + (ty - y) * (ty - y));
    }
    draw.addEventListener("mouseup", function (e) {
        var state = draw.toDataURL("image/webp", 1.0);
        if (drawFlag) {
            drawFlag = false;
            var state = draw.toDataURL("image/webp", 1.0);
            execute(undoStackDelta, state);
            undoStackDelta = [];
        } else if (drawRectFlag) {
            drawRectFlag = false;
            execute([], state);
        } else if (drawCircleFlag) {
            drawCircleFlag = false;
            execute([], state);
        }
    });
    var drawThickness = document.getElementById("drawThickness");
    strokeWidth = drawThickness.value;
    drawThickness.addEventListener("input", function (e) {
        strokeWidth = e.target.value;
        preview.style.width = strokeWidth + "px";
        preview.style.height = strokeWidth + "px";
    }, false);

    drawColor.addEventListener("mousedown", function (e) {
        render();
        var u8 = new Uint8Array(4);
        drawColorGl.readPixels(e.layerX, this.clientWidth - e.layerY, 1, 1, drawColorGl.RGBA, drawColorGl.UNSIGNED_BYTE, u8);
        strokeColor = "rgb(" + u8[0] + "," + u8[1] + "," + u8[2] + ")";
        preview.style.backgroundColor = strokeColor;
    });
    var drawRect = document.getElementById("drawRect");
    var drawCircle = document.getElementById("drawCircle");
    var drawRectEvent = false;
    var drawCircleEvent = false;
    drawRect.addEventListener("mousedown", function () {
        drawRectEvent = !drawRectEvent;
        drawCircleEvent = false;
        this.style.backgroundColor = drawRectEvent ? "#eee" : "#bbb";
        drawCircle.style.backgroundColor = drawCircleEvent ? "#eee" : "#bbb";
        drawPreview.style.backgroundColor = drawCircleEvent || drawRectEvent ? "#bbb" : "#eee";
    });
    drawCircle.addEventListener("mousedown", function () {
        drawCircleEvent = !drawCircleEvent;
        drawRectEvent = false;
        this.style.backgroundColor = drawCircleEvent ? "#eee" : "#bbb";
        drawRect.style.backgroundColor = drawRectEvent ? "#eee" : "#bbb";
        drawPreview.style.backgroundColor = drawCircleEvent || drawRectEvent ? "#bbb" : "#eee";
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
            vec3 color = 0.03/length(p)+step(length(p),1.0)*hsv2rgb(vec3(atan(p.x,p.y)/2.0/PI,length(p),1.0));	    

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
    var unbreraGUISizeChange = false;
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
    clearEventListener(unbreraGUI);
    unbreraGUIContext.fillStyle = "#222";
    unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
    createUnbreraGUI(undoStack.concat(redoStack.slice().reverse()), 50, 200, 0);
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
            clearEventListener(unbreraGUI);
            unbreraGUIContext.fillStyle = "#222";
            unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
            createUnbreraGUI(undoStack.concat(redoStack.slice().reverse()), 50, 200, 0);
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
            clearEventListener(unbreraGUI);
            unbreraGUIContext.fillStyle = "#222";
            unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
            createUnbreraGUI(undoStack.concat(redoStack.slice().reverse()), 50, 200, 0);
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
        clearEventListener(unbreraGUI);
        unbreraGUIContext.fillStyle = "#222";
        unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
        createUnbreraGUI(undoStack.concat(redoStack.slice().reverse()), 50, 200, 0);
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
        if (nextBranchPoint) {
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
            clearEventListener(unbreraGUI);
            unbreraGUIContext.fillStyle = "#222";
            unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
            createUnbreraGUI(undoStack.concat(redoStack.slice().reverse()), 50, 200, 0);
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
        }
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
        if (nextBranchPoint) {
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
            clearEventListener(unbreraGUI);
            unbreraGUIContext.fillStyle = "#222";
            unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
            createUnbreraGUI(undoStack.concat(redoStack.slice().reverse()), 50, 200, 0);
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
        }
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
            if (stack[i] === lastUndoStack()) {
                unbreraGUIContext.fillStyle = "#d83";
                unbreraGUIContext.fillRect(x + i * 150 - 10, y - 10, 120, 120);
            }
            let img = new Image();
            img.addEventListener("load", function () {
                unbreraGUIContext.drawImage(img, x + i * 150, y, 100, 100)
            });
            img.src = stack[i].state;
            registerEventListener(unbreraGUI, "click", targetPointing(x + i * 150, y, 100, stack[i]));
            if (stack[i].isBranchPoint) {
                for (let j = 0; j < stack[i].branchStack.length; j++) {
                    unbreraGUIContext.strokeStyle = "#38e";
                    unbreraGUIContext.lineWidth = 5;
                    unbreraGUIContext.beginPath();
                    unbreraGUIContext.moveTo(x + i * 150 + 50, y + 50);
                    unbreraGUIContext.lineTo(x + (i + 1) * 150 + 50, y + 150 * j + 50);
                    unbreraGUIContext.stroke();
                    createUnbreraGUI(stack[i].branchStack[j].slice().reverse(), x + (i + 1) * 150, y + 150 * j, i + j);
                }
                break;
            }
        }
    }
    function registerEventListener(obj, event, func) {
        if (typeof obj._eventListeners == 'undefined') {
            obj._eventListeners = [];
        }
        obj.addEventListener(event, func);
        obj._eventListeners.push({ event: event, callback: func });
    }
    function clearEventListener(obj) {
        if (typeof obj._eventListeners == 'undefined' || obj._eventListeners.length == 0) {
            return;
        }
        for (var i = 0; i < obj._eventListeners.length; i++) {
            var e = obj._eventListeners[i];
            obj.removeEventListener(e.event, e.callback);
        }
        obj._eventListeners = [];
    }
    function targetPointing(x, y, size, target) {
        return function (e) {
            if (e.layerX > x && e.layerX < x + size && e.layerY > y && e.layerY < y + size) {
                searchTarget(target);
            }
        }
    }
    function searchTarget(target) {
        var branchPointStack = undoStack.concat(redoStack.slice().reverse(false)).filter(function (e, i, a) {
            e.indexNum = i;
            return e.isBranchPoint;
        });
        if (branchPointStack[0] !== undoStack[0]) {
            branchPointStack = [].concat(undoStack[0]).concat(branchPointStack);
        }
        var targetIsBranch = branchPointStack.indexOf(target);
        var nextBranchPoint = targetIsBranch == -1 ? null : target;
        var nextBranchStack = [];
        console.log(branchPointStack);
        if (targetIsBranch == -1) {



            for (var i = branchPointStack.length-1; i >=0 ; i--) {
                nextBranchStack = [];
                nextBranchPoint = (function (stack) {
                    for (var j = 0; j < stack.branchStack.length; j++) {
                        for (var k = 0; k < stack.branchStack[j].length; k++) {
                            if (stack.branchStack[j][k] == target) {
                                nextBranchStack.unshift(branchPointStack[i]);
                                return branchPointStack[i];
                            }
                        }
                        if (stack.branchStack[j][0].isBranchPoint) {
                            nextBranchStack.unshift(stack.branchStack[j][0]);
                            arguments.callee(stack.branchStack[j][0]);
                        }
                    }
                })(branchPointStack[i]);
                if (nextBranchPoint) {
                    break;
                }
            }
        }
        console.log(nextBranchPoint);
        console.log(nextBranchStack);
        /*
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
                        if (deltaStack === target) return;
                    }
                    if (stack[0].isBranchPoint) {
                        arguments.callee(stack[0].branchStack[stack[0].branchStack.length - 1].slice());
                    }
                })(nextBranchPoint);
        
        
                clearEventListener(unbreraGUI);
                unbreraGUIContext.fillStyle = "#222";
                unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
                createUnbreraGUI(undoStack.concat(redoStack.slice().reverse()), 50, 200, 0);
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
                unbraId = lastUndoStack().branchPointId;*/
    }
    function undoRedoKeydown(e) {
        e = window.event || e;
        if (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
            redo();
            commandPreviewExpression("redo");
            commandOperationExpression(3);
        } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
            undo();
            commandPreviewExpression("undo");
            commandOperationExpression(1);
        }
    }
    function unbraRebraKeydown(e) {
        e = window.event || e;
        if (e.key === '¸' && e.altKey && e.shiftKey) {
            rebra();
            commandPreviewExpression("rebra");
            commandOperationExpression(2);
        } else if (e.key === 'Ω' && e.altKey) {
            unbra();
            commandPreviewExpression("unbra");
            commandOperationExpression(0);
        }
    }
    var commandPreviewAnimationID;
    function commandPreviewExpression(command) {
        cancelAnimationFrame(commandPreviewAnimationID);
        commandPreview.innerHTML = command;
        commandPreview.style.opacity = 1;
        commandPreviewAnimation();
        function commandPreviewAnimation() {
            commandPreview.style.opacity -= 0.01;
            commandPreviewAnimationID = requestAnimationFrame(commandPreviewAnimation);
            if (commandPreview.style.opacity < 0) {
                cancelAnimationFrame(commandPreviewAnimationID);
            }
        };
    }
    var arrows = document.getElementsByClassName("arrow");
    arrows[0].addEventListener("click", function () {
        unbra();
        commandPreviewExpression("unbra");
        commandOperationExpression(0);
    });
    arrows[1].addEventListener("click", function () {
        undo();
        commandPreviewExpression("undo");
        commandOperationExpression(1);
    });
    arrows[2].addEventListener("click", function () {
        rebra();
        commandPreviewExpression("rebra");
        commandOperationExpression(2);
    });
    arrows[3].addEventListener("click", function () {
        redo();
        commandPreviewExpression("redo");
        commandOperationExpression(3);
    });
    var arrowsAnimationID = [];
    function commandOperationExpression(id) {
        cancelAnimationFrame(arrowsAnimationID[id]);
        arrows[id].style.borderColor = "rgb(0,0,255)";
        commandOperationAnimation();
        var r = 0;
        var b = 255;
        function commandOperationAnimation() {
            r += 3;
            b -= 3;
            arrows[id].style.borderColor = "rgb(" + r + ",0," + b + ")";
            if (id != 0) arrows[id].style.borderBottomColor = "transparent";
            if (id != 1) arrows[id].style.borderRightColor = "transparent";
            if (id != 2) arrows[id].style.borderTopColor = "transparent";
            if (id != 3) arrows[id].style.borderLeftColor = "transparent";
            arrowsAnimationID[id] = requestAnimationFrame(commandOperationAnimation);
            if (b < 0) {
                cancelAnimationFrame(arrowsAnimationID[id]);
            }
        };
    }
    document.addEventListener("keydown", undoRedoKeydown);
    document.addEventListener("keydown", unbraRebraKeydown);
});