'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import type { Skill } from '@/lib/types';
import { suggestRelatedConcepts } from '@/ai/flows/suggest-related-concepts';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

interface SuggestionsPanelProps {
  skills: Skill[];
}

export function SuggestionsPanel({ skills }: SuggestionsPanelProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleGetSuggestions = () => {
    if (skills.length === 0) {
        toast({
            variant: "default",
            title: "Add Skills First",
            description: "Please add some skills before asking for suggestions."
        })
        return;
    }
    
    startTransition(async () => {
      try {
        const result = await suggestRelatedConcepts({ skills: skills.map(s => s.name) });
        setSuggestions(result.suggestions);
        toast({
            title: "Suggestions Ready!",
            description: "Here are some ideas for what to learn next."
        })
      } catch (error) {
        console.error('AI suggestion failed:', error);
        toast({
          variant: 'destructive',
          title: 'Suggestion Failed',
          description: 'Could not get AI-powered suggestions at this time.',
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Based on your current skills, here are some AI-powered suggestions for what you could learn next.
      </p>
      
      <Button onClick={handleGetSuggestions} disabled={isPending} className="w-full">
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Suggest New Skills
      </Button>

      {suggestions.length > 0 && (
        <div className="pt-4">
            <h4 className="font-semibold mb-2">Recommended for you:</h4>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <Badge key={index} variant="outline" className="text-base px-3 py-1 bg-accent/20 border-accent">
                        {suggestion}
                    </Badge>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
