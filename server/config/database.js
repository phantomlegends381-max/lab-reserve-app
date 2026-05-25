const mongoose = require('mongoose');

let connectionPromise = null;

const mongoOptions = {
  maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 10),
  minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE || 0),
  serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 5000),
  socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 45000),
  connectTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 10000),
  maxIdleTimeMS: Number(process.env.MONGO_MAX_IDLE_TIME_MS || 30000),
  heartbeatFrequencyMS: Number(process.env.MONGO_HEARTBEAT_FREQUENCY_MS || 10000),
  retryWrites: true,
  appName: process.env.MONGO_APP_NAME || 'lab-reserve-api',
  family: 4,
};

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lab-reserve';

  connectionPromise = mongoose.connect(uri, mongoOptions)
    .then(() => {
      console.log('MongoDB connected.');
      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = null;
      console.error('MongoDB connection failed:', error.message);
      throw error;
    });

  return connectionPromise;
}

mongoose.connection.on('disconnected', () => {
  connectionPromise = null;
  console.warn('MongoDB disconnected; the next request will attempt to reconnect.');
});

mongoose.connection.on('error', (error) => {
  connectionPromise = null;
  console.error('MongoDB runtime error:', error.message);
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected.');
});

module.exports = {
  connectDatabase,
};
