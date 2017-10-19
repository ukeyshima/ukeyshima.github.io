window.addEventListener("load",()=>{
    const httpObj=new XMLHttpRequest();
    httpObj.open("get","../data/data.json",true);
    httpObj.addEventListener("load",function(){
        const data=JSON.parse(this.responseText);
        const works=document.getElementById("works");
        for(key in data){
            const title=document.createElement("h2");
            title.className="title";
            works.appendChild(title);
            title.innerHTML="#"+key;
            data[key].forEach((i)=>{
                const div=document.createElement("div");
                div.id=i.name;
                div.style.backgroundImage="url(image/"+i.name+".png)";
                works.appendChild(div);
                const a=document.createElement("a");
                a.href=i.name+"/";
                div.appendChild(a);
            });
        }
    });
    httpObj.send(null);
});