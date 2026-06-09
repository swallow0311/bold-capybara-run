import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Paintbrush, Eraser, Sparkles, RefreshCw } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import TuningHeader from './TuningHeader';
import { cn } from "@/lib/utils";

const RepairTool = ({ onClose }: { onClose: () => void }) => {
  const [brushSize, setBrushSize] = useState([20]);
  const [mode, setMode] = useState<'brush' | 'eraser'>('brush');
  const [isRepairing, setIsRepairing] = useState(false);

  const handleRepair = () => {
    setIsRepairing(true);
    setTimeout(() => {
      setIsRepairing(false);
      showSuccess("AI 局部修补完成：已无痕消除选中区域瑕疵，完美复刻周边纹理。");
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <TuningHeader title="AI 局部修补" onClose={onClose} />
      
      <div className="p-4 bg-slate-900 rounded-xl aspect-video flex items-center justify-center relative group overflow-hidden">
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&auto=format&fit=crop&q=60')] bg-cover bg-center" />
        <div className="z-10 text-center space-y-2">
          <Paintbrush className="w-8 h-8 text-white/50 mx-auto" />
          <p className="text-[10px] text-white/70">在上方预览图中涂抹需要修复的区域</p>
        </div>
        {/* Mock brush cursor */}
        <div 
          className="absolute border-2 border-white rounded-full pointer-events-none z-20 bg-white/20"
          style={{ width: `${brushSize[0]}px`, height: `${brushSize[0]}px` }}
        />
      </div>

      <div className="flex gap-2">
        <Button 
          variant={mode === 'brush' ? 'default' : 'outline'} 
          size="sm" 
          className={cn("flex-1 text-[10px] h-9", mode === 'brush' && "bg-rose-400 hover:bg-rose-500")}
          onClick={() => setMode('brush')}
        >
          <Paintbrush className="w-3.5 h-3.5 mr-1.5" /> 涂抹修复
        </Button>
        <Button 
          variant={mode === 'eraser' ? 'default' : 'outline'} 
          size="sm" 
          className={cn("flex-1 text-[10px] h-9", mode === 'eraser' && "bg-rose-400 hover:bg-rose-500")}
          onClick={() => setMode('eraser')}
        >
          <Eraser className="w-3.5 h-3.5 mr-1.5" /> 擦除选区
        </Button>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between">
          <Label className="text-[11px] font-bold text-slate-500">画笔大小</Label>
          <span className="text-[10px] font-bold text-rose-500">{brushSize}px</span>
        </div>
        <Slider value={brushSize} onValueChange={setBrushSize} max={100} min={5} step={1} />
      </div>

      <div className="space-y-2 pt-2">
        <p className="text-[10px] text-slate-400 leading-relaxed">
          支持去除杂物、污渍、水印、划痕、反光。AI 将自动复刻周边色彩与光影，实现无痕填充。
        </p>
        <Button 
          onClick={handleRepair}
          disabled={isRepairing}
          className="w-full bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold h-10 rounded-xl"
        >
          {isRepairing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          开始智能修补
        </Button>
      </div>
    </div>
  );
};

export default RepairTool;