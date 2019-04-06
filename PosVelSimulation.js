function PosVelSimulation( size , posShader , velShader , renderer ){

  // First Make sure everything Works
  this.checkCompatibility( renderer );
  this.renderer = renderer;
  
  this.size = size || 128;
  this.s2   = size * size;

  this.renderer = renderer;

  this.clock = new THREE.Clock();

  
  // Sets up our render targets
  this.rt_pos1 = new THREE.WebGLRenderTarget( this.size, this.size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type:THREE.FloatType,
    stencilBuffer: false
  });

  this.rt_pos2 = this.rt_pos1.clone();
  this.rt_vel1 = this.rt_pos1.clone();
  this.rt_vel2 = this.rt_pos1.clone();

  this.counter = 0;

  this.debugScene = this.createDebugScene();
  this.texturePassProgram = this.createTexturePassProgram();
  
  // WHERE THE MAGIC HAPPENS
  this.posSimulation = this.createSimulationProgram( posShader );
  this.velSimulation = this.createSimulationProgram( velShader );
  
  this.boundTextures = [];

  /*
    
    GPGPU Utilities
    From Sporel by Mr.Doob
    @author mrdoob / http://www.mrdoob.com

  */  
  
  this.camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 );
  this.scene = new THREE.Scene();
  this.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ) );
  this.scene.add( this.mesh );
  
}

PosVelSimulation.prototype.checkCompatibility = function( renderer ){
  
  var gl = renderer.context;

  if ( gl.getExtension( "OES_texture_float" ) === null ) {
    this.onError( "No Float Textures"); 
    return;
  }

  if ( gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS ) === 0 ) {
    this.onError( "Vert Shader Textures don't work"); 
    return;
  }
  
}

PosVelSimulation.prototype.onError = function( e ){
  console.log( e );
}

PosVelSimulation.prototype.createDebugScene= function(){

  var debugScene = new THREE.Object3D();
  debugScene.position.z = 0;

  var geo = new THREE.PlaneGeometry( 100 , 100 );
    
  var debugMesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
    map: this.rt_pos1
  }));
  debugMesh.position.set( -55 , 55 , 0 );

  debugScene.add( debugMesh );
      
  var debugMesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
    map: this.rt_pos2
  }));
  debugMesh.position.set( 55 , 55 , 0 );
  debugScene.add( debugMesh );

  var debugMesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
    map: this.rt_vel1
  }));
  debugMesh.position.set( -55, -55 , 0 );
  debugScene.add( debugMesh );

  var debugMesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
    map: this.rt_vel2
  }));
  debugMesh.position.set( 55, -55 , 0 );
  debugScene.add( debugMesh );

  return debugScene;

}

PosVelSimulation.prototype.removeDebugScene = function( scene ){
  scene.remove( this.debugScene );
}

PosVelSimulation.prototype.addDebugScene = function( scene ){
  scene.add( this.debugScene );
}


PosVelSimulation.prototype.createTexturePassProgram = function(){

  var uniforms = {
    texture:{  type:"t"  , value:null },
  }

  var texturePassShader = new THREE.ShaderMaterial({
    uniforms:uniforms,
    vertexShader:this.VSPass,
    fragmentShader:this.FSPass,
  });

  return texturePassShader;

}

PosVelSimulation.prototype.createSimulationProgram = function(sim){

  var simulationUniforms = {
    t_pos:{ type:"t"  , value:null  },
    t_vel:{ type:"t"  , value:null  },
    delta:{ type:"f"  , value:0     }
  }


  var program = new THREE.ShaderMaterial({

    uniforms: simulationUniforms,
    vertexShader:this.VSPass,
    fragmentShader:sim

  });

  return program;

}


PosVelSimulation.prototype.VSPass = [
  "varying vec2 vUv;",
  "void main() {",
  "  vUv = uv;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
  "}"
].join("\n");

PosVelSimulation.prototype.FSPass = [
  "uniform sampler2D texture;",
  "varying vec2 vUv;",
  "void main() {",
  "  vec4 c = texture2D( texture , vUv );",
  "  gl_FragColor = c ;",
  "}"
].join("\n");


