"use strict";

module.exports = {
    requestFullscreen: function (element) {
        element.requestFullscreen = element.requestFullscreen || element.msRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

        element.requestFullscreen();
    }
}
