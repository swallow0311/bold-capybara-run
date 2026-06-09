import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Upload, Image as ImageIcon, Sliders, RefreshCw, 
  Download, ArrowLeftRight, Grid, Maximize2, Sparkles, 
  Wand2, Scissors, Paintbrush, Tags, Save, CheckCircle
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const MOCK_TEMPLATES = [
  { id: 't1', name: '极简纯白主图', size: '800x800', tag: '主图首图' },
  { id: 't2', name: '夏日清凉微风', size: '800x1200', tag: '详情海报' },
  { id: 't3', name: '高端金箔抗老', size: '1080x1920', tag: '引流长图' },
  { id: 't4', name: '大促喜庆氛围', size: '800x800', tag: '直通车主图' }
];

const ImageDesign = () => {
  const [activeTemplate, setActiveTemplate] = useState('t1');
  const [resolution, setResolution] = useState('hd');
  const [showMarketingTag, setShowMarketingTag] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Image comparison mock urls
  const [originalImg, setOriginalImg] = useState('https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&auto=format&fit=crop&q=60');
  const [generatedImg, setGeneratedImg] = useState('https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&auto=format&fit=crop&q=60');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showSuccess("AI 视觉创意海报生成成功！");
    }, 1200);
  };

  const handleTune = (action: string) => {
    showSuccess(`正在调起AI微调工具：${action}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left">
        
        {/* Top Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI 智能图片设计空间</h1>
            <p className="text-xs text-slate-500">主图、海报、详情页、场景图智能创作，上传商品图片一键合成电商海报。</p>
          </div>
          <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-xs py-1 px-3">
            算力余额：1,240点
          </Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Area (4 cols) - Inputs, templates & configs */}
          <div className="xl:col-span-5 space-y-6">
            
            {/* Upload Area */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Upload className="w-4 h-4 text-rose-400" />
                  上传原图与素材导入
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="border-2 border-dashed border-slate-200 hover:border-rose-300 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50/50">
                  <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">拖拽单图/多图至此，或点击本地上传</p>
                  <p className="text-[10px] text-slate-400 mt-1">支持 PNG, JPG格式，建议透明背景产品图以获得最佳融合效果</p>
                </div>

                <div className="flex items-center gap-3 bg-rose-50/30 p-2.5 rounded-lg border border-rose-100/60">
                  <img src={originalImg} className="w-10 h-10 object-cover rounded" alt="original thumbnail" />
                  <div className="flex-1 text-[10px]">
                    <p className="font-bold text-slate-700">中达酵母面霜_主素材.png</p>
                    <p className="text-slate-400">尺寸: 1200 x 1200 | 已智能抠图</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[10px] text-rose-500">重试</Button>
                </div>
              </CardContent>
            </Card>

            {/* Template Selector */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-rose-400" />
                  选择电商专属视觉模板
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 gap-3">
                  {MOCK_TEMPLATES.map(t => (
                    <div 
                      key={t.id} 
                      onClick={() => setActiveTemplate(t.id)}
                      className={cn(
                        "p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1.5",
                        activeTemplate === t.id 
                          ? "bg-rose-50 border-rose-400 text-rose-700"
                          : "border-slate-100 bg-slate-50/30 text-slate-600 hover:border-slate-200"
                      )}
                    >
                      <span className="font-bold text-xs block truncate">{t.name}</span>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">{t.size}</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 border-rose-200 text-rose-600">
                          {t.tag}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Control parameters */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-rose-400" />
                  智能创意参数配置
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-slate-500 font-semibold">生成画质分辨率</Label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger className="bg-slate-50/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="std">标准画质 (1024x1024)</SelectItem>
                        <SelectItem value="hd">超清画质 (2048x2048)</SelectItem>
                        <SelectItem value="uhd">至尊真彩 4K 画质</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-slate-500 font-semibold">画幅纵横比</Label>
                    <Select defaultValue="square">
                      <SelectTrigger className="bg-slate-50/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">正方形 1:1 (主图)</SelectItem>
                        <SelectItem value="portrait">竖版海报 3:4</SelectItem>
                        <SelectItem value="story">移动流 9:16 (引流)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">色调及艺术偏好</Label>
                  <div className="flex gap-2">
                    {['温暖珊瑚', '夏日冰爽', '高奢金色', '莫兰迪粉'].map(tone => (
                      <span key={tone} className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-md cursor-pointer transition-colors text-[10px] font-bold text-slate-600">
                        {tone}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-slate-500 font-semibold">主打卖点文字 (融合至海报)</Label>
                  <Input defaultValue="敏感肌强屏障 · 28天显淡纹" className="bg-slate-50/50 text-xs" />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-700 block">添加促销氛围气球标签</span>
                    <span className="text-[10px] text-slate-400">自动在图角增加“限时爆款”、“抢购立减”字样</span>
                  </div>
                  <Switch checked={showMarketingTag} onCheckedChange={setShowMarketingTag} />
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold h-10 rounded-xl"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      渲染引擎加速渲染中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      开始渲染生成
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Area (8 cols) - Visual View & Tuning tools */}
          <div className="xl:col-span-7 space-y-6">
            
            {/* Visual View (Split View) */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-rose-400" />
                  效果智能比照预览
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500">
                    <Grid className="w-3.5 h-3.5 mr-1" /> 矩阵网格
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500">
                    <Maximize2 className="w-3.5 h-3.5 mr-1" /> 细节放大
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left - Original */}
                  <div className="space-y-2 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">上传商品原图</span>
                    <div className="aspect-square relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                      <img src={originalImg} alt="Original product" className="max-h-full max-w-full object-contain" />
                    </div>
                  </div>

                  {/* Right - Generated */}
                  <div className="space-y-2 text-center">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">AI 效果融合图</span>
                    <div className="aspect-square relative rounded-xl overflow-hidden border border-rose-100 bg-slate-50 flex items-center justify-center">
                      <img src={generatedImg} alt="Generated design" className="max-h-full max-w-full object-contain" />
                      {showMarketingTag && (
                        <div className="absolute top-4 left-4 bg-rose-500 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow-md uppercase tracking-wider animate-bounce">
                          热销推荐 · 限量抢
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Micro-tuning Tool bar */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-rose-400" />
                  智能微调修图工具栏
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 flex flex-wrap gap-4 items-center">
                <Button variant="outline" size="sm" className="text-xs border-slate-200" onClick={() => handleTune('背景替换')}>
                  <ImageIcon className="w-3.5 h-3.5 mr-1 text-rose-500" />
                  AI 智能换背景
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-slate-200" onClick={() => handleTune('文字编辑')}>
                  <Tags className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  智能添加文案
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-slate-200" onClick={() => handleTune('贴纸合成')}>
                  <Wand2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  添加促销角标贴纸
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-slate-200" onClick={() => handleTune('局部微调/画笔')}>
                  <Paintbrush className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                  AI 局部修补
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-slate-200" onClick={() => handleTune('裁剪比例')}>
                  <Scissors className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  裁剪画布
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-white/95 backdrop-blur-md border-t border-rose-200 shadow-2xl p-4 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="font-bold text-slate-800">渲染安全认证已通过</span>
          <span className="text-[10px] text-slate-400">所用无版权图片合规库，已规避商业字体与版权肖像侵权。</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="text-xs hover:bg-slate-50 text-slate-600" onClick={() => showSuccess("所有生成的素材已经录入草稿归档！")}>
            保存草稿
          </Button>
          <Button variant="outline" size="sm" className="text-xs border-slate-200 text-slate-600 hover:bg-slate-50" onClick={handleGenerate}>
            重新渲染生成
          </Button>
          <Button variant="outline" size="sm" className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => showSuccess("正在压缩打包下载，包含原图与高清成品包。")}>
            <Download className="w-3.5 h-3.5 mr-1" />
            超清高清下载
          </Button>
          <Button size="sm" className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl text-xs font-bold px-4" onClick={() => showSuccess("已成功推送到中达官方直营网店！")}>
            一键上架发布
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ImageDesign;