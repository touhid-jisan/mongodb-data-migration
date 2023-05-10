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

   
      // Export the migration functions

      // Find the logged-in user
      const userCollection = db.collection('users');
      const loggedInUser = await userCollection.findOne({ email: 'akif@gmail.com'});
      console.log(loggedInUser);
      // Create a new order for the logged-in user
      const orderCollection = db.collection('orders');
      const order = {
        user_id: loggedInUser._id,
        order_date: new Date(),
        products: []
      };
      const orderResult = await orderCollection.insertOne(order);

      // Create order items for the smartwatch product
      const productCollection = db.collection('products');
      const smartwatch = await productCollection.findOne({ name: 'Smartwatch' });
      const orderItemsCollection = db.collection('order_items');
      const orderItem = {
        order_id: orderResult.insertedId,
        product_id: smartwatch._id,
        quantity: 1
      };
      const orderItemResult = await orderItemsCollection.insertOne(orderItem);

      // Update the products array in the order document
      await orderCollection.updateOne(
        { _id: orderResult.insertedId },
        { $push: { products: orderItemResult.insertedId } }
      );

      await client.close();
    } catch (err) {
      console.error(err);
    }
  },

  async down() {
    try {
      await client.connect();
      const db = client.db('CSE416');

      // Delete the order items for the smartwatch product
      const orderItemsCollection = db.collection('order_items');
      const orderItem = await orderItemsCollection.findOne({ quantity: 1 });
      await orderItemsCollection.deleteOne({ _id: orderItem._id });

      // Delete the order for the logged-in user
      const orderCollection = db.collection('orders');
      const order = await orderCollection.findOne({ user_id: orderItem.order_id });
      await orderCollection.deleteOne({ _id: order._id });

      await client.close();
    } catch (err) {
      console.error(err);
    }
  }
};
