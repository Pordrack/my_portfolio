/*Ce fichier JS gère tout ce qui est relatif a la petite chasse au trésor en easter egg*/
const keyHidingPlace=document.querySelector("#secretkey");
const keysprite=document.querySelector("#keysprite");

//cliquer sur la cachette de la clé la dévoile, et supprime les event listener useless
keyHidingPlace.addEventListener("click",function(){
    keysprite.classList.remove("hidden");
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