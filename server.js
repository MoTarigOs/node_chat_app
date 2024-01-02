
const connectDB = require('./config/dbConnection');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const { json } = require('body-parser');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;

connectDB();
app.use(express.urlencoded( { extended: false })); 
app.use(express.json());
app.use('/api/register', require('./routes/registerRouter'));
app.use('/api/login', require('./routes/authRouter'));
app.use('/api/logout', require('./routes/logoutRouter'));
app.use('/api/contacts', require('./routes/contactsRouter'));
app.use('/api/chat', require('./routes/chatRouter'));

mongoose.connection.once('open', () => {
    console.log('Connected!');
    app.listen(PORT, () => {console.log(`Server is running on port: ${PORT}`);});
});

fs.appendFile(path.join(__dirname, "log.log"), "New text appended to file");