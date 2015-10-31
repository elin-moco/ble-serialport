/* global process, require, module */
'use strict';

require('./polyfills');
var util = require('util');
var stream = require('stream');
if (process) {
  if (process.browser) {
    require('blue-yeast');
  } else {
    var Bluetooth = require('blue-yeast').Bluetooth;
  }
}

function BleSerialPort(options) {
  this.options = options;
}

util.inherits(BleSerialPort, stream.Stream);

BleSerialPort.prototype.connect = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    try {
      if (process.browser) {
        self.ble = window.Bluetooth;
      } else {
        self.ble = Bluetooth;
      }
      self.device = self.ble.connect(self.options.name, self.options.address);
      self.device.on('connect', function() {
        this.startNotifications();
        resolve();
      });
    } catch (exp) {
      reject();
      console.error('error on message', exp);
      self.emit('error', 'error receiving message: ' + exp);
    }
    self.buffer = null;

    var START_SYSEX = 0xF0;
    var END_SYSEX = 0xF7;

    self.device.on('data', function(data) {
      try {
        data = new Uint8Array(data);
        if (null !== self.buffer) {
          self.buffer = self._concatBuffer(self.buffer, data);
          if (data[data.length - 1] === END_SYSEX) {
            //end of SYSEX response
            self.emit('data', self.buffer);
            self.buffer = null;
          }
        } else if (data[0] === START_SYSEX &&
          data[data.length - 1] !== END_SYSEX) {
          //SYSEX response incomplete, wait for END_SYSEX byte
          self.buffer = data;
        } else {
          self.emit('data', data);
        }
      } catch (exp) {
        console.error('error on message', exp);
        self.emit('error', 'error receiving message: ' + exp);
      }
    });
    self.device.on('error', reject);
  });
};

BleSerialPort.prototype.disconnect = function() {
  return this.device.disconnect();
};

BleSerialPort.prototype.open = function(callback) {
  if (callback) {
    callback();
  }
};

BleSerialPort.prototype.write = function(data, callback) {
  this.device.send(data);
};

BleSerialPort.prototype.close = function(callback) {
  if (callback) {
    callback();
  }
};

BleSerialPort.prototype.flush = function(callback) {
  if (callback) {
    callback();
  }
};

BleSerialPort.prototype.drain = function(callback) {
  if (callback) {
    callback();
  }
};

BleSerialPort.prototype._concatBuffer = function(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(buffer1 , 0);
  tmp.set(buffer2, buffer1.byteLength);
  return tmp;
};

BleSerialPort.prototype._parseHexString = function(str) {
  var arrayBuffer = new ArrayBuffer(Math.ceil(str.length / 2));
  var uint8Array = new Uint8Array(arrayBuffer);

  for (var i = 0, j = 0; i < str.length; i += 2, j++) {
    uint8Array[j] = parseInt(str.substr(i, 2), 16);
  }
  return arrayBuffer;
};

BleSerialPort.prototype._toHexString = function(arrayBuffer) {
  var str = '';
  if (arrayBuffer) {
    var uint8Array = new Uint8Array(arrayBuffer);
    for (var i = 0; i < uint8Array.length; i++) {
      var b = uint8Array[i].toString(16);
      if (b.length == 1) {
        str += '0';
      }
      str += b;
    }
  }
  return str;
};

module.exports = {
  SerialPort: BleSerialPort
};
