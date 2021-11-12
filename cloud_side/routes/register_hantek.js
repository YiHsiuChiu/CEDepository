var express = require('express');
var router = express.Router();
const registerController = require('../controllers/registerController_hantek');
// middleware that is specific to this router

router.post('/addCar',registerController.addCar );
router.get('/getCars',registerController.getCars );
router.delete('/deleteCar/:id',registerController.deleteCar );

module.exports = router;