'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Skill, SkillCategory } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'skill-tracker-data';

// Helper for date serialization/deserialization
const replacer = (key: string, value: any) => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
};

const reviver = (key: string, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
    return new Date(value);
  }
  return value;
};

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSkills = localStorage.getItem(STORAGE_KEY);
      if (storedSkills) {
        const parsedSkills = JSON.parse(storedSkills, reviver);
        setSkills(parsedSkills);
      }
    } catch (error) {
      console.error('Failed to load skills from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        const skillsToStore = JSON.stringify(skills, replacer);
        localStorage.setItem(STORAGE_KEY, skillsToStore);
      } catch (error) {
        console.error('Failed to save skills to localStorage', error);
      }
    }
  }, [skills, isLoaded]);

  const addSkill = useCallback((newSkillData: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...newSkillData,
      id: uuidv4(),
    };
    setSkills(prevSkills => [...prevSkills, newSkill].sort((a, b) => a.startDate.getTime() - b.startDate.getTime()));
  }, []);

  const updateSkill = useCallback((updatedSkill: Skill) => {
    setSkills(prevSkills =>
      prevSkills.map(skill => (skill.id === updatedSkill.id ? updatedSkill : skill))
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    );
  }, []);

  const removeSkill = useCallback((skillId: string) => {
    setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
  }, []);

  return { skills, addSkill, updateSkill, removeSkill, isLoaded };
};
