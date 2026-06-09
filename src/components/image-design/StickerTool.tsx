import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tags, MousePointer2, Trash2, Sparkles } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import TuningHeader from './TuningHeader';
import { cn } from "@/lib/utils";

const STICKERS = {
  activity: [
    { id: 's1', name: '618狂欢', color: 'bg-rose-500' },
    { id: 's2', name: '双11特惠', color: 'bg-red-600' },
    { id: 's3', name: '新品首发', color: 'bg-amber-500' },
  ],
  rights: [
    { id: 'r1', name: '买一送一', color: 'bg-rose-400' },
    { id: 'r2', name: '满减优惠', color: 'bg-orange-500' },
    { id: 'r3', name: '顺丰包邮', color: 'bg-slate-800' },
  ]
};

const StickerTool = ({ onClose }: { onClose: () => void }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAddSticker = (id: string) => {
    setSelectedId(id);
    showSuccess("贴纸已添加：已自动吸附至安全区域并避开商品主体。");
  };

  return (
    <div className="space-y-4">
      <TuningHeader title="添加促销角标贴纸" onClose={onClose} />
      
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="w-full bg-slate-50 p-1 h-9">
          <TabsTrigger value="activity" className="flex-1 text-[10px]">大促活动</TabsTrigger>
          <TabsTrigger value="rights" className="flex-1 text-[10px]">营销权益</TabsTrigger>
          <TabsTrigger value="attr" className="flex-1 text-[10px]">商品属性</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="mt-4">
          <div className="grid grid-cols-3 gap-3">
            {STICKERS.activity.map(s => (
              <button
                key={s.id}
                onClick={() => handleAddSticker(s.id)}
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center p-2 transition-all border-2",
                  selectedId === s.id ? "border-rose-400 bg-rose-50" : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <div className={cn("w-full h-full rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-sm", s.color)}>
                  {s.name}
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rights" className="mt-4">
          <div className="grid grid-cols-3 gap-3">
            {STICKERS.rights.map(s => (
              <button
                key={s.id}
                onClick={() => handleAddSticker(s.id)}
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center p-2 transition-all border-2",
                  selectedId === s.id ? "border-rose-400 bg-rose-50" : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <div className={cn("w-full h-full rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-sm", s.color)}>
                  {s.name}
                </div>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-3 pt-2">
        <Label className="text-[11px] font-bold text-slate-500">贴纸操作</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-[10px] h-8">
            <MousePointer2 className="w-3 h-3 mr-1.5" /> 自由变换
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[10px] h-8 text-rose-500 border-rose-100 hover:bg-rose-50"
            onClick={() => {
              setSelectedId(null);
              showSuccess("已清空所有贴纸");
            }}
          >
            <Trash2 className="w-3 h-3 mr-1.5" /> 一键清空
          </Button>
        </div>
      </div>

      <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 mt-2">
        <div className="flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-rose-700 leading-relaxed">
            AI 智能吸附已开启：贴纸将自动对齐至画面四角安全区，确保不遮挡核心展示位。
          </p>
        </div>
      </div>
    </div>
  );
};

export default StickerTool;