require('dotenv').config();
var mqtt = require('mqtt');
var mqttclient = mqtt.connect(process.env["MQTT_URL"]);
var bedrMqttTopic = process.env["BEDR_MQTT_TOPIC"];
var request = require('request');
var mongoclient = require('mongodb').MongoClient;
var mongourl = process.env["MONGO_URL"];
const EventEmitter = require('events');
const dataProcessor = new EventEmitter();
var gatewayServer = process.env['GATEWAY_URL'];
var carAddress = process.env['CAR_ADDRESS'];

var CEP = require('./CEP.js');

let database = null;

mqttclient.on('connect', async function () {
    console.log('--- EDP: connect on mqtt ---');
    // Connect to the db
    database = await connectDB();
    request(gatewayServer+'/gateway/getContractAddress/' + carAddress, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            let contractAddress = response.body
            console.log('--- blockchainGW: get contract address ---')
            let cep = new CEP(dataProcessor,contractAddress);
            mqttclient.subscribe(bedrMqttTopic, { qos: 1 });
        }
    });
});

mqttclient.on('message', async function (topic, message, packet) {
    // message is Buffer
    // console.log('message received on topic', topic, 'QoS:', packet.qos, 'RETAIN:', packet.retain);
    console.log('--- EDP: recieve data from mqtt ---')
    let data = message.toString();

    dataProcessor.emit('read', data);

    writeData(JSON.parse(data));
    // request('http://140.119.163.196:5000/backupData?data=' + data, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         // console.log(body);
    //         console.log('--- blockchainGW: backup data on mongoDB ---')
    //     }
    // });
    // request('http://148.72.213.191:5000/backupData?data=' + data, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         // console.log(body);
    //         console.log('--- backupServer: backup data on mongoDB ---')
    //     }
    // });

    // client.end();
});

function connectDB() {
    // Connect to the db
    return new Promise((resolve, reject) => {
        mongoclient.connect(mongourl, function (err, db) {
            if (err) throw err;
            resolve(db);
            console.log('--- EDP: connect on localDB ---');
            // db.close(); //關閉連線
        });
    });
}

function writeData(packet) {
    var dbo = database.db("CED");
    dbo.collection("EventData").insertOne(packet, function (err, res) {
        if (err) throw err;
    });
    console.log("--- EDP: insert data to localDB ---");
}
