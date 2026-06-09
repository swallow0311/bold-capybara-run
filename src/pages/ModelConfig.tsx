import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Cpu, Sparkles, AlertTriangle, ShieldCheck, Play, Info, Settings,
  RotateCcw, Copy, Download, RefreshCw, BarChart3, Database
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface ModelVersion {
  module: string;
  modelName: string;
  version: string;
  temperature: number;
  maxTokens: number;
  quota: string;
  status: 'active' | 'inactive';
}

const INITIAL_MODELS: ModelVersion[] = [
  { module: 'AI选品趋势预测', modelName: '中达美妆趋势判别大模型 v2.2', version: 'v2.2-finetuned', temperature: 0.2, maxTokens: 1024, quota: '35%', status: 'active' },
  { module: '评价NLP语义提炼', modelName: '中达化妆品评论专研NLP语义模型', version: 'nlp-bert-v3', temperature: 0.1, maxTokens: 512, quota: '25%', status: 'active' },
  { module: 'AIGC文案与素材合成', modelName: 'Claude 3.5 Sonnet (营销文案增强)', version: 'claude-3.5-sonnet', temperature: 0.7, maxTokens: 2048, quota: '40%', status: 'active' }
];

const ModelConfig = () => {
  const [modelConfigs, setModelConfigs] = useState<ModelVersion[]>(INITIAL_MODELS);
  const [testInput, setTestInput] = useState('酵母面霜，夏季，控油，抗衰老');
  const [testOutput, setTestOutput] = useState('');
  const [isRunningTest, setIsRunningTest] = useState(false);

  const handleRunSandboxTest = () => {
    if (!testInput.trim()) {
      showError("请输入测试引导词！");
      return;
    }
    setIsRunningTest(true);
    setTestOutput('');
    setTimeout(() => {
      setIsRunningTest(false);
      setTestOutput(
        "【AI 选品预测分值】：94分 (高转化趋势) \n" +
        "【NLP 语义卖点自动匹配】：控油、无敏、抗衰老、水润一整天 \n" +
        "【AIGC 文案产出】：夏季肌肤出油怕长痘？中达这瓶酵母御龄紧致面霜绝了！不仅能够深层锁水阻击初老，还能长效控油，大汗淋漓也毫无油腻感！"
      );
      showSuccess("沙箱样本测试成功！多模块联动映射校验通过。");
    }, 1500);
  };

  const handleSaveConfigs = () => {
    showSuccess("全局大模型参数与算力分拨成功写入云数据库，即时生效。");
  };

  const resetToDefault = () => {
    showSuccess("已一键重置为系统出厂默认标准底座配置。");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-800 text-xs text-left">
        
        {/* 模型配置头部 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">算法模型与算力配置中心</h1>
            <p className="text-slate-500 text-xs mt-0.5">调控全中台预测、语义提取、AIGC内容生产底座版本与合规风控红线</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefault} className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-9">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              恢复出厂默认
            </Button>
            <Button onClick={handleSaveConfigs} className="bg-rose-400 hover:bg-rose-500 text-white text-xs h-9">
              保存配置
            </Button>
          </div>
        </div>

        {/* 模型模块参数列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* 各功能模块大语言模型底座绑定 */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="py-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-rose-400" />
                  核心算法模块及大模型映射配置
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                {modelConfigs.map((config, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-xs">{config.module}</span>
                      <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-[9px] hover:bg-rose-100">
                        分配算力：{config.quota}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-slate-500 font-semibold">底座驱动模型</Label>
                        <select 
                          defaultValue={config.modelName}
                          className="w-full h-8 px-3 text-[11px] bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-300"
                        >
                          <option value={config.modelName}>{config.modelName}</option>
                          <option value="GPT-4o">GPT-4o (全局通用增强)</option>
                          <option value="DeepSeek-V3">DeepSeek-V3 (极低时延)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-slate-500 font-semibold">大模型版本 ID</Label>
                        <Input defaultValue={config.version} className="h-8 text-xs bg-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <Label className="text-slate-500 font-semibold">创造随机性 (Temperature)</Label>
                          <span className="text-rose-500 font-bold">{config.temperature}</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          defaultValue={config.temperature}
                          className="w-full accent-rose-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-slate-500 font-semibold">单次最大输出 tokens 限制</Label>
                        <Input type="number" defaultValue={config.maxTokens} className="h-8 text-xs bg-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 模型沙箱测试环境 */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="py-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  多模块联动沙箱样本测试
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">模拟输入产品特征引导词 (打通选品->NLP->AIGC)</Label>
                  <Input 
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="输入测试属性特征..." 
                    className="bg-slate-50/50 text-xs h-9"
                  />
                </div>
                
                <Button 
                  onClick={handleRunSandboxTest}
                  disabled={isRunningTest}
                  className="bg-rose-400 hover:bg-rose-500 text-white font-bold h-9 text-xs"
                >
                  {isRunningTest ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      大模型多步推理计算中...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 mr-1.5" />
                      运行联动效果测试
                    </>
                  )}
                </Button>

                {testOutput && (
                  <div className="space-y-1.5 pt-2">
                    <Label className="text-slate-400 font-semibold">联动沙箱模型输出预览</Label>
                    <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl border border-slate-950 font-mono text-[10px] leading-relaxed whitespace-pre-wrap">
                      {testOutput}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            
            {/* 算力消耗仪表盘 */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-700">当前商户算法并发限制与降级</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-700 block">自动高算力并发限流降级</span>
                    <span className="text-[10px] text-slate-400">大促遭遇算力拥堵时，自动切换至轻量大语言模型。</span>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-700 block">本地模型缓存命中</span>
                    <span className="text-[10px] text-slate-400">对相同商品特征的文案及预测结果开启 24h 缓存，避免重复算力计费。</span>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-700 block">合规风控全链路校验</span>
                    <span className="text-[10px] text-slate-400">强力约束选品、NLP与AIGC，任何违禁词将在生成完毕后立刻阻断拦截。</span>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start gap-2 text-amber-800 leading-normal">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px]">
                    算力预警：当前月度算力额度已消耗 <strong>78%</strong>。当额度耗尽后，若未开启降级，AIGC 素材生成与视频渲染将在月底前自动挂起暂停。
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 模型重试与缓存时间设置 */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-700">算法失败容灾策略</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <Label className="text-slate-500 font-semibold">请求超时降级阈值 (秒)</Label>
                  <Input type="number" defaultValue="30" className="h-8 text-xs bg-slate-50/50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-500 font-semibold">接口失败自动重试次数</Label>
                  <Input type="number" defaultValue="2" className="h-8 text-xs bg-slate-50/50" />
                </div>
                <Button onClick={() => showSuccess("模型容灾策略配置更新保存。")} className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold h-9 mt-2">
                  确认容灾策略
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default ModelConfig;