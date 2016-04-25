var express = require('express');
var pg = require('pg');
var connectionString = require('../db/connection').connectionString;
var router = express.Router();

router.post('/', function(req, res){
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('Error connecting to database (post route):', err);
      res.sendStatus(500);
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

router.get('/', function(req, res){
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

router.put('/:id', function(req, res){
  var taskID = req.params.id;
  //console.log('taskID', taskID);
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('Error connecting to the database (put route):', err);
      res.sendStatus(500);
    } else {
      var query = client.query("UPDATE tasks SET completed = true WHERE (id = " + taskID + ");");

      query.on('error', function(err){
        console.log('Error updating rows in database:', err);
        done();
      });

      query.on('row', function(row){
        console.log('Row updated:', row);
        res.send(row);
      });

      query.on('end', function(){
        console.log('Row updated successfully');
        done();
        res.sendStatus(200);
      });
    }
  });
});

router.delete('/:id', function(req, res){
  var taskID = req.params.id;

  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('Error connecting to the database (delete route):', err);
      res.sendStatus(500);
    } else {
      var query = client.query("DELETE FROM tasks WHERE (id = " + taskID + ");");

      query.on('error', function(err){
        console.log('Error deleting rows from database:', err);
        done();
      });

      query.on('end', function(){
        console.log('Row deleted successfully');
        done();
        res.sendStatus(200);
      });
    }
  });
});

module.exports = router;
