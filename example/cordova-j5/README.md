# Cordova Johnny Five Demo

This is a cordova demo app that connects Arduino using Johnny Five via BLE.

## Initialization

To initialize necessary plugin and platform files, 
you'll need to run following command for the first time:
```sh
cordova platform add android
cordova platform add ios
cordova plugin add com.megster.cordova.ble
```

## Build and Run

on Android device:
```sh
$ cordova build android 
$ cordova run android --device
```

on iOS device:
```sh
$ cordova build ios 
$ cordova run ios
```

