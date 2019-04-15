uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_ooPos;
uniform sampler2D t_audio;
uniform float lineWidth;

attribute vec3 color;
attribute float idInTail;

varying vec3 vColor;
varying vec3 vNorm;

varying vec3 vView;
varying vec3 vLightDir;
varying vec2 vID;
varying vec2 vUv;

const vec3 lightPos = vec3( 1.0 , 1.0 , 1.0 );


vec3 hsv(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


// Optimised by Alan Zucconi
vec3 bump3y (vec3 x, vec3 yoffset)
{
 vec3 y = vec3( 1. - x * x );
 y = clamp(y-yoffset,0.,1.);
 return y;
}
vec3 spectral (float w)
{
    // w: [400, 700]
 // x: [0,   1]
 float x = w;// clamp((w - 400.0)/ 300.0,0.,1.);
 
 const vec3 cs = vec3(3.54541723, 2.86670055, 2.29421995);
 const vec3 xs = vec3(0.69548916, 0.49416934, 0.28269708);
 const vec3 ys = vec3(0.02320775, 0.15936245, 0.53520021);
 
 return bump3y ( cs * (x - xs), ys);
}



void main(){

  vec4 pos    =  texture2D( t_pos , position.xy );
  vec4 posO    =  texture2D( t_pos , color.xy );

  vec4 a = texture2D( t_audio , vec2(position.y ,0.) );

  vec3 dir = normalize(pos.xyz  - posO.xyz) *2. * (color.z-.5);


  vView = viewMatrix[3].xyz;

  vec3 left = normalize(cross(dir, vec3(0.,0.,1.)));

  vec3 fPos = pos.xyz - left * 10.  * lineWidth * length(a)* (position.z -.5);


  vID = vec2(idInTail,position.y);

  vNorm = vView;

  vUv = vec2( position.z , color.z );




  vColor = spectral(vID.y + idInTail * .1 - .3);


if( position.x > 20.5/32. || color.x >  20.5/32. ){
 // fPos = vec3(0.,0.,0.);
}


  vec3 lightDir = normalize( lightPos - (modelViewMatrix * vec4( fPos , 1.0 )).xyz );
  vLightDir = lightDir;

  //vPos = position;
  vec4 mvPos = modelViewMatrix * vec4( fPos , 1.0 );
  gl_Position = projectionMatrix * mvPos;
  


}
