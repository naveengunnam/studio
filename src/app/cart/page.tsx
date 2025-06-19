"use client";

import { useCart } from '@/contexts/CartContext';
import CartItemCard from '@/components/CartItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingCart, AlertTriangle } from 'lucide-react';

export default function CartPage() {
  const { cartItems, getCartTotal, clearCart, getCartItemCount } = useCart();
  const cartTotal = getCartTotal();
  const itemCount = getCartItemCount();

  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold font-headline mb-4 text-primary">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold font-headline text-center mb-10 text-primary">Your Shopping Cart</h1>
      
      <div className="space-y-6 mb-8">
        {cartItems.map(item => (
          <CartItemCard key={item.product.id} item={item} />
        ))}
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Total Items:</p>
            <p className="font-semibold">{itemCount}</p>
          </div>
          <div className="flex justify-between items-center text-xl font-semibold">
            <p>Grand Total:</p>
            <p className="text-primary">${cartTotal.toFixed(2)}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
          <Button variant="outline" onClick={clearCart} className="w-full sm:w-auto">
            <AlertTriangle className="mr-2 h-4 w-4" /> Clear Cart
          </Button>
          <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            Proceed to Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
