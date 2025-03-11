import { useState, useEffect, useCallback, useRef } from 'react';
import { WS_PORT } from '@/core/constants';

interface OrderBookData {
  bids: [string, string][]; // [price, size][]
  asks: [string, string][]; // [price, size][]
}

interface OrderBookState extends OrderBookData {
  loading: boolean;
  error: string | null;
}

const initialState: OrderBookState = {
  bids: [],
  asks: [],
  loading: true,
  error: null,
};

export function useOrderBook(marketAddress: string) {
  const [state, setState] = useState<OrderBookState>(initialState);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(`ws://localhost:${WS_PORT}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        ws.send(JSON.stringify({
          type: 'subscribe',
          channel: 'orderbook',
          market: marketAddress,
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'orderbook' && data.market === marketAddress) {
            setState((prev) => ({
              ...prev,
              bids: data.bids,
              asks: data.asks,
              loading: false,
              error: null,
            }));
          } else if (data.type === 'error') {
            setState((prev) => ({
              ...prev,
              error: data.message,
              loading: false,
            }));
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          setState((prev) => ({
            ...prev,
            error: 'Failed to parse server message',
            loading: false,
          }));
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState((prev) => ({
          ...prev,
          error: 'WebSocket connection error',
          loading: false,
        }));
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setState((prev) => ({
          ...prev,
          loading: true,
          error: 'Connection closed',
        }));
        // Attempt to reconnect after 5 seconds
        setTimeout(connect, 5000);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setState((prev) => ({
        ...prev,
        error: 'Failed to connect to server',
        loading: false,
      }));
    }
  }, [marketAddress]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect, marketAddress]);

  const getBestBid = useCallback(() => {
    return state.bids[0]?.[0] ?? null;
  }, [state.bids]);

  const getBestAsk = useCallback(() => {
    return state.asks[0]?.[0] ?? null;
  }, [state.asks]);

  const getMidPrice = useCallback(() => {
    const bestBid = getBestBid();
    const bestAsk = getBestAsk();
    if (!bestBid || !bestAsk) return null;
    return (Number(bestBid) + Number(bestAsk)) / 2;
  }, [getBestBid, getBestAsk]);

  return {
    ...state,
    getBestBid,
    getBestAsk,
    getMidPrice,
  };
} 