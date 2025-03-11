'use client';

import { useState } from 'react';
import { MARKETS } from '@/core/constants';
import { OrderBook } from '@/components/OrderBook';

export default function TradePage() {
  const [selectedMarket, setSelectedMarket] = useState<string>(MARKETS['SOL/USDC']);

  return (
    <main className="flex flex-col h-screen bg-black text-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">PumpFun Trade</h1>
        <select
          value={selectedMarket}
          onChange={(e) => setSelectedMarket(e.target.value)}
          className="px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(MARKETS).map(([pair, address]) => (
            <option key={pair} value={address}>
              {pair}
            </option>
          ))}
        </select>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-4 p-4">
        {/* Chart section */}
        <div className="col-span-8 bg-gray-900 rounded-lg">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Chart</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        </div>

        {/* Orderbook section */}
        <div className="col-span-4">
          <OrderBook marketAddress={selectedMarket} className="h-full" />
        </div>
      </div>
    </main>
  );
} 