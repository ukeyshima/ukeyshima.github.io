window.addEventListener("load", function () {
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/dawn");
    editor.setFontSize(23);
    editor.getSession().setMode("ace/mode/javascript");
    let run = false;
    let iframe;
    document.getElementById("run").addEventListener("mouseover", function () {
        this.style.backgroundColor = "#e38";
        this.style.color = "#eee";
    });
    document.getElementById("run").addEventListener("mouseout", function () {
        this.style.backgroundColor = run ? "#e38" : "#eee";
        this.style.color = run ? "#eee" : "#e38";
    });
    document.getElementById("run").addEventListener("mousedown", function () {
        run = true;
        this.style.backgroundColor = "#e38";
        this.style.color = "#eee";
        document.getElementById("editor").style.width = "70vw";
        if (!iframe) {
            iframe = document.createElement("iframe");
            iframe.style.width = "29vw";
            iframe.style.height = "100vh";
            document.body.appendChild(iframe);
            let script = iframe.contentWindow.document.createElement("script");
            script.text = editor.getValue();
            iframe.contentWindow.document.body.appendChild(script);
        }
    });
    document.getElementById("stop").addEventListener("mouseover", function () {
        this.style.backgroundColor = "#e38";
        this.style.color = "#eee";
    });
    document.getElementById("stop").addEventListener("mouseout", function () {
        this.style.backgroundColor = "#eee";
        this.style.color = "#e38";
    });
    document.getElementById("stop").addEventListener("mousedown", function () {
        run = false;
        document.getElementById("run").style.backgroundColor = "#eee";
        document.getElementById("run").style.color = "#e38";
        document.body.removeChild(iframe);
        iframe = null;
        document.getElementById("editor").style.width = "100vw";
    });
    document.getElementById("save").addEventListener("mouseover", function () {
        this.style.color = "#e38";
    });
    document.getElementById("save").addEventListener("mouseout", function () {
        this.style.color = "#000";
    });
    document.getElementById("save").addEventListener("mousedown", function () {
        const data = editor.getValue();
        const e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        const a = document.createElement('a');
        a.textContent = 'save';
        a.download = 'main.js';
        a.href = window.URL.createObjectURL(new Blob([data], { type: 'text/plain' }));
        a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
        a.dispatchEvent(e);
    });
    document.getElementById("load").addEventListener("mouseover", function () {
        this.style.color = "#e38";
    });
    document.getElementById("load").addEventListener("mouseout", function () {
        this.style.color = "#000";
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
        eventType = "loadEnd";
    });
    let autoReflesh = false;
    document.getElementById("autoReflesh").addEventListener("mouseover", function () {
        if (!autoReflesh) {
            this.style.color = "#e38";
        } else {
            this.style.color = "#fff";
        }
    });
    document.getElementById("autoReflesh").addEventListener("mouseout", function () {
        this.style.color = "#000";
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
    document.addEventListener("mousedown", function () {
        document.getElementById("filemenu").style.visibility = event.target == document.getElementById("file") ? "visible" : "hidden";
        document.getElementById("modemenu").style.visibility = event.target == document.getElementById("mode") ? "visible" : "hidden";
    });
    editor.session.on("change",function(){
        if(autoReflesh){
            try{
            iframe.contentDocument.location.reload(true);
            setTimeout(function(){
            let script = iframe.contentWindow.document.createElement("script");
            script.text = editor.getValue();
            iframe.contentWindow.document.body.appendChild(script);
            },0);
            }catch(e){

            }
        }
    });
});