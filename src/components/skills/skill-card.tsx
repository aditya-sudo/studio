'use client';

import type { Skill } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { SkillIcon } from '../icons';
import { SkillForm } from './skill-form';
import { useState } from 'react';

interface SkillCardProps {
  skill: Skill;
  onUpdateSkill: (skill: Skill) => void;
  onRemoveSkill: (skillId: string) => void;
}

export function SkillCard({ skill, onUpdateSkill, onRemoveSkill }: SkillCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const durationString = `${format(skill.startDate, 'MMM yyyy')} - ${
    skill.endDate ? format(skill.endDate, 'MMM yyyy') : 'Present'
  }`;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <SkillIcon category={skill.category} className="h-7 w-7 text-muted-foreground" />
                <CardTitle className="font-headline text-xl">{skill.name}</CardTitle>
            </div>
            <Badge variant="secondary">{skill.category}</Badge>
        </div>
        <CardDescription className="flex items-center gap-2 pt-2">
            <CalendarDays className="h-4 w-4" />
            <span>{durationString}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
            <div className='flex justify-between items-center text-sm'>
                <span className="font-medium">Mastery</span>
                <span className="text-primary font-semibold">{skill.mastery}%</span>
            </div>
            <Progress value={skill.mastery} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit Skill</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {skill.name}</DialogTitle>
                </DialogHeader>
                <SkillForm 
                    initialData={skill} 
                    onUpdate={onUpdateSkill}
                    onDone={() => setIsEditDialogOpen(false)}
                />
            </DialogContent>
         </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Skill</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your skill
                "{skill.name}" from your records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onRemoveSkill(skill.id)} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
