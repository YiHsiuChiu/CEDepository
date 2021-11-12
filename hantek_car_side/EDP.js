require('dotenv').config();
var mqtt = require('mqtt');
var mqttclient = mqtt.connect(process.env["MQTT_URL"]);
var hantekMqttTopic = process.env["HANTEK_MQTT_TOPIC"];
var request = require('request');
var mongoclient = require('mongodb').MongoClient;
var mongourl = process.env["MONGO_URL"];
const EventEmitter = require('events');
const dataProcessor = new EventEmitter();
var gatewayServer = process.env['GATEWAY_URL'];
var carAddress = process.env['CAR_ADDRESS'];

var CEDP = require('./CEDP.js');

let database = null;

let contractAbi = [
    {
        "inputs": [],
        "name": "readData",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "readID",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "input",
                "type": "string"
            }
        ],
        "name": "writeData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "input",
                "type": "string"
            }
        ],
        "name": "writeID",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

mqttclient.on('connect', async function () {
    console.log('--- EDP: connect on mqtt ---');
    // Connect to the db
    database = await connectDB();
    request(gatewayServer + '/gateway_hantek/getContractAddress/' + carAddress, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            let contractAddr = response.body
            console.log('--- blockchainGW: get contract address ---')
            cedp = new CEDP(contractAbi, contractAddr);
            mqttclient.subscribe(hantekMqttTopic, { qos: 1 });
        }
    });
});

mqttclient.on('message', async function (topic, message, packet) {
    // message is Buffer
    // console.log('message received on topic', topic, 'QoS:', packet.qos, 'RETAIN:', packet.retain);
    console.log('--- EDP: recieve data from mqtt ---')
    let data = message.toString().replace(/['"]+/g, '');

    let dataArray = data.split(',');

    if (dataArray[0] == '$HTP0') {
        let obj = {
            vin: dataArray[1],
            date: dataArray[2],
            time: dataArray[3],
            GPS_state: dataArray[4],
            longitude: dataArray[5],
            latitude: dataArray[6],
            bearing_angle: dataArray[7],
            speed: dataArray[8],
            engine_speed: dataArray[9],
            GPIO: dataArray[10],
            Voltage: dataArray[11],
            satellite_num: dataArray[12],
            dBm: dataArray[13],
            carrier_code: dataArray[14],
            connection: dataArray[15],
            event_header: dataArray[16],
            event_data: dataArray[17].split('*')[0],
            checksum: dataArray[17].split('*')[1]
        }
        // console.log(obj)
        writeData(obj);

        let raw = await cedp.signData(obj);
        console.log('--- EDP: send raw to blockchainGW ---')
        request.post({ url: gatewayServer + '/gateway_hantek/sendRawTransaction', form: { 'raw': raw } }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(response.body);
                console.log('--- blockchainGW: write data to blockchain ---')
            }
        })
    }

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
