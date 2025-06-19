
'use server';
/**
 * @fileOverview A flow that recommends products based on items currently in the cart.
 *
 * - recommendProducts - A function that handles product recommendations.
 * - CartItemsInfoInput - The input type for the recommendProducts function.
 * - RecommendedProductsOutput - The return type for the recommendProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CartItemsInfoInputSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().describe('The name of the item in the cart.'),
      description: z.string().describe('The description of the item in the cart.'),
      category: z.string().optional().describe('The category of the item in the cart.'),
    })
  ).describe('A list of items currently in the shopping cart.'),
});
export type CartItemsInfoInput = z.infer<typeof CartItemsInfoInputSchema>;

const RecommendedProductSchema = z.object({
  name: z.string().describe('The name of the recommended product.'),
  description: z.string().describe('A brief description of the recommended product.'),
  imageUrl: z.string().describe("A placeholder image URL for the recommended product (e.g., 'https://placehold.co/300x200.png'). It can be an empty string if no suitable image is found."),
  price: z.number().describe('A plausible price for the recommended product.'),
  dataAiHint: z.string().optional().describe('A 1-2 word hint for the image (e.g., "red_dress", "kitchen_gadget").'),
});

const RecommendedProductsOutputSchema = z.object({
  recommendations: z.array(RecommendedProductSchema).min(2).max(3).describe('A list of 2-3 recommended products.'),
});
export type RecommendedProductsOutput = z.infer<typeof RecommendedProductsOutputSchema>;

export async function recommendProducts(input: CartItemsInfoInput): Promise<RecommendedProductsOutput> {
  return recommendProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendProductsPrompt',
  input: {schema: CartItemsInfoInputSchema},
  output: {schema: RecommendedProductsOutputSchema},
  prompt: `You are a helpful shopping assistant for an e-commerce store called ShopWave.
Based on the following items currently in the user's shopping cart, please recommend other products from our catalog that would complement them or that the user might also like.

Current cart items:
{{#each items}}
- Name: {{name}}
  Description: {{description}}
  {{#if category}}Category: {{category}}{{/if}}
{{/each}}

For each recommended product, provide:
1.  A concise 'name'.
2.  A short 'description' (1-2 sentences).
3.  An 'imageUrl' using a placeholder like 'https://placehold.co/300x200.png'.
4.  A plausible 'price' (e.g., 29.99, ensure this is a number).
5.  A 'dataAiHint' (1-2 keywords for the image, e.g., "summer_accessory", "tech_gadget").

Ensure your output strictly adheres to the JSON schema provided for 'RecommendedProductsOutputSchema'.
Focus on providing diverse and relevant suggestions. Do not recommend items already in the cart.
Generate between 2 and 3 recommendations.
`,
});

const recommendProductsFlow = ai.defineFlow(
  {
    name: 'recommendProductsFlow',
    inputSchema: CartItemsInfoInputSchema,
    outputSchema: RecommendedProductsOutputSchema,
  },
  async (input: CartItemsInfoInput) => {
    if (input.items.length === 0) {
      return { recommendations: [] };
    }
    const {output} = await prompt(input);
    return output || { recommendations: [] };
  }
);

