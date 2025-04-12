'use server';

/**
 * @fileOverview Poem generation flow.
 *
 * - generatePoem - A function that generates a poem based on the uploaded image.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the GeneratePoem function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GeneratePoemInputSchema = z.object({
  imageUrl: z.string().describe('The URL of the image to inspire the poem.'),
  tone: z.string().optional().describe('The desired tone of the poem (e.g., happy, sad, reflective).'),
});
export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('The generated poem.'),
});
export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  return poemFlow(input);
}

const poemPrompt = ai.definePrompt({
  name: 'poemPrompt',
  input: {
    schema: z.object({
      imageUrl: z.string().describe('The URL of the image to inspire the poem.'),
      tone: z.string().optional().describe('The desired tone of the poem (e.g., happy, sad, reflective).'),
    }),
  },
  output: {
    schema: z.object({
      poem: z.string().describe('The generated poem.'),
    }),
  },
  prompt: `You are a poet. Generate a poem based on the image provided.
The poem should be at least 3 stanzas.
Each stanza should be 4-8 lines long.
The poem should evoke the imagery of the photo.

{{#if tone}}
The tone of the poem should be {{tone}}.
{{/if}}

Here is the image:
{{media url=imageUrl contentType="image/jpeg"}}`,
});

const poemFlow = ai.defineFlow<
  typeof GeneratePoemInputSchema,
  typeof GeneratePoemOutputSchema
>(
  {
    name: 'poemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async input => {
    const {output} = await poemPrompt(input);
    return output!;
  }
);
