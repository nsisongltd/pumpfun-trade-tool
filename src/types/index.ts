import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  price: Decimal;
  volume24h: Decimal;
  priceChange24h: Decimal;
}

export interface TokenPair {
  baseToken: Token;
  quoteToken: Token;
  marketAddress: PublicKey;
  bestBid: Decimal;
  bestAsk: Decimal;
  volume24h: Decimal;
  priceChange24h: Decimal;
}

export interface Order {
  id: string;
  marketAddress: string;
  side: 'buy' | 'sell';
  price: Decimal;
  size: Decimal;
  remainingSize: Decimal;
  status: 'open' | 'filled' | 'cancelled';
  type: 'limit' | 'market';
  createdAt: Date;
  updatedAt: Date;
}

export interface Trade {
  id: string;
  marketAddress: string;
  orderId: string;
  side: 'buy' | 'sell';
  price: Decimal;
  size: Decimal;
  fee: Decimal;
  timestamp: Date;
}

export interface Portfolio {
  tokens: {
    [address: string]: {
      balance: Decimal;
      value: Decimal;
      averageEntryPrice: Decimal;
      pnl: Decimal;
    };
  };
  totalValue: Decimal;
  totalPnl: Decimal;
}

export interface Alert {
  id: string;
  tokenAddress: string;
  condition: 'above' | 'below';
  price: Decimal;
  triggered: boolean;
  createdAt: Date;
}

export interface MarketDepth {
  bids: [Decimal, Decimal][]; // [price, size][]
  asks: [Decimal, Decimal][]; // [price, size][]
}

export interface ChartData {
  timestamp: number;
  open: Decimal;
  high: Decimal;
  low: Decimal;
  close: Decimal;
  volume: Decimal;
}
