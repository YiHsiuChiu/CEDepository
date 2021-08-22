var mqtt = require('mqtt');
// var mqttclient = mqtt.connect('tcp://localhost:1883');
var mqttclient = mqtt.connect('mqtt://test.mosquitto.org');
var request = require('request');
// var mongoclient = require('mongodb').MongoClient;
const EventEmitter = require('events');
const dataProcessor = new EventEmitter();

var CEP = require('./CEP.js');

let cep = new CEP(dataProcessor);

let database = null;

mqttclient.on('connect', async function () {
    console.log('--- EDP: connect on mqtt ---');
    // Connect to the db
    // database = await connectDB();
    mqttclient.subscribe('getData', { qos: 1 });
});

mqttclient.on('message', async function (topic, message, packet) {
    // message is Buffer
    // console.log('message received on topic', topic, 'QoS:', packet.qos, 'RETAIN:', packet.retain);
    console.log('--- EDP: recieve data from mqtt ---')
    let data = message.toString();

    dataProcessor.emit('read', data);

    // writeData(JSON.parse(data));
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
        mongoclient.connect("mongodb://localhost:27017/", function (err, db) {
            if (err) throw err;
            resolve(db);
            console.log('mongodb is running!');
            // db.close(); //關閉連線
        });
    });
}

function writeData(packet) {
    var dbo = database.db("ITRI");
    dbo.collection("CarData").insertOne(packet, function (err, res) {
        if (err) throw err;
    });
    console.log("--- EDP: insert data to localDB ---");
}
