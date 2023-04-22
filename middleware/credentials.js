const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.indexOf(origin) !== -1) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  // } else {
  //   res.set('Access-Control-Allow-Origin', origin);
  //   res.set('Access-Control-Allow-Credentials', true);
  // }

  next();
};

module.exports = credentials;
