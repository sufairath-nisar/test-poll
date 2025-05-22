const WebSocket = require('ws');

let wss;

function init(server) {
  wss = new WebSocket.Server({ server, path: '/ws' });
  
  wss.on('connection', (ws, req) => {
    console.log('New WS connection from', req.socket.remoteAddress);
    ws.subscriptions = new Set();

    ws.on('message', (message) => {
      console.log('Received WS message:', message.toString());
      try {
        const data = JSON.parse(message);
        if (data.type === 'subscribe' && data.pollId) {
          ws.subscriptions.add(data.pollId);
        }
      } catch (e) {
        console.error('Failed to parse WS message:', e);
      }
    });

    ws.on('close', () => {
      console.log('WS connection closed');
      ws.subscriptions.clear();
    });
  });

  wss.on('error', (err) => {
    console.error('WS connection error:', err);
  });
}

function broadcast(pollId, message) {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.subscriptions.has(pollId)) {
      client.send(message);
    }
  });
}

module.exports = {
  init,
  broadcast,
};
