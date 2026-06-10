import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface BenchmarkingRadarProps {
  data: any[];
}

const BenchmarkingRadar = ({ data }: BenchmarkingRadarProps) => {
  // 转换数据格式适配 Recharts
  const radarData = [
    { subject: '市场热度', fullMark: 100 },
    { subject: '蓝海竞争', fullMark: 100 },
    { subject: '盈利潜力', fullMark: 100 },
    { subject: '口碑舆情', fullMark: 100 },
    { subject: '风险安全', fullMark: 100 },
  ].map(item => {
    const newItem: any = { ...item };
    data.forEach(p => {
      newItem[p.name] = p.scores[item.subject];
    });
    return newItem;
  });

  const COLORS = ['#f5756c', '#6366f1', '#10b981', '#f59e0b'];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          {data.map((p, i) => (
            <Radar
              key={p.id}
              name={p.name}
              dataKey={p.name}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.3}
            />
          ))}
          <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BenchmarkingRadar;