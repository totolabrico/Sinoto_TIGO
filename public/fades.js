var lastMilli;
var milli = 0;
var pas; // nombre de milliseconde entre deux raffraichissement
var valueToReach; // valeur a atteindre : elle prend la valeur de 0 si j=1 (volume) et que params[5]=true :muteMode=true;
var valueFrom; // valeur de depart
var currentValue;

var fades = {
  doFade: function() {
    lastMilli = milli;
    milli = millis();
    pas = milli - lastMilli; // je recupere la difference en millis entre 2 rafraichissement du programme

for(var l=0;l<nblooper;l++){
    if(superlooper[l].timelineParams[0][1]==true){ // si la timeline est en mode play
      console.log(superlooper[l].timelineParams[0][1]);

      for(var i=0;i<superlooper[l].nbtoggles;i++){
        if(superlooper[l].timelineParams[0][0]>superlooper[l].timelineParams[1][i][0] && superlooper[l].timelineParams[1][i][1]==false){
          if(superlooper[l].timelineParams[1][i].length>2){
            for (var j=2;j<superlooper[l].timelineParams[1][i].length;j++){
            //  console.log(superlooper[l].timelineParams[1][i][j]);
            if(superlooper[l].timelineParams[0][0]-superlooper[l].timelineParams[1][i][0]<pas*2 ){
               commandes.analyse(superlooper[l].timelineParams[1][i][j]);
               saves.saveParams("backup",true);
             }
            }
          }
          superlooper[l].timelineParams[1][i][1]=true;
        }
      }
      superlooper[l].timelineParams[0][0]+=pas; // j'incremente son horloge
      if(superlooper[l].timelineParams[0][0]>=superlooper[l].looplength){
        for(var i=0;i<superlooper[l].nbtoggles;i++)superlooper[l].timelineParams[1][i][1]=false;
        superlooper[l].timelineParams[0][0]=0; // si son horloge dépasse la durée, je remet l'horloge à zero
        if(superlooper[l].timelineParams[0][2]==false)superlooper[l].timelineParams[0][1]=false; // si la loop n'est pas active alors je stope la timeline
      }
    }
  }

    for (var i = 0; i < nbinstru; i++) { // je verifie si il y a des fades a effectuer

      for (var j = 0; j < instrus[i].params.length; j++) { // j'effectue la boucle 3 ou 4 fois, une pour chaque parametre (freq, vol,pan, space)

        valueToReach = instrus[i].params[j][0]; // la valeur a atteindre correspond au premier parametre de params
        valueFrom = instrus[i].params[j][1]; // l'ancienne valeur
        currentValue = instrus[i].params[j][2]; // la valeur appliquée


        if (instrus[i].params[j][4] == 0) { // si la periode est nul alors je n'applique pas de fade
          if (currentValue != valueToReach) { // si la valeur joué n'est pas la meme que la valeur a atteindre
            instrus[i].params[j][2] = valueToReach; // alors elle prend sa valeur
          }

        } else { // si la periode n'est pas nulle alors je calcule la vitesse du fade et je l'applique
          if (valueToReach > currentValue && valueToReach > valueFrom ||
            valueToReach < currentValue && valueToReach < valueFrom) { // si la valeur actuelle "param[2]" n'a pas encore atteind la nouvelle valeur edité "param[0]"" alors je fade
            var speed = (valueToReach - valueFrom) / (instrus[i].params[j][4] * 1000);
            instrus[i].params[j][2] += speed * pas;
          } else if (currentValue != valueToReach) { // si j'ai dépasé la valeur d'arriver
            instrus[i].params[j][2] = valueToReach; // si le loop est eteind , je retourne a cette valeur
          } else if (instrus[i].params[j][3] == true) { //  sinon j'inverse les valeurs
            instrus[i].params[j][0] = valueFrom;
            instrus[i].params[j][1] = valueToReach;
          }
        }
        this.applyFade(i, j, currentValue) // j'applique le fade trouvé

      }

    }
  },
  applyFade: function(idInstru, idParam, Value) { // j'applique les parametre aux instrus

    if (instrus[idInstru].type == "noise") { // si il s'agit d'un oscilo
      if (idParam == 0) instrus[idInstru].filter.res(Value);
      if (idParam == 1) instrus[idInstru].filter.freq(Value);
      if (idParam == 2) instrus[idInstru].ins.amp(Value / 1000);
      if (idParam == 3) instrus[idInstru].ins.pan(Value);

    }
    if (instrus[idInstru].type == "sine") { // si il s'agit d'un bruit
      if (idParam == 0) instrus[idInstru].ins.freq(Value);
      if (idParam == 1) instrus[idInstru].ins.amp(Value / 1000);
      if (idParam == 2) instrus[idInstru].ins.pan(Value);

    }
  }
}
