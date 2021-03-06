function initThree(){


  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera( 
    50 ,
    window.innerWidth / window.innerHeight,
    sceneSize / 10 ,
    sceneSize * 1000
    );

  // placing our camera position so it can see everything
  camera.position.y = 0;
  camera.position.z = 150;
  camera.position.x = 0;

  //camera.lookAt( new THREE.Vector3() );

 objectControls = new ObjectControls(camera);


  var m = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 300 , 1),
    new THREE.MeshBasicMaterial({map:G.uniforms.t_audio.value})
  );


  //scene.add( m);

  //controls = new THREE.TrackballControls(camera);

  clock = new THREE.Clock();
      // Getting the container in the right location
    container = document.createElement( 'div' );
    container.id = "container";
    
    document.body.appendChild( container );

 // Getting the stats in the right position
    stats = new Stats();

    stats.domElement.style.position  = 'absolute';
    stats.domElement.style.bottom    = '0px';
    stats.domElement.style.right     = '0px';
    stats.domElement.style.zIndex    = '999';

   // document.body.appendChild( stats.domElement );

    // Setting up our Renderer
    renderer = new THREE.WebGLRenderer();

    var r = window.devicePixelRatio || 1;
    renderer.setPixelRatio(r);


    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000519 , 1 );
    container.appendChild( renderer.domElement );

    // Making sure our renderer is always the right size
    window.addEventListener( 'resize', onWindowResize , false );




}

// Resets the renderer to be the proper size
function onWindowResize(){

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}



