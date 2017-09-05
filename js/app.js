/*jshint 
    node: true
 */
"use strict";
var webble    = require("ruuvi.webbluetooth.js");
var $ = require('jquery');
var smoothie = require('smoothie');


var addRandomValueToDataSets = function (time, dataSets) {
  for (var i = 0; i < dataSets.length; i++) {
    dataSets[i].append(time, Math.random());
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

  var now = new Date().getTime();
  for (var t = now - 1000 * 50; t <= now; t += 1000) {
    addRandomValueToDataSets(t, accelerationData);
  }
  // Every second, simulate a new set of readings being taken from each CPU.
  setInterval(function() {
    addRandomValueToDataSets(new Date().getTime(), accelerationData);
  }, 1000);

  // Build the timeline
  var timeline = new smoothie.SmoothieChart({ millisPerPixel: 20, grid: { strokeStyle: '#555555', lineWidth: 1, millisPerLine: 1000, verticalSections: 4 }});
  for (var i = 0; i < accelerationData.length; i++) {
    timeline.addTimeSeries(accelerationData[i], seriesOptions[i]);
  }
  timeline.streamTo($("#chart"), 1000);
};


var connect = async function(){
    console.log("connecting");
	let device = {};
	device = await webble.connect("Ruuvi");
	initGraph();
	return device;
};

$('#connect-button').click(connect);

