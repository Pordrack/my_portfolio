//variable globales
let width;
let height;
let ctx;
const angleStifness=1; //La violence avec laquelle le bateau suit les vagues, plus c'est faible, plus c'est violent
let dT=1000/60 //L'écart temporel entre chaque frame
let minTimeBetweenBolts=1000;
let maxTimeBetweenBolts=4000;
let mouseX=0;
let mouseY=0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function waveFunction(x,waveHeight,waveLength) {
    return waveHeight*Math.sin(x/waveLength)-0.5*waveHeight ;
} ;

function waveAngle(x,waveLength,waveHeight) {
    x=x/waveLength;
    //On calcule les coordonnées de 2 points de la droite tangente en X
    let xPoint1=x-5;
    let xPoint2=x+5;
    // y=f′(a)(x−a)+f(a), on peut ignorer le +f(a) final, si on le fait sur les 2 points ça compense
    //(x-a)=x-5-x donc on vire juste le x
    let yPoint1=Math.cos(x)*(-5)
    let yPoint2=Math.cos(x)*(5)
    
    //On calcule alors l'angle ntre les 2 points, avec un coeficient qui dépend de la hauteur pour moduler l'angle
    let angle=Math.atan2(yPoint2-yPoint1,xPoint2-xPoint1)*(waveHeight/(angleStifness*waveLength))
    
    //Pour eviter les angles très intense on impose un maximum et un minimum
    if(angle>0.4*Math.PI){
        angle=0.4*Math.PI;
    }else if(angle<-0.4*Math.PI){
        angle=-0.4*Math.PI;
    }
    return angle;
} ;
/**
* 
* @param {*} curveStep 
* @param {*} color 
* @param {*} seaLevel 
* @param {*} waveLength La largeur de la vague en pourcent de la largeur de l'écran
* @param {*} waveHeight La hauteur de la vague en pourcent de la longueur de l'écran
* @param {*} speed 
*/
//Objet "vague" qui represente un groupe de vague
function Wave(curveStep,color,seaLevel,waveLength,waveHeight,speed) {
    this.curveStep=curveStep;
    this.color=color;
    this.seaLevel=seaLevel;
    this.waveLength=waveLength;
    this.waveHeight=waveHeight;
    this.speed=speed;
    this.baseX=0 //Le "declage" de la vague, en le faisant changer avec la speed on la fait bouger
    
    this.update=function() {
        ctx.beginPath();
        //On applique la vitesse à base X, pour que les vagues bouge, on multiplie par la waveLength pour compenser la division de plus tard, ainsi que par la largeur de l'écran
        this.baseX+=(this.speed*this.waveLength)*width;
        //a chaque frame on redessine les vagues en faisant un polygone 
        //Qui va d'abord faire la ligne des vagues en suivant la fonction
        
        for (let i = 0; i < width+10; i+=curveStep) {
            if(i==0){
                ctx.moveTo(i,this.getY(i));
            }else{
                ctx.lineTo(i,this.getY(i));
            }
        }
        
        //Puis on va faire tous les tours pour remplir tous le bas de l'écran
        ctx.lineTo(width,height);
        ctx.lineTo(0,height);
        ctx.closePath();
        //On ajuste quelques trucs visuels : couleur, ombre etc.
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.fill();
        //qu'on oublie pas de "reset" a la fin
        ctx.shadowBlur = 0;
    }
    //renvoie la hauteur Y de la vague en un point donné
    this.getY=function (x){
        waveLength=this.waveLength*0.01*width;
        waveHeight=this.waveHeight*0.01*width;
        let baseHeight=height*this.seaLevel;
        //On applique la base X parce que c'est le décalage de la vague
        let y=baseHeight+waveFunction(this.baseX+x,waveHeight,waveLength);
        
        return y;
    }
    
    this.getAngle=function(x){
        waveLength=this.waveLength*0.01*width;
        waveHeight=this.waveHeight*0.01*width;
        let angle=waveAngle(this.baseX+x,waveLength,waveHeight);
        
        return angle;
    }
}

