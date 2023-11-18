const express = require('express');

const router = express.Router();
const generalController = require('../controllers/generalControllers');

router.post('/register',generalController.handleRegister);
router.post('/login',generalController.handleLogin);

module.exports = router;