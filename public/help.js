
var posInHelp=0;
var incYhelp=14;
var nbHelpLine=Math.round((sinotoHeight-30)/incYhelp);
var help = {

  aff: function(X,Y,wid,hei) {

	  fill(255,0,0);
	  //text("guide des commandes",X+100,Y+30);
    textSize(16);
    text("guide des commandes", X+100, sinotoY-30);
    textAlign(LEFT);
    textSize(11);
    fill(255);
	  	for (var i=posInHelp;i<nbHelpLine+posInHelp;i++){
		 text(helpContent[i],X+80,Y+20+(i-posInHelp)*incYhelp,wid-30,incYhelp*2);
	 }
	  //text(helpContent,X+80,Y+50,wid-50,hei-55);
  }
}
