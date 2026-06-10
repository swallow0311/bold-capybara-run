import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wand2, Sparkles, ShieldAlert } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const ContentFactory = () => {
  const [isLockEnabled, setIsLockEnabled] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto text-left pb-12">
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <ShieldAlert className={cn("w-4 h-4", isLockEnabled ? "text-emerald-500" : "text-red-500")} />
            <span className={cn("font-bold text-sm", isLockEnabled ? "text-emerald-600" : "text-red-600")}>
              {isLockEnabled ? "营销风控安全锁已开启" : "营销风控安全锁已关闭"}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsLockEnabled(!isLockEnabled)}>切换风控</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5 border-none shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-rose-400" />
                文案参数配置面板
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-slate-500 font-semibold">选中商品素材</Label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">XX酵母御龄紧致面霜</div>
              </div>
              <Button onClick={() => showSuccess("生成成功！")} className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold h-10 rounded-xl">
                <Sparkles className="w-4 h-4 mr-2" />
                开始智能生成
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7 border-none shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">AI 生成文案对比区</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/40 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs">版本 A：专业科学种草</span>
                  <Badge className="bg-green-100 text-green-700 border-none text-[10px]">得分 95</Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-mono">
                  【敏感肌换季救星】XX修护舒缓多肽精华液真的绝了！里面添加了核心的多肽修护成分，能够快速建立皮肤屏障。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContentFactory;