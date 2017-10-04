/*jshint 
    node: true
 */
"use strict";
var smoothie = require('smoothie');
var $ = require('jquery');

var seriesOptions = [
  { strokeStyle: 'rgba(255, 0, 0, 1)', fillStyle: 'rgba(255, 0, 0, 0.1)', lineWidth: 3 },
  { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.1)', lineWidth: 3 },
  { strokeStyle: 'rgba(0, 0, 255, 1)', fillStyle: 'rgba(0, 0, 255, 0.1)', lineWidth: 3 },
  { strokeStyle: 'rgba(255, 255, 0, 1)', fillStyle: 'rgba(255, 255, 0, 0.1)', lineWidth: 3 }
];

var now = 0;
var rawData = [new smoothie.TimeSeries(), new smoothie.TimeSeries(), new smoothie.TimeSeries(), new smoothie.TimeSeries()];
var rawLog = [];
var dspData = [new smoothie.TimeSeries(), new smoothie.TimeSeries(), new smoothie.TimeSeries(), new smoothie.TimeSeries()];
var dspLog = [];

var initGraph = function() {

  // Build the timeline
  var raw_timeline = new smoothie.SmoothieChart({ responsive: true, millisPerPixel: 40, grid: { strokeStyle: '#555555', lineWidth: 1, millisPerLine: 2000, verticalSections: 4 }});
  for (var i = 0; i < rawData.length; i++) {
    raw_timeline.addTimeSeries(rawData[i], seriesOptions[i]);
  }
  raw_timeline.streamTo($("#raw_chart")[0], 1000);

  var dsp_timeline = new smoothie.SmoothieChart({ responsive: true, millisPerPixel: 40, grid: { strokeStyle: '#555555', lineWidth: 1, millisPerLine: 2000, verticalSections: 4 }});
  for (var i = 0; i < dspData.length; i++) {
    dsp_timeline.addTimeSeries(dspData[i], seriesOptions[i]);
  }
  dsp_timeline.streamTo($("#dsp_chart")[0], 1000);
};

var addToDataSets = function (data) {

  let header = data.buffer.slice(0, 3);
  let payload = data.buffer.slice(3, data.byteLength);
  let valueArray = new DataView(payload);
  let headerArray = new DataView(header);
  
  if(headerArray.getUint8(0) == 0x60)
  {
    now += 40;
    let rtc = new Date().getTime();
    if(rtc-now > 500){ now = rtc};
    let graphLogEntry = [];
    graphLogEntry.push(now);
    for (var i = 0; i < rawData.length; i++) {
      rawData[i].append(now, valueArray.getInt16(i*2, true));
      graphLogEntry.push(valueArray.getInt16(i*2, true));
    }
    rawLog.push(graphLogEntry);
  }
  if(headerArray.getUint8(0) == 0x61)
  {
    let rtc = new Date().getTime();
    let graphLogEntry = [];
    graphLogEntry.push(rtc);
    for (var i = 0; i < dspData.length; i++) {
      dspData[i].append(now, valueArray.getInt16(i*2, true));
      graphLogEntry.push(valueArray.getInt16(i*2, true));
    }
    dspLog.push(graphLogEntry);
  }    
};

module.exports = {
	initGraph: initGraph,
	addToDataSets: addToDataSets,
  rawLog: rawLog,
  dspLog: dspLog
};
