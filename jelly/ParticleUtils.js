var ParticleUtils = {


  /* From @mrdoob's Sporel Demo */
  createPositionsTexture: function( size , mesh ){

    var geometry = new THREE.Geometry();

    geometry.merge( mesh.geometry , mesh.matrix );

    var point = new THREE.Vector3();
    var facesLength = geometry.faces.length;

    var data = new Float32Array( size * size * 4 );

    for ( var i = 0, l = data.length; i < l; i += 4 ) {

      var face = geometry.faces[ Math.floor( Math.random() * facesLength ) ];

      var vertex1 = geometry.vertices[ face.a ];
      var vertex2 = geometry.vertices[ Math.random() > 0.5 ? face.b : face.c ];

      point.subVectors( vertex2, vertex1 );
      point.multiplyScalar( Math.random() );
      point.add( vertex1 );

      data[ i ] = point.x;
      data[ i + 1 ] = point.y;
      data[ i + 2 ] = point.z;
      data[ i + 3 ] = 1;

    }

    var positionsTexture = new THREE.DataTexture(
      data, 
      size, 
      size, 
      THREE.RGBAFormat, 
      THREE.FloatType 
    );

    positionsTexture.minFilter = THREE.NearestFilter;
    positionsTexture.magFilter = THREE.NearestFilter;
    positionsTexture.generateMipmaps = false;
    positionsTexture.needsUpdate = true;

    positionsTexture.mesh = mesh;

    return positionsTexture;

  },


  createLookupGeometry: function( size ){        
        
    var geo = new THREE.BufferGeometry();

   // geo.addAttribute( 'position', Float32Array , size * size , 3 );
  
    var pos = new THREE.BufferAttribute( new Float32Array(  size * size * 3 ) , 3 );

    var positions = pos.array;

    for ( var i = 0, j = 0, l = positions.length / 3; i < l; i ++, j += 3 ) {

      positions[ j     ] = ( i % size ) / size;
      positions[ j + 1 ] = Math.floor( i / size ) / size;
      //positions[ j + 2 ] = Math.sin( (i / size) * Math.PI );

    }

    geo.addAttribute( 'position', pos );


    return geo;
    
  },



  createParticleLookupGeometry: function( size ){    



    var geo = new THREE.BufferGeometry();

    //var posBuffer = new THREE.BufferAttribute(  new Float32Array( 32 * 32  * 4 ) , 3 );

    var positions = [];
    var uvs = [];
    var indices = [];
        
 
    for ( var i = 0;  i < size * size; i++  ) {

      positions[ i * 4 * 3 + 0 ] = ( i % size ) / size;
      positions[ i * 4 * 3 + 1 ] = Math.floor( i / size ) / size;
      positions[ i * 4 * 3 + 2 ] = 0;

      positions[ i * 4 * 3 + 3 ] = ( i % size ) / size;
      positions[ i * 4 * 3 + 4 ] = Math.floor( i / size ) / size;
      positions[ i * 4 * 3 + 5 ] = 0;

      positions[ i * 4 * 3 + 6 ] = ( i % size ) / size;
      positions[ i * 4 * 3 + 7 ] = Math.floor( i / size ) / size;
      positions[ i * 4 * 3 + 8 ] = 0;

      positions[ i * 4 * 3 + 9 ] = ( i % size ) / size;
      positions[ i * 4 * 3 + 10 ] = Math.floor( i / size ) / size;
      positions[ i * 4 * 3 + 11 ] = 0;


      uvs[ i * 4 * 2 + 0 ] = 0;
      uvs[ i * 4 * 2 + 1 ] = 0;

      uvs[ i * 4 * 2 + 2 ] = 1;
      uvs[ i * 4 * 2 + 3 ] = 0;

      uvs[ i * 4 * 2 + 4 ] = 0;
      uvs[ i * 4 * 2 + 5 ] = 1;

      uvs[ i * 4 * 2 + 6 ] = 1;
      uvs[ i * 4 * 2 + 7 ] = 1;


      //uvs[ j + 2 ] = Math.sin( (i / size) * Math.PI );

    }


    for( var i = 0; i < size*size; i++ ){

      indices.push( i * 4  + 0 );
      indices.push( i * 4  + 3 );
      indices.push( i * 4  + 1 );
      indices.push( i * 4  + 0 );
      indices.push( i * 4  + 2 );
      indices.push( i * 4  + 3 );

    }


    geo.setIndex(indices);
    geo.addAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    geo.addAttribute('uv2',new THREE.Float32BufferAttribute(uvs,2));


    return geo;
    
  }

}
