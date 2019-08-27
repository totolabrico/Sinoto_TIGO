
function arpegiator() {

  this.arp = function(freqIn) {

    this.oriNote=findnote(freqIn)
    this.idMaxNote=0;
    this.idGroupNote=[0];

    while(this.idMaxNote<(nboscilo-4)-(nboscilo-4)/6){
      this.idMaxNote+=int((nboscilo-4)/6);
      this.idGroupNote.push(this.idMaxNote);
    }
    this.idGroupNote.push(nboscilo-4);
    console.log(this.idGroupNote);
    this.arpFreq=this.oriNote;

    for(var i=0;i<this.idGroupNote.length-1;i++){

      this.arpValues = [];
      this.arpValues.push(this.arpFreq);
      this.arpValues.push(Math.round((1000 / this.arpFreq) * 100) / 100);
      this.arpValues.push(Math.round(random(-1, 1) * 100) / 100);

      this.incfreq=random(2);
      this.fadefreq=random(1);

      commandes.analyse(this.idGroupNote[i]+"+"+int(this.idGroupNote[i+1]-1)+" f f "+this.fadefreq);
      commandes.analyse(this.idGroupNote[i]+"+"+int(this.idGroupNote[i+1]-1)+" "+this.arpValues[0]+"+"+this.incfreq+" "+this.arpValues[1]+" "+this.arpValues[2])
      this.arpFreq=float(this.arpFreq)+float(this.oriNote);
    }

  }

}
