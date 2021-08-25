let MongoClient = require('mongodb').MongoClient;
let url = process.env["MONGODB_URL"];
let crypto = require('crypto');
let Web3 = require('web3')
let web3 = new Web3(new Web3.providers.HttpProvider("http://trailsblockrpc1.kkservice.cc:8502"));
const registerController = require('../controllers/registerController');
let contract_list = registerController.get_contract_list();
let db = null;
let register_db = null;
let count = 0;
let preBlockNum = 0;
let data = [
    {
        "index": 0,
        "current": {
            "CarId": "0",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        },
        "past": [{
            "CarId": "0",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        }, {
            "CarId": "0",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        }]
    },
    {
        'index': 1,
        "current": {
            "CarId": "1",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        },
        "past": [{
            "CarId": "1",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        }, {
            "CarId": "1",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        }]
    },
    {
        "index": 2,
        "current": {
            "CarId": "2",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        },
        "past": [{
            "CarId": "2",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        }, {
            "CarId": "2",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test1",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        }]
    },
    {
        "index": 3,
        "current": {
            "CarId": "2",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test1",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        },
        "past": [{
            "CarId": "2",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test1",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        }, {
            "CarId": "2",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test1",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        }]
    },
    {
        "index": 4,
        "current": {
            "CarId": "3",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        },
        "past": [{
            "CarId": "3",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        }, {
            "CarId": "3",
            "vin": "test",
            "longitude": "test",
            "latitude": "test",
            "timestamp": "test",
            "speed": "test",
            "acceleratorPos": "test",
            "breakingPos": "test",
            "PRNDL": "test",
            "travelDirection": "test",
            "steeringWheelPos": "test",
            "acceleration": "test",
            "tirePressureLF": "test",
            "tirePressureRF": "test",
            "tirePressureLR": "test",
            "tirePressureRR": "test",
            "status": "test",
            "note": "test",
        }]
    }
]
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    if (err) {
        console.log(err);
    }
    db = await client.db('CarData');
    register_db = db.collection('Registration')
    db = db.collection('Event')
    console.log('Database connected: Cardata');
    console.log(contract_list)
    // for(var i = 0;i<5;i++){
    //     var newobj = {
    //         carID:data[i]['current'].CarId,
    //         timestamp:data[i]['current'].timestamp,
    //         current_event:data[i]['current'],
    //         past_event:data[i]['past'],
    //         index:data[i]['index']
    //     }
    //     db.insertOne(newobj, function(err, res) {
    //         if (err) throw err;
    //         console.log("1 document inserted");
    //     });
    // }
    // db.deleteMany({}, function(err, res) {
    //             if (err) throw err;
    //             console.log("document deleted");
    //         });
    // let result = await db.find({}).toArray();
    // console.log(result)
});
async function getcarID(address) {
    return new Promise(async (resolve, reject) => {
        let car_obj = await register_db.find({ contractAddress: address }).toArray();
        console.log(car_obj)
        carid = car_obj[0].carID;
        console.log("carid")
        console.log(carid)
        resolve(carid);
    })
}
async function getCarData(carid) {
    let check = await db.find({ carID: carid }).toArray();
    console.log('check')
    console.log(check)
    return check;
}
async function checkBlock() {
    let block = await web3.eth.getBlock('latest');
    let number = block.number;
    if (preBlockNum == number)
        return;
    preBlockNum = number;
    console.log("Searching block" + number)
    console.log(block.transactions)
    if (block != null && block.transactions != null) {
        for (let txHash of block.transactions) {
            web3.eth.getTransactionReceipt(txHash)
                .then(async function (result) {
                    if (result.logs[0] != undefined) {
                        const index = contract_list.indexOf(result.logs[0].address);
                        let carid = await getcarID(result.logs[0].address);
                        if (index > -1) {
                            const typesArray = [
                                { type: 'string', name: 'data' },
                            ];
                            const decodedParameters = web3.eth.abi.decodeParameters(typesArray, result.logs[0].data);
                            // console.log(decodedParameters.data)
                            let data = JSON.parse(JSON.parse(decodedParameters.data))
                            // console.log(data['criticalEvent'])
                            let c_data = data["criticalEvent"]
                            console.log(data)
                            console.log(c_data)
                            let e_data = data.eventList
                            // let check = getCarData(carid)
                            // if (check.length == 0) {
                            var newobj = {
                                "carID": carid,
                                "timestamp": c_data.timestamp,
                                "criticalEvent": c_data,
                                "eventList": e_data,
                                "index": count
                            }
                            console.log('newobj')
                            console.log(newobj)
                            count = count + 1;
                            db.insertOne(newobj, function (err, res) {
                                if (err) throw err;
                                console.log("1 document inserted");
                            });
                            // }
                            // else {
                            //     var newobj = {
                            //         timestamp: c_data.timestamp,
                            //         criticalEvent: c_data,
                            //         eventList: e_data
                            //     }
                            //     db.updateOne({ 'carID': carid }, { $set: newobj })
                            //     console.log("update succeed")
                            // }
                        }
                    }
                });
        }
    }

}

setInterval(() => {
    checkBlock()
}, 1 * 1000)

const getList = async (req, res) => {
    console.log(req.query.carID);
    let all = await db.find({}).toArray();
    console.log(all)
    let result = await db.find({ carID: req.query.carID }).toArray();
    console.log(result);
    return res.status(200).json({ code: 20000, data: result })
    // res.send(result);
}
const fetchallList = async (req, res) => {
    let result = await db.find({}).toArray();
    return res.status(200).json({ code: 20000, data: result })
    // res.send(result);
}
// const addCar = async (req,res) => {
//     console.log(req.body)
//     var newobj = {
//                     carAddress:req.body.carAddress,
//                     carID:'1',
//                     contractAddress:"A1234567890"
//                  }
//     db.insertOne(newobj, function(err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//       });

//       return res.status(200).json({code:20000,data:newobj})
// }
// const deleteCar = async (req,res) => {
//     console.log("id")
//     var id = req.params.id;
//     console.log(id)
//     var myquery = {carAddress:id};
//     db.deleteOne(myquery,function(err,res){
//         if (err) throw err;
//         console.log("1 document deleted");
//     })

//     return res.status(200).json({code: 20000, data: 'success'})
// }
module.exports = {
    getList,
    fetchallList
}