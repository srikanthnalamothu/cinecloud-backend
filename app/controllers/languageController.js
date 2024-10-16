const db = require("../models");
const Language = db.language;

// Controller actions for languages
exports.getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.findAll();
    res.json(languages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createLanguage = async (req, res) => {
  const { name, country, title } = req.body;

  try {
    const language = await Language.create({ name, country, title });
    res.status(201).json(language);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getLanguageById = async (req, res) => {
  const languageId = req.params.id;

  try {
    const language = await Language.findByPk(languageId);
    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }
    res.json(language);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateLanguage = async (req, res) => {
  const languageId = req.params.id;
  const { name, country, title } = req.body;

  try {
    const language = await Language.findByPk(languageId);
    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }

    language.name = name || language.name;
    language.country = country || language.country;
    language.title = country || language.title;
    await language.save();

    res.json(language);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteLanguage = async (req, res) => {
  const languageId = req.params.id;

  try {
    const language = await Language.findByPk(languageId);
    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }

    await language.destroy();
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
