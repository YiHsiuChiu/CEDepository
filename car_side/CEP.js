const { fromEvent, of } = require('rxjs');
var CEDP = require('./CEDP.js');
var request = require('request');
var gatewayServer = process.env['GATEWAY_URL'];

const QueueLength = 30;

let dataQueue = [];
let dataQueueCount = 0;

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
    constructor(event,contractAddr) {
        let cedp = new CEDP(contractAbi, contractAddr);
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
            // console.log(dataQueue)
            if (dataQueue.length > 1) {
                if (crash(dataQueue[dataQueueCount-1], dataQueue[dataQueueCount-2])) {
                    let packet = {"criticalEvent":JSON.parse(data),"eventList":dataQueue}
                    // console.log(packet)
                    let raw = await cedp.signData(JSON.stringify(packet));
                    console.log('--- CEP: send raw to blockchainGW ---')
                    request.post({url:gatewayServer+'/gateway/sendRawTransaction', form: { 'raw': raw }}, function(error,response,body){
                        if (!error && response.statusCode == 200) {
                            // console.log(response.body);
                            console.log('--- blockchainGW: write data to blockchain ---')
                        }
                    })
                    // request(gatewayServer+'/gateway/sendRawTransaction/' + raw, function (error, response, body) {
                    //     if (!error && response.statusCode == 200) {
                    //         console.log(response.body);
                    //         console.log('--- blockchainGW: write data to blockchain ---')
                    //     }
                    // });
                }
            }
        });
    }
}

function crash(data0, data1) {
    // let cur = data0.acceleration.replace(/\s*/g, "").replace(/\[|\]/g, "").split(',');
    // let pre = data1.acceleration.replace(/\s*/g, "").replace(/\[|\]/g, "").split(',');
    let X0 = Math.abs(data0.acceleration[0]);
    let Y0 = Math.abs(data0.acceleration[1]);
    let X1 = Math.abs(data1.acceleration[0]);
    let Y1 = Math.abs(data1.acceleration[1]);
    let deltaX = Math.abs(X0 - X1);
    let deltaY = Math.abs(Y0 - Y1);

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