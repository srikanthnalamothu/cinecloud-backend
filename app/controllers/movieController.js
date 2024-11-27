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

exports.getMoviesByBulk = async (req, res) => {
  try {
    const { movieIds } = req.body;

    // Validate input
    if (!movieIds || !Array.isArray(movieIds)) {
      return res.status(400).json({ 
        message: 'Invalid request. movieIds must be an array.' 
      });
    }

    // Filter out any non-numeric values and duplicates
    const validIds = [...new Set(movieIds.filter(id => !isNaN(id)))];

    if (validIds.length === 0) {
      return res.json([]); // Return empty array if no valid IDs
    }

    const movies = await Movie.findAll({
      where: {
        id: {
          [Op.in]: validIds
        }
      },
      order: [['createdAt', 'DESC']] // Optional: sort by newest first
    });

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies by bulk:', error);
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

exports.streamMovie = async (req, res) => {
  const { id } = req.params;
  
  try {
    
    // Get movie details
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Get video path
    const videoPath = path.join(__dirname, '../../movies', movie.videoUrl);

    // Stream the video
    const stat = fs.statSync(videoPath);
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stat.size
    });

    const readStream = fs.createReadStream(videoPath);
    readStream.pipe(res);

  } catch (error) {
    console.error('Error streaming movie:', error);
    res.status(500).json({ message: 'Error streaming video' });
  }
};

exports.getRecommendations = async (req, res) => {
  const userId = req.query.user_id;
  const RECOMMENDATION_LIMIT = 15;

  try {
    // If no user_id, return random recommendations
    if (!userId) {
      const randomMovies = await Movie.findAll({
        order: db.sequelize.random(),
        limit: RECOMMENDATION_LIMIT,
        include: [
          { 
            model: Genre,
            as: 'genreDetails'
          },
          { 
            model: Language,
            as: 'languageDetails'
          }
        ]
      });
      return res.json(randomMovies);
    }

    // Get user's watched movies from orders
    const userOrders = await Order.findAll({
      where: { user_id: userId },
      include: [{
        model: Movie,
        include: [
          { 
            model: Genre,
            as: 'genreDetails'
          },
          { 
            model: Language,
            as: 'languageDetails'
          }
        ]
      }]
    });

    // If user has no orders, return random recommendations
    if (!userOrders.length) {
      const randomMovies = await Movie.findAll({
        order: db.sequelize.random(),
        limit: RECOMMENDATION_LIMIT,
        include: [
          { 
            model: Genre,
            as: 'genreDetails'
          },
          { 
            model: Language,
            as: 'languageDetails'
          }
        ]
      });
      return res.json(randomMovies);
    }

    // Extract user preferences
    const moviePreferences = {};
    const watchedMovieIds = new Set();

    userOrders.forEach(order => {
      order.Movies.forEach(movie => {
        watchedMovieIds.add(movie.id);
        
        // Count genre preferences
        if (!moviePreferences[movie.genre_id]) {
          moviePreferences[movie.genre_id] = {
            count: 0,
            language_ids: new Set()
          };
        }
        moviePreferences[movie.genre_id].count++;
        moviePreferences[movie.genre_id].language_ids.add(movie.language_id);
      });
    });

    // Sort genres by preference count
    const sortedGenres = Object.entries(moviePreferences)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([genreId]) => genreId);

    // Get preferred languages across all watched movies
    const preferredLanguages = new Set();
    Object.values(moviePreferences).forEach(pref => {
      pref.language_ids.forEach(langId => preferredLanguages.add(langId));
    });

    // Get recommendations based on preferences
    const recommendations = await Movie.findAll({
      where: {
        id: { [Op.notIn]: Array.from(watchedMovieIds) }, // Exclude watched movies
        [Op.or]: [
          { genre_id: { [Op.in]: sortedGenres } },
          { language_id: { [Op.in]: Array.from(preferredLanguages) } }
        ]
      },
      include: [
        { 
          model: Genre,
          as: 'genreDetails'
        },
        { 
          model: Language,
          as: 'languageDetails'
        }
      ],
      order: [
        // Order by matching both genre and language
        db.sequelize.literal(`
          CASE 
            WHEN genre_id IN (${sortedGenres.join(',') || 0}) 
            AND language_id IN (${Array.from(preferredLanguages).join(',') || 0}) THEN 1
            WHEN genre_id IN (${sortedGenres.join(',') || 0}) THEN 2
            WHEN language_id IN (${Array.from(preferredLanguages).join(',') || 0}) THEN 3
            ELSE 4
          END
        `),
        db.sequelize.random() // Add randomness within each category
      ],
      limit: RECOMMENDATION_LIMIT
    });

    // If not enough recommendations, fill with random movies
    if (recommendations.length < RECOMMENDATION_LIMIT) {
      const remainingCount = RECOMMENDATION_LIMIT - recommendations.length;
      const existingIds = new Set([...watchedMovieIds, ...recommendations.map(m => m.id)]);

      const additionalMovies = await Movie.findAll({
        where: {
          id: { [Op.notIn]: Array.from(existingIds) }
        },
        order: db.sequelize.random(),
        limit: remainingCount,
        include: [
          { 
            model: Genre,
            as: 'genreDetails'
          },
          { 
            model: Language,
            as: 'languageDetails'
          }
        ]
      });

      recommendations.push(...additionalMovies);
    }

    // Calculate and add similarity scores
    const recommendationsWithScores = recommendations.map(movie => {
      const genreMatch = sortedGenres.includes(movie.genre_id);
      const languageMatch = preferredLanguages.has(movie.language_id);
      
      // Simple scoring: genre match (0.6) + language match (0.4)
      const similarityScore = (genreMatch ? 0.6 : 0) + (languageMatch ? 0.4 : 0);

      return {
        ...movie.toJSON(),
        similarityScore: Number(similarityScore.toFixed(2))
      };
    });

    res.json(recommendationsWithScores);

  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ 
      message: 'Error generating recommendations',
      error: error.message 
    });
  }
};