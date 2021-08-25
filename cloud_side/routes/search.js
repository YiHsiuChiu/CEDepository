var express = require('express');
var router = express.Router();
const searchController = require('../controllers/searchController');
// middleware that is specific to this router

router.get('/getList',searchController.getList );
router.get('/fetchallList',searchController.fetchallList );

module.exports = router;