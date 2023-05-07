// Require necessary packages and models
const { MongoClient } = require('mongodb');

// Connect to MongoDB
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });


// Export the migration functions
module.exports = {
  async up() {
    try {
      await client.connect();
      const db = client.db('CSE416');

      // Add the relationships between tables
      await db.collection('orders').createIndex({ user_id: 1 });
      await db.collection('orders').createIndex({ products: 1 });
      await db.collection('order_items').createIndex({ order_id: 1 });
      await db.collection('order_items').createIndex({ product_id: 1 });

      // Insert three accessories products
      await db.collection('products').insertMany([
        {
          name: 'Wireless Headphones',
          price: 89.99,
          description: 'Experience true freedom with our wireless headphones.'
        },
        {
          name: 'Bluetooth Speaker',
          price: 129.99,
          description: 'Listen to your music in style with our high-quality bluetooth speaker.'
        },
        {
          name: 'Smartwatch',
          price: 199.99,
          description: 'Stay connected and track your fitness with our smartwatch.'
        }
      ]);

      await client.close();
    } catch (err) {
      console.error(err);
    }
  },

  async down() {
    try {
      await client.connect();
      const db = client.db('CSE416');
  
      // Delete all documents from the products collection
      await db.collection('products').deleteMany({});
  
      await client.close();
    } catch (err) {
      console.error(err);
    }
  }
  
}
 
