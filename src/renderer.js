"use strict";

var THREE = require('three'),
    isArray = require('is-array'),
    baseWidth = window.innerWidth,
    baseHeight = window.innerHeight,
    pixelRatio = 1; //(typeof window.devicePixelRatio !== 'undefined' ? window.devicePixelRatio : 1);

var renderer = new THREE.WebGLRenderer({ antialias: true, maxLights: 4 }),
    scene = new THREE.Scene(),
    backgroundColor = 0x694489;

renderer.setPixelRatio(pixelRatio);
renderer.setSize(baseWidth, baseHeight);
renderer.autoClear = false;
renderer.setClearColor(backgroundColor, 1);

// 0.00044 to 0.00020

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
    addMultipleToScene: function (objects) {
        for(var i = 0; i < objects.length; i++) {
            this.scene.add(objects[i]);
        }
    },
    addToScene: function (object) {
        if (isArray(object)) {
            this.addMultipleToScene(object);
        } else {
            this.scene.add(object);
        }
    },
    removeFromScene: function (object) {
        this.scene.remove(object);
    },
    render: function () {
        //controls.update();
        renderer.clear();
        renderer.render( this.scene, this.camera );
    }
};
