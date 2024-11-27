const db = require('../models'); // Import your models
const Order = db.order
const User = db.user
const Movie = db.movie

// Create a new order
exports.createOrder = async (req, res) => {
    const { userId, totalCost, movieIds,paymentId } = req.body;
  
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new order
      const order = await Order.create({
        totalCost,
        paymentId,
        ordered_date: new Date().toISOString(),
      });
  
      // Associate the order with the user
      await user.addOrder(order);
  
      // Associate the order with selected movies
      if (movieIds && movieIds.length > 0) {
        const selectedMovies = await Movie.findAll({ where: { id: movieIds } });
        if (selectedMovies.length > 0) {
          await order.addMovies(selectedMovies);
        }
      }
  
      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [{ model: Movie}],
      });
      res.status(200).json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
// Get an order by ID
exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByPk(id, {
        include: [{ model: Movie }],
      });
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
// Delete an order
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
  
    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      await order.destroy();
      return res.status(200).json({ message: 'Order is deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Get orders by user ID
exports.getOrdersByUserId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Retrieve orders associated with the user
      const orders = await user.getOrders({
        include: [{ model: Movie }],
      });
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Check if user has ordered a specific movie
exports.checkMovieOrderStatus = async (req, res) => {
  const { userId, movieId } = req.params;

  try {
    // First check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find orders for this user that include the specified movie
    const orders = await Order.findAll({
      include: [
        {
          model: Movie,
          where: { id: movieId },
          through: { attributes: [] } // Don't include junction table attributes
        }
      ],
      where: {
        // Add any other conditions (e.g., order status) if needed
      }
    });

    // If any orders are found, the user has purchased this movie
    const hasOrdered = orders.length > 0;

    return res.status(200).json(hasOrdered);

  } catch (error) {
    console.error('Error checking movie order status:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Alternative implementation using raw SQL query for better performance
exports.checkMovieOrderStatusOptimized = async (req, res) => {
  const { userId, movieId } = req.params;

  try {
    // Using raw query for better performance
    const [results] = await db.sequelize.query(`
      SELECT EXISTS (
        SELECT 1
        FROM orders o
        JOIN order_movies om ON o.id = om.order_id
        WHERE om.movie_id = :movieId
        AND o.user_id = :userId
      ) as hasOrdered
    `, {
      replacements: { userId, movieId },
      type: db.sequelize.QueryTypes.SELECT
    });

    return res.status(200).json(results.hasOrdered === 1);

  } catch (error) {
    console.error('Error checking movie order status:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};
  