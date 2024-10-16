module.exports = (sequelize, Sequelize) => {
const Session = sequelize.define('Session', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expirationDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
 });
 return Session;
}

