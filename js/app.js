"use strict"
let webble    = require("ruuvi.webbluetooth.js");
let endpoints = require("ruuvi.endpoints.js");

let device = {};

var connect = function(device)
{
	device = webble.connect(device);
}