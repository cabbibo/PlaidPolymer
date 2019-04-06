
uniform vec3 color;
varying vec3 vPos;
varying vec4 vAudio;
void main(){

  gl_FragColor = vec4( color *vAudio.xyz, 1. ) +vec4( vec3(.3) , 0. );

}
