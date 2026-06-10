import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, Download, TrendingUp, AlertTriangle, 
  Coins, Target, Microscope, ShieldCheck, Info
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface AiAnalysisReportProps {
  product: any;
}

const AiAnalysisReport = ({ product }: AiAnalysisReportProps) => {
  if (!product) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <Target className="w-8 h-8" />
        </div>
        <p className="text-sm font-bold">请从左侧榜单选中单品查看 AI 研判报告</p>
      </div>
    );
  }

  const getRatingColor = (rating: string) => {
    if (rating === '高') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (rating === '中') return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* 头部概览 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-black text-slate-800">AI 深度研判报告</h3>
          </div>
          <Button size="sm" variant="outline" className="h-8 text-[10px] border-rose-200 text-rose-600" onClick={() => showSuccess("报告导出成功")}>
            <Download className="w-3.5 h-3.5 mr-1.5" /> 导出报告
          </Button>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3 shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase">新品立项可行性评级</span>
            <Badge className={cn("border-none font-black px-3 py-0.5", getRatingColor(product.aiReport.feasibility))}>
              {product.aiReport.feasibility}可行性
            </Badge>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">市场匹配度</span>
              <span className="font-bold text-rose-400">88%</span>
            </div>
            <Progress value={88} className="h-1.5 bg-white/10" />
          </div>
        </div>
      </div>

      {/* 核心研判维度 */}
      <div className="flex-1 space-y-5 overflow-y-auto pr-2">
        {/* 定价与竞争 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Coins className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase">建议定价区间</span>
            </div>
            <p className="text-lg font-black text-slate-800">{product.aiReport.suggestedPrice}</p>
            <p className="text-[9px] text-slate-400">基于竞品均价与毛利测算</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Target className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase">市场竞争度</span>
            </div>
            <p className="text-lg font-black text-slate-800">{product.aiReport.competition}</p>
            <p className="text-[9px] text-slate-400">当前赛道同质化程度</p>
          </div>
        </div>

        {/* 成分趋势 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-[11px] font-bold flex items-center gap-2 text-indigo-600">
              <Microscope className="w-3.5 h-3.5" /> 主流成分趋势分析
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {product.aiReport.ingredientTrends}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.ingredients.map((ing: string) => (
                <Badge key={ing} variant="secondary" className="bg-indigo-50 text-indigo-700 border-none text-[9px]">
                  {ing}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 风险提示 */}
        <Card className="border-none shadow-sm bg-rose-50/50 border border-rose-100">
          <CardHeader className="pb-2 border-b border-rose-100/50">
            <CardTitle className="text-[11px] font-bold flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-3.5 h-3.5" /> 核心风险提示
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {product.aiReport.risks.map((risk: string, i: number) => (
                <li key={i} className="text-[11px] text-rose-700 flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  {risk}
                </li>
              ))}
            </ul>
          </CardContent>
        </div>

        {/* 运营建议 */}
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase">AI 运营建议</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            建议优先在{product.platform}进行短视频测款，利用“{product.ingredients[0]}”作为核心视觉钩子，避开头部品牌的价格战区间。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiAnalysisReport;