const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');
const ws = require('./ws');

const authenticateToken = require('./middleware/auth');
const { rateLimiter: rateLimitMiddleware } = require('./services/rateLimiter');
const { metricsMiddleware, register } = require('./middleware/metricsMiddleware');

const app = express();
const server = http.createServer(app);

// Log Redis & PostgreSQL environment variables for debugging
console.log('🔗 Connecting to Redis:', process.env.REDIS_URL || 'Not set');
console.log('🛢️ Connecting to Postgres:', {
  host: process.env.PG_HOST || 'Not set',
  database: process.env.PG_DATABASE || 'Not set',
  user: process.env.PG_USER || 'Not set',
});
if (process.env.NODE_ENV !== 'production') {
  console.log('🔐 JWT Secret:', process.env.JWT_SECRET || 'Not set');
}

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors());
app.use(express.json());

// Public routes (no auth, no rate limit)
app.use('/api/auth', authRoutes);

// Conditionally apply middleware (skip during tests)
// if (process.env.NODE_ENV !== 'test') {
//   app.use(authenticateToken);
//   app.use(rateLimitMiddleware);
//   app.use(metricsMiddleware);
// }

// Root health check
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    console.error('Metrics error:', err.message);
    res.status(500).end(err.message);
  }
});

// Protected routes
app.use('/api/polls', pollRoutes);

// WebSocket server initialization
ws.init(server);

// Live test route
app.post('/api/test', (req, res) => {
  console.log('Test route hit');
  res.status(200).json({ msg: 'Test success' });
});

// Start server unless in test mode
const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
