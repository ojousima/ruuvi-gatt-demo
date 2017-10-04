/*jshint 
    node: true
 */
"use strict";
var webble    = require("ruuvi.webbluetooth.js");
var endpoints = require("ruuvi.endpoints.js");
var $ = require('jquery');
var graph = require('./graph.js');

var GRAPH_ENDPOINT = 0x50;
var STDEV_ENDPOINT = 0x50;




//https://jsfiddle.net/dvuyka/z8ouj1np/
var saveData = function() {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  let data = accelerationLog;
  let blob = new Blob([data.join()], {type: "octet/stream"});
  let url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = "data.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

var connected = false;
var uart = {};

var connect = async function(){
  console.log("connecting");
  let device = {};
  device = await webble.connect("Ruuvi");
  now = new Date().getTime();
  let services = webble.getServices();
  uart = services["Nordic UART"];
  await uart.registerNotifications(uart.TX.UUID, graph.addToDataSets);

  return device;
};

var configure = async function(){
  //XXX use ruuvi.endpoints.js create
  let continuousAcceleration = new Uint8Array([0x40,0x60,0x01,25,251,10,252,1,0,2,0]);
  let stdevAcceleration      = new Uint8Array([0x50,0x61,0x16,0x40,1,0,0,5,25,2,0]);
  //await uart.writeCharacteristic(uart.RX.UUID, continuousAcceleration);
};

$('#connect-button').click(connect);
$('#configure-button').click(configure);
$('#save-button').click(saveData);
graph.initGraph();

