"use client";

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getSimilarItemsAction } from '@/app/style-assistant/actions';
import type { SimilarItem } from '@/types';
import SimilarItemCard from './SimilarItemCard';
import { UploadCloud, Loader2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function StyleAssistantForm() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [similarItems, setSimilarItems] = useState<SimilarItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
        });
        setFilePreview(null);
        setPhotoDataUri(null);
        event.target.value = ''; // Clear the input
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFilePreview(result); // For image preview
        setPhotoDataUri(result); // For sending to AI
      };
      reader.readAsDataURL(file);
      setSimilarItems(null); // Clear previous results
      setError(null); // Clear previous errors
    } else {
      setFilePreview(null);
      setPhotoDataUri(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!photoDataUri) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please upload an image to find similar items.",
      });
      return;
    }

    setIsLoading(true);
    setSimilarItems(null);
    setError(null);

    const result = await getSimilarItemsAction({ photoDataUri });

    setIsLoading(false);
    if (result.success && result.data) {
      setSimilarItems(result.data.items as SimilarItem[]); // Cast as local SimilarItem type
      if (result.data.items.length === 0) {
        toast({
          title: "No similar items found",
          description: "Try uploading a different image or a clearer one.",
        });
      }
    } else {
      setError(result.error || 'An unknown error occurred.');
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || 'Could not fetch similar items.',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center text-primary">AI Styling Assistant</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Upload an image of an item, and our AI will find similar products for you!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="photo" className="block text-sm font-medium text-foreground mb-2">Upload Photo</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-primary transition-colors">
              <div className="space-y-1 text-center">
                {filePreview ? (
                  <div className="relative w-full max-w-xs mx-auto">
                     <Image src={filePreview} alt="Preview" width={200} height={200} className="mx-auto h-40 w-auto rounded-md object-contain" />
                     <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => { setFilePreview(null); setPhotoDataUri(null); setSimilarItems(null); const el = document.getElementById('photo') as HTMLInputElement; if(el) el.value = ''; }}>Clear image</Button>
                  </div>
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                )}
                <div className="flex text-sm text-muted-foreground justify-center">
                  <Label
                    htmlFor="photo"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Upload a file</span>
                    <Input id="photo" name="photo" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                  </Label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" disabled={isLoading || !photoDataUri}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finding Styles...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-5 w-5" /> Find Similar Items
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {similarItems && similarItems.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-headline font-semibold mb-6 text-center">Similar Items Found</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarItems.map((item, index) => (
                <SimilarItemCard key={index} item={item} />
              ))}
            </div>
          </div>
        )}
         {similarItems && similarItems.length === 0 && !isLoading && (
          <div className="mt-10 text-center text-muted-foreground">
            <p>No similar items were found for the uploaded image. Try a different one!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
