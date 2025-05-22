const Redis = require('redis');
const redisClient = Redis.createClient({ url: process.env.REDIS_URL });

redisClient.connect().catch((err) => {
  console.error('Redis connection error:', err);
  process.exit(1);
});

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
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = rateLimiter;
