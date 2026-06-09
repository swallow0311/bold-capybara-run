import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { 
  Play, Pause, Upload, Sparkles, Scissors, Music, 
  Volume2, Download, RefreshCw, Layers, Sliders, CheckCircle2,
  Video, Eye, Film, AlertCircle
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

const VideoCreation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('t1');
  const [audioVoice, setAudioVoice] = useState('v1');
  const [bgMusic, setBgMusic] = useState('m1');
  const [videoQuality, setVideoQuality] = useState('1080p');
  
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
          showSuccess("AI 视频渲染成功！画质与音轨已完美同步。");
          return 100;
        }
        return prev + 25;
      });
    }, 500);
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      showSuccess("正在实时拉取流媒体进行预览...");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI 短视频智能剪辑引擎</h1>
            <p className="text-xs text-slate-500">静态素材一键生成电商主图视频与种草带货短视频，无需剪辑基础。</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-xs py-1 px-3">
              版权安全：无音乐侵权风险
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left panel (5 cols) - Assets & Templates & Voice */}
          <div className="xl:col-span-5 space-y-6">
            
            {/* Asset Import */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Upload className="w-4 h-4 text-rose-400" />
                  导入商品图像/主图资产
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="border-2 border-dashed border-slate-200 hover:border-rose-300 rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-50/50">
                  <Film className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                  <p className="text-xs font-bold text-slate-700">导入主图多张进行批量合成</p>
                  <p className="text-[10px] text-slate-400">支持直接拖拽排序画面帧</p>
                </div>

                <div className="flex gap-2.5 overflow-x-auto py-1">
                  {[
                    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&auto=format&fit=crop&q=60'
                  ].map((img, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0 group">
                      <img src={img} alt="scene thumb" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white font-bold text-[8px] px-1 rounded">
                        帧 {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scenario and Parameters */}
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
                        <SelectItem value="t1">15s 电商主图快速带货</SelectItem>
                        <SelectItem value="t2">30s 达人深度开箱种草</SelectItem>
                        <SelectItem value="t3">60s 狂欢季爆款宣传短片</SelectItem>
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
                        <SelectItem value="vertical">竖屏 9:16 (抖音/小红书)</SelectItem>
                        <SelectItem value="square">方屏 1:1 (天猫淘宝主图)</SelectItem>
                        <SelectItem value="horizontal">横屏 16:9 (PC大图展示)</SelectItem>
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
                        <SelectItem value="v1">甜美温柔女孩 (推荐)</SelectItem>
                        <SelectItem value="v2">富有激情直播间喊单麦</SelectItem>
                        <SelectItem value="v3">沉稳知性男声测评主播</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-slate-500 font-semibold">背景音乐库</Label>
                    <Select value={bgMusic} onValueChange={setBgMusic}>
                      <SelectTrigger className="bg-slate-50/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m1">热烈夏日律动 (日常带货)</SelectItem>
                        <SelectItem value="m2">轻奢风电子纯音乐</SelectItem>
                        <SelectItem value="m3">节奏律动短视频卡点鼓点</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-700 block">智能卡点动效与光斑特效</span>
                    <span className="text-[10px] text-slate-400">基于配乐节奏自动过渡转场</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Smart Script Settings */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-400" />
                  AI 智能脚本与分镜歌词
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <Label className="text-xs font-semibold text-slate-500">配音字幕文字 (支持手动二次精修)</Label>
                <textarea 
                  value={subtitleText}
                  onChange={(e) => setSubtitleText(e.target.value)}
                  className="w-full text-xs text-slate-600 bg-slate-50/50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-300 h-24 resize-none leading-relaxed" 
                />
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">输入字符已自动适配 15 秒配音速度限制</span>
                  <Badge variant="outline" className="border-rose-100 text-rose-600 bg-rose-50/20 text-[9px] font-bold">
                    已启用卡点对齐
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right panel (7 cols) - Player & Online trimmer */}
          <div className="xl:col-span-7 space-y-6">
            
            {/* Realtime Player View */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-rose-400" />
                  实时渲染播放视口
                </CardTitle>
                {isRendering && (
                  <span className="text-xs text-rose-500 font-bold animate-pulse">
                    生成中... {renderProgress}%
                  </span>
                )}
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                {/* Simulated video screen container */}
                <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                  {/* Top status header */}
                  <div className="flex justify-between items-center z-10">
                    <Badge className="bg-rose-500 text-white text-[9px] border-none">
                      渲染模式：双流高清
                    </Badge>
                    <span className="text-[10px] text-white/80 font-mono">00:00 / 00:15</span>
                  </div>

                  {/* Middle representation image */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-70">
                    <img 
                      src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=60" 
                      className="w-full h-full object-contain" 
                      alt="video preview" 
                    />
                  </div>

                  {/* Play trigger overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button 
                      onClick={handlePlayToggle}
                      className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-4 shadow-lg hover:scale-105 transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-white" />
                      ) : (
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Render progress overlay if rendering */}
                  {isRendering && (
                    <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center p-6 space-y-4">
                      <div className="space-y-1 text-center w-full max-w-xs">
                        <span className="text-xs font-bold text-white block">视频音轨渲染对齐中...</span>
                        <Progress value={renderProgress} className="h-1.5 bg-slate-700" />
                      </div>
                      <span className="text-[10px] text-white/50">预估剩余时间：5秒 | 输出分辨率：1080P</span>
                    </div>
                  )}

                  {/* Overlay subtitles */}
                  <div className="w-full text-center bg-black/55 backdrop-blur-sm py-2 rounded-lg z-10 border border-white/10">
                    <span className="text-[11px] text-white font-bold tracking-wide">
                      {isPlaying ? "✨ 28天实测面部细纹明显减淡，水润发光 ✨" : "中达修护面霜，一抹抗老紧致"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex gap-2.5">
                    <span className="font-bold text-slate-700">AI 视频质量评定</span>
                    <Badge className="bg-green-100 text-green-700 border-none font-bold text-[9px] hover:bg-green-100">
                      优质：92分 (电商适配极高)
                    </Badge>
                  </div>
                  <span className="text-[10px] text-slate-400">建议在首帧加入 35% 大字号折扣角标</span>
                </div>
              </CardContent>
            </Card>

            {/* Trimmer adjustments */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-rose-400" />
                  精细化微调与局部修剪
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 flex flex-wrap gap-4 items-center">
                <Button variant="outline" size="sm" className="text-xs border-slate-200" onClick={() => showSuccess("进入字幕微调：支持位置、字号、颜色配置")}>
                  <Wand2 className="w-3.5 h-3.5 mr-1 text-rose-500" />
                  字幕样式微调
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-slate-200" onClick={() => showSuccess("配音音色与背景音轨音量已按 80% : 20% 进行配平")}>
                  <Volume2 className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  配乐/音量平衡
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-slate-200" onClick={() => showSuccess("促销标签已成功叠加至第三帧画面")}>
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  叠加促销动态贴纸
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-slate-200" onClick={() => showSuccess("正在智能降噪，画质清晰度提升 15%")}>
                  <Film className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                  画质高清修复
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-white/95 backdrop-blur-md border-t border-rose-200 shadow-2xl p-4 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="font-bold text-slate-800">平台合规机制检测中</span>
          <span className="text-[10px] text-slate-400">检测到未含同行对比贬低内容，符合抖快淘带货视频审核规范。</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="text-xs hover:bg-slate-50 text-slate-600" onClick={() => showSuccess("视频草稿已入库")}>
            保存当前版本
          </Button>
          <Button variant="outline" size="sm" className="text-xs border-slate-200 text-slate-600 hover:bg-slate-50" onClick={startRender}>
            重新渲染渲染
          </Button>
          <Button variant="outline" size="sm" className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => showSuccess("高清 MP4 视频无水印下载成功！")}>
            <Download className="w-3.5 h-3.5 mr-1" />
            超清高清导出 (1080P)
          </Button>
          <Button size="sm" className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl text-xs font-bold px-4" onClick={() => showSuccess("主图视频上架推送成功，淘宝旗舰店已替换！")}>
            一键推送上架店铺
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoCreation;