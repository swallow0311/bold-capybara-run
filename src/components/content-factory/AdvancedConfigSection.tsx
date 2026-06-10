import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedConfigSectionProps {
  adv: any;
  setAdv: (adv: any) => void;
}

const AdvancedConfigSection = ({ adv, setAdv }: AdvancedConfigSectionProps) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <div className="w-1 h-4 bg-rose-400 rounded-full" />
        <h3 className="text-sm font-bold text-slate-800">2.3 高级自定义入参</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 font-bold">必须包含关键词 (逗号分隔)</Label>
          <Input 
            placeholder="如：酵母, 紧致, 28天" 
            className="h-9 text-xs" 
            value={adv.include}
            onChange={(e) => setAdv({ ...adv, include: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 font-bold">禁止出现词汇 (逗号分隔)</Label>
          <Input 
            placeholder="如：第一, 极致, 治愈" 
            className="h-9 text-xs" 
            value={adv.exclude}
            onChange={(e) => setAdv({ ...adv, exclude: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 font-bold">原创度档位</Label>
          <Select value={adv.originality} onValueChange={(v) => setAdv({ ...adv, originality: v })}>
            <SelectTrigger className="h-8 text-[11px] bg-slate-50/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低原创 (通顺优先)</SelectItem>
              <SelectItem value="mid">中原创 (平衡)</SelectItem>
              <SelectItem value="high">高原创 (防查重优先)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 font-bold">营销强度档位</Label>
          <Select value={adv.intensity} onValueChange={(v) => setAdv({ ...adv, intensity: v })}>
            <SelectTrigger className="h-8 text-[11px] bg-slate-50/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weak">弱营销 (客观介绍)</SelectItem>
              <SelectItem value="mid">适中</SelectItem>
              <SelectItem value="strong">强营销 (促单转化)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-rose-50/40 rounded-xl border border-rose-100">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-rose-700">合规规避开关</span>
          <p className="text-[9px] text-rose-600/70">开启后自动过滤极限词与虚假宣传话术</p>
        </div>
        <Switch checked={adv.compliance} onCheckedChange={(v) => setAdv({ ...adv, compliance: v })} />
      </div>
    </div>
  );
};

export default AdvancedConfigSection;