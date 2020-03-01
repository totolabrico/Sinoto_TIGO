function instru(Id, type, X, Y) {

  //<<<<<<< HEAD
  this.id = Id; // identifiant de l'oscilo
  this.type = type;
  this.x = X; // position en x pour affichage
  this.y = Y; // position en y pour affichage
  this.larg = 20; // taille du rectangle de l'id en x
  this.haut = 12; // taille du rectangle de l'id en y
  this.params = new Array(3); // tableau a double entrée pour les differents parametre : frequence, volume, panning, loop, periode de Fade
  this.listPeriode = [0, 5, 5, 0];
  this.paramNames = [
    ["frequence", "volume", "panning"],
    ["to", "from", "current", "loop", "fade", "mute"]
  ];

  // ce qu'il faudrai faire pour les loop : this.params[0] = [[0], 0, 0, false, this.listPeriode[0]];
  this.params[0] = [0, 0, 0, false, this.listPeriode[0]]; // nouvelle fréquence éditée,derniere frequence éditée, frequence jouée, boolean pour Loop, periode de Fade
  this.params[1] = [0, 0, 0, false, this.listPeriode[1], false]; // idem pour volumes, on ajoute une boolean pour le muteMode
  this.params[2] = [0, 0, 0, false, this.listPeriode[2]]; // idem pour pannings  this.ins = new p5.Oscillator();
  this.cmdList = ["f", "v", "p"]; // liste des commande de l'oscilo : frequence, volume , panning,

  this.mouseIsOver = false; // boolean sur la position de la souris pour affichage plus complet des info de l'instrument

  if (this.type == "oscilo") {
    this.ins = new p5.Oscillator(); // creation de l'oscilateur // merci P5.sound !
    this.ins.setType('sine');
    this.ins.freq(1); // on a pas le droit de dire 0 apparement du coup 1, reste inaudible
    this.ins.amp(0);
    this.ins.pan(0);
    this.ins.start();
  }

  if (this.type == "noise") {

    this.params.unshift([0, 0, 0, false, this.listPeriode[3]]); // j'ajoute une liste de parametre au debut de la liste params
    this.paramNames[0].unshift("filterWidth") // j'ajoute un nom au debut de la liste paramNames
    this.cmdList=["w","f","v","p"];
    this.ins = new p5.Noise(); // creation du bruit // merci P5.sound !
    this.filter = new p5.BandPass();
    this.ins.disconnect();
    this.ins.connect(this.filter);
    this.ins.amp(0);
    this.ins.pan(0);
    this.ins.start();
    this.filter.res(0);
    this.filter.freq(0);

  }


  this.editCom = function(Cmd, Arg, Value) { // editer les parametres de l'oscilo
      //  console.log("cmd : " + Cmd + " /arg : " + Arg + " /Value : " + Value);

      var lineIsCorrect = true; // boolean pour envoi ou non de la commande

      if (Value.length > 0) { // si le tableau value n'est pas vide
        for (var i = 0; i < Value.length; i++) { // je verifie que les values sont correctes
          if (Value[i].toString() == "NaN") {
            clavier.doLog("uncorrect value, please switch it into a number",true);
            lineIsCorrect = false; // si elle ne le sont pas alors la commande ne sera pas executée
          }
        }
      }

      if (lineIsCorrect) {
        var cmd, cmdLetter;
        for (var i = 0; i < this.cmdList.length; i++)
          if (Cmd == this.cmdList[i]) {
            cmd = i; // la commande prend la valeur d'une position dans cmdList
            cmdLetter = Cmd;
          //  console.log("letter :"+cmdLetter+" /cmd :"+i)
          }

        if (Arg == "a") { // si l'argument est a (pour "all") => modifie la valeur [0] de params[cmd]

          if (Value.length > 1) this.params[cmd][4] = Value[1]; // la periode devient egale a la seconde valeur
          if (Value.length > 0) {
            if (cmdLetter == "v" && this.params[cmd][5] == true) { // si on tente de changer le volume alors que le mute est actif, on change non pas la premiere mais la seocnde valeur de params[cmd]
              this.params[cmd][1] = Value[0]; // la valeur a atteindre devient egale a la premiere valeur
            } else {
            if(this.params[cmd][0] !=Value[0]){ // si la valeur a aplliqué n'est pas égale a la valeur actuelle
              this.params[cmd][1] = this.params[cmd][0]; // l'ancienne valeur se met a jour si il y a une nouvelle valeur
              this.params[cmd][0] = Value[0]; // la valeur a atteindre deviet egale a la premiere valeur
            }
            }
          }
          if (cmdLetter == "v" && Value[0] < 0) this.params[cmd][0] = 0; // si le volume est negatif je le remet à 0
        }
        if (Arg == "f") { // si l'argument est f (pour "fade")
          this.params[cmd][4] = Value[0]; // la periode devient egale a la valeur
        }
        if (Arg == "m" && cmdLetter == "v") { // si l'argument est m pour mute et que l'on est bien sur le volume
          this.params[cmd][5] = !this.params[cmd][5]; // le mute s'inverse
          if (Value.length > 0) this.params[cmd][4] = Value[0]; // si il y a une valeur, je l'applique a la periode
          if (this.params[cmd][5] == true) { // si le mute est actif
            this.params[cmd][1] = this.params[cmd][0]; // l'ancienne valeur se met a jour si il y a une nouvelle valeur
            this.params[cmd][0] = 0; // la valeur a atteindre deviet egale a la premiere valeur
          } else {
            this.params[cmd][0] = this.params[cmd][1]; // l'ancienne valeur se met a jour si il y a une nouvelle valeur
            this.params[cmd][1] = 0; // la valeur a atteindre deviet egale a la premiere valeur
          }
        }
        if (Arg == "l") { // si l'argument est m pour loop
          if(this.params[cmd][3]==true && Value.length==0 )this.params[cmd][3] = false; // le loop se desactive si il est allumé et qu'il n'y a pas de valeur
          else{if(this.params[cmd][3]==false)this.params[cmd][3] = true; // le loop s'active si on envoi un commande le concernant
          if (Value.length > 0) this.params[cmd][0] = Value[0]; // si il y a une valeur, je l'applique a la nouvelle valeur
          if (Value.length > 1) this.params[cmd][1] = Value[1]; // si il y a une seconde, je l'applique a l'ancienne valeur
          if (Value.length > 2) this.params[cmd][4] = Value[2]; // si il y a une troisieme valeur, je l'applique a la periode
        }
      }
      }
    },


    this.reset = function() { // remise a 0 des parametres

      for (var i = 0; i < this.params.length; i++){
        if (this.type == "oscilo") this.params[i] = [0, 0, 0, false, this.listPeriode[i]];
        if (this.type == "noise"){
          if(i==0)this.params[i] = [0, 0, 0, false, this.listPeriode[3]];
          else{
            this.params[i] = [0, 0, 0, false, this.listPeriode[i-1]];
          }
        }

       }
      this.params[1].push(false);
      if (this.type == "oscilo") this.ins.freq(0.1); // on a pas le droit de dire 0 apparement du coup 1, reste inaudible
      this.ins.amp(0);
      this.ins.pan(0);

    },

    this.aff = function() { // affichage des parametres des oscilateurs

      textAlign(RIGHT);
      noStroke();
      textSize(11);

      let volCol = color(255);

      var paramIdAff = 0;
      if (this.type == "noise") paramIdAff++;
      var textVol = Math.round(this.params[paramIdAff + 1][2] * 100) / 100;
      if (this.params[paramIdAff + 1][2] != 0) volCol = color(255, 0, 0);
      if (this.params[paramIdAff + 1][5] == true) { /// si le mute est actif je change l'affichage du volume
        if (this.params[paramIdAff + 1][2] == 0) {
          textVol = "mute";
          volCol = color(125, 125, 125);
        }
      }

      if (this.mouseIsOver){
         if(this.type=="oscilo")stroke(255, 0, 0);
         if(this.type=="noise")stroke(255);
       }
      fill(255);
      if (this.type == "noise") fill(220,0,0);
      rect(this.x, this.y - 10, this.larg, this.haut);
      noStroke();
      fill(0);
      text(this.id, this.x + 17, this.y);
      fill(255);
      if (this.type == "noise") text(Math.round(this.params[paramIdAff - 1][2] * 100) / 100, this.x + 60, this.y); // frequence jouée
      text(Math.round(this.params[paramIdAff][2] * 100) / 100, this.x + 100, this.y); // frequence jouée
      fill(volCol);
      text(textVol, this.x + 140, this.y); // volume joué
      fill(255);
      text(Math.round(this.params[paramIdAff + 2][2] * 100) / 100, this.x + 180, this.y); // panning joué

    },

    this.affInfo = function() {
      //// si la souris survole on affiche tout les params de l'instru dans un petit cadre

      var incX = 0;
      //if (mouseX > sinotoWidth / 3 && mouseX < sinotoWidth * 2 / 3) incX = -100;
      //if (mouseX > sinotoWidth * 2 / 3) incX = -300;

      this.mouseIsOver = false; // est ce que la souris est au dessus de l'id de l'instrument
      if (mouseX > this.x && mouseX < this.x + sinotoWidth/3 && mouseY > this.y - 10 && mouseY < this.y - 10 + this.haut) this.mouseIsOver = true;

      textAlign(LEFT);
      if (this.mouseIsOver) {
        stroke(255);
        fill(0);
        rect(sinotoX + 10, sinotoY + sinotoHeight - consoleHeight+12, sinotoWidth - 20, consoleHeight -82);
        noStroke();
        textSize(14);
        fill(255);
        textAlign(RIGHT);
        text(this.type+" n°"+this.id, sinotoX +sinotoWidth- 20, sinotoY + sinotoHeight - consoleHeight+40)
        textAlign(LEFT);


        for (var j = 0; j < this.params.length; j++) { // affichage des categorie (frequence, volume, panning, space)
          fill(255, 0, 0);
          textSize(12);
          text(this.paramNames[0][j], sinotoX + incX + 20 + j * 130, sinotoY + sinotoHeight - consoleHeight+40)
          fill(255);
          textSize(11);
          for (var i = 0; i < this.params[j].length; i++) { // afichage des parametre
              text(this.paramNames[1][i] + " : " + Math.round(this.params[j][i] * 100) / 100, sinotoX + incX + 20 + j * 130, sinotoY + sinotoHeight - consoleHeight+60 + i * 12);
          }
        }
      }
    }

}
