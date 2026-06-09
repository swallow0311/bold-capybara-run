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
  Video, Eye, Film, AlertCircle, Type, Send
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

// Import custom micro-tools
import SubtitleTool from '@/components/video-creation/SubtitleTool';
import VolumeTool from '@/components/video-creation/VolumeTool';
import StickerTool from '@/components/video-creation/StickerTool';
import HdRepairTool from '@/components/video-creation/HdRepairTool';

const VideoCreation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('t1');
  const [audioVoice, setAudioVoice] = useState('v1');
  const [bgMusic, setBgMusic] = useState('m1');
  
  // Interactive tools states
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // Subtitle custom state
  const [subtitleConfig, setSubtitleConfig] = useState({
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'sans',
    stroke: true,
    avoidSubject: true
  });

  // Volume balance state
  const [volumeConfig, setVolumeConfig] = useState({
    bgm: 30,
    voice: 80,
    original: 50,
    denoise: true
  });

  // Sticker configuration
  const [stickerConfig, setStickerConfig] = useState({
    activeSticker: null as string | null,
    snapToEdge: true
  });

  // HD Repair config
  const [repairConfig, setRepairConfig] = useState({
    mode: 'hd',
    denoise: true,
    sharpen: true
  });

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
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-left animate-in fade-in duration-300">
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel */}
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

          {/* Right Panel */}
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
                <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                  {/* Underlay product image representing the active video frame */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-85">
                    <img 
                      src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=60" 
                      className="w-full h-full object-contain" 
                      alt="preview" 
                    />
                  </div>

                  {/* Top-Right Badges representing Active Tuning states */}
                  <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5 items-end">
                    {repairConfig.mode === '4k' && (
                      <Badge className="bg-emerald-500/90 text-white text-[9px] font-bold border-none uppercase shadow-sm">
                        Ultra 4K
                      </Badge>
                    )}
                    {volumeConfig.denoise && (
                      <Badge className="bg-indigo-600/90 text-white text-[9px] font-bold border-none shadow-sm">
                        AI 降噪开启
                      </Badge>
                    )}
                  </div>

                  {/* Dynamic Corner Sticker representation */}
                  {stickerConfig.activeSticker && (
                    <div className={cn(
                      "absolute z-30 p-2 shadow-lg rounded-lg text-[10px] font-bold text-white tracking-wider animate-bounce",
                      stickerConfig.snapToEdge ? "top-3 left-3" : "top-1/3 left-1/3",
                      stickerConfig.activeSticker === 'v-s1' && 'bg-red-500',
                      stickerConfig.activeSticker === 'v-s2' && 'bg-rose-500',
                      stickerConfig.activeSticker === 'v-s3' && 'bg-slate-800',
                      stickerConfig.activeSticker === 'v-s4' && 'bg-amber-500',
                    )}>
                      {stickerConfig.activeSticker === 'v-s1' && '🔥 限时秒杀'}
                      {stickerConfig.activeSticker === 'v-s2' && '✨ 爆款首发'}
                      {stickerConfig.activeSticker === 'v-s3' && '📦 全场包邮'}
                      {stickerConfig.activeSticker === 'v-s4' && '💰 满减优惠'}
                    </div>
                  )}

                  {/* Centered Play Trigger */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button 
                      onClick={handlePlayToggle}
                      className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                  </div>

                  {/* HD Render block */}
                  {isRendering && (
                    <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center p-6 space-y-4">
                      <div className="space-y-1 text-center w-full max-w-xs">
                        <span className="text-xs font-bold text-white block">渲染中...</span>
                        <Progress value={renderProgress} className="h-1.5 bg-slate-700" />
                      </div>
                    </div>
                  )}

                  {/* Live Rendered Subtitle Box */}
                  <div 
                    className="w-full text-center bg-black/65 backdrop-blur-sm py-2 px-4 rounded-lg z-10 transition-all"
                    style={{
                      marginTop: 'auto',
                      border: subtitleConfig.stroke ? '1px solid rgba(255,255,255,0.15)' : 'none'
                    }}
                  >
                    <span 
                      className="text-xs font-bold tracking-wide transition-all duration-200"
                      style={{
                        color: subtitleConfig.color,
                        fontSize: `${subtitleConfig.fontSize}px`,
                        textShadow: subtitleConfig.stroke ? '1px 1px 2px #000' : 'none',
                        fontFamily: subtitleConfig.fontFamily === 'mono' ? 'monospace' : 'sans-serif'
                      }}
                    >
                      {isPlaying ? "✨ 28天实测面部细纹明显减淡 ✨" : "中达修护面霜，一抹抗老紧致"}
                    </span>
                  </div>
                </div>

                {/* Sub-Player Ecommerce Action buttons */}
                <div className="flex gap-2.5 justify-center pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-9 border-slate-200"
                    onClick={startRender}
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    重新渲染
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-9 border-rose-200 text-rose-600 hover:bg-rose-50"
                    onClick={() => showSuccess("视频高码率导出任务创建成功，开始下载。")}
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    导出视频
                  </Button>
                  <Button 
                    size="sm" 
                    className="text-xs h-9 bg-rose-400 hover:bg-rose-500 text-white font-bold"
                    onClick={() => showSuccess("视频已自动适配规格，上架到商品主图视频槽。")}
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    一键上架
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Smart Micro-tuning Tool bar */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-rose-400" />
                  精细化微调工具
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {!activeTool ? (
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-slate-200 group" 
                      onClick={() => setActiveTool('subtitle')}
                    >
                      <Type className="w-3.5 h-3.5 mr-1.5 text-rose-500 group-hover:scale-110 transition-transform" />
                      字幕样式
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-slate-200 group" 
                      onClick={() => setActiveTool('volume')}
                    >
                      <Volume2 className="w-3.5 h-3.5 mr-1.5 text-amber-500 group-hover:scale-110 transition-transform" />
                      音量平衡
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-slate-200 group" 
                      onClick={() => setActiveTool('sticker')}
                    >
                      <Layers className="w-3.5 h-3.5 mr-1.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                      动态贴纸
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-slate-200 group" 
                      onClick={() => setActiveTool('repair')}
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                      高清修复
                    </Button>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {activeTool === 'subtitle' && (
                      <SubtitleTool 
                        onClose={() => setActiveTool(null)} 
                        subtitleConfig={subtitleConfig}
                        setSubtitleConfig={setSubtitleConfig}
                      />
                    )}
                    {activeTool === 'volume' && (
                      <VolumeTool 
                        onClose={() => setActiveTool(null)} 
                        volumeConfig={volumeConfig}
                        setVolumeConfig={setVolumeConfig}
                      />
                    )}
                    {activeTool === 'sticker' && (
                      <StickerTool 
                        onClose={() => setActiveTool(null)} 
                        stickerConfig={stickerConfig}
                        setStickerConfig={setStickerConfig}
                      />
                    )}
                    {activeTool === 'repair' && (
                      <HdRepairTool 
                        onClose={() => setActiveTool(null)} 
                        repairConfig={repairConfig}
                        setRepairConfig={setRepairConfig}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoCreation;