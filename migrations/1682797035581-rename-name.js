'use strict'

const MongoClient = require('mongodb').MongoClient;


const url = 'mongodb://127.0.0.1:27017/test'

exports.up = function(done) {
  MongoClient.connect(url, function(err, client) {
    if (err) return done(err);
    const db = client.db();
    db.collection('users').updateMany({}, { $rename: { name: 'new_name' } }, function(err) {
      if (err) return done(err);
      console.log('Renamed "name" column to "new_name"');
      client.close();
      done();
    });
  });
};

exports.down = function(done) {
  MongoClient.connect(url, function(err, client) {
    if (err) return done(err);
    const db = client.db();
    db.collection('users').updateMany({}, { $rename: { new_name: 'name' } }, function(err) {
      if (err) return done(err);
      console.log('Renamed "new_name" column back to "name"');
      client.close();
      done();
    });
  });
};
