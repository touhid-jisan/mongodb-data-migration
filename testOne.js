const { MongoClient } = require('mongodb');
const assert = require('assert');

// Import the migration scripts
const createTables = require('.//migrations/1683315386675-create-table.js');
// const createRelationships = require('./migrations/1683315386675-create-table.js');

describe('Migration Tests', () => {
  let client;
  let db;

  // Connect to the database before running any tests
  before(async () => {
    client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
    await client.connect();
    db = client.db('test');
  });

  // Disconnect from the database after running all tests
  after(async () => {
    await client.close();
  });

  // Test the createTables migration
  describe('createTables', () => {
    it('should create the tables in the database', async () => {
      await createTables.up(db);
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map((collection) => collection.name);
      assert.deepStrictEqual(collectionNames, ['users', 'orders', 'products', 'order_items']);
    });
  });

  // // Test the createRelationships migration
  // describe('createRelationships', () => {
  //   it('should create the relationships between the tables in the database', async () => {
  //     await createRelationships.up(db);
  //     const users = db.collection('users');
  //     const orders = db.collection('orders');
  //     const orderItems = db.collection('order_items');
  //     const products = db.collection('products');
  //     const indexes = await Promise.all([
  //       users.indexes(),
  //       orders.indexes(),
  //       orderItems.indexes(),
  //       products.indexes(),
  //     ]);
  //     const expectedIndexes = [
  //       ['_id_', 'email_1'],
  //       ['_id_', 'user_id_1'],
  //       ['_id_', 'order_id_1'],
  //       ['_id_', 'product_id_1'],
  //     ];
  //     indexes.forEach((index, i) => {
  //       const actualIndexes = index.map(({ key }) => Object.keys(key));
  //       assert.deepStrictEqual(actualIndexes, expectedIndexes[i]);
  //     });
  //   });
  // });
});
