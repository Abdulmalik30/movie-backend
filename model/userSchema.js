const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const watchlistSchema = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  image: {
    type: String,
  },
});

const usersSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  watchlist: [watchlistSchema],
  refreshToken: String
});
const User = mongoose.model('User', usersSchema);
const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = { User, Watchlist };
