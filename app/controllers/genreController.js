const db = require("../models");
const Genre = db.genre;

// Controller actions for genres
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll();
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createGenre = async (req, res) => {
  const { name, description, title } = req.body;

  try {
    const genre = await Genre.create({ name, description, title });
    res.status(201).json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getGenreById = async (req, res) => {
  const genreId = req.params.id;

  try {
    const genre = await Genre.findByPk(genreId);
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }
    res.json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateGenre = async (req, res) => {
  const genreId = req.params.id;
  const { name, description, title } = req.body;

  try {
    const genre = await Genre.findByPk(genreId);
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    genre.name = name || genre.name;
    genre.description = description || genre.description;
    genre.title = title || genre.title;
    await genre.save();

    res.json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteGenre = async (req, res) => {
  const genreId = req.params.id;

  try {
    const genre = await Genre.findByPk(genreId);
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    await genre.destroy();
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
