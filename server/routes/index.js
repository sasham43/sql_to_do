var express = require('express');
var path = require('path');
var pg = require('pg');
var connectionString = require('../db/connection').connectionString;
var tasks = require('./tasks');
var router = express.Router();

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.use('/tasks', tasks);

module.exports = router;
