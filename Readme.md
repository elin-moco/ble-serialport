BleSerialPort
=============

A virtual [node-serialport] implementation that uses [BLE] as the transport.

# Prerequisites

First you need [git] and [node.js] to clone this repo and install dependencies:
```
git clone https://github.com/elin-moco/ble-serialport
cd ble-serialport
npm install
```

Secondly, you'll need an [Arduino] board with [BleShield] added on top of it, 
put an LED on pin 7, connect Arduino to you computer, 
and upload this [BleFirmataSketch] firmware to it.

To use BLE to send/receive data to the device with [firmata] or [Johnny Five],
run below gulp tasks to [browserify] them like:
```
gulp build
```

You'll find the browserified scripts in `build` folder 


# Use with Johnny Five

Include Johnny Five bundle script in your html file:
```html
  <script type="text/javascript" src="j5-bundle.js"></script>
```
To use with [node.js], you'll need these two require statements:
```javascript
var BleSerialPort = require('ble-serialport').SerialPort;
var five = require('johnny-five');
```

Then use it directly in your script:
```javascript
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


# Use with Firmata

Include the firmata bundle script in your html file:
```html
  <script type="text/javascript" src="firmata-bundle.js"></script>
```
To use with [node.js], you'll need these two require statements:
```javascript
var BleSerialPort = require('ble-serialport').SerialPort;
var firmata = require('firmata');
```

Then use it directly in your script:
```javascript
var bsp = new BleSerialPort({address: 'd0:6a:cf:58:ee:bd'}); //put your device name or address here
bsp.connect().then(function() {
  var board = new firmata.Board(sp);
  board.on('ready', function() {
    board.digitalWrite(7, board.HIGH);
  });
});

```

And you should see the LED on once you have the webapp(page) opened.


# Runing Examples

For the [fxos-j5] and [cordova-j5] example,
run following commands to copy bundle script to example/fxos-j5 directory:
```
gulp dist
```

For the [fxos-j5] example,
modify example/fxos-j5/fxos-j5.js for your device address.  
Then install app via WebIDE.

For the node-j5 and node-firmata examples, just update the address and run with:
```
node node-firmata.js
```
or
```
node node-j.js
```

For the [cordova-j5] example,
See [cordova-j5] readme file for instructions for initialization and deployment.

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
[blue-yeast]: https://github.com/elin-moco/blue-yeast
[WebBluetooth V2 API]: https://wiki.mozilla.org/B2G/Bluetooth/WebBluetooth-v2
[browserify]: http://browserify.org/ 
[node.js]: https://nodejs.org/
[git]: https://git-scm.com/
[fxos-j5]: https://github.com/elin-moco/ble-serialport/tree/master/example/fxos-j5
[cordova-j5]: https://github.com/elin-moco/ble-serialport/tree/master/example/cordova-j5
