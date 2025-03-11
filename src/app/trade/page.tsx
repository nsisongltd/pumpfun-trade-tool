'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TokenPair, MarketDepth } from '@/types';
import { MarketSelector } from '@/components/MarketSelector';
import { OrderBook } from '@/components/OrderBook';
import { OrderForm } from '@/components/OrderForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice } from '@/lib/utils';

export default function TradePage() {
  const { connected } = useWallet();
  const { toast } = useToast();
  
  const [selectedMarket, setSelectedMarket] = useState<TokenPair | null>(null);
  const [orderBookDepth, setOrderBookDepth] = useState<MarketDepth>({
    bids: [],
    asks: [],
  });

  // Placeholder data for development
  const markets: TokenPair[] = [
    // Add some sample markets here
  ];

  const handleOrderSubmit = async (order: any) => {
    if (!connected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to trade',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Implement order submission logic here
      console.log('Submitting order:', order);
      
      toast({
        title: 'Order submitted',
        description: `Successfully placed ${order.side} order for ${order.size} ${selectedMarket?.baseToken.symbol}`,
      });
    } catch (error) {
      console.error('Failed to submit order:', error);
      toast({
        title: 'Order failed',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trade</h1>
        <WalletMultiButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market selector and order form */}
        <div className="space-y-6">
          <MarketSelector
            markets={markets}
            selectedMarket={selectedMarket || undefined}
            onSelectMarket={setSelectedMarket}
          />
          
          {selectedMarket && (
            <OrderForm
              market={selectedMarket}
              onSubmitOrder={handleOrderSubmit}
            />
          )}
        </div>

        {/* Order book */}
        <div className="lg:col-span-2">
          {selectedMarket ? (
            <OrderBook
              market={selectedMarket}
              depth={orderBookDepth}
              onPriceClick={(price) => {
                // Implement price click handler
                console.log('Price clicked:', formatPrice(price));
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-[600px] border rounded-lg">
              <p className="text-muted-foreground">
                Select a market to view order book
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 