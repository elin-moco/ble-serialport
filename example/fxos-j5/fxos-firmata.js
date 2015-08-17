/* global BleSerialPort,firmata */
'use strict';

(function() {
  var toggle = document.getElementById('led-toggle');
  var bsp = new BleSerialPort({address: 'd0:6a:cf:58:ee:bd'});

  bsp.connect().then(function() {
    var board = new firmata.Board(bsp);

    board.on('ready', function() {
      board.digitalWrite(7, 1);
      toggle.addEventListener('change', function() {
        board.digitalWrite(7, this.checked);
      });
    });
  });
})();
