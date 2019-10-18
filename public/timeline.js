////////////////// il faut ajouter des variables mesure de debut et mesure de fin pour pouvoir looper ou on veux

var timeError = pas / 2;
var timelineHeight = 12;


function timeline(Id) {

  this.id = Id;
  this.xCmd;
  this.timeError;
  this.xCursor = sinotoX + 10;

  this.timelineNames = ["currentTime", "play", "loop", "bpm", "mesures", "temps"]; // parametres de la timeline : duree et position actuelle en seconde
  this.timelineParams = new Array(); // tableau a double entrée pour les differents parametre : frequence, volume, panning, loop, periode de Fade
  this.timelineParams[0] = [0, false, true, 120, 8, 4];
  this.bps = this.timelineParams[0][3] / 60;
  this.nbtoggles = this.timelineParams[0][4] * this.timelineParams[0][5];
  this.timeatom = (1 / this.bps) * 1000;
  this.looplength = this.timeatom * this.nbtoggles;
  this.xToggles = [];
  this.timelineParams[1] = [];
  for (var i = 0; i < this.nbtoggles; i++) {
    this.timelineParams[1][i] = [];
    this.timelineParams[1][i].push(i * this.timeatom); // params[1] correspond a un tableau a bouble entre qui contient les info des toggles
    this.timelineParams[1][i].push(false); // boolean hasbeentoggleds
    this.xToggles.push(map(this.timelineParams[1][i][0], 0, this.looplength, sinotoX + 10, sinotoX + sinotoWidth - 10));

  }

  this.refreshValues = function() {

    var lastsize = this.timelineParams[1].length;
    this.bps = this.timelineParams[0][3] / 60;
    this.nbtoggles = this.timelineParams[0][4] * this.timelineParams[0][5];
    this.timeatom = (1 / this.bps) * 1000;
    this.looplength = this.timeatom * this.nbtoggles;

    for (var i = 0; i < this.nbtoggles; i++) {
      if (i >= lastsize) {
        this.timelineParams[1][i] = [];
        this.timelineParams[1][i].push(i * this.timeatom);
        this.timelineParams[1][i].push(false);

      } else {
        this.timelineParams[1][i][0] = i * this.timeatom;
        this.timelineParams[1][i][1] = false;

      }
      this.xToggles.push(map(this.timelineParams[1][i][0], 0, this.looplength, sinotoX + 10, sinotoX + sinotoWidth - 10));

    }

  }

  this.reset = function() {
    for (var i = 0; i < this.nbtoggles; i++) {
      this.timelineParams[1][i].splice(2, this.timelineParams[1][i].length - 2);
    }
    this.timelineParams[0][1] = false;
    this.timelineParams[0][0] = 0;

  }



  this.aff = function(yTimeline) {

    fill(255);
    noStroke();
    textAlign(RIGHT);
    textSize(11);
    ///////////////////////////////////// affichage des toggles / interrupteur / temps
    var heigthToggle;
    stroke(255);
    //  noFill();
    //  rect(sinotoX + 10, yTimeline, sinotoWidth - 20, timelineHeight); // affichage du contour du looper

    line(sinotoX + sinotoWidth - 10, yTimeline, sinotoX + sinotoWidth - 10, yTimeline + timelineHeight);
    for (var i = 0; i < this.nbtoggles; i++) {
      if (i % this.timelineParams[0][5] == 0) heigthToggle = timelineHeight;
      else if (i % this.timelineParams[0][5] == this.timelineParams[0][5] / 2) heigthToggle = timelineHeight * 3 / 4;
      else {
        heigthToggle = timelineHeight / 2
      }
      this.xToggles[i] = map(this.timelineParams[1][i][0], 0, this.looplength, sinotoX + 10, sinotoX + sinotoWidth - 10);
      if (i % this.timelineParams[0][5] == 0) {
        noStroke();
        text(i / this.timelineParams[0][5], this.xToggles[i] + 12, yTimeline + heigthToggle)
      }
      stroke(255);
      if (this.timelineParams[1][i].length > 2) stroke(255, 0, 0);
      line(this.xToggles[i], yTimeline, this.xToggles[i], yTimeline + heigthToggle);
    }


    ////////////////////////////////////// afichage des infos générales du superlooper : dans la console en rouge à droite
    if (mouseX > sinotoX && mouseX < sinotoX + sinotoWidth &&
      mouseY > yTimeline && mouseY < yTimeline + timelineHeight) {

      noFill();
      stroke(255);
      //line(sinotoX + 10, yTimeline, sinotoX + sinotoWidth - 10, yTimeline);
      fill(0);
      rect(sinotoX + 10, sinotoY + sinotoHeight - consoleHeight + 12, sinotoWidth - 20, consoleHeight - 82);
      textAlign(RIGHT);
      textSize(14)
      noStroke();
      fill(255);

      text("sequencer n°" + this.id, sinotoX +sinotoWidth -20, sinotoY + sinotoHeight - consoleHeight + 40); // affichage du nom de la timeline

      textSize(11);

      for (var i = 1; i < this.timelineParams[0].length; i++) {

        text(this.timelineNames[i] + " : " + this.timelineParams[0][i], sinotoX +sinotoWidth- 20, sinotoY + sinotoHeight - consoleHeight + 12 * i + 52); // affichage des parametre de la timeline
      }

    }

    ///////////////////////////// affichage des infos des toggles au survol de la souris
    for (var i = 0; i < this.nbtoggles; i++) {

      var rectWidth = 50;
      if (this.timelineParams[1][i].length > 2) rectWidth = 220;

      if (abs(mouseX - this.xToggles[i]) < 4 && mouseY > yTimeline && mouseY < yTimeline + timelineHeight) {

        fill(255);
        noStroke();
        textAlign(RIGHT);
        textSize(13);
        text(int(i / this.timelineParams[0][5]) + "." + i % this.timelineParams[0][5], sinotoX +sinotoWidth- 20, sinotoY + sinotoHeight - consoleHeight + 130);
        //  text("isTicked: " + this.timelineParams[1][i][1], mouseX + 15, mouseY + 44 );
        fill(255, 0, 0);
        var xInfToggles = sinotoX + 20;
        var yInfToggles = sinotoY + sinotoHeight - consoleHeight + 40;
        textAlign(LEFT);
        textSize(11);

        if (this.timelineParams[1][i].length > 2) {

          for (var j = 2; j < this.timelineParams[1][i].length; j++) {

            text((j - 1) + ":" + this.timelineParams[1][i][j], xInfToggles, yInfToggles);
            yInfToggles += 12;
            if (j == 9 || j==17) {
              xInfToggles += 150;
              yInfToggles = sinotoY + sinotoHeight - consoleHeight + 40;
            }
          }
        } else {
          text("[empty]", xInfToggles, yInfToggles);
        }

      }
    }

    this.xCursor = map(int(this.timelineParams[0][0]), 0, this.looplength, sinotoX + 10, sinotoX + sinotoWidth - 10); // calcule de la position du curseur de temps

    if (this.timelineParams[0][1] == true) stroke(255, 0, 0);
    else {
      stroke(255);
    }

    line(this.xCursor, yTimeline, this.xCursor, yTimeline + timelineHeight); // affichage du curseur de temps

  }
}
