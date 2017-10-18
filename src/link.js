window.addEventListener("load",function(){
    let dir = location.href.split("/");
    dir = dir[dir.length -2];
    let httpObj=new XMLHttpRequest();
    httpObj.open("get","../data/data.json",true);
    httpObj.onload=function(){
        let data=JSON.parse(this.responseText);
        let title=document.createElement("p");
        title.id="title";
        document.body.appendChild(title);
        title.innerHTML=dir;
        let check=document.createElement("input");
        check.id="check";
        check.type="checkbox";
        document.body.appendChild(check);
        let label=document.createElement("label");
        console.log(label);
        label.htmlFor="check";
        document.body.appendChild(label);
        let link=document.createElement("div");
        link.id="link";
        label.appendChild(link);
        let up=document.createElement("div");
        up.className="linkChild";
        up.id="up";
        document.body.appendChild(up);
        let middle=document.createElement("div");
        middle.className="linkChild";
        middle.id="middle";
        document.body.appendChild(middle);
        let low=document.createElement("div");
        low.className="linkChild";
        low.id="low";
        document.body.appendChild(low);
        let linkDiv=document.createElement("div");
        linkDiv.id="linkDiv";
        document.body.appendChild(linkDiv);
        let titleLink=document.createElement("div");
        titleLink.id="titleLink";
        linkDiv.appendChild(titleLink);
        titleLink.style.backgroundImage="url(\"../image/toppage.png\")";
        titleLink.style.top="100px";
        let a=document.createElement("a");
        a.href="../";
        titleLink.appendChild(a);
        let count=0;
        for(key in data){
            data[key].forEach(function(i){
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
    }
    httpObj.send(null);

});