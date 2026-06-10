import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar } from 'recharts';
import { PenTool, CheckCircle2, Zap, Coins } from 'lucide-react';
import { cn } from "@/lib/utils";

const radialData = [
  { name: '短视频', value: 500, fill: '#fedcd9' },
  { name: '详情页', value: 1500, fill: '#fca39d' },
  { name: '商品标题', value: 1280, fill: '#f5756c' },
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

      {/* 生产效能 */}
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

      {/* 内容分布 & 效果对比 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">内容类型生产分布</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[240px] flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={15} data={radialData}>
                <RadialBar background dataKey="value" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 w-full text-center mt-2">
              <div><p className="text-[10px] font-bold text-rose-500">1,280</p><p className="text-[8px] text-slate-400">标题</p></div>
              <div><p className="text-[10px] font-bold text-rose-400">1,500</p><p className="text-[8px] text-slate-400">详情页</p></div>
              <div><p className="text-[10px] font-bold text-rose-200">500</p><p className="text-[8px] text-slate-400">短视频</p></div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">AI 内容 vs 人工内容 效果对比 (%)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="AI内容" fill="#f5756c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="人工内容" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 流程转化漏斗 */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-2 border-b border-slate-50">
          <CardTitle className="text-xs font-bold text-slate-500">内容生产全链路转化漏斗</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-1">
            {[
              { label: '内容生成', val: '100%', width: 'w-full', color: 'bg-rose-400' },
              { label: '智能采纳', val: '76%', width: 'w-[76%]', color: 'bg-rose-300' },
              { label: '合规审核', val: '72%', width: 'w-[72%]', color: 'bg-rose-200' },
              { label: '一键上架', val: '68%', width: 'w-[68%]', color: 'bg-rose-100' },
            ].map((step, i) => (
              <div key={i} className={cn("h-10 flex items-center justify-between px-6 text-white font-bold text-xs rounded-lg shadow-sm", step.width, step.color)}>
                <span>{step.label}</span>
                <span>{step.val}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AigcSection;