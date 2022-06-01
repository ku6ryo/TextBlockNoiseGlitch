precision mediump float;

attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vUv;

void main() {
   gl_Position = vec4(aPosition * vec2(1, -1), 0, 1);
   vUv = aTexCoord;
}