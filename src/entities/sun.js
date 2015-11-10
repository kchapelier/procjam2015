"use strict";

var THREE = require('three');

var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { type: "f", value: 1.0 }
    },
    vertexShader: [
        "uniform float time;",
        "varying vec2 vUv;",

        "void main()",
        "{",
        "    vUv = uv;",
        "    float rotation = 0.0;",

        "    vec3 alignedPosition = vec3(position.x, position.y, position.z);",

        "    vec2 pos = alignedPosition.xy;",

        "    vec2 rotatedPosition;",
        "    rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;",
        "    rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;",

        "    vec4 finalPosition;",

        "    finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );",
        "    finalPosition.xy += rotatedPosition;",
        "    finalPosition = projectionMatrix * finalPosition;",

        "    gl_Position =  finalPosition;",
        "}"
    ].join('\r\n'),
    fragmentShader: [
        "uniform float time;",

        "varying vec2 vUv;",
        "varying float vPlaneIndex;",

        "//",
        "// Description : Array and textureless GLSL 2D simplex noise function.",
        "//      Author : Ian McEwan, Ashima Arts.",
        "//  Maintainer : ijm",
        "//     Lastmod : 20110822 (ijm)",
        "//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.",
        "//               Distributed under the MIT License. See LICENSE file.",
        "//               https://github.com/ashima/webgl-noise",
        "//",

        "vec3 mod289(vec3 x) {",
        "    return x - floor(x * (1.0 / 289.0)) * 289.0;",
        "}",

        "vec2 mod289(vec2 x) {",
        "    return x - floor(x * (1.0 / 289.0)) * 289.0;",
        "}",

        "vec3 permute(vec3 x) {",
        "    return mod289(((x*34.0)+1.0)*x);",
        "}",

        "float snoise(vec2 v)",
        "{",
        "    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0",
        "    0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)",
        "    -0.577350269189626,  // -1.0 + 2.0 * C.x",
        "    0.024390243902439); // 1.0 / 41.0",
        "    // First corner",
        "    vec2 i  = floor(v + dot(v, C.yy) );",
        "    vec2 x0 = v -   i + dot(i, C.xx);",

        "    // Other corners",
        "    vec2 i1;",
        "    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0",
        "    //i1.y = 1.0 - i1.x;",
        "    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);",
        "    // x0 = x0 - 0.0 + 0.0 * C.xx ;",
        "    // x1 = x0 - i1 + 1.0 * C.xx ;",
        "    // x2 = x0 - 1.0 + 2.0 * C.xx ;",
        "    vec4 x12 = x0.xyxy + C.xxzz;",
        "    x12.xy -= i1;",

        "    // Permutations",
        "    i = mod289(i); // Avoid truncation effects in permutation",
        "    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))",
        "+ i.x + vec3(0.0, i1.x, 1.0 ));",

        "    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);",
        "    m = m*m ;",
        "    m = m*m ;",

        "    // Gradients: 41 points uniformly over a line, mapped onto a diamond.",
        "    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)",

        "    vec3 x = 2.0 * fract(p * C.www) - 1.0;",
        "    vec3 h = abs(x) - 0.5;",
        "    vec3 ox = floor(x + 0.5);",
        "    vec3 a0 = x - ox;",

        "    // Normalise gradients implicitly by scaling m",
        "    // Approximation of: m *= inversesqrt( a0*a0 + h*h );",
        "    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );",

        "    // Compute final noise value at P",
        "    vec3 g;",
        "    g.x  = a0.x  * x0.x  + h.x  * x0.y;",
        "    g.yz = a0.yz * x12.xz + h.yz * x12.yw;",
        "    return 130.0 * dot(m, g);",
        "}",

        "void main( void ) {",
        "    vec2 position = (vUv - vec2(0.5, 0.5)) * 2.;",

        "    float dist = pow(pow(position.y, 2.) + pow(position.x, 2.), 0.5);",

        "    float grey = dist;",

        "    gl_FragColor = vec4(1., 1., 1., (dist < 1.));",

        "}"

    ].join('\r\n'),
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
    transparent: true
} );

var Sun = function Sun () {
    var geometry = new THREE.SphereGeometry(40000,60,70); //new THREE.PlaneGeometry(80000, 80000, 2, 2);
    //geometry.doubleSided = true;


    this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xF5F5D0, fog: false }));
    //this.mesh.rotation.y = Math.PI / 2;

    /*
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();
    geometry.boundingSphere.radius = 20000000;
    geometry.boundingBox.min = 20000000;
    geometry.boundingBox.max = 20000000;
    this.mesh.frustumCulled = false;
    */
};

module.exports = Sun;
