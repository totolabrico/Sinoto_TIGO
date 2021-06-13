
function arpegiator() {

  this.arp = function(freqIn) {

    this.oriNote=findnote(freqIn)
    this.idMaxNote=0;
    this.idGroupNote=[0];

    while(this.idMaxNote<nboscilo-nboscilo/3-nboscilo/6){
      this.idMaxNote+=int((nboscilo/3)/6);
      this.idGroupNote.push(this.idMaxNote);
    }
    this.idGroupNote.push(nboscilo-nboscilo/3);
    console.log(this.idGroupNote);
    this.arpFreq=this.oriNote;

    for(var i=0;i<this.idGroupNote.length-1;i++){

      this.arpValues = [];
      this.arpValues.push(Math.round(100/this.arpFreq)*100);
      this.arpValues.push(Math.round((100 / this.arpFreq) * 3000) / 100);
      this.arpValues.push(Math.round(random(-1, 1) * 100) / 100);

      this.incfreq=Math.round(100/random(2));
      this.fadefreq=Math.round(100/random(1));

    /*  commandes.analyse(this.idGroupNote[i]+"+"+int(this.idGroupNote[i+1]-1)+" f f "+this.fadefreq);*/
      commandes.analyse(this.idGroupNote[i]+"+"+int(this.idGroupNote[i+1]-1)+" "+this.arpValues[0]+"+"+this.incfreq+" "+this.arpValues[1]+" "+this.arpValues[2])
      this.arpFreq=float(this.arpFreq)+float(this.oriNote);
    }

  }

}
