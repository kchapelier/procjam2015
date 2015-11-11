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
    minFog = 0.00016;

var fogColorRed = [0xB9 / 255, 0xB9 / 255, 0x66 / 255, 0x40 / 255],
    fogColorGreen = [0xB9 / 255, 0xB9 / 255, 0x30 / 255, 0x30 / 255],
    fogColorBlue = [0xA9 / 255, 0xA9 / 255, 0x80 / 255, 0x66 / 255];

var sunColorRed = [0xF5 / 255, 0xF5 / 255],
    sunColorGreen = [0xF5 / 255, 0xC0 / 255],
    sunColorBlue = [0xD0 / 255, 0x80 / 255];

var DayNightCycle = function DayNightCycle (renderer, fog, directionalLight, hemisphereLight, sun, shaderMaterial) {
    this.renderer = renderer;
    this.fog = fog;
    this.directionalLight = directionalLight;
    this.hemisphereLight = hemisphereLight;
    this.sun = sun;
    this.shaderMaterial = shaderMaterial;
    this.time = 0;
};

var lerp = function lerp (min, max, t) {
    return t * max + (1 - t) * min;
};

var wshaper = function wshaper (value, shape) {
    "use strict";

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

DayNightCycle.prototype.update = function (dt) {
    this.time = this.time + dt / 100;

    var duration = 2000;

    var rampTime = (duration * 0.75 + this.time) % duration / duration, // 1
        ratioFog = Math.abs(Math.pow(Math.sin(rampTime * Math.PI), 1)),
        positionSunX = Math.sin((rampTime + 0) * Math.PI * 2),
        positionSunY = Math.cos((rampTime + 0) * Math.PI * 2),
        ratioSun = Math.pow(1 - Math.max(positionSunY, 0), 3);

    //var gameTime = (rampTime + 0.5) * 24 % 24 * 60 | 0;
    //console.log(gameTime / 60 | 0, ':', gameTime % 60);

    this.sun.material.color.setRGB(
        wshaper(ratioSun, sunColorRed),
        wshaper(ratioSun, sunColorGreen),
        wshaper(ratioSun, sunColorBlue)
    );

    this.fog.density = lerp(minFog, maxFog, ratioFog);
    this.fog.color.setRGB(
        wshaper(ratioFog, fogColorRed),
        wshaper(ratioFog, fogColorGreen),
        wshaper(ratioFog, fogColorBlue)
    );

    this.hemisphereLight.color.set(this.fog.color);
    this.directionalLight.color.set(this.fog.color);
    this.directionalLight.position.set(positionSunX, positionSunY, 1);
    this.directionalLight.position.normalize();

    this.shaderMaterial.uniforms.color.value.set(this.sun.material.color);

    this.sun.position.set(positionSunX * 50000, positionSunY * 50000, 50000);
    this.renderer.setClearColor(this.fog.color, 1);
};

module.exports = DayNightCycle;
