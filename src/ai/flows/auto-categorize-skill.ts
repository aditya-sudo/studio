'use server';

/**
 * @fileOverview A skill auto-categorization AI agent.
 *
 * - autoCategorizeSkill - A function that handles the skill categorization process.
 * - AutoCategorizeSkillInput - The input type for the autoCategorizeSkill function.
 * - AutoCategorizeSkillOutput - The return type for the autoCategorizeSkill function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoCategorizeSkillInputSchema = z.object({
  skillName: z.string().describe('The name of the skill to categorize.'),
});
export type AutoCategorizeSkillInput = z.infer<typeof AutoCategorizeSkillInputSchema>;

const AutoCategorizeSkillOutputSchema = z.object({
  category: z
    .enum(['Framework', 'Tool', 'Technology', 'Library', 'Concept'])
    .describe('The category of the skill.'),
});
export type AutoCategorizeSkillOutput = z.infer<typeof AutoCategorizeSkillOutputSchema>;

export async function autoCategorizeSkill(input: AutoCategorizeSkillInput): Promise<AutoCategorizeSkillOutput> {
  return autoCategorizeSkillFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoCategorizeSkillPrompt',
  input: {schema: AutoCategorizeSkillInputSchema},
  output: {schema: AutoCategorizeSkillOutputSchema},
  prompt: `You are an expert in software development and technology. Your task is to categorize the given skill into one of the following categories: Framework, Tool, Technology, Library, or Concept.

Skill Name: {{{skillName}}}
Category:`,
});

const autoCategorizeSkillFlow = ai.defineFlow(
  {
    name: 'autoCategorizeSkillFlow',
    inputSchema: AutoCategorizeSkillInputSchema,
    outputSchema: AutoCategorizeSkillOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
