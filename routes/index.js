var express = require('express');
var router = express.Router();

var client = require('./client');

/* GET server page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET client page. */
router.get('/client/:room', client.form);

module.exports = router;
