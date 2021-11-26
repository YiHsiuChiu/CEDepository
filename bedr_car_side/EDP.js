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
    console.log('--- EDP: recieve data from mqtt ---')
    let data = message.toString();

    dataProcessor.emit('read', data);

    writeData(JSON.parse(data));
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
