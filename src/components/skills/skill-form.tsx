'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, PlusCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { autoCategorizeSkill } from '@/ai/flows/auto-categorize-skill';
import { Skill, SkillCategory, SKILL_CATEGORIES } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(1, 'Skill name is required.'),
  category: z.enum(SKILL_CATEGORIES),
  startDate: z.date({ required_error: 'A start date is required.' }),
  endDate: z.date().nullable(),
  mastery: z.number().min(0).max(100),
}).refine(data => !data.endDate || data.endDate >= data.startDate, {
  message: 'End date cannot be earlier than start date.',
  path: ['endDate'],
});

type SkillFormValues = z.infer<typeof formSchema>;

interface SkillFormProps {
  onAddSkill: (skill: Omit<Skill, 'id'>) => void;
  initialData?: Skill;
  onUpdate?: (skill: Skill) => void;
  onDone?: () => void;
}

export function SkillForm({ onAddSkill, initialData, onUpdate, onDone }: SkillFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isCategorizing, setIsCategorizing] = useState(false);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      mastery: initialData.mastery || 75
    } : {
      name: '',
      mastery: 75,
      startDate: new Date(),
      endDate: null,
    },
  });

  const handleAutoCategorize = useCallback(async (skillName: string) => {
    if (skillName.length < 2) return;
    setIsCategorizing(true);
    try {
      const result = await autoCategorizeSkill({ skillName });
      if (result.category) {
        form.setValue('category', result.category, { shouldValidate: true });
      }
    } catch (error) {
      console.error('AI categorization failed:', error);
      toast({
        variant: "destructive",
        title: "AI Categorization Failed",
        description: "Could not automatically categorize skill. Please select a category manually."
      });
    } finally {
      setIsCategorizing(false);
    }
  }, [form, toast]);

  const onSubmit = (data: SkillFormValues) => {
    startTransition(() => {
      if(initialData && onUpdate) {
        onUpdate({ ...initialData, ...data });
        toast({ title: "Skill Updated!", description: `${data.name} has been updated in your list.` });
        onDone?.();
      } else {
        onAddSkill(data);
        toast({ title: "Skill Added!", description: `${data.name} has been added to your journey.` });
        form.reset({
          name: '',
          mastery: 75,
          startDate: new Date(),
          endDate: null,
        });
        form.clearErrors();
      }
    });
  };

  const title = initialData ? 'Edit Skill' : 'Add a New Skill';
  const description = initialData ? 'Update the details of your skill.' : 'Log a new skill, tool, or concept you\'re learning.';
  const buttonText = initialData ? 'Save Changes' : 'Add Skill';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., React, Docker, UI/UX Design" {...field}
                        onBlur={() => handleAutoCategorize(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <div className="flex items-center gap-2">
                       <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SKILL_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isCategorizing && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1990-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                            {field.value ? format(field.value, 'PPP') : <span>In progress</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                           disabled={(date) => date < form.getValues('startDate') || date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="mastery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mastery Level: {field.value}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending || isCategorizing}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {buttonText}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
