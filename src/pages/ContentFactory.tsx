import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Save, Download, History, Sparkles } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const ContentFactory = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResults([
        { id: 1, title: '版本 A：专业测评风', content: '【深度测评】这款玻色因面霜真的绝了！质地像冰淇淋一样丝滑，上脸秒吸收。坚持用了28天，细纹真的有变淡，皮肤透亮了一个度...' },
        { id: 2, title: '版本 B：情绪种草风', content: '熬夜党的救星来了✨！谁懂啊，每天对着电脑脸又黄又垮，直到遇到了它。不仅修护力在线，肤感更是没话说，姐妹们闭眼入！' },
      ]);
      setIsGenerating(false);
      showSuccess('AI 文案生成成功！');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
        {/* Input Area */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">基础信息录入</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>关联产品</Label>
                <Input placeholder="输入产品名称..." defaultValue="玻色因紧致面霜" />
              </div>
              <div className="space-y-2">
                <Label>核心卖点</Label>
                <Textarea placeholder="如：30%高浓度、抗老、修护..." className="h-24" />
              </div>
              <div className="space-y-2">
                <Label>目标人群</Label>
                <Select defaultValue="25-35">
                  <SelectTrigger>
                    <SelectValue placeholder="选择人群" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">18-25岁 学生/职场新人</SelectItem>
                    <SelectItem value="25-35">25-35岁 资深白领</SelectItem>
                    <SelectItem value="35+">35岁+ 精致妈妈</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">内容配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>内容类型</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['短视频脚本', '直播口播稿', '详情页文案', '小红书种草'].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={type} />
                      <label htmlFor={type} className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>文案风格</Label>
                <Select defaultValue="pro">
                  <SelectTrigger>
                    <SelectValue placeholder="选择风格" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pro">专业严谨</SelectItem>
                    <SelectItem value="emo">感性种草</SelectItem>
                    <SelectItem value="funny">幽默风趣</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full bg-rose-400 hover:bg-rose-500 text-white mt-4" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                一键生成多版文案
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Result Area */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">生成结果</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> 批量导出</Button>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {results.map(res => (
                <Card key={res.id} className="border-none shadow-sm hover:ring-1 ring-rose-100 transition-all">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-rose-500">{res.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-rose-500"><Copy className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-rose-500"><RefreshCw className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-rose-500"><Save className="w-4 h-4" /></Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {res.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-[400px] bg-white rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
              <Sparkles className="w-12 h-12 mb-4 opacity-20 text-rose-300" />
              <p>配置左侧信息并点击生成按钮</p>
            </div>
          )}
        </div>

        {/* History Area */}
        <div className="xl:col-span-1">
          <Card className="border-none shadow-sm h-full">
            <CardHeader className="flex flex-row items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              <CardTitle className="text-lg">历史记录</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { title: '防晒喷雾脚本', time: '10分钟前', type: '视频' },
                  { title: '积雪草精华文案', time: '1小时前', type: '种草' },
                  { title: '口红直播话术', time: '昨天', type: '直播' },
                ].map((item, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-slate-700">{item.title}</span>
                      <Badge variant="outline" className="text-[10px] text-rose-500 border-rose-100 bg-rose-50/30">{item.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{item.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContentFactory;