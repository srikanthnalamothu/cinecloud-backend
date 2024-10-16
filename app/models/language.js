module.exports = (sequelize, Sequelize) => {
  const Language = sequelize.define("Language", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Language;
};
