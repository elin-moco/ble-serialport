/* global BleSerialPort,five */
'use strict';

(function() {
  var toggle = document.getElementById('led-toggle');
  var bsp = new BleSerialPort({address: 'd0:6a:cf:58:ee:bd'});

  bsp.connect().then(function() {
    var board = new five.Board({port: bsp, repl: false});

    board.on('ready', function() {
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
})();

