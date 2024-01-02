
const connectDB = require('./config/dbConnection');
const mongoose = require('mongoose');
require('dotenv').config();
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
const tooBusy = require('toobusy-js');

connectDB();
app.use(express.urlencoded( { extended: false })); 
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: ['https://motarigos.github.io/mosocial/*', 'https://motarigos.github.io', 'http://localhost:3000'], credentials: true, allowedHeaders: ['Content-Type', 'Authorization', 'authorization'] }));
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
app.use(function (req, res, next) {
  if(tooBusy()){
      return res.status(503).send("The server is too busy, please try again after a moment");
  } else {
      next();
  }
});
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