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

/*
var EffectComposer = require('./utils/postprocessing/effectComposer'),
    RenderPass = require('./utils/postprocessing/renderPass'),
    ShaderPass = require('./utils/postprocessing/shaderPass'),
    GameboyShader = require('./utils/postprocessing/shaders/gameboyShader'),
    VibranceShader = require('./utils/postprocessing/shaders/vibranceShader'),
    GammaShader = require('./utils/postprocessing/shaders/gammaShader'),
    FXAAShader = require('./utils/postprocessing/shaders/fxaaShader');

var composer = new EffectComposer( renderer );
composer.setSize(baseWidth * pixelRatio, baseHeight * pixelRatio);
var pass = new RenderPass( scene, null );
composer.addPass( pass );
var effect = new ShaderPass( GameboyShader );
effect.uniforms[ 'pixelSpace' ].value = 0;
effect.uniforms[ 'pixelSize' ].value = 4;
effect.uniforms[ 'width' ].value = baseWidth;
effect.uniforms[ 'height' ].value = baseHeight;
effect.renderToScreen = true;
composer.addPass( effect );
*/

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

        //composer.setSize(width * pixelRatio, height * pixelRatio);
        //effect.uniforms[ 'width' ].value = width;
        //effect.uniforms[ 'height' ].value = height;
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

        //composer.render();
    }
};
