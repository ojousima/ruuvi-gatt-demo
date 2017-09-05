/*jshint 
    node: true
 */
"use strict";
var webble    = require("ruuvi.webbluetooth.js");
var $ = require('jquery');
var smoothie = require('smoothie');

var now = 0;
var addAccelerationToDataSets = function (data) {

  valueArray = new Uint16Array(data, 3);
  
  now += 10;
  for (var i = 0; i < dataSets.length; i++) {
    dataSets[i].append(time, valueArray[i]);
  }
};

var seriesOptions = [
  { strokeStyle: 'rgba(255, 0, 0, 1)', fillStyle: 'rgba(255, 0, 0, 0.1)', lineWidth: 3 },
  { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.1)', lineWidth: 3 },
  { strokeStyle: 'rgba(0, 0, 255, 1)', fillStyle: 'rgba(0, 0, 255, 0.1)', lineWidth: 3 },
  { strokeStyle: 'rgba(255, 255, 0, 1)', fillStyle: 'rgba(255, 255, 0, 0.1)', lineWidth: 3 }
];

var initGraph = function() {

  // Initialize an empty TimeSeries for each CPU.
  var accelerationData = [new smoothie.TimeSeries(), new smoothie.TimeSeries(), new smoothie.TimeSeries(), new smoothie.TimeSeries()];


  // Build the timeline
  var timeline = new smoothie.SmoothieChart({ responsive: true, millisPerPixel: 20, grid: { strokeStyle: '#555555', lineWidth: 1, millisPerLine: 1000, verticalSections: 4 }});
  for (var i = 0; i < accelerationData.length; i++) {
    timeline.addTimeSeries(accelerationData[i], seriesOptions[i]);
  }
  timeline.streamTo($("#chart")[0], 1000);
};


var connect = async function(){
    console.log("connecting");
	let device = {};
	device = await webble.connect("Ruuvi");
	now = new Date().getTime();
	initGraph();
	let services = webble.getServices();
	let uart = 	services["Nordic UART"];
	await uart.registerNotifications(uart.RX.uuid, addAccelerationToDataSets);
	//XXX use ruuvi.endpoints.js create
    let continuousAcceleration = new Uint8Array([0x40,0x60,0x01,100,251,10,252,1,0,2,0]);
	await uart.writeCharacteristic(uart.TX.uuid, continuousAcceleration);
	return device;
};

$('#connect-button').click(connect);

