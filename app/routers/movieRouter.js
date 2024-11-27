const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();

router.get('/', movieController.getAllMovies);
router.get('/recommendations', movieController.getRecommendations);
  // Route for streaming
  router.get(
    '/:id/play',
    movieController.streamMovie
  );
router.post('/bulk', movieController.getMoviesByBulk);
router.post('/', movieController.createMovie);
router.get('/:id', movieController.getMovieById);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);


module.exports = router;
