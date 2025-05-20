// const { createClient } = require('redis');
// require('dotenv').config();

// const redisClient = createClient({
//   url: process.env.REDIS_URL
// });

// redisClient.on('error', (err) => console.error('Redis Client Error', err));

// (async () => {
//   await redisClient.connect();
// })();

// module.exports = redisClient;




// new

// const { createClient } = require('redis');
// require('dotenv').config();

// const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });

// redisClient.on('error', (err) => console.error('Redis Client Error', err));

// (async () => {
//   await redisClient.connect();
//   console.log('Redis client connected');
// })();

// module.exports = redisClient;




const Redis = require('ioredis');
require('dotenv').config();

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

module.exports = redisClient;
