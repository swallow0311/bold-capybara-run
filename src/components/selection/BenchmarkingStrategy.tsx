import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, Zap, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface BenchmarkingStrategyProps {
  products: any[];
}

const BenchmarkingStrategy = ({ products }: BenchmarkingStrategyProps) => {
  const bestProduct = products.find(p => p.label === '综合最优') || products[0];

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-rose-500" />
        <h3 className="text-base font-black text-slate-800">AI 差异化智能拆解与运营策略</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 最优入局判定 */}
        <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Target className="w-32 h-32" />
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-rose-500 text-white border-none">最优入局单品</Badge>
            <span className="text-sm font-bold">{bestProduct.name}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            判定理由：该单品在“蓝海竞争分”与“盈利潜力”上均处于对标组首位。虽然市场热度略低于头部竞品，但其极低的同款竞争度意味着更低的获客成本（CPA），适合作为本季主推款深耕。
          </p>
          <div className="pt-2 flex gap-3">
            <div className="flex-1 p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[9px] text-slate-500 block mb-1">建议定价</span>
              <span className="text-xs font-bold text-rose-400">¥{bestProduct.data.price}</span>
            </div>
            <div className="flex-1 p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[9px] text-slate-500 block mb-1">预估月利</span>
              <span className="text-xs font-bold text-emerald-400">¥{bestProduct.data.profit}</span>
            </div>
          </div>
        </div>

        {/* 错位竞争策略 */}
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 space-y-3">
            <div className="flex items-center gap-2 text-rose-700">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold">错位竞争策略 (差异化路径)</span>
            </div>
            <ul className="space-y-2">
              {[
                '定价卡位：避开 ¥199 激战区，切入 ¥250-300 高端空白带',
                '卖点差异：竞品主打“紧致”，建议强化“真空锁鲜”与“无敏实测”',
                '渠道侧重：避开抖音大促内卷，优先在小红书进行深度内容种草'
              ].map((s, i) => (
                <li key={i} className="text-[11px] text-rose-600 flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
            <div className="flex items-center gap-2 text-amber-700">
              <Lightbulb className="w-4 h-4" />
              <span className="text-xs font-bold">赛道共性短板 (机会点)</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              对标组普遍存在“物流包装渗漏”与“客服响应慢”的痛点。若能在履约环节强化“防漏包装”心智，可快速建立口碑护城河。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkingStrategy;