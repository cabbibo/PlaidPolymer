

function initPoly(){

  for( var i = 0; i < loopList.length; i++ ){

    POLYS[loopList[i]] = new Poly( i, LOOPS[loopList[i]] );

    console.log(POLYS[loopList[i]]);

  }

  
}

function Poly( id , note ){

  this.note = note;
  this.note.gain.gain.value = 0;
  this.id = id;

  this.active = false;

  this.mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 40.1 , 2 ),
      new THREE.ShaderMaterial({
      uniforms:{
        t_audio:{type:"t",value:this.note.texture},
        time:G.uniforms.time,
        jelly:{type:"v3",value:headMesh.position}
      },
      vertexShader: shaders.vs.poly,
      fragmentShader: shaders.fs.poly,
      flatShading:true
    })
  );

  this.bgMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 40.1 , 2 ),
      new THREE.ShaderMaterial({
      uniforms:{
        t_audio:{type:"t",value:this.note.texture},
        time:G.uniforms.time,
        jelly:{type:"v3",value:headMesh.position}
      },
      vertexShader: shaders.vs.polyOutline,
      fragmentShader: shaders.fs.polyOutline,
      flatShading:true
    })
  );


  this.mesh.add(this.bgMesh);



  this.mesh.position.y = (Math.random()-.5) * screen.height;
  this.mesh.position.x = (Math.random()-.5) * screen.width;
  this.mesh.position.z = (Math.random()-.5) * 100;

  this.mesh.material.map = this.note.texture;

  this.mesh.hoverOver = function(){
    this.hoverOver();
  }.bind( this );

  this.mesh.hoverOut = function(){
    this.hoverOut();
  }.bind( this );

  this.mesh.select = function(){
    this.select();
  }.bind( this );

  this.mesh.deselect = function(){
    this.deselect();
  }.bind( this );

  objectControls.add( this.mesh );

}

Poly.prototype = {

  update:function(){

    //this.bgMesh.position.copy( this.mesh.position );
    this.mesh.rotation.x += .01 * Math.sin(this.id * 10);
    this.mesh.rotation.y += .01 * Math.sin(this.id * 10+20);
    this.mesh.rotation.z += .01 * Math.sin(this.id * 10+40);


   
  //this.mesh.add(this.bgMesh);
  },


  play:function(){
    this.note.play();
    scene.add( this.mesh );
  },

  activate:function(){
    this.active = true;
    this.note.gain.gain.value = 1;
  },

  deactivate: function(){
    this.active = false
    this.note.gain.gain.value = 0;
  },


  hoverOver: function(){
    
    if( this.active == false ){
      this.mesh.scale.x = 1.1;
      this.mesh.scale.y = 1.1;
      this.mesh.scale.z = 1.1;
    }

    console.log( this);
  },


  hoverOut: function(){

    if( this.active == false ){
      this.mesh.scale.x = 1;
      this.mesh.scale.y = 1;
      this.mesh.scale.z = 1;
    }


    console.log( this);
  },

  select:function(){

  if( this.active == false ){
    this.mesh.scale.x = 1.5;
    this.mesh.scale.y = 1.5;
    this.mesh.scale.z = 1.5;
    this.activate();

    Jelly.updateBaitPos( this.mesh.position );
    Jelly.searching = this;

  }else{
       this.mesh.scale.x = 1;
    this.mesh.scale.y = 1;
    this.mesh.scale.z = 1;
    this.deactivate();
  }
  },

  deselect:function(){


  }



}



