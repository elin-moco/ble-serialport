'use strict';

var util = require('util');
var stream = require('stream');
require('blue-yeast');


function BleSerialPort(options) {
  this.options = options;
}

util.inherits(BleSerialPort, stream.Stream);

BleSerialPort.prototype.connect = function () {
  var self = this;
  return new Promise(function(resolve, reject) {
    try{
      self.ble = Bluetooth;
      self.device = self.ble.addDevice(self.options.name, self.options.address);
      self.device.on('connect', function() {
        this.startNotifications();
        resolve();
      });
    } catch(exp){
      reject();
      console.info('error on message', exp);
      self.emit('error', 'error receiving message: ' + exp);
    }
    self.buffer = null;

    var START_SYSEX = 0xF0;
    var END_SYSEX = 0xF7;

    self.device.on('data', function(data){
      try{
        console.info('received', self._toHexString(data));
        data = new Uint8Array(data);
        console.info('received', data);
        if (null !== self.buffer) {
          console.log('Appending SYSEX response');
          self.buffer = self._concatBuffer(self.buffer, data);
          if (data[data.length - 1] === END_SYSEX) {
            console.log('Sending SYSEX response');
            //end of SYSEX response
            self.emit('data', self.buffer);
            self.buffer = null;
          }
        }
        else if (data[0] === START_SYSEX &&
          data[data.length - 1] !== END_SYSEX) {
          //SYSEX response incomplete, wait for END_SYSEX byte
          console.log('Begin of SYSEX response');
          self.buffer = data;
        }
        else {
          self.emit('data', data);
        }
      } catch(exp){
        console.info('error on message', exp);
        self.emit('error', 'error receiving message: ' + exp);
      }
    });
    self.device.on('error', reject);
  });
};

BleSerialPort.prototype.open = function (callback) {
  if (callback) {
    callback();
  }
};



BleSerialPort.prototype.write = function (data, callback) {

  console.info('sending data:', this._toHexString(data.buffer));

  this.device.send(data);
};



BleSerialPort.prototype.close = function (callback) {
  console.info('closing');
  if(callback){
    callback();
  }
};

BleSerialPort.prototype.flush = function (callback) {
  console.info('flush');
  if(callback){
    callback();
  }
};

BleSerialPort.prototype.drain = function (callback) {
  console.info('drain');
  if(callback){
    callback();
  }
};

BleSerialPort.prototype._concatBuffer = function( buffer1, buffer2 ) {
  var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
  tmp.set( buffer1 , 0 );
  tmp.set( buffer2, buffer1.byteLength );
  return tmp;
};

BleSerialPort.prototype._parseHexString = function(str) {
  var arrayBuffer = new ArrayBuffer(Math.ceil(str.length / 2));
  var uint8Array = new Uint8Array(arrayBuffer);

  for (var i = 0, j = 0; i < str.length; i += 2, j++) {
    uint8Array[j] = parseInt(str.substr(i, 2), 16);
  }
  console.log(uint8Array);
  return arrayBuffer;
};

BleSerialPort.prototype._toHexString = function(arrayBuffer) {
  var str = '';
  if (arrayBuffer) {
    console.log(arrayBuffer);
    var uint8Array = new Uint8Array(arrayBuffer);
    for (var i = 0; i < uint8Array.length; i++) {
      var b = uint8Array[i].toString(16);
      if (b.length == 1) {
        str += '0'
      }
      str += b;
    }
  }
  return str;
};

module.exports = {
  SerialPort: BleSerialPort
};
