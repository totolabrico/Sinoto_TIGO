// passer en local les commandes envoyé par le superlooper !

var scaleId = [
  [0, 2],
  [3, 8]
];


function composer() {

  this.compose = function() {
    this.cmdlist = [];
    this.bpm = int(random(50, 200));
    this.cmdlist.push("l bpm " + this.bpm);
    this.cmdlist.push("h bpm " + this.bpm);
    this.mesures = Math.pow(int(random(2, 4)), 2);
    this.cmdlist.push("l mesure " + this.mesures);
    this.temps = int(random(1, 5)) * 4;
    this.cmdlist.push("l temps " + this.temps);
    this.fondamentale = int(random(12));
    this.nbactions = this.mesures * 2;
    this.gammePicked = int(random(2));


    for (var i = 0; i < this.nbactions; i++) {
      this.nbnotes = int(random(3)); ////// nombre d'ocsilos déclenchés
      this.osci = int(random(0, nboscilo - (this.nbnotes + 1)));
      this.nbnotes += this.osci;
      this.incnote = Math.round(random(2) * 100) / 100;
      this.note = this.fondamentale + gamme[this.gammePicked][int(random(this.gammePicked.length))];
      if (this.note > 11) this.note -= 12;
      this.octave = int(map(this.osci, 0, nboscilo, 2, notes[0].length - 5)); ////////////////////////: nb d'octaves

      console.log(this.octave);
      this.lanote = notes[this.note][this.octave];
      this.vol = Math.round((1000 / this.lanote) * 100) / 100;
      this.pan = Math.round(random(-1, 1) * 100) / 100;
      this.mes = int(random(this.mesures));
      //    this.tem=int(random(this.temps));
      this.tem = int(random(2)) * (this.temps / 2);
      var pieceforReset = int(random(4));
      if (pieceforReset == 0) this.vol = 0;
      this.cmdlist.push("l " + this.mes + "." + this.tem + " " + this.osci + "+" + this.nbnotes + " " + this.lanote + "+" + this.incnote + " " + this.vol + " " + this.pan);
    }

    this.cmdlist.push("l play");

    for (var i = 0; i < this.cmdlist.length; i++) console.log("composer : " + this.cmdlist[i]);
    for (var i = 0; i < this.cmdlist.length; i++) commandes.analyse(this.cmdlist[i]);
  }

  this.setFade = function() {

    var fadeValues = [];
    var fadeline = '';

    fadeValues[0] = cmdList[int(random(3))];
    fadeValues[1] = cmdArgList[int(random(3))];

    switch (fadeValues[0]) {
      case "f":
        fadeValues[2] = random(2);
        break;
      case "v":
        fadeValues[2] = random(4, 10);
        break;
      case "p":
        fadeValues[2] = random(8, 20);
        break;
      default:
    }

    switch (fadeValues[1]) {
      case "f":
        fadeline = "l 0.0 0<26 " + fadeValues[0] + " " + fadeValues[1] + " " + fadeValues[2]
        break;
      default:
      fadeline = "l 0.0 0<26 " + fadeValues[0] + " " + fadeValues[1]

    }
    commandes.analyse(fadeline);

  }

}
