/*jshint
    node: true
 */
"use strict";
var webble    = require("ruuvi.webbluetooth.js");
var endpoints = require("ruuvi.endpoints.js");
var $ = require('jquery');
var graph = require('./graph.js');
var FileSaver = require('file-saver');

var GRAPH_ENDPOINT = 0x60;
var STDEV_ENDPOINT = 0x61;

var saveRaw = function() {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  let data = graph.rawLog;
  let blob = new Blob([data.join("\r\n")], {type: "text/plain;charset=utf-8"});
  FileSaver.saveAs(blob, Date() +"raw.csv");
}

var saveDSP = function() {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  let data = graph.dspLog;
  let blob = new Blob([data.join("\r\n")], {type: "text/plain;charset=utf-8"});
  FileSaver.saveAs(blob, Date() +"dsp.csv");
}

var connected = false;
var uart = {};

var connect = async function(){
  console.log("connecting");
  let device = {};
  device = await webble.connect("Ruuvi");
  let services = webble.getServices();
  uart = services["Nordic UART"];
  await uart.registerNotifications(uart.TX.UUID, graph.addToDataSets);
  //TODO: Check result, add connecting overlay
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
$('#save-raw-button').click(saveRaw);
$('#save-dsp-button').click(saveDSP);
graph.initGraph();