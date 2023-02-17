const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

/*let flipperImg=new Image();
startBgImage.addEventListener("load",function(){
    flipperImg.src="img/Flipper.png";
});*/

const projectBox=document.querySelector('#HighlightedProjects')
let projects=[
    {
        'name':'Glitch of Fear',
        'date':'2022-10-19',
        'link':'https://l4louve.itch.io/glitch-of-fears',
        'sourceCode':'https://github.com/Pordrack/L4LouveLMWonderJam',
        'moreDetails':'#GlitchOfFear',
        'image':'https://img.itch.zone/aW1hZ2UvMTc0MDAxMS8xMDYzMzYzOS5wbmc=/original/uH%2FzXf.png',
        'description':[
            "R\u00E9alis\u00E9 \u00E0 5 et en 48h pour la Wonder Jam d'automne 2022 (th\u00E8me \"It's not a glitch it's a feature\"). Ce jeu \u00E9tait ma premi\u00E8re exp\u00E9rience de Game Jam en pr\u00E9sentiel et fut d\u00E9velopp\u00E9 sous Unity.",
            "Il propose de jouer à un jeu de plateau glitché en utilisant des cartes aux effets loufoques et instables. J'ai participé au game design du jeu et j'ai développé le systèmes des cartes."
        ]
    },
    {
        'name':'Mushrooms of the end',
        'date':'2022-04-04',
        'link':'https://pordrack.itch.io/mushrooms-of-the-end',
        'sourceCode':'https://github.com/Pordrack/Mushrooms-of-the-end-Ludum-Dare-2022-',
        'moreDetails':'#MushroomsOfTheEnd',
        'image':'https://static.jam.vg/raw/beb/54/z/4b5b0.png',
        'description':[
            "R\u00E9alis\u00E9 \u00E0 4 en 72h pour la Ludum Dare 50 (th\u00E8me Delay the Inevitable). Ce m\u00E9lange entre un Tower Defense et un Idle Game demande aux joueurs de jongler entre plusieurs plantes en optimisant ses ressources pour les maintenir en vie.",
            "Je me suis occupé de la majorité du code et des aspects techniques d'Unity, notamment le système d’événements, les effets de particules (eau, langue de crapaud) et les effets de post-processing."
        ]
    },
    {
        'name':'Colin of Duty',
        'date':'2022-03-19',
        'link':'https://pordrack.itch.io/colin-of-duty',
        'moreDetails':'#ColinOfDuty',
        'image':'img/ColinOfDuty/Shooting.png',
        'description':[
            "Réalisé à 4 comme projet scolaire sous Unity. Ce FPS inspiré du premier Doom propose d'incarner notre professeur affrontant une armée de clones dans les couloirs de notre IUT. Ses graphismes grotesques et sa physique ragdoll le rendent humoristique. ",
            "Je me suis occupé de la majorité du code et du projet Unity, incluant le système de ragdolls, les mini-jeux de Simon-like, le comportement des ennemis et les effets de post-processing."
        ]
    },
    {
        'name':'Intranet Meggitt Archamps',
        'date':'2022-06-19',
        
        'image':'img/highlightedProjects/intranet.png',
        'description':[
            "J'ai fait un stage de 3 mois à <a href=\"https://www.meggittsensorex.fr/\">Meggitt Archamps</a> en tant que développeur web fullstack pour le framework C# <a href=\"https://fr.wikipedia.org/wiki/ASP.NET\">ASP.NET.</a>",
            "J'y ai amélioré le module d'Intranet permettant de partager des communications, notamment en y ajoutant un éditeur d'image intégré développé from scratch. ",
            "Après cela j'ai ajouté un module permettant de réserver et consulter ses repas à la cantine, ainsi que d'échanger ses repas entre collègues en cas de désistement/besoin de dernière minute."
        ]
    },
]

let i=0;
for (let project of projects) {
    //Pour chaque projet on fait un panneau
    let projectBoard=document.createElement("div");
    projectBoard.classList.add("highlightProject-container");
    projectBoard.classList.add((i%2)?"even":"odd");
    i++;
    
    //D'abord le header
    let header=document.createElement("div");
    header.classList.add("woodboard")
    header.style="grid-area: header; padding-bottom:3%;"

    //Avec la date
    let dateTitle=document.createElement("h3");
    let dateObject=new Date(project.date)
    dateTitle.innerHTML=months[dateObject.getMonth()]+" "+dateObject.getFullYear();
    dateTitle.classList.add("centeredElement");
    header.appendChild(dateTitle);
    
    //Le titre
    let title=document.createElement("h2");
    title.innerHTML=project.name;
    title.classList.add("centeredElement");
    header.appendChild(title);

    projectBoard.appendChild(header);

    //Les liens
    let links=document.createElement("div");
    links.classList.add("woodboard")
    links.classList.add("links")
    links.style="grid-area: links; padding-bottom:3%;"
    let emptyLinks=true;

    if(project.link!=null){
        let link=document.createElement("a");
        link.href=project.link;
        link.innerHTML="<h3>Lien</h3>";
        link.classList.add("centeredElement");
        links.appendChild(link);
        emptyLinks=false;
    }

    if(project.sourceCode!=null){
        let sourceLink=document.createElement("a");
        sourceLink.href=project.sourceCode;
        sourceLink.innerHTML="<h3>Code source</h3>";
        sourceLink.classList.add("centeredElement");
        links.appendChild(sourceLink);
        emptyLinks=false;
    }

    if(project.moreDetails!=null){
        let moreDetailsLink=document.createElement("a");
        moreDetailsLink.href=project.moreDetails;
        moreDetailsLink.innerHTML="<h3>Plus de détails</h3>";
        moreDetailsLink.classList.add("centeredElement");
        links.appendChild(moreDetailsLink);
        emptyLinks=false;
    }

    if(!emptyLinks){
        projectBoard.appendChild(links);
    }

    //Et les paragraphes de sa description (si il en a une)
    if(project.description!=null){
        let description=document.createElement("div");
        description.classList.add("woodboard");
        description.style="grid-area: p;"
        let addTab=false;
        for (let para of project.description) {
            let p=document.createElement("p");
            p.innerHTML=(addTab ? "⠀&emsp;" : "")+para;
            p.classList.add("description");
            description.appendChild(p);
            addTab=true;
        }
        projectBoard.appendChild(description);
    }

    //Enfin, l'image
    let image=document.createElement("div");
    image.classList.add("woodboard");
    image.style="grid-area: img;"
    image.innerHTML='<div class="shadow"> \
            <img clas="centeredElement" src="'+project.image+'" data-zoomable/>  \
        </div>';
    projectBoard.appendChild(image);
     
    

    projectBox.appendChild(projectBoard);
}

function hideAllProjects(nodeOfException){//On cache tous les projets sauf un
    for (const project of projects) {
        if(project.node!=nodeOfException){
            project.node.classList.add("hideIframes");
            let iframe=project.node.querySelector("iframe");
            iframe.src=null;
        }
    }
}
