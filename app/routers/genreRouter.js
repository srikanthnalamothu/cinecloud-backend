const express = require('express');
const genreController = require('../controllers/genreController');

const router = express.Router();

router.get('/', genreController.getAllGenres);
router.post('/', genreController.createGenre);
router.get('/:id', genreController.getGenreById);
router.put('/:id', genreController.updateGenre);
router.delete('/:id', genreController.deleteGenre);

module.exports = router;
