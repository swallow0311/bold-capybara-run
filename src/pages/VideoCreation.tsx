import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { 
  Play, Pause, Upload, Sparkles, Scissors, Music, 
  Volume2, Download, RefreshCw, Layers, Sliders,
  Video, Eye, Film, AlertCircle
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const VideoCreation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('t1');
  const [audioVoice, setAudioVoice] = useState('v1');
  const [bgMusic, setBgMusic] = useState('m1');
  
  const [subtitleText, setSubtitleText] = useState(
    "【画面1】夏季肌肤出油暗沉不用怕！\n【画面2】中达多肽面霜，30%浓度酵母精粹深入肌底\n【画面3】28天实测面部细纹明显减淡，水润发光"
  );

  const startRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          showSuccess("AI 视频渲染成功！");
          return 100;
        }
        return prev + 25;
      });
    }, 500);
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      showSuccess("正在拉取预览...");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left">
        
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI 短视频智能剪辑引擎</h1>
            <p className="text-xs text-slate-500">静态素材一键生成电商短视频，无需剪辑基础。</p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-xs py-1 px-3">
            版权安全：无侵权风险
          </Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          <div className="xl:col-span-5 space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Upload className="w-4 h-4 text-rose-400" />
                  导入商品素材
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="border-2 border-dashed border-slate-200 hover:border-rose-300 rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-50/50">
                  <Film className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                  <p className="text-xs font-bold text-slate-700">点击或拖拽上传主图/视频</p>
                </div>

                <div className="flex gap-2.5 overflow-x-auto py-1">
                  {[
                    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&auto=format&fit=crop&q=60'
                  ].map((img, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-rose-400" />
                  视频场景与声音配置
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-slate-500 font-semibold">视频时长模板</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="bg-slate-50/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t1">15s 主图视频</SelectItem>
                        <SelectItem value="t2">30s 种草短视频</SelectItem>
                        <SelectItem value="t3">60s 大促宣传片</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-slate-500 font-semibold">视频画幅尺寸</Label>
                    <Select defaultValue="vertical">
                      <SelectTrigger className="bg-slate-50/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vertical">竖屏 9:16</SelectItem>
                        <SelectItem value="square">方屏 1:1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-slate-500 font-semibold">AI 配音音色</Label>
                    <Select value={audioVoice} onValueChange={setAudioVoice}>
                      <SelectTrigger className="bg-slate-50/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">甜美女孩</SelectItem>
                        <SelectItem value="v2">激情主播</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-slate-500 font-semibold">背景音乐</Label>
                    <Select value={bgMusic} onValueChange={setBgMusic}>
                      <SelectTrigger className="bg-slate-50/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m1">热烈夏日</SelectItem>
                        <SelectItem value="m2">轻奢电子</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-700">智能卡点动效</span>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-400" />
                  AI 智能脚本
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <textarea 
                  value={subtitleText}
                  onChange={(e) => setSubtitleText(e.target.value)}
                  className="w-full text-xs text-slate-600 bg-slate-50/50 rounded-xl p-3 border border-slate-200 h-24 resize-none leading-relaxed" 
                />
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-7 space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-rose-400" />
                  实时预览
                </CardTitle>
                {isRendering && (
                  <span className="text-xs text-rose-500 font-bold animate-pulse">
                    渲染中... {renderProgress}%
                  </span>
                )}
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden flex flex-col justify-between p-4">
                  <div className="absolute inset-0 flex items-center justify-center opacity-70">
                    <img 
                      src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=60" 
                      className="w-full h-full object-contain" 
                      alt="preview" 
                    />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button 
                      onClick={handlePlayToggle}
                      className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-4 shadow-lg"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                  </div>

                  {isRendering && (
                    <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center p-6 space-y-4">
                      <div className="space-y-1 text-center w-full max-w-xs">
                        <span className="text-xs font-bold text-white block">渲染中...</span>
                        <Progress value={renderProgress} className="h-1.5 bg-slate-700" />
                      </div>
                    </div>
                  )}

                  <div className="w-full text-center bg-black/55 backdrop-blur-sm py-2 rounded-lg z-10">
                    <span className="text-[11px] text-white font-bold">
                      {isPlaying ? "✨ 28天实测面部细纹明显减淡 ✨" : "中达修护面霜，一抹抗老紧致"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-rose-400" />
                  精细化微调
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 flex flex-wrap gap-4 items-center">
                <Button variant="outline" size="sm" className="text-xs border-slate-200">字幕样式</Button>
                <Button variant="outline" size="sm" className="text-xs border-slate-200">音量平衡</Button>
                <Button variant="outline" size="sm" className="text-xs border-slate-200">动态贴纸</Button>
                <Button variant="outline" size="sm" className="text-xs border-slate-200">高清修复</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-white/95 backdrop-blur-md border-t border-rose-200 shadow-2xl p-4 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-slate-800">合规检测通过</span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="text-xs" onClick={startRender}>重新渲染</Button>
          <Button variant="outline" size="sm" className="text-xs border-rose-200 text-rose-600">导出视频</Button>
          <Button size="sm" className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl text-xs font-bold px-4">一键上架</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoCreation;