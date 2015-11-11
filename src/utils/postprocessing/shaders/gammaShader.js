var THREE = require('three');

var GammaShader = {

    uniforms: {
        "tDiffuse":   { type: "t", value: null },
        "gamma":   { type: "f", value: null }
    },

    vertexShader: [

        "varying vec2       vUv;",
        "void main() {",
        "vUv = uv;",

        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join("\n"),

    fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform float gamma;",
        "varying vec2 vUv;",
        "void main(void) {",
        "   vec3 color = texture2D(tDiffuse, vUv).rgb;",
        "   gl_FragColor.rgb = pow(color, vec3(1.0 / gamma));",
        "}"
    ].join("\n")

};

module.exports = GammaShader;
