const express = require('express');
const { authenticateUser } = require('../controller/authController');
const router = express.Router();

router.post('/', authenticateUser);

module.exports = router;