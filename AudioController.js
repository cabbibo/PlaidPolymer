
function AudioController(){

  try {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
  }catch(e) {
    alert( 'WEB AUDIO API NOT SUPPORTED' );
  }
 
  this.ctx      = new AudioContext();

  this.mute = this.ctx.createGain();
  this.gain     = this.ctx.createGain();
  this.analyzer = this.ctx.createAnalyser();

  this.analyzer.frequencyBinCount = 1024;
  this.analyzer.array = new Uint8Array( this.analyzer.frequencyBinCount );

  this.texture = new AudioTexture( this.analyzer );
  
  this.gain.connect( this.analyzer );
  this.analyzer.connect( this.mute );
  this.mute.connect( this.ctx.destination );


  this.updateArray = [];
  this.notes = [];
  this.loops = [];


  this.noteInput = this.ctx.createGain();
  this.loopInput = this.ctx.createGain();

  this.noteInput.connect( this.gain );
  this.loopInput.connect( this.gain );

}


AudioController.prototype.update = function(){

  this.analyzer.getByteFrequencyData( this.analyzer.array );

  this.texture.update();

  for( var i = 0; i < this.updateArray.length; i++ ){

    this.updateArray[i]();

  }

}


AudioController.prototype.addToUpdateArray = function( callback ){

  this.updateArray.push( callback );

}

AudioController.prototype.removeFromUpdateArray = function( callback ){

  for( var i = 0; i< this.updateArray.length; i++ ){

    if( this.updateArray[i] === callback ){

      this.updateArray.splice( i , 1 );
      console.log( 'SPLICED' );

    }

  }

}


