const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dimensions={"itchioDownload":{"width":552,"height":160},
"pico8":{"width":1920,"height":1080}} //Stock les dimensions des differents types d'iframe



/*let flipperImg=new Image();
startBgImage.addEventListener("load",function(){
    flipperImg.src="img/Flipper.png";
});*/

const projectBox=document.querySelector('#projects')
const projects=[
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
        'name':'An Endless Search',
        'date':'2019-02-01',
        'link':'https://www.lexaloffle.com/bbs/widget.php?pid=growingdarkness',
        'type':'pico8',
        'description':[
            'You have to retrieve the Solar Orb , in order to repair the sun , but beware Darknesses, before they grow and block every possible path.',
            'Controls: Move with the arrow keys, run with C, blink forwar with V.'
            'This game was made in a couple of days as a challenge with a friend: we both had to make a "rage" game about darkness.'
        ]
    },
]

for (let project of projects) {
    //Pour chaque projet on fait un panneau
    let projectBoard=document.createElement("div");
    projectBoard.classList.add("woodboard");
    projectBoard.classList.add("sectionBoard");
    projectBoard.classList.add("hideIframes");
    
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
    iframe.src=project.link;
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
    projectBox.appendChild(projectBoard);

    //Quand on clique, on cache/montre le parag et les images
    projectBoard.addEventListener("click",function(event){
        event.target.classList.toggle("hideIframes");
        //Puis on trigger le resize pour bouger le bateau/refaire les planches
        window.dispatchEvent(new Event('resize'));
    })
    
    
}
