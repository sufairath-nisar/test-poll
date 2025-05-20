// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// require('dotenv').config();

// const authRoutes = require('./routes/authRoutes');
// const pollRoutes = require('./routes/pollRoutes');
// const ws = require('./ws');

// const app = express();
// const server = http.createServer(app);

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).send('Server is running');
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/polls', pollRoutes);

// ws.init(server);

// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// module.exports = app;


const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');
const ws = require('./ws');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

ws.init(server);

const PORT = process.env.PORT || 4000;

// Only start the server if NOT testing
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
