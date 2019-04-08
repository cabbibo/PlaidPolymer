
uniform sampler2D t_audio;
uniform sampler2D t_sprite;

varying vec2 vUv;
varying vec3 vColor;




const float size = 1. / 32.;
const float hSize = size / 2.;

void main(){


  float mIx = floor( (vUv.x + hSize ) / size );
  float mIy = floor( (vUv.y + hSize) / size );

  // Main Index
  vec2 mI = vec2( mIx , mIy );
  //vec4 s = texture2D( t_sprite , vec2( gl_PointCoord.x , 1.0 - gl_PointCoord.y) );
  vec4 a = texture2D( t_audio , vec2(length(vUv-.5),0.));


  //float c = mod(( vUv.y -hSize ) / size , 2. );

  gl_FragColor = vec4( 1.,1.,1.,1. ); 
}
