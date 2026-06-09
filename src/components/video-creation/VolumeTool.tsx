import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Volume2, Sparkles } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import ToolHeader from './ToolHeader';

interface VolumeToolProps {
  onClose: () => void;
  volumeConfig: {
    bgm: number;
    voice: number;
    original: number;
    denoise: boolean;
  };
  setVolumeConfig: React.Dispatch<React.SetStateAction<any>>;
}

const VolumeTool = ({ onClose, volumeConfig, setVolumeConfig }: VolumeToolProps) => {
  return (
    <div className="space-y-4">
      <ToolHeader 
        title="独立音量平衡调节" 
        onClose={onClose} 
        onReset={() => setVolumeConfig({
          bgm: 30,
          voice: 80,
          original: 50,
          denoise: true
        })}
      />

      <div className="space-y-4 text-xs text-left">
        {/* Voice channel */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-slate-500 font-semibold">AI 配音音轨量度 (人声增强)</Label>
            <span className="text-rose-500 font-bold">{volumeConfig.voice}%</span>
          </div>
          <Slider 
            value={[volumeConfig.voice]} 
            onValueChange={(val) => setVolumeConfig((prev: any) => ({ ...prev, voice: val[0] }))}
            max={100} 
            min={0} 
          />
        </div>

        {/* BGM channel */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-slate-500 font-semibold">背景音乐音轨量度 (BGM 弱化)</Label>
            <span className="text-rose-500 font-bold">{volumeConfig.bgm}%</span>
          </div>
          <Slider 
            value={[volumeConfig.bgm]} 
            onValueChange={(val) => setVolumeConfig((prev: any) => ({ ...prev, bgm: val[0] }))}
            max={100} 
            min={0} 
          />
        </div>

        {/* Original sound channel */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-slate-500 font-semibold">视频源声音轨量度</Label>
            <span className="text-rose-500 font-bold">{volumeConfig.original}%</span>
          </div>
          <Slider 
            value={[volumeConfig.original]} 
            onValueChange={(val) => setVolumeConfig((prev: any) => ({ ...prev, original: val[0] }))}
            max={100} 
            min={0} 
          />
        </div>

        {/* Denoise switch */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-700 block">AI 智能啸叫与爆音降噪</span>
            <span className="text-[10px] text-slate-400">自动剥离环境噪点与低频电流声</span>
          </div>
          <Switch 
            checked={volumeConfig.denoise} 
            onCheckedChange={(checked) => setVolumeConfig((prev: any) => ({ ...prev, denoise: checked }))} 
          />
        </div>
      </div>

      <Button 
        onClick={() => showSuccess("音量响度平衡参数一键应用")} 
        className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold h-9 text-xs rounded-xl mt-2"
      >
        <Volume2 className="w-3.5 h-3.5 mr-1.5" />
        平衡多音轨响度并输出
      </Button>
    </div>
  );
};

export default VolumeTool;