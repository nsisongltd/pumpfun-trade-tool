import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import { SOLANA_RPC_ENDPOINT } from '@/core/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: { market: string } }
) {
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT);
    const marketAddress = new PublicKey(params.market);

    // This is a simplified example. In production, you'd want to:
    // 1. Cache this data
    // 2. Add proper error handling
    // 3. Handle rate limiting
    // 4. Add authentication if needed
    // 5. Implement proper market data fetching from Serum

    // Example order book data
    const orderBook = {
      bids: [
        ['20.44', '100.5'],
        ['20.43', '50.2'],
        ['20.42', '75.8'],
      ],
      asks: [
        ['20.46', '80.3'],
        ['20.47', '45.6'],
        ['20.48', '120.1'],
      ],
    };

    return NextResponse.json(orderBook);
  } catch (error) {
    console.error('Failed to fetch order book:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order book' },
      { status: 500 }
    );
  }
} 