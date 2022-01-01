/*Ce fichier JS gère tout ce qui est relatif a la petite chasse au trésor en easter egg*/
const keyHidingPlace=document.querySelector("#secretkey");
const keysprite=document.querySelector("#keysprite");

let gotKey=false;

//cliquer sur la cachette de la clé la dévoile, et supprime les event listener useless
keyHidingPlace.addEventListener("click",function(){
    keysprite.classList.remove("hidden");
    gotKey=true;
    window.removeEventListener("load",onloadAndResize);
    window.removeEventListener("resize",onloadAndResize);
    window.removeEventListener("scroll",onloadAndResize);
})

/*On choppe la position de la cachette pour y placer la clé en utilisant des variables CSS, comme c'est positionné
en fixe (pas très opti mais bon, pour la transition smooth bien obligé), on traque a chaque scroll etc. */
function onloadAndResize(){
    let divBounds=keyHidingPlace.getBoundingClientRect();
    document.documentElement.style.setProperty('--hiddenKeyRight',(window.innerWidth-divBounds.right)+'px');
    document.documentElement.style.setProperty('--hiddenKeyTop',(/*scrollY+*/divBounds.top)+'px');
}

//La cachette doit être traquée a chaque chargement/redimensionnement de la fenetre
window.addEventListener("load",onloadAndResize)

window.addEventListener("resize",onloadAndResize)

window.addEventListener("scroll",onloadAndResize)

/*On gère le coffre et son balottement de droite a gauche*/
let intervalId;
chest=document.querySelector("#treasureChest");
chest.addEventListener('mouseenter',function(){
    chest.classList.add("hover");
    intervalId=setInterval(function(){
        chest.classList.toggle("left");
    },250);
})

chest.addEventListener('mouseleave',function(){
    chest.classList.remove("hover");
    clearInterval(intervalId);
})

const clueScroll=document.querySelector("#clueScroll");
const panel=document.querySelector("#hiddenPanel")
//Le coffre, quand on clique dessus peu:
chest.addEventListener('click',function(){
    //Montrer/cacher l'indice
    if(!gotKey){
        clueScroll.classList.toggle("hidden");
    }else{ //Montrer/cacher le panel
        //Si pas de trident, se transforme en trident
        if(chest.src!="img/trident.png"){
            clueScroll.classList.add("hidden")
            chest.src="img/trident.png";
        }
        //et on cache/montre le panel
        panel.classList.toggle("hidden");
    }

    //Dans tous les cas, on a pu changer la taille de doc, on envoie un message de maj
    window.dispatchEvent(new Event('resize'));
})

/*Le panel secret mtn */
sliders=document.querySelectorAll(".slider")//On choppe tous les sliders
for (const slider of sliders) {
    slider.value=eval(slider.id) //Permet de trouver une variable par son nom, j'ai donc mis le nom de la variable concerné en id de chaque slider
    //L'équivalent d'un add event listener apparement, source: https://www.w3schools.com/howto/howto_js_rangeslider.asp
    slider.oninput=function(){
        eval(slider.id+"="+slider.value); //Lance l'instruction js passée en temps que string
    }
}

