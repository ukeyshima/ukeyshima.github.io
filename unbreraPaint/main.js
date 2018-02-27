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
    var unbreraGUIWidth = unbreraGUIFrame.clientWidth * 3;
    var unbreraGUIHeight = unbreraGUIFrame.clientHeight * 3;
    unbreraGUI.width = unbreraGUIWidth;
    unbreraGUI.height = unbreraGUIHeight;
    var unbreraGUIContext = unbreraGUI.getContext("2d");
    unbreraGUIContext.fillStyle = "#222";
    unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
    var animationCanvas = document.getElementById("animationCanvas");
    var animationCanvasWidth = unbreraGUIWidth;
    var animationCanvasHeight = unbreraGUIHeight;
    animationCanvas.width = unbreraGUIWidth;
    animationCanvas.height = unbreraGUIHeight;
    var animationCanvasContext = animationCanvas.getContext("2d");
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
    var imgSize = 50;
    prevImage = draw.toDataURL("image/png", 1.0);
    draw.addEventListener("mousedown", function (e) {
        if (!drawRectEvent && !drawCircleEvent) {
            drawFlag = true;
        }
        if (drawRectEvent) drawRectFlag = true;
        if (drawCircleEvent) drawCircleFlag = true;
        prevImage = draw.toDataURL("image/png", 1.0);
        prevX = e.layerX;
        prevY = e.layerY;
    });
    var undoStackDelta = [];
    var drawRectEvent = false;
    var drawCircleEvent = false;
    draw.addEventListener("mousemove", function (e) {
        var x = e.layerX;
        var y = e.layerY;
        if (drawFlag) {
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
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
                drawContext.fillStyle = strokeColor;
                drawContext.fillRect(prevX, prevY, x - prevX, y - prevY);
            }
            img.src = prevImage;
        } else if (drawCircleFlag) {
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
                drawContext.fillStyle = strokeColor;
                drawContext.beginPath();
                drawContext.arc(prevX, prevY, dist(prevX, prevY, x, y), 0, Math.PI * 2, false);
                drawContext.fill();
            }
            img.src = prevImage;
        } else if (!drawRectEvent && !drawCircleEvent) {
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
                drawContext.fillStyle = strokeColor;
                drawContext.beginPath();
                drawContext.arc(x, y, strokeWidth / 2, 0, Math.PI * 2, false);
                drawContext.fill();
            }
            img.src = prevImage;
        }
    });

    function dist(x, y, tx, ty) {
        return Math.sqrt((tx - x) * (tx - x) + (ty - y) * (ty - y));
    }
    draw.addEventListener("mouseup", function (e) {
        var state = draw.toDataURL("image/png", 1.0);
        prevImage = state;
        if (drawFlag) {
            drawFlag = false;
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
    draw.addEventListener("mouseout", function (e) {
        if (drawFlag || drawCircleFlag || drawRectFlag) {
            prevImage = draw.toDataURL("image/png", 1.0);
            execute(undoStackDelta, prevImage);
        } else {
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
            }
            img.src = prevImage;
        }
        drawCircleFlag = false;
        drawFlag = false;
        drawRectFlag = false;        
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
        drawRect.style.color = strokeColor;
        drawCircle.style.color = strokeColor;
    });
    var drawRect = document.getElementById("drawRect");
    var drawCircle = document.getElementById("drawCircle");
    var drawPreview = document.getElementById("drawPreview");
    drawPreview.addEventListener("mousedown", function () {
        drawRectEvent = false;
        drawCircleEvent = false;
        this.style.backgroundColor = "#eee";
        drawRect.style.backgroundColor = "#bbb";
        drawCircle.style.backgroundColor = "#bbb";
    });
    drawRect.addEventListener("mousedown", function () {
        drawRectEvent = true;
        drawCircleEvent = false;
        this.style.backgroundColor = "#eee";
        drawCircle.style.backgroundColor = "#bbb";
        drawPreview.style.backgroundColor = "#bbb";
    });
    drawCircle.addEventListener("mousedown", function () {
        drawCircleEvent = true;
        drawRectEvent = false;
        this.style.backgroundColor = "#eee";
        drawRect.style.backgroundColor = "#bbb";
        drawPreview.style.backgroundColor = "#bbb";
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
    var drawProperty = document.getElementById("drawProperty");
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
        unbreraGUIFrame.style.width = (window.innerWidth - drawProperty.clientWidth - drawFrame.clientWidth - unbreraGUIFrontFrame.clientWidth) + "px";
        unbreraGUIFrame.style.height = window.inneHeight + "px";
        clearEventListener(animationCanvas);
        unbreraGUIContext.fillStyle = "#222";
        unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
        var array = undoStack.slice().concat(redoStack.slice().reverse());;
        var sliceNum = array.indexOf(array.find(function (e, i, a) {
            return e.isBranchPoint;
        }));
        array = sliceNum == -1 ? array : array.slice(0, sliceNum + 1);
        createUnbreraGUI(array, 50, undoStack[0].totalBranchStack / 2 * (imgSize / 2 + imgSize * 3 / 4 + imgSize / 4), 0);
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
    var undoStackObj = function (delta, state, branchPointId, isBranchPoint, branchStack, totalBranchStack) {
        this.delta = delta;
        this.state = state;
        this.branchPointId = branchPointId;
        this.isBranchPoint = isBranchPoint;
        this.branchStack = branchStack;
        this.totalBranchStack = totalBranchStack;
    }
    initUndoStack();
    clearEventListener(animationCanvas);
    unbreraGUIHeight = undoStack[0].totalBranchStack * (imgSize * 3 / 2) + imgSize;
    unbreraGUI.height = unbreraGUIHeight;
    animationCanvasHeight = unbreraGUIHeight;
    animationCanvas.height = unbreraGUIHeight;
    unbreraGUIContext.fillStyle = "#222";
    unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
    var array = undoStack.slice().concat(redoStack.slice().reverse());;
    var sliceNum = array.indexOf(array.find(function (e, i, a) {
        return e.isBranchPoint;
    }));
    array = sliceNum == -1 ? array : array.slice(0, sliceNum + 1);
    createUnbreraGUI(array, 50, undoStack[0].totalBranchStack / 2 * (imgSize / 2 + imgSize * 3 / 4 + imgSize / 4), 0);
    function initUndoStack() {
        unbraId = 0;
        undoStack = [new undoStackObj([], defalutDrawState, 0, false, [], 1)];
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
            prevImage = lastUndoStack().state;
            clearEventListener(animationCanvas);
            unbreraGUIHeight = undoStack[0].totalBranchStack * (imgSize * 3 / 2) + imgSize;
            unbreraGUI.height = unbreraGUIHeight;
            animationCanvasHeight = unbreraGUIHeight;
            animationCanvas.height = unbreraGUIHeight;
            unbreraGUIContext.fillStyle = "#222";
            unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
            var array = undoStack.slice().concat(redoStack.slice().reverse());;
            var sliceNum = array.indexOf(array.find(function (e, i, a) {
                return e.isBranchPoint;
            }));
            array = sliceNum == -1 ? array : array.slice(0, sliceNum + 1);
            createUnbreraGUI(array, 50, undoStack[0].totalBranchStack / 2 * (imgSize / 2 + imgSize * 3 / 4 + imgSize / 4), 0);
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
            prevImage = lastUndoStack().state;
            clearEventListener(animationCanvas);
            unbreraGUIHeight = undoStack[0].totalBranchStack * (imgSize * 3 / 2) + imgSize;
            unbreraGUI.height = unbreraGUIHeight;
            animationCanvasHeight = unbreraGUIHeight;
            animationCanvas.height = unbreraGUIHeight;
            unbreraGUIContext.fillStyle = "#222";
            unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
            var array = undoStack.slice().concat(redoStack.slice().reverse());;
            var sliceNum = array.indexOf(array.find(function (e, i, a) {
                return e.isBranchPoint;
            }));
            array = sliceNum == -1 ? array : array.slice(0, sliceNum + 1);
            createUnbreraGUI(array, 50, undoStack[0].totalBranchStack / 2 * (imgSize / 2 + imgSize * 3 / 4 + imgSize / 4), 0);
        }
    }
    function updateTotalBranchStack(stack) {
        stack.totalBranchStack++;
        let parent = (function () {
            let num = undoStack.indexOf(stack);
            return undoStack[num - 1];
        })();
        if (parent) updateTotalBranchStack(parent);
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
            if (lastUnbraPoint.branchStack.length >= 2) updateTotalBranchStack(lastUnbraPoint);
            unbraId = lastUnbraPoint.branchStack.length - 1;
        }
        undoStack.push(new undoStackObj(delta, state, unbraId, false, [], 1));
        redoStack = [];
        lastUnbraPoint.branchStack[unbraId] = undoStack.slice(lastUnbraNum + 1, undoStack.length).reverse();
        clearEventListener(animationCanvas);
        unbreraGUIHeight = undoStack[0].totalBranchStack * (imgSize * 3 / 2) + imgSize;
        unbreraGUI.height = unbreraGUIHeight;
        animationCanvasHeight = unbreraGUIHeight;
        animationCanvas.height = unbreraGUIHeight;
        unbreraGUIContext.fillStyle = "#222";
        unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
        var array = undoStack.slice().concat(redoStack.slice().reverse());;
        var sliceNum = array.indexOf(array.find(function (e, i, a) {
            return e.isBranchPoint;
        }));
        array = sliceNum == -1 ? array : array.slice(0, sliceNum + 1);
        createUnbreraGUI(array, 50, undoStack[0].totalBranchStack / 2 * (imgSize / 2 + imgSize * 3 / 4 + imgSize / 4), 0);
        commandAfterAnimation();
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
                for (let i = j - 1; i >= 0; i--) {
                    var deltaStack = stack[i];
                    undoStack.push(deltaStack);
                    if (stack[i].isBranchPoint) {
                        arguments.callee(stack[i].branchStack[stack[i].branchStack.length - 1].slice());
                        break;
                    }
                }
            })(nextBranchPoint.branchStack[targetBranchId]);
            clearEventListener(animationCanvas);
            unbreraGUIHeight = undoStack[0].totalBranchStack * (imgSize * 3 / 2) + imgSize;
            unbreraGUI.height = unbreraGUIHeight;
            animationCanvasHeight = unbreraGUIHeight;
            animationCanvas.height = unbreraGUIHeight;
            unbreraGUIContext.fillStyle = "#222";
            unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
            var array = undoStack.slice().concat(redoStack.slice().reverse());;
            var sliceNum = array.indexOf(array.find(function (e, i, a) {
                return e.isBranchPoint;
            }));
            array = sliceNum == -1 ? array : array.slice(0, sliceNum + 1);
            createUnbreraGUI(array, 50, undoStack[0].totalBranchStack / 2 * (imgSize / 2 + imgSize * 3 / 4 + imgSize / 4), 0);
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
            }
            img.src = lastUndoStack().state;
            prevImage = lastUndoStack().state;
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
                for (let i = j - 1; i >= 0; i--) {
                    var deltaStack = stack[i];
                    undoStack.push(deltaStack);
                    if (stack[i].isBranchPoint) {
                        arguments.callee(stack[i].branchStack[0].slice());
                        break;
                    }
                }
            })(nextBranchPoint.branchStack[targetBranchId]);            
            clearEventListener(animationCanvas);
            unbreraGUIHeight = undoStack[0].totalBranchStack * (imgSize * 3 / 2) + imgSize;
            unbreraGUI.height = unbreraGUIHeight;
            animationCanvasHeight = unbreraGUIHeight;
            animationCanvas.height = unbreraGUIHeight;
            unbreraGUIContext.fillStyle = "#222";
            unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);            
            let array = undoStack.slice().concat(redoStack.slice().reverse());;
            var sliceNum = array.indexOf(array.find(function (e, i, a) {
                return e.isBranchPoint;
            }));
            array = sliceNum == -1 ? array : array.slice(0, sliceNum + 1);
            createUnbreraGUI(array, 50, undoStack[0].totalBranchStack / 2 * (imgSize / 2 + imgSize * 3 / 4 + imgSize / 4), 0);
            var img = new Image();
            img.onload = function () {
                drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
            }
            img.src = lastUndoStack().state;
            prevImage = lastUndoStack().state;
            redoStack = [];
            lastUnbraNum = undoStack.lastIndexOf(undoStack.slice().reverse().find(function (e, i, a) {
                return e.isBranchPoint;
            }));
            lastUnbraPoint = undoStack[lastUnbraNum];
            unbraId = lastUndoStack().branchPointId;
        }
        
    };
    var prevPosition = [50 + 50, undoStack[0].totalBranchStack / 2 * (imgSize / 2 + imgSize * 3 / 4 + imgSize / 4) + imgSize / 2];
    var afterPosition = [50 + 50, undoStack[0].totalBranchStack / 2 * (imgSize / 2 + imgSize * 3 / 4 + imgSize / 4) + imgSize / 2];
    function createUnbreraGUI(stack, x, y, i) {
        for (let i = 0; i < stack.length; i++) {
            if (i < stack.length - 1) {
                unbreraGUIContext.strokeStyle = "#38e";
                unbreraGUIContext.lineWidth = 5;
                unbreraGUIContext.beginPath();
                unbreraGUIContext.moveTo(x + i * imgSize / 2 * 3 + imgSize / 2, y + imgSize / 2);
                unbreraGUIContext.lineTo(x + (i + 1) * imgSize / 2 * 3 + imgSize / 2, y + imgSize / 2);
                unbreraGUIContext.stroke();
            }
            if (stack[i] === lastUndoStack()) {
                unbreraGUIContext.fillStyle = "#d83";
                unbreraGUIContext.fillRect(x + i * imgSize / 2 * 3 - 10, y - 10, imgSize + 20, imgSize + 20);
                afterPosition = [x + i * imgSize / 2 * 3 + imgSize / 2, y + imgSize / 2];
            }
            let img = new Image();
            img.addEventListener("load", function () {
                unbreraGUIContext.drawImage(img, x + i * imgSize / 2 * 3, y, imgSize, imgSize)
            });
            img.src = stack[i].state;
            unbreraGUIContext.fillStyle = "#f00";
            unbreraGUIContext.fillText(stack[i].branchPointId, x + i * imgSize / 2 * 3, y);
            registerEventListener(animationCanvas, "click", targetPointing(x + i * imgSize / 2 * 3, y, imgSize, stack[i]));
            if (stack[i].isBranchPoint) {
                let totalSpread = -(stack[i].totalBranchStack - 1) / 2 + (stack[i].branchStack[0][stack[i].branchStack[0].length - 1].totalBranchStack - 1) / 2;
                let num = 0;
                for (let j = 0; j < stack[i].branchStack.length; j++) {
                    if (j !== 0) totalSpread += (stack[i].branchStack[j - 1][stack[i].branchStack[j - 1].length - 1].totalBranchStack - 1) / 2 + (stack[i].branchStack[j][stack[i].branchStack[j].length - 1].totalBranchStack - 1) / 2;
                    num = totalSpread + j;
                    unbreraGUIContext.strokeStyle = "#38e";
                    unbreraGUIContext.lineWidth = 5;
                    unbreraGUIContext.beginPath();
                    unbreraGUIContext.moveTo(x + i * imgSize / 2 * 3 + imgSize / 2, y + imgSize / 2);
                    unbreraGUIContext.lineTo(x + (i + 1) * imgSize / 2 * 3 + imgSize / 2, y + imgSize / 2 * 3 * num + imgSize / 2);
                    unbreraGUIContext.stroke();
                    var array = stack[i].branchStack[j].slice().reverse();
                    var sliceNum = array.indexOf(array.find(function (e, i, a) {
                        return e.isBranchPoint;
                    }));
                    array = sliceNum == -1 ? array : array.slice(0, sliceNum + 1);
                    createUnbreraGUI(array, x + (i + 1) * imgSize / 2 * 3, y + imgSize / 2 * 3 * num, i + j);
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
                console.log(target);
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
        var nextBranchPoint = null;
        var nextBranchStack = [];
        var branchNum = [];
        for (var i = branchPointStack.length - 1; i >= 0; i--) {
            nextBranchStack = [];
            nextBranchPoint = (function (stack) {
                loop: for (var j = 0; j < stack.branchStack.length; j++) {
                    for (var k = stack.branchStack[j].length - 1; k >= 0; k--) {
                        if (stack.branchStack[j][k] == target) {
                            branchNum.push(j);
                            nextBranchStack.unshift(branchPointStack[i]);
                            return branchPointStack[i];
                            break loop;
                        } else if (stack.branchStack[j][k].isBranchPoint) {
                            if ((function (stack) {
                                loop: for (var j = 0; j < stack.branchStack.length; j++) {
                                    for (var k = stack.branchStack[j].length - 1; k >= 0; k--) {
                                        if (stack.branchStack[j][k] == target) {
                                            return true;
                                            break loop;
                                        } else if (stack.branchStack[j][k].isBranchPoint) {
                                            if (arguments.callee(stack.branchStack[j][k])) {
                                                return arguments.callee(stack.branchStack[j][k]);
                                            }
                                        }
                                    }

                                }
                            })(stack.branchStack[j][k])) {
                                branchNum.push(j);
                                nextBranchStack.push(stack.branchStack[j][k]);
                                return arguments.callee(stack.branchStack[j][k]);
                            }
                        }
                    }

                }
            })(branchPointStack[i]);
            if (nextBranchPoint) {
                break;
            }
        }
        if (nextBranchStack.length == 0) {
            nextBranchStack.push(nextBranchPoint);
            branchNum = [0];
        }
        if (!nextBranchPoint) {
            nextBranchPoint = undoStack[0];
            nextBranchStack = branchPointStack;
        }
        let nextBranchPointIndex = undoStack.indexOf(nextBranchPoint);
        if (nextBranchPointIndex === -1) {
            for (var i = 0; i < redoStack.length; i++) {
                redo();
                if (lastUndoStack() === nextBranchPoint) break;
            }
            redoStack = [];
            loop: for (var i = 0; i < nextBranchStack.length; i++) {
                if (lastUndoStack() === target) {
                    (function (stack) {
                        var j = stack.length;
                        for (var i = j - 1; i >= 0; i--) {
                            redoStack.unshift(stack[i]);
                            if (stack[i].isBranchPoint) {
                                return arguments.callee(stack[i].branchStack[stack[i].branchStack.length - 1]);
                            }

                        }
                    })(target.branchStack[target.branchStack.lengt - 1]);
                    break;
                }
                j = nextBranchStack[i].branchStack[branchNum[i]].length;
                for (var t = 0; t < j; t++) {
                    var deltaStack = nextBranchStack[i].branchStack[branchNum[i]][j - 1 - t];
                    undoStack.push(deltaStack);
                    if (deltaStack === target) {
                        (function (stack) {
                            var j = stack.length;
                            for (var i = j - 1; i >= 0; i--) {
                                redoStack.unshift(stack[i]);
                                if (stack[i].isBranchPoint) {
                                    return arguments.callee(stack[i].branchStack[stack[i].branchStack.length - 1]);
                                }

                            }
                        })(target.isBranchPoint ? target.branchStack[target.branchStack.length - 1] : nextBranchStack[i].branchStack[branchNum[i]].slice(0, j - 1 - t));
                        break loop;
                    }
                }
            }
        } else {
            let j = undoStack.length - (nextBranchPointIndex + 1);
            for (let i = 0; i < j; i++) {
                undo();
            }
            redoStack = [];
            loop: for (var i = 0; i < nextBranchStack.length; i++) {
                if (lastUndoStack() === target) {
                    (function (stack) {
                        var j = stack.length;
                        for (var i = j - 1; i >= 0; i--) {
                            redoStack.unshift(stack[i]);
                            if (stack[i].isBranchPoint) {
                                return arguments.callee(stack[i].branchStack[stack[i].branchStack.length - 1]);
                            }

                        }
                    })(target.branchStack[target.branchStack.length - 1]);
                    break;
                }
                j = nextBranchStack[i].branchStack[branchNum[i]].length;
                for (var t = 0; t < j; t++) {
                    var deltaStack = nextBranchStack[i].branchStack[branchNum[i]][j - 1 - t];
                    undoStack.push(deltaStack);
                    if (deltaStack === target) {
                        (function (stack) {
                            var j = stack.length;
                            for (var i = j - 1; i >= 0; i--) {
                                redoStack.unshift(stack[i]);
                                if (stack[i].isBranchPoint) {
                                    return arguments.callee(stack[i].branchStack[stack[i].branchStack.length - 1]);
                                }

                            }
                        })(target.isBranchPoint ? target.branchStack[target.branchStack.length - 1] : nextBranchStack[i].branchStack[branchNum[i]].slice(0, j - 1 - t));
                        break loop;
                    }
                }
            }
        }
        clearEventListener(animationCanvas);
        unbreraGUIHeight = undoStack[0].totalBranchStack * (imgSize * 3 / 2) + imgSize;
        unbreraGUI.height = unbreraGUIHeight;
        animationCanvasHeight = unbreraGUIHeight;
        animationCanvas.height = unbreraGUIHeight;
        unbreraGUIContext.fillStyle = "#222";
        unbreraGUIContext.fillRect(0, 0, unbreraGUIWidth, unbreraGUIHeight);
        var array = undoStack.slice().concat(redoStack.slice().reverse());
        var sliceNum = array.indexOf(array.find(function (e, i, a) {
            return e.isBranchPoint;
        }));
        array = sliceNum == -1 ? array : array.slice(0, sliceNum + 1);
        createUnbreraGUI(array, 50, undoStack[0].totalBranchStack / 2 * (imgSize / 2 + imgSize * 3 / 4 + imgSize / 4), 0);
        var img = new Image();
        img.onload = function () {
            drawContext.drawImage(img, 0, 0, drawWidth, drawHeight);
        }
        img.src = lastUndoStack().state;
        prevImage = lastUndoStack().state;
        lastUnbraNum = undoStack.lastIndexOf(undoStack.slice().reverse().find(function (e, i, a) {
            return e.isBranchPoint;
        }));
        lastUnbraPoint = undoStack[lastUnbraNum];
        unbraId = lastUndoStack().branchPointId;
        commandAfterAnimation();
    }
    function undoRedoKeydown(e) {
        e = window.event || e;
        if ((e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)||(e.key === 'Z' && (e.ctrlKey || e.metaKey) && e.shiftKey)) {
            redo();
            commandPreviewExpression("redo");
            commandOperationExpression(3);
            commandAfterAnimation();
        } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
            undo();
            commandPreviewExpression("undo");
            commandOperationExpression(1);
            commandAfterAnimation();
        }
    }
    function unbraRebraKeydown(e) {        
        e = window.event || e;
        if ((e.key === '¸' && e.altKey && e.shiftKey )||(e.key === 'Z' && e.altKey && e.shiftKey )) {            
            rebra();
            commandPreviewExpression("rebra");
            commandOperationExpression(2);
            commandAfterAnimation();
            prevPosition = afterPosition.slice();
        } else if ((e.key === 'Ω' && e.altKey) ||(e.key === 'z' && e.altKey )){
            unbra();
            commandPreviewExpression("unbra");
            commandOperationExpression(0);
            commandAfterAnimation();
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
    /*function commandPreviewExpression(command) {      
        var opacity = 1;        
        commandPreviewAnimation();        
        function commandPreviewAnimation() {
            animationCanvasContext.clearRect(0, 0, animationCanvas.width, animationCanvas.height);            
            animationCanvasContext.font="100px 'MS Pゴシック'";            
            animationCanvasContext.fillStyle="rgba(255,255,255,"+opacity+")";
            animationCanvasContext.fillText(command,10,110);
            opacity -= 0.01;
            commandPreviewAnimationID = requestAnimationFrame(commandPreviewAnimation);
            if (commandPreview.style.opacity < 0) {
                cancelAnimationFrame(commandPreviewAnimationID);
            }
        };
    }*/
    var commandAfterAnimationID;
    function commandAfterAnimation() {
        let px = prevPosition[0];
        let py = prevPosition[1];
        let ax = afterPosition[0];
        let ay = afterPosition[1];
        if ((px == ax) && (py == ay)) return;
        var opacity = 1.0;
        prevPosition = afterPosition.slice();
        commandAfterArrowAnimation();
        function commandAfterArrowAnimation() {
            animationCanvasContext.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
            animationCanvasContext.strokeStyle = "rgba(150,150,255," + opacity + ")";
            animationCanvasContext.lineWidth = 50;
            animationCanvasContext.beginPath();
            animationCanvasContext.moveTo(px, py);
            animationCanvasContext.lineTo(ax, ay);
            animationCanvasContext.stroke();
            animationCanvasContext.closePath();
            var radian = Math.atan2((ay - py), (ax - px));
            animationCanvasContext.save();
            animationCanvasContext.translate(ax, ay);
            animationCanvasContext.rotate(radian);
            animationCanvasContext.fillStyle = "rgba(150,150,255," + opacity + ")";
            animationCanvasContext.beginPath();
            animationCanvasContext.moveTo(0, - 50);
            animationCanvasContext.lineTo(0, 50);
            animationCanvasContext.lineTo(50, 0);
            animationCanvasContext.closePath();
            animationCanvasContext.fill();
            animationCanvasContext.restore();
            opacity -= 0.03;
            commandAfterAnimationID = requestAnimationFrame(commandAfterArrowAnimation);
            if (opacity < 0) {
                animationCanvasContext.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
                cancelAnimationFrame(commandAfterAnimationID);
            }
        };

    }
    var arrows = document.getElementsByClassName("arrow");
    arrows[0].addEventListener("click", function () {
        unbra();
        commandPreviewExpression("unbra");
        commandOperationExpression(0);
        commandAfterAnimation();
    });
    arrows[1].addEventListener("click", function () {
        undo();
        commandPreviewExpression("undo");
        commandOperationExpression(1);
        commandAfterAnimation();
    });
    arrows[2].addEventListener("click", function () {
        rebra();
        commandPreviewExpression("rebra");
        commandOperationExpression(2);
        commandAfterAnimation();
    });
    arrows[3].addEventListener("click", function () {
        redo();
        commandPreviewExpression("redo");
        commandOperationExpression(3);
        commandAfterAnimation();
    });
    var arrowsAnimationID = [];
    function commandOperationExpression(id) {
        cancelAnimationFrame(arrowsAnimationID[id]);
        arrows[id].style.fill = "rgb(255,0,0)";
        commandOperationAnimation();
        var r = 0;
        var b = 255;
        function commandOperationAnimation() {
            r += 3;
            b -= 3;
            arrows[id].style.fill = "rgb(" + r + ",0," + b + ")";
            arrowsAnimationID[id] = requestAnimationFrame(commandOperationAnimation);
            if (b < 0) {
                cancelAnimationFrame(arrowsAnimationID[id]);
            }
        };
    }
    document.addEventListener("keydown", undoRedoKeydown);
    document.addEventListener("keydown", unbraRebraKeydown);
});