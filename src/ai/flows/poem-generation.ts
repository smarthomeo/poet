'use server';

/**
 * @fileOverview Poem generation flow.
 *
 * - generatePoem - A function that generates a poem based on the uploaded image.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the GeneratePoem function.
 */

import {z} from 'genkit';

const GeneratePoemInputSchema = z.object({
  imageUrl: z.string().describe('The URL of the image to inspire the poem.'),
});
export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('The generated poem.'),
});
export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
    return {poem: 'Poem generation is disabled.'};
}
