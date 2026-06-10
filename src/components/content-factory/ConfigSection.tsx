import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ConfigSectionProps {
  config: any;
  setConfig: (config: any) => void;
}

const ConfigSection = ({ config, setConfig }: ConfigSectionProps) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <div className="w-1 h-4 bg-rose-400 rounded-full" />
        <h3 className="text-sm font-bold text-slate-800">2.2 用户核心配置入参</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 font-bold">文案类型</Label>
          <Select value={config.type} onValueChange={(v) => setConfig({ ...config, type: v })}>
            <SelectTrigger className="h-9 text-xs bg-slate-50/50">
              <SelectValue placeholder="选择类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">商品标题</SelectItem>
              <SelectItem value="detail">详情页文案</SelectItem>
              <SelectItem value="video">短视频种草文案</SelectItem>
              <SelectItem value="live">直播口播话术</SelectItem>
              <SelectItem value="qa">好评问答</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 font-bold">投放平台</Label>
          <Select value={config.platform} onValueChange={(v) => setConfig({ ...config, platform: v })}>
            <SelectTrigger className="h-9 text-xs bg-slate-50/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">通用版</SelectItem>
              <SelectItem value="taobao">淘宝/天猫</SelectItem>
              <SelectItem value="douyin">抖音电商</SelectItem>
              <SelectItem value="xiaohongshu">小红书</SelectItem>
              <SelectItem value="pdd">拼多多</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 font-bold">文案风格</Label>
          <Select value={config.style} onValueChange={(v) => setConfig({ ...config, style: v })}>
            <SelectTrigger className="h-9 text-xs bg-slate-50/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="premium">专业高级</SelectItem>
              <SelectItem value="clean">简约干净</SelectItem>
              <SelectItem value="conversion">高转化营销</SelectItem>
              <SelectItem value="gentle">温柔种草</SelectItem>
              <SelectItem value="hardcore">硬核实用</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 font-bold">文案侧重点</Label>
          <Select value={config.focus} onValueChange={(v) => setConfig({ ...config, focus: v })}>
            <SelectTrigger className="h-9 text-xs bg-slate-50/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="function">突出功能</SelectItem>
              <SelectItem value="value">突出性价比</SelectItem>
              <SelectItem value="aesthetic">突出颜值</SelectItem>
              <SelectItem value="painpoint">突出解决痛点</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 col-span-2">
          <Label className="text-[11px] text-slate-500 font-bold">字数规格</Label>
          <Select value={config.length} onValueChange={(v) => setConfig({ ...config, length: v })}>
            <SelectTrigger className="h-9 text-xs bg-slate-50/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">极简短句</SelectItem>
              <SelectItem value="standard">常规标准</SelectItem>
              <SelectItem value="long">详细加长</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ConfigSection;