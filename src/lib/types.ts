export const SKILL_CATEGORIES = ['Framework', 'Tool', 'Technology', 'Library', 'Concept'] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  startDate: Date;
  endDate: Date | null;
  mastery: number; // 0-100
};
