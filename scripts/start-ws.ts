import { marketDataServer } from '../src/server/websocket';

process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  marketDataServer.stop();
  process.exit();
});

console.log('WebSocket server running on port 8080'); 