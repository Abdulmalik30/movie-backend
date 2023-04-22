const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router
  .get('/', userController.getUser)
  .post('/watchlist/add', userController.handleWatchlist)
  .delete('/watchlist/delete/:id', userController.deleteFromWatchlist);

module.exports = router;
