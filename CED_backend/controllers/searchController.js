let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/CarData"
let crypto = require('crypto');
let Web3 = require('web3')
let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
const registerController = require('../controllers/registerController');
let contract_list = registerController.get_contract_list();
let db = null;
let register_db = null;
let count = 0;
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
    register_db =db.collection('Registration')
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
async function getcarID(address){
    let car_obj = await register_db.find({ contractAddress:address}).toArray();
    console.log(car_obj)
    carid = car_obj[0].carID;
    console.log("carid")
    console.log(carid)
    return carid;
}
async function checkBlock() {
    let block = await web3.eth.getBlock('latest');
    let number = block.number;
    console.log("Searching block" + number)
    console.log(block.transactions)
    if (block != null && block.transactions != null) {
        for (let txHash of block.transactions) {
            web3.eth.getTransactionReceipt(txHash)
                .then(function (result) {
                    if(result.logs[0]!=undefined){
                        const index = contract_list.indexOf(result.logs[0].address);
                        let carid = getcarID(result.logs[0].address);
                        if (index > -1) {
                            const typesArray = [
                                { type: 'string', name: 'data' },
                            ];
                            const decodedParameters = web3.eth.abi.decodeParameters(typesArray, result.logs[0].data);
                            console.log(decodedParameters)
                            var newobj = {
                                carID: carid,
                                timestamp: data[i]['current'].timestamp,
                                criticalEvent: data[i]['current'],
                                eventList: data[i]['past'],
                                index: count
                            }
                            count=count+1;
                            db.updateOne({carID:carid}, {$set: newobj})
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
    let result = await db.find({ carID: req.query.carID }).toArray();
    // console.log(result);
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