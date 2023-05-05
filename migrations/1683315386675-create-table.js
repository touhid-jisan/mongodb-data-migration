// Require necessary packages and models
const { MongoClient } = require('mongodb');

// Connect to MongoDB
const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
client.connect();

// Define the schemas for your tables
const userSchema = {
  name: 'users',
  validator: { $jsonSchema: {
    bsonType: 'object',
    required: [ 'name', 'email', 'password' ],
    properties: {
      name: { bsonType: 'string' },
      email: { bsonType: 'string' },
      password: { bsonType: 'string' }
    }
  }}
};

const orderSchema = {
  name: 'orders',
  validator: { $jsonSchema: {
    bsonType: 'object',
    required: [ 'user_id', 'order_date', 'products' ],
    properties: {
      user_id: { bsonType: 'objectId' },
      order_date: { bsonType: 'date' },
      products: {
        bsonType: 'array',
        items: { bsonType: 'objectId' }
      }
    }
  }}
};

const productSchema = {
  name: 'products',
  validator: { $jsonSchema: {
    bsonType: 'object',
    required: [ 'name', 'price', 'description' ],
    properties: {
      name: { bsonType: 'string' },
      price: { bsonType: 'number' },
      description: { bsonType: 'string' }
    }
  }}
};

const orderItemSchema = {
  name: 'order_items',
  validator: { $jsonSchema: {
    bsonType: 'object',
    required: [ 'id', 'order_id','product_id', 'quantity', 'price'],
    properties: {
      id: { bsonType: 'objectId'  },
      order_id: { bsonType: 'objectId'  },
      product_id: { bsonType: 'objectId'  },
      quantity: { bsonType: 'number' },
      price: { bsonType: 'string' }
    }
  }}
};

// Export the migration functions
module.exports = {
  async up() {
    // Create the tables
    const db = client.db('test');
    await db.createCollection(userSchema.name, { validator: userSchema.validator });
    await db.createCollection(orderSchema.name, { validator: orderSchema.validator });
    await db.createCollection(productSchema.name, { validator: productSchema.validator });
    await db.createCollection(orderItemSchema.name, { validator: productSchema.validator });

    // Add the relationships between tables
    await db.collection(orderSchema.name).createIndex({ user_id: 1 });
    await db.collection(orderSchema.name).createIndex({ products: 1 });
  },

  async down() {
    // Drop the tables
    const db = client.db('test');
    await db.collection(userSchema.name).drop();
    await db.collection(orderSchema.name).drop();
    await db.collection(productSchema.name).drop();
    await db.collection(orderItemSchema.name).drop();
  }
};
