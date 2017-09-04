(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jshint 
    node: true
 */
"use strict";
let webble    = require("ruuvi.webbluetooth.js");

async function connect(deviceName){
    
	let device = {};
	device = await webble.connect(deviceName);
	return device;
};
},{"ruuvi.webbluetooth.js":2}],2:[function(require,module,exports){
"use strict"

let connect = async function(deviceNamePrefix){
  let handle = {};
  try {
      let filters = [];
      filters.push({namePrefix: deviceNamePrefix});
      let options = {};
      options.filters = filters;
      let device = await navigator.bluetooth.requestDevice(options);
      handle = await this.device.gatt.connect();
    } catch (error) {
      console.log("Error: " + error);
    }
  return handle;
}

let disconnect = async function(serverHandle){
  try {
    serverHandle.disconnect();
  } catch(error) {
    console.log("Error: " + error);
  }
}

let getServices = async function(serverHandle){
  let services = {};
  try{
    //TODO
  } catch(error) {
    console.log("Error: " + error);
  }
}

/**
 *  connect(deviceNamePrefix) Starts asynchronous search for devices which advertise name that starts with prefix.
 *                            Example: connect("Ruuvi") to connect to devices with name "RuuviTag".
 *                            Returns handle of the connection
 *  disconnect(connection)    Disconnects given connection.
 *  getServices(connection)   Returns array of service objects of given connection.
 **/
module.exports = {
  connect           : connect,
  disconnect        : disconnect,
  getServices       : getServices
}
},{}]},{},[1]);
