import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess } from '@/utils/toast';
import ToolHeader from './ToolHeader';

interface SubtitleToolProps {
  onClose: () => void;
  subtitleConfig: {
    color: string;
    fontSize: number;
    fontFamily: string;
    stroke: boolean;
    avoidSubject: boolean;
  };
  setSubtitleConfig: React.Dispatch<React.SetStateAction<any>>;
}

const SubtitleTool = ({ onClose, subtitleConfig, setSubtitleConfig }: SubtitleToolProps) => {
  const handlePresetSelect = (preset: string) => {
    if (preset === 'yellow') {
      setSubtitleConfig((prev: any) => ({ ...prev, color: '#fca311', fontSize: 16, stroke: true }));
    } else if (preset === 'white') {
      setSubtitleConfig((prev: any) => ({ ...prev, color: '#ffffff', fontSize: 14, stroke: false }));
    } else {
      setSubtitleConfig((prev: any) => ({ ...prev, color: '#ff4d4f', fontSize: 18, stroke: true }));
    }
    showSuccess("已应用选定的字幕样式预设");
  };

  return (
    <div className="space-y-4">
      <ToolHeader 
        title="字幕样式微调" 
        onClose={onClose} 
        onReset={() => setSubtitleConfig({
          color: '#ffffff',
          fontSize: 14,
          fontFamily: 'sans',
          stroke: true,
          avoidSubject: true
        })}
      />

      <div className="space-y-3 text-xs text-left">
        {/* Style presets */}
        <div>
          <Label className="text-slate-500 font-semibold mb-1.5 block">电商商用字幕模板预设</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="text-[10px] h-7 border-slate-200" onClick={() => handlePresetSelect('white')}>
              经典简约白
            </Button>
            <Button variant="outline" size="sm" className="text-[10px] h-7 border-slate-200" onClick={() => handlePresetSelect('yellow')}>
              醒目活力黄
            </Button>
            <Button variant="outline" size="sm" className="text-[10px] h-7 border-slate-200" onClick={() => handlePresetSelect('red')}>
              大促爆发红
            </Button>
          </div>
        </div>

        {/* Font choice */}
        <div className="space-y-1.5">
          <Label className="text-slate-500 font-semibold">商用合规字体选择</Label>
          <Select 
            value={subtitleConfig.fontFamily} 
            onValueChange={(val) => setSubtitleConfig((prev: any) => ({ ...prev, fontFamily: val }))}
          >
            <SelectTrigger className="bg-slate-50/50 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">思源黑体 (商用合规)</SelectItem>
              <SelectItem value="serif">思源宋体 (商用合规)</SelectItem>
              <SelectItem value="mono">阿里妈妈刀隶体</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font size */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between">
            <Label className="text-slate-500 font-semibold">字号大小</Label>
            <span className="text-rose-500 font-bold">{subtitleConfig.fontSize} px</span>
          </div>
          <Slider 
            value={[subtitleConfig.fontSize]} 
            onValueChange={(val) => setSubtitleConfig((prev: any) => ({ ...prev, fontSize: val[0] }))}
            max={32} 
            min={10} 
            step={1} 
          />
        </div>

        {/* Stroke and position settings */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100">
            <span className="font-semibold text-slate-700">添加双排描边</span>
            <Switch 
              checked={subtitleConfig.stroke} 
              onCheckedChange={(checked) => setSubtitleConfig((prev: any) => ({ ...prev, stroke: checked }))} 
            />
          </div>

          <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100">
            <span className="font-semibold text-slate-700">智能留白避位</span>
            <Switch 
              checked={subtitleConfig.avoidSubject} 
              onCheckedChange={(checked) => setSubtitleConfig((prev: any) => ({ ...prev, avoidSubject: checked }))} 
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={() => showSuccess("字幕全局渲染参数同步成功")} 
        className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold h-9 text-xs rounded-xl mt-2"
      >
        同步字幕全局样式
      </Button>
    </div>
  );
};

export default SubtitleTool;