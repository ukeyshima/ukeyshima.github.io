window.addEventListener("load", function () {
    let iframe = document.getElementById("iframe");
    const viewEditor = ace.edit("viewEditor");
    viewEditor.setTheme("ace/theme/dawn");
    viewEditor.setFontSize(23);
    viewEditor.getSession().setMode("ace/mode/html");
    viewEditor.setValue(iframe.contentDocument.documentElement.outerHTML);
    viewEditor.setReadOnly(true);
    viewEditor.getDisplayIndentGuides();
    const { HashHandler } = require('ace/keyboard/hash_handler');
    const keyboardHandler = new HashHandler();
    keyboardHandler.addCommand({
        name: "run",
        bindKey: { win: 'Ctrl+r', mac: 'Command+r' },
        exec: () => {
            const e = document.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            document.getElementById("run").dispatchEvent(e);
        },
        readOnly: true
    });
    keyboardHandler.addCommand({
        name: "save-event",
        bindKey: { win: 'Ctrl+s', mac: 'Command+s' },
        exec: () => {
            const e = document.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            document.getElementById("save").dispatchEvent(e);
        },
        readOnly: true
    });

    viewEditor.keyBinding.addKeyboardHandler(keyboardHandler);

    let obj = new Array();
    let htmlEditor=null;
    let active={
     type:"html",
     button:document.getElementById("view"),
     editorFrame:document.getElementById("viewEditor"),
     editor:viewEditor 
    }
    document.addEventListener("mousedown", function () {
        document.getElementById("filemenu").style.visibility = event.target == document.getElementById("file") ? "visible" : "hidden";
        document.getElementById("modemenu").style.visibility = event.target == document.getElementById("mode") ? "visible" : "hidden";
        document.getElementById("addmenu").style.visibility = event.target == document.getElementById("add") ? "visible" : "hidden";
    });
    let addEditor=document.getElementById("addmenu").getElementsByTagName("button");
    for(let i=0;i<addEditor.length;i++){
        addEditor[i].addEventListener("mousedown",function(){
            let button = document.createElement("button");
            document.getElementById("tab").appendChild(button);
            let tab = document.getElementById("tab").getElementsByTagName("button");
            for (let j = 0; j < tab.length; j++) {
                tab[j].style.backgroundColor = "#ccc";
                tab[j].style.color = "#000";
            }
            button.style.backgroundColor = "#e38";
            button.style.color = "#eee";
            button.innerHTML = this.textContent;
            let editors = document.getElementsByClassName("editor");
            for (let j = 0; j < editors.length; j++) {
                editors[j].style.visibility = "hidden";
            }
            let editorFrame = document.createElement("div");
            editorFrame.id = this==document.getElementById("html")?"htmlEditor" :"editor"+obj.length;
            editorFrame.className = "editor";
            editorFrame.style.visibility = "visible";
            editorFrame.style.width = run ? "70vw" : "100vw";
            document.body.appendChild(editorFrame);
            let editor = ace.edit(this==document.getElementById("html")?"htmlEditor" :"editor"+obj.length);
            editor.setTheme("ace/theme/dawn");
            editor.setFontSize(23);
            editor.getSession().setMode("ace/mode/"+(this==document.getElementById("html")?"html" :this.className));
            editor.keyBinding.addKeyboardHandler(keyboardHandler);
            if(this==document.getElementById("html"))htmlEditor=editor;
            obj.push({
                type: this.className,
                button: button,
                editorFrame: editorFrame,
                editor: editor
            });
            let object=obj[obj.length-1];
            active=object;
            button.addEventListener("mousedown", function () {
                let tab = document.getElementById("tab").getElementsByTagName("button");
                for (let i = 0; i < tab.length; i++) {
                    tab[i].style.backgroundColor = "#ccc";
                    tab[i].style.color = "#000";
                }
                this.style.backgroundColor = "#e38";
                this.style.color = "#eee";
                for (let i = 0; i < editors.length; i++) {
                    editors[i].style.visibility = "hidden";
                }
                editorFrame.style.visibility = "visible";
                active=object;
            });
 
            if(this==document.getElementById("html")){
                document.getElementById("addmenu").removeChild(this);
            }
            editor.session.on("change",function(){
                if(autoReflesh){
                    try{
                        iframe.contentWindow.location.reload(true);
                        setTimeout(function () {
                            iframe.contentDocument.open();
                            if(!document.getElementById("html"))iframe.contentDocument.write(htmlEditor.getValue());
                            iframe.contentDocument.close();
                            for (let i = 0; i < obj.length; i++) {
                                if(obj[i].type!="html"){
                                let script = iframe.contentDocument.createElement("script");
                                if(obj[i].type!="javascript")script.type=obj[i].type;
                                iframe.contentDocument.head.appendChild(script);
                                script.text = obj[i].editor.getValue();
                                }
                            }
                        }, 1);
                    }catch(e){
    
                    }
                }
            });
        });
    };
    document.getElementById("run").addEventListener("mousedown", function () {
        let editor = document.getElementsByClassName("editor");
        for (let i = 0; i < editor.length; i++) {
            editor[i].style.width = "70vw";
        }
        iframe.style.zIndex = 2;
        for (let i = 0; i < editor.length; i++) {
            editor[i].style.zIndex = 1;
        }
        iframe.contentWindow.location.reload(true);
        setTimeout(function () {
            iframe.contentDocument.open();
            if(!document.getElementById("html"))iframe.contentDocument.write(htmlEditor.getValue());
            iframe.contentDocument.close();
            for (let i = 0; i < obj.length; i++) {
            if(obj[i].type!="html"){
                let script = iframe.contentDocument.createElement("script");
                if(obj[i].type!="javascript")script.type=obj[i].type;
                iframe.contentDocument.head.appendChild(script);
                script.text = obj[i].editor.getValue();
            }
            }
        }, 1);
    });
    document.getElementById("view").addEventListener("mousedown", function () {
    active={
     type:"html",
     button:document.getElementById("view"),
     editorFrame:document.getElementById("viewEditor"),
     editor:viewEditor 
    }
        viewEditor.setValue(iframe.contentDocument.documentElement.outerHTML);
        viewEditor.indent();
        let tab = document.getElementById("tab").getElementsByTagName("button");
        for (let i = 0; i < tab.length; i++) {
            tab[i].style.backgroundColor = "#ccc";
            tab[i].style.color = "#000";
        }
        this.style.backgroundColor = "#e38";
        this.style.color = "#eee";
        let editor = document.getElementsByClassName("editor");
        for (let i = 0; i < editor.length; i++) {
            editor[i].style.visibility = "hidden";
        }
        document.getElementById("viewEditor").style.visibility = "visible";
    });
    let run = false;

    document.getElementById("run").addEventListener("mouseover", function () {
        this.style.backgroundColor = "#e38";
        this.style.color = "#eee";
    });
    document.getElementById("run").addEventListener("mouseout", function () {
        this.style.backgroundColor = run ? "#e38" : "#eee";
        this.style.color = run ? "#eee" : "#e38";
    });

    let topButton = document.getElementById("top").getElementsByTagName("button");
    for (let i = 0; i < topButton.length; i++) {
        topButton[i].addEventListener("mouseover", function () {
            this.style.backgroundColor = "#e38";
            this.style.color = "#eee";
        });
        topButton[i].addEventListener("mouseout", function () {
            this.style.backgroundColor = "#eee";
            this.style.color = "#e38";
        });
    }
    document.getElementById("run").addEventListener("mousedown", function () {
        run = true;
        document.getElementById("run").style.backgroundColor = "#e38";
        document.getElementById("run").style.color = "#eee";
    });
    document.getElementById("run").addEventListener("mousedown", function () {
        this.style.backgroundColor = run ? "e38" : "#eee";
        this.style.color = run ? "eee" : "#e38";
    });
    document.getElementById("stop").addEventListener("mousedown", function () {
        run = false;
        document.getElementById("run").style.backgroundColor = "#eee";
        document.getElementById("run").style.color = "#e38";
        iframe.style.zIndex = 1;
        let editor = document.getElementsByClassName("editor");
        for (let i = 0; i < editor.length; i++) {
            editor[i].style.width = "100vw";
            editor[i].style.zIndex = 2;
        }
    });
    let dropdown = document.getElementsByClassName("dropdown");
    for (let i = 0; i < dropdown.length; i++) {
        let menu = dropdown[i].getElementsByTagName("button");
        for (let j = 0; j < menu.length; j++) {
            menu[j].addEventListener("mouseover", function () {
                this.style.color = "#e38";
            });
            menu[j].addEventListener("mouseout", function () {
                this.style.color = "#000";
            });
        }
    }
    let autoReflesh = false;
    document.getElementById("autoReflesh").addEventListener("mouseover", function () {
        if (!autoReflesh) {
            this.style.color = "#e38";
        } else {
            this.style.color = "#fff";
        }
    });
    document.getElementById("autoReflesh").addEventListener("mousedown", function () {
        if (!autoReflesh) {
            this.style.backgroundColor = "#e38";
            autoReflesh = true;
        } else {
            this.style.backgroundColor = "#fff";
            autoReflesh = false;
        }
    });
    document.getElementById("autoReflesh").addEventListener("mouseout", function () {
        if (!autoReflesh) {
            this.style.backgroundColor = "#fff";
            this.style.color = "#000";
        } else {
            this.style.backgroundColor = "#e38";
            this.style.color = "#000";
        }
    });
    document.getElementById("save").addEventListener("mousedown", function () {
        const data = active.editor.getValue();
        const e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        const a = document.createElement('a');
        a.textContent = 'save';
        switch(active.type){
            case "html":
            a.download="index.html";
            break;
            case "javascript":
            a.download="main.js";
            break;
            case "glsl":
            a.download="main.glsl";
            break;
            default:
            a.download="null.txt";
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
            active.editor.setValue(reader.result);
        }
        eventType = "loadEnd";
    });
});