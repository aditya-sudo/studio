'use client';

import type { Skill } from '@/lib/types';
import { SkillCard } from './skill-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SkillIcon } from '../icons';
import { Skeleton } from '../ui/skeleton';

interface SkillListProps {
  skills: Skill[];
  onUpdateSkill: (skill: Skill) => void;
  onRemoveSkill: (skillId: string) => void;
  isLoaded: boolean;
}

export function SkillList({ skills, onUpdateSkill, onRemoveSkill, isLoaded }: SkillListProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    const { category } = skill;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const defaultActiveItems = Object.keys(groupedSkills);

  if (!isLoaded) {
    return (
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">My Skillset</CardTitle>
          <CardDescription>A categorized view of your technical arsenal.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Skillset</CardTitle>
        <CardDescription>A categorized view of your technical arsenal.</CardDescription>
      </CardHeader>
      <CardContent>
        {skills.length > 0 ? (
          <Accordion type="multiple" defaultValue={defaultActiveItems} className="w-full">
            {Object.entries(groupedSkills).map(([category, skillsInCategory]) => (
              <AccordionItem value={category} key={category}>
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  <div className="flex items-center gap-3">
                    <SkillIcon category={category as any} className="h-6 w-6 text-primary" />
                    <span>{category} ({skillsInCategory.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
                    {skillsInCategory.map(skill => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        onUpdateSkill={onUpdateSkill}
                        onRemoveSkill={onRemoveSkill}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold text-muted-foreground">No skills added yet.</h3>
            <p className="mt-1 text-sm text-muted-foreground">Use the form above to start building your skillset.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