/**
* Creer un objet éclaire
* @param {number} x1 X du point de départ
* @param {number} y1 Y du point de départ
* @param {number} x2 X du point de fin
* @param {number} y2 Y du point de fin
* @param {number} lifetime Temps de vie de l'éclair
* @param {number} generations Nombre de fois qu'on va diviser l'éclaire, + c'est elevé, plus l'éclair est détaillé
* @param {array} boltArray Tableau dans lequel l'éclair doit être stocké, utile pour savoir d'ou le supprimer etc.
* @param {number} splitRate Entre 0 et 10 la fréquence à laquelle l'éclair se créer des embranchements
* @param {boolean} isSplit Est on un embranchement ?
*/
function Bolt(x1,y1,x2,y2,lifetime,generations,boltArray,splitRate,isSplit){
    this.lifetime=lifetime;
    this.points=[{'x':x1,'y':y1},{'x':x2,'y':y2}]
    //Distance entre le départ et l'arrivé de l'éclaire
    this.fullDist=Math.sqrt((x1-x2)**2+(y1-y2)**2);
    //Décalage de chaque ségment par rapport à la trajectoire "droite"
    this.offsetDist=getRandomInt(10,20)*0.01*this.fullDist;
    //La fréquence a laquelle on va avoir des embrachements
    this.splitRate=splitRate
    this.isSplit=isSplit;
    this.splits=[];
    //Opacité
    this.opacity=0;
    //Le tableau dans lequel on se range/se supprime à la fin de sa vie
    this.boltArray=boltArray;
    
    //Etape de division (combien de fois on va diviser les egments)
    for (let i = 0; i < generations; i++) {
        //On parcours chaque segment de la generation actuelle, pour le couper en 2
        for (let j= 0; j < this.points.length-1; j+=2) {
            //Longueur du segment actuel
            let dist=Math.sqrt((this.points[j].x-this.points[j+1].x)**2+(this.points[j].y-this.points[j+1].y)**2);
            //Et son angle
            let angle=Math.atan2(this.points[j+1].y-this.points[j].y,this.points[j+1].x-this.points[j].x);
            //On décale le nouveau point "au dessus" ou "en dessous" (aléatoire)
            let offsetAngle=angle-0.5*Math.PI
            if(Math.random()>=0.5){
                offsetAngle=angle+0.5*Math.PI
            }
            //L'endroit ou s'effectue la "fracture", à peut près le centre du segment
            let newDist=getRandomInt(45,55)*0.01*dist;
            
            let newX=this.points[j].x+Math.cos(angle)*newDist; //X du nouveau point, avant décalage
            newX=newX+Math.cos(offsetAngle)*this.offsetDist; //X du nouveau point, après décalage
            
            //Meme chose pour le Y
            let newY=this.points[j].y+Math.sin(angle)*newDist;
            newY=newY+Math.sin(offsetAngle)*this.offsetDist;
            
            //Chance que la division créé un "split", un petit embranchement qui suit l'angle original
            if(this.splitRate>0 && getRandomInt(0,10)>10-splitRate){
                let splitDist=newDist*getRandomInt(8,12)/10
                let x2=this.points[j].x+Math.cos(angle)*splitDist
                let y2=this.points[j].y+Math.sin(angle)*splitDist
                
                //On le créé et l'insert dans un sous tableau de l'éclair
                new Bolt(this.points[j].x,this.points[j].y,x2,y2,this.lifetime,generations-1,this.splits,this.splitRate/2-1,true);
            }
            
            //On ajoute alors le nouveau point
            this.points.splice(j+1,0,{'x':newX,'y':newY});
        }
        this.offsetDist=this.offsetDist/2; //A chaque gen, on reduit l'offset
    }
    boltArray.push(this);
    
    //Fonction pour dessiner l'éclair
    this.update=function(){
        ctx.beginPath();
        this.lifetime-=dT;
        //Si pas encore apparu et qu'il n'est pas encore "mort", on augmente son opacité
        if(this.lifetime>0 && this.opacity<1){
            this.opacity+=0.04
        }else if((this.lifetime<0 && this.opacity>0)){//Sinon il faut le tuer en l'invisibilisant
            this.opacity-=0.04
        }else if((this.lifetime<0 && this.opacity<0)){//Et l'achever en le supprimant de son tableau
            let index=this.boltArray.indexOf(this);
            this.boltArray.splice(index,1);
        } 
        
        //Puis on le dessine
        let first=true
        for (point of this.points) {
            //Si c'est le début de l'éclair, il faut faire un moveto
            if(first){
                ctx.moveTo(point.x,point.y);
                first=false;
            }else{
                ctx.lineTo(point.x,point.y);
            }
        }
        ctx.lineWidth=2;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 20;
        if(this.isSplit){
            ctx.lineWidth=1;
            ctx.shadowBlur = 10;
        }
        
        ctx.strokeStyle="rgba(255,255,255,"+this.opacity+")";
        ctx.stroke();
        ctx.lineWidth=0;
        ctx.shadowBlur=0;
        
        //Puis on dessine ses enfants
        for(split of this.splits){
            split.update();
        }
    }
    
    //Si on est pas un split on doit se détruire à la fin de sa vie+un peu de rab pour le "fade" artistique (On le fait ici en plus de dans le update pour eviter les éclairs qui se stacks quand la fenetre est inactive)
    /*if(this.isSplit==false){
        console.log("will set timeout")
        let _this=this;
        setTimeout(function(){
            console.log("this : "+_this)
            let index=_this.boltArray.indexOf(_this);
            _this.boltArray.splice(index,1);
        },lifetime*5)
    }*/
}

