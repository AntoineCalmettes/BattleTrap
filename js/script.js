/* 
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
SCREEN 
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
*/
let screenHome = document.getElementById('screen-home');
let screenChoosePerso = document.getElementById('screen-choose-perso');
let screenGame = document.getElementById('sceen-game');
let screenGameOver = document.getElementById('screen-gameOver');


/*
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
VISIBILITY SCREEN
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
*/

screenChoosePerso.hidden = true;
screenGameOver.hidden = true;

let textChoose = document.getElementById('text-choose');
let mageChoose = document.getElementById('mageChoose')
let voleurChoose = document.getElementById('voleurChoose')
let guerrierChoose = document.getElementById('guerrierChoose')
var persoChoose;
let divCaracteristique = document.getElementById('caracteristique')
let titleCaracteristique = document.getElementById('titleCaracteristique')
let contenuCaracteristique = document.getElementById('contenuCaracteristique')

let progressLife = document.getElementById('progressLife')
let progressSpeed = document.getElementById('progressSpeed')
let progressDommage = document.getElementById('progressDommage')
let progressSpeedAttaque = document.getElementById('progressSpeedAttaque')
let historyPerso = document.getElementById('historyPerso')



mageChoose.addEventListener("click", () => {
    textChoose.innerHTML = "MAGE"
    persoChoose = 'mage';
    textChoose.style.color = "rgba(255, 255, 255, 1)"

    progressLife.addariaValuenow="75";
    progressLife.ariaValuemin="0"
    progressLife.ariaValuemax="100"
    progressLife.style.width="20%"

    progressSpeed.addariaValuenow="75";
    progressSpeed.ariaValuemin="0"
    progressSpeed.ariaValuemax="100"
    progressSpeed.style.width="50%"

    progressDommage.addariaValuenow="75";
    progressDommage.ariaValuemin="0"
    progressDommage.ariaValuemax="100"
    progressDommage.style.width="50%"

    progressSpeedAttaque.addariaValuenow="75";
    progressSpeedAttaque.ariaValuemin="0"
    progressSpeedAttaque.ariaValuemax="100"
    progressSpeedAttaque.style.width="50%"

    historyPerso.innerHTML=" Largement considéré comme l'un des plus puissants sorciers de Vallaria, Ce mage est un archimage endurci par les ans qui porte un fardeau incommensurable sur ses épaules. Armé d'une constitution à toute épreuve et d'un vaste arsenal de connaissances mystiques, il consacre sa vie à rassembler les Runes telluriques, les fragments de magie brute qui ont jadis servi à façonner le monde.";


}, false)

voleurChoose.addEventListener("click", () => {
    persoChoose = 'assasin';
    textChoose.innerHTML = "VOLEUR"
    textChoose.style.color = "rgba(255, 255, 255, 1)"

    progressLife.addariaValuenow="75";
    progressLife.ariaValuemin="0"
    progressLife.ariaValuemax="100"
    progressLife.style.width="50%"

    progressSpeed.addariaValuenow="75";
    progressSpeed.ariaValuemin="0"
    progressSpeed.ariaValuemax="100"
    progressSpeed.style.width="100%"

    progressDommage.addariaValuenow="75";
    progressDommage.ariaValuemin="0"
    progressDommage.ariaValuemax="100"
    progressDommage.style.width="30%"

    progressSpeedAttaque.addariaValuenow="75";
    progressSpeedAttaque.ariaValuemin="0"
    progressSpeedAttaque.ariaValuemax="100"
    progressSpeedAttaque.style.width="100%"

    historyPerso.innerHTML=" On dit que la mort n'est pas drôle. C'est vrai, à moins que vous ne soyez ce voleur ; là, elle est hilarante. C'est le premier comique meurtrier en activité de ValoraneCity. Celui qu'on appelle le voleur des ténèbres est une énigme. Personne de vivant ne sait d'où il vient, lui-même n'en parle jamais à personne. Les rumeurs disent qu'il n'est pas de RunerraCity, qu'il est un être originaire d'un monde sombre et difforme.";

}, false)

guerrierChoose.addEventListener("click", () => {
    persoChoose = 'warrior';
    textChoose.innerHTML = "GUERRIER"
    textChoose.style.color = "rgba(255, 255, 255, 1)"

    progressLife.addariaValuenow="75";
    progressLife.ariaValuemin="0"
    progressLife.ariaValuemax="100"
    progressLife.style.width="100%"

    progressSpeed.addariaValuenow="75";
    progressSpeed.ariaValuemin="0"
    progressSpeed.ariaValuemax="100"
    progressSpeed.style.width="35%"

    progressDommage.addariaValuenow="75";
    progressDommage.ariaValuemin="0"
    progressDommage.ariaValuemax="100"
    progressDommage.style.width="50%"

    progressSpeedAttaque.addariaValuenow="75";
    progressSpeedAttaque.ariaValuemin="0"
    progressSpeedAttaque.ariaValuemax="100"
    progressSpeedAttaque.style.width="20%"

    historyPerso.innerHTML=" Né dans la noble famille des Crown, Ce guerrier sut dès son plus jeune âge que sa vocation était de défendre le trône de Demacia au péril de sa vie. Son père, Piter, était un officier décoré et sa tante Tianna était le Capitaine-Épée d'une unité d'élite, le Détachement hardi : et tous deux étaient appréciés et respectés par le roi Stalas IV. Nul ne doutait que ce guerrier servirait le fils du roi de la même manière.";
}, false)
