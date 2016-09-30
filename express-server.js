const express = require('express');
const app = express();
const path = require('path');

// ALLOW ALL ORIGINS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// STATIC RESOURCES
app.use(express.static('assets'));

// INDEX
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'assets', 'views', 'index.html'));
});

// listen on heroku port or 8080
const port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log(`listening on *:${port}`);
});
