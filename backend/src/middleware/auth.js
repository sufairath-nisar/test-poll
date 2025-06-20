const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  console.log('auth middleware');
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token required' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
