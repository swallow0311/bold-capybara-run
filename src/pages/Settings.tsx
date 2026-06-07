import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { showSuccess } from '@/utils/toast';

const Settings = () => {
  const handleSave = () => {
    showSuccess('中台系统配置保存成功！');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">系统设置与引擎配置</h1>
          <p className="text-sm text-slate-500">调优LLM模型生成参数，控制品牌推广时的合规风控红线</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">大模型驱动引擎设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>默认底座大模型</Label>
                <Select defaultValue="gpt4">
                  <SelectTrigger>
                    <SelectValue placeholder="选择大语言模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4">中达自研美妆垂直大模型 v2.0</SelectItem>
                    <SelectItem value="claude">Claude 3.5 Sonnet</SelectItem>
                    <SelectItem value="deepseek">DeepSeek-V3 营销引擎</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>响应随机性 (Temperature)</Label>
                <div className="pt-2">
                  <Slider defaultValue={[0.7]} max={1} step={0.1} />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                    <span>严格写实 (0.0)</span>
                    <span>创意爆表 (1.0)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>系统级 Prompt 前缀 (System Prompt)</Label>
              <Input defaultValue="你是一个厦门中达美妆的顶尖带货文案大师，擅长利用吸睛的痛点痛击女性敏感肌诉求..." />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-rose-700">品牌风控与敏感词过滤</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-rose-50/40 rounded-xl border border-rose-100/60">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-800">启用违禁词实时风控</p>
                <p className="text-xs text-slate-400">自动拦截“第一”、“最强”、“根除”等违反新广告法的绝对化用词。</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 bg-rose-50/40 rounded-xl border border-rose-100/60">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-800">自动过滤同行竞品词</p>
                <p className="text-xs text-slate-400">文案和直播稿中自动将同行竞品名称转换为代称，避免法律纠纷。</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline">重置默认</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 px-6" onClick={handleSave}>保存配置</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;