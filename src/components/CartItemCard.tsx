"use client";

import Image from 'next/image';
import type { CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { X, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

interface CartItemCardProps {
  item: CartItemType;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.product.id, newQuantity);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <Link href={`/products/${item.product.id}`} className="shrink-0">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          width={100}
          height={100}
          className="rounded-md object-cover aspect-square"
          data-ai-hint={item.product.dataAiHint}
        />
      </Link>
      <div className="flex-grow">
        <Link href={`/products/${item.product.id}`}>
          <h3 className="text-lg font-semibold font-headline hover:text-primary transition-colors">{item.product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">Rs. {item.product.price.toFixed(2)} each</p>
        <p className="text-md font-semibold text-primary mt-1">
          Subtotal: Rs. {(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
          min="1"
          className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          aria-label="Item quantity"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeFromCart(item.product.id)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        aria-label="Remove item"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
