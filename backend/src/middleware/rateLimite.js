// const Redis = require('redis');

// const redisClient = Redis.createClient({ url: process.env.REDIS_URL });
// redisClient.connect();

// const WINDOW_SIZE_IN_SECONDS = 60;
// const MAX_REQUESTS_PER_WINDOW = 100;

// async function rateLimiter(req, res, next) {
//   const userId = req.user.userId;
//   const key = `rate_limit:${userId}`;

//   try {
//     let current = await redisClient.get(key);
//     current = current ? parseInt(current) : 0;

//     if (current >= MAX_REQUESTS_PER_WINDOW) {
//       return res.status(429).json({ error: 'Too many requests' });
//     }

//     if (current === 0) {
//       await redisClient.set(key, 1, { EX: WINDOW_SIZE_IN_SECONDS });
//     } else {
//       await redisClient.incr(key);
//     }

//     next();
//   } catch (err) {
//     console.error('Rate limiter error:', err);
//     next(); // fail open
//   }
// }

// module.exports = { rateLimiter };



const Redis = require('redis');

const redisClient = Redis.createClient({ url: process.env.REDIS_URL });
console.log("testing rateLimiter");
redisClient.connect();

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 100;

async function rateLimiter(req, res, next) {
  console.log('Rate limiter middleware triggered');
  const userId = req?.user?.userId;

  if (!userId) {
    console.warn('Rate limiter: Missing userId');
    return res.status(401).json({ message: 'Unauthorized: Missing userId' });
  }

  const key = `rate_limit:${userId}`;

  try {
    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, WINDOW_SIZE_IN_SECONDS);
    }

    if (current > MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({ message: 'Too many requests' });
    }

    next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    next(); // fail open
  }
}


module.exports = { rateLimiter };
