uniform vec3 color;
uniform float time;

varying float vOffset;

void main() {
	gl_FragColor = vec4( color.r, color.g, color.b, clamp(pow(sin(vOffset + time / 2000.), 6.), 0., 0.95));
}
