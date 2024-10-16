const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/', movieController.getAllMovies);
router.post('/', movieController.createMovie);
router.get('/:id', movieController.getMovieById);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
