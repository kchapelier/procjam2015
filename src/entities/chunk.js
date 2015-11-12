"use strict";

var Chunk = function Chunk (x, y, building, ground, particles) {
    this.x = x;
    this.y = y;
    this.building = building;
    this.ground = ground;
    this.particles = particles;
};

Chunk.prototype.x = null;
Chunk.prototype.y = null;
Chunk.prototype.building = null;
Chunk.prototype.ground = null;
Chunk.prototype.particles = null;

module.exports = Chunk;
