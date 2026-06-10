import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Package, AlertTriangle, ClipboardCheck, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";

const COLORS = ['#f5756c', '#fca39d', '#fedcd9'];

const completenessData = [
  { name: '高完整度', value: 8500 },
  { name: '中完整度', value: 3200 },
  { name: '待完善', value: 880 },
];

const categoryListData = [
  { name: '面霜/乳液', count: 4500, pct: 35, trend: '+12%' },
  { name: '面部精华', count: 3200, pct: 25, trend: '+8%' },
  { name: '唇部彩妆', count: 2800, pct: 22, trend: '+15%' },
  { name: '防晒隔离', count: 1500, pct: 12, trend: '+22%' },
  { name: '面膜清洁', count: 580, pct: 6, trend: '-2%' },
];

const ProductSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-6 bg-rose-400 rounded-full" />
        <h2 className="text-lg font-bold text-slate-800">商品管理全局概览</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: '在架商品总数', value: '12,580', sub: '较昨日 +12', icon: Package },
          { label: '全店动销率', value: '68%', sub: '行业均值 52%', icon: TrendingUp },
          { label: '今日新增建档', value: '156', sub: '审核中 42', icon: ClipboardCheck },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-rose-50 p-3 rounded-xl"><item.icon className="w-5 h-5 text-rose-500" /></div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
                <p className="text-xl font-black text-slate-800">{item.value}</p>
                <p className="text-[10px] text-rose-400 font-medium">{item.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">商品信息完整度分布</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={completenessData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={45} 
                  outerRadius={65} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {completenessData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3 text-[9px] text-slate-400 mt-2">
              <span>● 高 (85%)</span><span>● 中 (10%)</span><span>● 低 (5%)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> 违规预警 TOP 5
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {[
                { name: '极限词拦截', count: 42, level: '重度' },
                { name: '价格虚标风险', count: 28, level: '中度' },
                { name: '图片侵权疑似', count: 15, level: '轻度' },
                { name: '类目挂载错误', count: 12, level: '轻度' },
                { name: '主图缺失', count: 8, level: '轻度' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-600 font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{item.count}</span>
                    <Badge className={cn("text-[8px] px-1 py-0 border-none", item.level === '重度' ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500")}>{item.level}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">审核队列进度</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {[{ label: '新品上架审核', val: 78 }, { label: 'AIGC 素材合规复核', val: 45 }, { label: '价格异动人工确认', val: 92 }].map(q => (
              <div key={q.label} className="space-y-2">
                <div className="flex justify-between text-[10px]"><span className="text-slate-500">{q.label}</span><span className="font-bold text-rose-500">{q.val}%</span></div>
                <Progress value={q.val} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">类目层级商品分布明细</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {categoryListData.map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.count} 件</span>
                    </div>
                    <span className="text-[10px] text-green-600 font-bold">{item.trend}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">价格区间竞争力热力分布</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-5 gap-2 h-[200px]">
              {[
                { label: '0-50', val: 20, color: 'bg-rose-50 text-rose-700' },
                { label: '50-100', val: 45, color: 'bg-rose-100 text-rose-800' },
                { label: '100-200', val: 85, color: 'bg-rose-400 text-white' },
                { label: '200-500', val: 60, color: 'bg-rose-200 text-rose-900' },
                { label: '500+', val: 15, color: 'bg-rose-50 text-rose-700' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className={cn("flex-1 rounded-lg flex items-center justify-center font-black text-sm shadow-sm", item.color)}>
                    {item.val}%
                  </div>
                  <span className="text-[9px] text-slate-400 text-center font-bold">{item.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-4 text-center">※ 颜色越深代表该价格段商品集中度越高，竞争越激烈</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductSection;