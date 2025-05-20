const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.anonymousLogin = (req, res) => {
  const userId = `anon-${Math.random().toString(36).substring(2, 10)}`;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '600s',
  });
  res.json({ token });
};
