import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, X, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BenchmarkingTableProps {
  products: any[];
}

const BenchmarkingTable = ({ products }: BenchmarkingTableProps) => {
  // 辅助函数：判断数值是否为该行最优/最差
  const getHighlightClass = (value: any, allValues: any[], type: 'max' | 'min' = 'max') => {
    if (typeof value !== 'number') return "";
    const numericValues = allValues.filter(v => typeof v === 'number');
    if (numericValues.length < 2) return "";
    const target = type === 'max' ? Math.max(...numericValues) : Math.min(...numericValues);
    const opposite = type === 'max' ? Math.min(...numericValues) : Math.max(...numericValues);
    
    if (value === target) return "bg-emerald-50 text-emerald-700 font-black";
    if (value === opposite) return "bg-rose-50 text-rose-700 font-black";
    return "";
  };

  const sections = [
    {
      title: "基础信息维度",
      rows: [
        { label: "综合评分", key: "totalScore", highlight: 'max' },
        { label: "品值标签", key: "tag", isBadge: true },
      ]
    },
    {
      title: "市场趋势维度",
      rows: [
        { label: "30天热度涨幅", key: "trend", isPercent: true, highlight: 'max' },
        { label: "赛道生命周期", key: "lifecycle" },
        { label: "季节属性", key: "season" },
      ]
    },
    {
      title: "竞争格局维度",
      rows: [
        { label: "同款在售数量", key: "competitorCount", highlight: 'min' },
        { label: "头部垄断度", key: "monopoly" },
        { label: "差异化卖点数", key: "uspCount", highlight: 'max' },
      ]
    },
    {
      title: "盈利商业维度",
      rows: [
        { label: "建议定价", key: "price", isCurrency: true },
        { label: "预估毛利率", key: "margin", isPercent: true, highlight: 'max' },
        { label: "预估月净利", key: "profit", isCurrency: true, highlight: 'max' },
        { label: "盈亏平衡ROI", key: "roi", highlight: 'min' },
      ]
    },
    {
      title: "口碑与风险",
      rows: [
        { label: "预估退货率", key: "returnRate", isPercent: true, highlight: 'min' },
        { label: "侵权风险", key: "risk", isRisk: true },
      ]
    }
  ];

  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow>
            <TableHead className="w-[180px] text-xs font-bold sticky left-0 bg-slate-50 z-20">对比维度</TableHead>
            {products.map(p => (
              <TableHead key={p.id} className="min-w-[200px] text-center">
                <div className="flex flex-col items-center py-2 space-y-1">
                  <img src={p.img} className="w-10 h-10 rounded-lg object-cover border border-slate-200" alt="" />
                  <span className="text-[11px] font-black text-slate-800 truncate w-40">{p.name}</span>
                  <Badge className={cn(
                    "text-[9px] border-none",
                    p.label === '综合最优' ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-500"
                  )}>{p.label}</Badge>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section, sIdx) => (
            <React.Fragment key={sIdx}>
              <TableRow className="bg-slate-50/30">
                <TableCell colSpan={products.length + 1} className="py-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {section.title}
                </TableCell>
              </TableRow>
              {section.rows.map((row, rIdx) => (
                <TableRow key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-[11px] font-bold text-slate-500 sticky left-0 bg-white z-10 border-r border-slate-50">
                    {row.label}
                  </TableCell>
                  {products.map(p => {
                    const val = p.data[row.key];
                    const allVals = products.map(prod => prod.data[row.key]);
                    return (
                      <TableCell 
                        key={p.id} 
                        className={cn(
                          "text-center text-xs",
                          row.highlight && getHighlightClass(val, allVals, row.highlight as any)
                        )}
                      >
                        {row.isBadge ? <Badge variant="outline" className="text-[10px] border-slate-200">{val}</Badge> :
                         row.isPercent ? `${val}%` :
                         row.isCurrency ? `¥${val}` :
                         row.isRisk ? (val === '低' ? <Check className="w-3.5 h-3.5 text-emerald-500 mx-auto" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mx-auto" />) :
                         val}
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
  );
};

export default BenchmarkingTable;