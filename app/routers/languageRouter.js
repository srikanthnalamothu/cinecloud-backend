const express = require('express');
const languageController = require('../controllers/languageController');

const router = express.Router();

router.get('/', languageController.getAllLanguages);
router.post('/', languageController.createLanguage);
router.get('/:id', languageController.getLanguageById);
router.put('/:id', languageController.updateLanguage);
router.delete('/:id', languageController.deleteLanguage);

module.exports = router;
