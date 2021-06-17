const router = require('express').Router();
const UserControllers = require('../controllers/UserControllers');

router.post('/register', UserControllers.register);
router.post('/login', UserControllers.login);
router.post('/google', UserControllers.loginGoogle);

module.exports = router;
