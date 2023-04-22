const jwt = require('jsonwebtoken');
const { User } = require('../model/userSchema');

const handleRefresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies) return res.status(400).json({ message: 'cookie not found' });

  if (!cookies.jwt) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (foundUser.username !== decoded.username) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const username = decoded.username;
    const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1m',
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { handleRefresh };
