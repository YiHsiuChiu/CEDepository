var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController')
const {admin_roles_check} = require('../utils/permission')


/* GET users listing. */
router.post('/login', userController.login);

router.get('/info', userController.info);

router.post('/register', userController.register);

router.post('/logout', userController.logout);

router.get('/', admin_roles_check, userController.getList);

router.post('/', admin_roles_check, userController.createUser);

router.patch('/', admin_roles_check, userController.updateUser);

router.delete('/', admin_roles_check, userController.deleteUser);


module.exports = router;

