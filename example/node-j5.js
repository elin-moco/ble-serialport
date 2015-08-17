/* global require */
'use strict';

var BleSerialPort = require('../index').SerialPort;
var five = require('johnny-five');
var bsp = new BleSerialPort({address: 'd0:6a:cf:58:ee:bd'});

bsp.connect().then(function() {
  var board = new five.Board({port: bsp, repl: false});
  board.on('ready', function() {
    var led = new five.Led(7);
    led.blink();
  });
});
