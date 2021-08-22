var http = require('http');
let Web3 = require('web3');
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/CarData"
let web3 = new Web3(new Web3.providers.HttpProvider("http://trailsblockrpc1.kkservice.cc:8502"));

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
	if (err) {
		console.log(err);
	}
	db = await client.db('CarData');
	db = db.collection('Registration')
	console.log('Database connected: Cardata');

});


router.get('/sendRawTransaction', async function (req, res) {
    const myURL = new URL(req.url, 'http://localhost:3000/');
    // console.log(myURL)
    console.log('get request (sendRawTransaction)');
    let raw = myURL.searchParams.get('raw');
    var result = await sendRawTransaction(raw);
    // console.log(result);
    res.end(JSON.stringify(result));
});

router.get('/getContractAddress', async function (req, res) {
    const myURL = new URL(req.url, 'http://localhost:3000/');
    // console.log(myURL)
    console.log('get request (sendRawTransaction)');
    let carAddress = myURL.searchParams.get('carAddress');
    var result = await getContractAddress(carAddress);
    // console.log(result);
    res.end(JSON.stringify(result));
});


function sendRawTransaction(raw) {
    // Connect to the db
    return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction('0x' + raw).then(receipt => resolve(receipt))
    });
}
function getContractAddress(carAddress) {
    // Connect to the db
    return new Promise((resolve, reject) => {
        let result = await db.find({carAddress:carAddress}).toArray();
        console.log(result)
        // web3.eth.sendSignedTransaction('0x' + raw).then(receipt => resolve(receipt))
    });
}