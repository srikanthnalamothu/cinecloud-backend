const express = require('express');
const app = express();
const port = 3200;

app.get('/', (req, res) => {
  res.send('Welcome to Cinecloud backend!');
});

app.listen(port, () => {
  console.log(`Cinecloud backend listening at http://localhost:${port}`);
});
