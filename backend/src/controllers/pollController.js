const db = require('../db');
const wss = require('../ws');

exports.createPoll = async (req, res) => {
   res.status(400).json({ error: 'entering into controller' });
  try {
     res.status(400).json({ error: 'entering into controller try' });
    const { question, options, expiresAt } = req.body;
    console.log('Payload:', { question, options, expiresAt });
    console.log('User:', req.user); 
    
    if (!question || !Array.isArray(options) || options.length < 2 || !expiresAt) {
      return res.status(400).json({ message: 'Invalid poll data' });
    }
    const expires_at = new Date(expiresAt);
    if (expires_at <= new Date()) {
      return res.status(400).json({ message: 'Expiration must be in the future' });
    }

    // insert poll
    const [poll] = await db('polls')
      .insert({ question, expires_at })
      .returning(['id', 'question', 'expires_at']);

    // insert options
    const opts = options.map((text) => ({ poll_id: poll.id, text }));
    await db('options').insert(opts);

    res.status(201).json({ id: poll.id });
  } catch (error) {
    console.error('Poll creation failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPoll = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await db('polls').where('id', id).first();
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    const options = await db('options').where('poll_id', id);

    const votes = await db('votes')
      .select('option_id')
      .where('poll_id', id);

    // tally votes per option
    const tally = {};
    options.forEach((opt) => (tally[opt.id] = 0));
    votes.forEach((v) => {
      tally[v.option_id] = (tally[v.option_id] || 0) + 1;
    });

    res.json({
      poll: {
        id: poll.id,
        question: poll.question,
        expiresAt: poll.expires_at,
        options: options.map((o) => ({ id: o.id, text: o.text })),
        tally,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.castVote = async (req, res) => {
  try {
    console.log('Vote received:', req.body);
    console.log('User:', req.user);
    const { id: pollId } = req.params;
    const { optionId } = req.body;
    const userId = req.user.userId;

    // check poll expiry
    const poll = await db('polls').where('id', pollId).first();
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    if (poll.expires_at < new Date()) {
      return res.status(403).json({ message: 'Poll expired' });
    }

    // check option exists for poll
    const option = await db('options').where({ id: optionId, poll_id: pollId }).first();
    if (!option) return res.status(400).json({ message: 'Invalid option' });

    // delete previous vote if exists
    await db('votes').where({ poll_id: pollId, user_id: userId }).del();

    // insert new vote
    await db('votes').insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: userId,
    });

    // broadcast new tally via websocket
    const votes = await db('votes').select('option_id').where('poll_id', pollId);
    const tally = {};
    const options = await db('options').where('poll_id', pollId);
    options.forEach((o) => (tally[o.id] = 0));
    votes.forEach((v) => {
      tally[v.option_id] = (tally[v.option_id] || 0) + 1;
    });
    console.log('[SERVER] Broadcasting tally for poll', pollId, tally);
    wss.broadcast(
      pollId,
      JSON.stringify({
      type: 'tally',
      pollId,
      tally
      })
    );

    res.json({ message: 'Vote cast' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
