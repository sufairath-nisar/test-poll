const { RateLimiterRedis } = require('rate-limiter-flexible');
const redisClient = require('./redisClient');

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 5,         
  duration: 1,       
  blockDuration: 10,  
});

const rateLimiterMiddleware = (req, res, next) => {
  const key = req.user?.userId || req.ip;
  console.log('Rate limiter service triggered for key:', key);
  rateLimiter
    .consume(key)
    .then(() => next())
    .catch(() => {
      console.log('Rate limiter rejected');
      res.status(429).json({ message: 'Too Many Requests' });
    });
};

module.exports = {
  rateLimiter: rateLimiterMiddleware,
};
