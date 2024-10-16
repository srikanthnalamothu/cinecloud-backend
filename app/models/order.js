module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("Order", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    totalCost: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    ordered_date: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  return Order;
};