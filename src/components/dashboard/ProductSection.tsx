import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Treemap } from 'recharts';
import { Package, AlertTriangle, ClipboardCheck, TrendingUp } from 'lucide-react';

const COLORS = ['#f5756c', '#fca39d', '#fedcd9'];

const completenessData = [
  { name: '高完整度', value: 8500 },
  { name: '中完整度', value: 3200 },
  { name: '待完善', value: 880 },
];

const categoryData = [
  { name: '面霜/乳液', size: 4500 },
  { name: '面部精华', size: 3200 },
  { name: '唇部彩妆', size: 2800 },
  { name: '防晒隔离', size: 1500 },
  { name: '面膜清洁', size: 580 },
];

const ProductSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-6 bg-rose-400 rounded-full" />
        <h2 className="text-lg font-bold text-slate-800">商品管理全局概览</h2>
      </div>

      {/* 概览卡片组 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: '在架商品总数', value: '12,580', sub: '较昨日 +12', icon: Package },
          { label: '全店动销率', value: '68%', sub: '行业均值 52%', icon: TrendingUp },
          { label: '今日新增建档', value: '156', sub: '审核中 42', icon: ClipboardCheck },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-rose-50 p-3 rounded-xl">
                <item.icon className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
                <p className="text-xl font-black text-slate-800">{item.value}</p>
                <p className="text-[10px] text-rose-400 font-medium">{item.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 健康度矩阵 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">商品信息完整度分布</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={completenessData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
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
                    <Badge className={cn(
                      "text-[8px] px-1 py-0 border-none",
                      item.level === '重度' ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
                    )}>{item.level}</Badge>
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
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">新品上架审核</span>
                <span className="font-bold text-rose-500">78%</span>
              </div>
              <Progress value={78} className="h-1.5" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">AIGC 素材合规复核</span>
                <span className="font-bold text-rose-500">45%</span>
              </div>
              <Progress value={45} className="h-1.5" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">价格异动人工确认</span>
                <span className="font-bold text-rose-500">92%</span>
              </div>
              <Progress value={92} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 类目分布 & 价格热力图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">类目层级商品分布 (Treemap)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={categoryData}
                dataKey="size"
                stroke="#fff"
                fill="#fca39d"
              >
                <Tooltip />
              </Treemap>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">价格区间竞争力热力分布</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-5 gap-2 h-[200px]">
              {[
                { label: '0-50', val: 20, color: 'bg-rose-50' },
                { label: '50-100', val: 45, color: 'bg-rose-100' },
                { label: '100-200', val: 85, color: 'bg-rose-400' },
                { label: '200-500', val: 60, color: 'bg-rose-200' },
                { label: '500+', val: 15, color: 'bg-rose-50' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className={cn("flex-1 rounded-lg flex items-center justify-center text-white font-bold text-xs", item.color)}>
                    {item.val}%
                  </div>
                  <span className="text-[9px] text-slate-400 text-center">{item.label}</span>
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