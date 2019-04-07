uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_ooPos;


attribute vec3 color;

varying vec3 vColor;
varying vec3 vNorm;

varying vec3 vView;
varying vec3 vLightDir;

const vec3 lightPos = vec3( 1.0 , 1.0 , 1.0 );


void main(){

  vec4 pos    =  texture2D( t_pos , position.xy );
  vec4 posO    =  texture2D( t_pos , color.xy );

  vec3 dir = normalize(pos.xyz  - posO.xyz) *2. * (color.z-.5);


  vView = viewMatrix[3].xyz;

  vec3 left = normalize(cross(dir, vec3(0.,0.,1.)));

  vec3 fPos = pos.xyz - left * 10.* (position.z -.5);



vNorm = vView;


  vColor = vec3(1.,1.,1.);


if( position.x > .5/32. || color.x >  .5/32. ){
  fPos = vec3(0.,0.,0.);
}


  vec3 lightDir = normalize( lightPos - (modelViewMatrix * vec4( fPos , 1.0 )).xyz );
  vLightDir = lightDir;

  //vPos = position;
  vec4 mvPos = modelViewMatrix * vec4( fPos , 1.0 );
  gl_Position = projectionMatrix * mvPos;
  


}
