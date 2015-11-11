var THREE = require('three');

var shader = '\
        uniform sampler2D tDiffuse;\
        uniform float amount;\
        varying vec2       vUv;\
        void main() {\
            vec4 color = texture2D(tDiffuse, vUv);\
            float average = (color.r + color.g + color.b) / 3.0;\
            float mx = max(color.r, max(color.g, color.b));\
            float amt = (mx - average) * (-amount * 3.0);\
            color.rgb = mix(color.rgb, vec3(mx), amt);\
            gl_FragColor = color;\
        }\
    ';

var VibranceShader = {

    uniforms: {

        "tDiffuse":   { type: "t", value: null },
        "amount":   { type: "f", value: null },

    },

    vertexShader: [

        "varying vec2       vUv;",
        "void main() {",
        "vUv = uv;",

        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join("\n"),

    fragmentShader: shader

};

module.exports = VibranceShader;
