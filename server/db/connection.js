var pg = require('pg');

var connectionString;

if(process.env.DATABASE_URL){
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/ToDo';
}

function initializeDB(){
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('Error connecting to database:', err);
      process.exit(1);
    } else {
      var query = client.query('CREATE TABLE IF NOT EXISTS tasks ' +
                              '(id SERIAL PRIMARY KEY,' +
                              'name varchar(100) NOT NULL,' +
                              'completed boolean NOT NULL' +
                              ');');

      query.on('error', function(err){
        console.log('Error creating table:', err);
        process.exit(1);
      });

      query.on('end', function(){
        console.log('Table created successfully.');
        done();
      });
    };
  });
}

module.exports.connectionString = connectionString;
module.exports.initializeDB = initializeDB;
