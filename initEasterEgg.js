function initEasterEgg(){



 var geo = new THREE.IcosahedronGeometry(10,1);
 var mat = new THREE.MeshNormalMaterial();

  EasterEgg = new THREE.Mesh( geo , mat );
  EasterEgg.scale.multiplyScalar( 100 );

  EasterEgg.added = false;
  EasterEgg.textAdded = false;

  EasterEgg.addDistance = 3950;

  EasterEgg.gui = new dat.GUI({autoPlace:false});

   
  var gHolder = document.createElement('div');

  var tHolder = document.createElement('h1');

  tHolder.innerHTML ='EasterEgg';

  gHolder.appendChild( tHolder );
  var guis = document.getElementById( 'GUI' );

  guis.appendChild( gHolder );
  gHolder.appendChild(EasterEgg.gui.domElement);


  EasterEgg.furryTails = [];

    var center = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 1.1 , 1 ),
    new THREE.MeshNormalMaterial({side:THREE.DoubleSide})
  );

  //EasterEgg.gui.domElement = this.params.domElement;

  var bait = center.clone();

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
  var friends = new FurryGroup( EasterEgg , 'friends' , audioController , 10 ,{
    center: center,
    bait: bait,
    color1: col1,
    color2: col2,
    color3: col3,
    color4: col4
    
  });

  
  /*var m = new THREE.Mesh( new THREE.IcosahedronGeometry( 1 , 0 ) , new THREE.MeshNormalMaterial() );
  m.scale.multiplyScalar( .02 );
  EasterEgg.add( m );*/

 /* EasterEgg.text = new PhysicsText(
     [ 'You can live.',
    '','',
    'Remember this miracle on your journey, and realize that no matter how far you go, already you have made it here.',
    '','',
    'Find joy in the short existance you have, because even if you make it, it will not be enough'
  ].join("\n")
  );*/
  EasterEgg.update = function(){


    var p = camera.position.clone();
  
   // console.log( this.added );
    if( this.added == false ){

        //console.log('YA');
        this.added = true;
        scene.add( this );

        //this.position.copy( p );

        var f = new THREE.Vector3( 0 , 0 , -1 );
        f.applyQuaternion( camera.quaternion );
        f.multiplyScalar( this.addDistance / 2 );
        //this.position.add( f );

        for( var i = 0; i < this.furryTails.length; i++ ){

          this.furryTails[i].activate();
          this.furryTails[i].line.scale.multiplyScalar( .001 );
          this.furryTails[i].physicsParticles.scale.multiplyScalar( .001 );
          this.furryTails[i].head.mesh.scale.multiplyScalar( .001 );
          this.furryTails[i].leader.scale.multiplyScalar( .001 );
          //this.furryTails[i].bait

          var position = new THREE.Vector3( 
            (Math.random() - .5 ) * 10,  
            (Math.random() - .5 ) * 10,  
            (Math.random() - .5 ) * 10  
          );

          this.furryTails[i].addCollisionForce( position , 10 );
          this.furryTails[i].addDistanceForce( position , .00004 );  
     
          this.furryTails[i].velocity.set(
            (Math.random() - .5) * 300,
            (Math.random() - .5) * 300,
            (Math.random() - .5) * 300
          );

          for( var j = 0; j < this.furryTails.length; j++ ){

            if( j != i ){


              var oP = this.furryTails[j].position;
              this.furryTails[i].addDistanceForce( oP , .000004 );
              this.furryTails[i].addCollisionForce( oP , 10 );
              
              //this.furryTails[i].addDistanceInverseSquaredForce( oP , -.000000001 );

            }


          }
          //scene.add( this.furryTails[i].leader );
        //this.furryTails[i].updatePhysics();

        

       // this.startText.

      }
    }

    if( this.added == true ){

      for( var i = 0; i < this.furryTails.length; i++ ){

        this.furryTails[i].updateTail();
        this.furryTails[i].updatePhysics();

      }

    }


  }

 ////////////////// scene.add( EasterEgg );

}
