BleSerialPort
=============

A virtual [node-serialport] implementation that uses [BLE] as the transport.

# Installation

```
npm install ble-serialport
```

# Usage

Firstly, you'll need an [Arduino] board with [BleShield] added on top of it, put an LED on pin 7,
upload this [BleFirmataSketch] firmware to it.

To use BLE to send/receive data to the device with firmata,  
make sure you have [firmata] and ble-serialport installed:
```
cd examples
npm install ble-serialport
npm install firmata
```

Modify device address(or name) in firmataExample.js
```js
var BleSerialPort = require('ble-serialport').SerialPort;
var firmata = require('firmata');
var bsp = new BleSerialPort({address: 'd0:6a:cf:58:ee:bd'});
bsp.connect().then(function() {
  var board = new firmata.Board(sp);
  board.on('ready', function() {
    board.digitalWrite(7, board.HIGH);
  });
});

```

Run browserify to bring node.js code to the web:
```
browserify firmataExample.js -o firmataExampleBundle.js -i debug -i serialport -i browser-serialport
```

Include it in your html file:
```html
  <script type="text/javascript" src="firmataExampleBundle.js"></script>
```

And you'll see the LED on once you have the webapp(page) opened.

# Support

Currently this implementation uses [WebBluetooth V2 API](https://wiki.mozilla.org/B2G/Bluetooth/WebBluetooth-v2) on FxOS,
which is still experimental and requires certified permissions for now.

For the hardware part, now only tested with [Arduino]+[BleShield], might need some tweaks for different BLE modules.

See [blue-yeast] if you are interested in enabling this for other platforms.

[BLE]: https://en.wikipedia.org/wiki/Bluetooth_low_energy
[Arduino]: http://arduino.cc/
[BleShield]: http://redbearlab.com/bleshield/
[node-serialport]: https://github.com/voodootikigod/node-serialport
[firmata]: https://github.com/jgautier/firmata/ 
[BleFirmataSketch]: https://codebender.cc/sketch:128276
[blue-yeast]: https://github.com/evanxd/blue-yeast
[WebBluetooth V2 API]: https://wiki.mozilla.org/B2G/Bluetooth/WebBluetooth-v2