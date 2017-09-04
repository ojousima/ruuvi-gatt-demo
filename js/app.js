/*jshint 
    node: true
 */
"use strict";
var webble    = require("ruuvi.webbluetooth.js");
var $ = require('jquery');

var connect = async function(){
    console.log("connecting");
	let device = {};
	device = await webble.connect("Ruuvi");
	return device;
};

$('#connect-button').click(connect);