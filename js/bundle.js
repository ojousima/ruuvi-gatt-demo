(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict"
let webble    = require("ruuvi.webbluetooth.js");
let endpoints = require("ruuvi.endpoints.js");

let device = {};

var connect = function(device)
{
	device = webble.connect(device);
}
},{"ruuvi.endpoints.js":2,"ruuvi.webbluetooth.js":4}],2:[function(require,module,exports){
/*jshint 
    node: true,
    esversion: 6
 */
"use strict";
var parser        = require('./parser.js');

/**
 *  Takes UINT8_T array with 11 bytes as input
 *  Request Ruuvi Standard Message Object as output,
 *  usage: 
 *  let message = parseRuuviStandardMessage(buffer);
 *  message.source_endpoint
 *  message.destination_endpoint
 *  message.type
 *  message.payload.sample_rate
 *  message.payload.transmission_rate  
 *  // and so on. Payload fields are dependend on type.
 **/
var parse = function(serialBuffer){
  return parser(serialBuffer);	
};

/**
 * Takes Ruuvi Standard Message
 * and returns 11-byte long UINT8 array represenstation.
 *
 */
var create = function(message){
  console.log("TODO: handle: " + message);
};

module.exports = {
  parse: parse,
  create: create
};



},{"./parser.js":3}],3:[function(require,module,exports){
/*jshint 
    node: true
 */
"use strict";

let types = {
  SENSOR_CONFIGURATION:  0x01, // Configure sensor
  ACTUATOR_CONFIGRATION: 0x02, // Configure actuator
  ACKNOWLEDGEMENT:       0x03, // Acknowledge message
  STATUS_QUERY:          0x04, // Query status from endpoint - returns current configuration
  DATA_QUERY:            0x05, // Query data from endpoint - returns latest data
  LOG_QUERY:             0x06, // Query log from endpoint - initiates bulk write
  CAPABILITY_QUERY:      0x07, // Query endpoint capablities: samplerate, resolution, scale, log, power consumption with settings given in query
  SAMPLERATE_RESPONSE:   0x08,
  RESOLUTION_RESPONSE:   0x09,
  SCALE_RESPONSE:        0x10,
  LOG_RESPONSE:          0x11,
  POWER_RESPONSE:        0x12,
  TIMESTAMP:             0x13,
  UNKNOWN:               0x14,
  ERROR:                 0x15,
  UINT8:                 0x80, // Array of uint8
  INT8:                  0x81,
  UINT16:                0x82,
  INT16:                 0x83,
  UINT32:                0x84,
  INT32:                 0x85,
  UINT64:                0x86, // Single uint64
  INT64:                 0x87,
  ASCII:                 0x88  // ASCII array
};

/** 
 *  Parses given request payload into object.
 **/
let parseType = function(request, data)
{
    let valueArray = {};
    switch(request.type){
      case types.SENSOR_CONFIGURATION:
        request.payload.sample_rate = data[3];
        request.payload.transmission_rate = data[4];
        request.payload.resolution = data[5];
        request.payload.scale = data[6];
        request.payload.dsp_function = data[7];
        request.payload.dsp_parameter = data[8];
        request.payload.target = data[9];
        request.payload.reserved = data[10];
        break;
      case types.UINT8:
        request.payload.values = [];
        request.payload.values[0] = data[3];
        request.payload.values[1] = data[4];
        request.payload.values[2] = data[5];
        request.payload.values[3] = data[6];
        request.payload.values[4] = data[7];
        request.payload.values[5] = data[8];
        request.payload.values[6] = data[9];
        request.payload.values[7] = data[10];
        break;
      case types.INT8:
        valueArray = new Int8Array(data, 3);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        request.payload.values[1] = valueArray[1];
        request.payload.values[2] = valueArray[2];
        request.payload.values[3] = valueArray[3];
        request.payload.values[4] = valueArray[4];
        request.payload.values[5] = valueArray[5];
        request.payload.values[6] = valueArray[6];
        request.payload.values[7] = valueArray[7];
        break;
      case types.UINT16:
        valueArray = new Uint16Array(data, 3);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        request.payload.values[1] = valueArray[1];
        request.payload.values[2] = valueArray[2];
        request.payload.values[3] = valueArray[3];
        break;
      case types.INT16:
        valueArray = new Int16Array(data, 3);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        request.payload.values[1] = valueArray[1];
        request.payload.values[2] = valueArray[2];
        request.payload.values[3] = valueArray[3];
        break;
      case types.UINT32:
        valueArray = new Uint32Array(data, 3);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        request.payload.values[1] = valueArray[1];
        break;
      case types.INT32:
        valueArray = new Int32Array(data, 3);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0];
        request.payload.values[1] = valueArray[1];
        break;
      case types.UINT64:
        valueArray = new Uint32Array(data, 3);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0]<<32 + valueArray[1];
        break;
      case types.INT64:
        valueArray = new Int32Array(data, 3);
        request.payload.values = [];
        request.payload.values[0] = valueArray[0]<<32 + valueArray[1];
        break;
    }
};

let parseStandardMsg = function(request, data){
  request.source_endpoint = data[1];
  request.type = data[2];
  parseType(request, data);
};

/** Take raw uint8_t array from RuuviTag and parse it to a request object**/
module.exports = function(payload) {
  let data = new Uint8Array(payload);
  let request = {};
  request.destination_endpoint = data[0];
  if(request.destination_endpoint < 0xE0){
    parseStandardMsg(request, data);
  }
  else {
    request.index = data[1];
    request.payload = data.slice(2, data.length);
  }
  return request;
};
},{}],4:[function(require,module,exports){
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
