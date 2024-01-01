const express = require('express');
const { registerUser } = require('../controller/registerController');
const router = express.Router();

router.post('/', registerUser);

module.exports = router;