const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const authenticateToken = require('../middleware/auth');
const { rateLimiter } = require('../services/rateLimiter');

console.log('rateLimiter:', typeof rateLimiter);
console.log('authenticateToken:', typeof authenticateToken);
console.log('pollController.createPoll:', typeof pollController.createPoll);
console.log('pollController.castVote:', typeof pollController.castVote);

router.post('/', pollController.createPoll);
router.get('/:id', pollController.getPoll);
router.post('/:id/vote', authenticateToken, rateLimiter, pollController.castVote);

module.exports = router;
