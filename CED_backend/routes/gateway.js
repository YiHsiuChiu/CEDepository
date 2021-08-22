var express = require('express');
var router = express.Router();
const gatewayController = require('../controllers/gatewayController');

router.get('/sendRawTransaction/:name', gatewayController.SendRawTransaction);

router.get('/getContractAddress/:name', gatewayController.GetContractAddress);

// router.get('/getContractAddress/:carAddress', function(req, res) {
//     console.log("ssss")
//     res.send('hello ' + req.params.name + '!');
//   });

module.exports = router;