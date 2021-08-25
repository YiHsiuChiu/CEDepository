var mqtt = require('mqtt');
var client  = mqtt.connect('tcp://localhost:1883');
// var client = mqtt.connect('mqtt://test.mosquitto.org');

let packet =
{
    "vin": "aji0922",
    "longitude": "24.25",
    "latitude": "124.25",
    "deviceId": "d001",
    "timestamp": "1622480521",
    "speed": 20,
    "acceleratorPos": 10,
    "breakingPos": 10,
    "PRNDL": "P",
    "travelDirection": "",
    "steeringWheelPos": 20,
    "tirePressureLF": 36,
    "tirePressureRF": 36,
    "tirePressureLR": 36,
    "tirePressureRR": 36,
    "status": {},
    "acceleration": "[0,0,0]",
    "note": "",
}

client.on('connect', function () {
    client.publish('getData', JSON.stringify(packet), { qos: 1});
    console.log('publish:', JSON.stringify(packet));
    client.end();
});