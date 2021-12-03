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
let waveWidthMultiplier=1;
let waveHeightMultiplier=1;
let waveSpeedMultiplier=1;
let lightningRate=0.1;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function waveFunction(x,waveHeight,waveLength) {
    return waveHeight*waveHeightMultiplier*Math.sin(x/(waveLength*waveWidthMultiplier))-0.5*waveHeight*waveHeightMultiplier;
} ;

function waveAngle(x,waveLength,waveHeight) {
    x=x/(waveLength*waveWidthMultiplier);
    //On calcule les coordonnées de 2 points de la droite tangente en X
    let xPoint1=x-5;
    let xPoint2=x+5;
    // y=f′(a)(x−a)+f(a), on peut ignorer le +f(a) final, si on le fait sur les 2 points ça compense
    //(x-a)=x-5-x donc on vire juste le x
    let yPoint1=Math.cos(x)*(-5)
    let yPoint2=Math.cos(x)*(5)
    
    //On calcule alors l'angle ntre les 2 points, avec un coeficient qui dépend de la hauteur pour moduler l'angle
    let angle=Math.atan2(yPoint2-yPoint1,xPoint2-xPoint1)*((waveHeight*waveHeightMultiplier)/(angleStifness*waveLength*waveWidthMultiplier))
    
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

    const coord=[{'x':89,'y':27 },{ 'x':90,'y':27 },{ 'x':27,'y':28 },{ 'x':28,'y':28 },{ 'x':29,'y':28 },{ 'x':36,'y':28 },{ 'x':37,'y':28 },{ 'x':41,'y':28 },{ 'x':42,'y':28 },{ 'x':43,'y':28 },{ 'x':44,'y':28 },{ 'x':45,'y':28 },{ 'x':46,'y':28 },{ 'x':47,'y':28 },{ 'x':48,'y':28 },{ 'x':49,'y':28 },{ 'x':50,'y':28 },{ 'x':51,'y':28 },{ 'x':54,'y':28 },{ 'x':55,'y':28 },{ 'x':56,'y':28 },{ 'x':57,'y':28 },{ 'x':64,'y':28 },{ 'x':65,'y':28 },{ 'x':66,'y':28 },{ 'x':67,'y':28 },{ 'x':72,'y':28 },{ 'x':73,'y':28 },{ 'x':74,'y':28 },{ 'x':89,'y':28 },{ 'x':90,'y':28 },{ 'x':27,'y':29 },{ 'x':28,'y':29 },{ 'x':29,'y':29 },{ 'x':36,'y':29 },{ 'x':37,'y':29 },{ 'x':41,'y':29 },{ 'x':42,'y':29 },{ 'x':43,'y':29 },{ 'x':44,'y':29 },{ 'x':45,'y':29 },{ 'x':46,'y':29 },{ 'x':47,'y':29 },{ 'x':48,'y':29 },{ 'x':49,'y':29 },{ 'x':50,'y':29 },{ 'x':51,'y':29 },{ 'x':54,'y':29 },{ 'x':55,'y':29 },{ 'x':56,'y':29 },{ 'x':57,'y':29 },{ 'x':64,'y':29 },{ 'x':65,'y':29 },{ 'x':66,'y':29 },{ 'x':67,'y':29 },{ 'x':72,'y':29 },{ 'x':73,'y':29 },{ 'x':74,'y':29 },{ 'x':89,'y':29 },{ 'x':90,'y':29 },{ 'x':27,'y':30 },{ 'x':28,'y':30 },{ 'x':29,'y':30 },{ 'x':36,'y':30 },{ 'x':37,'y':30 },{ 'x':45,'y':30 },{ 'x':46,'y':30 },{ 'x':54,'y':30 },{ 'x':55,'y':30 },{ 'x':56,'y':30 },{ 'x':57,'y':30 },{ 'x':63,'y':30 },{ 'x':64,'y':30 },{ 'x':65,'y':30 },{ 'x':66,'y':30 },{ 'x':67,'y':30 },{ 'x':72,'y':30 },{ 'x':73,'y':30 },{ 'x':74,'y':30 },{ 'x':27,'y':31 },{ 'x':28,'y':31 },{ 'x':29,'y':31 },{ 'x':36,'y':31 },{ 'x':37,'y':31 },{ 'x':45,'y':31 },{ 'x':46,'y':31 },{ 'x':54,'y':31 },{ 'x':55,'y':31 },{ 'x':58,'y':31 },{ 'x':63,'y':31 },{ 'x':66,'y':31 },{ 'x':67,'y':31 },{ 'x':72,'y':31 },{ 'x':73,'y':31 },{ 'x':74,'y':31 },{ 'x':89,'y':31 },{ 'x':90,'y':31 },{ 'x':27,'y':32 },{ 'x':28,'y':32 },{ 'x':29,'y':32 },{ 'x':36,'y':32 },{ 'x':37,'y':32 },{ 'x':45,'y':32 },{ 'x':46,'y':32 },{ 'x':54,'y':32 },{ 'x':55,'y':32 },{ 'x':58,'y':32 },{ 'x':63,'y':32 },{ 'x':66,'y':32 },{ 'x':67,'y':32 },{ 'x':72,'y':32 },{ 'x':73,'y':32 },{ 'x':74,'y':32 },{ 'x':89,'y':32 },{ 'x':90,'y':32 },{ 'x':95,'y':32 },{ 'x':96,'y':32 },{ 'x':97,'y':32 },{ 'x':98,'y':32 },{ 'x':99,'y':32 },{ 'x':100,'y':32 },{ 'x':101,'y':32 },{ 'x':27,'y':33 },{ 'x':28,'y':33 },{ 'x':29,'y':33 },{ 'x':30,'y':33 },{ 'x':31,'y':33 },{ 'x':32,'y':33 },{ 'x':33,'y':33 },{ 'x':34,'y':33 },{ 'x':35,'y':33 },{ 'x':36,'y':33 },{ 'x':37,'y':33 },{ 'x':45,'y':33 },{ 'x':46,'y':33 },{ 'x':54,'y':33 },{ 'x':55,'y':33 },{ 'x':59,'y':33 },{ 'x':62,'y':33 },{ 'x':66,'y':33 },{ 'x':67,'y':33 },{ 'x':72,'y':33 },{ 'x':73,'y':33 },{ 'x':74,'y':33 },{ 'x':89,'y':33 },{ 'x':90,'y':33 },{ 'x':95,'y':33 },{ 'x':27,'y':34 },{ 'x':28,'y':34 },{ 'x':29,'y':34 },{ 'x':30,'y':34 },{ 'x':31,'y':34 },{ 'x':32,'y':34 },{ 'x':33,'y':34 },{ 'x':34,'y':34 },{ 'x':35,'y':34 },{ 'x':36,'y':34 },{ 'x':37,'y':34 },{ 'x':45,'y':34 },{ 'x':46,'y':34 },{ 'x':54,'y':34 },{ 'x':55,'y':34 },{ 'x':59,'y':34 },{ 'x':62,'y':34 },{ 'x':66,'y':34 },{ 'x':67,'y':34 },{ 'x':72,'y':34 },{ 'x':73,'y':34 },{ 'x':74,'y':34 },{ 'x':89,'y':34 },{ 'x':90,'y':34 },{ 'x':95,'y':34 },{ 'x':27,'y':35 },{ 'x':28,'y':35 },{ 'x':29,'y':35 },{ 'x':36,'y':35 },{ 'x':37,'y':35 },{ 'x':45,'y':35 },{ 'x':46,'y':35 },{ 'x':54,'y':35 },{ 'x':55,'y':35 },{ 'x':59,'y':35 },{ 'x':60,'y':35 },{ 'x':61,'y':35 },{ 'x':66,'y':35 },{ 'x':67,'y':35 },{ 'x':72,'y':35 },{ 'x':73,'y':35 },{ 'x':74,'y':35 },{ 'x':89,'y':35 },{ 'x':90,'y':35 },{ 'x':95,'y':35 },{ 'x':96,'y':35 },{ 'x':97,'y':35 },{ 'x':98,'y':35 },{ 'x':27,'y':36 },{ 'x':28,'y':36 },{ 'x':29,'y':36 },{ 'x':36,'y':36 },{ 'x':37,'y':36 },{ 'x':45,'y':36 },{ 'x':46,'y':36 },{ 'x':54,'y':36 },{ 'x':55,'y':36 },{ 'x':60,'y':36 },{ 'x':61,'y':36 },{ 'x':66,'y':36 },{ 'x':67,'y':36 },{ 'x':72,'y':36 },{ 'x':73,'y':36 },{ 'x':74,'y':36 },{ 'x':89,'y':36 },{ 'x':90,'y':36 },{ 'x':98,'y':36 },{ 'x':99,'y':36 },{ 'x':100,'y':36 },{ 'x':101,'y':36 },{ 'x':27,'y':37 },{ 'x':28,'y':37 },{ 'x':29,'y':37 },{ 'x':36,'y':37 },{ 'x':37,'y':37 },{ 'x':45,'y':37 },{ 'x':46,'y':37 },{ 'x':54,'y':37 },{ 'x':55,'y':37 },{ 'x':60,'y':37 },{ 'x':61,'y':37 },{ 'x':66,'y':37 },{ 'x':67,'y':37 },{ 'x':72,'y':37 },{ 'x':73,'y':37 },{ 'x':74,'y':37 },{ 'x':89,'y':37 },{ 'x':90,'y':37 },{ 'x':100,'y':37 },{ 'x':101,'y':37 },{ 'x':27,'y':38 },{ 'x':28,'y':38 },{ 'x':29,'y':38 },{ 'x':36,'y':38 },{ 'x':37,'y':38 },{ 'x':45,'y':38 },{ 'x':46,'y':38 },{ 'x':54,'y':38 },{ 'x':55,'y':38 },{ 'x':66,'y':38 },{ 'x':67,'y':38 },{ 'x':72,'y':38 },{ 'x':73,'y':38 },{ 'x':74,'y':38 },{ 'x':89,'y':38 },{ 'x':90,'y':38 },{ 'x':100,'y':38 },{ 'x':101,'y':38 },{ 'x':27,'y':39 },{ 'x':28,'y':39 },{ 'x':29,'y':39 },{ 'x':36,'y':39 },{ 'x':37,'y':39 },{ 'x':45,'y':39 },{ 'x':46,'y':39 },{ 'x':54,'y':39 },{ 'x':55,'y':39 },{ 'x':66,'y':39 },{ 'x':67,'y':39 },{ 'x':72,'y':39 },{ 'x':73,'y':39 },{ 'x':74,'y':39 },{ 'x':75,'y':39 },{ 'x':76,'y':39 },{ 'x':77,'y':39 },{ 'x':78,'y':39 },{ 'x':79,'y':39 },{ 'x':89,'y':39 },{ 'x':90,'y':39 },{ 'x':95,'y':39 },{ 'x':96,'y':39 },{ 'x':97,'y':39 },{ 'x':98,'y':39 },{ 'x':99,'y':39 },{ 'x':100,'y':39 },{ 'x':101,'y':39 },{ 'x':27,'y':40 },{ 'x':28,'y':40 },{ 'x':29,'y':40 },{ 'x':36,'y':40 },{ 'x':37,'y':40 },{ 'x':45,'y':40 },{ 'x':46,'y':40 },{ 'x':54,'y':40 },{ 'x':55,'y':40 },{ 'x':66,'y':40 },{ 'x':67,'y':40 },{ 'x':72,'y':40 },{ 'x':73,'y':40 },{ 'x':74,'y':40 },{ 'x':75,'y':40 },{ 'x':76,'y':40 },{ 'x':77,'y':40 },{ 'x':78,'y':40 },{ 'x':79,'y':40 },{ 'x':89,'y':40 },{ 'x':90,'y':40 },{ 'x':151,'y':91 },{ 'x':152,'y':91 },{ 'x':151,'y':92 },{ 'x':152,'y':92 },{ 'x':151,'y':93 },{ 'x':152,'y':93 },{ 'x':27,'y':95 },{ 'x':28,'y':95 },{ 'x':29,'y':95 },{ 'x':30,'y':95 },{ 'x':45,'y':95 },{ 'x':46,'y':95 },{ 'x':58,'y':95 },{ 'x':59,'y':95 },{ 'x':86,'y':95 },{ 'x':87,'y':95 },{ 'x':92,'y':95 },{ 'x':93,'y':95 },{ 'x':101,'y':95 },{ 'x':102,'y':95 },{ 'x':103,'y':95 },{ 'x':104,'y':95 },{ 'x':113,'y':95 },{ 'x':114,'y':95 },{ 'x':132,'y':95 },{ 'x':133,'y':95 },{ 'x':151,'y':95 },{ 'x':152,'y':95 },{ 'x':157,'y':95 },{ 'x':158,'y':95 },{ 'x':177,'y':95 },{ 'x':178,'y':95 },{ 'x':27,'y':96 },{ 'x':28,'y':96 },{ 'x':29,'y':96 },{ 'x':30,'y':96 },{ 'x':31,'y':96 },{ 'x':32,'y':96 },{ 'x':33,'y':96 },{ 'x':45,'y':96 },{ 'x':46,'y':96 },{ 'x':49,'y':96 },{ 'x':50,'y':96 },{ 'x':51,'y':96 },{ 'x':52,'y':96 },{ 'x':58,'y':96 },{ 'x':59,'y':96 },{ 'x':62,'y':96 },{ 'x':63,'y':96 },{ 'x':68,'y':96 },{ 'x':69,'y':96 },{ 'x':70,'y':96 },{ 'x':71,'y':96 },{ 'x':72,'y':96 },{ 'x':73,'y':96 },{ 'x':80,'y':96 },{ 'x':81,'y':96 },{ 'x':82,'y':96 },{ 'x':83,'y':96 },{ 'x':86,'y':96 },{ 'x':87,'y':96 },{ 'x':92,'y':96 },{ 'x':93,'y':96 },{ 'x':96,'y':96 },{ 'x':97,'y':96 },{ 'x':101,'y':96 },{ 'x':102,'y':96 },{ 'x':103,'y':96 },{ 'x':104,'y':96 },{ 'x':105,'y':96 },{ 'x':106,'y':96 },{ 'x':107,'y':96 },{ 'x':113,'y':96 },{ 'x':114,'y':96 },{ 'x':117,'y':96 },{ 'x':118,'y':96 },{ 'x':119,'y':96 },{ 'x':120,'y':96 },{ 'x':123,'y':96 },{ 'x':124,'y':96 },{ 'x':125,'y':96 },{ 'x':126,'y':96 },{ 'x':132,'y':96 },{ 'x':133,'y':96 },{ 'x':136,'y':96 },{ 'x':137,'y':96 },{ 'x':138,'y':96 },{ 'x':139,'y':96 },{ 'x':142,'y':96 },{ 'x':143,'y':96 },{ 'x':144,'y':96 },{ 'x':145,'y':96 },{ 'x':151,'y':96 },{ 'x':152,'y':96 },{ 'x':157,'y':96 },{ 'x':158,'y':96 },{ 'x':161,'y':96 },{ 'x':162,'y':96 },{ 'x':163,'y':96 },{ 'x':164,'y':96 },{ 'x':171,'y':96 },{ 'x':172,'y':96 },{ 'x':173,'y':96 },{ 'x':174,'y':96 },{ 'x':177,'y':96 },{ 'x':178,'y':96 },{ 'x':33,'y':97 },{ 'x':34,'y':97 },{ 'x':45,'y':97 },{ 'x':46,'y':97 },{ 'x':47,'y':97 },{ 'x':52,'y':97 },{ 'x':53,'y':97 },{ 'x':58,'y':97 },{ 'x':59,'y':97 },{ 'x':60,'y':97 },{ 'x':67,'y':97 },{ 'x':68,'y':97 },{ 'x':73,'y':97 },{ 'x':74,'y':97 },{ 'x':79,'y':97 },{ 'x':80,'y':97 },{ 'x':85,'y':97 },{ 'x':86,'y':97 },{ 'x':87,'y':97 },{ 'x':92,'y':97 },{ 'x':93,'y':97 },{ 'x':94,'y':97 },{ 'x':107,'y':97 },{ 'x':108,'y':97 },{ 'x':113,'y':97 },{ 'x':114,'y':97 },{ 'x':115,'y':97 },{ 'x':119,'y':97 },{ 'x':120,'y':97 },{ 'x':121,'y':97 },{ 'x':126,'y':97 },{ 'x':127,'y':97 },{ 'x':132,'y':97 },{ 'x':133,'y':97 },{ 'x':134,'y':97 },{ 'x':138,'y':97 },{ 'x':139,'y':97 },{ 'x':140,'y':97 },{ 'x':145,'y':97 },{ 'x':146,'y':97 },{ 'x':151,'y':97 },{ 'x':152,'y':97 },{ 'x':157,'y':97 },{ 'x':158,'y':97 },{ 'x':159,'y':97 },{ 'x':164,'y':97 },{ 'x':165,'y':97 },{ 'x':170,'y':97 },{ 'x':171,'y':97 },{ 'x':176,'y':97 },{ 'x':177,'y':97 },{ 'x':178,'y':97 },{ 'x':33,'y':98 },{ 'x':34,'y':98 },{ 'x':45,'y':98 },{ 'x':46,'y':98 },{ 'x':52,'y':98 },{ 'x':53,'y':98 },{ 'x':58,'y':98 },{ 'x':59,'y':98 },{ 'x':67,'y':98 },{ 'x':68,'y':98 },{ 'x':74,'y':98 },{ 'x':75,'y':98 },{ 'x':79,'y':98 },{ 'x':80,'y':98 },{ 'x':86,'y':98 },{ 'x':87,'y':98 },{ 'x':92,'y':98 },{ 'x':93,'y':98 },{ 'x':107,'y':98 },{ 'x':108,'y':98 },{ 'x':113,'y':98 },{ 'x':114,'y':98 },{ 'x':119,'y':98 },{ 'x':120,'y':98 },{ 'x':121,'y':98 },{ 'x':126,'y':98 },{ 'x':127,'y':98 },{ 'x':132,'y':98 },{ 'x':133,'y':98 },{ 'x':138,'y':98 },{ 'x':139,'y':98 },{ 'x':140,'y':98 },{ 'x':145,'y':98 },{ 'x':146,'y':98 },{ 'x':151,'y':98 },{ 'x':152,'y':98 },{ 'x':157,'y':98 },{ 'x':158,'y':98 },{ 'x':164,'y':98 },{ 'x':165,'y':98 },{ 'x':170,'y':98 },{ 'x':171,'y':98 },{ 'x':177,'y':98 },{ 'x':178,'y':98 },{ 'x':31,'y':99 },{ 'x':32,'y':99 },{ 'x':33,'y':99 },{ 'x':34,'y':99 },{ 'x':45,'y':99 },{ 'x':46,'y':99 },{ 'x':52,'y':99 },{ 'x':53,'y':99 },{ 'x':54,'y':99 },{ 'x':58,'y':99 },{ 'x':59,'y':99 },{ 'x':66,'y':99 },{ 'x':67,'y':99 },{ 'x':68,'y':99 },{ 'x':74,'y':99 },{ 'x':75,'y':99 },{ 'x':78,'y':99 },{ 'x':79,'y':99 },{ 'x':80,'y':99 },{ 'x':86,'y':99 },{ 'x':87,'y':99 },{ 'x':92,'y':99 },{ 'x':93,'y':99 },{ 'x':105,'y':99 },{ 'x':106,'y':99 },{ 'x':107,'y':99 },{ 'x':108,'y':99 },{ 'x':113,'y':99 },{ 'x':114,'y':99 },{ 'x':119,'y':99 },{ 'x':120,'y':99 },{ 'x':121,'y':99 },{ 'x':126,'y':99 },{ 'x':127,'y':99 },{ 'x':132,'y':99 },{ 'x':133,'y':99 },{ 'x':138,'y':99 },{ 'x':139,'y':99 },{ 'x':140,'y':99 },{ 'x':145,'y':99 },{ 'x':146,'y':99 },{ 'x':151,'y':99 },{ 'x':152,'y':99 },{ 'x':157,'y':99 },{ 'x':158,'y':99 },{ 'x':164,'y':99 },{ 'x':165,'y':99 },{ 'x':169,'y':99 },{ 'x':170,'y':99 },{ 'x':171,'y':99 },{ 'x':177,'y':99 },{ 'x':178,'y':99 },{ 'x':27,'y':100 },{ 'x':28,'y':100 },{ 'x':29,'y':100 },{ 'x':30,'y':100 },{ 'x':31,'y':100 },{ 'x':32,'y':100 },{ 'x':33,'y':100 },{ 'x':34,'y':100 },{ 'x':45,'y':100 },{ 'x':46,'y':100 },{ 'x':52,'y':100 },{ 'x':53,'y':100 },{ 'x':54,'y':100 },{ 'x':58,'y':100 },{ 'x':59,'y':100 },{ 'x':66,'y':100 },{ 'x':67,'y':100 },{ 'x':68,'y':100 },{ 'x':74,'y':100 },{ 'x':75,'y':100 },{ 'x':78,'y':100 },{ 'x':79,'y':100 },{ 'x':80,'y':100 },{ 'x':86,'y':100 },{ 'x':87,'y':100 },{ 'x':92,'y':100 },{ 'x':93,'y':100 },{ 'x':101,'y':100 },{ 'x':102,'y':100 },{ 'x':103,'y':100 },{ 'x':104,'y':100 },{ 'x':105,'y':100 },{ 'x':106,'y':100 },{ 'x':107,'y':100 },{ 'x':108,'y':100 },{ 'x':113,'y':100 },{ 'x':114,'y':100 },{ 'x':119,'y':100 },{ 'x':120,'y':100 },{ 'x':121,'y':100 },{ 'x':126,'y':100 },{ 'x':127,'y':100 },{ 'x':132,'y':100 },{ 'x':133,'y':100 },{ 'x':138,'y':100 },{ 'x':139,'y':100 },{ 'x':140,'y':100 },{ 'x':145,'y':100 },{ 'x':146,'y':100 },{ 'x':151,'y':100 },{ 'x':152,'y':100 },{ 'x':157,'y':100 },{ 'x':158,'y':100 },{ 'x':164,'y':100 },{ 'x':165,'y':100 },{ 'x':169,'y':100 },{ 'x':170,'y':100 },{ 'x':171,'y':100 },{ 'x':177,'y':100 },{ 'x':178,'y':100 },{ 'x':26,'y':101 },{ 'x':27,'y':101 },{ 'x':28,'y':101 },{ 'x':33,'y':101 },{ 'x':34,'y':101 },{ 'x':45,'y':101 },{ 'x':46,'y':101 },{ 'x':52,'y':101 },{ 'x':53,'y':101 },{ 'x':58,'y':101 },{ 'x':59,'y':101 },{ 'x':67,'y':101 },{ 'x':68,'y':101 },{ 'x':74,'y':101 },{ 'x':75,'y':101 },{ 'x':79,'y':101 },{ 'x':80,'y':101 },{ 'x':86,'y':101 },{ 'x':87,'y':101 },{ 'x':92,'y':101 },{ 'x':93,'y':101 },{ 'x':100,'y':101 },{ 'x':101,'y':101 },{ 'x':102,'y':101 },{ 'x':107,'y':101 },{ 'x':108,'y':101 },{ 'x':113,'y':101 },{ 'x':114,'y':101 },{ 'x':119,'y':101 },{ 'x':120,'y':101 },{ 'x':121,'y':101 },{ 'x':126,'y':101 },{ 'x':127,'y':101 },{ 'x':132,'y':101 },{ 'x':133,'y':101 },{ 'x':138,'y':101 },{ 'x':139,'y':101 },{ 'x':140,'y':101 },{ 'x':145,'y':101 },{ 'x':146,'y':101 },{ 'x':151,'y':101 },{ 'x':152,'y':101 },{ 'x':157,'y':101 },{ 'x':158,'y':101 },{ 'x':164,'y':101 },{ 'x':165,'y':101 },{ 'x':170,'y':101 },{ 'x':171,'y':101 },{ 'x':177,'y':101 },{ 'x':178,'y':101 },{ 'x':26,'y':102 },{ 'x':27,'y':102 },{ 'x':33,'y':102 },{ 'x':34,'y':102 },{ 'x':45,'y':102 },{ 'x':46,'y':102 },{ 'x':47,'y':102 },{ 'x':52,'y':102 },{ 'x':53,'y':102 },{ 'x':58,'y':102 },{ 'x':59,'y':102 },{ 'x':67,'y':102 },{ 'x':68,'y':102 },{ 'x':73,'y':102 },{ 'x':74,'y':102 },{ 'x':79,'y':102 },{ 'x':80,'y':102 },{ 'x':85,'y':102 },{ 'x':86,'y':102 },{ 'x':87,'y':102 },{ 'x':92,'y':102 },{ 'x':93,'y':102 },{ 'x':100,'y':102 },{ 'x':101,'y':102 },{ 'x':107,'y':102 },{ 'x':108,'y':102 },{ 'x':113,'y':102 },{ 'x':114,'y':102 },{ 'x':119,'y':102 },{ 'x':120,'y':102 },{ 'x':121,'y':102 },{ 'x':126,'y':102 },{ 'x':127,'y':102 },{ 'x':132,'y':102 },{ 'x':133,'y':102 },{ 'x':138,'y':102 },{ 'x':139,'y':102 },{ 'x':140,'y':102 },{ 'x':145,'y':102 },{ 'x':146,'y':102 },{ 'x':151,'y':102 },{ 'x':152,'y':102 },{ 'x':157,'y':102 },{ 'x':158,'y':102 },{ 'x':164,'y':102 },{ 'x':165,'y':102 },{ 'x':170,'y':102 },{ 'x':171,'y':102 },{ 'x':176,'y':102 },{ 'x':177,'y':102 },{ 'x':178,'y':102 },{ 'x':27,'y':103 },{ 'x':28,'y':103 },{ 'x':29,'y':103 },{ 'x':30,'y':103 },{ 'x':33,'y':103 },{ 'x':34,'y':103 },{ 'x':45,'y':103 },{ 'x':46,'y':103 },{ 'x':49,'y':103 },{ 'x':50,'y':103 },{ 'x':51,'y':103 },{ 'x':52,'y':103 },{ 'x':58,'y':103 },{ 'x':59,'y':103 },{ 'x':68,'y':103 },{ 'x':69,'y':103 },{ 'x':70,'y':103 },{ 'x':71,'y':103 },{ 'x':72,'y':103 },{ 'x':73,'y':103 },{ 'x':80,'y':103 },{ 'x':81,'y':103 },{ 'x':82,'y':103 },{ 'x':83,'y':103 },{ 'x':86,'y':103 },{ 'x':87,'y':103 },{ 'x':92,'y':103 },{ 'x':93,'y':103 },{ 'x':101,'y':103 },{ 'x':102,'y':103 },{ 'x':103,'y':103 },{ 'x':104,'y':103 },{ 'x':107,'y':103 },{ 'x':108,'y':103 },{ 'x':113,'y':103 },{ 'x':114,'y':103 },{ 'x':119,'y':103 },{ 'x':120,'y':103 },{ 'x':121,'y':103 },{ 'x':126,'y':103 },{ 'x':127,'y':103 },{ 'x':132,'y':103 },{ 'x':133,'y':103 },{ 'x':138,'y':103 },{ 'x':139,'y':103 },{ 'x':140,'y':103 },{ 'x':145,'y':103 },{ 'x':146,'y':103 },{ 'x':151,'y':103 },{ 'x':152,'y':103 },{ 'x':157,'y':103 },{ 'x':158,'y':103 },{ 'x':164,'y':103 },{ 'x':165,'y':103 },{ 'x':171,'y':103 },{ 'x':172,'y':103 },{ 'x':173,'y':103 },{ 'x':174,'y':103 },{ 'x':177,'y':103 },{ 'x':178,'y':103 },{ 'x':33,'y':104 },{ 'x':34,'y':104 },{ 'x':45,'y':104 },{ 'x':46,'y':104 },{ 'x':58,'y':104 },{ 'x':59,'y':104 },{ 'x':86,'y':104 },{ 'x':87,'y':104 },{ 'x':92,'y':104 },{ 'x':93,'y':104 },{ 'x':107,'y':104 },{ 'x':108,'y':104 },{ 'x':113,'y':104 },{ 'x':114,'y':104 },{ 'x':119,'y':104 },{ 'x':120,'y':104 },{ 'x':121,'y':104 },{ 'x':126,'y':104 },{ 'x':127,'y':104 },{ 'x':132,'y':104 },{ 'x':133,'y':104 },{ 'x':138,'y':104 },{ 'x':139,'y':104 },{ 'x':140,'y':104 },{ 'x':145,'y':104 },{ 'x':146,'y':104 },{ 'x':151,'y':104 },{ 'x':152,'y':104 },{ 'x':157,'y':104 },{ 'x':158,'y':104 },{ 'x':164,'y':104 },{ 'x':165,'y':104 },{ 'x':177,'y':104 },{ 'x':178,'y':104 },{ 'x':45,'y':105 },{ 'x':46,'y':105 },{ 'x':86,'y':105 },{ 'x':87,'y':105 },{ 'x':177,'y':105 },{ 'x':178,'y':105 },{ 'x':45,'y':106 },{ 'x':46,'y':106 },{ 'x':85,'y':106 },{ 'x':86,'y':106 },{ 'x':176,'y':106 },{ 'x':177,'y':106 },{ 'x':45,'y':107 },{ 'x':46,'y':107 },{ 'x':80,'y':107 },{ 'x':81,'y':107 },{ 'x':82,'y':107 },{ 'x':83,'y':107 },{ 'x':84,'y':107 },{ 'x':85,'y':107 },{ 'x':171,'y':107 },{ 'x':172,'y':107 },{ 'x':173,'y':107 },{ 'x':174,'y':107 },{ 'x':175,'y':107 },{ 'x':176,'y':107 },{ 'x':45,'y':108 },{ 'x':46,'y':108 },{ 'x':75,'y':156 },{ 'x':76,'y':156 },{ 'x':75,'y':157 },{ 'x':76,'y':157 },{ 'x':75,'y':158 },{ 'x':76,'y':158 },{ 'x':75,'y':159 },{ 'x':76,'y':159 },{ 'x':75,'y':160 },{ 'x':76,'y':160 },{ 'x':81,'y':160 },{ 'x':82,'y':160 },{ 'x':83,'y':160 },{ 'x':84,'y':160 },{ 'x':93,'y':160 },{ 'x':94,'y':160 },{ 'x':113,'y':160 },{ 'x':114,'y':160 },{ 'x':119,'y':160 },{ 'x':120,'y':160 },{ 'x':126,'y':160 },{ 'x':127,'y':160 },{ 'x':132,'y':160 },{ 'x':133,'y':160 },{ 'x':134,'y':160 },{ 'x':135,'y':160 },{ 'x':151,'y':160 },{ 'x':152,'y':160 },{ 'x':75,'y':161 },{ 'x':76,'y':161 },{ 'x':81,'y':161 },{ 'x':82,'y':161 },{ 'x':83,'y':161 },{ 'x':84,'y':161 },{ 'x':85,'y':161 },{ 'x':86,'y':161 },{ 'x':87,'y':161 },{ 'x':93,'y':161 },{ 'x':94,'y':161 },{ 'x':97,'y':161 },{ 'x':98,'y':161 },{ 'x':99,'y':161 },{ 'x':100,'y':161 },{ 'x':107,'y':161 },{ 'x':108,'y':161 },{ 'x':109,'y':161 },{ 'x':110,'y':161 },{ 'x':113,'y':161 },{ 'x':114,'y':161 },{ 'x':119,'y':161 },{ 'x':120,'y':161 },{ 'x':126,'y':161 },{ 'x':127,'y':161 },{ 'x':132,'y':161 },{ 'x':133,'y':161 },{ 'x':134,'y':161 },{ 'x':135,'y':161 },{ 'x':136,'y':161 },{ 'x':137,'y':161 },{ 'x':138,'y':161 },{ 'x':145,'y':161 },{ 'x':146,'y':161 },{ 'x':147,'y':161 },{ 'x':148,'y':161 },{ 'x':151,'y':161 },{ 'x':152,'y':161 },{ 'x':158,'y':161 },{ 'x':159,'y':161 },{ 'x':160,'y':161 },{ 'x':161,'y':161 },{ 'x':162,'y':161 },{ 'x':163,'y':161 },{ 'x':75,'y':162 },{ 'x':76,'y':162 },{ 'x':87,'y':162 },{ 'x':88,'y':162 },{ 'x':93,'y':162 },{ 'x':94,'y':162 },{ 'x':95,'y':162 },{ 'x':100,'y':162 },{ 'x':101,'y':162 },{ 'x':106,'y':162 },{ 'x':107,'y':162 },{ 'x':112,'y':162 },{ 'x':113,'y':162 },{ 'x':114,'y':162 },{ 'x':119,'y':162 },{ 'x':120,'y':162 },{ 'x':126,'y':162 },{ 'x':127,'y':162 },{ 'x':138,'y':162 },{ 'x':139,'y':162 },{ 'x':144,'y':162 },{ 'x':145,'y':162 },{ 'x':150,'y':162 },{ 'x':151,'y':162 },{ 'x':152,'y':162 },{ 'x':157,'y':162 },{ 'x':158,'y':162 },{ 'x':163,'y':162 },{ 'x':164,'y':162 },{ 'x':75,'y':163 },{ 'x':76,'y':163 },{ 'x':87,'y':163 },{ 'x':88,'y':163 },{ 'x':93,'y':163 },{ 'x':94,'y':163 },{ 'x':100,'y':163 },{ 'x':101,'y':163 },{ 'x':106,'y':163 },{ 'x':107,'y':163 },{ 'x':113,'y':163 },{ 'x':114,'y':163 },{ 'x':119,'y':163 },{ 'x':120,'y':163 },{ 'x':126,'y':163 },{ 'x':127,'y':163 },{ 'x':138,'y':163 },{ 'x':139,'y':163 },{ 'x':144,'y':163 },{ 'x':145,'y':163 },{ 'x':151,'y':163 },{ 'x':152,'y':163 },{ 'x':157,'y':163 },{ 'x':158,'y':163 },{ 'x':164,'y':163 },{ 'x':165,'y':163 },{ 'x':75,'y':164 },{ 'x':76,'y':164 },{ 'x':85,'y':164 },{ 'x':86,'y':164 },{ 'x':87,'y':164 },{ 'x':88,'y':164 },{ 'x':93,'y':164 },{ 'x':94,'y':164 },{ 'x':100,'y':164 },{ 'x':101,'y':164 },{ 'x':105,'y':164 },{ 'x':106,'y':164 },{ 'x':107,'y':164 },{ 'x':113,'y':164 },{ 'x':114,'y':164 },{ 'x':119,'y':164 },{ 'x':120,'y':164 },{ 'x':126,'y':164 },{ 'x':127,'y':164 },{ 'x':136,'y':164 },{ 'x':137,'y':164 },{ 'x':138,'y':164 },{ 'x':139,'y':164 },{ 'x':143,'y':164 },{ 'x':144,'y':164 },{ 'x':145,'y':164 },{ 'x':151,'y':164 },{ 'x':152,'y':164 },{ 'x':156,'y':164 },{ 'x':157,'y':164 },{ 'x':158,'y':164 },{ 'x':159,'y':164 },{ 'x':160,'y':164 },{ 'x':161,'y':164 },{ 'x':162,'y':164 },{ 'x':163,'y':164 },{ 'x':164,'y':164 },{ 'x':165,'y':164 },{ 'x':75,'y':165 },{ 'x':76,'y':165 },{ 'x':81,'y':165 },{ 'x':82,'y':165 },{ 'x':83,'y':165 },{ 'x':84,'y':165 },{ 'x':85,'y':165 },{ 'x':86,'y':165 },{ 'x':87,'y':165 },{ 'x':88,'y':165 },{ 'x':93,'y':165 },{ 'x':94,'y':165 },{ 'x':100,'y':165 },{ 'x':101,'y':165 },{ 'x':105,'y':165 },{ 'x':106,'y':165 },{ 'x':107,'y':165 },{ 'x':113,'y':165 },{ 'x':114,'y':165 },{ 'x':119,'y':165 },{ 'x':120,'y':165 },{ 'x':126,'y':165 },{ 'x':127,'y':165 },{ 'x':132,'y':165 },{ 'x':133,'y':165 },{ 'x':134,'y':165 },{ 'x':135,'y':165 },{ 'x':136,'y':165 },{ 'x':137,'y':165 },{ 'x':138,'y':165 },{ 'x':139,'y':165 },{ 'x':143,'y':165 },{ 'x':144,'y':165 },{ 'x':145,'y':165 },{ 'x':151,'y':165 },{ 'x':152,'y':165 },{ 'x':156,'y':165 },{ 'x':157,'y':165 },{ 'x':158,'y':165 },{ 'x':159,'y':165 },{ 'x':160,'y':165 },{ 'x':161,'y':165 },{ 'x':162,'y':165 },{ 'x':163,'y':165 },{ 'x':164,'y':165 },{ 'x':165,'y':165 },{ 'x':75,'y':166 },{ 'x':76,'y':166 },{ 'x':80,'y':166 },{ 'x':81,'y':166 },{ 'x':82,'y':166 },{ 'x':87,'y':166 },{ 'x':88,'y':166 },{ 'x':93,'y':166 },{ 'x':94,'y':166 },{ 'x':100,'y':166 },{ 'x':101,'y':166 },{ 'x':106,'y':166 },{ 'x':107,'y':166 },{ 'x':113,'y':166 },{ 'x':114,'y':166 },{ 'x':119,'y':166 },{ 'x':120,'y':166 },{ 'x':126,'y':166 },{ 'x':127,'y':166 },{ 'x':131,'y':166 },{ 'x':132,'y':166 },{ 'x':133,'y':166 },{ 'x':138,'y':166 },{ 'x':139,'y':166 },{ 'x':144,'y':166 },{ 'x':145,'y':166 },{ 'x':151,'y':166 },{ 'x':152,'y':166 },{ 'x':157,'y':166 },{ 'x':158,'y':166 },{ 'x':75,'y':167 },{ 'x':76,'y':167 },{ 'x':80,'y':167 },{ 'x':81,'y':167 },{ 'x':87,'y':167 },{ 'x':88,'y':167 },{ 'x':93,'y':167 },{ 'x':94,'y':167 },{ 'x':100,'y':167 },{ 'x':101,'y':167 },{ 'x':106,'y':167 },{ 'x':107,'y':167 },{ 'x':112,'y':167 },{ 'x':113,'y':167 },{ 'x':114,'y':167 },{ 'x':119,'y':167 },{ 'x':120,'y':167 },{ 'x':125,'y':167 },{ 'x':126,'y':167 },{ 'x':127,'y':167 },{ 'x':131,'y':167 },{ 'x':132,'y':167 },{ 'x':138,'y':167 },{ 'x':139,'y':167 },{ 'x':144,'y':167 },{ 'x':145,'y':167 },{ 'x':150,'y':167 },{ 'x':151,'y':167 },{ 'x':152,'y':167 },{ 'x':157,'y':167 },{ 'x':158,'y':167 },{ 'x':75,'y':168 },{ 'x':76,'y':168 },{ 'x':81,'y':168 },{ 'x':82,'y':168 },{ 'x':83,'y':168 },{ 'x':84,'y':168 },{ 'x':87,'y':168 },{ 'x':88,'y':168 },{ 'x':93,'y':168 },{ 'x':94,'y':168 },{ 'x':100,'y':168 },{ 'x':101,'y':168 },{ 'x':107,'y':168 },{ 'x':108,'y':168 },{ 'x':109,'y':168 },{ 'x':110,'y':168 },{ 'x':113,'y':168 },{ 'x':114,'y':168 },{ 'x':120,'y':168 },{ 'x':121,'y':168 },{ 'x':122,'y':168 },{ 'x':123,'y':168 },{ 'x':126,'y':168 },{ 'x':127,'y':168 },{ 'x':132,'y':168 },{ 'x':133,'y':168 },{ 'x':134,'y':168 },{ 'x':135,'y':168 },{ 'x':138,'y':168 },{ 'x':139,'y':168 },{ 'x':145,'y':168 },{ 'x':146,'y':168 },{ 'x':147,'y':168 },{ 'x':148,'y':168 },{ 'x':151,'y':168 },{ 'x':152,'y':168 },{ 'x':158,'y':168 },{ 'x':159,'y':168 },{ 'x':160,'y':168 },{ 'x':161,'y':168 },{ 'x':162,'y':168 },{ 'x':163,'y':168 },{ 'x':164,'y':168 },{ 'x':75,'y':169 },{ 'x':76,'y':169 },{ 'x':87,'y':169 },{ 'x':88,'y':169 },{ 'x':93,'y':169 },{ 'x':94,'y':169 },{ 'x':100,'y':169 },{ 'x':101,'y':169 },{ 'x':113,'y':169 },{ 'x':114,'y':169 },{ 'x':126,'y':169 },{ 'x':127,'y':169 },{ 'x':138,'y':169 },{ 'x':139,'y':169 },{ 'x':151,'y':169 },{ 'x':152,'y':169 },{ 'x':113,'y':170 },{ 'x':114,'y':170 },{ 'x':151,'y':170 },{ 'x':152,'y':170 },{ 'x':112,'y':171 },{ 'x':113,'y':171 },{ 'x':150,'y':171 },{ 'x':151,'y':171 },{ 'x':107,'y':172 },{ 'x':108,'y':172 },{ 'x':109,'y':172 },{ 'x':110,'y':172 },{ 'x':111,'y':172 },{ 'x':112,'y':172 },{ 'x':145,'y':172 },{ 'x':146,'y':172 },{ 'x':147,'y':172 },{ 'x':148,'y':172 },{ 'x':149,'y':172 },{ 'x':150,'y':172}];
    
    this.update=function() {
        ctx.beginPath();
        /*ctx.moveTo(coord[0].x,coord[0].y)
        for (let i = 0; i < coord.length; i++) {
            ctx.lineTo(coord[i].x,coord[i].y);
        }*/
        for (let i = 0; i < coord.length; i++) {
            ctx.fillRect(coord[i].x,coord[i].y,1,1);
        }
        ctx.fillStyle
        ctx.strokeStyle="black";
        ctx.stroke();
        ctx.closePath();
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
        },getRandomInt(minTimeBetweenBolts,maxTimeBetweenBolts)*1/(lightningRate*10));
    }
}

setTimeout(function(){
    newBolt(false);
},getRandomInt(minTimeBetweenBolts,maxTimeBetweenBolts)*1/(lightningRate*10))

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
    
    mainBoat.onScroll()
})

//On s'assure que tout soit toujours aux bonne dimension pour la page
window.addEventListener("resize",function(event){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    width=canvas.width;
    height=canvas.height;
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



