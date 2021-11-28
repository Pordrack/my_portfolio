//Le code du bouton qui affiche/cache le menu
menuFlipper=document.querySelector("#menuFlipper");
menu=document.querySelector("#menu");
menuFlipper.addEventListener("click",function(){
    menuFlipper.classList.toggle("flipped");
    menu.classList.toggle("hidden");
})


