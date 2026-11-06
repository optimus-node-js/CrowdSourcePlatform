const mongoose = require('mongoose');

let connection = null;

async function connectDB() {
  if (connection) return connection;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set');
  connection = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 }).then((m) => {
    console.log('MongoDB connected');
    return m;
  });
  try {
    return await connection;
  } catch (err) {
    connection = null;
    throw err;
  }
}

module.exports = connectDB;
