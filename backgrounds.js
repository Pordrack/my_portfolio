/**
* Creer un objet fond panneau de bois
*
* @param {node} node Le node de la div a traquer
* @param {image} image l'image a placarder derrière la node
*/
function Background(node){
    this.targetNode=node;
    
    let startBgImage=new Image();
    startBgImage.src="img/plankTop.png";
    
    let endBgImage=new Image();
    startBgImage.addEventListener("load",function(){
        endBgImage.src="img/plankBottom.png";
    });
    
    let middleBgImage=new Image();
    endBgImage.addEventListener("load",function(){
        middleBgImage.src="img/plankMiddle.png";
    });
    
    let singleBgImage=new Image();
    middleBgImage.addEventListener("load",function(){
        singleBgImage.src="img/plankSingle.png";
    });
    
    
    let _this=this
    singleBgImage.addEventListener("load",function(){
        _this.canva=document.createElement("canvas");
        document.querySelector("body").appendChild(_this.canva);
        
        //appelé à la creation/quand on resize, met la planche aux bonnes dimension, calcul la quantité dont on aura besoin etc...
        _this.onResize=function(){
            //On va d'abord calculer la largeur et le facteur de taille qu'aura le panneau
            imageWidth=this.targetNode.clientWidth;
            let factorOfSize=imageWidth/middleBgImage.width;
            //On garde un look pixel uni, seul exception étant si c'est trop fat
            if(factorOfSize<0.5*(width/1300)){
                factorOfSize=0.5*(width/1300);
            }
            
            plankHeight=middleBgImage.height*factorOfSize
            //Comme ça, on peut calculer de combien on en aura besoin
            numberOfImgRequired=Math.ceil(this.targetNode.clientHeight/plankHeight);
            //Et la hauteur de panneau
            imageHeight=plankHeight*numberOfImgRequired;
            
            //On change les dimensions du canva puis on le vide
            this.canva.width=imageWidth;
            this.canva.height=imageHeight;
            let localCtx = this.canva.getContext('2d');
            localCtx.width=imageWidth;
            localCtx.height=imageHeight;
            localCtx.clearRect(0,0,imageWidth,imageHeight);
            
            //On remplie enfin le canva avec les images de planche
            for (let i=0;i<numberOfImgRequired;i++) {
                //Quel taille on vise après avoir enlevé le milieu ? Exprimé en coordonnées dans l'image
                let widthTargeted=imageWidth/factorOfSize;
                let heightTargeted=plankHeight/factorOfSize;
                
                //J'ai laissé le code mais en fait j'en fait rien, oubliez
                //On va aleatoire inverser verticalement ou nom chaque planche, pour plus de varieté
                let xInvertFactor=getRandomInt(0,2)*2-1 //Genere -1 ou 1
                let yInvertFactor=getRandomInt(0,2)*2-1 
                
                //En fonction de la position on prend un sprite de planche different
                let image=middleBgImage;
                if(i==0 && numberOfImgRequired==1){
                    image=singleBgImage
                }else if(i==0){
                    image=startBgImage;
                    yInvertFactor=1; //Ne pas retourner si debut ou fin, pour des raison evidente de "la bordure"
                }else if(i==numberOfImgRequired-1){
                    image=endBgImage;
                    yInvertFactor=1; //Ne pas retourner si debut ou fin, pour des raison evidente de "la bordure"
                    //Pour la dernière planche, on ne prend pas toute la hauteur, juste de quoi fermer correctement
                    //On calcul la hauteur dans le site/le canva
                    heightTargeted=this.targetNode.clientHeight-((numberOfImgRequired-1)*plankHeight);
                    //On convertie la valeur en coordonnés dans l'image
                    heightTargeted/=factorOfSize;
                    //On l'arrondi a la dizaine pret, pour ne pas couper en 2 les "pixels" de l'image
                    heightTargeted=10*Math.ceil(heightTargeted/10);
                    //Comme j'ai fait des petites dents il faut pas du tout que ça soit inferieur a 2 pixels
                    if(heightTargeted<20){
                        heightTargeted=20;
                    }
                }
                //On va couper le milieu des planches pour mettre à la bonne largeur
                
                
                //Truc pour rescale 
                localCtx.save();
                localCtx.translate(0.5*imageWidth,i*plankHeight+0.5*heightTargeted*factorOfSize);
                //Desactivé l'inversion pour les rappels de resize (eviter que les encoches bougent)
                /*localCtx.scale(xInvertFactor, yInvertFactor);*/
                //On dessine alors les 2 moitiers de planches
                localCtx.drawImage(image, 0, image.height-heightTargeted,0.5*widthTargeted+1,heightTargeted+1,-0.5*imageWidth,-0.5*heightTargeted*factorOfSize, 0.5*imageWidth+1, heightTargeted*factorOfSize+1);
                localCtx.drawImage(image, image.width-0.5*widthTargeted, image.height-heightTargeted,0.5*widthTargeted+1,heightTargeted+1,0,-0.5*heightTargeted*factorOfSize,0.5*imageWidth+1, heightTargeted*factorOfSize+1);
                
                //Reset après rescale+dessin
                localCtx.restore();
                //localCtx.drawImage(image, 0, i*plankHeight, imageWidth, plankHeight);
            }
            
            //Pour initialiser la position de chaque canva
            //On recupere la position absolue de la div cible
            let divBounds=this.targetNode.getBoundingClientRect();
            //Pour y déplacer verticalement les planches (avec l'offset requis)
            this.canva.style.top=(scrollY+divBounds.top)+"px";
            this.canva.style.left=divBounds.left+"px";
        }
        
        
        _this.onResize();
    })
}


//On charge l'image des planches en fond, et on fait tout ce qui a attraut au resize etc. une fois que c'est chargé
let plankBackgrounds=[];
let plankImage=new Image();
plankImage.src="img/plank.png";
plankImage.addEventListener("load",function(){
    //On recupere toutes les div woodboard pour leur filer un fond
    let woodboards=document.querySelectorAll(".woodboard");
    for (const woodboard of woodboards) {
        plankBackgrounds.push(new Background(woodboard,plankImage));
    }
    //On s'assure que tout soit toujours aux bonne dimension pour la page
    window.addEventListener("resize",function(event){    
        //On appel la fonction a declenché sur le resize de chaque fond
        for (const pb of plankBackgrounds) {
            pb.onResize();
        }
        //On la rappelle après un petit temps pour que tout sois bien
        setTimeout(function(){
            for (const pb of plankBackgrounds) {
                pb.onResize();
            }
        },300)         
        
        //On la rappelle après un petit temps pour que tout sois VRAIMENT bien
        setTimeout(function(){
            for (const pb of plankBackgrounds) {
                pb.onResize();
            }
        },600)
        
        //Sans tous ces rappels : petit decalage possible
    })
})   



