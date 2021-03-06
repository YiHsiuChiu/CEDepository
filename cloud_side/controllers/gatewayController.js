var http = require('http');
let Web3 = require('web3');
let MongoClient = require('mongodb').MongoClient;
let url = process.env["MONGODB_URL"];
let web3 = new Web3(new Web3.providers.HttpProvider("http://trailsblockrpc1.kkservice.cc:8502"));
let db = null;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    if (err) {
        console.log(err);
    }
    db = await client.db('CarData');
    db = db.collection('Registration')
    console.log('Database connected: Cardata');

});

function sendRawTransaction(raw) {
    // Connect to the db
    return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction('0x' + raw)
        .once('receipt', function(receipt){ resolve(receipt) })
        .on('error', function(error){ reject(error) })
        // .then(receipt => resolve(receipt))

    });
}
function getContractAddress(carAddress) {
    // Connect to the db
    return new Promise(async (resolve, reject) => {
        let result = await db.find({ carAddress: carAddress }).toArray();
        // console.log(result[0].contractAddress)
        resolve(result[0].contractAddress)
        // web3.eth.sendSignedTransaction('0x' + raw).then(receipt => resolve(receipt))
    });
}

async function SendRawTransaction(req, res) {
    // const myURL = new URL(req.url, 'http://localhost:3000/');
    // console.log(myURL)
    // console.log('get request (sendRawTransaction)');
    // let raw = myURL.searchParams.get('raw');
    // console.log(req.body.raw);
    try{
        var result = await sendRawTransaction(req.body.raw);
        // console.log(result);
        res.end(JSON.stringify(result));
    }catch (error) {
        res.status(404).end();
    }

    // console.log(result);
}

async function GetContractAddress(req, res) {
    // console.log(req.params.name)
    // const myURL = new URL(req.url, 'http://localhost:3000/');
    // console.log(myURL)
    // console.log('get request (sendRawTransaction)');
    // let carAddress = myURL.searchParams.get('carAddress');
    // console.log(carAddress)
    var result = await getContractAddress(req.params.name);
    // console.log(result);
    res.end(JSON.stringify(result));
}
module.exports = {
    SendRawTransaction,
    getContractAddress,
    GetContractAddress,
    sendRawTransaction
}
