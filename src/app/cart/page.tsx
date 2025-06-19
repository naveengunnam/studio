
"use client";

import { useCart } from '@/contexts/CartContext';
import CartItemCard from '@/components/CartItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingCart, AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SimilarItem } from '@/types';
import { getRecommendedProductsAction } from './actions';
import SimilarItemCard from '@/components/SimilarItemCard';

export default function CartPage() {
  const { cartItems, getCartTotal, clearCart, getCartItemCount } = useCart();
  const cartTotal = getCartTotal();
  const itemCount = getCartItemCount();

  const [recommendations, setRecommendations] = useState<SimilarItem[]>([]);
  const [isFetchingRecommendations, setIsFetchingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      if (itemCount > 0) {
        setIsFetchingRecommendations(true);
        setRecommendationError(null);
        setRecommendations([]); // Clear previous recommendations

        const cartDetails = cartItems.map(item => ({
          name: item.product.name,
          description: item.product.description,
          category: item.product.category,
        }));

        const result = await getRecommendedProductsAction({ items: cartDetails });

        if (result.success && result.data) {
          setRecommendations(result.data.recommendations as SimilarItem[]);
        } else {
          setRecommendationError(result.error || "Could not fetch recommendations.");
        }
        setIsFetchingRecommendations(false);
      } else {
        setRecommendations([]); // Clear recommendations if cart is empty
        setRecommendationError(null);
      }
    }

    fetchRecommendations();
  }, [cartItems, itemCount]); // itemCount is derived from cartItems, but explicit dependency can be clearer

  if (itemCount === 0 && !isFetchingRecommendations) { // Ensure loader doesn't flash for empty cart
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
      
      {itemCount > 0 ? (
        <>
          <div className="space-y-6 mb-8">
            {cartItems.map(item => (
              <CartItemCard key={item.product.id} item={item} />
            ))}
          </div>

          <Card className="shadow-xl mb-12">
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
        </>
      ) : (
         <div className="text-center py-20">
            <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold font-headline mb-4 text-primary">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/">Continue Shopping</Link>
            </Button>
         </div>
      )}

      {/* AI Recommendations Section */}
      {itemCount > 0 && (
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-3xl font-bold font-headline text-center mb-8 text-primary">You Might Also Like</h2>
          {isFetchingRecommendations && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-4 text-lg text-muted-foreground">Finding recommendations...</p>
            </div>
          )}
          {recommendationError && !isFetchingRecommendations && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 mr-3 shrink-0" />
              <p>{recommendationError}</p>
            </div>
          )}
          {!isFetchingRecommendations && !recommendationError && recommendations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((item, index) => (
                <SimilarItemCard key={index} item={item} />
              ))}
            </div>
          )}
          {!isFetchingRecommendations && !recommendationError && recommendations.length === 0 && itemCount > 0 && (
             <p className="text-center text-muted-foreground py-8">No specific recommendations at this time. Explore more products!</p>
          )}
        </section>
      )}
    </div>
  );
}
