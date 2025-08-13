// src/ai/flows/suggest-related-concepts.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest related concepts and technologies
 * based on a user's existing skill set.
 *
 * - suggestRelatedConcepts - A function that takes a list of skills and suggests related concepts.
 * - SuggestRelatedConceptsInput - The input type for the suggestRelatedConcepts function.
 * - SuggestRelatedConceptsOutput - The output type for the suggestRelatedConcepts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedConceptsInputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('A list of skills, technologies, and concepts the user already knows.'),
});
export type SuggestRelatedConceptsInput = z.infer<typeof SuggestRelatedConceptsInputSchema>;

const SuggestRelatedConceptsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of related skills, technologies, and concepts the user could learn.'),
});
export type SuggestRelatedConceptsOutput = z.infer<typeof SuggestRelatedConceptsOutputSchema>;

export async function suggestRelatedConcepts(input: SuggestRelatedConceptsInput): Promise<SuggestRelatedConceptsOutput> {
  return suggestRelatedConceptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedConceptsPrompt',
  input: {schema: SuggestRelatedConceptsInputSchema},
  output: {schema: SuggestRelatedConceptsOutputSchema},
  prompt: `You are a learning path recommender. Given a list of skills and technologies, you will suggest related skills and technologies that the user could learn next.

Skills:
{{#each skills}}- {{this}}\n{{/each}}

Suggestions:`,
});

const suggestRelatedConceptsFlow = ai.defineFlow(
  {
    name: 'suggestRelatedConceptsFlow',
    inputSchema: SuggestRelatedConceptsInputSchema,
    outputSchema: SuggestRelatedConceptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
