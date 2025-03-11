import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { MarketDepth } from '@/types';
import { MARKET_DATA_WS_ENDPOINT } from '@/core/constants';

async function fetchOrderBook(marketAddress: string): Promise<MarketDepth> {
  const response = await fetch(`/api/orderbook/${marketAddress}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order book');
  }
  
  const data = await response.json();
  
  return {
    bids: data.bids.map(([price, size]: [string, string]) => [
      new Decimal(price),
      new Decimal(size),
    ]),
    asks: data.asks.map(([price, size]: [string, string]) => [
      new Decimal(price),
      new Decimal(size),
    ]),
  };
}

export function useOrderBook(marketAddress: string) {
  const [depth, setDepth] = useState<MarketDepth>({
    bids: [],
    asks: [],
  });

  const { data: initialData } = useQuery({
    queryKey: ['orderbook', marketAddress],
    queryFn: () => fetchOrderBook(marketAddress),
    enabled: !!marketAddress,
  });

  useEffect(() => {
    if (initialData) {
      setDepth(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (!marketAddress) return;

    const ws = new WebSocket(MARKET_DATA_WS_ENDPOINT);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'subscribe',
        channel: 'orderbook',
        market: marketAddress,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'orderbook') {
          setDepth({
            bids: data.bids.map(([price, size]: [string, string]) => [
              new Decimal(price),
              new Decimal(size),
            ]),
            asks: data.asks.map(([price, size]: [string, string]) => [
              new Decimal(price),
              new Decimal(size),
            ]),
          });
        }
      } catch (error) {
        console.error('Failed to parse orderbook update:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [marketAddress]);

  return depth;
} 