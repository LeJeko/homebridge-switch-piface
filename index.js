"use strict";

var Service, Characteristic, HomebridgeAPI;
const { HomebridgeDummyVersion } = require('./package.json');

var PIFD = require('/usr/local/lib/node_modules/node-pifacedigital');
var pi = new PIFD.PIFaceDigital(0,false);

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  homebridge.registerAccessory("homebridge-switch-piface", "PifaceSwitch", PifaceSwitch);
}


function PifaceSwitch(log, config) {
  this.log = log;
  this.name = config.name;
  this.stateful = config.stateful;
  this.reverse = config.reverse;
  this.time = config.time ? config.time : 1000;		
  this.resettable = config.resettable;
  this.timer = null;
  this._service = new Service.Switch(this.name);
  
  this.informationService = new Service.AccessoryInformation();
  this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Homebridge')
      .setCharacteristic(Characteristic.Model, 'Piface Switch')
      // .setCharacteristic(Characteristic.FirmwareRevision, HomebridgeDummyVersion)
      // .setCharacteristic(Characteristic.SerialNumber, 'Dummy-' + this.name.replace(/\s/g, '-'));
  
  this.cacheDirectory = HomebridgeAPI.user.persistPath();
  this.storage = require('node-persist');
  this.storage.initSync({dir:this.cacheDirectory, forgiveParseErrors: true});
  
  this._service.getCharacteristic(Characteristic.On)
    .on('set', this._setOn.bind(this));

  if (this.reverse) this._service.setCharacteristic(Characteristic.On, true);

  if (this.stateful) {
	var cachedState = this.storage.getItemSync(this.name);
	if((cachedState === undefined) || (cachedState === false)) {
		this._service.setCharacteristic(Characteristic.On, false);
	} else {
		this._service.setCharacteristic(Characteristic.On, true);
	}
  }
}

PifaceSwitch.prototype.getServices = function() {
  return [this.informationService, this._service];
}

PifaceSwitch.prototype._setOn = function(on, callback) {

  this.log("Setting switch to " + on);

  if (on && !this.reverse && !this.stateful) {
    if (this.resettable) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(function() {
      pi.set(0,0);
      this._service.setCharacteristic(Characteristic.On, false);
    }.bind(this), this.time);
  } else if (!on && this.reverse && !this.stateful) {
    if (this.resettable) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(function() {
      pi.set(0,1);
      this._service.setCharacteristic(Characteristic.On, true);
    }.bind(this), this.time);
  }
  
  if (this.stateful) {
	this.storage.setItemSync(this.name, on);
  }
  
  callback();
}
