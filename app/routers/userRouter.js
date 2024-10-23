const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Routes for auth
router.get('/', userController.findAll);
router.post('/', userController.create);
router.delete('/:id', userController.delete);
router.delete('/', userController.deleteAll);
router.put('/id', userController.update);

module.exports = router
