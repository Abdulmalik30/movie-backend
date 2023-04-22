const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../model/userSchema');

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: 'email and password are required to login' });

  const foundUser = await User.findOne({ email });
  if (!foundUser)
    return res
      .status(401)
      .json({ message: 'user does not exist please sign up instead' });

  let accessToken = '';
  let refreshToken = '';
  const validPwd = await bcrypt.compare(password, foundUser.password);

  if (validPwd) {
    accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    foundUser.refreshToken = refreshToken;
    await foundUser.save();
  } else {
    return res.status(401).json({ message: 'invalid email or password' });
  }

  res.cookie('jwt', refreshToken, {
    sameSite: 'none',
    maxAge: 24 * 7 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  });
  res.json({ accessToken });
};

module.exports = { handleLogin };
