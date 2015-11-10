attribute float toffset;

varying float vOffset;

void main() {
	vOffset = toffset;

	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_PointSize = 9. * ( 300.0 / length( mvPosition.xyz ) );
	gl_PointSize = clamp(gl_PointSize, 0., 3.5);
	gl_Position = projectionMatrix * mvPosition;
}
