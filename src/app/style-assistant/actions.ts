"use server";

import { findSimilarItems, type FindSimilarItemsInput, type FindSimilarItemsOutput } from '@/ai/flows/find-similar-items';

interface ActionResult {
  success: boolean;
  data?: FindSimilarItemsOutput;
  error?: string;
}

export async function getSimilarItemsAction(input: FindSimilarItemsInput): Promise<ActionResult> {
  try {
    // Validate input if necessary, Zod schema in flow already does this.
    if (!input.photoDataUri || !input.photoDataUri.startsWith('data:image')) {
        return { success: false, error: "Invalid image data provided." };
    }
    const result = await findSimilarItems(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in AI Styling Assistant flow:", error);
    // It's good practice to not expose raw error messages to the client.
    // Log the detailed error on the server and return a generic message.
    let errorMessage = "Failed to find similar items due to an unexpected error.";
    if (error instanceof Error) {
        // Potentially customize message based on error type if safe
        // For example, if Zod validation fails, error.message might be more specific
        // but for now, a generic message is safer.
    }
    return { success: false, error: errorMessage };
  }
}
