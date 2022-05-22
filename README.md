<p align="center">
  <a href="https://github.com/homebridge/homebridge"><img src="https://raw.githubusercontent.com/homebridge/branding/master/logos/homebridge-color-round-stylized.png" height="140"></a>
</p>

<span align="center">

# homebridge-switch-piface

[![npm](https://img.shields.io/npm/v/homebridge-switch-piface.svg)](https://www.npmjs.com/package/homebridge-switch-piface) [![npm](https://img.shields.io/npm/dt/homebridge-switch-piface.svg)](https://www.npmjs.com/package/homebridge-switch-piface)

</span>

## Description
With this plugin, you can create switches that will control Piface outputs.

This fork is adapted from [homebridge-dummy](https://github.com/nfarina/homebridge-dummy).

Example config.json:

```
    "accessories": [
        {
          "accessory": "PifaceSwitch",
          "output": 0,
          "name": "My Switch"
        }   
    ]
```

## Installation

On a fresh installation you should enable SPI.

Therefore start `raspi-config` -> `Interface Options` -> `SPI` -> `Yes`.

Reboot the RPi.

#### Install necessary libraries

```
git clone https://github.com/piface/libmcp23s17.git
cd libmcp23s17/
make
sudo make install
cd ..
```

```
git clone https://github.com/piface/libpifacedigital.git
cd libpifacedigital/
make
sudo make install
cd ..
```

#### Install the plugin
Use Homebridge web UI
or
```
hb-service add homebrige-switch-piface
```

## Stateful Switches

The default behavior of a switch is to turn itself off one second after being turned on. However you may want to create a switch that remains on and must be manually turned off. You can do this by passing an argument in your config.json:

```
    "accessories": [
        {
          "accessory": "PifaceSwitch",
          "output": 0,
          "name": "My Stateful Switch",
          "stateful": true
        }   
    ]

```

## Reverse Switches

You may also want to create a switch that turns itself on one second after being turned off. This can be done by passing the 'reverse' argument in your config.json:

```
    "accessories": [
        {
          "accessory": "PifaceSwitch",
          "output": 0,
          "name": "My Reverse Switch",
          "reverse": true
        }   
    ]

```

## Timed Switches

You may also want to create a timed switch that turns itself off after being on for a given time (for example, five seconds). This can be done by passing the 'time' argument in your config.json:

```
    "accessories": [
        {
          "accessory": "PifaceSwitch",
          "output": 0,
          "name": "My Timed Switch",
          "time": 5000
        }   
    ]

```

## Resettable Timed Switches

You may also want to create a timed switch that is reset each time it is activated. This way, the original timer is reset instead of creating a new timer. 
This can be done by passing the 'resettable' argument in your config.json:

```
    "accessories": [
        {
          "accessory": "PifaceSwitch",
          "output": 0,
          "name": "My Stateful Switch",
          "time": 5000,
          "resettable": true
        }   
    ]

```
