const { fromEvent, of } = require('rxjs');
var CEDP = require('./CEDP.js');
var request = require('request');
let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider("http://trailsblockrpc1.kkservice.cc:8502"));

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
let contractAddr = '0x91C8FD9C8537726A15465b7a81CBAcE64C547705';

let cedp = new CEDP(contractAbi, contractAddr);

class CEP {
    constructor(event) {
        const ob = fromEvent(event, 'read');
        ob.subscribe(async (data) => {
            console.log('--- CEP: recieve data from dataProcessor event ---')
            dataQueue.unshift(data);
            dataQueueCount += 1;
            if (dataQueueCount > QueueLength) {
                dataQueue.pop();
                dataQueueCount -= 1;
            }
            // console.log(dataQueue)
            if (dataQueue.length > 1) {
                if (crash(JSON.parse(dataQueue[0]), JSON.parse(dataQueue[1]))) {
                    let packet = {"criticalEvent":data,"eventList":dataQueue}
                    // console.log(JSON.stringify(packet));
                    let raw = await cedp.signData(JSON.stringify(packet));
                    // console.log(raw);
                    console.log('--- CEP: send raw to blockchainGW ---')
                    // request('http://140.119.163.196:5000/sendRawTransaction?raw=' + raw, function (error, response, body) {
                    //     if (!error && response.statusCode == 200) {
                    //         // console.log(response.body);
                    //         console.log('--- blockchainGW: write data to blockchain ---')
                    //     }
                    // });
                    web3.eth.sendSignedTransaction('0x' + raw).then(receipt => console.log(receipt));
                }
            }
        });
    }
}

function crash(data0, data1) {
    let X0 = Math.abs(data0.acceleration.replace(/\s*/g, "").substr(1, 1));
    let Y0 = Math.abs(data0.acceleration.replace(/\s*/g, "").substr(3, 1));
    let X1 = Math.abs(data1.acceleration.replace(/\s*/g, "").substr(1, 1));
    let Y1 = Math.abs(data1.acceleration.replace(/\s*/g, "").substr(3, 1));
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