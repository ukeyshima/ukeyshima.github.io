window.addEventListener("load", function () {
    sessionStorage.clear();
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/dawn");
    editor.setFontSize(23);
    editor.getSession().setMode("ace/mode/html");
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
    let run = false;
    let option = new Array();
    let iframe = null;
    let autoReflesh = false;
    let selectiveCodeReturn = null;
    let selectiveCodeReturnObjects = new Array();
    let obj = new Array();
    let id = 0;
    let htmlEditor = id;
    let tabChangeEvent = false;
    let active = {
        id: id,
        type: "html",
        fileName: "index.html",
        mode: "html",
        removed: false
    };
    obj.push(active);
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
    document.addEventListener("mousedown", function () {
        document.getElementById("filemenu").style.visibility = event.target == document.getElementById("file") ? "visible" : "hidden";
        document.getElementById("modemenu").style.visibility = event.target == document.getElementById("mode") ? "visible" : "hidden";
        document.getElementById("addmenu").style.visibility = event.target == document.getElementById("add") || event.target == document.getElementById("fileName") || event.target == document.getElementById("extension") ? "visible" : "hidden";
    });

    document.getElementById("html").addEventListener("mousedown", function () {
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
        sessionStorage.setItem(active.id, editor.getValue());
        let autoRefleshEvent = false;
        if (autoReflesh) autoRefleshEvent = true;
        autoReflesh = false;
        editor.setValue(sessionStorage.getItem(htmlEditor));
        if (autoRefleshEvent) autoReflesh = true;
        active = {
            id: 0,
            type: "html",
            fileName: "index.html",
            mode: extension.className,
            removed: false
        }
    });
    document.getElementById("html").addEventListener("mouseover", function () {
        this.getElementsByTagName("p")[0].style.color = active.id == 0 ? "#000" : "#e38";
    });
    document.getElementById("html").addEventListener("mouseout", function () {
        this.getElementsByTagName("p")[0].style.color = active.id == 0 ? "#fff" : "#000";
    });
    document.getElementById("create").addEventListener("mousedown", function () {
        let fileName = document.getElementById("fileName").value;
        let num = document.getElementById("extension").selectedIndex;
        let extension = document.getElementById("extension").getElementsByTagName("option")[num];
        id++;
        let tab = document.getElementById("tab").getElementsByTagName("button");
        for (let i = 0; i < tab.length; i++) {
            tab[i].style.backgroundColor = "#ccc";
            let p = tab[i].getElementsByTagName("p");
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
        name.innerHTML = fileName + "." + extension.value;
        sessionStorage.setItem(active.id, editor.getValue());
        let autoRefleshEvent = false;
        if (autoReflesh) autoRefleshEvent = true;
        autoReflesh = false;
        editor.setValue("");
        if (autoRefleshEvent) autoReflesh = true;
        editor.getSession().setMode("ace/mode/" + extension.className);
        obj.push({
            id: id,
            type: extension.innerHTML,
            fileName: fileName + "." + extension.value,
            mode: extension.className,
            removed: false
        });
        let object = obj[obj.length - 1];
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

    let beforeRemoveTime = new Date().getTime();
    let beforeAction = null;
    editor.session.on("change", function (e) {
        try {
            if (!tabChangeEvent) {
                if (e.action == "remove") {
                    if (new Date().getTime() - beforeRemoveTime > 2000 || beforeAction != "remove") {
                        selectiveCodeReturnObjects.push({ id: active.id, type: e.action, key: "", startRow: e.start.row, startColumn: e.start.column, endRow: e.end.row, endColumn: e.end.column, undo: false });
                    }
                    for (let i = 0; i < e.lines.length; i++) {
                        selectiveCodeReturnObjects[selectiveCodeReturnObjects.length - 1].key = e.lines[i] + selectiveCodeReturnObjects[selectiveCodeReturnObjects.length - 1].key;
                    }
                    beforeRemoveTime = new Date().getTime();
                }
                beforeAction = e.action;
            }
            if (autoReflesh) {
                sessionStorage.setItem(active.id, editor.getValue());
                codeExecution();
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
            iframe.frontElement.style.width = Math.floor(iframe.frontElement.clientWidth * 7 / 10) + "px";
            document.body.appendChild(iframe.frontFrame);
            iframe.frontFrame.className = "frame";
            iframe.frontFrame.addEventListener("mousedown", mousedown(iframe));
            document.body.appendChild(iframe.element);
            iframe.element.style.width = windowWidth - (iframe.frontElement.getBoundingClientRect().right) - 7 + "px";
            iframe.element.addEventListener("load", function () {
                iframe.element.contentDocument.addEventListener("mousemove", thisElementMousemove(iframe));
                iframe.element.contentDocument.addEventListener("mouseup", mouseup(iframe));
            });
            iframe.frontElement.addEventListener("mousemove", frontElementMousemove(iframe));
            iframe.frontElement.addEventListener("mouseup", mouseup(iframe));
            document.addEventListener("mouseup", mouseup(iframe));
        }
        codeExecution();
    });
    function codeExecution() {
        let domParser = new DOMParser();
        let document_obj = null;
        try {
            document_obj = domParser.parseFromString(sessionStorage.getItem(htmlEditor), "text/html");
            if (document_obj.getElementsByTagName("parsererror").length) {
                document_obj = null;
            }
        } catch (e) {
            console.log(e);
        }
        if (document_obj) {
            let script = document_obj.getElementsByTagName("script");
            let link = document_obj.getElementsByTagName("link");
            for (let i = 0; i < script.length; i++) {
                for (let j = 0; j < obj.length; j++) {
                    if (obj[j].type != "html" && obj[j].type != "css" && !obj[j].removed) {
                        if (script[i].src) {
                            if (script[i].src.split("/")[script[i].src.split("/").length - 1] == obj[j].fileName) {
                                let blob = new Blob([sessionStorage.getItem(j)], { type: 'application/javascript' });
                                script[i].src = URL.createObjectURL(blob);
                            }
                        } else {
                            if (script[i].type == obj[j].fileName) {
                                script[i].text = sessionStorage.getItem(j);
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < link.length; i++) {
                for (let j = 0; j < obj.length; j++) {
                    if (obj[j].type == "css" && !obj[j].removed) {                        
                        if (link[i].href.split("/")[link[i].href.split("/").length - 1] == obj[j].fileName) {                            
                            if (link[i].rel == "stylesheet") {                
                                let blob = new Blob([sessionStorage.getItem(j)], { type: 'text/css' });
                                link[i].href = URL.createObjectURL(blob);
                            }
                        }
                    }
                }
            }
            blob = new Blob([document_obj.documentElement.outerHTML], { type: 'text/html' });
            iframe.element.contentWindow.location.replace(URL.createObjectURL(blob));
        }
    }
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
                    option[i - 1].element.style.width = option[i - 1].element.clientWidth + iframeWidth + 6 + "px";
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
            selectiveCodeReturn.frontElement.style.width = Math.floor(selectiveCodeReturn.frontElement.clientWidth * 7 / 10) + "px";
            document.body.appendChild(selectiveCodeReturn.frontFrame);
            selectiveCodeReturn.frontFrame.className = "frame";
            selectiveCodeReturn.frontFrame.addEventListener("mousedown", mousedown(selectiveCodeReturn));
            document.body.appendChild(selectiveCodeReturn.element);
            selectiveCodeReturn.element.style.overflow = "auto";
            selectiveCodeReturn.element.className = "option";
            selectiveCodeReturn.element.style.backgroundColor = "#222";
            selectiveCodeReturn.element.style.width = windowWidth - (selectiveCodeReturn.frontElement.getBoundingClientRect().right) - 3 + "px";
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
                    option[i - 1].element.style.width = option[i - 1].element.clientWidth + selectiveCodeReturnWidth + 10 + "px";
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
            if (option) {
                if (option.sizeChange) {
                    let x = option.element.tagName == "IFRAME" ? e.clientX : e.clientX - option.element.getBoundingClientRect().left;
                    option.element.style.width = Math.floor(option.element.clientWidth - x) + "px";
                    option.frontElement.style.width = Math.floor(option.frontElement.clientWidth + x) + "px";
                }
            }
        }
    }
    const frontElementMousemove = function (option) {
        return function (e) {
            if (option) {
                if (option.sizeChange) {
                    let x = option.element.tagname == "IFRAME" ? e.clientX - option.frontElement.getBoundingClientRect().left : option.frontElement.tagName == "IFRAME" ? e.clientX : e.clientX - option.frontElement.getBoundingClientRect().left;
                    option.element.style.width = Math.floor(option.element.clientWidth + (option.frontElement.clientWidth - x)) + "px";
                    option.frontElement.style.width = Math.floor(x) + "px";
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
        let data = editor.getValue();
        if (active.id == htmlEditor) {
            let domParser = new DOMParser();
            let document_obj = null;
            try {
                document_obj = domParser.parseFromString(sessionStorage.getItem(htmlEditor), "text/html");
                if (document_obj.getElementsByTagName("parsererror").length) {
                    document_obj = null;
                }
            } catch (e) {
                console.log(e);
            }
            if (document_obj) {
                let script = document_obj.getElementsByTagName("script");
                for (let i = 0; i < script.length; i++) {
                    for (let j = 0; j < obj.length; j++) {
                        if (obj[j].type != "html" && obj[j].type != "css" && !obj[j].removed) {
                            if (script[i]) {
                                if (!script[i].src) {
                                    if (script[i].type == obj[j].fileName) {
                                        script[i].text = sessionStorage.getItem(j);
                                    }
                                }
                            }
                        }
                    }
                }
                data = document_obj.documentElement.outerHTML;
            }
        }
        const e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        const a = document.createElement("a");
        a.textContent = "save";
        a.download = active.fileName;
        a.href = window.URL.createObjectURL(new Blob([data], { type: 'text/plain' }));
        a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
        a.dispatchEvent(e);
    });
    document.addEventListener("keydown",function(e){
        if(document.getElementById("addmenu").style.visibility=="visible"){
            if(e.key=="Enter"){
                const e = document.createEvent("MouseEvents");
                e.initEvent("mousedown", false, true);
                document.getElementById("create").dispatchEvent(e);  
                document.getElementById("addmenu").style.visibility="hidden";
            }
        }
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
            let iframeExist = false;
            for (let i = 0; i < option.length - 1; i++) {
                if (option[i].element.tagName == "IFRAME") iframeExist = true;
                option[i].element.style.width = Math.floor(option[i].element.clientWidth * parWidth) + "px";
                width += option[i].element.clientWidth + 3;
            }
            if (option[option.length - 1].element.tagName == "IFRAME") iframeExist = true;
            option[option.length - 1].element.style.width = iframeExist ? window.innerWidth - width - 4 + "px" : window.innerWidth - width + "px";
        }
        windowWidth = window.innerWidth;
    });
    let if_ctrl = 0;
    let if_r = 0;
    function is_ctrl(pressKey) {
        if (pressKey == 17) {
            return 1;
        } else if (navigator.userAgent.match(/macintosh/i)) {
            if (pressKey == 224 && navigator.userAgent.match(/firefox/i)) {
                return 1;
            } else if (pressKey == 91 || pressKey == 93) {
                return 1;
            }
        }
        return 0;
    }
    function disable_reload(e) {
        if (navigator.userAgent.match(/msie/i) && window.event) {
            window.event.returnValue = false;
            window.event.keyCode = 0
        } else
            if (navigator.userAgent.match(/macintosh/i) || e.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
        return false;
    }
    document.getElementById("extension").addEventListener("change", function () {
        document.getElementById("centerSelect").innerHTML = this.getElementsByTagName("option")[this.selectedIndex].innerHTML + "  ▽";
    });
    document.getElementById("extension").addEventListener("mouseover", function () {
        document.getElementById("centerSelect").style.color = "#e38";
    });
    document.getElementById("extension").addEventListener("mouseout", function () {
        document.getElementById("centerSelect").style.color = "#000";
    });
    document.addEventListener("keydown", function (e) {
        let pressKey;
        if (eval(e)) {
            pressKey = e.keyCode;
        } else {
            pressKey = event.keyCode;
        }
        if (is_ctrl(pressKey) == 1) {
            if_ctrl = 1;
            if (if_r == 1) { return disable_reload(e); }
        }
        if (pressKey == 82) {
            if_r = 1;
            if (if_ctrl == 1) { return disable_reload(e); }
        }
        if (pressKey == 116) {
            if (navigator.userAgent.match(/safari/i)
                && !navigator.userAgent.match(/chrome/i)) {
                window.location = "%_myname_%?n=%_n_%&i=%_i_%";
                return true;
            } else {
                return disable_reload(e);
            }
        }
    });
    document.addEventListener("keyup", function (e) {
        let pressKey;
        if (eval(e)) {
            pressKey = e.keyCode;
        } else {
            pressKey = event.keyCode;
        }
        if (is_ctrl(pressKey) == 1) {
            if_ctrl = 0;
            if (if_r == 1) { return disable_reload(e); }
        }
        if (pressKey == 82) {
            if_r = 0;
            if (if_ctrl == 1) { return disable_reload(e); }
        }
        if (pressKey == 116) {
            if (navigator.userAgent.match(/safari/i)
                && !navigator.userAgent.match(/chrome/i)) {
                window.location = "%_myname_%?n=%_n_%&i=%_i_%";
            } else {
                return disable_reload(e);
            }
        }
    });
});
