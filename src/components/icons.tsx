import { Code2, Wrench, Cpu, Library, BrainCircuit, type LucideProps } from 'lucide-react';
import type { SkillCategory } from '@/lib/types';

interface SkillIconProps extends LucideProps {
  category: SkillCategory;
}

export const SkillIcon = ({ category, ...props }: SkillIconProps) => {
  switch (category) {
    case 'Framework':
      return <Code2 {...props} />;
    case 'Tool':
      return <Wrench {...props} />;
    case 'Technology':
      return <Cpu {...props} />;
    case 'Library':
      return <Library {...props} />;
    case 'Concept':
      return <BrainCircuit {...props} />;
    default:
      return null;
  }
};
