
varying vec2 vUv;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_ooPos;

void main(){

  vec4 pos = texture2D( t_pos , vUv );
  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 ooPos = texture2D( t_ooPos , vUv );

  vec3 vel1 = oPos.xyz - pos.xyz;
  vec3 vel2 = ooPos.xyz - oPos.xyz;

  vec3 accel = vel2 - vel1;
  gl_FragColor = vec4( abs(normalize(accel)) , 1.0 ); 
}
