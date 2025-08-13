'use client'

import type { Skill } from '@/lib/types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { differenceInDays, format, startOfMonth, addMonths, subMonths } from 'date-fns'

interface AnalysisChartProps {
  skills: Skill[]
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function AnalysisChart({ skills }: AnalysisChartProps) {
  if (skills.length === 0) {
    return <div className="text-center text-muted-foreground py-10">Add some skills to see your learning timeline.</div>
  }

  const sortedSkills = [...skills].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  
  const earliestDate = sortedSkills[0].startDate
  const chartStartDate = startOfMonth(subMonths(earliestDate, 1))

  const data = sortedSkills.map((skill, index) => {
    const startOffset = differenceInDays(skill.startDate, chartStartDate)
    const duration = differenceInDays(skill.endDate || new Date(), skill.startDate)
    return {
      name: skill.name,
      time: [startOffset, duration > 0 ? duration : 1],
      fill: COLORS[index % COLORS.length]
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const originalSkill = skills.find(s => s.name === label)
      if (!originalSkill) return null

      const startDate = format(originalSkill.startDate, 'MMM d, yyyy')
      const endDate = originalSkill.endDate ? format(originalSkill.endDate, 'MMM d, yyyy') : 'Present'

      return (
        <div className="p-2 bg-card border rounded-md shadow-lg text-card-foreground">
          <p className="font-bold">{label}</p>
          <p className="text-sm text-muted-foreground">{`${startDate} - ${endDate}`}</p>
          <p className="text-sm">{`Duration: ${data.time[1]} days`}</p>
        </div>
      )
    }
    return null
  }
  
  const latestDate = skills.reduce((max, s) => {
    const d = s.endDate || new Date();
    return d > max ? d : max
  }, new Date(0));
  const chartEndDate = addMonths(latestDate, 1);

  const totalDays = differenceInDays(chartEndDate, chartStartDate);
  const monthTicks = [];
  let currentDate = chartStartDate;
  while(currentDate <= chartEndDate) {
    monthTicks.push({
        tick: differenceInDays(currentDate, chartStartDate),
        label: format(currentDate, 'MMM yy')
    });
    currentDate = addMonths(currentDate, 1);
  }

  return (
    <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis 
                    type="number" 
                    domain={[0, totalDays]}
                    ticks={monthTicks.map(t => t.tick)}
                    tickFormatter={tick => monthTicks.find(t=> t.tick === tick)?.label || ''}
                />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.2)' }} />
                <Legend />
                <Bar dataKey="time" name="Learning Duration" stackId="a">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}
