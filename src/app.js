const express = require("express");
const path = require("path");

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use('/', (req, res) => {
  res.render('login');
})

module.exports = app;