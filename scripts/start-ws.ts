import { marketDataServer } from '../src/server/websocket';

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  marketDataServer.stop();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  marketDataServer.stop();
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down WebSocket server...');
  marketDataServer.stop();
  process.exit(0);
});

try {
  console.log('WebSocket server running on port 8080');
} catch (error) {
  console.error('Failed to start WebSocket server:', error);
  process.exit(1);
} 