/**
* Creer un objet bateau
*
* @param {object} wave L'objet vague qui sera "monté"
* @param {number} size la taille du bateau en pourcentage de la largeur de l'écran
* @param {image} image le chemin vers l'image du bateau
* @param {number} center entre 0 et 1, indique le centre du bateau horizontalement
*/
function Boat(wave,size,image,center){
    this.image=image;
    this.baseWidth=this.image.width;
    this.baseHeight=this.image.height;
    this.wave=wave;
    this.size=size;
    this.center=this.center
    this.x=100;
    this.flipped=false;
    this.scaleX=1;
    this.lastScroll=window.scrollY;
    
    this.update=function(){
        //On mesure le delta time
        //SizeFactor = Par combien on doit multiplier la largeur de base pour obtenir la largeur désiré, (et donc idem pour la hauteur)
        let sizeFactor=((size/100)*width)/this.baseWidth
        let boatHeight=sizeFactor*this.baseHeight;
        let boatWidth=sizeFactor*this.baseWidth;
        let y=this.wave.getY(this.x);
        let angle=this.wave.getAngle(this.x);

        //On modifie le scaleX en fonction du retournement si nescessaire, de maniere progressive
        if(this.scaleX>-1 && this.flipped){
            this.scaleX-=dT/100;
            if(this.scaleX<-1){
                this.scaleX=-1
            }
        }else if(this.scaleX<1 && !this.flipped){
            this.scaleX+=dT/100;
            if(this.scaleX>1){
                this.scaleX=1
            }
        }
        
        ctx.save();
        ctx.translate(this.x, y);
        ctx.rotate(angle);     
        ctx.scale(this.scaleX, 1);  
        ctx.drawImage(this.image,-center*boatWidth,-0.95*boatHeight, boatWidth, boatHeight);
        ctx.restore();
    }

    //Se déplace sur la mer en fonction du scroll
    this.onScroll=function(){
        let sizeFactor=((size/100)*width)/this.baseWidth
        let boatWidth=sizeFactor*this.baseWidth;

        if(window.scrollY<this.lastScroll){
            this.flipped=true;
        }else{
            this.flipped=false;
        }
        this.lastScroll=window.scrollY;
        let maxScroll = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight);
        this.x=0.5*boatWidth+(width-boatWidth)*(window.scrollY/maxScroll);
    }
}

