"use strict";

var THREE = require('three'),
    shaders = require('./../shaders/shaders.json');

var materials = {
    debug: new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide
    }),
    sand: new THREE.MeshPhongMaterial({
        color: 0xCCCCAA,
        specular: 0x202020,
        shininess: 8,
        shading: THREE.SmoothShading,
        metal: false
    }),
    building: new THREE.MeshPhongMaterial({
        color: 0x202020,
        specular: 0xE0E0E0,
        shininess: 11,
        shading: THREE.SmoothShading,
        metal: true
    }),
    ground: new THREE.MeshPhongMaterial({
        color: 0x202020,
        specular: 0xE0E0E0,
        shininess: 11,
        shading: THREE.SmoothShading,
        metal: true,
        transparent: true,
        opacity: 0.35
    }),
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
