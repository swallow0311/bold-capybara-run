import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Cpu, Sparkles, ShieldCheck, Settings,
  RotateCcw, BarChart3, Database, Zap, 
  Search, PenTool, ShieldAlert, Info,
  Layers, Sliders, Filter, Clock, Activity,
  FileText, Image as ImageIcon, Video as VideoIcon,
  FileSpreadsheet, Globe
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const ModelConfig = () => {
  const [activeTab, setActiveTab] = useState('selection');

  const handleSave = () => {
    showSuccess("全局大模型参数与算力分拨成功写入云数据库，即时生效。");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-800 text-xs text-left">
        
        {/* 头部标题 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">算法模型与算力配置中心</h1>
            <p className="text-slate-500 text-xs mt-0.5">调控全中台预测、语义提取、AIGC内容生产底座版本与合规风控红线</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => showSuccess("已重置为系统出厂默认标准底座配置。")} className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-9">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              恢复出厂默认
            </Button>
            <Button onClick={handleSave} className="bg-rose-400 hover:bg-rose-500 text-white text-xs h-9">
              保存配置
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 左侧核心配置区 (8 cols) */}
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-white border border-slate-200 p-1 h-11 w-full justify-start shadow-sm rounded-xl">
                <TabsTrigger value="selection" className="flex-1 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
                  <Search className="w-3.5 h-3.5" /> AI 选品
                </TabsTrigger>
                <TabsTrigger value="nlp" className="flex-1 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
                  <BarChart3 className="w-3.5 h-3.5" /> 评价 NLP 分析
                </TabsTrigger>
                <TabsTrigger value="aigc" className="flex-1 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
                  <PenTool className="w-3.5 h-3.5" /> AIGC 内容工厂
                </TabsTrigger>
              </TabsList>

              {/* 1. AI 选品模型配置 */}
              <TabsContent value="selection" className="space-y-6 animate-in fade-in duration-300">
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Layers className="w-4 h-4 text-rose-400" />
                      AI 选品模型组及版本控制
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <Label className="text-slate-500 font-semibold">模型版本选择</Label>
                        <Select defaultValue="v2">
                          <SelectTrigger className="bg-slate-50/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="v1">Selection-Engine v1.0 (稳定版)</SelectItem>
                            <SelectItem value="v2">Selection-Engine v2.2 (深度预测版)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-500 font-semibold">选品模型组构成</Label>
                        <div className="flex flex-wrap gap-2">
                          {['市场潜力预测模型', '竞品热度分析模型', '搜索词需求挖掘模型'].map(m => (
                            <Badge key={m} variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px]">{m}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <Label className="text-slate-700 font-bold flex items-center gap-2">
                        <Sliders className="w-3.5 h-3.5 text-rose-400" /> 商品潜力打分权重配置
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        {[
                          { label: '销量权重', val: 35 },
                          { label: '搜索热度权重', val: 25 },
                          { label: '好评率权重', val: 20 },
                          { label: '竞品竞争度权重', val: 10 },
                          { label: '差评风险权重', val: 10 }
                        ].map(w => (
                          <div key={w.label} className="space-y-2">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-600 font-medium">{w.label}</span>
                              <span className="text-rose-500 font-bold">{w.val}%</span>
                            </div>
                            <Slider defaultValue={[w.val]} max={100} step={1} className="accent-rose-400" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <Label className="text-slate-500 font-semibold">最低销量门槛</Label>
                        <Input type="number" defaultValue="100" className="h-9 text-xs bg-slate-50/50" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-500 font-semibold">最高竞争度阈值</Label>
                        <Input type="number" defaultValue="80" className="h-9 text-xs bg-slate-50/50" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-500 font-semibold text-rose-600">差评率风险红线</Label>
                        <Input type="text" defaultValue="15%" className="h-9 text-xs bg-rose-50/30 border-rose-100" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-3">
                        <Label className="text-slate-700 font-bold">输出规则配置</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[11px] text-slate-600">单次推荐商品 TOP 数量</span>
                            <Input type="number" defaultValue="50" className="w-20 h-7 text-xs bg-white" />
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[11px] text-slate-600">自动过滤违规/低质商品</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[11px] text-slate-600">同步开启 NLP 评价分析</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-slate-700 font-bold">调度配置</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[11px] text-slate-600">选品任务并发上限</span>
                            <Input type="number" defaultValue="5" className="w-20 h-7 text-xs bg-white" />
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[11px] text-slate-600">单任务处理时长上限 (s)</span>
                            <Input type="number" defaultValue="300" className="w-20 h-7 text-xs bg-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 2. 评价 NLP 分析模型配置 */}
              <TabsContent value="nlp" className="space-y-6 animate-in fade-in duration-300">
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Activity className="w-4 h-4 text-rose-400" />
                      NLP 语义分析引擎配置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <Label className="text-slate-500 font-semibold">模型版本与精度档位</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="v3">
                            <SelectTrigger className="bg-slate-50/50 flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="v3">NLP-BERT v3.0</SelectItem>
                              <SelectItem value="v2">NLP-BERT v2.5</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="deep">
                            <SelectTrigger className="bg-slate-50/50 w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fast">快速分析</SelectItem>
                              <SelectItem value="deep">深度精细</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-500 font-semibold">NLP 模型组构成</Label>
                        <div className="flex flex-wrap gap-2">
                          {['情感分类模型', '属性实体抽取模型', '卖点/痛点聚类模型', '差评归因模型'].map(m => (
                            <Badge key={m} variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px]">{m}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-3">
                        <Label className="text-slate-700 font-bold">文本清洗与过滤阈值</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[11px] text-slate-600">过滤字数少于 N 字短评</span>
                            <Input type="number" defaultValue="3" className="w-20 h-7 text-xs bg-white" />
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[11px] text-slate-600">水军过滤置信度阈值</span>
                            <Input type="text" defaultValue="0.85" className="w-20 h-7 text-xs bg-white" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-slate-700 font-bold">抽取维度开关</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['情感分类', '属性实体', '卖点聚类', '差评归因', '问答意图识别'].map(sw => (
                            <div key={sw} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-600">{sw}</span>
                              <Switch defaultChecked className="scale-75" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-3">
                        <Label className="text-slate-700 font-bold">输出参数与联动</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[11px] text-slate-600">单次提取卖点/痛点 TOP 条数</span>
                            <Input type="number" defaultValue="10" className="w-20 h-7 text-xs bg-white" />
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[11px] text-slate-600">词云生成尺寸 (px)</span>
                            <Input type="number" defaultValue="400" className="w-20 h-7 text-xs bg-white" />
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-rose-50/40 rounded-lg border border-rose-100">
                            <span className="text-[11px] text-rose-700 font-bold">分析结果自动推送至 AIGC</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 3. AIGC 内容工厂模型配置 */}
              <TabsContent value="aigc" className="space-y-6 animate-in fade-in duration-300">
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-rose-400" />
                      AIGC 生产引擎与合规阈值
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    {/* 文案/图片/视频 基础参数 */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label className="text-slate-700 font-bold flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> 文案生成参数</Label>
                        <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500">风格权重 (0-1)</span>
                            <Slider defaultValue={[0.7]} max={1} step={0.1} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500">营销话术强度</span>
                            <Select defaultValue="mid"><SelectTrigger className="h-7 text-[10px] bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">温和</SelectItem><SelectItem value="mid">标准</SelectItem><SelectItem value="high">激进</SelectItem></SelectContent></Select>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-slate-500">大促标签自动添加</span>
                            <Switch defaultChecked className="scale-75" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-slate-700 font-bold flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> 图片渲染参数</Label>
                        <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500">渲染风格强度</span>
                            <Slider defaultValue={[0.8]} max={1} step={0.1} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500">商品光影融合权重</span>
                            <Slider defaultValue={[0.9]} max={1} step={0.1} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500">默认分辨率档位</span>
                            <Select defaultValue="2k"><SelectTrigger className="h-7 text-[10px] bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1k">1024px</SelectItem><SelectItem value="2k">2048px</SelectItem></SelectContent></Select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-slate-700 font-bold flex items-center gap-1.5"><VideoIcon className="w-3.5 h-3.5" /> 视频创作参数</Label>
                        <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500">转场动效强度</span>
                            <Slider defaultValue={[0.5]} max={1} step={0.1} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500">BGM 音量平衡默认值</span>
                            <Slider defaultValue={[30]} max={100} step={1} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500">默认视频时长</span>
                            <Select defaultValue="15s"><SelectTrigger className="h-7 text-[10px] bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="15s">15s</SelectItem><SelectItem value="30s">30s</SelectItem></SelectContent></Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 微调工具默认强度 */}
                    <div className="space-y-3">
                      <Label className="text-slate-700 font-bold">微调工具模型全局默认参数 (强度预设)</Label>
                      <div className="grid grid-cols-5 gap-3">
                        {['AI 换背景', '局部修补', '智能裁剪', '动态贴纸', '高清修复'].map(tool => (
                          <div key={tool} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                            <span className="text-[10px] text-slate-600 font-bold block">{tool}</span>
                            <Slider defaultValue={[70]} max={100} step={1} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 合规质检阈值 */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-rose-700 font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> 合规质检模型统一阈值</Label>
                        <div className="space-y-2 p-4 bg-rose-50/30 rounded-xl border border-rose-100">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-600">极限词拦截等级</span>
                            <Select defaultValue="strict"><SelectTrigger className="h-7 w-24 text-[10px] bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="loose">宽松</SelectItem><SelectItem value="strict">严苛</SelectItem></SelectContent></Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-600">侵权画面识别敏感度</span>
                            <Slider defaultValue={[85]} max={100} step={1} className="w-24" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-600">高危内容强制拦截</span>
                            <Switch defaultChecked className="scale-75" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-600">AIGC 隐式水印注入</span>
                            <Switch defaultChecked className="scale-75" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-slate-700 font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 批量任务调度配置</Label>
                        <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-600">单批次最大 SKU 并发</span>
                            <Input type="number" defaultValue="20" className="w-20 h-7 text-xs bg-white" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-600">生成任务排队时长上限 (min)</span>
                            <Input type="number" defaultValue="10" className="w-20 h-7 text-xs bg-white" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-600">失败自动重跑次数</span>
                            <Select defaultValue="2"><SelectTrigger className="h-7 w-20 text-[10px] bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="0">0</SelectItem><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem></SelectContent></Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 右侧通用全局配置 (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Globe className="w-4 h-4 text-rose-400" />
                  通用全局模型配置 (共享)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                {/* 算力配额 */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> 算力配额管控</Label>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">单店铺每日 AI 调用上限</span>
                        <span className="font-bold">5000 次</span>
                      </div>
                      <Input type="number" defaultValue="5000" className="h-8 text-xs bg-white" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">图/视频高清算力额度 (月)</span>
                        <span className="font-bold">200 GB</span>
                      </div>
                      <Input type="number" defaultValue="200" className="h-8 text-xs bg-white" />
                    </div>
                  </div>
                </div>

                {/* 缓存策略 */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-blue-500" /> 缓存与复用策略</Label>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-600">重复任务复用缓存</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400">模型输出结果缓存时长 (h)</span>
                      <Input type="number" defaultValue="24" className="h-8 text-xs bg-white" />
                    </div>
                  </div>
                </div>

                {/* 日志留存 */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> 日志留存配置</Label>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="text-[10px] text-slate-400">模型输入输出样本保存时长 (天)</span>
                    <Select defaultValue="30">
                      <SelectTrigger className="h-8 text-xs bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 天</SelectItem>
                        <SelectItem value="30">30 天</SelectItem>
                        <SelectItem value="90">90 天</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 风控兜底 */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-rose-700 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> 风控兜底总开关</Label>
                  <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-rose-800">全模块强拦截模式</span>
                        <p className="text-[9px] text-rose-600/70">开启后，虚假宣传、敏感内容将无法输出</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-2">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    算力预警：当前月度算力额度已消耗 <strong>78%</strong>。当额度耗尽后，若未开启降级，AIGC 素材生成与视频渲染将在月底前自动挂起暂停。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModelConfig;