"use strict";

var Generator = require('./generator/generator'),
    Chunk = require('./entities/chunk');

var World = function World (seed, renderer, player, radiusVisibility, options) {
    this.seed = seed;
    this.renderer = renderer;
    this.player = player;
    this.radiusVisibility = radiusVisibility || 1;

    this.chunks = {};
    this.collisionObjects = [];
    this.dirty = false;

    var self = this;

    this.generator = new Generator(seed, options, function (error, chunk) {
        self.chunks[chunk.x + ',' + chunk.y] = chunk;

        renderer.addToScene(chunk.ground);

        if (chunk.building) {
            renderer.addToScene(chunk.building);
        }

        if (chunk.particles) {
            renderer.addToScene(chunk.particles);
        }
    });
};

World.prototype.seed = null;
World.prototype.renderer = null;
World.prototype.player = null;
World.prototype.playerChunkX = null;
World.prototype.playerChunkY = null;
World.prototype.radiusVisibility = null;

World.prototype.chunks = null;
World.prototype.collisionObjects = null;

var currentAndAdjacent = [[0,0], [1,0], [0,1], [-1,0], [0,-1]];

World.prototype.update = function () {
    var newChunkX = (Math.floor(0.5 + this.player.position.x / 6400)),
        newChunkY = (Math.floor(0.5 + this.player.position.z / 6400));

    if (newChunkX !== this.playerChunkX || newChunkY !== this.playerChunkY) {
        this.playerChunkX = newChunkX;
        this.playerChunkY = newChunkY;
        this.dirty = true;

        //update the collisionObjects
        this.collisionObjects.length = 0;
    }

    if (this.collisionObjects.length === 0) {
        for (var i = 0; i < currentAndAdjacent.length; i++) {
            var chunk = this.chunks[(newChunkX + currentAndAdjacent[i][0]) + ',' + (newChunkY + currentAndAdjacent[i][1])];

            if (chunk && chunk.ground) {
                this.collisionObjects.push(chunk.ground, chunk.building);
            }
        }
    }
};

World.prototype.postRender = function () {
    // if we changed chunk, check and load any missing chunk in the visibility
    if (this.dirty) {
        var minX = this.playerChunkX - this.radiusVisibility,
            maxX = this.playerChunkX + this.radiusVisibility,
            minY = this.playerChunkY - this.radiusVisibility,
            maxY = this.playerChunkY + this.radiusVisibility,
            x,
            y;

        for (x = minX; x <= maxX; x++) {
            for (y = minY; y <= maxY; y++) {
                if (!this.chunks[x+','+y]) {
                    this.generator.generate(x, y);
                    this.chunks[x+','+y] = true; // placeholder to avoid loading multiple times the same chunk
                }
            }
        }

        this.unloadDistantChunks(this.radiusVisibility * 2);

        this.dirty = false;
    }
};

World.prototype.unloadDistantChunks = function (maxDistance) {
    var keys = Object.keys(this.chunks),
        distance,
        key,
        chunk;

    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        chunk = this.chunks[key];

        distance = Math.max(Math.abs(this.playerChunkX - chunk.x), Math.abs(this.playerChunkY - chunk.y)); // chebyshevDistance

        if (distance > maxDistance) {
            this.renderer.removeFromScene(chunk.ground);

            if(chunk.building) {
                this.renderer.removeFromScene(chunk.building);
            }

            if(chunk.particles) {
                this.renderer.removeFromScene(chunk.particles);
            }

            this.chunks[key] = false;
        }
    }
};

module.exports = World;
