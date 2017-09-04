/*jshint 
    node: true
 */
"use strict";
let webble    = require("ruuvi.webbluetooth.js");
require('jquery');

async function connect(deviceName){
    
	let device = {};
	device = await webble.connect(deviceName);
	return device;
};

$('#connect-button').click(connect("Ruuvi"));