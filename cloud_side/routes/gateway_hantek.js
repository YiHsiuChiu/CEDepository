var express = require('express');
var router = express.Router();
const gatewayController = require('../controllers/gatewayController_hantek');

router.post('/sendRawTransaction/', gatewayController.SendRawTransaction);

router.get('/getContractAddress/:name', gatewayController.GetContractAddress);

module.exports = router;