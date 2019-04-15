function initJelly(){



 var geo = new THREE.IcosahedronGeometry(10,1);
 var mat = new THREE.MeshNormalMaterial();

  Jelly = new THREE.Object3D();//Mesh( geo , mat );


  Jelly.gui = new dat.GUI({autoPlace:false});

   
  var gHolder = document.createElement('div');

  var tHolder = document.createElement('h1');

  tHolder.innerHTML ='Jelly';

  gHolder.appendChild( tHolder );
  var guis = document.getElementById( 'GUI' );

  guis.appendChild( gHolder );
  gHolder.appendChild(Jelly.gui.domElement);


 




  bait = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 30 , 4 ),
    new THREE.MeshBasicMaterial({color:0xaec5d4 ,side:THREE.DoubleSide})
  );

  headMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 30.1 , 1 ),
    new THREE.MeshNormalMaterial({side:THREE.DoubleSide})
  );

  var c = [
    new THREE.Color( '#ed0000' ),
    new THREE.Color( '#fff000' ),
    new THREE.Color( '#ff8700' ),
    new THREE.Color( '#e82626' ),
  ];


  var col1 = new THREE.Vector3( c[0].r , c[0].g , c[0].b );
  var col2 = new THREE.Vector3( c[1].r , c[1].g , c[1].b );
  var col3 = new THREE.Vector3( c[2].r , c[2].g , c[2].b );
  var col4 = new THREE.Vector3( c[3].r , c[3].g , c[3].b );
  /*var friends = new FurryGroup( Jelly , 'friends' , audioController , 10 ,{
    center: center,
    bait: bait,
    color1: col1,
    color2: col2,
    color3: col3,
    color4: col4
    
  });*/


 Jelly.tails = [];
 Jelly.bait = bait;
 Jelly.headMesh = headMesh;

 bait.position.x = 1000;
 headMesh.position.x = 1000;


    bait.velocity = new THREE.Vector3();
    headMesh.velocity = new THREE.Vector3();

    bait.oldPosition = new THREE.Vector3();
    headMesh.oldPosition = new THREE.Vector3();

 scene.add(bait);
 //scene.add(headMesh);



    Jelly.audioAmount = { type:"f" , value: .5 };
    Jelly.audioPower = { type:"f" , value: 1. };


    Jelly.d_spA = { type:"f" , value: 5.1 }
    Jelly.f_spA = { type:"f" , value: .2 }

    Jelly.d_bA = { type:"f" , value: 21.1 }
    Jelly.f_bA = { type:"f" , value: .1  }
  
    Jelly.d_bR = { type:"f" , value: 100.1 }
    Jelly.f_bR = { type:"f" , value: .018  }
    
    Jelly.d_sA = { type:"f" , value: 58.1 }
    Jelly.f_sA = { type:"f" , value: .5  }
    
    Jelly.d_sR = { type:"f" , value: 88.1 }
    Jelly.f_sR = { type:"f" , value: .3  }
    
    Jelly.d_sSA = { type:"f" , value: 12.1 }
    Jelly.f_sSA = { type:"f" , value: .5  }
    
    Jelly.d_sSR = { type:"f" , value: 100.1 }
    Jelly.f_sSR = { type:"f" , value: .2  }

    addGui();


    Jelly.leaderVel = { type:"v3", value: headMesh.velocity };

    var allUniforms = {

      leaderVel             : Jelly.leaderVel,
      dist_spineAttract     : Jelly.d_spA,
      force_spineAttract    : Jelly.f_spA ,
      dist_bundleAttract    : Jelly.d_bA,
      force_bundleAttract   : Jelly.f_bA,
      dist_bundleRepel      : Jelly.d_bR,
      force_bundleRepel     : Jelly.f_bR,
      dist_subAttract       : Jelly.d_sA,
      force_subAttract      : Jelly.f_sA,
      dist_subRepel         : Jelly.d_sR,
      force_subRepel        : Jelly.f_sR,
      dist_subSubAttract    : Jelly.d_sSA,
      force_subSubAttract   : Jelly.f_sSA,
      dist_subSubRepel      : Jelly.d_sSR,
      force_subSubRepel     : Jelly.f_sSR,
      dT                    : G.uniforms.dT,
      audioPower            : Jelly.audioPower,
      audioAmount           : Jelly.audioAmount,

    }


    var mainUniforms = {
      dist_spineAttract     : { type:"f", value:2},
      force_spineAttract    : { type:"f", value:.06},
      dist_bundleAttract    : { type:"f", value:300},
      force_bundleAttract   : { type:"f", value:.2},
      dist_bundleRepel      : { type:"f", value:300},
      force_bundleRepel     : { type:"f", value:.2},
      dist_subAttract       : { type:"f", value:300},
      force_subAttract      : { type:"f", value:.2},
      dist_subRepel         : { type:"f", value:300},
      force_subRepel        : { type:"f", value:.2},
      dist_subSubAttract    : { type:"f", value:300},
      force_subSubAttract   : { type:"f", value:.2},
      dist_subSubRepel      :{ type:"f", value:300},
      force_subSubRepel     :{ type:"f", value:.2},
      dT                    : G.uniforms.dT,
      audioPower            : Jelly.audioPower,
      audioAmount           : Jelly.audioAmount,
      leaderVel             : Jelly.leaderVel,

    }

    Jelly.simulationUniforms = allUniforms;

  Jelly.head = new FurryHead( Jelly , headMesh ,{
  });


  Jelly.mainTail = new FurryTail( Jelly , headMesh , {
    simulationUniforms: mainUniforms,
    sim:shaders.ss.mainTail,
    size: 32,
    particleSize:40
  });



  Jelly.mainTail.physicsRenderer.simulation.uniforms["t_posMain"] = { type:"t", value:null}
  Jelly.head.physicsRenderer.addBoundTexture(Jelly.mainTail.physicsRenderer , "t_posMain" , "output");



  for(var i = 0; i < 6; i++ ){
    var tail = new FurryTail( Jelly , headMesh ,{
      simulationUniforms: allUniforms,
      lineWidth:.2,
      particleSize:3
    });
    Jelly.tails.push( tail );
  }

  for(var i = 0; i < 6; i++ ){
      
      Jelly.tails[i].physicsRenderer.simulation.uniforms["t_posMain"] = { type:"t", value:null}
       Jelly.tails[i].physicsRenderer.simulation.uniforms["t_posHead"] = { type:"t", value:null}
     
      Jelly.tails[i].physicsRenderer.simulation.uniforms["tailID"] = { type:"f", value:i}
      
      Jelly.mainTail.physicsRenderer.addBoundTexture(Jelly.tails[i].physicsRenderer , "t_posMain" , "output");
    Jelly.head.physicsRenderer.addBoundTexture(Jelly.tails[i].physicsRenderer , "t_posHead" , "output");

  }



  Jelly.mainTail.physicsRenderer.addBoundTexture( Jelly.head.physicsRenderer , 't_column' , 'output' );


  Jelly.init = function(){
    
    this.added = true;
    scene.add( this );

    this.add( this.head.mesh );
    //this.head.mesh.scale.multiplyScalar( .001 );


    for( var i = 0; i < this.tails.Length; i++ ){
      //this.add( this.tails[i].line);
     // this.add( this.tails[i].physicsParticles);
    }

    this.add( this.mainTail.line );
    this.add( this.mainTail.physicsParticles );

    
    for( var i = 0; i < this.tails.length; i++ ){
      this.tails[i].activate();
    }

  }

  Jelly.updateBaitPos = function(pos){

    v1.copy(pos).sub(camera.position);
    v1.normalize();
    v1.multiplyScalar(-100);
    v1.add(pos);
    bait.position.copy(v1);
  }

  

  lastUpdate = 0;
  Jelly.update = function(){


    var p = camera.position.clone();

  
    for( var i = 0; i < loopList.length; i++ ){
      if( 
        headMesh.position.clone().sub( POLYS[loopList[i]].mesh.position ).length()  < 30 && 
        POLYS[loopList[i]].active == true
      ){
        POLYS[loopList[i]].select();
      }
    }

      //console.log( head.position.clone().sub( bait.position ).length() );
    if( headMesh.position.clone().sub( bait.position ).length() < 30 ){


      if( bait.searching != null ){
        bait.searching.select();
      }

      var activated = [];
      
      for( var i = 0; i < loopList.length; i++ ){
        if( POLYS[loopList[i]].active == true ){
          activated.push( POLYS[loopList[i]] );
        }
      }

      if( activated.length > 0 ){

        bait.searching = activated[Math.floor(Math.random() * activated.length)]
        this.updateBaitPos(bait.searching.mesh.position);
      }else{
        bait.searching = null;

        var a = Math.random() * 2 * 3.14;
        v2.x = window.innerWidth * Math.sin( a );
        v2.y = window.innerHeight * Math.cos( a );
        v2.z = 300;
        this.updateBaitPos(v2);
        //this.updateBaitPos(v2.copy(camera.position).add( camera.position ));

       // this.updateBaitPos(POLYS[loopList[Math.floor(Math.random() * loopList.length)]].mesh.position);
      }

    }


  
    headMesh.oldPosition.copy( headMesh.position );

    headMesh.velocity.add( bait.position.clone().sub(headMesh.position).normalize().multiplyScalar(.1));
    headMesh.velocity.multiplyScalar( .9 );
    headMesh.position.add( headMesh.velocity.clone().multiplyScalar( 1.5 + 1.3*Math.sin(G.uniforms.time.value * 4)) );

   // console.log( bait.velocity);
    this.head.update();

    for( var i = 0; i < this.tails.length; i++ ){
      this.tails[i].updateTail();
      this.tails[i].updatePhysics();
    }

    this.mainTail.updateTail();
      this.mainTail.updatePhysics();

  }

 ////////////////// scene.add( Jelly );

}


