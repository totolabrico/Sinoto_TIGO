var mots = new Array();
var motsForTimeline = new Array();
var lineForTimeline;
var cesure = ["<", "-", "+", ":"]; // caracteres de cesure => y inclure " " serai une bonne chose
var cesuretime = ["&", "<", "+"];
var cmdList = ["f", "v", "p", "w"]; // liste de commande : frequence, volume, panning, resonnace (pour noise)
var cmdListNames = ["frequency", "volume", "panning", "filter's width"];
var cmdArgList = ["f", "l", "m"]; // liste des argument : fade, loop, mute
var cmdArgListNames = ["fade", "loop", "mute"];
var cmdLooperNames = ["play", "pause", "stop", "loop", "bpm", "mesure", "temps", "reset"];

var phrase;
var broadOn;

var randomValue = 2;
var commandes = {

  analyse: function(inLine, broadcast) {

    var phrase = [];
    phrase = split(inLine, " & ");
    for (var i = 0; i < phrase.length; i++) this.analyseLine(phrase[i], broadcast);

  },

  analyseLine: function(inLine, broadcast) {

    broadOn = broadcast;
    phrase = inLine;
    clavier.doLog(phrase);

    mots = inLine.split(' '); // on divise la phrase en liste de mots
    // puis on divise chaque mot en liste d'argument grace à un caratere de cesure: ces
    for (var i = 0; i < mots.length; i++) {
      var motTransit = mots[i];
      mots[i] = new Array();
      var ces = "*"; // caratere de cesure. si il n'y a qu'un seul argument la cesure restera une *
      var letter = "*";
      if (motTransit.length > 1) { // on verifie si il y a une cesure et donc plusieurs arguments
        for (var j = 1; j < motTransit.length; j++) { // on ne verifie pas le premier caractere pour ne pas considerer un  "-" d'un nombre négatif comme cesure
          letter = motTransit.substring(j, j + 1);
          for (var k = 0; k < cesure.length; k++)
            if (letter == cesure[k]) ces = letter; // si la lettre correspond a un caratere de cesure du tableau "cesure" alors la variable "ces" prend la valeur de "lettre"
        }
      }
      mots[i].push(split(motTransit, ces)); // je divise le mot avec la cesure trouvée
      if (ces == "-") mots[i][0][1] = "-" + mots[i][0][1]; // si la cesure est "-" je le rajoute au debut de mon string pour garder la valeur negative
      if (ces == "*") {
        if (i == 0) mots[i][0].push(mots[i][0][0]);
        else {
          mots[i][0].push("0"); // si la cesure est "*", j'ajoute un "0" a ma liste pour bien avoir 2 valeur pour la suite du tri
        }
      }
    }
  //  console.log(mots); // liste d'arguments du mot
    this.applyCom(inLine); // j'appele la fonction applyCom qui applique les commande aux instrus

  },

  applyCom: function(applyLine) { //// ici je filtre les commande simples ce sera utile notament pour séparer les commande de timeline avec les commande d'instrument

    var isATimeCommand = false;
    if (phrase.substring(0, 1) == "s") {
    //  console.log(phrase.substring(1, 2));
      if (int(phrase.substring(1, 2)) >= 0 && int(phrase.substring(1, 2)) < nblooper) {
        this.timeCom(applyLine, int(phrase.substring(1, 2)), int(phrase.substring(1, 2)) + 1);
        isATimeCommand = true;
      }

      if (phrase.substring(1, 2) == " ") {
        this.timeCom(applyLine, 0, nblooper);
        isATimeCommand = true;
      }
    }

    if (isATimeCommand == false) {

      switch (mots[0][0][0]) {
        case "reset":
          clavier.constructLog("reset : ", false);
          if (mots.length == 1)
            for (var i = 0; i < nbinstru; i++) instrus[i].reset(0, nboscilo); /// reset des oscilos et bruits
          if (mots.length == 2) { // reset des timelines
            if (mots[1][0][0] == "all") { // reset des timelines
              clavier.constructLog("global reset of the program", true);
              for (var i = 0; i < nbinstru; i++) instrus[i].reset(0, nboscilo);
              for (var i = 0; i < nblooper; i++) superlooper[i].reset();

            } else {
              this.resetCom();
            }
          } else {
            clavier.constructLog("oscilos", true);
          }
          break;
        case "har":
          arpeg.arp(mots[1][0][0]);
          break;
        case "rec":
          rec.reco();
          broadOn = false;
          break;
        case "save":
          if (mots[1][0][0] == "set") saves.saveParams(mots[2][0][0], true);
          else {
            saves.saveParams(mots[1][0][0], false);
          }
          broadOn = false;
          break;
        case "load":
          if (mots[1][0][0] == "set") socket.emit('load', mots[2][0][0], true);
          else {
            socket.emit('load', mots[1][0][0], false);
          }
          break;
        case "help":
          helpAff = !helpAff;
          broadOn = false;
          setAff();
          break;
        default:
          if (mots.length >= 2) this.instruCom();
          else {
            clavier.constructLog("please read the documentation to become a master of oscilos", true);
          }
      }
    }
    if (broadOn) socket.emit('cmd', phrase); ////////////////////////////////////////////////: A DECOMMENTER SOCKET !

  },


  resetCom: function() {
    var from = int(mots[1][0][0]);
    var to = int(mots[1][0][1]);
    if (to != 0)
      for (var i = from; i < to + 1; i++) instrus[i].reset();
    else {
      instrus[from].reset();
    }

  },

  instruCom: function() {

    var comIsGood = true;

    if (mots[0][0][0] >= 0) clavier.constructLog("oscilo: " + mots[0][0][0], false);
    else {
      clavier.constructLog("please start your command line by specifying the id of an oscilo or a looper", true);
      comIsGood = false;
    }
    //clavier.constructLog(mots[0][0][0], false);
    if (mots[0][0][1] != mots[0][0][0]) clavier.constructLog(" < " + mots[0][0][1], false);
    if (comIsGood) clavier.constructLog(" : ", false);

    var values = new Array();
    var cmd = "a"; // variable pour stocker la commande : w f v p
    var arg = "a"; // variable pour stocker l'argument de la commande : f l m
    for (var i = 0; i < cmdList.length; i++) {
      if (mots[1][0][0] == cmdList[i]) cmd = cmdList[i]; // je verifie si la valeur du second mot correspond a une commandre
    }
    for (var i = 0; i < cmdArgList.length; i++) {
      if (mots.length > 2)
        if (mots[2][0][0] == cmdArgList[i]) arg = cmdArgList[i]; // je verifie si la valeur du second mot correspond a une commandre
    }
    var beginLoop = 1; // par defaut, si il n'y a pas de commande ciblée

    var mycmdname = "default";
    var myargname = "to";

    if (cmd != "a") { // si il y a bien une commande ciblée
      for (var i = 0; i < cmdList.length; i++)
        if (cmdList[i] == cmd) mycmdname = cmdListNames[i];
      if (arg != "a") {
        for (var i = 0; i < cmdArgList.length; i++)
          if (cmdArgList[i] == arg) myargname = cmdArgListNames[i];
        beginLoop = 3; // si il y a bien un argument ciblé
      } else { // si il y a bien un argument ciblé
        beginLoop = 2;
      }
    }

    if (comIsGood) clavier.constructLog(mycmdname + " " + myargname + " ", false);


    for (var i = int(mots[0][0][0]); i <= int(mots[0][0][1]); i++) { // boucle qui s'applique aux oscilos precisés par mot[0]
      values = [];

      if (beginLoop == mots.length) instrus[i].editCom(cmd, arg, values); // pour activation du mute et du loop

      for (var j = beginLoop; j < mots.length; j++) {
        var myValuetogo = mots[j][0][0];
        var incValueTogo = mots[j][0][1];
        if (i == int(mots[0][0][0])) { // je ne log le message que une fois
          clavier.constructLog(myValuetogo, false);
          if (incValueTogo != 0) clavier.constructLog(" + " + float(incValueTogo), false);
          clavier.constructLog(" / ", false);

        }

        if (mots[j][0][1] == "r" || mots[j][0][1] == "-r") {
          var signeInc = 1;
          if (mots[j][0][1] == "-r") signeInc = -1;
          incValueTogo = random(randomValue) * signeInc;
        }


        if (cmd == "f" && arg == "a" || cmd == "a" && j == 1) { // je recupere la valeur de la frequence dans solfege
          myValuetogo = findnote(myValuetogo)
        }

        if (cmd != "a") { // si il y a bien une commande ciblée
          values.push(float(myValuetogo) + float(i - int(mots[0][0][0])) * float(incValueTogo)); // si la phrase est assez longue alors value prend la valeur du 4eme mot
          instrus[i].editCom(cmd, arg, values); //  j'applique editCom de l'objet

        }
        if (cmd == "a") { //si il n'y a pas de commande ciblée
          values = [float(myValuetogo) + float(i - int(mots[0][0][0])) * float(incValueTogo)];
          instrus[i].editCom(instrus[i].cmdList[j - 1], arg, values); //sinon par default j'applique editCom au nombre de mots de la phrase-1 (identifiant) suivant l'odre de la cmdList de l'instru

        }

      }
    }
    if (comIsGood) clavier.constructLog("", true);


  },
  timeCom: function(lineIn, idBegin, idEnd) { // commande pour la timeline

    var idlooper = [idBegin, idEnd];

  //  console.log(idlooper);




    if (mots.length > 1) {
      for (var i = idlooper[0]; i < idlooper[1]; i++) {
        clavier.constructLog("sequencer n°", false);

        switch (mots[1][0][0]) {
          case "play":
            superlooper[i].timelineParams[0][1] = true; // lancer la timeline
            clavier.constructLog(i + " is now playing", true);
            break;
          case "pause":
            superlooper[i].timelineParams[0][1] = false; // mettre en pause
            clavier.constructLog(i + " is paused", true);

            break;
          case "stop":
            superlooper[i].timelineParams[0][1] = false;
            superlooper[i].timelineParams[0][0] = 0;
            clavier.constructLog(i + " stoped", true);

            break;
          case "loop":
            superlooper[i].timelineParams[0][2] = !superlooper[i].timelineParams[0][2]; // activer desactiver le loop
            clavier.constructLog(i + " loop is " + superlooper[i].timelineParams[0][2], true);

            break;
          case "bpm":
            superlooper[i].timelineParams[0][3] = int(mots[2][0][0]); // definir la duree de la timeline
            clavier.constructLog(i + " bpm is now set to " + superlooper[i].timelineParams[0][3], true);
            break;
          case "mesure":
            superlooper[i].timelineParams[0][4] = int(mots[2][0][0]); // definir la duree de la timeline
            clavier.constructLog(i + " number of 'mesures' is now set to " + superlooper[i].timelineParams[0][4], true);

            break;
          case "temps":
            superlooper[i].timelineParams[0][5] = int(mots[2][0][0]); // definir la duree de la timeline
            clavier.constructLog(i + " number of 'temps' is now set to " + superlooper[i].timelineParams[0][5], true);

            break;
          case "reset":
            superlooper[i].reset();
            clavier.constructLog(i + " has been reset", true);

            break;


          default: // asigner une commande à un temps de la timeline
            var tmpsforloop = [];
            var tmpCesu = [" ", " "]
            tmpsforloop = split(mots[1][0][0], ".");
            clavier.constructLog(i + ", for time " + tmpsforloop[0] + "." + tmpsforloop[1] + " ", false);

            var idtoggle = int(tmpsforloop[0]) * superlooper[i].timelineParams[0][5] + int(tmpsforloop[1]);
            //if (mots.length == 2) clavier.constructLog("please specify a command for this time", true);
            if (mots.length >= 3) {
              if (mots[2][0][0] == "remove") {
                clavier.constructLog("remove ", false);
                if (mots[3][0][0] == "all") {
                  superlooper[i].timelineParams[1][idtoggle].splice(2, superlooper[i].timelineParams[1][idtoggle].length - 2);
                  clavier.constructLog("all commands ", true);
                } else {
                  superlooper[i].timelineParams[1][idtoggle].splice(int(mots[3][0][0]) + 1, 1);
                  clavier.constructLog("command n°" + int(mots[3][0][0]), true);

                }
              } else {
                var debutphrase = mots[0][0][0] + " " + mots[1][0][0] + " ";
                var phraseforloop = phrase.substring(debutphrase.length, phrase.length);
                //  console.log(phraseforloop);
                if (tmpsforloop.length == 2) {
                  if (superlooper[i].timelineParams[1][idtoggle].length <= 25) {
                    superlooper[i].timelineParams[1][idtoggle].push(phraseforloop);
                    clavier.constructLog("add a new command : " + phraseforloop, true);
                  } else {
                    clavier.constructLog(" : full, erase some command to add new ones ", true);

                  }
                }
              }
            }
        }

        superlooper[i].refreshValues();
      }
    } else {
      clavier.constructLog("please specify a time value like [0.0] or a command ", true);
    }
  }
}
