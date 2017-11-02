window.addEventListener("load", function () {
    sessionStorage.clear();
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/dawn");
    editor.setFontSize(23);
    editor.getSession().setMode("ace/mode/html");
    let htmlEditor = null;
    let iframe = null;
    let autoReflesh = false;
    let obj = new Array();
    let id = 0;
    let active = {
        id: id,
        type: "html",
        removed:false
    }
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
                let p=tab[i].getElementsByTagName("p");
                if(tab[i]==document.getElementById("view"))tab[i].style.color="#000";
                for(let j=0;j<p.length;j++){
                    p[j].style.color="#000";
                }
            }
            let button = document.createElement("button");
            button.id = id;
            document.getElementById("tab").appendChild(button);
            button.style.backgroundColor = "#e38";
            button.style.color = "#eee";
            let close=document.createElement("p");
            button.appendChild(close);
            close.innerHTML="×";
            let name=document.createElement("p");
            button.appendChild(name);
            name.innerHTML=this.textContent;
            sessionStorage.setItem(active.id, editor.getValue());
            editor.setValue("");
            editor.getSession().setMode("ace/mode/" + this.className);
            obj.push({
                id: id,
                type: this.textContent,
                removed:false
            });
            let object = obj[obj.length - 1];
            if (this.className == "html") {
                this.disabled="disabled";
                this.innerHTML="";
            }
            button.addEventListener("mousedown", function () {
                let tab = document.getElementById("tab").getElementsByTagName("button");
                for (let i = 0; i < tab.length; i++) {
                    tab[i].style.backgroundColor = "#ccc";
                    if(tab[i]==document.getElementById("view"))tab[i].style.color="#000";
                    let p=tab[i].getElementsByTagName("p");
                    for(let j=0;j<p.length;j++){
                        p[j].style.color="#000";
                    }
                }
                this.style.backgroundColor = "#e38";
                name.style.color = "#eee";
                sessionStorage.setItem(active.id, editor.getValue());
                editor.setValue(sessionStorage.getItem(this.id));
                editor.getSession().setMode("ace/mode/" + object.type);
                active = object;
            });
            close.addEventListener("mousedown",function(){
                if (this.parentElement.getElementsByTagName("p")[1].innerHTML == "html"){
                    htmlEditor=null;
                    document.getElementById("html").disabled="";
                    document.getElementById("html").innerHTML="html";
                }
                document.getElementById("tab").removeChild(button);
                object.removed=true;
            });
            button.addEventListener("mouseover", function () {
                name.style.color = active.id == this.id ? "#000" : "#e38";
                close.style.color = active.id == this.id ? event.target.innerHTML=="×"?"#fff":"#000" : event.target.innerHTML=="×"?"#000":"#e38";
            });
            button.addEventListener("mouseout", function () {
                name.style.color = active.id == this.id ? "#fff" : "#000";
                close.style.color = active.id == this.id ? event.target.innerHTML=="×"?"#000":"#fff" : event.target.innerHTML=="×"?"#fff":"#000";
            });
            active = object;
        });
    };
    editor.session.on("change", function () {
        if (autoReflesh) {
            try {
                iframe.contentWindow.location.reload(true);
                setTimeout(function () {                                
                    sessionStorage.setItem(active.id, editor.getValue());
                    iframe.contentDocument.open();
                    if (htmlEditor) iframe.contentDocument.write(sessionStorage.getItem(htmlEditor));
                    iframe.contentDocument.close();
                    for (let i = 1; i < obj.length; i++) {
                        if (obj[i].type != "html" && !obj[i].removed) {
                            let script = iframe.contentDocument.createElement("script");
                            if (obj[i].type != "javascript") script.type = obj[i].type;
                            iframe.contentDocument.head.appendChild(script);
                            script.text = sessionStorage.getItem(i);
                        }
                    }
                }, 0);
            } catch (e) {
                console.log(e);
            }
        }
    });
    document.getElementById("view").addEventListener("mousedown", function () {
        let tab = document.getElementById("tab").getElementsByTagName("button");
        for (let i = 0; i < tab.length; i++) {
            tab[i].style.backgroundColor = "#ccc";
            let p=tab[i].getElementsByTagName("p");
            for(let j=0;j<p.length;j++){
                p[j].style.color="#000";
            }
        }
        this.style.backgroundColor = "#e38";
        this.style.color = "#eee";
        editor.getSession().setMode("ace/mode/html");
        sessionStorage.setItem(active.id, editor.getValue());
        active = {
            id: 0,
            type: "html"
        }
        if (!iframe) {
            iframe = document.createElement("iframe");
            document.body.appendChild(iframe);
        }
        setTimeout(function () {
            iframe.contentDocument.open();
            if (htmlEditor) iframe.contentDocument.write(sessionStorage.getItem(htmlEditor));
            iframe.contentDocument.close();
            for (let i = 1; i < obj.length; i++) {
                if (obj[i].type != "html" && !obj[i].removed) {
                    let script = iframe.contentDocument.createElement("script");
                    if (obj[i].type != "javascript") script.type = obj[i].type;
                    iframe.contentDocument.head.appendChild(script);
                    script.text = sessionStorage.getItem(i);
                }
            }
            editor.setValue(iframe.contentDocument.documentElement.outerHTML);
            if(!run){
            document.body.removeChild(iframe);
            iframe=null;
            }
        }, 1);
    });
    let run = false;
    document.getElementById("run").addEventListener("mousedown", function () {
        run = true;
        this.style.backgroundColor = run ? "e38" : "#eee";
        this.style.color = run ? "eee" : "#e38";
        sessionStorage.setItem(active.id, editor.getValue());
        document.getElementById("editor").style.width = "70vw";
        if (!iframe) {
            iframe = document.createElement("iframe");
            document.body.appendChild(iframe);
        }
        setTimeout(function () {
            iframe.contentDocument.open();
            if (htmlEditor) iframe.contentDocument.write(sessionStorage.getItem(htmlEditor));
            iframe.contentDocument.close();
            for (let i = 1; i < obj.length; i++) {
                if (obj[i].type != "html" && !obj[i].removed) {
                    let script = iframe.contentDocument.createElement("script");
                    if (obj[i].type != "javascript") script.type = obj[i].type;
                    iframe.contentDocument.head.appendChild(script);
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
        document.body.removeChild(iframe);
        iframe = null;
        run = false;
        autoReflesh=false;
        document.getElementById("autoReflesh").style.backgroundColor="#fff";
        document.getElementById("autoReflesh").style.color="#000";
        document.getElementById("run").style.backgroundColor = "#eee";
        document.getElementById("run").style.color = "#e38";
        document.getElementById("editor").style.width = "100vw";
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
        run=true;
        this.style.backgroundColor = !autoReflesh ? "#fff" : "#e38";
        this.style.color = !autoReflesh ? "#000" : "#fff";
        sessionStorage.setItem(active.id, editor.getValue());
        document.getElementById("editor").style.width = "70vw";
        if (!iframe) {
            iframe = document.createElement("iframe");
            document.body.appendChild(iframe);
        }
        document.getElementById("run").style.backgroundColor = "#e38";
        document.getElementById("run").style.color = "#eee";
    });
    document.getElementById("save").addEventListener("mousedown",function(){
        const data = editor.getValue();
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
            case "vertexShader":
            a.download="vertexShader.glsl";
            break;
            case "fragmentShader":
            a.download="fragmentShader.glsl";
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
            editor.setValue(reader.result);
        }
    });
});