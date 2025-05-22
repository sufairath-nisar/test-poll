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
