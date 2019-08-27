
function recorder() {

  this.init = function() {
    this.recorder = new p5.SoundRecorder();
    this.soundFile = new p5.SoundFile();
    this.recIsOn=false;
}

this.reco=function(){

if(this.recIsOn){
  this.recorder.stop();
  save(this.soundFile, "sinoto-"+day()+"_"+hour()+"_"+minute()+".wav");
  clavier.constructLog("stop recording", true);

}
else{
      this.recorder.record(this.soundFile);
      clavier.constructLog("start a new record", true);

}
this.recIsOn=!this.recIsOn;

}

this.aff=function(){
  fill(255,0,0);
  ellipse(sinotoX+sinotoWidth-20,sinotoY+sinotoHeight-90,9,9);

}

}
