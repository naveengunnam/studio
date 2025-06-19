"use client";

import Image from 'next/image';
import type { SimilarItem } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface SimilarItemCardProps {
  item: SimilarItem;
}

export default function SimilarItemCard({ item }: SimilarItemCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="aspect-w-16 aspect-h-9">
          <Image
            src={item.imageUrl || 'https://placehold.co/600x400.png'} // Fallback if imageUrl is empty
            alt={item.name}
            width={600}
            height={400}
            className="object-cover w-full h-48"
            data-ai-hint={item.dataAiHint || 'fashion item'}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1 truncate" title={item.name}>{item.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground h-10 overflow-hidden text-ellipsis">
          {item.description}
        </CardDescription>
        <p className="text-lg font-semibold text-primary mt-2">Rs. {item.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button variant="outline" className="w-full">
          <ExternalLink className="mr-2 h-4 w-4" /> View Item
        </Button>
      </CardFooter>
    </Card>
  );
}
