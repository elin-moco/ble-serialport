/* global require */
'use strict';

var BleSerialPort = require('../index').SerialPort;
var firmata = require('firmata');
var bsp = new BleSerialPort({address: 'd0:6a:cf:58:ee:bd'});

bsp.connect().then(function() {
  var board = new firmata.Board(bsp);
  board.on('ready', function() {
    board.digitalWrite(7, 1);
  });
});
