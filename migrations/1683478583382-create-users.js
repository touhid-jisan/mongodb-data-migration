const { MongoClient } = require('mongodb');

const userData = [
  {
    name: 'Md. Touhidul Islam',
    email: 'touhidul.com',
    password: '123456'
  },
  {
    name: 'Syed Akif Ahmed Karim',
    email: 'akif@gmail.com',
    password: 'abcdef'
  },
  {
    name: 'Dipyan Sen',
    email: 'dip@gmail.com',
    password: 'dip_sen'
  }
];


module.exports = {
  async up() {
    const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('CSE416');
    await db.collection('users').insertMany(userData);
    await client.close();
  },
  async down() {
    const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('CSE416');
    await db.collection('users').drop();
    await client.close();
  }
};

