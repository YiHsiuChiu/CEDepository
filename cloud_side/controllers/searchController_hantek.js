let MongoClient = require('mongodb').MongoClient;
let url = process.env["MONGODB_URL"];
let crypto = require('crypto');
let Web3 = require('web3')
let web3 = new Web3(new Web3.providers.HttpProvider("http://trailsblockrpc1.kkservice.cc:8502"));
const registerController = require('./registerController_hantek');
let contract_list = registerController.get_contract_list();
let db = null;
let register_db = null;
let count = 0;
let preBlockNum = 0;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    if (err) {
        console.log(err);
    }
    db = await client.db('hantek_CarData');
    register_db = db.collection('Registration')
    db = db.collection('Event')
});

async function getcarID(address) {
    return new Promise(async (resolve, reject) => {
        let car_obj = await register_db.find({ contractAddress: address }).toArray();
        carid = car_obj[0].carID;
        resolve(carid);
    })
}
async function getCarData(carid) {
    let check = await db.find({ carID: carid }).toArray();
    return check;
}
// Listen to the blockchain to get the transactions
async function checkBlock() {
    let block = await web3.eth.getBlock('latest');
    let number = block.number;
    if (preBlockNum == number)
        return;
    preBlockNum = number;
    if (block != null && block.transactions != null) {
        for (let txHash of block.transactions) {
            web3.eth.getTransactionReceipt(txHash)
                .then(async function (result) {
                    if (result.logs[0] != undefined) {
                        // check whether the contract is in the contract_list
                        const index = contract_list.indexOf(result.logs[0].address);
                        if (index > -1) {
                            let carid = await getcarID(result.logs[0].address);
                            const typesArray = [
                                { type: 'string', name: 'data' },
                            ];
                            const decodedParameters = web3.eth.abi.decodeParameters(typesArray, result.logs[0].data);
                            let data = JSON.parse(decodedParameters.data)
                            // insert new car data in the MongoDB
                            var newobj = {
                                "carID": carid,
                                "time": data['date']+','+data['time'],
                                "criticalEvent": data,
                                "index": count
                            }
                            count = count + 1;
                            db.insertOne(newobj, function (err, res) {
                                if (err) throw err;
                            });
                        }
                    }
                });
        }
    }

}
// check block 
setInterval(() => {
    checkBlock()
}, 1 * 1000)

const getList = async (req, res) => {
    let result = await db.find({ carID: req.query.carID }).toArray();
    return res.status(200).json({ code: 20000, data: result })
}

const fetchallList = async (req, res) => {
    let result = await db.find({}).toArray();
    return res.status(200).json({ code: 20000, data: result })
}

module.exports = {
    getList,
    fetchallList
}