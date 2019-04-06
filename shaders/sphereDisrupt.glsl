vec4 sphereDisrupt( vec3 center , float r , vec3 p , vec3 v ){

  vec3 d = p - center;
  float l = length( d );

  vec3 refl = reflect( normalize( v ) , normalize( d ) );

  float add = 0.0;
  float dDif = r-l;
  if( l < r ){
    add = r-l;
  }

  p -= add * normalize( p );
  return vec4( refl , add ) ;

}
