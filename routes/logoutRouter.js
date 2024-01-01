const express = require('express');
const { logoutUser } = require('../controller/logoutController');
const verifyJWT = require('../middleware/verifyJWT');
const router = express.Router();

router.use(verifyJWT);
router.post('/', logoutUser);

module.exports = router;