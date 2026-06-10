import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LabelList } from 'recharts';
import { PenTool, CheckCircle2, Zap, Coins } from 'lucide-react';
import { cn } from "@/lib/utils";

const pieData = [
  { name: '商品标题', value: 1280, color: '#f5756c' },
  { name: '详情页', value: 1500, color: '#fca39d' },
  { name: '短视频', value: 500, color: '#fedcd9' },
];

const compareData = [
  { name: '点击率 (CTR)', AI内容: 4.2, 人工内容: 3.1 },
  { name: '转化率 (CVR)', AI内容: 2.8, 人工内容: 1.9 },
  { name: '加购率', AI内容: 8.5, 人工内容: 6.2 },
];

const AigcSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-6 bg-indigo-400 rounded-full" />
        <h2 className="text-lg font-bold text-slate-800">AIGC 内容生产效能</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '今日生成总量', value: '3,280 条', icon: PenTool, color: 'text-indigo-500' },
          { label: '生成成功率', value: '99.2%', icon: CheckCircle2, color: 'text-emerald-500' },
          { label: '内容采纳率', value: '76%', icon: Zap, color: 'text-amber-500' },
          { label: '月度成本节省', value: '¥12,500', icon: Coins, color: 'text-rose-500' },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-5 text-left">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
                <item.icon className={cn("w-4 h-4", item.color)} />
              </div>
              <p className="text-xl font-black text-slate-800">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">内容类型生产分布</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[240px] flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 w-full mt-2">
              {pieData.map(item => (
                <div key={item.name} className="text-center">
                  <p className="text-[10px] font-bold text-slate-700">{item.value}</p>
                  <p className="text-[8px] text-slate-400">{item.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">AI 内容 vs 人工内容 效果对比 (%)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="AI内容" fill="#f5756c" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="AI内容" position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#f5756c' }} />
                </Bar>
                <Bar dataKey="人工内容" fill="#94a3b8" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="人工内容" position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#94a3b8' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-2 border-b border-slate-50">
          <CardTitle className="text-xs font-bold text-slate-500">内容生产全链路转化漏斗</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-1">
            {[{ label: '内容生成', val: '100%', width: 'w-full', color: 'bg-rose-400' }, { label: '智能采纳', val: '76%', width: 'w-[76%]', color: 'bg-rose-300' }, { label: '合规审核', val: '72%', width: 'w-[72%]', color: 'bg-rose-200' }, { label: '一键上架', val: '68%', width: 'w-[68%]', color: 'bg-rose-100' }].map((step, i) => (
              <div key={i} className={cn("h-10 flex items-center justify-between px-6 text-white font-bold text-xs rounded-lg shadow-sm", step.width, step.color)}>
                <span>{step.label}</span><span>{step.val}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AigcSection;