import { useQuery } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { TokenPair } from '@/types';

async function fetchMarkets(): Promise<TokenPair[]> {
  const response = await fetch('/api/markets');
  if (!response.ok) {
    throw new Error('Failed to fetch markets');
  }
  
  const data = await response.json();
  
  // Convert string values to Decimal
  return data.markets.map((market: any) => ({
    baseToken: {
      ...market.baseToken,
      price: new Decimal(market.baseToken.price),
      volume24h: new Decimal(market.baseToken.volume24h),
      priceChange24h: new Decimal(market.baseToken.priceChange24h),
    },
    quoteToken: {
      ...market.quoteToken,
      price: new Decimal(market.quoteToken.price),
      volume24h: new Decimal(market.quoteToken.volume24h),
      priceChange24h: new Decimal(market.quoteToken.priceChange24h),
    },
    marketAddress: market.marketAddress,
    bestBid: new Decimal(market.bestBid),
    bestAsk: new Decimal(market.bestAsk),
    volume24h: new Decimal(market.volume24h),
    priceChange24h: new Decimal(market.priceChange24h),
  }));
}

export function useMarkets() {
  return useQuery({
    queryKey: ['markets'],
    queryFn: fetchMarkets,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
} 