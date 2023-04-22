const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../model/userSchema');

const handleRegister = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res
      .status(400)
      .json({ message: 'username, email and password are required' });

  const duplicate = await User.findOne({ email });
  if (duplicate)
    return res
      .status(409)
      .json({ message: 'user already exists please login instead' });

  const hashedPwd = await bcrypt.hash(password, 10);

  const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign(
    { username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );
  const createdUser = await User.create({
    username,
    email,
    password: hashedPwd,
    refreshToken,
  });
  // console.log(createdUser);(
  res.cookie('jwt', refreshToken, {
    sameSite: 'None',
    maxAge: 24 * 7 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  });
  res.json({ accessToken });
};

module.exports = { handleRegister };
