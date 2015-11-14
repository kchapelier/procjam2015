"use strict";

var howler = require('howler');

var dictionary = {};

module.exports = {
    load: function (id, filename, volume, buffered, looping) {
        dictionary[id] = new howler.Howl({
            urls: ['./assets/sounds/' + filename + '.ogg', './assets/sounds/' + filename + '.wav'],
            autoplay: false,
            loop: !!looping,
            buffer: !!buffered,
            volume: volume || 0.75
        });
    },
    get: function (id) {
        if (!!dictionary[id]) {
            return dictionary[id];
        }
    },
    play: function (id) {
        if (!!dictionary[id]) {
            return dictionary[id].play();
        }

        return false;
    }
};
