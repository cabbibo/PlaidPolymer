
uniform sampler2D t_audio;
uniform vec3 jelly;
uniform float active;

uniform float hovered;

varying vec3 vPos;
varying vec3 vNorm;
varying vec3 vView;

varying vec3 vCol;

varying mat3 vNormalMat;
varying vec3 vLightDir;
varying float vDisplacement;

varying vec3 vMVPos;
varying vec3 vWorld;

void main(){

  vec3 x = dFdx(vWorld);
  vec3 y = dFdy(vWorld);

  vec3 nNormal = vNorm;//normalize(cross(x,y));

  vec3 nReflection = normalize( reflect( vView , nNormal )); 

  float nViewDot = dot( nNormal , normalize( vView ) );
  float iNViewDot = 1.0 - max( -nViewDot  , 0.0);
  
  vec3 refl = reflect( -vec3(0.,1.,0.) , nNormal );
  float facingRatio = abs( dot(  nNormal, refl) );

  vec4 aColor = texture2D( t_audio , vec2( abs(iNViewDot) , 0.0));

  vec3 lamb = dot( nNormal , normalize(jelly - vWorld)) * vec3(1.,.4,.2);



  vec3 aC = ((aColor.xyz * aColor.xyz * aColor.xyz) - .2) * 1.4 + hovered * .5;// (1.+hovered);
  gl_FragColor = vec4(max(vCol , aC ), 1.0 );

}