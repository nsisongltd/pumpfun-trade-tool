import { WebSocketServer, WebSocket } from 'ws';
import { Connection, PublicKey } from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import { SOLANA_RPC_ENDPOINT } from '@/core/constants';

interface Client {
  ws: WebSocket;
  subscriptions: Set<string>;
}

class MarketDataServer {
  private wss: WebSocketServer;
  private clients: Set<Client>;
  private connection: Connection;
  private markets: Map<string, Market>;
  private updateInterval: NodeJS.Timeout | null;

  constructor() {
    this.wss = new WebSocketServer({ port: 8080 });
    this.clients = new Set();
    this.connection = new Connection(SOLANA_RPC_ENDPOINT);
    this.markets = new Map();
    this.updateInterval = null;

    this.init();
  }

  private init() {
    this.wss.on('connection', (ws: WebSocket) => {
      const client: Client = { ws, subscriptions: new Set() };
      this.clients.add(client);

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);
          await this.handleMessage(client, data);
        } catch (error) {
          console.error('Failed to handle message:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(client);
      });
    });

    // Start sending updates
    this.startUpdates();
  }

  private async handleMessage(client: Client, message: any) {
    if (message.type === 'subscribe') {
      if (message.channel === 'orderbook') {
        client.subscriptions.add(`orderbook:${message.market}`);
        await this.loadMarket(message.market);
      }
    } else if (message.type === 'unsubscribe') {
      if (message.channel === 'orderbook') {
        client.subscriptions.delete(`orderbook:${message.market}`);
      }
    }
  }

  private async loadMarket(marketAddress: string) {
    if (!this.markets.has(marketAddress)) {
      try {
        const marketPubkey = new PublicKey(marketAddress);
        const market = await Market.load(
          this.connection,
          marketPubkey,
          {},
          new PublicKey(process.env.SERUM_PROGRAM_ID!)
        );
        this.markets.set(marketAddress, market);
      } catch (error) {
        console.error('Failed to load market:', error);
      }
    }
  }

  private startUpdates() {
    if (this.updateInterval) return;

    this.updateInterval = setInterval(async () => {
      for (const client of this.clients) {
        for (const subscription of client.subscriptions) {
          const [channel, market] = subscription.split(':');
          
          if (channel === 'orderbook') {
            try {
              // In production, fetch real order book data here
              const orderBook = {
                type: 'orderbook',
                market,
                bids: [
                  ['20.44', '100.5'],
                  ['20.43', '50.2'],
                ],
                asks: [
                  ['20.46', '80.3'],
                  ['20.47', '45.6'],
                ],
              };

              client.ws.send(JSON.stringify(orderBook));
            } catch (error) {
              console.error('Failed to send order book update:', error);
            }
          }
        }
      }
    }, 1000); // Update every second
  }

  public stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.wss.close();
  }
}

export const marketDataServer = new MarketDataServer(); 