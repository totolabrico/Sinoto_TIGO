var saves = {

  //paramFile: "", // phrase actuelle en construction
  saveParams: function(name, all) {
    this.paramFile = "";
    this.name=name;

    for (var i = 0; i < nbinstru; i++) {
      for (var j = 0; j < instrus[i].params.length; j++) {
        this.paramFile += instrus[i].params[j];
        this.paramFile += "/";
      }
      this.paramFile = this.paramFile.substring(0, this.paramFile.length - 1);
      this.paramFile += "$";
    }

    if (all) {
      this.name="set_"+name;

      for (var i = 0; i < nblooper; i++) {
        this.paramFile += superlooper[i].timelineParams[0];
        this.paramFile += "/";
        for (var j = 0; j < superlooper[i].timelineParams[1].length; j++) {
          //console.log(superlooper[i].timelineParams[1][j])
          for (var k = 0; k < superlooper[i].timelineParams[1][j].length; k++) {
            //console.log(superlooper[i].timelineParams[1][j][k])
            this.paramFile += superlooper[i].timelineParams[1][j][k];
            this.paramFile += "@";
          }
          this.paramFile = this.paramFile.substring(0, this.paramFile.length - 1);
          this.paramFile += ","; // cesure pour les parametres des toggles
        }
        this.paramFile = this.paramFile.substring(0, this.paramFile.length - 1);
        this.paramFile += "$";
      }
      if(name!="backup")clavier.constructLog("the set have been saved, to load it: load set "+name, true);

    }
    else{
      clavier.constructLog("oscilos parameters have been saved, to load parameters: load "+name, true);

    }

    console.log("save is done");
    socket.emit('save', this.name, this.paramFile); ///////////////////////////////////////// A DECOMMNETER SOCKET !!!!
  },

  loadFile: function(dataIn, all) {


    var allin = new Array(nbinstru);

    for (var i = 0; i < nbinstru; i++) allin[i] = [];

    var backin = [];
    var idline = 0;
    backin[idline] = "";

    for (var i = 0; i < dataIn.length; i++) {
      if (dataIn[i] == "$") {
        idline++;
        backin[idline] = "";
      } else {
        backin[idline] += dataIn[i];
      }
    }

    backin.pop(); //// je supprime la ligne en trop qui est fabriquer par la boucle ci dessus

    for (var i = 0; i < backin.length; i++) {
      backin[i] = backin[i].split("/");
      for (var j = 0; j < backin[i].length; j++) {
        backin[i][j] = backin[i][j].split(",");
      }
    }

//////////////////////////// je récupère les valeurs des instruments
    for (var i = 0; i < nbinstru; i++) {
      for (var j = 0; j < instrus[i].params.length; j++) {
        for (var k = 0; k < instrus[i].params[j].length; k++) {
          //  console.log(typeof(instrus[i].params[j][k]));
          if (typeof(instrus[i].params[j][k]) == "number") {
            instrus[i].params[j][k] = float(backin[i][j][k]);
          } else if (typeof(instrus[i].params[j][k]) == "boolean") {
            if (backin[i][j][k] == "false") instrus[i].params[j][k] = false;
            if (backin[i][j][k] == "true") instrus[i].params[j][k] = true;
          }
        }
      }
    }

    if (all) {//////////////////////////// je récupère les valeurs des timelines

      for (var i = 0; i < nblooper; i++) {
        for (var j = 0; j < superlooper[i].timelineParams[0].length; j++) {
        //  console.log(superlooper[i].timelineParams[0][j]);
        //  console.log(backin[i + nbinstru][0][j]);
        //  console.log(superlooper[i].timelineParams[0][j]);

          var val = typeof(superlooper[i].timelineParams[0][j]);
          switch (val) {
            case 'number':
            superlooper[i].timelineParams[0][j] = float(backin[i+nbinstru][0][j]);
              break;
            case 'boolean':
            if (backin[i+nbinstru][0][j] == "false") superlooper[i].timelineParams[0][j] = false;
            if (backin[i+nbinstru][0][j] == "true") superlooper[i].timelineParams[0][j] = true;
              break;
            default:
          //  console.log(val);
          }
        }
        //   console.log(superlooper[i].timelineParams[1]);
      //    console.log(backin[i + nbinstru][1]);

        for (var j = 0; j < backin[i + nbinstru][1].length; j++) {
      //    console.log(superlooper[i].timelineParams[1][j]);
      //    console.log(backin[i + nbinstru][1][j]);
          superlooper[i].timelineParams[1][j] = split(backin[i + nbinstru][1][j], '@');
          superlooper[i].timelineParams[1][j][0] = float(superlooper[i].timelineParams[1][j][0]);
          if(superlooper[i].timelineParams[1][j][1]=="true") superlooper[i].timelineParams[1][j][1]=true;
          if(superlooper[i].timelineParams[1][j][1]=="false") superlooper[i].timelineParams[1][j][1]=false;
          //  superlooper[i].timelineParams[0][j] = backin[i + nbinstru][0][j];
        }
        superlooper[i].refreshValues();

      }
    }

  }
}
