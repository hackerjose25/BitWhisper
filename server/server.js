// server/server.js (REPLACE your entire file with this)

const WebSocket = require('ws');
const http = require('http');
const https = require('https');
const fs = require('fs');
const os = require('os');

// --- Configuration ---
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Listen on all interfaces

// Store connected clients and rooms
const clients = new Map();
const rooms = new Map();
let server;

// --- Create Server ---
// In production or on Vercel/cloud environments, we create an HTTP server (reverse proxy handles SSL).
// In standalone local dev, we create an HTTPS server if self-signed certs are present.
const certsExist = fs.existsSync('./localhost-key.pem') && fs.existsSync('./localhost.pem');
const shouldRunHttps = !IS_PRODUCTION && !process.env.VERCEL && certsExist;

if (shouldRunHttps) {
  console.log('Running in DEVELOPMENT mode (https)...');
  try {
    server = https.createServer({
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    }, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'bitwhisper-signaling' }));
    });
  } catch (e) {
    console.warn('⚠️ Could not start HTTPS server, falling back to HTTP:', e.message);
    server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'bitwhisper-signaling' }));
    });
  }
} else {
  console.log('Running in HTTP mode (Vercel / Production / Reverse Proxy)...');
  server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'bitwhisper-signaling' }));
  });
}

const wss = new WebSocket.Server({ server });

// --- WebSocket Logic (Copied from your original file) ---

wss.on('connection', (ws) => {
  console.log('✅ New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      switch (data.type) {
        case 'join':
          handleJoin(ws, data);
          break;
        case 'signal':
          handleSignal(ws, data);
          break;
        case 'leave':
          handleLeave(ws);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    handleLeave(ws);
    console.log('👋 Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function handleJoin(ws, data) {
  const { username, roomId } = data;
  
  const userId = generateUserId();

  clients.set(ws, { userId, username, roomId });

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(ws);

  const existingUsers = Array.from(rooms.get(roomId))
    .filter(client => client !== ws)
    .map(client => {
      const info = clients.get(client);
      return { userId: info.userId, username: info.username };
    });

  ws.send(JSON.stringify({
    type: 'room-joined',
    roomId,
    userId,
    users: existingUsers
  }));

  broadcastToRoom(roomId, {
    type: 'user-joined',
    userId,
    username
  }, ws);

  updateUserList(roomId);
  console.log(`👤 ${username} joined room: ${roomId}`);
}

function handleSignal(ws, data) {
  const sender = clients.get(ws);
  if (!sender) return;

  const { targetId, signal } = data;

  for (const [client, info] of clients.entries()) {
    if (info.userId === targetId && info.roomId === sender.roomId) {
      client.send(JSON.stringify({
        type: 'signal',
        fromId: sender.userId,
        signal
      }));
      break;
    }
  }
}

function handleLeave(ws) {
  const clientInfo = clients.get(ws);
  if (!clientInfo) return;

  const { userId, username, roomId } = clientInfo;

  if (rooms.has(roomId)) {
    rooms.get(roomId).delete(ws);

    if (rooms.get(roomId).size === 0) {
      rooms.delete(roomId);
      console.log(`🗑️  Room ${roomId} is now empty and removed`);
    } else {
      broadcastToRoom(roomId, {
        type: 'user-left',
        userId,
        username
      });
      updateUserList(roomId);
      console.log(`👋 ${username} left room: ${roomId}`);
    }
  }

  clients.delete(ws);
}

function broadcastToRoom(roomId, message, excludeWs = null) {
  if (!rooms.has(roomId)) return;

  const messageStr = JSON.stringify(message);
  rooms.get(roomId).forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

function updateUserList(roomId) {
  if (!rooms.has(roomId)) return;

  const users = Array.from(rooms.get(roomId)).map(client => {
    const info = clients.get(client);
    return { userId: info.userId, username: info.username };
  });

  broadcastToRoom(roomId, {
    type: 'user-list',
    users
  });
}

function generateUserId() {
  return Math.random().toString(36).substr(2, 9);
}

// --- Utility Functions (for logging) ---
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// --- Start Server ---
server.listen(PORT, HOST, () => {
  const localIp = getLocalIpAddress();
  const protocol = IS_PRODUCTION ? 'http' : 'https';
  const wsProtocol = IS_PRODUCTION ? 'ws' : 'wss';
  
  console.log('\n🚀 WebSocket Server Running:\n');
  console.log(`   ➜  Mode:    ${IS_PRODUCTION ? 'Production' : 'Development'}`);
  console.log(`   ➜  Local:   ${protocol}://localhost:${PORT}`);
  console.log(`   ➜  Network: ${protocol}://${localIp}:${PORT}\n`);
  console.log(`✅ Server ready for ${wsProtocol} connections\n`);
});

// --- Graceful Shutdown ---
function gracefulShutdown() {
  console.log('\n👋 Shutting down gracefully...');
  wss.clients.forEach(client => {
    client.close();
  });
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
