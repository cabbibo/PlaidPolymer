uniform sampler2D t_vel;
uniform sampler2D t_pos;
uniform sampler2D t_audio;

uniform sampler2D t_start;
uniform float time;
uniform float delta;

uniform vec3 uPos;
uniform vec3 uVel;

varying vec2 vUv;


vec3 velSphere( vec3 c , float r , vec3 p , vec3 v ){

  vec3 d = (p +v*delta)- c;

  float l = length ( d );

  float vL = length( v );
  vec3 refl = reflect( normalize( v ) , normalize( d ) );

  vec3 finalVel = v;

  if( l < r ){
    finalVel = refl * vL * .9;
  }

  return ( finalVel );


}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

$simplex
$curl

void main(){
  

  vec4 vel    = texture2D( t_vel , vUv );
  vec4 pos    = texture2D( t_pos , vUv );
  vec4 a      = texture2D( t_audio , vec2( vUv.x , 0.0 ) );
  vec4 start  = texture2D( t_start , vUv );



  vel.xyz += curlNoise( pos.xyz  * 1. ) * .005; //* .5 * rand( vUv );
  
  if( pos.w == 10. || pos.w == 0. ){
    vel.xyz= vec3( 0. , 0. , 0. );
    //20. * normalize( vec3( .0 , -1. , 0.) + .9 *uVel  + 1.5 *vec3( uVel.xy , 0.0 ) );
     
  }

  gl_FragColor = vec4( vel.xyz , vel.w );


}

