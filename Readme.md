BleSerialPort
=============

A virtual [node-serialport] implementation that uses [BLE] as the transport.

# Installation

```
git clone https://github.com/elin-moco/ble-serialport
cd ble-serialport
npm install
```

# Usage

Firstly, you'll need an [Arduino] board with [BleShield] added on top of it, put an LED on pin 7,
upload this [BleFirmataSketch] firmware to it.

To use BLE to send/receive data to the device with [firmata] or [Johnny Five],  
run below gulp task to [browserify] them:
```
gulp build-j5
gulp build-firmata
```

Include it in your html file:
```html
  <script type="text/javascript" src="j5-bundle.js"></script>
```

Then use them directly in your script:
```js
var bsp = new BleSerialPort({address: 'd0:6a:cf:58:ee:bd'}); //put your device name or address here
bsp.connect().then(function() {
  var board = new five.Board({port: bsp, repl: false});
  board.on('ready', function() {
    var led = new five.Led(7);
    led.blink();
  });
});

```

And you should see the LED blinks once you have the webapp(page) opened.

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
[Johnny Five]: http://github.com/rwaldron/johnny-five/ 
[BleFirmataSketch]: https://codebender.cc/sketch:128276
[blue-yeast]: https://github.com/evanxd/blue-yeast
[WebBluetooth V2 API]: https://wiki.mozilla.org/B2G/Bluetooth/WebBluetooth-v2
[browserify]: http://browserify.org/ 
