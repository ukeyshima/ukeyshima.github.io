window.addEventListener("load",()=>{
    let dir = location.href.split("/");
    dir = dir[dir.length -2];
    const httpObj=new XMLHttpRequest();
    httpObj.open("get","../data/data.json",true);
    httpObj.addEventListener("load",function(){
        const data=JSON.parse(this.responseText);
        const title=document.createElement("p");
        title.id="title";
        document.body.appendChild(title);
        title.innerHTML=dir;
        const check=document.createElement("input");
        check.id="check";
        check.type="checkbox";
        document.body.appendChild(check);
        const label=document.createElement("label");
        label.htmlFor="check";
        document.body.appendChild(label);
        const link=document.createElement("div");
        link.id="link";
        label.appendChild(link);
        const up=document.createElement("div");
        up.className="linkChild";
        up.id="up";
        document.body.appendChild(up);
        const middle=document.createElement("div");
        middle.className="linkChild";
        middle.id="middle";
        document.body.appendChild(middle);
        const low=document.createElement("div");
        low.className="linkChild";
        low.id="low";
        document.body.appendChild(low);
        const linkDiv=document.createElement("div");
        linkDiv.id="linkDiv";
        document.body.appendChild(linkDiv);
        const titleLink=document.createElement("div");
        titleLink.id="titleLink";
        linkDiv.appendChild(titleLink);
        titleLink.style.backgroundImage="url(\"../image/toppage.png\")";
        titleLink.style.top="100px";
        const a=document.createElement("a");
        a.href="../";
        titleLink.appendChild(a);
        let count=0;
        for(key in data){
            data[key].forEach((i)=>{
                if(i.name!=dir){
                  let link=document.createElement("div");
                  link.id=i.name;
                  linkDiv.appendChild(link);
                  link.style.backgroundImage="url(\"../image/"+i.name+".png\")";
                  link.style.top=250+count*150+"px";
                  let a=document.createElement("a");
                  a.href="../"+i.name+"/";
                  link.appendChild(a);
                  count++;
                }
            });
        }
    });
    httpObj.send(null);

});