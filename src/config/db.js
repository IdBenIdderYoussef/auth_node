const mongoose = require('mongoose');
require('dotenv').config();

const db = process.env.MONGO_URI;

const connectDB = () => {
  try {
    console.log(db);
    mongoose.connect(db, {
      useNewUrlParser: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;