
uniform sampler2D t_audio;

varying vec3 vColor;
varying vec3 vNorm;

varying vec3 vView;
varying vec3 vLightDir;
varying vec2 vUv;
varying vec2 vID;

void main(){

  vec3 nNormal = vNorm;

  vec3 nReflection = normalize( reflect( vView , nNormal )); 

  float nViewDot = dot( normalize( nNormal ), normalize( vView ) );
  float iNViewDot = 1.0 - max( nViewDot  , 0.0);
  
  vec3 refl = reflect( vLightDir , nNormal );
  float facingRatio = abs( dot(  nNormal, refl) );



  vec4 aColor = texture2D( t_audio , vec2( vUv.y * .2 + vID.y * .5, 0.0));

  vec3 aC = ((aColor.xyz * aColor.xyz * aColor.xyz) - .2) * 1.4 ;

  if( abs(vUv.x - .5) > .5 - length( aC ) ){ discard;}
  gl_FragColor = vec4( vColor * aColor.xyz , 1.0 );

}
