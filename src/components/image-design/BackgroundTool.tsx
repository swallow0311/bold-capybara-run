import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import TuningHeader from './TuningHeader';
import { cn } from "@/lib/utils";

const PRESET_BGS = [
  { id: 'white', name: '纯白', color: 'bg-white border-slate-200' },
  { id: 'gray', name: '浅灰', color: 'bg-slate-100' },
  { id: 'grad', name: '渐变', color: 'bg-gradient-to-br from-rose-50 to-slate-100' },
  { id: 'scene', name: '实景', img: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100&auto=format&fit=crop&q=60' },
  { id: 'promo', name: '大促', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&auto=format&fit=crop&q=60' },
];

const BackgroundTool = ({ onClose }: { onClose: () => void }) => {
  const [selectedBg, setSelectedBg] = useState('white');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApply = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showSuccess("AI 智能换背景完成：已实现发丝级抠图与光影无痕融合。");
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <TuningHeader title="AI 智能换背景" onClose={onClose} />
      
      <div className="space-y-3">
        <Label className="text-[11px] font-bold text-slate-500">预设电商背景</Label>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_BGS.map(bg => (
            <button
              key={bg.id}
              onClick={() => setSelectedBg(bg.id)}
              className={cn(
                "aspect-square rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 overflow-hidden",
                selectedBg === bg.id ? "border-rose-400 ring-2 ring-rose-100" : "border-transparent hover:border-slate-200"
              )}
            >
              {bg.img ? (
                <img src={bg.img} className="w-full h-full object-cover" alt={bg.name} />
              ) : (
                <div className={cn("w-full h-full", bg.color)} />
              )}
              <span className="absolute bottom-0 w-full bg-black/40 text-white text-[8px] py-0.5">{bg.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-[11px] font-bold text-slate-500">自定义背景</Label>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-rose-300 transition-all bg-slate-50/50">
          <Upload className="w-4 h-4 mx-auto text-slate-400 mb-1" />
          <span className="text-[10px] text-slate-500">上传自定义背景图</span>
        </div>
      </div>

      <div className="pt-2">
        <Button 
          onClick={handleApply}
          disabled={isProcessing}
          className="w-full bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold h-9 rounded-xl"
        >
          {isProcessing ? <Sparkles className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-2" />}
          一键智能融合背景
        </Button>
      </div>
    </div>
  );
};

export default BackgroundTool;