const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const { createChat, getChats, deleteChat } = require('../controller/chatsController');
const router = express.Router();

router.use(verifyJWT);
router.post('/', createChat);
router.get('/', getChats);
router.delete('/', deleteChat);

module.exports = router;