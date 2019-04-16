
uniform sampler2D t_audio;
uniform vec4 color;

varying vec3 vPos;
varying vec3 vNorm;
varying vec3 vView;

varying mat3 vNormalMat;
varying vec3 vLightDir;
varying float vDisplacement;

//varying vec3 vMVPos;

void main(){
  gl_FragColor = color;//vec4( 1.,1.,0., 1.0 );

}
