var express = require('express');
var path = require('path');
var pg = require('pg');
var connectionString = require('../db/connection').connectionString;
var router = express.Router();

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.post('/task', function(req, res){
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('Error connecting to database (post route):', err);
    } else {
      //console.log('request:', req);
      var task = req.body.name;
      var completed = req.body.completed;
      var query = client.query('INSERT INTO tasks (name, completed) VALUES ($1, $2) RETURNING name, completed', [task, completed]);

      query.on('error', function(err){
        console.log('Error posting to database:', err);
        done();
      });

      query.on('row', function(row){
        console.log('Task added:', row);
        res.send(row);
      });

      query.on('end', function(){
        console.log('Task added successfully.');
        done();
      });
    }
  });
});

router.get('/all', function(req, res){
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('Error connecting to database (get route):', err);
    } else {
      var query = client.query('SELECT * FROM tasks');
      var results = [];

      query.on('error', function(err){
        console.log('Error getting rows from the database:', err);
        done();
      });

      query.on('row', function(row){
        results.push(row);
      });

      query.on('end', function(){
        console.log('Rows retrieved:', results);
        res.send(results);
        done();
      });
    }
  })
});

module.exports = router;
