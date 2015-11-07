"use strict";

var Input = require('migl-input');

var input = new Input({
    action: {
        keys: ['<space>', 'X', '<pad1-button3>'],
        group: 'action'
    },
    up: {
        keys: ['<up>', 'W', '<pad1-button13>', '<pad1-axis2-negative>'],
        group: 'axisV'
    },
    down: {
        keys: ['<down>', 'S', '<pad1-button14>', '<pad1-axis2-positive>'],
        group: 'axisV'
    },
    left: {
        keys: ['<left>', 'A', '<pad1-button15>', '<pad1-axis1-negative>'],
        group: 'axisH'
    },
    right: {
        keys: ['<right>', 'D', '<pad1-button16>', '<pad1-axis1-positive>'],
        group: 'axisH'
    }
});

input.attach();

module.exports = input;
