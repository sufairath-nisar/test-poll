// const { RateLimiterRedis } = require('rate-limiter-flexible');
// const redisClient = require('./redisClient');

// const rateLimiter = new RateLimiterRedis({
//   storeClient: redisClient,
//   points: 5, // max 5 votes
//   duration: 1, // per second
//   blockDuration: 1,
// });


// module.exports = { rateLimiter };




// new
// const { RateLimiterRedis } = require('rate-limiter-flexible');
// const redisClient = require('./redisClient');

// const rateLimiter = new RateLimiterRedis({
//   storeClient: redisClient,
//   points: 5,
//   duration: 1,
//   blockDuration: 1,
//   insuranceLimiter: undefined, // optional, but keeps fallback clean
// });

// const rateLimiterMiddleware = (req, res, next) => {
//   const key = req.user?.userId || req.ip;
//   console.log('Rate limiter service triggered', key);
//   rateLimiter.consume(key)
//     .then(() => next())
//     .catch((rejRes) => {
//       console.error('Rate limiter rejected:', rejRes);
//       res.status(429).json({ message: 'Too Many Requests' });
//     });
// };

// module.exports = { rateLimiter: rateLimiterMiddleware };



const { RateLimiterRedis } = require('rate-limiter-flexible');
const redisClient = require('./redisClient'); // This should now be ioredis

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 5, // 5 requests
  duration: 1, // per second
  blockDuration: 10, // block for 10 seconds if exceeded
});

const rateLimiterMiddleware = (req, res, next) => {
  const key = req.user?.userId || req.ip;
  console.log('Rate limiter service triggered', key);
  rateLimiter
    .consume(key)
    .then(() => {
      next();
    })
    .catch(() => {
      console.log('Rate limiter rejected');
      res.status(429).json({ message: 'Too Many Requests' });
    });
};

module.exports = {
  rateLimiter: rateLimiterMiddleware,
};
