const Sequelize = require("sequelize");
const sequelize = new Sequelize('cine_cloud', 'shiva', '123456', {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql',
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.session = require("./session.js")(sequelize, Sequelize);
db.user = require("./user.js")(sequelize, Sequelize);
db.movie = require("./movie.js")(sequelize,Sequelize);
db.genre = require("./genre.js")(sequelize,Sequelize);
db.language = require("./language.js")(sequelize, Sequelize);
db.order = require("./order.js")(sequelize,Sequelize);
db.orderMovie = require("./orderMovie.js")(sequelize,Sequelize);

// foreign key for session
db.user.hasMany(
  db.session,
  {
    foreignKey: {
      name: 'userId',
      allowNull: true,
    },
    onDelete: 'CASCADE',
  }
);

db.session.belongsTo(db.user, {
  foreignKey: 'userId',
  as: 'userDetails',
  onDelete: 'CASCADE',
});

db.genre.hasMany(db.movie, {
  foreignKey: {
    name: 'genre_id',
    allowNull: true,
  },
  onDelete: 'CASCADE',
});
db.movie.belongsTo(db.genre, {
  foreignKey: 'genre_id',
  as: 'genreDetails',
  onDelete: 'CASCADE',
});


db.language.hasMany(db.movie, {
  foreignKey: {
    name: 'language_id',
    allowNull: true,
  },
  onDelete: 'CASCADE',
});
db.movie.belongsTo(db.language, {
  foreignKey: 'language_id',
  as: 'languageDetails',
  onDelete: 'CASCADE',
});


db.user.hasMany(db.order, {
  foreignKey: {
    name: 'user_id',
    allowNull: true,
  },
  onDelete: 'CASCADE',
});
db.order.belongsTo(db.user, {
  foreignKey: 'user_id',
  as: 'userDetails',
  onDelete: 'CASCADE',
});


db.order.belongsToMany(db.movie, { through: db.orderMovie });
db.movie.belongsToMany(db.order, { through: db.orderMovie });

module.exports = db;
