const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');
const ws = require('./ws');

const authenticateToken = require('./middleware/auth');
// Use the service rateLimiter, not the middleware one which creates its own Redis client
const { rateLimiter: rateLimitMiddleware } = require('./services/rateLimiter');

const { metricsMiddleware, register } = require('./middleware/metricsMiddleware');

const app = express();
const server = http.createServer(app);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(cors());
app.use(express.json());

// Public routes (no auth, no rate limit)
app.use('/api/auth', authRoutes);

// Apply authentication middleware to all routes below
app.use(authenticateToken);

// Apply rate limiting middleware after authentication
app.use(rateLimitMiddleware);

// Prometheus metrics middleware (should be after all middlewares)
app.use(metricsMiddleware);

app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

// Metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

// Protected routes
app.use('/api/polls', pollRoutes);

// Initialize WebSocket server
ws.init(server);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
