'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Decimal from 'decimal.js';
import { TokenPair } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DEFAULT_SLIPPAGE_PERCENTAGE } from '@/core/constants';
import { formatPrice, formatSize, calculateOrderImpact } from '@/lib/utils';

const orderSchema = z.object({
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
  size: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Size must be a positive number',
  }),
  slippage: z.number().min(0.1).max(100).optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface OrderFormProps {
  market: TokenPair;
  onSubmitOrder: (order: {
    side: 'buy' | 'sell';
    type: 'limit' | 'market';
    price: Decimal;
    size: Decimal;
    slippage?: number;
  }) => Promise<void>;
}

export function OrderForm({ market, onSubmitOrder }: OrderFormProps) {
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      price: market.bestBid.toString(),
      size: '',
      slippage: DEFAULT_SLIPPAGE_PERCENTAGE,
    },
  });

  const watchPrice = watch('price');
  const watchSize = watch('size');

  const estimatedCost = new Decimal(watchPrice || 0).mul(new Decimal(watchSize || 0));
  
  const onSubmit = async (data: OrderFormValues) => {
    try {
      await onSubmitOrder({
        side: orderSide,
        type: orderType,
        price: new Decimal(data.price),
        size: new Decimal(data.size),
        slippage: data.slippage,
      });
      
      // Reset size after successful order
      setValue('size', '');
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'limit' | 'market')}>
        <TabsList className="w-full">
          <TabsTrigger value="limit" className="flex-1">
            Limit
          </TabsTrigger>
          <TabsTrigger value="market" className="flex-1">
            Market
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={orderSide === 'buy' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setOrderSide('buy')}
        >
          Buy
        </Button>
        <Button
          type="button"
          variant={orderSide === 'sell' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setOrderSide('sell')}
        >
          Sell
        </Button>
      </div>

      <div className="space-y-2">
        {orderType === 'limit' && (
          <div>
            <Input
              {...register('price')}
              type="number"
              step="any"
              placeholder="Price"
              className="w-full"
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
        )}

        <div>
          <Input
            {...register('size')}
            type="number"
            step="any"
            placeholder={`Amount (${market.baseToken.symbol})`}
            className="w-full"
          />
          {errors.size && (
            <p className="text-sm text-red-500">{errors.size.message}</p>
          )}
        </div>

        {orderType === 'market' && (
          <div>
            <Input
              {...register('slippage')}
              type="number"
              step="0.1"
              placeholder="Slippage %"
              className="w-full"
            />
            {errors.slippage && (
              <p className="text-sm text-red-500">{errors.slippage.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Cost</span>
          <span>
            {formatPrice(estimatedCost)} {market.quoteToken.symbol}
          </span>
        </div>
        {orderType === 'market' && watchSize && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price Impact</span>
            <span className="text-yellow-500">
              {formatPrice(calculateOrderImpact(
                new Decimal(watchSize),
                [{ price: market.bestAsk, size: new Decimal(100) }],
                orderSide
              ).priceImpact)}%
            </span>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        variant={orderSide === 'buy' ? 'default' : 'destructive'}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Placing Order...' : `${orderSide === 'buy' ? 'Buy' : 'Sell'} ${market.baseToken.symbol}`}
      </Button>
    </form>
  );
} 