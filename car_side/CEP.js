const { fromEvent, of } = require('rxjs');
var CEDP = require('./CEDP.js');
var request = require('request');
var gatewayServer = process.env['GATEWAY_URL'];

const QueueLength = 15;

let dataQueue = [];
let dataQueueCount = 0;
let cedp = null;
let cedpMutex = true;
let scheduleCount = -1;
let scheduleData = null;


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

class CEP {
    constructor(event, contractAddr) {
        cedp = new CEDP(contractAbi, contractAddr);
        const ob = fromEvent(event, 'read');
        ob.subscribe(async (data) => {
            console.log('--- CEP: recieve data from dataProcessor event ---')
            // console.log(data)
            dataQueue.push(JSON.parse(data));
            dataQueueCount += 1;
            if (dataQueueCount > QueueLength) {
                dataQueue.shift();
                dataQueueCount -= 1;
            }
            if (scheduleCount >= 0) {
                scheduleCount++;
                if (scheduleCount >= 15) {
                    try {
                        await uploadData(scheduleData, dataQueue);
                        scheduleCount = -1;
                        scheduleData = null;
                        dataQueue = [];
                        dataQueueCount = 0;
                    } catch { }
                }
            }
            // console.log(dataQueue)
            if (crash(dataQueue, dataQueueCount)) {
                try {
                    await uploadData(data, dataQueue);
                    scheduleCount = 0;
                    scheduleData = data;
                    dataQueue = [];
                    dataQueueCount = 0;
                } catch { }
            }
        });
    }
}

function uploadData(critical, list) {
    return new Promise(async (resolve, reject) => {
        if (cedpMutex == false)
            return reject();
        cedpMutex = false;
        let packet = { "criticalEvent": JSON.parse(critical), "eventList": list }
        // console.log(packet)
        let raw = await cedp.signData(JSON.stringify(packet));
        console.log('--- CEP: send raw to blockchainGW ---')
        resolve();
        request.post({ url: gatewayServer + '/gateway/sendRawTransaction', form: { 'raw': raw } }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(response.body);
                console.log('--- blockchainGW: write data to blockchain ---')
                cedpMutex = true;
            }
        })
        // request(gatewayServer+'/gateway/sendRawTransaction/' + raw, function (error, response, body) {
        //     if (!error && response.statusCode == 200) {
        //         console.log(response.body);
        //         console.log('--- blockchainGW: write data to blockchain ---')
        //     }
        // });
    })
}

function crash(queue, count) {
    // let cur = data0.acceleration.replace(/\s*/g, "").replace(/\[|\]/g, "").split(',');
    // let pre = data1.acceleration.replace(/\s*/g, "").replace(/\[|\]/g, "").split(',');
    if (count == 0)
        return false;
    let X0 = Math.abs(queue[count - 1].acceleration[0]);
    let Y0 = Math.abs(queue[count - 1].acceleration[1]);
    let X1 = 0;
    let Y1 = 0;
    let deltaX = 0;
    let deltaY = 0;
    if (count >= 2) {
        X1 = Math.abs(queue[count - 2].acceleration[0]);
        Y1 = Math.abs(queue[count - 2].acceleration[1]);
        deltaX = Math.abs(X0 - X1);
        deltaY = Math.abs(Y0 - Y1);
    }

    // console.log("X:", X0);
    // console.log("Y:", Y0);
    // console.log("deltaX:", deltaX);
    // console.log("deltaY:", deltaY);

    if (X0 > 1.5 || Y0 > 1.5 || deltaX > 0.3 || deltaY > 0.3)
        return true;
    else
        return false;
}


module.exports = CEP;