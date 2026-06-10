"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Activity, TrendingDown, AlertCircle, Wand2, 
  BarChart3, FileText, ImageIcon, Sparkles
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface DiagnosisReportProps {
  product: any;
}

const MOCK_CHART_DATA = [
  { name: '周一', traffic: 400, cvr: 2.1 },
  { name: '周二', traffic: 300, cvr: 1.8 },
  { name: '周三', traffic: 500, cvr: 2.5 },
  { name: '周四', traffic: 200, cvr: 0.8 },
  { name: '周五', traffic: 150, cvr: 0.5 },
  { name: '周六', traffic: 100, cvr: 0.3 },
  { name: '周日', traffic: 80, cvr: 0.2 },
];

const DiagnosisReport = ({ product }: DiagnosisReportProps) => {
  if (!product) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <Activity className="w-8 h-8" />
        </div>
        <p className="text-sm font-bold">请从左侧列表选择商品查看 AI 诊断报告</p>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    if (status === '健康') return 'bg-emerald-100 text-emerald-700';
    if (status === '风险') return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
      {/* 头部信息 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-black text-slate-800">AI 诊断分析报告</h3>
          </div>
          <Badge className={cn("border-none font-bold px-2.5 py-0.5", getStatusBadgeColor(product.status))}>
            {product.status}状态
          </Badge>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2.5 shadow-xl">
          <span className="text-[10px] text-slate-400 font-bold block">正在诊断商品</span>
          <span className="text-xs font-black block truncate">{product.name}</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[9px] border-white/20 text-slate-300">ID: {product.id}</Badge>
            <Badge variant="outline" className="text-[9px] border-white/20 text-slate-300">预估利润: {product.profitMargin}</Badge>
          </div>
        </div>
      </div>

      {/* 核心诊断维度 */}
      <div className="flex-1 space-y-5 overflow-y-auto pr-2">
        {/* 流量与转化趋势 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-rose-400" />
              7日流量与转化率趋势
            </span>
            {product.trend === 'down' && (
              <span className="text-[9px] text-rose-500 font-bold flex items-center">
                ↓ 转化呈持续下滑趋势
              </span>
            )}
          </div>
          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="traffic" stroke="#f5756c" fill="#f5756c" fillOpacity={0.1} />
                <Area type="monotone" dataKey="cvr" stroke="#fca39d" fill="#fca39d" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI 深度诊断 */}
        <div className="space-y-3">
          <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            AI 深度滞销诊断归因
          </span>
          <div className="space-y-2">
            {[
              { label: '流量匹配度', val: product.status === '健康' ? '良好' : '较差', desc: '主图点击率低于均值，需优化素材场景。', color: 'text-amber-700 bg-amber-50 border-amber-100' },
              { label: '价格竞争力', val: '偏高', desc: '相比同类目竞品溢价约15%，影响了核心转化。', color: 'text-rose-700 bg-rose-50 border-rose-100' }
            ].map((diag, i) => (
              <div key={i} className={cn("p-3 rounded-xl border text-[11px] space-y-1", diag.color)}>
                <div className="flex justify-between font-bold">
                  <span>{diag.label}</span>
                  <span>{diag.val}</span>
                </div>
                <p className="opacity-95 leading-relaxed">{diag.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 智能优化建议 */}
        <div className="space-y-3">
          <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-rose-400" />
            错位优化与智能建议
          </span>
          <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-rose-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-700">营销文案智能重构</p>
                <p className="text-[10px] text-slate-400">结合好评重构核心主打卖点。</p>
              </div>
              <Button size="sm" className="ml-auto h-7 text-[9px] bg-rose-400 hover:bg-rose-500 text-white" onClick={() => showSuccess("文案重写任务已发送至内容工厂")}>重构</Button>
            </div>
            <div className="flex items-start gap-3 pt-2 border-t border-slate-50">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4 text-amber-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-700">主图背景场景微调</p>
                <p className="text-[10px] text-slate-400">切换为极简轻奢冷淡风以符合受众偏好。</p>
              </div>
              <Button size="sm" className="ml-auto h-7 text-[9px] bg-rose-400 hover:bg-rose-500 text-white" onClick={() => showSuccess("海报微调设计已生成")}>设计</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisReport;