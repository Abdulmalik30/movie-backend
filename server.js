require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;
const verifyJWT = require('./middleware/verifyJWT');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const cors = require('cors');

mongoose
  .connect(DB_URI)
  .then((response) => console.log('connected to db'))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

app.use(express.json());
app.use(cookieParser());

const whitelist = ['http://localhost:5173', 'http://example2.com'];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.get('/', (req, res) => {
  res.send('hello');
});

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));

// ROUTES THAT REQUIRE AUTH

app.use(verifyJWT);
app.use('/user', require('./routes/user'));

mongoose.connection.once('open', () => {
  app.listen(PORT);
  console.log(`started listening at port ${PORT}`);
});
