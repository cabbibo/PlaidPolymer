
uniform sampler2D t_oPos;
uniform sampler2D t_pos;

uniform float justHit;
uniform float beingChased;

uniform sampler2D t_audio;
uniform sampler2D t_start;
uniform float time;
uniform float delta;

uniform vec3 uDeathPos;
uniform vec3 uPos;
uniform vec3 uVel;

varying vec2 vUv;

$simplex
$curl


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main(){

 /* vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos , vUv );

  vec3 vel = oPos.xyz - pos.xyz;

  float life = pos.w;

  vec3 dif = pos.xyz - uDeathPos;



  vec4 audioX = texture2D( t_audio , vec2( vUv.x , 0. ) );
  vec4 audioY = texture2D( t_audio , vec2( vUv.y , 0. ) );


  vec3 curl = curlNoise( pos.xyz * .2 );
  vel += curl * .1;

  if( life == 1. ){

    vel = vec3( 0. );

  }


  vec3 p = pos.xyz + vel * .6 * audioX.x * audioX.y* audioX.x * audioX.y  ; 


  p = pos.xyz + vel - normalize( dif );//*(abs(sin(vUv.x*100.))+10.)/40.;


  life -= .004 * rand( vec2( vUv.x , vUv.y ));// ;* audioX.x * audioY.y ;

  if( justHit >= .5 ){

    
    life -= .5;

    //p = uPos;


  }

  if( beingChased > .5 ){

    if( life <= 0.0 ){

      life = 1.;
      p = uPos;



    }

  }*/

   vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos , vUv );

  vec3 vel = oPos.xyz - pos.xyz;

  float life = pos.w;

  vec3 dif = pos.xyz - uDeathPos;



  vec4 audioX = texture2D( t_audio , vec2( vUv.x , 0. ) );
  vec4 audioY = texture2D( t_audio , vec2( vUv.y , 0. ) );


  vec3 curl = curlNoise( pos.xyz * .2 );
  vel += curl * .1;

  if( life == 1. ){


    float r = rand( vec2( audioX.x , audioY.y ));

   // vel = uVel.xyz * 10. *  normalize( uVel ) * r;
    vel = 1. * vec3( sin( r * 3.14159 ) , cos( r * 3.142 ) , cos( sin( r * 10.0 ) ));

  }


  vec3 p = pos.xyz + vel * .6 * audioX.x * audioX.y* audioX.x * audioX.y  ; 


  p = pos.xyz + vel - normalize( dif );


  life -= .004 * audioX.x * audioY.y ;

  if( justHit >= .5 ){

    
    life -= .5;

    //p = uPos;


  }
  
  if( life <= 0.0 ){

    life = 1.;
    p = uPos;



  }


  

  gl_FragColor = vec4( p , life );


}
