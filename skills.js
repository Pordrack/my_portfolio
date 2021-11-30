//Retourne si l'element est a l'écran, copié collé de https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

skillBox=document.querySelector('#skills')
categories=[
    {
        'name':'Application development',
        'skills':[
            {
                'name':'C++',
                'level':59
            },
            {
                'name':'C#',
                'level':90
            },
            {
                'name':'C#',
                'level':58
            }
        ]
    },
    {
        'name':'Web development',
        'skills':[
            {
                'name':'HTML',
                'level':60
            },
            {
                'name':'CSS',
                'level':55
            },
            {
                'name':'JavaScript',
                'level':87
            },
            {
                'name':'PHP',
                'level':73
            }
        ]
    },
    {
        'name':'Database management',
        'skills':[
            {
                'name':'MySQL',
                'level':59
            },
            {
                'name':'PostgreSQL',
                'level':90
            },
            {
                'name':'Oracle SQL',
                'level':58
            }
        ]
    },
    {
        'name':'Languages',
        'skills':[
            {
                'name':'French (native)',
                'level':92
            },
            {
                'name':'English',
                'level':65
            }
        ]
    },
]

for (let category of categories) {
    //Pour chaque catégorie, on créé un panneau 
    let skillBoard=document.createElement("div");
    skillBoard.classList.add("woodboard");
    skillBoard.classList.add("sectionBoard");
    //Avec son titre a l'interieur
    let h2=document.createElement("h2")
    h2.innerHTML=category.name;
    h2.classList.add("centeredElement")
    skillBoard.appendChild(h2);

    //Puis on ajoute toutes les catégories et les skills
    for (let skill of category.skills) {
        //Chaque skill a une div pour être centrée
        divWrapper=document.createElement("div");
        divWrapper.classList.add("skillbarAndName")
        //on créé le titre t la barre pour chaque skill
        title=document.createElement("h3");
        title.innerHTML=skill.name;
        divWrapper.appendChild(title);

        barBackground=document.createElement("div");
        barBackground.classList.add("barBackground");
        divWrapper.appendChild(barBackground);

        barLevel=document.createElement("span");
        barLevel.classList.add("barLevel");
        barBackground.appendChild(barLevel);
        barLevel.innerHTML=skill.level+"%";
        skill.node=barLevel;
        skill.displayLevel=0;
        skillBoard.appendChild(divWrapper);
        /*barLevel.style.width=skill.level+"%";*/
    }
    skillBox.appendChild(skillBoard);
}

window.addEventListener("scroll",function(){
    //quand on scroll, on check tous les nodes et on les mets a leur niveau si ils n'y sont pas et affichés, et
    //a 0 si ils sont à leur niveau mais plus affichésss
    for (let category of categories) {
        for (let skill of category.skills) {
            if(isInViewport(skill.node) && skill.displayLevel==0){
                skill.displayLevel=skill.level;
                skill.node.style.width=skill.level+"%";
            }else if(!isInViewport(skill.node) && skill.displayLevel!=0){
                skill.displayLevel=0;
                skill.node.style.width=0;
            }
        }
    }
})