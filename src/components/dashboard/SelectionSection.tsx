import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";

const trendData = [
  { name: '5/14', heat: 400 }, { name: '5/15', heat: 300 }, { name: '5/16', heat: 600 },
  { name: '5/17', heat: 800 }, { name: '5/18', heat: 500 }, { name: '5/19', heat: 900 }, { name: '5/20', heat: 1200 },
];

const SelectionSection = () => {
  // 词云数据
  const keywords = [
    { text: '早C晚A', count: 12450, color: 'text-rose-500' },
    { text: '跨境', count: 15000, color: 'text-blue-500' },
    { text: '供应链', count: 11000, color: 'text-rose-600' },
    { text: '物流', count: 9800, color: 'text-emerald-500' },
    { text: '营销', count: 8900, color: 'text-slate-400' },
    { text: '敏感肌修护', count: 8900, color: 'text-amber-500' },
    { text: '多肽抗老', count: 5600, color: 'text-slate-400' },
    { text: '防晒喷雾', count: 7200, color: 'text-rose-400' },
    { text: '直播', count: 9500, color: 'text-rose-500' },
    { text: 'SaaS', count: 6800, color: 'text-slate-300' },
    { text: '水光感', count: 4300, color: 'text-slate-400' },
    { text: '国潮美妆', count: 3100, color: 'text-slate-300' },
    { text: '社交', count: 7500, color: 'text-blue-400' },
    { text: '广告', count: 8200, color: 'text-amber-600' },
  ];

  // 根据数量获取字号
  const getFontSize = (count: number) => {
    if (count > 12000) return "text-3xl font-black";
    if (count > 9000) return "text-2xl font-bold";
    if (count > 7000) return "text-lg font-semibold";
    if (count > 5000) return "text-sm font-medium";
    return "text-xs font-normal";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-6 bg-amber-400 rounded-full" />
        <h2 className="text-lg font-bold text-slate-800">AI 选品效能中心</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: '推荐命中率', value: '85%', desc: 'AI推荐后产生销量的比例' },
          { label: '选品成功率', value: '72%', desc: '进入选池后成功上架比例' },
          { label: '爆款预测准确率', value: '68%', desc: '预测增速与实际误差 < 15%' },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-5 text-left">
              <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
              <p className="text-2xl font-black text-amber-500">{item.value}</p>
              <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI 智能推荐商品池 (实时更新)
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-amber-600">查看全部推荐</Button>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { name: '多肽紧致眼霜', score: 92, trend: '+45%', gap: '大', img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100' },
              { name: '玻尿酸补水喷雾', score: 88, trend: '+32%', gap: '中', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100' },
              { name: '氨基酸洁面乳', score: 85, trend: '+28%', gap: '小', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100' },
              { name: '烟酰胺美白精华', score: 82, trend: '+15%', gap: '大', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100' },
            ].map((item, i) => (
              <div key={i} className="min-w-[240px] p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <div className="flex gap-3">
                  <img src={item.img} className="w-12 h-12 rounded-lg object-cover" alt="" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 truncate w-32">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-amber-100 text-amber-700 border-none text-[9px]">推荐度 {item.score}</Badge>
                      <span className="text-[10px] text-green-600 font-bold">{item.trend}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">供需缺口：<span className="text-rose-500 font-bold">{item.gap}</span></span>
                  <div className="flex gap-1">
                    <Button size="sm" className="h-6 text-[9px] bg-amber-500 hover:bg-amber-600 text-white">一键上架</Button>
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0"><Plus className="w-3 h-3" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">全网美妆热度趋势预测</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="heat" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">搜索关键词热度分布 (出现次数)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center items-center min-h-[180px] relative">
              {keywords.map((w, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "transition-all hover:scale-110 cursor-default select-none flex items-baseline gap-1",
                    getFontSize(w.count),
                    w.color
                  )}
                  style={{ 
                    margin: `${Math.floor(Math.random() * 5) + 2}px`,
                    opacity: w.count < 5000 ? 0.6 : 1
                  }}
                >
                  <span>{w.text}</span>
                  <span className="text-[10px] font-mono opacity-60">({w.count.toLocaleString()})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelectionSection;