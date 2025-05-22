const { RateLimiterRedis } = require('rate-limiter-flexible');
const redisClient = require('./redisClient');

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 5,          // 5 requests
  duration: 1,        // per 1 second
  blockDuration: 10,  // block for 10 seconds if consumed more
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
