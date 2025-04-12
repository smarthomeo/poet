'use server';
/**
 * @fileOverview A poem generator AI agent that allows the user to select the tone of the poem.
 *
 * - generatePoemWithTone - A function that handles the poem generation process with tone adjustment.
 * - GeneratePoemWithToneInput - The input type for the generatePoemWithTone function.
 * - GeneratePoemWithToneOutput - The return type for the GeneratePoemWithTone function.
 */

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
  return {poem: 'Poem generation with tone is disabled.'};
}
