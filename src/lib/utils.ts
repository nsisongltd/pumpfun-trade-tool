import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Decimal from 'decimal.js';
import { PRICE_DECIMALS, SIZE_DECIMALS } from '@/core/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: Decimal | number | string): string {
  return new Decimal(price).toFixed(PRICE_DECIMALS);
}

export function formatSize(size: Decimal | number | string): string {
  return new Decimal(size).toFixed(SIZE_DECIMALS);
}

export function formatPercentage(value: Decimal | number | string): string {
  return `${new Decimal(value).toFixed(2)}%`;
}

export function formatUSD(value: Decimal | number | string): string {
  return new Decimal(value).toFixed(2);
}

export function calculateSlippage(price: Decimal, slippagePercentage: number): Decimal {
  return price.mul(new Decimal(1).plus(new Decimal(slippagePercentage).div(100)));
}

export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function calculatePnL(entryPrice: Decimal, currentPrice: Decimal, size: Decimal): {
  absolutePnL: Decimal;
  percentagePnL: Decimal;
} {
  const absolutePnL = currentPrice.minus(entryPrice).mul(size);
  const percentagePnL = currentPrice.minus(entryPrice).div(entryPrice).mul(100);
  return { absolutePnL, percentagePnL };
}

export function groupPricesByLevel(
  prices: [Decimal, Decimal][],
  levelSize: Decimal
): [Decimal, Decimal][] {
  const grouped = new Map<string, Decimal>();
  
  prices.forEach(([price, size]) => {
    const level = price.div(levelSize).floor().mul(levelSize);
    const existing = grouped.get(level.toString()) || new Decimal(0);
    grouped.set(level.toString(), existing.plus(size));
  });
  
  return Array.from(grouped.entries())
    .map(([price, size]) => [new Decimal(price), size])
    .sort(([a], [b]) => a.comparedTo(b));
}

export function calculateOrderImpact(
  orderSize: Decimal,
  orderBook: { price: Decimal; size: Decimal }[],
  side: 'buy' | 'sell'
): { avgPrice: Decimal; priceImpact: Decimal } {
  let remainingSize = orderSize;
  let totalCost = new Decimal(0);
  
  for (const level of orderBook) {
    const fillSize = Decimal.min(remainingSize, level.size);
    totalCost = totalCost.plus(fillSize.mul(level.price));
    remainingSize = remainingSize.minus(fillSize);
    
    if (remainingSize.isZero()) break;
  }
  
  const avgPrice = totalCost.div(orderSize);
  const priceImpact = side === 'buy'
    ? avgPrice.minus(orderBook[0].price).div(orderBook[0].price).mul(100)
    : orderBook[0].price.minus(avgPrice).div(orderBook[0].price).mul(100);
    
  return { avgPrice, priceImpact };
}
