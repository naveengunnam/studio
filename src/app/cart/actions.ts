
"use server";

import { recommendProducts as recommendProductsFlow, type CartItemsInfoInput, type RecommendedProductsOutput } from '@/ai/flows/recommend-products-flow';

interface ActionResult {
  success: boolean;
  data?: RecommendedProductsOutput;
  error?: string;
}

export async function getRecommendedProductsAction(input: CartItemsInfoInput): Promise<ActionResult> {
  try {
    if (!input || input.items.length === 0) {
      return { success: true, data: { recommendations: [] } }; // No items, no recommendations
    }
    const result = await recommendProductsFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in recommend products flow:", error);
    let errorMessage = "Failed to fetch recommendations due to an unexpected error.";
    if (error instanceof Error) {
      // You might want to log error.message or specific parts if safe
    }
    return { success: false, error: errorMessage };
  }
}
