const express = require('express');
const bodyParser = require('body-parser');
const userRoutes  = require("./app/routers/userRouter");
const genreRoutes = require('./app/routers/genreRouter');
const languageRoutes = require('./app/routers/languageRouter');
const movieRoutes = require('./app/routers/movieRouter');
const authRoutes = require('./app/routers/authRouter');
const db = require("./app/models");

const cors = require("cors");

const app = express();
const PORT = 3200;

let corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.options("*", cors());

app.get('/', (req, res) => {
  res.send("welcome to cinecloud bckend");
});
app.use(bodyParser.json());
app.use(authRoutes);
app.use("/users",userRoutes);
app.use('/genres',genreRoutes);
app.use('/languages',languageRoutes);
app.use('/movies',movieRoutes);

//uncomment to create tables

db.sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.error('Error syncing database:', error);
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
