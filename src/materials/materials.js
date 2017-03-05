"use strict";

var shaders = require('./../shaders/shaders.json');

function loadTexture (url, anisotropy) {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(url);
    texture.anisotropy = anisotropy;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

var materials = {
    debug: new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide
    }),
    sand: new THREE.MeshPhongMaterial({
        color: 0xB5B592,
        specular: 0x20200A,
        shininess: 12,
        shading: THREE.SmoothShading,
        normalMap: loadTexture('./assets/images/normalmap3.jpg', 4),
        normalScale: new THREE.Vector2(0.275,0.275)
    }),
    building: new THREE.MeshNormalMaterial({
        side: THREE.FrontSide
    }),/*new THREE.MeshStandardMaterial({
        color: 0x6C6C6C,
        shading: THREE.SmoothShading,
        metalness: 0.68,
        roughness: 0.60
    }),*/
    sun: new THREE.MeshBasicMaterial({
        color: 0xF5F5D0,
        fog: false
    }),
    dust: new THREE.ShaderMaterial({
        uniforms: {
            color: {
                type: "c",
                value: new THREE.Color(0xffffff)
            },
            time: {
                type: "f",
                value: 1.
            }
        },
        vertexShader: shaders['dust.v.glsl'],
        fragmentShader: shaders['dust.f.glsl'],
        blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: true
    })
};

module.exports = materials;
