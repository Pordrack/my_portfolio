const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dimensions={"itchioDownload":{"width":552,"height":160},
"pico8":{"width":1920,"height":1080},
"youtubeVideo":{"width":853,"height":480},
"website":{"width":1,"height":0.6}
} //Stock les dimensions des differents types d'iframe



/*let flipperImg=new Image();
startBgImage.addEventListener("load",function(){
    flipperImg.src="img/Flipper.png";
});*/

const projectBox=document.querySelector('#projects')
const projects=[
    {
        'name':'This portfolio',
        'date':'2021-12-13',
        'link':'https://pordrack.github.io/my_portfolio',
        'type':'website',
        'description':[
            'Originally made as a cross-project between web development and english, I have maintained and upgraded ever since to make this website a display of my work.'
        ]
    },
    {
        'name':'Gravitrain',
        'date':'2021-06-20',
        'link':'https://itch.io/embed/1307342?dark=true',
        'type':'itchioDownload',
    },
    {
        'name':'An Endless Search',
        'date':'2021-01-01',
        'link':'https://itch.io/embed-upload/4806156?color=23314b',
        'type':'pico8',
        'description':[
            'Years ago, your parent disappeared, but while chilling in a space station, a mysterious spirit tells you that he knows where your parent is, you just have to find him and his mysterious planet. Go from planet to planet using your teleporter, ask  NPCs about the location of the planet, but be careful, the more you travel, the more you have to change the battery.',
            'The universe is different each time you reset the game.',
            'Controls: Move with the arrow keys, select something with C, go back with V.',
            'Made in 2 days for the Global Game Jam 2021, the game had to follow the theme "Lost and found". I also took on additional constraints, like using RNG for unusual things (in this case, name of characters and location and color palette).'
        ]
    },
    {
        'name':'[Abandoned prototype] Eliatrope',
        'date':'2020-06-01',
        'link':'https://itch.io/embed/1287454?dark=true',
        'type':'itchioDownload',
    },
    {
        'name':'Pack the Items',
        'date':'2020-05-01',
        'link':'https://itch.io/embed/631659?dark=true',
        'type':'itchioDownload',
    },
    {
        'name':'Light the Match 4: Burn them all',
        'date':'2020-05-01',
        'link':'https://itch.io/embed/1286733?dark=true',
        'type':'itchioDownload',
    },
    {
        'name':'Airship vs. Abomination',
        'date':'2020-03-01',
        'link':'https://itch.io/embed/1286598?dark=true',
        'type':'itchioDownload',
    },
    {
        'name':'[Abandoned prototype] The Ragdolly Spider-Wheel',
        'date':'2019-08-01',
        'link':'https://itch.io/embed/1287907?dark=true',
        'type':'itchioDownload',
    },
    {
        'name':'Cut the Food',
        'date':'2019-06-01',
        'link':'https://itch.io/embed/433606?dark=true',
        'type':'itchioDownload',
    },
    {
        'name':'The Legend of Karnia: Lost between realities',
        'date':'2019-05-01',
        'link':'https://itch.io/embed/1286692?dark=true',
        'type':'itchioDownload',
    },
    {
        'name':'[Video] Fake commercial for San Pellegrino',
        'date':'2019-04-28',
        'link':'https://www.youtube.com/embed/ZqJPO92x0E0',
        'type':'youtubeVideo',
        'description':[
            '[English subs available]',
            'Made by my classmates and myself as a school project for our italian class. We had a lot of fun writing and filming it! I\'m the nerd and the narrator. You can find more complete credits in the video description.'
        ]
    },
    {
        'name':'[Website] Le fil rouge des bloods',
        'date':'2019-04-18',
        'link':'https://pordrack.github.io/Le-fil-rouge-des-bloods/',
        'showLink':true,
        'type':'website',
        'description':[
            'A website regrouping work of art from the different members of a Discord I was on. They all have something in common: a red string',
            'It was my first real website, and my first "collaborative" project outside school, it was a lot of fun although a bit stressful as it was my first time as a kind of "project leader". The HTML/CSS of this website is not my best work.'
        ]
    },
    {
        'name':'Ophélie',
        'date':'2019-04-01',
        'link':'https://itch.io/embed-upload/4837993?color=303030',
        'type':'pico8',
        'description':[
            'Made as a school project with Tyspoo, who helped me make the graphics and set up an installation in the school\'s library where student could compete for the high score, the goal was to make something creative based on a poem of Arthur Rimbaud\'s "Cahier de Douhais".',
            'Controls: Move with the arrow keys, confirm your name on highscores with C',
        ]
    },
    {
        'name':'The Iron Giant: The Adventure Game',
        'date':'2019-02-01',
        'link':'https://itch.io/embed-upload/4837996?color=303030',
        'type':'pico8',
        'description':[
            'You are Hoggart , a young boy friend with the Iron Giant , you have to collect the 4 missing part of your friend , in order to allow him to stop the missile which threat Rockwell.',
            'An unofficial adaptation of the animated movie into a Zelda-Like game. It was my first game with a big map and a real "story".',
            'Controls: Move with the arrow keys, attack with V',
        ]
    },
    {
        'name':'Growing darkness',
        'date':'2019-02-01',
        'link':'https://itch.io/embed-upload/4837871?color=303030',
        'type':'pico8',
        'description':[
            'You have to retrieve the Solar Orb , in order to repair the sun , but beware Darknesses, before they grow and block every possible path.',
            'Controls: Move with the arrow keys, run with C, blink forward with V.',
            'This game was made in a couple of days as a challenge with a friend: we both had to make a "rage" game about darkness.'
        ]
    },
    {
        'name':'Light the Match',
        'date':'2019-02-01',
        'link':'https://itch.io/embed/372012?dark=true',
        'type':'itchioDownload',
    },
    {
        'name':'Offline T-Rex Game : Pico 8 Demake',
        'date':'2019-01-01',
        'link':'https://itch.io/embed-upload/4837922?color=303030',
        'type':'pico8',
        'description':[
            'A little demake of Chromium and Chrome\'s T-Rex game',
            'Controls: Duck with the down arrow, jump with V or the up arrow, and switch between color and black and white with C',
        ]
    },
    {
        'name':'Vampire Stakes',
        'date':'2018-12-01',
        'link':'https://itch.io/embed/345965?dark=true',
        'type':'itchioDownload',
    },
    {
        'name':'The Legend of Karnia: Shadow\'s return',
        'date':'2018-10-01',
        'link':'https://itch.io/embed/321699?dark=true',
        'type':'itchioDownload',
    },
    {
        'name':'Pipo the shooting star',
        'date':'2018-9-01',
        'link':'https://itch.io/embed/317350?dark=true',
        'type':'itchioDownload',
    },
]

