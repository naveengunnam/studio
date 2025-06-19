"use client";

import Image from 'next/image';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, CheckCircle, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      action: (
        <div className="flex items-center text-green-500">
          <CheckCircle className="mr-2 h-5 w-5" />
          Success
        </div>
      )
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto bg-card p-6 sm:p-8 rounded-xl shadow-2xl">
      <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={800}
          height={800}
          className="object-cover w-full h-full"
          data-ai-hint={product.dataAiHint}
          priority
        />
      </div>
      <div className="flex flex-col justify-between h-full">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold font-headline text-primary mb-3">{product.name}</h1>
          {product.category && (
            <Badge variant="secondary" className="mb-4 text-sm">
              <Tag className="mr-1.5 h-3 w-3" />
              {product.category}
            </Badge>
          )}
          <p className="text-2xl font-semibold text-foreground mb-4">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed mb-6">{product.longDescription}</p>

          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground mb-2">Available Colors:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <Badge key={color} variant="outline" className="px-3 py-1">{color}</Badge>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground mb-2">Available Sizes:</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <Badge key={size} variant="outline" className="px-3 py-1">{size}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button onClick={handleAddToCart} size="lg" className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6">
          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}
