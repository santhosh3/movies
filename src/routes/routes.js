const express = require("express");
const router = express.Router();

const {movies} = require('../controllers/movieController');
const {userCreation,login} = require('../controllers/userController');
const {watchList,getWatchListData,updateWatchListMovies} = require('../controllers/watchListController');
const {auth} = require('../middleware/auth')

router.post('/movies',movies);
router.post('/register',userCreation);
router.post('/login',login);
router.post('/watchList/:userId',watchList);
router.get('/watchList/:userId',auth,getWatchListData)
router.delete('/watchList/:userId',updateWatchListMovies)

module.exports = router