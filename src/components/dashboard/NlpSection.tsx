import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MessageSquare, Star, AlertCircle, TrendingDown } from 'lucide-react';
import { cn } from "@/lib/utils";

const sentimentData = [
  { name: '正向', value: 89, color: '#10b981' },
  { name: '中性', value: 8, color: '#94a3b8' },
  { name: '负向', value: 3, color: '#f43f5e' },
];

const trendData = Array.from({ length: 30 }).map((_, i) => ({
  day: i + 1,
  score: 85 + Math.random() * 10,
}));

const NlpSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-6 bg-emerald-400 rounded-full" />
        <h2 className="text-lg font-bold text-slate-800">评价 NLP 深度洞察</h2>
      </div>

      {/* 情感总览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '综合满意度', value: '4.6 星', icon: Star, color: 'text-amber-400' },
          { label: '正向评价比例', value: '89%', icon: MessageSquare, color: 'text-emerald-500' },
          { label: '今日新增评价', value: '2,156 条', icon: TrendingDown, color: 'text-slate-400' },
          { label: '负面激增预警', value: '3 款', icon: AlertCircle, color: 'text-rose-500' },
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

      {/* 情感分布 & 话题挖掘 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">情感分布比例</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[200px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {sentimentData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 min-w-[100px]">
              {sentimentData.map(s => (
                <div key={s.name} className="flex justify-between text-[10px]">
                  <span className="text-slate-400">{s.name}</span>
                  <span className="font-bold" style={{ color: s.color }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">高频话题词云 (情感色标)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 justify-center items-center min-h-[150px]">
              {[
                { text: '吸收快', color: 'text-emerald-500 font-bold' },
                { text: '包装精美', color: 'text-emerald-400' },
                { text: '过敏红肿', color: 'text-rose-500 font-black' },
                { text: '物流给力', color: 'text-emerald-500' },
                { text: '泵头难按', color: 'text-rose-400 font-bold' },
                { text: '味道淡', color: 'text-slate-400' },
                { text: '正品保障', color: 'text-emerald-600 font-bold' },
              ].map((w, i) => (
                <span key={i} className={cn("text-xs", w.color)}>{w.text}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 问题诊断矩阵 */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-2 border-b border-slate-50">
          <CardTitle className="text-xs font-bold text-slate-500">负面问题诊断矩阵</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: '质量问题', val: 32, desc: '主要集中在“过敏”与“质地太油”', color: 'bg-rose-400' },
              { label: '物流问题', val: 28, desc: '主要集中在“顺丰未送货上门”', color: 'bg-rose-300' },
              { label: '服务问题', val: 22, desc: '主要集中在“机器人回复太慢”', color: 'bg-rose-200' },
              { label: '价格问题', val: 18, desc: '主要集中在“直播间价格歧视”', color: 'bg-rose-100' },
            ].map((item, i) => (
              <div key={i} className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 text-xs">{item.label} ({item.val}%)</span>
                  <span className="text-[10px] text-rose-500 font-bold">查看详情 ↘</span>
                </div>
                <Progress value={item.val} className="h-1.5" />
                <p className="text-[10px] text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 趋势曲线 & 预警列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500">近 30 天情感满意度趋势</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-rose-600">风险预警商品</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {[
                  { name: '御龄紧致面霜', risk: '过敏激增', status: '处理中' },
                  { name: '水光唇蜜 01#', risk: '色差争议', status: '待介入' },
                  { name: '多肽精华液', risk: '包装破损', status: '已解决' },
                ].map((item, i) => (
                  <TableRow key={i} className="text-[10px]">
                    <TableCell className="font-bold">{item.name}</TableCell>
                    <TableCell className="text-rose-500">{item.risk}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-[8px] px-1 py-0">{item.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NlpSection;