uniform vec3 lightColors[6];
uniform vec3 lightDirections[6];


vec3 lambertLightColor( vec3 normToPass ){
  
  vec3 fColor = vec3( 0. );
  for( int i = 0; i < 6; i++ ){

    fColor += max( 0., dot( normToPass , normalize( lightDirections[i] ) )) * lightColors[i] * .5;

  }

  return fColor;

}

vec3 lambertAudioLightColor( vec3 normToPass , sampler2D audio ){
  
  vec3 fColor = vec3( 0. );
  for( int i = 0; i < 6; i++ ){

    float match =  dot( normToPass , normalize( lightDirections[i] ) );
    vec4 a = texture2D( audio , vec2( abs( sin(match*1.)) , 0. ) );
    fColor += max( 0. , match) *  a.xyz  * lightColors[i];

  }

  return fColor;

}

vec3 lambertAudioColor( vec3 normToPass , sampler2D audio ){
  
  vec3 fColor = vec3( 0. );
  for( int i = 0; i < 2; i++ ){

    float match =  dot( normToPass , normalize( lightDirections[i*2] ) );
    vec4 a = texture2D( audio , vec2( abs( sin(match*1.)) , 0. ) );
    fColor += max( 0. , match) *  a.xyz;

  }

  return fColor;

}



vec3 shineAudioLightColor( vec3 normToPass, vec3 eye , sampler2D audio , float power){
  
  vec3 fColor = vec3( 0. );
  for( int i = 0; i < 2; i++ ){

    vec3 refl = reflect( normToPass , normalize( lightDirections[i*2] ) );
    float match =  dot( eye , refl );
    vec4 a = texture2D( audio , vec2( abs( sin(match*1.)) , 0. ) );
    fColor += pow( max( 0. , match) , power ) *  a.xyz  * lightColors[i*2];

  }

  return fColor;

}
