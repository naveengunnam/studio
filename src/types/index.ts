export interface Product {
  id: string;
  name: string;
  price: number;
  description: string; // Short description for card
  longDescription: string; // Detailed description
  imageUrl: string;
  dataAiHint?: string; // For placeholder images
  colors?: string[];
  sizes?: string[];
  category?: string;
}

export interface CartItemType {
  product: Product;
  quantity: number;
}

export interface SimilarItem {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  dataAiHint?: string;
}