PosVelSimulation.prototype.update = function(){

  var flipFlop = this.counter % 2;
  var delta = this.clock.getDelta();
  
  this.posSimulation.uniforms.delta.value = delta;
  this.velSimulation.uniforms.delta.value = delta;

  if( flipFlop == 0 ){

    this.posSimulation.uniforms.t_pos.value = this.rt_pos2;
    this.velSimulation.uniforms.t_vel.value = this.rt_vel2;

    this.pass( this.velSimulation , this.rt_vel1 );
    
    this.posSimulation.uniforms.t_pos.value = this.rt_pos2;
    this.posSimulation.uniforms.t_vel.value = this.rt_vel1;

    this.pass( this.posSimulation , this.rt_pos1 );

    this.oOutputPos = this.rt_pos2;
    this.oOutputVel = this.rt_vel2;

    this.outputPos = this.rt_pos1;
    this.outputVel = this.rt_vel1;

  }else if( flipFlop == 1 ){
    
    this.posSimulation.uniforms.t_pos.value = this.rt_pos1;
    this.velSimulation.uniforms.t_vel.value = this.rt_vel1;

    this.pass( this.velSimulation , this.rt_vel2 );
    
    this.posSimulation.uniforms.t_pos.value = this.rt_pos1;
    this.posSimulation.uniforms.t_vel.value = this.rt_vel2;

    this.pass( this.posSimulation , this.rt_pos2 );

    this.oOutputPos = this.rt_pos1;
    this.oOutputVel = this.rt_vel1;

    this.outputPos = this.rt_pos2;
    this.outputVel = this.rt_vel2;

  }

  this.counter ++;

  this.bindTextures();

}

// Some GPGPU Utilities author: @mrdoob
PosVelSimulation.prototype.render = function ( scene, camera, target ) {
  renderer.render( scene, camera, target, false );
};

PosVelSimulation.prototype.pass = function ( shader , target ) {
  this.mesh.material = shader;
  this.renderer.render( this.scene, this.camera, target, false );
};

PosVelSimulation.prototype.out = function ( shader ) {
  this.mesh.material = shader.material;
  this.renderer.render( this.scene, this.camera );
};

// Used if he have uniforms we want to update!
PosVelSimulation.prototype.setUniforms = function( uniforms ){
  
  this.simulation.uniforms = uniforms || {};

  // Have to make sure that these always remain!
  this.simulation.uniforms.t_pos = { value:"t" , value:null }; 
  this.simulation.uniforms.t_oPos = { value:"t" , value:null };

  console.log( this.simulation.uniforms );

}

PosVelSimulation.prototype.setPosUniform = function(  name , u ){
  this.posSimulation.uniforms[name] = u;
}

PosVelSimulation.prototype.setVelUniform = function(  name , u ){
  this.velSimulation.uniforms[name] = u;
}


// resets the render targets to the from position
PosVelSimulation.prototype.reset = function( posTexture , velTexture ){

  this.texturePassProgram.uniforms.texture.value = posTexture;

  this.pass( this.texturePassProgram , this.rt_pos1 );
  this.pass( this.texturePassProgram , this.rt_pos2 );

  this.texturePassProgram.uniforms.texture.value = velTexture;

  this.pass( this.texturePassProgram , this.rt_vel1 );
  this.pass( this.texturePassProgram , this.rt_vel2 );

}

PosVelSimulation.prototype.addBoundTexture = function( system , uniform , value ){
  this.boundTextures.push( [ system , uniform , value ] );
}

PosVelSimulation.prototype.bindTextures = function(){

  for( var i = 0; i < this.boundTextures.length; i++ ){

    var boundSystem = this.boundTextures[i][0];
    var boundUniform = this.boundTextures[i][1];
    var textureToBind = this.boundTextures[i][2];

    var uniform = boundSystem.material.uniforms[ boundUniform ];

    uniform.value = this[ textureToBind ];


  }

}

