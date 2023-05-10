const { MongoClient } = require('mongodb');
const assert = require('assert');

// Import the migration scripts
const createTables = require('./migrations/1683320937267-create-table.js');
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
      assert.deepStrictEqual(collectionNames, ["users", "orders", "products", "order_items"]);
    });
  });
});
