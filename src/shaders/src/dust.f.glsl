uniform vec3 color;
uniform float time;

varying float vOffset;
varying float vDistance;

void main() {
  gl_FragColor = vec4(color, clamp(pow(sin(vOffset + time / 3000.), 6.), 0., pow(sin(vDistance * (2. + sin(vOffset))/ 4.), 2.) * 0.48));
}
