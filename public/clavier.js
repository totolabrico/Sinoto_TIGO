var globalHisto = []; // historique de tout y compris les message retour de analyseCom
var nbMaxLines = 8; // nombre de ligne maximum pour affichage de la console
var historique = []; // historique des commande
var posInHisto = 0; // position actuelle dans l'historique
var posInGlobalHisto = 0; //
var posYhisto = 0;
var consoleHeight = 215;
var logInConstrut = "";

function myInputEvent() {
  //console.log('you are typing: ', this.value());
}

var clavier = {

  //phrase: "", // phrase actuelle en construction
  // mots: [], // variable qui serait utile pour autocompletion

  gethit: function(key, keycode) {

    switch (keycode) {
      case 13:
        this.phrase = inp.value();
        this.getEnter(this.phrase);
        break;
      case 38:
        if (posInHisto > 0) {
          posInHisto--;
          this.phrase = historique[posInHisto];
          inp.value(this.phrase);
        }
        break;
      case 40:
        if (posInHisto < historique.length - 1) {
          posInHisto++;
          this.phrase = historique[posInHisto];
          inp.value(this.phrase);
        }
        break;
      default:
    }
  },

  getEnter: function(lineToProcess) {
    inp.value("");
    commandes.analyse(lineToProcess,true); // envoi de la la ligne a la fontion analyse de commandes
    this.addToHisto(lineToProcess)
    saves.saveParams("backup", true);

  },

  getSocketEnter: function(lineToProcess) {
    commandes.analyse(lineToProcess,false); // envoi de la la ligne a la fontion analyse de commandes
    this.addToHisto(lineToProcess)
  },

  addToHisto: function(lineToProcess) {
    posYhisto = 0;
    historique.push(lineToProcess);
    posInHisto = historique.length;

  },

  doLog: function(lineToProcess){
    globalHisto.push(lineToProcess);
  },

  constructLog: function(pieceOfLine, gotoline) {

    logInConstrut += pieceOfLine;
    if (gotoline == true) {
      this.doLog("  >~ "+logInConstrut);
      logInConstrut = "";
    }

  },

  aff: function() {

    textAlign(LEFT);
    stroke(255);
    fill(0);
    rect(sinotoX + 10, sinotoY + sinotoHeight - consoleHeight+12, sinotoWidth - 20, consoleHeight -82); // affichage du contour de la console
  //  fill(255);
  //  rect (sinotoX +10, sinotoY + sinotoHeight-60,sinotoWidth-20,40 );
    stroke(0);
    fill(255);

    if (globalHisto.length > nbMaxLines) posInGlobalHisto = globalHisto.length - nbMaxLines; // affichage de l'historique
    if (globalHisto.length > 0)
      for (var i = posInGlobalHisto - int(posYhisto); i < globalHisto.length - int(posYhisto); i++) text(globalHisto[i], sinotoX + 20, sinotoY + sinotoHeight - consoleHeight+28 + 15 * (i - posInGlobalHisto + int(posYhisto))); // affichage de l'historique
  }
}
