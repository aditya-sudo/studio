'use client';

import { useSkills } from '@/hooks/use-skills';
import { SkillForm } from '@/components/skills/skill-form';
import { SkillList } from '@/components/skills/skill-list';
import { AnalysisChart } from '@/components/skills/analysis-chart';
import { SuggestionsPanel } from '@/components/skills/suggestions-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpenCheck } from 'lucide-react';

export function SkillTracker() {
  const { skills, addSkill, updateSkill, removeSkill, isLoaded } = useSkills();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center gap-3">
          <BookOpenCheck className="h-10 w-10 text-primary" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            Skill Tracker
          </h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          Your personal journey in the vast world of technology.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SkillForm onAddSkill={addSkill} />
          <SkillList skills={skills} onUpdateSkill={updateSkill} onRemoveSkill={removeSkill} isLoaded={isLoaded} />
        </div>
        
        <aside className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Learning Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoaded ? (
                <AnalysisChart skills={skills} />
              ) : (
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoaded ? (
                <SuggestionsPanel skills={skills} />
              ) : (
                 <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                 </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
