/* global require */
'use strict';

(function(exports) {
  exports.BleSerialPort = require('./index').SerialPort;
  exports.five = require('johnny-five');
}(window));
