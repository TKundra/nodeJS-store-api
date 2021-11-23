require('dotenv').config();

import connectDB from './db/connect';
import Products from './model/products';
import jsonProducts from './data/products.json'

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Products.deleteMany(); // delete rest data
    await Products.create(jsonProducts); // add fresh products
    console.log('Success!!!!');
    process.exit(0); // exit
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

start();

/// to add custom data in db from data/products.json
/* 
  commands to populate (in command line)
    node -r esm populate.js
    or
    node populate.js
*/