precision mediump float;

uniform sampler2D uImage;
uniform sampler2D uNoise;
uniform float uTime;
uniform float uRandom;

varying vec2 vUv;

void main() {
  float n = texture2D(uNoise, vUv).r * 0.2;
  float nn = n * (uRandom - 0.5);
  vec4 color = texture2D(uImage, vUv + nn);
  vec3 f = color.rgb;
  if (nn > 0.) {
    f = mix(color.rgb, vec3(1.0, 0.502, 0.1686), color.r);
  } else if (n > 0.01) {
    f = mix(color.rgb, vec3(0.0, 1.0, 0.949), color.r);
  }
  gl_FragColor = vec4(f, color.r);
}