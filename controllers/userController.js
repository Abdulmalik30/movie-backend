const { User, Watchlist } = require('../model/userSchema');

const getUser = async (req, res) => {
  const { username } = req.user;

  if (!username)
    return res.status(401).json({ message: 'invalid user please login ' });

  const foundUser = await User.findOne({ username })
    .populate({
      path: 'watchlist',
    })
    .select('-password -email');

  if (!foundUser)
    return res
      .status(401)
      .json({ message: 'user does not exist please sign up' });

  res.json({ foundUser });
};

const handleWatchlist = async (req, res) => {
  const { username } = req.user;

  if (!username)
    return res.status(401).json({ message: 'invalid user please login' });

  const { id, title, image } = req.body;

  if (!id || !title || !image)
    return res
      .status(400)
      .json({ message: 'id, image and title are required' });

  const watchlistId = req.params.id;

  //   if (!watchlistId) return res.status(400);

  try {
    const duplicate = await Watchlist.findById(watchlistId);

    if (duplicate)
      return res
        .status(409)
        .json({ message: 'movie already exists in watchlist' });

    const newMovie = new Watchlist({
      id,
      title,
      image,
    });
    const user = await User.findOne({ username });
    user.watchlist.push(newMovie);
    await user.save();

    res.json({ message: 'movie added to watchlist' });
  } catch (err) {
    console.log(error);
    res.status(500).json({ message: 'server error' });
  }
};

const deleteFromWatchlist = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;
  if (!username)
    return res
      .status(401)
      .json({ message: 'unAuthorized user please login again' });

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $pull: { watchlist: { _id: id } } }
    );
    if (!user)
      return res
        .status(400)
        .json({ message: 'movie does not exist in watchlist' });

    res.json({ message: 'movie successfully removed from watchlist' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'internal server error' });
  }
};

module.exports = { getUser, handleWatchlist, deleteFromWatchlist };
