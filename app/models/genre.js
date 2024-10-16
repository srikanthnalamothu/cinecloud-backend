module.exports = (sequelize, Sequelize) => {
  const Genre = sequelize.define("Genre", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Genre;
};

