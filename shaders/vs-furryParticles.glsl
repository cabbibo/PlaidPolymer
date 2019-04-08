uniform sampler2D t_pos;
uniform sampler2D t_audio;

uniform float dpr;
uniform float particleSize;

attribute vec2 uv2;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

varying vec3 vColor;

varying vec2 vUv;

varying vec2 vID;

const float size = 1. / 32.;
const float hSize = size / 2.;
const vec3 lightPos = vec3( 1.0 , 1.0 , 1.0 );

void main(){

  vec4 a = texture2D( t_audio , vec2( position.y * .5 , 0.));

  vec4 pos    =  texture2D( t_pos , position.xy );

  vec3 left = vec3(1.,0.,0.);///cross( vView , vec3(0.,1.,0.) );
  vec3 up  = vec3(0.,1.,0.);
  vUv = uv2;
  vID = vec2( position.y , 0. );


  vec3 fPos = pos.xyz + length(a) * ((uv2.x - .5)  * left + (uv2.y-.5) * up) * 20. * position.y;
  vec4 mvPos = modelViewMatrix * vec4( fPos , 1.0 );
  gl_Position = projectionMatrix * mvPos;

}
