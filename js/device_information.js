const $ = require('jquery');

const update = async function(device, connected) {
  if (connected) {
    $('#connection-status').text("Connected");
  } else {
    $('#connection-status').text("Disconnected");
  }

  $('#manufacturer').text("");
  $('#firmware').text("");
  $('#hardware').text("");

  if(device){
    try {
      let decoder = new TextDecoder("utf-8");
      let data = await device.readCharacteristic(device.Manufacturer.UUID);
      $('#manufacturer').text(decoder.decode(data));
      data = await device.readCharacteristic(device.Firmware.UUID);
      $('#firmware').text(decoder.decode(data));
      data = await device.readCharacteristic(device.Hardware.UUID);
      $('#hardware').text(decoder.decode(data));
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = {
  update: update
}