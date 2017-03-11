"use strict";

/*
Things to read

 https://www.opengl.org/discussion_boards/showthread.php/167751-day-night-cycle-light
 http://forum.celestialmatters.org/viewtopic.php?f=9&t=116&sid=37befac93f977998de203896f51e4789
 https://www.google.be/search?q=Preetham+sky+model&oq=Preetham+sky+model&aqs=chrome..69i57j0l2.544j0j7&sourceid=chrome&es_sm=91&ie=UTF-8
 https://github.com/bblodfon/skylighting-Web-app
 https://www.youtube.com/watch?v=jMdCC4uRZkg
 http://twiik.net/articles/simplest-possible-day-night-cycle-in-unity-5
 https://wiki.unrealengine.com/Tutorial:_Time_of_Day

 */

var maxFog = 0.00045,
    minFog = 0.00015,
    fogColorRed = [0xB9 / 255, 0xB9 / 255, 0x66 / 255, 0x40 / 255],
    fogColorGreen = [0xB9 / 255, 0xB9 / 255, 0x30 / 255, 0x30 / 255],
    fogColorBlue = [0xA9 / 255, 0xA9 / 255, 0x80 / 255, 0x66 / 255],
    sunColorRed = [0xF5 / 255, 0xF5 / 255],
    sunColorGreen = [0xF5 / 255, 0xC0 / 255],
    sunColorBlue = [0xD0 / 255, 0x80 / 255],
    sandShininess = [12,17],
    sandSpecularRed = [0x99 / 255, 0x10 / 255],
    sandSpecularGreen = [0x99 / 255, 0x10 / 255],
    sandSpecularBlue = [0x66 / 255, 0x06 / 255];

var wshaper = function wshaper (value, shape) {
    value *= shape.length - 1;

    var start = Math.floor(value),
        pos = value % 1;

    if (start === shape.length - 1) {
        value = shape[start];
    } else {
        value = shape[start] * (1 - pos) + shape[start + 1] * (pos);
    }

    return value;
};

var DayNightCycle = function DayNightCycle (renderer, fog, directionalLight, hemisphereLight, sun, shaderMaterial, sandMaterial) {
    this.renderer = renderer;
    this.fog = fog;
    this.directionalLight = directionalLight;
    this.hemisphereLight = hemisphereLight;
    this.sun = sun;
    this.shaderMaterial = shaderMaterial;
    this.sandMaterial = sandMaterial;
    this.time = 0;
};

DayNightCycle.prototype.update = function (player, dt) {
    this.time = this.time + dt;

    var duration = 300000,
        rampTimePi = (duration * 0.75 + this.time) % duration / duration * Math.PI,
        ratioFog = Math.abs(Math.sin(rampTimePi)),
        positionSunX = Math.sin(rampTimePi * 2),
        positionSunY = Math.cos(rampTimePi * 2),
        ratioSun = (1 - Math.max(positionSunY, 0)),
        ratioSunP3 = Math.pow(ratioSun, 3);

    this.sun.material.color.setRGB(
        wshaper(ratioSunP3, sunColorRed),
        wshaper(ratioSunP3, sunColorGreen),
        wshaper(ratioSunP3, sunColorBlue)
    );

    if (!this.sandMaterial.old) {
        this.sandMaterial.specular.setRGB(
            wshaper(ratioSun, sandSpecularRed),
            wshaper(ratioSun, sandSpecularGreen),
            wshaper(ratioSun, sandSpecularBlue)
        );

        this.sandMaterial.shininess = wshaper(ratioSun, sandShininess);
    }

    this.fog.density = ratioFog * maxFog + (1 - ratioFog) * minFog; //lerp

    this.fog.color.setRGB(
        wshaper(ratioFog, fogColorRed),
        wshaper(ratioFog, fogColorGreen),
        wshaper(ratioFog, fogColorBlue)
    );

    this.hemisphereLight.color.set(this.fog.color);
    this.directionalLight.color.set(this.fog.color);
    this.directionalLight.position.set(positionSunX, positionSunY, 1);

    this.shaderMaterial.uniforms.color.value.set(this.sun.material.color);

    this.sun.position.set(player.position.x + positionSunX * 50000, positionSunY * 50000, player.position.z + 50000);
    this.renderer.setClearColor(this.fog.color, 1);
};

module.exports = DayNightCycle;
