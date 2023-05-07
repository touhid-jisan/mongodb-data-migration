const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'myDatabase';

exports.up = function (done) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) return done(err);

    const db = client.db(dbName);
    console.log('Connected successfully to server');
    done();
  });
};

exports.down = function (done) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) return done(err);

    const db = client.db(dbName);
    console.log('Connected successfully to server');

    db.dropDatabase(function (err, res) {
      if (err) return done(err);

      console.log('Database dropped');

      client.close(function (err) {
        if (err) return done(err);

        console.log('Connection closed');

        done();
      });
    });
  });
};
