import { Cluster } from '@solana/web3.js';

export const SOLANA_CLUSTER: Cluster = 'mainnet-beta';
export const SOLANA_RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';

export const SERUM_DEX_PROGRAM_ID = 'DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY';

// Common token addresses
export const WRAPPED_SOL_MINT = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const USDT_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

// Trading constants
export const DEFAULT_SLIPPAGE_PERCENTAGE = 1.0; // 1%
export const MAX_SLIPPAGE_PERCENTAGE = 5.0; // 5%
export const ORDER_BOOK_DEPTH = 20;
export const PRICE_DECIMALS = 6;
export const SIZE_DECIMALS = 3;

// WebSocket endpoints
export const MARKET_DATA_WS_ENDPOINT = 'wss://api.yourplatform.com/ws/market';
export const TRADE_WS_ENDPOINT = 'wss://api.yourplatform.com/ws/trade';

// API endpoints
export const API_BASE_URL = 'https://api.yourplatform.com';
export const API_ENDPOINTS = {
  markets: '/markets',
  orderbook: '/orderbook',
  trades: '/trades',
  orders: '/orders',
  portfolio: '/portfolio',
  alerts: '/alerts',
} as const;

// Chart intervals
export const CHART_INTERVALS = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1h': 3600,
  '4h': 14400,
  '1d': 86400,
} as const;

// UI constants
export const TOAST_DURATION = 5000; // 5 seconds
export const MOBILE_BREAKPOINT = 768;
export const DESKTOP_BREAKPOINT = 1024;

// Cache durations
export const CACHE_DURATIONS = {
  marketList: 60 * 1000, // 1 minute
  tokenInfo: 5 * 60 * 1000, // 5 minutes
  orderBook: 1000, // 1 second
  trades: 1000, // 1 second
  portfolio: 30 * 1000, // 30 seconds
} as const;
