attribute float offset;

uniform float time;

varying float vOffset;
varying float vDistance;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_Position.y = gl_Position.y + sin(vOffset * 100. + time / 10000.) * 50.;
    gl_PointSize = 1800.0 / length(gl_Position.xyz);

    vOffset = offset;
    vDistance = gl_PointSize;

    gl_PointSize = clamp(gl_PointSize, 0., 2.5);
}
