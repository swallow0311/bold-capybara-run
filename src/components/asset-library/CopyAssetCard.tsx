import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Copy, Edit3, Trash2, Heart, 
  ShieldCheck, Zap, Clock, ExternalLink 
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface CopyAssetCardProps {
  asset: any;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const CopyAssetCard = ({ asset, onDelete, onToggleFavorite }: CopyAssetCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-none shadow-sm bg-white group hover:ring-2 hover:ring-rose-100 transition-all overflow-hidden flex flex-col">
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-rose-100 text-rose-700 border-none text-[9px] font-bold">文案</Badge>
            <span className="text-[10px] text-slate-400 font-mono">{asset.time}</span>
          </div>
          <p className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{asset.product || '通用素材'}</p>
        </div>
        <button 
          onClick={() => onToggleFavorite(asset.id)}
          className={cn("p-1.5 rounded-full transition-colors", asset.status === '已收藏' ? "text-rose-500 bg-rose-50" : "text-slate-300 hover:bg-slate-100")}
        >
          <Heart className={cn("w-3.5 h-3.5", asset.status === '已收藏' && "fill-current")} />
        </button>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col space-y-3">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1">
          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-4 font-mono">
            {asset.content}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>合规性: {asset.compliance}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>原创度: {asset.originality}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-[9px] border-slate-200 text-slate-500">{asset.config.platform}</Badge>
          <Badge variant="outline" className="text-[9px] border-slate-200 text-slate-500">{asset.config.style}</Badge>
          <Badge variant="outline" className="text-[9px] border-slate-200 text-slate-500">{asset.wordCount}字</Badge>
        </div>

        <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-rose-500" onClick={() => showSuccess("已复制文案内容")}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-rose-500" onClick={() => navigate('/content')}>
              <Edit3 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-500" onClick={() => showSuccess("已复用原始生成参数")}>
              复用参数
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500" onClick={() => onDelete(asset.id)}>
              <Trash2 className="w-3.5 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CopyAssetCard;