const WebSocket = require('ws');

let wss;

function init(server) {
  wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    // Optionally parse query for pollId to subscribe client
    ws.subscriptions = new Set();

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'subscribe' && data.pollId) {
          ws.subscriptions.add(data.pollId);
        }
      } catch {}
    });

    ws.on('close', () => {
      ws.subscriptions.clear();
    });
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
