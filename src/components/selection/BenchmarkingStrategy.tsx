import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Target, Zap, AlertCircle, Lightbulb, 
  ArrowRight, Check, ListChecks, PenTool, ImageIcon, 
  Video, ShieldAlert, TrendingUp, Info
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface BenchmarkingStrategyProps {
  products: any[];
}

const BenchmarkingStrategy = ({ products }: BenchmarkingStrategyProps) => {
  const bestProduct = products.find(p => p.label === '综合最优') || products[0];

  return (
    <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. 整体总评 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-black text-slate-800">1. AI 竞品对标整体总评</h3>
        </div>
        <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <TrendingUp className="w-48 h-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500 text-white border-none px-3 py-1">最优入局品</Badge>
                <span className="text-lg font-black">{bestProduct.name}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                基于五维算法测算，该单品在<span className="text-emerald-400 font-bold">蓝海竞争分 (92)</span>与<span className="text-emerald-400 font-bold">盈利潜力 (85)</span>上表现卓越。虽然市场热度略逊于头部竞品，但其极低的同款竞争度意味着更低的获客成本，是本季立项的首选目标。
              </p>
            </div>
            <div className="space-y-3 border-l border-white/10 pl-8">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">内卷严重品</span>
                <span className="font-bold text-rose-400">氨基酸洁面乳</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">高风险预警</span>
                <span className="font-bold text-amber-400">水漾防晒喷雾</span>
              </div>
              <div className="pt-2">
                <Badge variant="outline" className="border-white/20 text-slate-400 text-[10px]">选品倾向：差异化切入</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 单品拆解 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-black text-slate-800">2. 对标单品核心拆解</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p, i) => (
            <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
              <div className="h-1.5 w-full bg-slate-100">
                <div className={cn("h-full transition-all duration-1000", i === 0 ? "bg-emerald-500 w-full" : "bg-rose-400 w-2/3")} />
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <img src={p.img} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400">综合分：{p.data.totalScore}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                    <span className="text-[9px] font-black text-emerald-700 uppercase block mb-1">核心优势</span>
                    <p className="text-[10px] text-emerald-600 leading-relaxed">{i === 0 ? "极高毛利空间，同款竞争极少" : "品牌背书强，自带搜索流量"}</p>
                  </div>
                  <div className="p-2 bg-rose-50 rounded-lg border border-rose-100">
                    <span className="text-[9px] font-black text-rose-700 uppercase block mb-1">短板缺陷</span>
                    <p className="text-[10px] text-rose-600 leading-relaxed">{i === 0 ? "物流易碎风险，需强化包装" : "价格战激烈，ROI 提升困难"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 3. 赛道机会 & 4. 落地策略 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 赛道机会 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> 3. 赛道共性短板与缺口
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
              <p className="text-xs font-bold text-amber-800">发现 2 处高需求低竞争缺口：</p>
              <ul className="space-y-2">
                <li className="text-[11px] text-amber-700 flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="font-bold">包装痛点：</span>对标组普遍存在“泵头渗漏”差评，占比达 12%。若采用“真空锁鲜泵”可形成降维打击。
                </li>
                <li className="text-[11px] text-amber-700 flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="font-bold">场景缺失：</span>目前竞品主打“晚间修护”，针对“妆前急救”的轻薄款仍有 35% 的搜索溢出需求未被满足。
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 落地策略 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-400" /> 4. 可落地错位运营策略
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">定价卡位</span>
                <p className="text-[11px] font-bold text-slate-700">避开 ¥199 激战区，切入 ¥250-300 高端空白带</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">渠道适配</span>
                <p className="text-[11px] font-bold text-slate-700">优先小红书深度种草，避开抖音大促内卷</p>
              </div>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 space-y-3">
              <div className="flex items-center gap-2 text-rose-700">
                <PenTool className="w-4 h-4" />
                <span className="text-xs font-bold">AIGC 素材差异化方案</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"><FileText className="w-4 h-4 text-rose-400" /></div>
                  <span className="text-[9px] text-slate-500">反向营销文案</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"><ImageIcon className="w-4 h-4 text-rose-400" /></div>
                  <span className="text-[9px] text-slate-500">真空泵视觉主图</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"><Video className="w-4 h-4 text-rose-400" /></div>
                  <span className="text-[9px] text-slate-500">28天实测短视频</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BenchmarkingStrategy;