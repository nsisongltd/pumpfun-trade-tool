import { WebSocketServer, WebSocket } from 'ws';
import { Connection, PublicKey } from '@solana/web3.js';
import { Market, Orderbook } from '@project-serum/serum';
import { SOLANA_RPC_ENDPOINT, SERUM_DEX_PROGRAM_ID } from '@/core/constants';
import Decimal from 'decimal.js';

interface Client {
  ws: WebSocket;
  subscriptions: Set<string>;
}

interface MarketData {
  market: Market;
  lastBids: string;
  lastAsks: string;
}

class MarketDataServer {
  private wss: WebSocketServer;
  private clients: Set<Client>;
  private connection: Connection;
  private markets: Map<string, MarketData>;
  private updateInterval: NodeJS.Timeout | null;

  constructor() {
    this.wss = new WebSocketServer({ port: 8080 });
    this.clients = new Set();
    this.connection = new Connection(SOLANA_RPC_ENDPOINT, {
      commitment: 'processed',
      wsEndpoint: SOLANA_RPC_ENDPOINT.replace('https', 'wss'),
    });
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
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.clients.delete(client);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        try {
          ws.send(JSON.stringify({ type: 'error', message: 'WebSocket error occurred' }));
        } catch (e) {
          console.error('Failed to send error message:', e);
        }
      });
    });

    // Start sending updates
    this.startUpdates();
  }

  private async handleMessage(client: Client, message: any) {
    try {
      if (message.type === 'subscribe') {
        if (message.channel === 'orderbook') {
          client.subscriptions.add(`orderbook:${message.market}`);
          await this.loadMarket(message.market);
          
          // Send initial orderbook data
          const marketData = this.markets.get(message.market);
          if (marketData) {
            const orderbook = await this.fetchOrderbook(marketData.market);
            client.ws.send(JSON.stringify({
              type: 'orderbook',
              market: message.market,
              ...orderbook,
            }));
          }
        }
      } else if (message.type === 'unsubscribe') {
        if (message.channel === 'orderbook') {
          client.subscriptions.delete(`orderbook:${message.market}`);
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
      client.ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process request',
      }));
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
          new PublicKey(SERUM_DEX_PROGRAM_ID)
        );
        
        this.markets.set(marketAddress, {
          market,
          lastBids: '',
          lastAsks: '',
        });

        // Subscribe to market data
        const marketSubscriptionId = this.connection.onAccountChange(
          market.bidsAddress,
          () => this.notifyMarketUpdate(marketAddress),
          'processed'
        );

        const asksSubscriptionId = this.connection.onAccountChange(
          market.asksAddress,
          () => this.notifyMarketUpdate(marketAddress),
          'processed'
        );

        console.log(`Loaded market ${marketAddress}`);
      } catch (error) {
        console.error('Failed to load market:', error);
        throw error;
      }
    }
  }

  private async fetchOrderbook(market: Market) {
    try {
      const [bids, asks] = await Promise.all([
        market.loadBids(this.connection),
        market.loadAsks(this.connection),
      ]);

      const processOrders = (orderbook: Orderbook) => {
        const orders: [string, string][] = [];
        for (const [price, size] of orderbook.getL2(20)) {
          orders.push([price.toFixed(6), size.toFixed(3)]);
        }
        return orders;
      };

      return {
        bids: processOrders(bids),
        asks: processOrders(asks),
      };
    } catch (error) {
      console.error('Failed to fetch orderbook:', error);
      return { bids: [], asks: [] };
    }
  }

  private async notifyMarketUpdate(marketAddress: string) {
    const marketData = this.markets.get(marketAddress);
    if (!marketData) return;

    try {
      const orderbook = await this.fetchOrderbook(marketData.market);
      const orderbookData = JSON.stringify(orderbook);
      
      // Only send update if data has changed
      if (
        orderbookData !== marketData.lastBids ||
        orderbookData !== marketData.lastAsks
      ) {
        marketData.lastBids = orderbookData;
        marketData.lastAsks = orderbookData;

        // Notify all subscribed clients
        for (const client of this.clients) {
          if (client.subscriptions.has(`orderbook:${marketAddress}`)) {
            try {
              client.ws.send(JSON.stringify({
                type: 'orderbook',
                market: marketAddress,
                ...orderbook,
              }));
            } catch (error) {
              console.error('Failed to send update to client:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to process market update:', error);
    }
  }

  private startUpdates() {
    if (this.updateInterval) return;

    // Heartbeat to keep connections alive
    this.updateInterval = setInterval(() => {
      for (const client of this.clients) {
        try {
          client.ws.ping();
        } catch (error) {
          console.error('Failed to ping client:', error);
        }
      }
    }, 30000); // Every 30 seconds
  }

  public stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    // Clean up market subscriptions
    for (const [_, marketData] of this.markets) {
      try {
        this.connection.removeAccountChangeListener(marketData.market.bidsAddress);
        this.connection.removeAccountChangeListener(marketData.market.asksAddress);
      } catch (error) {
        console.error('Failed to cleanup market subscription:', error);
      }
    }

    this.wss.close();
  }
}

export const marketDataServer = new MarketDataServer(); 