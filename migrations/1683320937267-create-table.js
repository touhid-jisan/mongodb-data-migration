// Require necessary packages and models
const { MongoClient } = require('mongodb');

// Connect to MongoDB
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

// Define the schemas for your tables
const userSchema = {
  name: 'users',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { bsonType: 'string' },
        email: { bsonType: 'string' },
        password: { bsonType: 'string' }
      }
    }
  }
};

const orderSchema = {
  name: 'orders',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'order_date', 'products'],
      properties: {
        user_id: { bsonType: 'objectId' },
        order_date: { bsonType: 'date' },
        products: {
          bsonType: 'array',
          items: { bsonType: 'objectId' }
        }
      }
    }
  }
};

const productSchema = {
  name: 'products',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'price', 'description'],
      properties: {
        name: { bsonType: 'string' },
        price: { bsonType: 'number' },
        description: { bsonType: 'string' }
      }
    }
  }
};

const orderItemSchema = {
  name: 'order_items',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['order_id', 'product_id', 'quantity'],
      properties: {
        order_id: { bsonType: 'objectId' },
        product_id: { bsonType: 'objectId' },
        quantity: { bsonType: 'number' }
      }
    }
  }
};

// Export the migration functions
module.exports = {
  async up() {
    try {
      await client.connect();
      const db = client.db('CSE416');

      await db.createCollection(userSchema.name, { validator: userSchema.validator });
      await db.createCollection(orderItemSchema.name, { validator: orderItemSchema.validator });
      await db.createCollection(orderSchema.name, { validator: orderSchema.validator });
      await db.createCollection(productSchema.name, { validator: productSchema.validator });

      // Add the relationships between tables
      await db.collection(orderSchema.name).createIndex({ user_id: 1 });
      await db.collection(orderSchema.name).createIndex({ products: 1 });
      await db.collection(orderItemSchema.name).createIndex({ order_id: 1 });
      await db.collection(orderItemSchema.name).createIndex({ product_id: 1 });

      await client.close();
    } catch (err) {
      console.error(err);
    }
  },

  async down() {
    try {
      await client.connect();
      const db = client.db('CSE416');

      await db.collection(userSchema.name).drop();
      await db.collection(orderItemSchema.name).drop();
      await db.collection(orderSchema.name).drop();
      await db.collection(productSchema.name).drop();

      await client.close();
    } catch (err) {
      console.error(err);
    }
  }
};
