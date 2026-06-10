import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUp, MessageSquare, Zap, ArrowRight, 
  ShieldAlert, ShoppingBag, BarChart3, Send,
  CheckCircle2, AlertCircle, Lightbulb
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface SelectionDetailDrawerProps {
  item: any;
  onClose: () => void;
}

const SelectionDetailDrawer = ({ item, onClose }: SelectionDetailDrawerProps) => {
  if (!item) return null;

  const handlePush = (module: string) => {
    showSuccess(`商品档案已成功推送至 ${module} 模块，相关分析任务已自动排队。`);
  };

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col text-left">
        <SheetHeader className="p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-rose-500" />
              <SheetTitle>AI 选品深度拆解报告</SheetTitle>
            </div>
            <Badge className="bg-rose-50 text-rose-600 border-rose-100">潜力得分 {item.score}</Badge>
          </div>
          <SheetDescription>基于多维数据流生成的结构化市场机会分析报告。</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            {/* 1. 商品概览 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ShoppingBag className="w-4 h-4 text-rose-400" /> 核心机会点
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <h3 className="text-sm font-black text-slate-800">{item.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.opportunity}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-white text-slate-500 border-slate-200 text-[10px]">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. 竞品优劣势拆解 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <TrendingUp className="w-4 h-4 text-rose-400" /> 竞品优劣势拆解 (聚类分析)
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 竞品核心优势
                  </div>
                  <ul className="text-[10px] text-emerald-600/80 space-y-1.5 list-disc pl-4">
                    <li>品牌背书极强，用户信任度高</li>
                    <li>营销预算充足，全网声量覆盖广</li>
                    <li>物流时效稳定，次日达覆盖率 80%</li>
                  </ul>
                </div>
                <div className="p-4 bg-rose-50/30 border border-rose-100 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" /> 竞品薄弱环节 (机会)
                  </div>
                  <ul className="text-[10px] text-rose-600/80 space-y-1.5 list-disc pl-4">
                    <li>包装设计陈旧，不符合 Z 世代审美</li>
                    <li>成分浓度标注模糊，存在信任缺口</li>
                    <li>售后响应慢，差评处理率低于 40%</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. 差异化运营建议 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Lightbulb className="w-4 h-4 text-rose-400" /> 差异化运营机会建议
              </div>
              <div className="space-y-3">
                {[
                  { label: '产品端', content: '强化“真空泵头”与“高活性多肽”心智，主打成分透明化。' },
                  { label: '营销端', content: '利用 AIGC 生成针对“敏感肌”痛点的对比视频，突出即时退红效果。' },
                  { label: '价格端', content: '建议定价在 249-289 元区间，避开 199 元红海价格战。' }
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <Badge className="h-5 bg-slate-800 text-white border-none text-[9px] shrink-0">{tip.label}</Badge>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{tip.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. 风险归因 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> 负面风险归因预警
              </div>
              <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-rose-700">潜在差评风险点</span>
                  <Badge variant="outline" className="text-[9px] border-rose-200 text-rose-600">中风险</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">过敏反应风险</span>
                    <span className="font-bold text-rose-600">15%</span>
                  </div>
                  <Progress value={15} className="h-1 bg-rose-100" />
                  <p className="text-[9px] text-slate-400 mt-1">※ 基于同类成分竞品 NLP 评价聚类分析得出</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 h-10 text-xs border-slate-200"
              onClick={() => handlePush('评价 NLP')}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> 推送至 NLP 分析
            </Button>
            <Button 
              className="flex-1 h-10 text-xs bg-rose-400 hover:bg-rose-500 text-white font-bold"
              onClick={() => handlePush('AIGC 内容工厂')}
            >
              <Zap className="w-3.5 h-3.5 mr-1.5" /> 推送至 AIGC 生成
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SelectionDetailDrawer;