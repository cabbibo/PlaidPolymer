vec3 triplanarMap( vec3 normal , vec3 position , sampler2D normalTexture , float normalScale , float textureScale ){

  // FROM @thespite
  vec3 n = normalize( normal.xyz );
  vec3 blend_weights = abs( n );
  blend_weights = ( blend_weights - 0.2 ) * 7.;  
  blend_weights = max( blend_weights, 0. );
  blend_weights /= ( blend_weights.x + blend_weights.y + blend_weights.z );

  vec2 coord1 = position.yz * textureScale;
  vec2 coord2 = position.zx * textureScale;
  vec2 coord3 = position.xy * textureScale;

  vec3 bump1 = texture2D( normalTexture , coord1 ).rgb;  
  vec3 bump2 = texture2D( normalTexture , coord2 ).rgb;  
  vec3 bump3 = texture2D( normalTexture , coord3 ).rgb; 

  vec3 blended_bump = bump1 * blend_weights.xxx +  
                      bump2 * blend_weights.yyy +  
                      bump3 * blend_weights.zzz;

  vec3 tanX = vec3( normal.x, -normal.z, normal.y);
  vec3 tanY = vec3( normal.z, normal.y, -normal.x);
  vec3 tanZ = vec3(-normal.y, normal.x, normal.z);
  vec3 blended_tangent = tanX * blend_weights.xxx +  
                         tanY * blend_weights.yyy +  
                         tanZ * blend_weights.zzz; 

  vec3 normalTex = blended_bump * 2.0 - 1.0;
  normalTex.xy *= normalScale;
  normalTex.y *= -1.;
  normalTex = normalize( normalTex );
  mat3 tsb = mat3( normalize( blended_tangent ), normalize( cross( normal, blended_tangent ) ), normalize( normal ) );
  vec3 finalNormal = tsb * normalTex;


  return normalize(finalNormal);



}
