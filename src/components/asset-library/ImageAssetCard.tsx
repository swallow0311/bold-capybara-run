import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ImageIcon, Download, RefreshCw, Trash2, Heart, 
  Maximize2, Zap, Clock, Layers
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface ImageAssetCardProps {
  asset: any;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const ImageAssetCard = ({ asset, onDelete, onToggleFavorite }: ImageAssetCardProps) => {
  return (
    <Card className="border-none shadow-sm bg-white group hover:ring-2 hover:ring-rose-100 transition-all overflow-hidden">
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        <img src={asset.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => showSuccess("查看高清原图")}>
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => showSuccess("开始 AI 重绘二次创作")}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <Badge className="absolute top-3 left-3 bg-black/50 text-white border-none text-[9px] backdrop-blur-md">
          {asset.config.size}
        </Badge>
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
            <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {asset.config.style}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px] border-slate-200" onClick={() => showSuccess("Prompt 已复制，可直接复用")}>
            复用 Prompt
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200 text-slate-400 hover:text-rose-500" onClick={() => showSuccess("高清素材下载中...")}>
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

export default ImageAssetCard;