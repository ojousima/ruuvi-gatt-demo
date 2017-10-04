/*jshint 
    node: true
 */
"use strict";
var smoothie = require('smoothie');

var seriesOptions = [
  { strokeStyle: 'rgba(255, 0, 0, 1)', fillStyle: 'rgba(255, 0, 0, 0.1)', lineWidth: 3 },
  { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.1)', lineWidth: 3 },
  { strokeStyle: 'rgba(0, 0, 255, 1)', fillStyle: 'rgba(0, 0, 255, 0.1)', lineWidth: 3 },
  { strokeStyle: 'rgba(255, 255, 0, 1)', fillStyle: 'rgba(255, 255, 0, 0.1)', lineWidth: 3 }
];

var initGraph = function() {

  // Build the timeline
  var timeline = new smoothie.SmoothieChart({ responsive: true, millisPerPixel: 40, grid: { strokeStyle: '#555555', lineWidth: 1, millisPerLine: 2000, verticalSections: 4 }});
  for (var i = 0; i < graphData.length; i++) {
    timeline.addTimeSeries(graphData[i], seriesOptions[i]);
  }
  timeline.streamTo($("#chart")[0], 1000);
};

var now = 0;
var graphData = [new smoothie.TimeSeries(), new smoothie.TimeSeries(), new smoothie.TimeSeries(), new smoothie.TimeSeries()];
var graphLog = [];
var addToDataSets = function (data) {

  let payload = data.buffer.slice(3, data.byteLength);
  let valueArray = new DataView(payload);
  //TODO: CHeck data destination endpoint
  
  now += 40;
  let rtc = new Date().getTime();
  if(rtc-now > 500){ now = rtc};
  let graphLogEntry = [];
  graphLogEntry.push(now);
  for (var i = 0; i < graphData.length; i++) {
    graphData[i].append(now, valueArray.getInt16(i*2, true));
    graphLogEntry.push(valueArray.getInt16(i*2, true));
  }
};

module.exports = {
	initGraph: initGraph,
	addToDataSets: addToDataSets
};
