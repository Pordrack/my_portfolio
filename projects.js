const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dimensions={"itchioDownload":{"width":552,"height":160},
"pico8old":{"width":600,"height":600},
"pico8now":{"width":620,"height":600}} //Stock les dimensions des differents types d'iframe

const projectBox=document.querySelector('#projects')
const projects=[
    {
        'name':'[Abandoned prototype] Eliatrope',
        'date':'2020-06-01',
        'link':'https://itch.io/embed/1287454?dark=true',
        'type':'itchioDownload',
    }
]

for (let project of projects) {
    //Pour chaque projet on fait un panneau
    let projectBoard=document.createElement("div");
    projectBoard.classList.add("woodboard");
    projectBoard.classList.add("sectionBoard");
    //projectBoard.classList.add("hideIframes");
    
    let dateTitle=document.createElement("h3");
    let dateObject=new Date(project.date)
    dateTitle.innerHTML=months[dateObject.getMonth()]+" "+dateObject.getFullYear();
    dateTitle.classList.add("centeredElement");
    projectBoard.appendChild(dateTitle);
    
    let title=document.createElement("h2");
    title.innerHTML=project.name;
    title.classList.add("centeredElement");
    projectBoard.appendChild(title);

    /*Section qui va être réduite/agrandie pour afficher/cacher la boite*/
    let iframeSection=document.createElement("div");
    iframeSection.classList.add("iframe-section");
    iframeSection.classList.add("closedSection");
    projectBoard.appendChild(iframeSection);
    
    /*Respecte la structure que j'ai trouvé sur internet, qui permet d'avoir un iframe bien responsibe*/
    let iframeContainer=document.createElement("div");
    iframeContainer.classList.add("iframe-container");
    iframeContainer.style.paddingTop=(100*(dimensions[project.type].height/dimensions[project.type].width))+"%";
    iframeSection.appendChild(iframeContainer)
    
    let iframe=document.createElement("iframe");
    iframe.src=project.link;
    iframe.classList.add("centeredElement");
    iframeContainer.appendChild(iframe);

    projectBox.appendChild(projectBoard);
    projectBoard.addEventListener("click",function(event){
        iframeSection=event.target.querySelector(".iframe-section");
        iframeSection.classList.toggle("closedSection");
        if(iframeSection.classList.contains("closedSection")){
            iframeSection.style.height="0px";
        }else{
            iframeSection.style.height=iframeSection.clientWidth*(dimensions[project.type].height/dimensions[project.type].width)+"px";
        }
    })
}

/*Quand la fenetre est resize il faut changer la taille les flexbox*/
window.addEventListener("resize",function(){
    iframeSections=document.querySelectorAll(".iframe-section");
    for (let iframeSection of iframeSections) {
        if(iframeSection.classList.contains("closedSection")){
            iframeSection.style.height="0px";
        }else{
            iframeSection.style.height=iframeSection.clientWidth*(dimensions[project.type].height/dimensions[project.type].width)+"px";
        } 
    }
})