import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings2, RotateCcw, Save } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface SelectionConfigSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SelectionConfigSheet = ({ open, onOpenChange }: SelectionConfigSheetProps) => {
  const [weights, setWeights] = React.useState({
    market: 30,
    competitor: 25,
    profit: 20,
    nlp: 15,
    ownStore: 10
  });

  const handleSave = () => {
    showSuccess("选品打分权重配置已更新，下次计算将即时生效。");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md text-left">
        <SheetHeader className="pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-rose-500" />
            <SheetTitle>选品打分权重配置</SheetTitle>
          </div>
          <SheetDescription>自定义蓝海潜力得分的计算逻辑，适配不同阶段的经营策略。</SheetDescription>
        </SheetHeader>

        <div className="py-8 space-y-8">
          {[
            { key: 'market', label: '大盘搜索热度', desc: '反映市场需求趋势与流量天花板' },
            { key: 'competitor', label: '竞品动销表现', desc: '分析竞品销量增速与市场占有率' },
            { key: 'profit', label: '价格利润空间', desc: '评估毛利水平与价格战承受力' },
            { key: 'nlp', label: 'NLP 评价情感', desc: '基于用户痛点与口碑的差异化机会' },
            { key: 'ownStore', label: '本店经营数据', desc: '结合本店历史转化率与库存周转' }
          ].map((item) => (
            <div key={item.key} className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-slate-700">{item.label}</Label>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
                <span className="text-xs font-black text-rose-500">{(weights as any)[item.key]}%</span>
              </div>
              <Slider 
                value={[(weights as any)[item.key]]} 
                onValueChange={(val) => setWeights(prev => ({ ...prev, [item.key]: val[0] }))}
                max={100} 
                step={5} 
              />
            </div>
          ))}

          <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
            <div className="flex justify-between text-xs font-bold text-rose-700">
              <span>当前权重总和</span>
              <span>{Object.values(weights).reduce((a, b) => a + b, 0)}%</span>
            </div>
            <p className="text-[10px] text-rose-600/70 mt-1">注：权重总和建议保持在 100% 以获得标准化的潜力得分。</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="outline" className="flex-1 h-10 text-xs" onClick={() => setWeights({ market: 30, competitor: 25, profit: 20, nlp: 15, ownStore: 10 })}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> 恢复默认
          </Button>
          <Button className="flex-1 h-10 text-xs bg-rose-400 hover:bg-rose-500 text-white font-bold" onClick={handleSave}>
            <Save className="w-3.5 h-3.5 mr-1.5" /> 保存配置
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SelectionConfigSheet;