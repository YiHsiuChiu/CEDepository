var mqtt = require('mqtt');
var client  = mqtt.connect('tcp://localhost:1883');
var delay = require('delay');
// var client = mqtt.connect('mqtt://test.mosquitto.org');

let packet = '$HTP0,861108031692659,20211025,094620,V,+25.051421,+121.288013,195,0,0,11XXX000,16.1,0/0,-51,46689,3,000,;;*70'


client.on('connect', async function () {
    delay(3000);
    client.publish('hantek/vid', JSON.stringify(packet), { qos: 1});
    console.log('publish data')
    client.end();
});
