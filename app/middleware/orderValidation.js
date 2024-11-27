// middleware/orderValidation.js
const validateOrderStatus = (req, res, next) => {
    const { userId, movieId } = req.params;
  
    // Check if IDs are valid numbers
    if (isNaN(userId) || isNaN(movieId)) {
      return res.status(400).json({
        message: 'Invalid user ID or movie ID'
      });
    }
  
    // Check if IDs are positive integers
    if (userId <= 0 || movieId <= 0) {
      return res.status(400).json({
        message: 'User ID and movie ID must be positive numbers'
      });
    }
  
    next();
  };
  
  module.exports = {
    validateOrderStatus
  };