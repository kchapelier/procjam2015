"use strict";

var maxFog = 0.00045,
    minFog = 0.00016;

var fogColorRed = [0xB9 / 255, 0xB9 / 255, 0x66 / 255, 0x40 / 255],
    fogColorGreen = [0xB9 / 255, 0xB9 / 255, 0x30 / 255, 0x30 / 255],
    fogColorBlue = [0xA9 / 255, 0xA9 / 255, 0x80 / 255, 0x66 / 255];

var DayNightCycle = function DayNightCycle (renderer, fog, directionalLight, hemisphereLight, sun) {
    this.renderer = renderer;
    this.fog = fog;
    this.directionalLight = directionalLight;
    this.hemisphereLight = hemisphereLight;
    this.sun = sun;
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

    var rampTime = (this.time % 500 / 500),
        ratioFog = Math.abs(Math.pow(Math.sin(rampTime * Math.PI), 1)),
        positionSunX = Math.sin((rampTime + 0) * Math.PI * 2),
        positionSunY = Math.cos((rampTime + 0) * Math.PI * 2);

    //var gameTime = (rampTime + 0.5) * 24 % 24 * 60 | 0;
    //console.log(gameTime / 60 | 0, ':', gameTime % 60);

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

    this.sun.position.set(positionSunX * 50000, positionSunY * 50000, 50000);
    this.renderer.setClearColor(this.fog.color, 1);
};

module.exports = DayNightCycle;
