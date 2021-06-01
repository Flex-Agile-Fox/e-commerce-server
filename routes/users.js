const router = require('express').Router();
const UserControllers = require('../controllers/UserControllers');

router.post('/login', UserControllers.login);
router.post('/register', UserControllers.register);

module.exports = router;
