import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import { SOLANA_RPC_ENDPOINT, SERUM_DEX_PROGRAM_ID } from '@/core/constants';

export async function GET() {
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT);
    const programId = new PublicKey(SERUM_DEX_PROGRAM_ID);

    // This is a simplified example. In prod, i need to:
    // 1. Cache this data
    // 2. Add proper error handling
    // 3. Include more market information
    // 4. Handle rate limiting
    // 5. Add authentication if needed

    const markets = [
      // Example market data
      {
        baseToken: {
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          decimals: 9,
          price: '20.45',
          volume24h: '1000000',
          priceChange24h: '2.5',
        },
        quoteToken: {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          price: '1.00',
          volume24h: '5000000',
          priceChange24h: '0.01',
        },
        marketAddress: 'HWHvQhFmJB3NUcu1aihKmrKegfVxBEHzwVX6yZCKEsi1',
        bestBid: '20.44',
        bestAsk: '20.46',
        volume24h: '1000000',
        priceChange24h: '2.5',
      },
      // Add more markets as needed
    ];

    return NextResponse.json({ markets });
  } catch (error) {
    console.error('Failed to fetch markets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markets' },
      { status: 500 }
    );
  }
} 