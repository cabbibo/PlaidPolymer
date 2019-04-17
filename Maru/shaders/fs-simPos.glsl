uniform sampler2D t_vel;
uniform sampler2D t_pos;
uniform sampler2D t_audio;
uniform sampler2D t_start;
uniform float delta;
uniform float audioLookup;
uniform vec3 uPos;
uniform vec3 uVel;

//uniform vec3 spherePos;

varying vec2 vUv;

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}




void main(){
  

  vec4 vel = texture2D( t_vel , vUv );
  vec4 pos = texture2D( t_pos , vUv );
  vec4 a   = texture2D( t_audio , vec2((( vUv.x ) * .5)-.25 + audioLookup , 0.0 ) );

  //vec4 start  = texture2D( t_start , vUv );

  if( pos.w == 10. || pos.w == 0. ){

    pos.w = 0.;

    vel.xyz =  vec3(0.,0.,0.);
  }
  
  pos.w += delta * ( .9 + (rand( vUv ) * .5 ) );

  if( pos.w * a.w > 1.){

    pos.xyz = uPos.xyz;
    //pos.xyz += .1 * pos.xyz * (rand( vUv ) -.5);
    vel.xyz = vec3(0.,0.,0.);
    pos.w = 10.;

  }

  
  vec3 finalPoint = pos.xyz + vel.xyz * delta;// * ( a.w );
  gl_FragColor = vec4( finalPoint , pos.w );



}

