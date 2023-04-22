const jwt = require('jsonwebtoken');
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(400).json({ message: 'auth header not found' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'invalid token' });
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;
