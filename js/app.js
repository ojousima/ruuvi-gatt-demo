/*jshint 
    node: true
 */
"use strict";
var webble    = require("ruuvi.webbluetooth.js");
var $ = require('jquery');

async function connect(deviceName){
    
	let device = {};
	device = await webble.connect(deviceName);
	return device;
};

$('#connect-button').click(connect("Ruuvi"));