//// A FAIRE
// socket a decommenter : 4 dans le sinoto.js , 1 paragraphe dans commandes, 1 dans saves, 1 dans clavier
//////// PRIORITE MAXIMA : CI DESSOUS
//////// mettre un mode hors ligne
//////// utiliser le volume correctement en ce qui concerne les fades
///////// ajouter la phase en tant que parametre fondamentale
////////// les pannings parfois font tout craquer
////// COMMENTER en particulier solfege, commandes, timeline
//// scale : peufra : pour eviter que le son ne dépase un certain niveau
//// compressor
//////////////////// BIEN FAIRE DES LOGS
let socket; // declaration du socket
var connected = true;
let helpContent = ""; // contenu texte de la rubrique d'aide
let helpStrings;
var helpAff = true; // affichage ou non de la rubrique d'aide

let myFont; // creation de la variable pour la typo
var inp; // input : clavier
var rec; // instance de recorder
var mywidth; // taille de l'ecran de l'utilisateur
var myheight; // taille de l'écran de l'utilisateur
var Cnv; // canvas du programme
var sinotoWidth = 600; // taille du canvas du programe
var sinotoHeight = 490; // taille du canvas du programes
var sinotoX; // position du sinoto en x
var sinotoY; // position du sinoto en y
var nboscilo = 27; // nombres d'ocsilateurs
var nbBruit = 3; // nombre de bruit
var instrus = []; // tableau pour l'objet Instrulo
var nbinstru = nboscilo + nbBruit; // nombre d'ocilateurs
var nbOsciPerColumn = 9; // nombre d'Instrulateurs par colone
var nbBruitPerColumn = 1; // nombre d'Instrulateurs par colone
var xInc = 200; // increment en x pour affichage des intruments
var yInc = 15; // increment en y pour affichage des intruments
var xOsci; // position x initiale des instrument
var yOsci; // position y initiale des instrument
var yBruit; // position y intermediaire des instrument
var xInstru; // variable pour affichage des Instrulateurs
var yInstru; // variable pour affichage des Instrulateurs
var posYhisto = 0; //// valeur pour incrementation au scroll de la souris sur la console

var aide;

var firstforperm = true;

var nblooper = 4;
var superlooper = []; // instance de timeline
var eliane; // instance de composer

var total_connections=0
var current_connections=0;

function preload() {
  myFont = loadFont('CourierPrime.ttf');
  helpStrings = loadStrings('guidedescommandes.html');
}

function touchStarted() {
  getAudioContext().resume(); // autorise le contexte audio
}


function setup() {

  for (var i = 0; i < nblooper; i++) superlooper[i] = new timeline(i);
  for (var i = 0; i < helpStrings.length; i++) helpContent += helpStrings[i];

  loadnotes();
  arpeg = new arpegiator;
  eliane = new composer;
  rec = new recorder();
  //  aide = createElement('aide', helpContent);

  //smooth();
  frameRate(30);
  textFont(myFont);
  textSize(11);
  rec.init();
  for (var i = 1; i < nboscilo + 1; i++) instrus.push(new instru(i - 1, "oscilo", 0, 0)); // creation des Instrulos
  for (var i = nboscilo + 1; i < nbinstru + 1; i++) instrus.push(new instru(i - 1, "noise", 0, 0)); // creation des Instrulos

//  socket = io.connect('localhost:3000'); // creation du socket
  socket = io.connect('51.75.122.235:3000'); // creation du socket

  socket.on('Servorcmd', servorcmd); // le socket ecoute les messages 'Servorcmd' et applique la commande servorcmd
  socket.on('server-data',serverData);
  socket.on('getData', saves.loadFile); // le socket ecoute les messages 'getData' et applique la commande saves.loadfile
  socket.on('autosave', autoSave);
  socket.emit('load', "backup", true); //////////////////////////////// A DECOMMENTER SOCKET !!!

  setAff();
//  getAudioContext().resume(); // autorise le contexte audio

}

function windowResized() {

  setAff();
}

