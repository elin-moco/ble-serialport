/* global require */
'use strict';

(function(exports) {
  exports.BleSerialPort = require('./index').SerialPort;
  exports.firmata = require('firmata');
}(window));
