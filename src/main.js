window.addEventListener("load",function(){
    let httpObj=new XMLHttpRequest();
    httpObj.open("get","../data/data.json",true);
    httpObj.onload=function(){
        let data=JSON.parse(this.responseText);
        let works=document.getElementById("works");
        for(key in data){
            let title=document.createElement("h2");
            title.className="title";
            works.appendChild(title);
            title.innerHTML=key;
            data[key].forEach(function(i){
                let div=document.createElement("div");
                div.id=i.name;
                div.style.backgroundImage="url(image/"+i.name+".png)"
                works.appendChild(div);
                let a=document.createElement("a");
                a.href=i.name+"/";
                div.appendChild(a);
            });
        }
    }
    httpObj.send(null);
});