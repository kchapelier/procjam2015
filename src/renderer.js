"use strict";

var THREE = require('three'),
    isArray = require('is-array'),
    baseWidth = window.innerWidth,
    baseHeight = window.innerHeight,
    pixelRatio = 1; //(typeof window.devicePixelRatio !== 'undefined' ? window.devicePixelRatio : 1);

var renderer = new THREE.WebGLRenderer({ antialias: true, stencil: false, depth: true, maxLights: 2 }),
    scene = new THREE.Scene(),
    backgroundColor = 0x694489;

renderer.setPixelRatio(pixelRatio);
renderer.setSize(baseWidth, baseHeight);
renderer.autoClear = false;
renderer.setClearColor(backgroundColor, 1);

scene.fog = new THREE.FogExp2(backgroundColor, 0.00044);

window.addEventListener('resize', function () {
    module.exports.resize(window.innerWidth, window.innerHeight);
});

module.exports = {
    screenWidth: baseWidth,
    screenHeight: baseHeight,
    camera: null,
    scene: scene,
    renderer: renderer,
    useCamera: function (camera) {
        this.camera = camera;
        this.scene.add(camera);

        //pass.camera = camera;
    },
    resize: function (width, height) {
        this.screenHeight = height;
        this.screenWidth = width;
        renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    },
    infectDom: function (domElement) {
        if (typeof domElement === 'string') {
            domElement = document.getElementById(domElement);
        }

        domElement.appendChild(renderer.domElement);
    },
    addToScene: function (object) {
        if (isArray(object)) {
            for(var i = 0; i < object.length; i++) {
                this.scene.add(object[i]);
            }
        } else {
            this.scene.add(object);
        }
    },
    removeFromScene: function (object) {
        if (isArray(object)) {
            for(var i = 0; i < object.length; i++) {
                this.scene.remove(object[i]);
            }
        } else {
            this.scene.remove(object);
        }
    },
    render: function () {
        renderer.clear();
        renderer.render( this.scene, this.camera );
    }
};
