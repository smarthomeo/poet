'use server';
/**
 * @fileOverview A poem generator AI agent that allows the user to select the tone of the poem.
 *
 * - generatePoemWithTone - A function that handles the poem generation process with tone adjustment.
 * - GeneratePoemWithToneInput - The input type for the generatePoemWithTone function.
 * - GeneratePoemWithToneOutput - The return type for the GeneratePoemWithTone function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GeneratePoemWithToneInputSchema = z.object({
  imageUrl: z.string().describe('The URL of the image to inspire the poem.'),
  tone: z.string().describe('The desired tone of the poem (e.g., happy, sad, reflective).'),
});
export type GeneratePoemWithToneInput = z.infer<typeof GeneratePoemWithToneInputSchema>;

const GeneratePoemWithToneOutputSchema = z.object({
  poem: z.string().describe('The generated poem based on the image and desired tone.'),
});
export type GeneratePoemWithToneOutput = z.infer<typeof GeneratePoemWithToneOutputSchema>;

export async function generatePoemWithTone(input: GeneratePoemWithToneInput): Promise<GeneratePoemWithToneOutput> {
  return generatePoemWithToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePoemWithTonePrompt',
  input: {
    schema: z.object({
      imageUrl: z.string().describe('The URL of the image to inspire the poem.'),
      tone: z.string().describe('The desired tone of the poem (e.g., happy, sad, reflective).'),
    }),
  },
  output: {
    schema: z.object({
      poem: z.string().describe('The generated poem based on the image and desired tone.'),
    }),
  },
  prompt: `You are a poet. Generate a poem based on the image provided. The poem should reflect the tone specified by the user.

Image: {{media url=imageUrl contentType="image/*"}}
Tone: {{{tone}}}

Poem:`,
});

const generatePoemWithToneFlow = ai.defineFlow<
  typeof GeneratePoemWithToneInputSchema,
  typeof GeneratePoemWithToneOutputSchema
>({
  name: 'generatePoemWithToneFlow',
  inputSchema: GeneratePoemWithToneInputSchema,
  outputSchema: GeneratePoemWithToneOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
