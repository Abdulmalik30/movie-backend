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

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true, // allow cookies to be sent from the frontend
  })
);

// app.options('/refresh', cors());

app.get('/', (req, res) => {
  res.send('hello');
});

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
//
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PUT, DELETE, OPTIONS'
//   );
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });
//
// // Route to refresh access token
// app.options('/refresh', (req, res) => {
//   res.sendStatus(204);
// });
app.use('/refresh', require('./routes/refresh'));

// ROUTES THAT REQUIRES AUTH

app.use(verifyJWT);
app.use('/user', require('./routes/user'));
mongoose.connection.once('open', () => {
  app.listen(PORT);
  console.log(`started listening at port ${PORT}`);
});
