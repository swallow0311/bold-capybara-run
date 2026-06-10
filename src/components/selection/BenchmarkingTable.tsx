import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, AlertTriangle, TrendingUp, TrendingDown, Minus, ShieldCheck, Box, Coins } from 'lucide-react';

interface BenchmarkingTableProps {
  products: any[];
}

const BenchmarkingTable = ({ products }: BenchmarkingTableProps) => {
  // 辅助函数：判断数值优劣并返回样式
  const getHighlightClass = (value: any, allValues: any[], type: 'max' | 'min' = 'max') => {
    if (typeof value !== 'number') return "";
    const numericValues = allValues.filter(v => typeof v === 'number');
    if (numericValues.length < 2) return "";
    const target = type === 'max' ? Math.max(...numericValues) : Math.min(...numericValues);
    const opposite = type === 'max' ? Math.min(...numericValues) : Math.max(...numericValues);
    
    if (value === target) return "bg-emerald-50 text-emerald-700 font-black border-x-2 border-emerald-200";
    if (value === opposite) return "bg-rose-50 text-rose-700 font-black border-x-2 border-rose-200";
    return "";
  };

  const sections = [
    {
      title: "1. 基础信息维度",
      rows: [
        { label: "综合评分 (算法权重)", key: "totalScore", highlight: 'max' },
        { label: "品值标签", key: "tag", isBadge: true },
      ]
    },
    {
      title: "2. 市场趋势维度",
      rows: [
        { label: "30天热度涨幅", key: "trend", isPercent: true, highlight: 'max' },
        { label: "赛道生命周期", key: "lifecycle" },
        { label: "流量渠道占比", key: "trafficSource" },
        { label: "季节属性", key: "season" },
      ]
    },
    {
      title: "3. 竞争格局维度",
      rows: [
        { label: "同款在售数量", key: "competitorCount", highlight: 'min' },
        { label: "头部垄断度", key: "monopoly" },
        { label: "差异化卖点数", key: "uspCount", highlight: 'max' },
      ]
    },
    {
      title: "4. 盈利商业维度",
      rows: [
        { label: "参考成本", key: "cost", isCurrency: true },
        { label: "建议定价区间", key: "priceRange" },
        { label: "预估毛利率", key: "margin", isPercent: true, highlight: 'max' },
        { label: "预估月净利", key: "profit", isCurrency: true, highlight: 'max' },
        { label: "盈亏平衡 ROI", key: "roi", highlight: 'min' },
      ]
    },
    {
      title: "5. 口碑舆情维度",
      rows: [
        { label: "好评核心标签", key: "goodTags" },
        { label: "差评 TOP 痛点", key: "badTags" },
        { label: "预估退货率", key: "returnRate", isPercent: true, highlight: 'min' },
        { label: "人群匹配度", key: "audienceMatch" },
      ]
    },
    {
      title: "6. 供应链能力",
      rows: [
        { label: "供货稳定性", key: "supplyStability" },
        { label: "最低起订量 (MOQ)", key: "moq", highlight: 'min' },
        { label: "补货周期 (天)", key: "leadTime", highlight: 'min' },
      ]
    },
    {
      title: "7. 风险合规维度",
      rows: [
        { label: "侵权风险", key: "infringementRisk", isRisk: true },
        { label: "合规资质要求", key: "compliance" },
      ]
    }
  ];

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xl">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow className="hover:bg-slate-900 border-none">
              <TableHead className="w-[200px] text-xs font-bold text-slate-400 sticky left-0 bg-slate-900 z-30">对比维度矩阵</TableHead>
              {products.map(p => (
                <TableHead key={p.id} className="min-w-[220px] text-center border-l border-white/10">
                  <div className="flex flex-col items-center py-4 space-y-2">
                    <div className="relative">
                      <img src={p.img} className="w-12 h-12 rounded-xl object-cover border-2 border-white/20" alt="" />
                      <Badge className="absolute -top-2 -right-2 bg-rose-500 text-white border-none text-[8px] px-1">Rank {p.rank}</Badge>
                    </div>
                    <span className="text-[11px] font-black text-white truncate w-40">{p.name}</span>
                    <Badge className={cn(
                      "text-[9px] border-none font-bold",
                      p.label === '综合最优' ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-300"
                    )}>{p.label}</Badge>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section, sIdx) => (
              <React.Fragment key={sIdx}>
                <TableRow className="bg-slate-50/80 border-y border-slate-200">
                  <TableCell colSpan={products.length + 1} className="py-2.5 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-3 bg-rose-400 rounded-full" />
                    {section.title}
                  </TableCell>
                </TableRow>
                {section.rows.map((row, rIdx) => (
                  <TableRow key={rIdx} className="hover:bg-slate-50/30 transition-colors border-b border-slate-100">
                    <TableCell className="text-[11px] font-bold text-slate-500 sticky left-0 bg-white z-20 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                      {row.label}
                    </TableCell>
                    {products.map(p => {
                      const val = p.data[row.key];
                      const allVals = products.map(prod => prod.data[row.key]);
                      return (
                        <TableCell 
                          key={p.id} 
                          className={cn(
                            "text-center text-xs py-3 border-l border-slate-50",
                            row.highlight && getHighlightClass(val, allVals, row.highlight as any)
                          )}
                        >
                          {row.isBadge ? <Badge variant="outline" className="text-[10px] border-slate-200 bg-white">{val || '-'}</Badge> :
                           row.isPercent ? `${val ?? '-'}%` :
                           row.isCurrency ? `¥${val ?? '-'}` :
                           row.isRisk ? (val === '低' ? <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto" /> : <AlertTriangle className="w-4 h-4 text-rose-500 mx-auto" />) :
                           (val ?? '-')}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BenchmarkingTable;