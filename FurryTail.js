  
  var FURRY_LINE_GEO , FURRY_PARTICLE_GEO , FURRY_POSITIONS_TEXTURE ;

  function FurryTail( Jelly , bait , params ){

    //G.renderer.render( G.scene , G.camera );
 
    this.page = Jelly;

    this.bait = bait;

    this.params = _.defaults( params || {} , {

      id:                 Math.floor( Math.random() * 100000),
      type:               'test',
      
      size:               32,
      sim:                shaders.ss.furryTail,
      simulationUniforms: {},
      leader:             bait,
      lineGeo:            this.createLineGeo,

      particleSprite:     THREE.ImageUtils.loadTexture('icons/sprite.png'),
      color1:             new THREE.Vector3( 1 , 1 , 1 ),
      color2:             new THREE.Vector3( 1 , 1 , 1 ),
      color3:             new THREE.Vector3( 1 , 1 , 1 ),
      color4:             new THREE.Vector3( 1 , 1 , 1 ),
      
      // Interaction with other tails
      physicsParams:      {
        forceMultiplier:  1,
        maxVel:           2,
        dampening:      .99999
      },
    
      particleSize: 10.,
      //iriLookup: THREE.ImageUtils.loadTexture('img/iri/rainbow.png')

    });
    //this.params.simulationUniforms = Jelly.simulationUniforms;

    this.active = false;

    this.setParams( this.params );

    this.lineGeo;
   
    if( !FURRY_LINE_GEO){ 
      this.lineGeo = this.createLineGeo();
      FURRY_LINE_GEO = this.lineGeo;
    }else{
      this.lineGeo = FURRY_LINE_GEO;//this.createLineGeo();
    }

    this.lineUniforms = {
      t_pos:{ type:"t" , value:null },
      t_oPos:{ type:"t" , value:null },
      t_ooPos:{ type:"t" , value:null },
      //t_audio:{ type:"t" , value:null },
      t_audio: G.uniforms.t_audio,
      color1: { type:"v3" , value:this.color1 },
      color2: { type:"v3" , value:this.color2 },
      color3: { type:"v3" , value:this.color3 },
      color4: { type:"v3" , value:this.color4 },
    }

    this.particleUniforms = {
      t_pos:{ type:"t" , value:null },
      t_oPos:{ type:"t" , value:null },
      t_ooPos:{ type:"t" , value:null },
      t_sprite:{ type:"t", value:null },
      //t_audio:{ type:"t" , value:null },
      t_audio: G.uniforms.t_audio,

      particleSize: { type:"f" , value: this.particleSize },
      dpr: G.uniforms.dpr,
      color1: { type:"v3" , value:this.color1 },
      color2: { type:"v3" , value:this.color2 },
      color3: { type:"v3" , value:this.color3 },
      color4: { type:"v3" , value:this.color4 },
    }

   
    // Other Tails of the same type
    this.brethren = [];
  
    // Physics
    this.position   = this.leader.position.clone();
    this.velocity   = new THREE.Vector3();  
    this.force      = new THREE.Vector3();  


    this.velocity.normalize();
    this.velocity.multiplyScalar( this.physicsParams.maxVel );

    this.distanceForces = [];
    this.distanceInverseForces = [];
    this.distanceInverseSquaredForces = [];
    this.distanceSquaredForces = [];
    this.normalForces = [];
    this.steeringForces = [];
    this.springForces = [];
    this.collisionForces = [];


    this.renderer     = renderer; 

    this.physicsRenderer = new PhysicsRenderer( 
      this.size,
      this.sim,
      renderer 
    );

    this.particleUniforms.t_sprite.value = this.particleSprite;

 
    var mat = new THREE.ShaderMaterial({
      uniforms: this.particleUniforms,
      vertexShader: shaders.vs.furryParticles,
      fragmentShader: shaders.fs.furryParticles,
      transparent: true,
      depthWrite: false
    })

    //var geo = ParticleUtils.createLookupGeometry( this.size );

    this.particleGeometry;
     if( !FURRY_PARTICLE_GEO ){ 
      this.particleGeo = ParticleUtils.createLookupGeometry( this.size ); 
      FURRY_PARTICLE_GEO = this.particleGeo;
    }else{
      this.particleGeo = FURRY_PARTICLE_GEO;//this.createLineGeo();
    }


  
    this.physicsParticles  = new THREE.PointCloud( this.particleGeo , mat );
    this.physicsParticles.frustumCulled = false;
    var pR = this.physicsRenderer;
    
    pR.addBoundTexture( this.physicsParticles , 't_pos' , 'output' );
    pR.addBoundTexture( this.physicsParticles , 't_oPos' , 'oOutput' );
    pR.addBoundTexture( this.physicsParticles , 't_ooPos' , 'ooOutput' );
 
    var lineMat = new THREE.ShaderMaterial({
      uniforms: this.lineUniforms,
      vertexShader: shaders.vs.furryTail,
      fragmentShader: shaders.fs.furryTail,   
      linewidth: 2
    });

    this.line = new THREE.Line( this.lineGeo , lineMat );
    this.line.type = THREE.LinePieces;

    this.line.frustumCulled = false;
    
    pR.addBoundTexture( this.line , 't_pos' , 'output' );
    pR.addBoundTexture( this.line , 't_oPos' , 'oOutput' );
    pR.addBoundTexture( this.line , 't_ooPos' , 'ooOutput' );




    var mesh = new THREE.Mesh( new THREE.SphereGeometry( 1 ) );
    //var pTexture = ParticleUtils.createPositionsTexture( this.size , mesh );

    this.pTexture;
    if( !FURRY_POSITIONS_TEXTURE ){ 
      var mesh = new THREE.Mesh( new THREE.SphereGeometry( Math.random() ) ); 
      this.pTexture = ParticleUtils.createPositionsTexture( this.size , mesh ); 
      FURRY_POSITIONS_TEXTURE = this.pTexture;
    }else{
      this.pTexture = FURRY_POSITIONS_TEXTURE;//this.createLineGeo();
    }

    //if( this === G.mani ){
    this.physicsRenderer.reset( this.pTexture );

    //this.physicsRenderer.addDebugScene( scene );
    //}
    this.applyUniforms();


   // this.tip = new THREE.Mesh( new THREE.BoxGeometry(10,10,10) , new THREE.MeshNormalMaterial());

   // scene.add( this.tip );


    //this.physicsRenderer.addBoundTexture( this.head.physicsRenderer , 't_column' , 'output' );


    //G.renderer.render( G.scene , G.camera );

  }


  FurryTail.prototype.setColors = function( color1 , color2 , color3 ){



  }


  FurryTail.prototype.activate = function(){

    this.page.add( this.physicsParticles );
    this.page.add( this.line );
    //this.page.add( this.leader );  

    this.active = true;

  }

  FurryTail.prototype.deactivate = function(){

    console.log('HELLO');
    this.page.scene.remove( this.physicsParticles );
    this.page.scene.remove( this.line );
    //this.page.scene.remove( this.leader );

    this.active = false;

  }



  FurryTail.prototype.updatePhysics = function(){


    this.force.set( 0 , 0 , 0);


    this.velocity = this.position.clone().sub(this.bait.position);


    this.position.copy( this.bait.position );

    ///this.tip.position.copy( this.position );


  }

  FurryTail.prototype.updateTail = function(){
    //console.log( this.position );
    this.physicsRenderer.update();
  }


  FurryTail.prototype.addDebugScene = function(){

    this.physicsRenderer.addDebugScene( scene );

  }


  FurryTail.prototype.applyUniforms = function(){

    var uO = this.simulationUniforms;

    for( var propt in uO ){
      this.physicsRenderer.setUniform( propt , uO[propt] );
    }

    this.physicsRenderer.setUniform( 't_audio' ,G.uniforms.t_audio);

    this.physicsRenderer.setUniform( 'leader' , { 
      type:"v3" , 
      value: this.position
    });

   // this.physicsRenderer.setUniform( 'flow' , { type:"v3" , value: G.flow } );
    this.physicsRenderer.setUniform( 'dT' , G.uniforms.dT );
    

  }



  FurryTail.prototype.setParams = function( params ){
    for( propt in params ){
      var param = params[propt];
      // To make sure that we are passing in objects
      if( typeof param === 'object' ){
        if( this[propt] ){
          for( propt1 in param ){
            var param1 = param[propt1]
            if( typeof param === 'object' ){
              if( this[propt][propt1] ){
                for( propt2 in param1 ){
                  var param2 = param[propt2]
                  this[propt][propt1][propt2] = param2
                }
              }else{
                this[propt][propt1] = param1;
              }
            }else{
              this[propt][propt1] = param[propt1]
            }
          }
        }else{
          this[propt] = param
        }
      }else{
        this[propt] = param
      }
    }
  }
  



  FurryTail.prototype.updateBrethren = function(){

    this.brethren = this.group.tails;

  }



  FurryTail.prototype.createLineGeo = function(){

    var lineGeo = new THREE.BufferGeometry();

    var posBuffer = new THREE.BufferAttribute(  new Float32Array( 32 * 32 * 2 * 3 ) , 3 );
    var colBuffer = new THREE.BufferAttribute(  new Float32Array( 32 * 32 * 2 * 3 ) , 3 );
     
    lineGeo.addAttribute( 'position', posBuffer );
    lineGeo.addAttribute( 'color'   , colBuffer );
    
    var positions = lineGeo.getAttribute( 'position' ).array;
    var colors = lineGeo.getAttribute( 'color' ).array;
    var size = 1 / this.params.size;
    var hSize = size / 2;

    for( var i = 0; i < this.params.size; i ++ ){

      // Spine 
      var index = i * 3;

      var p1 = index * 2;
      var p2 = index * 2 + 3;

      positions[ p1 ] = 0 * size ;
      positions[ p1 + 1 ] = i * size ;
      positions[ p1 + 2 ] = 1;

      positions[ p2 ] = 0 * size ;
      positions[ p2 + 1 ] = (i + 1) * size;
      positions[ p2 + 2 ] = 1;

      colors[ p1 ]      = i;
      colors[ p1 + 1 ]  = 0;
      colors[ p1 + 2 ]  = 0;

      colors[ p2 ]      = i + 1;
      colors[ p2 + 1 ]  = 0;
      colors[ p2 + 2 ]  = 0;

      // Sub
      for( var j = 0; j < 4; j++ ){

        // Start these positions after all of our indices
        var startingIndex = this.params.size * 3;

        var columnStartingIndex = startingIndex + ( this.params.size * 3 * j);

        var index = (i * 3) + columnStartingIndex;

        var p1 = index * 2;
        var p2 = index * 2 + 3;
        

        positions[ p1 ] = 0 * size;
        positions[ p1 + 1 ] = i * size ;
        positions[ p1 + 2 ] = 1;

        positions[ p2 ]     = ( j + 1) * size;
        positions[ p2 + 1 ] = i  * size;
        positions[ p2 + 2 ] = .1;

        colors[ p1 ]      = (i +1) / size;
        colors[ p1 + 1 ]  = 0;
        colors[ p1 + 2 ]  = 0;

        colors[ p2 ]      = (i +1) / size;
        colors[ p2 + 1 ]  = 1;
        colors[ p2 + 2 ]  = 0;

        //positions[ i + 3 ] = Math.random() * 20;
    
      }


      // Sub Sub
      for( var j = 0; j < 4; j ++ ){
        for( var k = 0; k < 4; k++ ){

          var startingIndex = 5 * this.params.size * 3;
          var groupStartingIndex = startingIndex + ( this.params.size * 3 * 4 * (j) );
          var columnStartingIndex = groupStartingIndex + ( this.params.size * 3 * (k) );

          var index = ( i *3 ) + columnStartingIndex;

          var p1 = index * 2;
          var p2 = index * 2 + 3;

          positions[ p1 ] = ( j + 1 ) * size;
          positions[ p1 + 1 ] = i * size;
          positions[ p1 + 2 ] = .1;

          positions[ p2 ]     = ( (j * 4) + 5 + k) * size;
          positions[ p2 + 1 ] = i * size;
          positions[ p2 + 2 ] = .1;


          colors[ p1 ]      = i;
          colors[ p1 + 1 ]  = 1;
          colors[ p1 + 2 ]  = 0;

          colors[ p2 ]      = i;
          colors[ p2 + 1 ]  = 2;
          colors[ p2 + 2 ]  = 0;

        }
      }

      // Spine Bundle
      for( var j = 0; j < 11; j++ ){


        var startingIndex = 21 * this.params.size * 3;
        var columnStartingIndex = startingIndex + ( this.params.size * 3 * j );
        var index = columnStartingIndex + ( i * 3 );

        var p1 = index * 2;
        var p2 = index * 2 + 3;

        positions[ p1 ] = 0 * size;
        positions[ p1 + 1 ] = i * size;
        positions[ p1 + 2 ] = .1;

        positions[ p2 ]     = (21 + j ) * size;
        positions[ p2 + 1 ] = i * size;
        positions[ p2 + 2 ] = .1;

        colors[ p1 ]      =  i;
        colors[ p1 + 1 ]  =  0;
        colors[ p1 + 2 ]  =  0;

        colors[ p2 ]      =  i;
        colors[ p2 + 1 ]  =  3;
        colors[ p2 + 2 ]  =  0;



      }

    }


    return lineGeo;


  }