function setAff() {

  mywidth = windowWidth;
  myheight = windowHeight;
  sinotoCnv = createCanvas(mywidth, myheight);
  sinotoCnv.position(0, 0);
  if (helpAff) {
    sinotoX = (mywidth - (sinotoWidth + 500)) / 2;
  } else {
    sinotoX = (mywidth - sinotoWidth) / 2;
  }
  sinotoY = (myheight - sinotoHeight) / 2;

  yOsci = sinotoY; // position y initiale des instrument
  xOsci = sinotoX + 10; // position x initiale des instrument
  yInstru = yOsci; // variable pour affichage des Instrulateurs
  xInstru = xOsci; // variable pour affichage des Instrulateurs
  yBruit = yInc * nbOsciPerColumn + yInc + yOsci;

  var nbpercolums = nbOsciPerColumn; // le nombre d'instrus par colone change en cour de boucle
  var yto = yOsci; // le y de départ aussi
  for (var i = 1; i < nbinstru + 1; i++) {
    instrus[i - 1].x = xInstru;
    instrus[i - 1].y = 30 + yInstru;
    yInstru += yInc;
    if (i % nbpercolums == 0) {
      xInstru += xInc;
      if (i == nboscilo) {
        xInstru = xOsci;
        yto = yBruit;
        nbpercolums = nbBruitPerColumn
      }
      yInstru = yto;
    }
  }

  inp = createInput('...'); // creation du clavier
  inp.input(myInputEvent); // fontion appelé par le clavier
  inp.position(sinotoX + 8, sinotoY + sinotoHeight - 52);

  inp.size(sinotoWidth - 20, 40); // taile du clavier
  //  inp.style('font-family', 'cnr'); // font du clavier
  if (helpAff) {
    aide = createElement('aide', helpContent);
    aide.position(sinotoX + sinotoWidth + 100, sinotoY + 22);
    aide.size(sinotoWidth * 2 / 3, sinotoHeight - 32);
  }

}

function draw() {

    background(0);

    fill(0);
    rect(sinotoX, sinotoY, sinotoWidth, sinotoHeight);
    fill(255);
    textAlign(LEFT);
    textSize(11);
    clavier.aff(); // affichage de la console
    textSize(12);
    if (rec.recIsOn == true) rec.aff(); // affichage du recorder
    for (var i = 0; i <= nblooper - 1; i++) superlooper[i].aff(sinotoY + (nbOsciPerColumn + nbBruitPerColumn) * 18 + 22 + (timelineHeight + 6) * i); // affichage des timelines
    //  for (var i = nblooper - 1; i >= 0; i--) superlooper[i].aff(sinotoY + (nbOsciPerColumn + nbBruitPerColumn) * 20 + 30 * i); // affichage des timelines
    for (var i = 0; i < nbinstru; i++) instrus[i].aff(); // affichage des instrument
    for (var i = 0; i < nbinstru; i++) instrus[i].affInfo(); // affichage des parametres des instruments au survol de la souris
    fades.doFade(); // fades des instruments

  }




function keyPressed() {
clavier.gethit(key, keyCode);
}



function mouseWheel(event) { // pour scroller dans l'historique
    if (mouseY > sinotoY + sinotoHeight - consoleHeight && mouseY < sinotoY + sinotoHeight - 40 &&
      mouseX > sinotoX + 10 && mouseX < sinotoX + sinotoWidth - 10) {
      //console.log("scroll");
      if (event.delta > 0 && posYhisto < posInGlobalHisto) posYhisto += 0.5;
      if (event.delta < 0 && posYhisto > 0) posYhisto -= 0.5;

  }
}

function servorcmd(lineFromServor) {
    console.log("line from servor :" + lineFromServor);
    clavier.getSocketEnter(lineFromServor);

}

function serverData(Total,Current){
  console.log(Total,Current);
  total_connections=Total;
  current_connections=Current;

}

function autoSave(EmptyData){
saves.saveParams("backup",true)
}
