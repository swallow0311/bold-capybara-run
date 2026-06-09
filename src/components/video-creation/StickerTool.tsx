import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { showSuccess } from '@/utils/toast';
import ToolHeader from './ToolHeader';
import { cn } from "@/lib/utils";

const STICKERS = [
  { id: 'v-s1', name: '限时秒杀', color: 'bg-red-500' },
  { id: 'v-s2', name: '爆款首发', color: 'bg-rose-500' },
  { id: 'v-s3', name: '全场包邮', color: 'bg-slate-800' },
  { id: 'v-s4', name: '满减优惠', color: 'bg-amber-500' },
];

interface StickerToolProps {
  onClose: () => void;
  stickerConfig: {
    activeSticker: string | null;
    snapToEdge: boolean;
  };
  setStickerConfig: React.Dispatch<React.SetStateAction<any>>;
}

const StickerTool = ({ onClose, stickerConfig, setStickerConfig }: StickerToolProps) => {
  const handleStickerToggle = (id: string) => {
    const isSelected = stickerConfig.activeSticker === id;
    setStickerConfig((prev: any) => ({
      ...prev,
      activeSticker: isSelected ? null : id
    }));
    showSuccess(isSelected ? "已清除贴纸角标" : "动态贴纸已添加，已启动视频边缘吸附防护");
  };

  return (
    <div className="space-y-4">
      <ToolHeader 
        title="动态贴纸配置" 
        onClose={onClose} 
        onReset={() => setStickerConfig({
          activeSticker: null,
          snapToEdge: true
        })}
      />

      <div className="space-y-4 text-xs text-left">
        <div>
          <Label className="text-slate-500 font-semibold mb-1.5 block">内置合规动态角标</Label>
          <div className="grid grid-cols-2 gap-3">
            {STICKERS.map(s => {
              const isSelected = stickerConfig.activeSticker === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleStickerToggle(s.id)}
                  className={cn(
                    "p-3 rounded-xl flex items-center justify-center font-bold text-white transition-all border-2",
                    s.color,
                    isSelected ? "border-white ring-4 ring-rose-200 scale-95" : "border-transparent opacity-90 hover:opacity-100"
                  )}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-700 block">AI 视频安全区域边缘吸附</span>
            <span className="text-[10px] text-slate-400">自动避让屏幕字幕与中心主件区域</span>
          </div>
          <Switch 
            checked={stickerConfig.snapToEdge} 
            onCheckedChange={(checked) => setStickerConfig((prev: any) => ({ ...prev, snapToEdge: checked }))} 
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8" onClick={() => showSuccess("正在拉取动态关键帧挂载时长...")}>
            挂帧时长设置
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-[10px] h-8 text-rose-500 border-rose-100 hover:bg-rose-50"
            onClick={() => {
              setStickerConfig((prev: any) => ({ ...prev, activeSticker: null }));
              showSuccess("已清空预览贴纸");
            }}
          >
            一键清空贴纸
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickerTool;