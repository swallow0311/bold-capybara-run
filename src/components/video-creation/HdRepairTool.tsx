import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import ToolHeader from './ToolHeader';
import { cn } from "@/lib/utils";

interface HdRepairToolProps {
  onClose: () => void;
  repairConfig: {
    mode: string;
    denoise: boolean;
    sharpen: boolean;
  };
  setRepairConfig: React.Dispatch<React.SetStateAction<any>>;
}

const HdRepairTool = ({ onClose, repairConfig, setRepairConfig }: HdRepairToolProps) => {
  const [isFixing, setIsFixing] = useState(false);

  const startRepairTask = () => {
    setIsFixing(true);
    setTimeout(() => {
      setIsFixing(false);
      showSuccess("AI 视频超分辨率细节高清重建修复成功！已达到天猫主图超清上架规范。");
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <ToolHeader 
        title="无损画质高清修复" 
        onClose={onClose} 
        onReset={() => setRepairConfig({
          mode: 'hd',
          denoise: true,
          sharpen: true
        })}
      />

      <div className="space-y-4 text-xs text-left">
        <div>
          <Label className="text-slate-500 font-semibold mb-1.5 block">选择修复精度模式</Label>
          <div className="grid grid-cols-3 gap-2">
            {['std', 'hd', '4k'].map(mode => {
              const isSelected = repairConfig.mode === mode;
              const textMap: any = { std: '标准去噪', hd: '高清超分', '4k': '真彩4K重建' };
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRepairConfig((prev: any) => ({ ...prev, mode }))}
                  className={cn(
                    "py-1.5 px-1 border rounded-lg text-center font-medium transition-all text-[10px]",
                    isSelected 
                      ? "bg-rose-50 border-rose-300 text-rose-700 shadow-sm"
                      : "bg-slate-50/40 border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {textMap[mode]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100">
            <span className="font-semibold text-slate-700">运动模糊降噪消除</span>
            <Switch 
              checked={repairConfig.denoise} 
              onCheckedChange={(checked) => setRepairConfig((prev: any) => ({ ...prev, denoise: checked }))} 
            />
          </div>

          <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100">
            <span className="font-semibold text-slate-700">智能商品微轮廓锐化</span>
            <Switch 
              checked={repairConfig.sharpen} 
              onCheckedChange={(checked) => setRepairConfig((prev: any) => ({ ...prev, sharpen: checked }))} 
            />
          </div>
        </div>

        <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100 text-[10px] text-rose-700 leading-normal">
          高清修复开启后，超算算力将重新对商品原件像素进行插值重建，杜绝产出模糊假细节，完整保留商品真实金属/乳液原质感。
        </div>
      </div>

      <Button 
        onClick={startRepairTask}
        disabled={isFixing}
        className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold h-9 text-xs rounded-xl mt-2"
      >
        {isFixing ? "算法渲染重建中..." : "启动 AI 高清质感修复"}
      </Button>
    </div>
  );
};

export default HdRepairTool;