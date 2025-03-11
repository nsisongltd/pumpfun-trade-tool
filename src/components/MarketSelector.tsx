'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TokenPair } from '@/types';
import { formatPrice, formatPercentage } from '@/lib/utils';

interface MarketSelectorProps {
  markets: TokenPair[];
  selectedMarket?: TokenPair;
  onSelectMarket: (market: TokenPair) => void;
}

export function MarketSelector({
  markets,
  selectedMarket,
  onSelectMarket,
}: MarketSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMarkets = markets.filter((market) =>
    market.baseToken.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    market.quoteToken.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-2">
      <Input
        type="text"
        placeholder="Search markets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      
      <Select
        value={selectedMarket?.marketAddress.toString()}
        onValueChange={(value) => {
          const market = markets.find((m) => m.marketAddress.toString() === value);
          if (market) onSelectMarket(market);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a market">
            {selectedMarket && (
              <div className="flex items-center justify-between w-full">
                <span>
                  {selectedMarket.baseToken.symbol}/{selectedMarket.quoteToken.symbol}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatPrice(selectedMarket.bestBid)}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent>
          {filteredMarkets.map((market) => (
            <SelectItem
              key={market.marketAddress.toString()}
              value={market.marketAddress.toString()}
              className="flex items-center justify-between py-2 px-4 hover:bg-accent cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {market.baseToken.symbol}/{market.quoteToken.symbol}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Vol: ${formatPrice(market.volume24h)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span>{formatPrice(market.bestBid)}</span>
                <span
                  className={`text-sm ${
                    market.priceChange24h.isPositive()
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {formatPercentage(market.priceChange24h)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 