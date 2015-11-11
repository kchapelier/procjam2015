
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

var THREE = require('three');

var GameboyShader = {

    uniforms: {

        "tDiffuse": { type: "t", value: null },
        "pixelSize": { type: "i", value: 3 },
        "pixelSpace": { type: "i", value: 1 },
        "width": { type: "f", value: 800. },
        "height": { type: "f", value: 600. }
    },

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join("\n"),

    fragmentShader: [

        "varying vec2       vUv;",
        "uniform sampler2D  tDiffuse;",
        /* /
        "uniform vec3       color1;",
        "uniform vec3       color2;",
        "uniform vec3       color3;",
        "uniform vec3       color4;",
        /* */
        "uniform int pixelSpace;",
        "uniform int pixelSize;",

        "float dpr = 2.;",

        "uniform float width;",
        "uniform float height;",

        /* */
         "vec3 color1 = vec3(008. / 255., 025. / 255., 032. / 255.);",
         "vec3 color2 = vec3(050. / 255., 106. / 255., 079. / 255.);",
         "vec3 color3 = vec3(137. / 255., 192. / 255., 111. / 255.);",
         "vec3 color4 = vec3(223. / 255., 246. / 255., 208. / 255.);",


         /* */

        "int modi(int x, int y) {",
        "  return x - y * (x / y);",
        "}",

        "void main(void) {",
        "   int psize = (pixelSpace + pixelSize);",
        "	if(pixelSpace > 0 && (modi(int(vUv.x * width), pixelSize) >= pixelSize - pixelSpace || modi(int(vUv.y * height), pixelSize) >= pixelSize - pixelSpace)) {",
        "		gl_FragColor.rgb = color4;",
        "	} else {",
        "		vec2 pos = vec2(",
        "		    float(",
        "		        (int(vUv.x * width) / psize)",
        "		    ) / width * float(psize),",
        "		    float(",
        "		        (int(vUv.y * height) / psize)",
        "		    ) / height * float(psize)",
        "		);",
        "		gl_FragColor = texture2D(tDiffuse, pos);",
        "		float grayV = (gl_FragColor.r * 0.8 + gl_FragColor.g * 1.0 + gl_FragColor.b * 0.9) / 2.7;",
        "		grayV = pow(grayV, 0.9);",
        "		int level = int(max(1.0, ceil(grayV * 4.)));",
        "		if(level == 1) gl_FragColor.rgb = color1;",
        "		else if(level == 2) gl_FragColor.rgb = color2;",
        "		else if(level == 3) gl_FragColor.rgb = color3;",
        "		else gl_FragColor.rgb = color4;",
        "	}",
        "}"

    ].join("\n")
};



var colors = {
    'green' : [
        { x : 8 / 255, y : 25 / 255, z: 32 / 255 },
        { x : 50 / 255, y : 106 / 255, z: 79 / 255 },
        { x : 137 / 255, y : 192 / 255, z: 111 / 255 },
        { x : 223 / 255, y : 246 / 255, z: 208 / 255 }
    ],
    'grey' : [
        { x : 0 / 255, y : 0 / 255, z: 0 / 255 },
        { x : 96 / 255, y : 96 / 255, z: 96 / 255 },
        { x : 168 / 255, y : 168 / 255, z: 168 / 255 },
        { x : 248 / 255, y : 248 / 255, z: 248 / 255 }
    ]
};

module.exports = GameboyShader;

