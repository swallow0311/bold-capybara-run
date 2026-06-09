import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Type, AlignLeft, Palette } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import TuningHeader from './TuningHeader';

const TextTool = ({ onClose }: { onClose: () => void }) => {
  const [text, setText] = useState('敏感肌强屏障 · 28天显淡纹');
  const [fontSize, setFontSize] = useState([24]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setText("酵母精粹深层修护，重塑紧致年轻肌");
      showSuccess("AI 已根据商品属性自动生成合规卖点文案，并完成智能避位排版。");
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <TuningHeader title="智能添加文案" onClose={onClose} />
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-[11px] font-bold text-slate-500">文案内容</Label>
          <button 
            onClick={handleAiGenerate}
            disabled={isGenerating}
            className="text-[10px] text-rose-500 font-bold flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-3 h-3" /> AI 自动生成
          </button>
        </div>
        <Input 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          className="text-xs bg-slate-50/50 border-slate-200"
          placeholder="输入自定义文案..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[11px] font-bold text-slate-500">商用字体</Label>
          <Button variant="outline" size="sm" className="w-full text-[10px] h-8 justify-between">
            <span className="font-bold">思源黑体 (Bold)</span>
            <Type className="w-3 h-3 text-slate-400" />
          </Button>
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-bold text-slate-500">文字颜色</Label>
          <div className="flex gap-1.5">
            {['#FFFFFF', '#000000', '#F43F5E', '#F59E0B'].map(c => (
              <div key={c} className="w-6 h-6 rounded-full border border-slate-200 cursor-pointer" style={{ backgroundColor: c }} />
            ))}
            <Palette className="w-6 h-6 text-slate-300 p-1 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between">
          <Label className="text-[11px] font-bold text-slate-500">字号大小</Label>
          <span className="text-[10px] font-bold text-rose-500">{fontSize}px</span>
        </div>
        <Slider value={fontSize} onValueChange={setFontSize} max={100} min={12} step={1} />
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8">描边/投影</Button>
        <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8">间距调节</Button>
      </div>

      <Button 
        onClick={() => showSuccess("文案样式已应用，已自动避开商品主体。")}
        className="w-full bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold h-9 rounded-xl mt-2"
      >
        确认应用文案
      </Button>
    </div>
  );
};

export default TextTool;