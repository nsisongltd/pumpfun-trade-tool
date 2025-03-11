'use client';

import { useMemo } from 'react';
import Decimal from 'decimal.js';
import { TokenPair, MarketDepth } from '@/types';
import { formatPrice, formatSize, groupPricesByLevel } from '@/lib/utils';
import { ORDER_BOOK_DEPTH } from '@/core/constants';

interface OrderBookProps {
  market: TokenPair;
  depth: MarketDepth;
  onPriceClick: (price: Decimal) => void;
}

export function OrderBook({ market, depth, onPriceClick }: OrderBookProps) {
  const processedDepth = useMemo(() => {
    const tickSize = new Decimal('0.00001'); // Adjust based on market
    
    const bids = groupPricesByLevel(depth.bids, tickSize)
      .sort(([a], [b]) => b.comparedTo(a))
      .slice(0, ORDER_BOOK_DEPTH);
      
    const asks = groupPricesByLevel(depth.asks, tickSize)
      .sort(([a], [b]) => a.comparedTo(b))
      .slice(0, ORDER_BOOK_DEPTH);
      
    const maxSize = Decimal.max(
      ...bids.map(([_, size]) => size),
      ...asks.map(([_, size]) => size)
    );

    return {
      bids,
      asks,
      maxSize,
    };
  }, [depth]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
        <div>Price ({market.quoteToken.symbol})</div>
        <div className="text-right">Size ({market.baseToken.symbol})</div>
        <div className="text-right">Total</div>
      </div>

      <div className="space-y-1">
        {/* Asks */}
        <div className="space-y-[2px]">
          {processedDepth.asks.map(([price, size]) => {
            const sizePercentage = size
              .div(processedDepth.maxSize)
              .mul(100)
              .toNumber();

            return (
              <div
                key={price.toString()}
                className="relative grid grid-cols-3 gap-4 px-4 py-1 cursor-pointer hover:bg-accent/50"
                onClick={() => onPriceClick(price)}
              >
                <div
                  className="absolute inset-0 bg-red-500/10"
                  style={{ width: `${sizePercentage}%` }}
                />
                <div className="relative text-red-500">
                  {formatPrice(price)}
                </div>
                <div className="relative text-right">
                  {formatSize(size)}
                </div>
                <div className="relative text-right">
                  {formatPrice(price.mul(size))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Spread */}
        <div className="px-4 py-2 text-sm text-center text-muted-foreground">
          Spread:{' '}
          {formatPrice(
            new Decimal(processedDepth.asks[0]?.[0] || 0).minus(
              processedDepth.bids[0]?.[0] || 0
            )
          )}{' '}
          (
          {formatPrice(
            new Decimal(processedDepth.asks[0]?.[0] || 0)
              .minus(processedDepth.bids[0]?.[0] || 0)
              .div(processedDepth.asks[0]?.[0] || 1)
              .mul(100)
          )}
          %)
        </div>

        {/* Bids */}
        <div className="space-y-[2px]">
          {processedDepth.bids.map(([price, size]) => {
            const sizePercentage = size
              .div(processedDepth.maxSize)
              .mul(100)
              .toNumber();

            return (
              <div
                key={price.toString()}
                className="relative grid grid-cols-3 gap-4 px-4 py-1 cursor-pointer hover:bg-accent/50"
                onClick={() => onPriceClick(price)}
              >
                <div
                  className="absolute inset-0 bg-green-500/10"
                  style={{ width: `${sizePercentage}%` }}
                />
                <div className="relative text-green-500">
                  {formatPrice(price)}
                </div>
                <div className="relative text-right">
                  {formatSize(size)}
                </div>
                <div className="relative text-right">
                  {formatPrice(price.mul(size))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 