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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Copy, RefreshCw, Save, Download, History, Sparkles, 
  Video, FileText, MessageSquare, Share2, Wand2, 
  CheckCircle2, AlertCircle, Trash2, ChevronRight
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const ContentFactory = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [activePlatform, setActivePlatform] = useState('xhs');

  const handleGenerate = () => {
    setIsGenerating(true);
    // 模拟 AI 生成过程
    setTimeout(() => {
      setResults([
        { 
          id: 1, 
          title: '版本 A：深度测评风', 
          platform: 'xhs',
          tags: ['专业', '干货'],
          content: '【深度测评】这款玻色因面霜真的绝了！质地像冰淇淋一样丝滑，上脸秒吸收。坚持用了28天，细纹真的有变淡，皮肤透亮了一个度。对比了市面上几款同价位产品，它的渗透技术确实更胜一筹...',
          score: 92
        },
        { 
          id: 2, 
          title: '版本 B：情绪种草风', 
          platform: 'xhs',
          tags: ['感性', '爆款'],
          content: '熬夜党的救星来了✨！谁懂啊，每天对着电脑脸又黄又垮，直到遇到了它。不仅修护力在线，肤感更是没话说，姐妹们闭眼入！真的后悔没早点发现这个宝藏面霜，现在皮肤状态稳得一批！',
          score: 88
        },
        { 
          id: 3, 
          title: '版本 C：短视频脚本', 
          platform: 'dy',
          tags: ['快节奏', '反转'],
          content: '【画面：女主对着镜子叹气，特写暗沉皮肤】\n旁白：熬最深的夜，用最贵的眼霜？别交智商税了！\n【画面：拿出中达面霜，展示质地】\n旁白：试试这个“熬夜橡皮擦”，30%高浓度玻色因，直接给皮肤灌满胶原蛋白！',
          score: 95
        },
      ]);
      setIsGenerating(false);
      showSuccess('AI 文案生成成功！');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
        
        {/* Left: Input Configuration (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-base flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-rose-400" />
                内容创作引擎配置
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Product Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">关联产品知识库</Label>
                <Select defaultValue="p1">
                  <SelectTrigger className="bg-slate-50/50">
                    <SelectValue placeholder="选择产品" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">中达酵母御龄紧致面霜</SelectItem>
                    <SelectItem value="p2">修护舒缓多肽精华液</SelectItem>
                    <SelectItem value="p3">清爽控油防晒喷雾</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-400">已自动同步该产品的核心成分、功效及用户痛点数据</p>
              </div>

              {/* Selling Points */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">本次主打卖点 (AI 将重点突出)</Label>
                <Textarea 
                  placeholder="如：30%高浓度玻色因、28天淡纹、冰淇淋质地..." 
                  className="h-20 text-sm bg-slate-50/50 resize-none" 
                />
              </div>

              {/* Keywords Constraints */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">必须包含词</Label>
                  <Input placeholder="如：抗老、修护" className="text-xs bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 text-rose-500">严禁出现词</Label>
                  <Input placeholder="如：第一、最强" className="text-xs bg-slate-50/50" />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-slate-500">内容长度控制</Label>
                    <span className="text-[10px] text-rose-500 font-bold">约 300 字</span>
                  </div>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">文案语气风格</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['专业严谨', '感性种草', '幽默风趣', '犀利毒舌', '亲切邻家', '高端奢华'].map(style => (
                      <Button key={style} variant="outline" className="h-8 text-[10px] px-2 hover:border-rose-200 hover:bg-rose-50">
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-rose-400 hover:bg-rose-500 text-white h-11 shadow-lg shadow-rose-100" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isGenerating ? 'AI 正在深度构思中...' : '一键生成多平台文案'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Middle: Generation Results (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          <Tabs defaultValue="xhs" className="w-full" onValueChange={setActivePlatform}>
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-slate-100/50 p-1">
                <TabsTrigger value="xhs" className="text-xs gap-1.5">
                  <Share2 className="w-3 h-3" /> 小红书
                </TabsTrigger>
                <TabsTrigger value="dy" className="text-xs gap-1.5">
                  <Video className="w-3 h-3" /> 抖音脚本
                </TabsTrigger>
                <TabsTrigger value="live" className="text-xs gap-1.5">
                  <MessageSquare className="w-3 h-3" /> 直播话术
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                  <Download className="w-3.5 h-3.5 mr-1" /> 批量导出
                </Button>
              </div>
            </div>

            <TabsContent value={activePlatform} className="mt-0 space-y-4">
              {results.filter(r => r.platform === activePlatform).length > 0 ? (
                results.filter(r => r.platform === activePlatform).map((res, idx) => (
                  <Card key={res.id} className="border-none shadow-sm group hover:ring-1 ring-rose-200 transition-all">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-rose-400 text-white border-none text-[10px]">
                          {res.title}
                        </Badge>
                        <div className="flex gap-1">
                          {res.tags.map((t: string) => (
                            <span key={t} className="text-[9px] text-slate-400">#{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                          <CheckCircle2 className="w-3 h-3" />
                          AI 评分: {res.score}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-500"><Copy className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-500"><RefreshCw className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-500"><Save className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Textarea 
                        defaultValue={res.content}
                        className="text-sm text-slate-600 leading-relaxed min-h-[120px] border-none focus-visible:ring-0 p-0 bg-transparent resize-none"
                      />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="h-[500px] bg-white rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-rose-300" />
                  </div>
                  <p className="text-sm font-medium">暂无生成内容</p>
                  <p className="text-xs mt-1">请在左侧配置参数并点击“一键生成”</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: History & Assets (3 cols) */}
        <div className="xl:col-span-3 space-y-6">
          <Card className="border-none shadow-sm h-full">
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                创作历史与草稿箱
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {[
                  { title: '防晒喷雾脚本', time: '10分钟前', type: '视频', status: '已导出' },
                  { title: '积雪草精华文案', time: '1小时前', type: '种草', status: '草稿' },
                  { title: '口红直播话术', time: '昨天', type: '直播', status: '已同步' },
                  { title: '面霜测评长文', time: '2天前', type: '图文', status: '已导出' },
                ].map((item, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-700 group-hover:text-rose-500 transition-colors">{item.title}</span>
                      <Badge variant="outline" className="text-[9px] text-rose-500 border-rose-100 bg-rose-50/30">{item.type}</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.time}
                      </span>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded",
                        item.status === '草稿' ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
                      )}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full text-xs text-slate-400 h-10 hover:text-rose-500">
                查看全部历史记录 <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Compliance Tip */}
          <Card className="border-none shadow-sm bg-amber-50/50 border border-amber-100">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-800">合规性提醒</p>
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  当前文案已通过“新广告法”初步扫描，未发现绝对化用词。建议在发布前进行人工二次审核。
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