for (let project of projects) {
    //Pour chaque projet on fait un panneau
    let projectBoard=document.createElement("div");
    projectBoard.classList.add("woodboard");
    projectBoard.classList.add("sectionBoard");
    projectBoard.classList.add("hideIframes");

    //Panneau qu'on enregistre dans le json
    project["node"]=projectBoard;
    
    //Avec la date
    let dateTitle=document.createElement("h3");
    let dateObject=new Date(project.date)
    dateTitle.innerHTML=months[dateObject.getMonth()]+" "+dateObject.getFullYear();
    dateTitle.classList.add("centeredElement");
    projectBoard.appendChild(dateTitle);
    
    //Le titre
    let title=document.createElement("h2");
    title.innerHTML=project.name;
    title.classList.add("centeredElement");
    projectBoard.appendChild(title);

    //La petite fle-fleche
    let flipper=document.createElement("img");
    flipper.src="img/Flipper.png";
    flipper.classList.add("flipper")
    projectBoard.appendChild(flipper);
    
    //l'iframe
    let iframeContainer=document.createElement("div");
    iframeContainer.classList.add("iframe-container");
    iframeContainer.style.paddingTop=(100*(dimensions[project.type].height/dimensions[project.type].width))+"%";
    projectBoard.appendChild(iframeContainer)
    
    let iframe=document.createElement("iframe");
    iframe.src=null;
    iframe.innerHTML=project.link; //On le stock en inner HTML pour le ressortir après en src quand le projet est dévoilé
    iframe.classList.add("centeredElement");
    iframeContainer.appendChild(iframe);
    iframe.allowFullscreen=true;

    //Et les paragraphes de sa description (si il en aune)
    if(project.description!=null){
        for (let para of project.description) {
            let p=document.createElement("p");
            p.innerHTML=para;
            p.classList.add("description");
            projectBoard.appendChild(p);
        }
    }

    //On rajoute eventuellement le lien direct
    if(project.showLink){
        let div=document.createElement("div");
        div.classList.add("centeredElement");
        div.classList.add("link");
        let a=document.createElement("a");
        a.href=project.link
        a.target="_blank"
        a.innerHTML="Click here to see the project in a new tab"
        div.appendChild(a);
        projectBoard.appendChild(div);
    }

    projectBox.appendChild(projectBoard);

    //Quand on clique, on cache/montre le parag et les images
    projectBoard.addEventListener("click",function(event){
        event.target.classList.toggle("hideIframes");
        //On cache les autres iframes pour économiser les ressources
        hideAllProjects(event.target);
        //On charge également le contenu du iframe si c'est un montrage
        if(!event.target.classList.contains("hideIframes")){
            let iframe=event.target.querySelector("iframe");
            iframe.src=iframe.innerHTML;
        }
        //Puis on trigger le resize pour bouger le bateau/refaire les planches
        window.dispatchEvent(new Event('resize'));
    })   
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
