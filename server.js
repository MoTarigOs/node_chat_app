
const connectDB = require('./config/dbConnection');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const { json } = require('body-parser');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimitMiddleware = require('./middleware/RateLimiter');
const buildLogger = require('./Logger/ProdLogger');
const logger = buildLogger();
const passport = require('passport');
const MemoryStore = require('memorystore')(session);
const LogErrors = require('./middleware/LogErrors');

connectDB();
app.use(express.urlencoded( { extended: false })); 
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: ['*'] }));
app.use(cookieParser());
app.use(session({
    secret: "my/secret09",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
}));
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded( { extended: false })); 
app.use(express.json({ limit: "10kb" }));
app.use(rateLimitMiddleware);
app.use('/api/register', require('./routes/registerRouter'));
app.use('/api/login', require('./routes/authRouter'));
app.use('/api/logout', require('./routes/logoutRouter'));
app.use('/api/contacts', require('./routes/contactsRouter'));
app.use('/api/chat', require('./routes/chatRouter'));

app.use(LogErrors);

app.disable('x-powered-by');

process.on("uncaughtException", (err) => {

  const errMsg = err.stack.toString().replaceAll(/[\n\r]/g, '');

  logger.error(errMsg, () => {
      mongoose.disconnect();
      process.exit(0);
  });

});

mongoose.connection.once('open', () => {
    console.log('Connected!');
    app.listen(PORT, () => {console.log(`Server is running on port: ${PORT}`);});
});

fs.appendFile(path.join(__dirname, "log.log"), "New text appended to file");