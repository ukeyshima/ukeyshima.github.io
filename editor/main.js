window.addEventListener("load", function () {
    sessionStorage.clear();
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/dawn");
    editor.setFontSize(23);
    editor.getSession().setMode("ace/mode/html");
    editor.setReadOnly(true);
    const { HashHandler } = require('ace/keyboard/hash_handler');
    const keyboardHandler = new HashHandler();
    keyboardHandler.addCommand({
        name: "run-event",
        bindKey: { win: 'Ctrl+r', mac: 'Command+r' },
        exec: () => {
            const e = document.createEvent("MouseEvents");
            e.initEvent("mousedown", false, true);
            run ? document.getElementById("stop").dispatchEvent(e) : document.getElementById("run").dispatchEvent(e);
        },
        readOnly: true
    });
    keyboardHandler.addCommand({
        name: "save-event",
        bindKey: { win: 'Ctrl+s', mac: 'Command+s' },
        exec: () => {
            const e = document.createEvent("MouseEvents");
            e.initEvent("mousedown", false, true);
            document.getElementById("save").dispatchEvent(e);
        },
        readOnly: true
    });
    keyboardHandler.addCommand({
        name: "undo-event",
        bindKey: { win: 'Ctrl+z', mac: 'Command+z' },
        exec: () => {
            editor.undo();
        },
        readOnly: true
    });
    keyboardHandler.addCommand({
        name: "redo-event",
        bindKey: { win: 'Ctrl+Shift+z', mac: 'Command+Shift+z' },
        exec: () => {
            editor.redo();
        },
        readOnly: true
    });
    editor.keyBinding.addKeyboardHandler(keyboardHandler);
    let windowWidth = window.innerWidth;
    let htmlEditor = null;
    let run = false;
    let option = new Array();
    let iframe = null;
    let autoReflesh = false;
    let selectiveCodeReturn = null;
    let selectiveCodeReturnObjects = new Array();
    let obj = new Array();
    let id = 0;
    let tabChangeEvent = false;
    let active = {
        id: id,
        type: "html",
        removed: false
    }
    let Range = function (startRow, startColumn, endRow, endColumn) {
        return {
            start: { row: startRow, column: startColumn },
            end: { row: endRow, column: endColumn }
        };
    }
    option.push({
        type: "editor",
        element: document.getElementById("editor"),
        frontElement: null,
        frontFrame: null,
        sizeChange: false
    });
    obj.push(active);
    document.addEventListener("mousedown", function () {
        document.getElementById("filemenu").style.visibility = event.target == document.getElementById("file") ? "visible" : "hidden";
        document.getElementById("modemenu").style.visibility = event.target == document.getElementById("mode") ? "visible" : "hidden";
        document.getElementById("addmenu").style.visibility = event.target == document.getElementById("add") ? "visible" : "hidden";
    });
    let addEditor = document.getElementById("addmenu").getElementsByTagName("button");
    for (let i = 0; i < addEditor.length; i++) {
        addEditor[i].addEventListener("mousedown", function () {
            id++;
            if (this.className == "html") htmlEditor = id;
            let tab = document.getElementById("tab").getElementsByTagName("button");
            for (let i = 0; i < tab.length; i++) {
                tab[i].style.backgroundColor = "#ccc";
                let p = tab[i].getElementsByTagName("p");
                if (tab[i] == document.getElementById("view")) tab[i].style.color = "#000";
                for (let j = 0; j < p.length; j++) {
                    p[j].style.color = "#000";
                }
            }
            let button = document.createElement("button");
            button.id = id;
            document.getElementById("tab").appendChild(button);
            button.style.backgroundColor = "#e38";
            button.style.color = "#eee";
            let close = document.createElement("p");
            button.appendChild(close);
            close.innerHTML = "×";
            let name = document.createElement("p");
            button.appendChild(name);
            name.innerHTML = this.textContent;
            sessionStorage.setItem(active.id, editor.getValue());
            editor.setValue("");
            editor.getSession().setMode("ace/mode/" + this.className);
            editor.setReadOnly(false);
            obj.push({
                id: id,
                type: this.innerHTML,
                mode: this.className,
                removed: false
            });
            let object = obj[obj.length - 1];
            if (this.className == "html") {
                this.disabled = "disabled";
                this.innerHTML = "";
            }
            button.addEventListener("mousedown", function () {
                tabChangeEvent = true;
                let tab = document.getElementById("tab").getElementsByTagName("button");
                for (let i = 0; i < tab.length; i++) {
                    tab[i].style.backgroundColor = "#ccc";
                    if (tab[i] == document.getElementById("view")) tab[i].style.color = "#000";
                    let p = tab[i].getElementsByTagName("p");
                    for (let j = 0; j < p.length; j++) {
                        p[j].style.color = "#000";
                    }
                }
                this.style.backgroundColor = "#e38";
                name.style.color = "#eee";
                sessionStorage.setItem(active.id, editor.getValue());
                let autoRefleshEvent = false;
                if (autoReflesh) autoRefleshEvent = true;
                autoReflesh = false;
                editor.setValue(sessionStorage.getItem(this.id));
                editor.getSession().setMode("ace/mode/" + object.mode);
                editor.setReadOnly(false);
                active = object;
                if (autoRefleshEvent) autoReflesh = true;
                tabChangeEvent = false;
            });
            close.addEventListener("mousedown", function () {
                if (this.parentElement.getElementsByTagName("p")[1].innerHTML == "html") {
                    htmlEditor = null;
                    document.getElementById("html").disabled = "";
                    document.getElementById("html").innerHTML = "html";
                }
                document.getElementById("tab").removeChild(button);
                object.removed = true;
            });
            button.addEventListener("mouseover", function () {
                name.style.color = active.id == this.id ? "#000" : "#e38";
                close.style.color = active.id == this.id ? event.target.innerHTML == "×" ? "#fff" : "#000" : event.target.innerHTML == "×" ? "#000" : "#e38";
            });
            button.addEventListener("mouseout", function () {
                name.style.color = active.id == this.id ? "#fff" : "#000";
                close.style.color = active.id == this.id ? event.target.innerHTML == "×" ? "#000" : "#fff" : event.target.innerHTML == "×" ? "#fff" : "#000";
            });
            active = object;
        });
    };
    let beforeRemoveTime = new Date().getTime();
    let beforeAction=null;
    editor.session.on("change", function (e) {
        try {
            if (!tabChangeEvent) {
                console.log(new Date().getTime() - beforeRemoveTime);
                if (e.action == "remove") {
                    if (new Date().getTime() - beforeRemoveTime > 2000 || beforeAction!="remove") {
                        selectiveCodeReturnObjects.push({ id: active.id, type: e.action, key: "", startRow: e.start.row, startColumn: e.start.column, endRow: e.end.row, endColumn: e.end.column, undo: false });
                    }
                    for (let i = 0; i < e.lines.length; i++) {
                        selectiveCodeReturnObjects[selectiveCodeReturnObjects.length - 1].key += e.lines[i];
                    }
                    beforeRemoveTime = new Date().getTime();                    
                }
                beforeAction=e.action;
            }
            if (autoReflesh) {
                iframe.element.contentWindow.location.reload(true);
                setTimeout(function () {
                    sessionStorage.setItem(active.id, editor.getValue());
                    iframe.element.contentDocument.open();
                    if (htmlEditor) iframe.element.contentDocument.write(sessionStorage.getItem(htmlEditor));
                    iframe.element.contentDocument.close();
                    for (let i = 1; i < obj.length; i++) {
                        if (obj[i].type != "html" && !obj[i].removed) {
                            let script = iframe.element.contentDocument.createElement("script");
                            if (obj[i].type != "javascript") script.type = obj[i].type;
                            iframe.element.contentDocument.head.appendChild(script);
                            script.text = sessionStorage.getItem(i);
                        }
                    }
                }, 0);
            }
            if (selectiveCodeReturn) {
                while (selectiveCodeReturn.element.firstChild) {
                    selectiveCodeReturn.element.removeChild(selectiveCodeReturn.element.firstChild);
                }
                let selectiveCodeReturnObject = new Array();
                selectiveCodeReturnObjects.forEach(function (e, i, a) {
                    if (e.id == active.id) {
                        selectiveCodeReturnObject.push(e);
                    }
                });
                selectiveCodeReturnObject.forEach(function (e, i, a) {
                    let selectiveCodeReturnObj = document.createElement("div");
                    selectiveCodeReturnObj.innerHTML = e.key;
                    selectiveCodeReturnObj.className = "selectiveCodeReturnObj";
                    selectiveCodeReturnObj.style.textDecoration = e.undo ? "line-through" : "none";
                    selectiveCodeReturn.element.appendChild(selectiveCodeReturnObj);
                    selectiveCodeReturnObj.addEventListener("mousedown", function () {
                        let elements = selectiveCodeReturn.element.children;
                        let target = selectiveCodeReturnObject[[].slice.call(elements).indexOf(this)];
                        editor.session.replace(new Range(editor.getCursorPosition().row, editor.getCursorPosition().column, editor.getCursorPosition().row, editor.getCursorPosition().column), target.key);
                        /*if (!target.undo) {
                            target.undo = true;
                            if (target.type == "insert") {
                                editor.session.replace(new Range(target.startRow, target.startColumn, target.endRow, target.endColumn), "");
                            } else if (target.type == "remove") {
                                editor.session.replace(new Range(target.startRow, target.startColumn, target.startRow, target.startColumn), target.key);
                            }                            
                        } else {
                            target.undo = false;
                            if (target.type == "insert") {
                                editor.session.replace(new Range(target.startRow, target.startColumn, target.startRow, target.startColumn), target.key);
                            } else if (target.type == "remove") {
                                editor.session.replace(new Range(target.startRow, target.startColumn, target.endRow, target.endColumn), "");
                            }                                                          
                        }*/
                    });
                });
            }
        } catch (e) {
            console.log(e);
        }
    });
    document.getElementById("view").addEventListener("mousedown", function () {
        let tab = document.getElementById("tab").getElementsByTagName("button");
        for (let i = 0; i < tab.length; i++) {
            tab[i].style.backgroundColor = "#ccc";
            let p = tab[i].getElementsByTagName("p");
            for (let j = 0; j < p.length; j++) {
                p[j].style.color = "#000";
            }
        }
        this.style.backgroundColor = "#e38";
        this.style.color = "#eee";
        editor.getSession().setMode("ace/mode/html");
        editor.setReadOnly(true);
        sessionStorage.setItem(active.id, editor.getValue());
        active = {
            id: 0,
            type: "html"
        }
        let removeIframe = false;
        if (!iframe) {
            iframe = { element: document.createElement("iframe") }
            document.body.appendChild(iframe.element);
            removeIframe = true;
        }
        iframe.element.contentWindow.location.reload(true);
        setTimeout(function () {
            iframe.element.contentDocument.open();
            if (htmlEditor) iframe.element.contentDocument.write(sessionStorage.getItem(htmlEditor));
            iframe.element.contentDocument.close();
            for (let i = 1; i < obj.length; i++) {
                if (obj[i].type != "html" && !obj[i].removed) {
                    let script = iframe.element.contentDocument.createElement("script");
                    if (obj[i].type != "javascript") script.type = obj[i].type;
                    iframe.element.contentDocument.head.appendChild(script);
                    script.text = sessionStorage.getItem(i);
                }
            }
            editor.setValue(iframe.element.contentDocument.documentElement.outerHTML);
            if (removeIframe) {
                document.body.removeChild(iframe.element);
                iframe = null;
            }
        }, 1);
    });
    document.getElementById("run").addEventListener("mousedown", function () {
        run = true;
        this.style.backgroundColor = "#e38";
        this.style.color = "#eee";
        sessionStorage.setItem(active.id, editor.getValue());
        if (!iframe) {
            let frontElement = option[option.length - 1].element;
            option.push({
                type: "iframe",
                element: document.createElement("iframe"),
                frontElement: frontElement,
                frontFrame: document.createElement("div"),
                sizeChange: false
            });
            iframe = option[option.length - 1];
            iframe.frontElement.style.width = iframe.frontElement.clientWidth * 7 / 10 + "px";
            document.body.appendChild(iframe.frontFrame);
            iframe.frontFrame.className = "frame";
            iframe.frontFrame.addEventListener("mousedown", mousedown(iframe));
            document.body.appendChild(iframe.element);
            iframe.element.style.width = windowWidth - (iframe.frontElement.getBoundingClientRect().right) - 10 + "px";
            iframe.element.addEventListener("load", function () {
                iframe.element.contentDocument.addEventListener("mousemove", thisElementMousemove(iframe));
                iframe.element.contentDocument.addEventListener("mouseup", mouseup(iframe));
            });
            iframe.frontElement.addEventListener("mousemove", frontElementMousemove(iframe));
            iframe.frontElement.addEventListener("mouseup", mouseup(iframe));
            document.addEventListener("mouseup", mouseup(iframe));
        }
        iframe.element.contentWindow.location.reload(true);
        setTimeout(function () {
            iframe.element.contentDocument.open();
            if (htmlEditor) iframe.element.contentDocument.write(sessionStorage.getItem(htmlEditor));
            iframe.element.contentDocument.close();
            for (let i = 1; i < obj.length; i++) {
                if (obj[i].type != "html" && !obj[i].removed) {
                    let script = iframe.element.contentDocument.createElement("script");
                    if (obj[i].type != "javascript") script.type = obj[i].type;
                    iframe.element.contentDocument.head.appendChild(script);
                    script.text = sessionStorage.getItem(i);
                }
            }
        }, 1);
    });
    document.getElementById("run").addEventListener("mouseover", function () {
        this.style.backgroundColor = "#e38";
        this.style.color = "#eee";
    });
    document.getElementById("run").addEventListener("mouseout", function () {
        this.style.backgroundColor = run ? "#e38" : "#eee";
        this.style.color = run ? "#eee" : "#e38";
    });
    document.getElementById("stop").addEventListener("mousedown", function () {
        if (iframe) {
            let iframeWidth = iframe.element.clientWidth;
            document.body.removeChild(iframe.element);
            document.body.removeChild(iframe.frontFrame);
            for (let i = 0; i < option.length; i++) {
                if (option[i].type == "iframe") {
                    option[i - 1].element.style.width = option[i - 1].element.clientWidth + iframeWidth + 3 + "px";
                    if (option.length > i + 1) {
                        option[i + 1].frontElement = option[i - 1].element;
                        option[i + 1].element.removeEventListener("mousemove", thisElementMousemove(option[i + 1]));
                        option[i + 1].frontElement.removeEventListener("mousemove", frontElementMousemove(option[i + 1]));
                        option[i + 1].element.addEventListener("mousemove", thisElementMousemove(option[i + 1]));
                        option[i + 1].frontElement.addEventListener("mousemove", frontElementMousemove(option[i + 1]));
                    }
                    option.splice(i, 1);
                    break;
                }
            }
            iframe = null;
        }
        run = false;
        autoReflesh = false;
        document.getElementById("autoReflesh").style.backgroundColor = "#fff";
        document.getElementById("autoReflesh").style.color = "#000";
        document.getElementById("run").style.backgroundColor = "#eee";
        document.getElementById("run").style.color = "#e38";
    });
    document.getElementById("stop").addEventListener("mouseout", function () {
        this.style.backgroundColor = "#eee";
        this.style.color = "#e38";
    });
    document.getElementById("stop").addEventListener("mouseover", function () {
        this.style.backgroundColor = "#e38";
        this.style.color = "#eee";
    });
    document.getElementById("add").addEventListener("mouseover", function () {
        this.style.color = "#e38";
    });
    document.getElementById("add").addEventListener("mouseout", function () {
        this.style.color = "#000";
    });
    document.getElementById("view").addEventListener("mouseover", function () {
        this.style.color = active.id == 0 ? "#000" : "#e38";
    });
    document.getElementById("view").addEventListener("mouseout", function () {
        this.style.color = active.id == 0 ? "#fff" : "#000";
    });
    document.getElementById("autoReflesh").addEventListener("mousedown", function () {
        autoReflesh = !autoReflesh;
        run = true;
        this.style.backgroundColor = !autoReflesh ? "#fff" : "#e38";
        this.style.color = !autoReflesh ? "#000" : "#fff";
        const e = document.createEvent("MouseEvents");
        e.initEvent("mousedown", false, true);
        document.getElementById("run").dispatchEvent(e);
        if (!autoReflesh) {
            const e = document.createEvent("MouseEvents");
            e.initEvent("mousedown", false, true);
            document.getElementById("stop").dispatchEvent(e);
            run = false;
        }
    });
    document.getElementById("autoReflesh").addEventListener("mouseover", function () {
        this.style.color = autoReflesh ? "#000" : "#e38";
    });
    document.getElementById("autoReflesh").addEventListener("mouseout", function () {
        this.style.color = autoReflesh ? "#fff" : "#000";
    });
    document.getElementById("selectiveCodeReturn").addEventListener("mousedown", function () {
        this.style.backgroundColor = selectiveCodeReturn ? "#fff" : "#e38";
        this.style.color = selectiveCodeReturn ? "#000" : "#fff";
        if (!selectiveCodeReturn) {
            let frontElement = option[option.length - 1].element;
            option.push({
                type: "selectiveCodeReturn",
                element: document.createElement("div"),
                frontElement: frontElement,
                frontFrame: document.createElement("div"),
                sizeChange: false
            });
            selectiveCodeReturn = option[option.length - 1];
            selectiveCodeReturn.frontElement.style.width = selectiveCodeReturn.frontElement.clientWidth * 7 / 10 + "px";
            document.body.appendChild(selectiveCodeReturn.frontFrame);
            selectiveCodeReturn.frontFrame.className = "frame";
            selectiveCodeReturn.frontFrame.addEventListener("mousedown", mousedown(selectiveCodeReturn));
            document.body.appendChild(selectiveCodeReturn.element);
            selectiveCodeReturn.element.style.overflow = "auto";
            selectiveCodeReturn.element.className = "option";
            selectiveCodeReturn.element.style.backgroundColor = "#222";
            selectiveCodeReturn.element.style.width = windowWidth - (selectiveCodeReturn.frontElement.getBoundingClientRect().right) - 10 + "px";
            selectiveCodeReturn.element.addEventListener("mousemove", thisElementMousemove(selectiveCodeReturn));
            selectiveCodeReturn.element.addEventListener("mouseup", mouseup(selectiveCodeReturn));
            if (selectiveCodeReturn.frontElement.tagName == "IFRAME") {
                selectiveCodeReturn.frontElement.contentDocument.addEventListener("mousemove", frontElementMousemove(selectiveCodeReturn));
                selectiveCodeReturn.frontElement.contentDocument.addEventListener("mouseup", mouseup(selectiveCodeReturn));
            } else {
                selectiveCodeReturn.frontElement.addEventListener("mousemove", frontElementMousemove(selectiveCodeReturn));
                selectiveCodeReturn.frontElement.addEventListener("mouseup", mouseup(selectiveCodeReturn));
            }
            document.addEventListener("mouseup", mouseup(selectiveCodeReturn));
        } else {
            let selectiveCodeReturnWidth = selectiveCodeReturn.element.clientWidth;
            document.body.removeChild(selectiveCodeReturn.element);
            document.body.removeChild(selectiveCodeReturn.frontFrame);
            for (let i = 0; i < option.length; i++) {
                if (option[i].type == "selectiveCodeReturn") {
                    option[i - 1].element.style.width = option[i - 1].element.clientWidth + selectiveCodeReturnWidth + 3 + "px";
                    if (option.length > i + 1) {
                        option[i + 1].frontElement = option[i - 1].element;
                        option[i + 1].element.removeEventListener("mousemove", thisElementMousemove(option[i + 1]));
                        option[i + 1].frontElement.removeEventListener("mousemove", frontElementMousemove(option[i + 1]));
                        option[i + 1].element.addEventListener("mousemove", thisElementMousemove(option[i + 1]));
                        option[i + 1].frontElement.addEventListener("mousemove", frontElementMousemove(option[i + 1]));
                    }
                    option.splice(i, 1);
                    break;
                }
            }
            selectiveCodeReturn = null;
        }
    });
    document.getElementById("selectiveCodeReturn").addEventListener("mouseover", function () {
        this.style.color = selectiveCodeReturn ? "#000" : "#e38";
    });
    document.getElementById("selectiveCodeReturn").addEventListener("mouseout", function () {
        this.style.color = selectiveCodeReturn ? "#fff" : "#000";
    });
    const mousedown = function (option) {
        return function (e) {
            option.sizeChange = true;
        }
    }
    const thisElementMousemove = function (option) {
        return function (e) {
            let x = option.element.tagName == "IFRAME" ? e.clientX : e.clientX - option.element.getBoundingClientRect().left;
            if (option) {
                if (option.sizeChange) {
                    option.element.style.width = option.element.clientWidth - x + "px";
                    option.frontElement.style.width = option.frontElement.clientWidth + x + "px";
                }
            }
        }
    }
    const frontElementMousemove = function (option) {
        return function (e) {
            let x = option.element.tagname == "IFRAME" ? e.clientX - option.frontElement.getBoundingClientRect().left : option.frontElement.tagName == "IFRAME" ? e.clientX : e.clientX - option.frontElement.getBoundingClientRect().left;
            if (option) {
                if (option.sizeChange) {
                    option.element.style.width = option.element.clientWidth + (option.frontElement.clientWidth - x) + "px";
                    option.frontElement.style.width = x + "px";
                }
            }
        }
    }
    const mouseup = function (option) {
        return function () {
            if (option) {
                if (option.sizeChange) {
                    option.sizeChange = false;
                }
            }
        }
    }
    document.getElementById("save").addEventListener("mousedown", function () {
        const data = editor.getValue();
        const e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        const a = document.createElement('a');
        a.textContent = 'save';
        switch (active.type) {
            case "html":
                a.download = "index.html";
                break;
            case "javascript":
                a.download = "main.js";
                break;
            case "vertexShader":
                a.download = "vertexShader.glsl";
                break;
            case "fragmentShader":
                a.download = "fragmentShader.glsl";
                break;
            default:
                a.download = "null.txt";
                break;
        }
        a.href = window.URL.createObjectURL(new Blob([data], { type: 'text/plain' }));
        a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
        a.dispatchEvent(e);
    });
    document.getElementById("load").addEventListener("mousedown", function () {
        const e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        document.getElementById("selfile").dispatchEvent(e);
    });
    document.getElementById("selfile").addEventListener("change", function () {
        const file = event.target.files;
        let reader = new FileReader();
        reader.readAsText(file[0]);
        reader.onload = function () {
            editor.setValue(reader.result);
        }
    });
    window.addEventListener("resize", function (e) {
        let parWidth = window.innerWidth / windowWidth;
        if (option.length > 0) {
            let width = 0;
            for (let i = 0; i < option.length - 1; i++) {
                option[i].element.style.width = option[i].element.clientWidth * parWidth + "px";
                width += option[i].element.clientWidth + 3;
            }
            option[option.length - 1].element.style.width = window.innerWidth - width - 7 + "px";
        }
        windowWidth = window.innerWidth;
    });
});