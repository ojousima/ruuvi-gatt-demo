/*jshint
    node: true
 */
"use strict";
const webble = require("ruuvi.webbluetooth.js");
const endpoints = require("ruuvi.endpoints.js");
const $ = require('jquery');
const graph = require('./graph.js');
const FileSaver = require('file-saver');
const deviceInfo = require('./device_information.js')

const GRAPH_ENDPOINT = 0x60;
const STDEV_ENDPOINT = 0x61;

const saveRaw = function() {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  let data = graph.rawLog;
  let blob = new Blob([data.join("\r\n")], {
    type: "text/plain;charset=utf-8"
  });
  FileSaver.saveAs(blob, Date() + "raw.csv");
}

const saveDSP = function() {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  let data = graph.dspLog;
  let blob = new Blob([data.join("\r\n")], {
    type: "text/plain;charset=utf-8"
  });
  FileSaver.saveAs(blob, Date() + "dsp.csv");
}
const toHexString = function(byteArray) {
  return Array.prototype.map.call(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join(' ');
}

let connected = false;
let uart = null;
let dis = null;
let device = null;

const handleIncomingData = async function(data)
{
  let bytes = new Uint8Array(data.buffer);
  $('#console_text').append('<<< 0x' + toHexString(bytes) + '\n');
  scrollToBottom("console_text");
}

const connect = async function() {
  let services = webble.getServices();
  uart = services["Nordic UART"];
  dis = services["Device Information"];
  await uart.registerNotifications(uart.TX.UUID, handleIncomingData);
  connected = true;
}

const connect_timeout = async function() {
  console.log("connecting");
  device = await webble.connect($('#device-name').val());
  Promise.race([
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000)),
    await connect()
  ]).catch(function(err) {
    console.log("Timeout in connection");
    device = null;
    uart = null;
    dis = null;
    connected = false;
  });
  if (device) {
    deviceInfo.update(dis, connected);
  }
  return device;
}

const configure = async function() {
  //XXX use ruuvi.endpoints.js create
  let continuousAcceleration = new Uint8Array([0x40, 0x60, 0x01, 25, 251, 10, 252, 1, 0, 2, 0]);
  let stdevAcceleration = new Uint8Array([0x50, 0x61, 0x16, 0x40, 1, 0, 0, 5, 25, 2, 0]);
  //await uart.writeCharacteristic(uart.RX.UUID, continuousAcceleration);
};

const disconnect = async function() {
  console.log("Disconnecting");
  if (device) {
    try {
      webble.disconnect(device);
    } catch (err) {
      console.log("Error while disconnecting: " + err);
    }
  }
  connected = false;
  uart = null;
  dis = null;
  device = null;
  deviceInfo.update(dis, connected);
}

const configure_environmental = async function() {
  let destination = 0x3A;
  let source = 0x01;
  let type = 0x01;
  let samplerate = 1;
  let transmissionrate = 1;
  let resolution = 252;
  let scale = 252;
  let dsp = 0;
  let dsp_param = 0;
  let channel = $('#led-channel').val();
  let power = $('#led-power').val();
  let cmd = new Uint8Array([destination, source, type, samplerate, transmissionrate, resolution, scale, 0, 0, 0, 0]);
  $('#console_text').append('>>> 0x' + toHexString(cmd) + '\n');
  try {
    uart.writeCharacteristic(uart.RX.UUID, cmd);
  } catch (err) {
    console.log(err);
  }
}

const stop_environmental = async function() {
  let destination = 0x3A;
  let source = 0x01;
  let type = 0x01;
  let samplerate = 0;
  let transmissionrate = 0;
  let resolution = 252;
  let scale = 252;
  let dsp = 0;
  let dsp_param = 0;
  let channel = $('#led-channel').val();
  let power = $('#led-power').val();
  let cmd = new Uint8Array([destination, source, type, samplerate, transmissionrate, resolution, scale, 0, 0, 0, 0]);
  $('#console_text').append('>>> 0x' + toHexString(cmd) + '\n');
  try {
    uart.writeCharacteristic(uart.RX.UUID, cmd);
  } catch (err) {
    console.log(err);
  }
}

const configure_led = async function() {
  let destination = 0x2A;
  let source = 0x01;
  let type = 0x02;
  let channel = $('#led-channel').val();
  let power = $('#led-power').val();
  let cmd = new Uint8Array([destination, source, type, channel, power, 0, 0, 0, 0, 0, 0]);
  $('#console_text').append('>>> 0x' + toHexString(cmd) + '\n');
  try {
    uart.writeCharacteristic(uart.RX.UUID, cmd);
  } catch (err) {
    console.log(err);
  }
}

const scrollToBottom = function(id) {
  $('#' + id).scrollTop($('#' + id)[0].scrollHeight);
}

const init = function() {
  $('#connect-button').click(connect_timeout);
  $('#disconnect-button').click(disconnect);
  $('#led-configure').click(configure_led);
  $('#environmental_start').click(configure_environmental);
  $('#environmental_stop').click(stop_environmental);
  graph.initGraph();
}

const delayed_init = function() {
  window.setTimeout(init, 1000);
}
module.exports = {
  INIT: delayed_init
}