
uniform vec3 lightPos;
uniform float time;
uniform sampler2D t_audio;

varying vec3 vPos;
varying vec3 vNorm;
varying vec3 vView;

varying mat3 vNormalMat;
varying vec3 vLightDir;
varying float vDisplacement;

varying vec3 vMVPos;
varying vec3 vWorld;
varying vec3 vCol;

$simplex


vec3 toSpherical( vec3 pos ){

  float r = length( pos );
  float t = atan( pos.y / pos.x );
  float p = acos( pos.z / r );

  return vec3( r , t , p );

}

vec3 toCart( vec3 rtp ){

  float x = rtp.x * cos( rtp.y ) * sin( rtp.z );
  float y = rtp.x * sin( rtp.y ) * sin( rtp.z );
  float z = rtp.x * cos( rtp.z );

  return vec3( x , y , z );

}

vec3 displace( vec3 p , vec3 o ){

  float noise = snoise( normalize(p) * 2. + o );
 
  vec3 nP = p * (1. + noise * .1 );

  return nP;


}

void main(){

  vPos  = position;
  vNorm = normal;

  vView = modelViewMatrix[3].xyz;
  vNormalMat = normalMatrix;

   
  vNorm = normal;//normalize( cross( difP , difT ));
  
  vec3 lightDir = normalize( lightPos -  (modelViewMatrix * vec4( vPos , 1.0 )).xyz );
  vLightDir = lightDir;

 float n = snoise( vPos * .01 + time  * .2);
  vec3 a = texture2D( t_audio , vec2( abs(n * .5)  , 0.0 ) ).xyz;
  vPos += vNorm * a * 20.;
  vCol = a;

  vWorld = (modelMatrix * vec4(vPos,1.)).xyz;

  vMVPos = (modelViewMatrix * vec4( vPos , 1.0 )).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );

}