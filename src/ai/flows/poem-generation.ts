'use server';

/**
 * @fileOverview Poem generation flow.
 *
 * - generatePoem - A function that generates a poem based on the uploaded image.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the generatePoem function.
 */

import {ai} from '@/ai/ai-instance';
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
  return generatePoemFlow(input);
}

async function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(blobUrl)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
  });
}

const poemPrompt = ai.definePrompt({
  name: 'poemPrompt',
  input: {
    schema: z.object({
      imageUrl: z.string().describe('The URL of the image to inspire the poem.'),
    }),
  },
  output: {
    schema: z.object({
      poem: z.string().describe('The generated poem.'),
    }),
  },
  prompt: `You are a poet, skilled at creating beautiful and evocative poems.  Create a poem inspired by the following image: {{media url=imageUrl contentType="image/*"}}`,
});

const generatePoemFlow = ai.defineFlow<
  typeof GeneratePoemInputSchema,
  typeof GeneratePoemOutputSchema
>(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async input => {
    // Convert blob URL to data URL
    let imageUrl = input.imageUrl;
    if (imageUrl.startsWith('blob:')) {
      imageUrl = await blobUrlToDataUrl(imageUrl);
    }
    const {output} = await poemPrompt({imageUrl});
    return output!;
  }
);
