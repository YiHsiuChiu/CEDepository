var mqtt = require('mqtt');
var client = mqtt.connect('tcp://localhost:1883');
var delay = require('delay');
// var client = mqtt.connect('mqtt://test.mosquitto.org');

let packet1 =
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
    "steeringWheelPos": 121,
    "tirePressureLF": 36,
    "tirePressureRF": 36,
    "tirePressureLR": 36,
    "tirePressureRR": 36,
    "status": {},
    "acceleration": [0, 0, 0],
    "note": "",
}

let packet2 =
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
    "acceleration": [0.31, 0, 0],
    "note": "1",
}

client.on('connect', async function () {
    // client.publish('getData', JSON.stringify(packet2), { qos: 1});
    // console.log('publish: trigger');
    // await delay(1000);
    // for(var i =0 ; i<39 ; i++){
    //     if(i==9||i==11||i==13||i==15||i==17||i==19||i==38){
    //         packet2.note = i+2;
    //         client.publish('getData', JSON.stringify(packet2), { qos: 1});
    //         console.log('publish: trigger');
    //     }
    //     else{
    //         packet1.note = i+2;
    //         client.publish('getData', JSON.stringify(packet1), { qos: 1});
    //         console.log('publish:', i+1);
    //     }
    //     // console.log('publish:', JSON.stringify(packet));
    //     await delay(1000);
    // }

    for (var i = 0; i < 16; i++) {
        client.publish('getData', JSON.stringify(packet1), { qos: 1 });
        console.log('publish:', i + 1);

        // console.log('publish:', JSON.stringify(packet));
        await delay(1000);
    }


    client.end();
});