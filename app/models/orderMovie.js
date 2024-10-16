module.exports = (sequelize, Sequelize) => {
const OrderMovie = sequelize.define('OrderMovie', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
});
return OrderMovie;
}

