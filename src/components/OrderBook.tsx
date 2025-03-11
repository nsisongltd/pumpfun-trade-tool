import React, { useMemo } from 'react';
import { useOrderBook } from '@/hooks/useOrderBook';
import { ORDERBOOK_DEPTH } from '@/core/constants';

interface OrderBookProps {
  marketAddress: string;
  className?: string;
}

interface PriceLevelProps {
  price: string;
  size: string;
  total: string;
  side: 'bid' | 'ask';
  maxTotal: number;
  className?: string;
}

const PriceLevel: React.FC<PriceLevelProps> = ({
  price,
  size,
  total,
  side,
  maxTotal,
  className = '',
}) => {
  const depth = (Number(total) / maxTotal) * 100;
  const bgColor = side === 'bid' ? 'bg-green-500/10' : 'bg-red-500/10';

  return (
    <div className={`relative grid grid-cols-3 gap-4 px-4 py-1 text-sm ${className}`}>
      <div
        className={`absolute inset-0 ${bgColor}`}
        style={{ width: `${depth}%`, opacity: 0.3 }}
      />
      <span className={`relative ${side === 'bid' ? 'text-green-500' : 'text-red-500'}`}>
        {Number(price).toFixed(2)}
      </span>
      <span className="relative text-right">{Number(size).toFixed(3)}</span>
      <span className="relative text-right">{Number(total).toFixed(3)}</span>
    </div>
  );
};

export const OrderBook: React.FC<OrderBookProps> = ({ marketAddress, className = '' }) => {
  const { bids, asks, loading, error, getBestBid, getBestAsk, getMidPrice } = useOrderBook(marketAddress);

  const processedData = useMemo(() => {
    const bidTotals: string[] = [];
    const askTotals: string[] = [];
    let bidTotal = 0;
    let askTotal = 0;

    bids.slice(0, ORDERBOOK_DEPTH).forEach(([_, size]) => {
      bidTotal += Number(size);
      bidTotals.push(bidTotal.toString());
    });

    asks.slice(0, ORDERBOOK_DEPTH).forEach(([_, size]) => {
      askTotal += Number(size);
      askTotals.push(askTotal.toString());
    });

    const maxTotal = Math.max(bidTotal, askTotal);

    return {
      bidTotals,
      askTotals,
      maxTotal,
    };
  }, [bids, asks]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        Loading orderbook...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-4 text-red-500 ${className}`}>
        {error}
      </div>
    );
  }

  const bestBid = getBestBid();
  const bestAsk = getBestAsk();
  const midPrice = getMidPrice();

  return (
    <div className={`flex flex-col bg-gray-900 rounded-lg ${className}`}>
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold mb-2">Order Book</h2>
        {midPrice && (
          <div className="text-sm text-gray-400">
            Mid Price: ${Number(midPrice).toFixed(2)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 px-4 py-2 text-xs text-gray-400 border-b border-gray-800">
        <span>PRICE</span>
        <span className="text-right">SIZE</span>
        <span className="text-right">TOTAL</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col-reverse">
          {asks.slice(0, ORDERBOOK_DEPTH).map(([price, size], i) => (
            <PriceLevel
              key={`ask-${price}`}
              price={price}
              size={size}
              total={processedData.askTotals[i]}
              side="ask"
              maxTotal={processedData.maxTotal}
              className={price === bestAsk ? 'bg-red-500/5' : ''}
            />
          ))}
        </div>

        <div className="flex flex-col">
          {bids.slice(0, ORDERBOOK_DEPTH).map(([price, size], i) => (
            <PriceLevel
              key={`bid-${price}`}
              price={price}
              size={size}
              total={processedData.bidTotals[i]}
              side="bid"
              maxTotal={processedData.maxTotal}
              className={price === bestBid ? 'bg-green-500/5' : ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 