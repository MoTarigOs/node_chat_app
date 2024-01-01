const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const { createContact, getContacts, getContact, updateContact, deleteContact } = require('../controller/contactController');
const router = express.Router();

router.use(verifyJWT);

router.post('/', createContact);
router.get('/', getContacts);
router.put('/', updateContact);
router.get('/oneContact', getContact);
router.delete('/', deleteContact);

module.exports = router;