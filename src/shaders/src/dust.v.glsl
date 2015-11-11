attribute float toffset;

uniform float time;

varying float vOffset;

void main() {
	vOffset = toffset;

	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_PointSize = 1800.0 / length( mvPosition.xyz );
	gl_PointSize = clamp(gl_PointSize, 0., 3.5);
	gl_Position = projectionMatrix * mvPosition;
	gl_Position.y = gl_Position.y + sin(vOffset * 100. + time / 10000.) * 50.;
}
