const db = require("../models");
const { Op } = db.Sequelize;
const Movie = db.movie;
const path = require('path');
const fs = require('fs');
const Order = db.order;
const Genre = db.genre;
const Language = db.language;

// Controller actions for movie
exports.getAllMovies = async (req, res) => {
  try {
    const { genre_id, language_id, search } = req.query;
    
    const whereClause = {};
    
    // Check if genre_id is provided and not null
    if (genre_id !== undefined && genre_id !== null) {
      whereClause.genre_id = genre_id;
    }

    // Check if language_id is provided and not null
    if (language_id !== undefined && language_id !== null) {
      whereClause.language_id = language_id;
    }

    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const movies = await Movie.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']] // Optional: sort by newest first
    });

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.createMovie = async (req, res) => {
  const { title, description, releaseDate, runtime, imageUrl, genre_id, language_id, duration, videoUrl } = req.body;

  try {
    // Create a new movie using the Movie model
    const movie = await Movie.create({
      title,
      description,
      releaseDate,
      runtime,
      imageUrl,
      genre_id,
      language_id,
      duration,
      videoUrl,
    });

    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getMovieById = async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, description, releaseDate, imageUrl, genre_id, language_id,duration, videoUrl, cost } = req.body;

  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Update the movie's attributes
    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.releaseDate = releaseDate || movie.releaseDate;
    movie.duration = duration || movie.duration;
    movie.imageUrl = imageUrl || movie.imageUrl;
    movie.genre_id = genre_id || movie.genre_id;
    movie.language_id = language_id || movie.language_id;
    movie.videoUrl = videoUrl || movie.videoUrl;
    movie.cost = cost || movie.cost;

    // Save the updated movie to the database
    await movie.save();

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteMovie = async (req, res) => {
  const {id} = req.params;

  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await movie.destroy();
    return res.status(200).json({ message: 'Movie is Deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