/**
* Creer un objetfond panneau de bois
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
                
                //J'ai desactivé le code parce que avec le smooth resize des projets ça faisait moche
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
                //J'ai desactivé le code parce que avec le smooth resize des projets ça faisait moche
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

//fonction trouvé sur internet qui calcul la puissance de calcul du support
function setHertz() {
    const _speedconstant = 8.9997e-9;
    const d = new Date();
    const amount = 150000000;
    const estprocessor = 1.7; // Puissance processeur environ
    for (let i = amount; i > 0; i--) {}
    let newd = new Date();
    let accnewd = Number(String(newd.getSeconds()) + "." + String(newd.getMilliseconds()));
    let accd = Number(String(d.getSeconds()) + "." + String(d.getMilliseconds()));
    let di = accnewd - accd;
    if (d.getMinutes() != newd.getMinutes()) {
        di = (60 * (newd.getMinutes() - d.getMinutes())) + di
    }
    spd = ((_speedconstant * amount) / di);
    
    
    return Math.round(spd * 1000) / 1000;
}

window.addEventListener("load",function() {
    const canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    width=canvas.width;
    height=canvas.height;
    //On change les FPS en fonction de la puissance de calcul, on attend la fin du chargement de tout le bazar en JS pour des resultats accurate
    //Update c'était buggé, j'ai enlevé
    /*setTimeout(function(){
        const power=setHertz();
        if(power<10){
            console.log("dT avant "+dT);
            dT*=(10/power);
            if(dT<0 || dT>100)
            dT=100
            console.log("dT après "+dT);
        };
    },500)*/
    
    let waves=[
        new Wave(2,"#102a63",7/8,70/13.66,3/13.66,0.000025),
        new Wave(2,"teal",7/8,45/13.66,5/13.66,0.00025),
        new Wave(2,"#4495f2",71/80,35/13.66,4/13.66,0.0004)
    ]
    
    let bolts=[];
    function newBolt(forcedOnMouse){
        //On créé un nouvel éclair avec des coordonnées au pif 
        x1=getRandomInt(0,width);
        x2=x1+getRandomInt(-0.1*width,0.1*width);
        y1=0;
        y2=(78/80)*height;
        //L'arrivée est la souris dans certains cas
        if(forcedOnMouse==true || (getRandomInt(0,100)>90)){
            x2=mouseX;
            y2=mouseY;
        }
        
        //On evite de faire trop d'éclairs sinon ça lag, et on créé pas d'éclair si le mec regarde pas
        if(bolts.length<5 && !document.hidden){
            new Bolt(x1,y1,x2,y2,getRandomInt(800,1200),4,bolts,3,false);
        }   
        
        //Puis on appel à la création d'un nouveau éclair, si ce n'est pas un éclair 'd'origine humaine'
        if(forcedOnMouse==false){
            setTimeout(function(){
                newBolt(false);
            },getRandomInt(minTimeBetweenBolts,maxTimeBetweenBolts));
        }
    }
    
    setTimeout(function(){
        newBolt(false);
    },getRandomInt(minTimeBetweenBolts,maxTimeBetweenBolts))
    
    //On charge l'image du bateau, et pause tout le temps de la charger
    boatImage=new Image();
    boatImage.src="img/pirateShip.png";
    boatImage.addEventListener("load",function(){
        let mainBoat=new Boat(waves[1],10,boatImage,0.34)
        setInterval(function () {
            ctx.clearRect(0,0,width,height);
            
            for(let bolt of bolts){
                bolt.update();
            }
            
            for (let wave of waves) {
                if(wave==mainBoat.wave){
                    mainBoat.update();
                }
                wave.update();
            }  
        },dT)

        //On appel les fonctions qui font bouger le bateau quand nescessaire
        window.addEventListener("scroll",function(){
            mainBoat.onScroll();
        }); 

        window.addEventListener("resize",function(){
            mainBoat.onScroll();
        }); 

        //On la trigger aussi si le site se fait resize (deploiement d'onglet projet)
        const boatResize_ob = new ResizeObserver(function(entries) {
            mainBoat.onScroll()
        });
        
        boatResize_ob.observe(document.querySelector(".container"));

        mainBoat.onScroll()
    })
    
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
            canvas.width=window.innerWidth;
            canvas.height=window.innerHeight;
            width=canvas.width;
            height=canvas.height;
            
            //On appel la fonction a declenché sur le resize de chaque fond, après un petit temps pour que tout sois bien
            setTimeout(function(){
                for (const pb of plankBackgrounds) {
                    pb.onResize();
                }
            },100)       
        })

        //On la trigger aussi si le site se fait resize (deploiement d'onglet projet)
        const bgResize_ob = new ResizeObserver(function(entries) {
            for (const pb of plankBackgrounds) {
                pb.onResize();
            }
        });
        
        bgResize_ob.observe(document.querySelector(".container"));
    })   
    
    window.addEventListener("mousemove",function(event){
        mouseX=event.clientX;
        mouseY=event.clientY;
    })
    
    //On fait une fonction qui permet d'invoquer la foudre (avec une limite)
    window.addEventListener("click",function(event){
        if(bolts.length<5){
            newBolt(true);
        }  
    })
    
    //Occupons nous maintenant du contenu du site
    const woodBackgrounds=document.querySelectorAll(".background");
    for (const wb of woodBackgrounds) {
        var img = document.createElement('img');
        img.src = 'img/plank.png';
        wb.appendChild(img);
    }
})


