uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_toPos;
uniform sampler2D t_fromPos;
varying vec2 vUv;
void main(){

  vec3 oPos = texture2D( t_oPos , vUv ).xyz;
  vec3 pos  = texture2D( t_pos , vUv ).xyz;

  vec3 toPos = texture2D( t_toPos , vUv ).xyz;
  vec3 fromPos = texture2D( t_fromPos , vUv ).xyz;


  float direction = texture2D( t_pos , vUv ).w;

  vec3 dif;

  if( direction == 1.0 ){
    dif = toPos - pos;
  }

  if( direction == -1.0 ){
    dif = fromPos - pos;
  }

  
  vec3 sVel = pos - oPos;

  float lv = length( sVel );

  vec3 acc = normalize( dif );

  vec3 vel = sVel + acc;

  vec3 newPos = pos + vel * .9;


  float l = length( dif );

  if( l < 5.0 ){

    direction *= -1.;

  }
  

  gl_FragColor = vec4( newPos , direction );

}
