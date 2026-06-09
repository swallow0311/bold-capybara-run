import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Upload, Image as ImageIcon, Sliders, RefreshCw, 
  Download, ArrowLeftRight, Maximize2, Sparkles, 
  Wand2, Scissors, Paintbrush, Tags,
  Search, ZoomIn, Send
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

// Import tuning tools
import BackgroundTool from '@/components/image-design/BackgroundTool';
import TextTool from '@/components/image-design/TextTool';
import StickerTool from '@/components/image-design/StickerTool';
import RepairTool from '@/components/image-design/RepairTool';
import CropTool from '@/components/image-design/CropTool';

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  
  // Image comparison mock urls
  const [originalImg] = useState('https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&auto=format&fit=crop&q=60');
  const [generatedImg] = useState('https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&auto=format&fit=crop&q=60');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showSuccess("AI 视觉创意海报生成成功！");
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-left">
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Area (5 cols) - Inputs, templates & configs */}
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

          {/* Right Area (7 cols) - Visual View & Tuning tools */}
          <div className="xl:col-span-7 space-y-6">
            
            {/* Visual View (Split View or Single View when tuning) */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  {activeTool ? (
                    <>
                      <Wand2 className="w-4 h-4 text-rose-400" />
                      AI 智能微调画布
                    </>
                  ) : (
                    <>
                      <ArrowLeftRight className="w-4 h-4 text-rose-400" />
                      效果智能比照预览
                    </>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("h-7 text-xs", isZoomed ? "text-rose-500 bg-rose-50" : "text-slate-500")}
                    onClick={() => setIsZoomed(!isZoomed)}
                  >
                    <ZoomIn className="w-3.5 h-3.5 mr-1" /> 细节放大
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className={cn(
                  "grid gap-6",
                  activeTool ? "grid-cols-1 max-w-2xl mx-auto" : "grid-cols-1 md:grid-cols-2"
                )}>
                  {/* Left - Original (Hidden when tuning) */}
                  {!activeTool && (
                    <div className="space-y-2 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">上传商品原图</span>
                      <div 
                        className={cn(
                          "aspect-square relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center cursor-pointer group",
                          isZoomed && "overflow-auto"
                        )}
                        onClick={() => setPreviewImg(originalImg)}
                      >
                        <img 
                          src={originalImg} 
                          alt="Original product" 
                          className={cn(
                            "max-h-full max-w-full object-contain transition-transform duration-300",
                            isZoomed ? "scale-[2] origin-center" : "group-hover:scale-105"
                          )} 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                          <Search className="text-white opacity-0 group-hover:opacity-100 w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Right - Generated (Always shown, centered when tuning) */}
                  <div className="space-y-2 text-center">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                      {activeTool ? "AI 实时微调预览" : "AI 效果融合图"}
                    </span>
                    <div className="space-y-4">
                      <div 
                        className={cn(
                          "aspect-square relative rounded-xl overflow-hidden border border-rose-100 bg-slate-50 flex items-center justify-center cursor-pointer group",
                          isZoomed && "overflow-auto"
                        )}
                        onClick={() => setPreviewImg(generatedImg)}
                      >
                        <img 
                          src={generatedImg} 
                          alt="Generated design" 
                          className={cn(
                            "max-h-full max-w-full object-contain transition-transform duration-300",
                            isZoomed ? "scale-[2] origin-center" : "group-hover:scale-105"
                          )} 
                        />
                        {showMarketingTag && (
                          <div className="absolute top-4 left-4 bg-rose-500 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow-md uppercase tracking-wider animate-bounce">
                            热销推荐 · 限量抢
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                          <Search className="text-white opacity-0 group-hover:opacity-100 w-6 h-6" />
                        </div>
                      </div>

                      {/* Action Buttons under Generated Image */}
                      <div className="flex gap-2 justify-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-[10px] h-8 border-slate-200 text-slate-600 hover:bg-slate-50"
                          onClick={handleGenerate}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" /> 重新生成
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-[10px] h-8 border-rose-200 text-rose-600 hover:bg-rose-50"
                          onClick={() => showSuccess("正在准备高清下载包...")}
                        >
                          <Download className="w-3 h-3 mr-1" /> 下载
                        </Button>
                        <Button 
                          size="sm" 
                          className="text-[10px] h-8 bg-rose-400 hover:bg-rose-500 text-white font-bold"
                          onClick={() => showSuccess("已成功推送到中达官方直营网店！")}
                        >
                          <Send className="w-3 h-3 mr-1" /> 一键上架发布
                        </Button>
                      </div>
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
              <CardContent className="p-5">
                {!activeTool ? (
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="outline" size="sm" className="text-xs border-slate-200 group" onClick={() => setActiveTool('background')}>
                      <ImageIcon className="w-3.5 h-3.5 mr-1 text-rose-500 group-hover:scale-110 transition-transform" />
                      AI 智能换背景
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs border-slate-200 group" onClick={() => setActiveTool('text')}>
                      <Tags className="w-3.5 h-3.5 mr-1 text-amber-500 group-hover:scale-110 transition-transform" />
                      智能添加文案
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs border-slate-200 group" onClick={() => setActiveTool('sticker')}>
                      <Wand2 className="w-3.5 h-3.5 mr-1 text-emerald-500 group-hover:scale-110 transition-transform" />
                      添加促销角标贴纸
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs border-slate-200 group" onClick={() => setActiveTool('repair')}>
                      <Paintbrush className="w-3.5 h-3.5 mr-1 text-indigo-500 group-hover:scale-110 transition-transform" />
                      AI 局部修补
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs border-slate-200 group" onClick={() => setActiveTool('crop')}>
                      <Scissors className="w-3.5 h-3.5 mr-1 text-slate-500 group-hover:scale-110 transition-transform" />
                      裁剪画布
                    </Button>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {activeTool === 'background' && <BackgroundTool onClose={() => setActiveTool(null)} />}
                    {activeTool === 'text' && <TextTool onClose={() => setActiveTool(null)} />}
                    {activeTool === 'sticker' && <StickerTool onClose={() => setActiveTool(null)} />}
                    {activeTool === 'repair' && <RepairTool onClose={() => setActiveTool(null)} />}
                    {activeTool === 'crop' && <CropTool onClose={() => setActiveTool(null)} />}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImg} onOpenChange={() => setPreviewImg(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img src={previewImg || ''} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
            <button 
              onClick={() => setPreviewImg(null)}
              className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ImageDesign;