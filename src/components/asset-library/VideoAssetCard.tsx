import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, Play, Download, Scissors, Trash2, Heart, 
  Clock, Monitor, Music, MessageSquare, Edit3
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface VideoAssetCardProps {
  asset: any;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const VideoAssetCard = ({ asset, onDelete, onToggleFavorite }: VideoAssetCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-none shadow-sm bg-white group hover:ring-2 hover:ring-rose-100 transition-all overflow-hidden">
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        <img src={asset.cover} className="w-full h-full object-cover opacity-80" alt="" />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-rose-500 transition-all group-hover:scale-110 shadow-xl" onClick={() => showSuccess("正在拉取视频流播放...")}>
            <Play className="w-6 h-6 fill-current ml-1" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge className="bg-black/50 text-white border-none text-[9px] backdrop-blur-md">
            {asset.duration}
          </Badge>
          <Badge className="bg-black/50 text-white border-none text-[9px] backdrop-blur-md">
            {asset.config.resolution}
          </Badge>
        </div>
        <button 
          onClick={() => onToggleFavorite(asset.id)}
          className={cn("absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-colors", asset.status === '已收藏' ? "text-rose-500 bg-white" : "text-white bg-black/20 hover:bg-black/40")}
        >
          <Heart className={cn("w-3.5 h-3.5", asset.status === '已收藏' && "fill-current")} />
        </button>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-700 truncate">{asset.product || '通用素材'}</p>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="font-mono">{asset.time}</span>
            <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> {asset.config.style}</span>
          </div>
        </div>

        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
          <div className="flex items-center gap-2 text-[9px] text-slate-500">
            <MessageSquare className="w-3 h-3" />
            <span className="truncate">{asset.script}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px] border-slate-200" onClick={() => navigate('/video-creation')}>
            <Edit3 className="w-3 h-3 mr-1.5" /> 编辑
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-rose-500" onClick={() => showSuccess("视频文件下载中...")}>
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-rose-500" onClick={() => onDelete(asset.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoAssetCard;