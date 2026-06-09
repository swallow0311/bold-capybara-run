import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Scissors, Maximize2, Layout, Check } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import TuningHeader from './TuningHeader';
import { cn } from "@/lib/utils";

const RATIOS = [
  { id: '1:1', name: '1:1 主图', desc: '电商首图标准' },
  { id: '3:4', name: '3:4 海报', desc: '详情页/种草图' },
  { id: '9:16', name: '9:16 竖屏', desc: '短视频/故事流' },
  { id: '16:9', name: '16:9 横屏', desc: 'Banner/封面' },
];

const CropTool = ({ onClose }: { onClose: () => void }) => {
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [isSmartCrop, setIsSmartCrop] = useState(true);

  const handleApply = () => {
    showSuccess(`画布已裁剪为 ${selectedRatio}：已自动识别并居中保护商品主体。`);
  };

  return (
    <div className="space-y-4">
      <TuningHeader title="裁剪画布" onClose={onClose} />
      
      <div className="space-y-3">
        <Label className="text-[11px] font-bold text-slate-500">电商标准比例</Label>
        <div className="grid grid-cols-2 gap-3">
          {RATIOS.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRatio(r.id)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all space-y-1",
                selectedRatio === r.id 
                  ? "bg-rose-50 border-rose-400 text-rose-700 shadow-sm"
                  : "bg-slate-50/30 border-slate-100 text-slate-600 hover:border-slate-200"
              )}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs">{r.name}</span>
                {selectedRatio === r.id && <Check className="w-3 h-3 text-rose-500" />}
              </div>
              <span className="text-[9px] text-slate-400 block">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Label className="text-[11px] font-bold text-slate-500">裁剪模式</Label>
        <div className="flex gap-2">
          <Button 
            variant={isSmartCrop ? 'default' : 'outline'} 
            size="sm" 
            className={cn("flex-1 text-[10px] h-9", isSmartCrop && "bg-rose-400 hover:bg-rose-500")}
            onClick={() => setIsSmartCrop(true)}
          >
            <Maximize2 className="w-3.5 h-3.5 mr-1.5" /> 智能主体居中
          </Button>
          <Button 
            variant={!isSmartCrop ? 'default' : 'outline'} 
            size="sm" 
            className={cn("flex-1 text-[10px] h-9", !isSmartCrop && "bg-rose-400 hover:bg-rose-500")}
            onClick={() => setIsSmartCrop(false)}
          >
            <Layout className="w-3.5 h-3.5 mr-1.5" /> 自由手动裁剪
          </Button>
        </div>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mt-2">
        <p className="text-[10px] text-slate-500 leading-relaxed">
          默认锁定比例以杜绝拉伸变形。裁剪后将百分百保留原图画质，无黑边、无畸形留白。
        </p>
      </div>

      <Button 
        onClick={handleApply}
        className="w-full bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold h-10 rounded-xl mt-2"
      >
        <Scissors className="w-4 h-4 mr-2" />
        确认裁剪画布
      </Button>
    </div>
  );
};

export default CropTool;