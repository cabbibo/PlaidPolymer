uniform sampler2D t_oPos;
uniform sampler2D t_pos;

uniform vec3 spherePos;

varying vec2 vUv;


$sphereDisrupt

void main(){
  
  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos , vUv );

  float life = pos.w;
  life -= .1;

  vec3 vel = oPos.xyz - pos.xyz;


  vel += vec3( 0. , -.5 , 0. );

  vel *= .7;

  vec3 p = pos.xyz + vel;
  vec4 disrupt = sphereDisrupt( spherePos , 10. , pos.xyz , vel.xyz );

  p += disrupt.xyz * disrupt.w * 3.;

  if( p.y < -40.0 ){
  
    p = vec3( 0. , 40. , 0. );

  }



  gl_FragColor = vec4( p , life );



}

