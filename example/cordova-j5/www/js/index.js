/* global five,BleSerialPort */
'use strict';

var app = {

  initialize: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },

  onDeviceReady: function() {
    app.receivedEvent('deviceready');

    var toggle = document.getElementById('led-toggle');
    var bsp = new BleSerialPort({address: 'd0:6a:cf:58:ee:bd'});

    bsp.connect().then(function() {
      console.log('BleSerialPort connected');
      var board = new five.Board({port: bsp, repl: false});
      board.on('ready', function() {
        console.log('Arduino connected');
        var led = new five.Led(7);
        led.blink();
        toggle.addEventListener('change', function() {
          if (this.checked) {
            led.blink();
          } else {
            led.stop();
          }
        });
      });
    });
  },

  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
};

app.initialize();