function addGui(){

      var folder = Jelly.gui.addFolder( "Jelly" );
      var tailParams = folder.addFolder( 'Tail Physics' );
      var tailColor = folder.addFolder( 'Render Tail / Particles' );


      tailParams.add( Jelly.audioPower , 'value' , 0 , 3 ).name( 'audioPower' );
      tailParams.add( Jelly.audioAmount , 'value' , 0 , 1  ).name( 'audioAmount' );

      tailParams.add( Jelly.d_spA, 'value' , 0 , 10  ).name( 'dist_spineAttract' );
      tailParams.add( Jelly.f_spA, 'value' , -0.1 , .5  ).name( 'force_spineAttract' );
      
      tailParams.add( Jelly.d_bA,  'value' , 0 , 100  ).name( 'dist_bundleAttract' );
      tailParams.add( Jelly.f_bA,  'value' , -0.1, .5  ).name( 'force_bundleAttract' );
      tailParams.add( Jelly.d_bR,  'value' , 0 , 100  ).name( 'dist_bundleRepel' );
      tailParams.add( Jelly.f_bR,  'value' , -0.1 , .05 ).name( 'force_bundleRepel' );
      
      tailParams.add( Jelly.d_sA,  'value' , 0 , 100  ).name( 'dist_subAttract' );
      tailParams.add( Jelly.f_sA,  'value' , -0.1 , .5  ).name( 'force_subAttract' );
      tailParams.add( Jelly.d_sR,  'value' , 0 , 100  ).name( 'dist_subRepel' );
      tailParams.add( Jelly.f_sR,  'value' , -0.1 , .2  ).name( 'force_subRepel' );
      
      tailParams.add( Jelly.d_sSA, 'value' , 0 , 100  ).name( 'dist_subSubAttract' );
      tailParams.add( Jelly.f_sSA, 'value' , -0.1 , .5  ).name( 'force_subSubAttract' );
      tailParams.add( Jelly.d_sSR, 'value' , 0 , 100  ).name( 'dist_subSubRepel' );
      tailParams.add( Jelly.f_sSR, 'value' , -0.1 , .2  ).name( 'force_subSubRepel' );


     /* tailColor.add( this , 'particleSize' , 0 , 10 ).onChange( function(v){
        for( var i = 0; i < this.tails.length; i++ ){
          var fT = this.tails[i];
          fT.particleUniforms.particleSize.value = v;
        }
      }.bind( this ));

      var c ={ 
        spineColor: '#ff0000',
        subColor:   '#eeaa00',
        subSubColor:'#0000ff',
        bundleColor:'#999999' 
      }

      tailColor.addColor( c , 'spineColor' ).onChange( function( value ){

       
        var col = new THREE.Color( value );
        console.log( col.r );
        for( var i = 0; i < this.tails.length; i++ ){

          var fT = this.tails[i];

          fT.color1.x = col.r;
          fT.color1.y = col.g;
          fT.color1.z = col.b;

        }
      
      }.bind( this ));

      tailColor.addColor( c , 'subColor' ).onChange( function( value ){

        var col = new THREE.Color( value );
        for( var i = 0; i < this.tails.length; i++ ){

          var fT = this.tails[i];

          fT.color2.x = col.r;
          fT.color2.y = col.g;
          fT.color2.z = col.b;

        }
      
      }.bind( this ));


      tailColor.addColor( c , 'subSubColor' ).onChange( function( value ){

        var col = new THREE.Color( value );
        for( var i = 0; i < this.tails.length; i++ ){

          var fT = this.tails[i];

          fT.color3.x = col.r;
          fT.color3.y = col.g;
          fT.color3.z = col.b;

        }
      
      }.bind( this ));

      tailColor.addColor( c , 'bundleColor' ).onChange( function( value ){

        var col = new THREE.Color( value );
        for( var i = 0; i < this.tails.length; i++ ){

          var fT = this.tails[i];
          fT.color4.x = col.r;
          fT.color4.y = col.g;
          fT.color4.z = col.b;
        }
      
      }.bind( this ));*/
}
