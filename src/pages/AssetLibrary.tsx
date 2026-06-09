import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Download, Edit3, Trash2, Heart, Search, 
  FileText, Image as ImageIcon, Video as VideoIcon, 
  FolderOpen, Layers, Sparkles, X, Maximize2
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

const INITIAL_ASSETS = [
  {
    id: 1,
    name: '中达酵母面霜_专业测评版',
    type: 'text',
    date: '2026-05-20 09:12',
    score: 95,
    product: '中达御龄紧致面霜',
    content: '坚持用面部淡纹明显，30%多肽针对精致妈妈群体。里面添加了核心的多肽修护成分，能够快速建立皮肤屏障。很多姐妹担心上脸刺激，但它非常温和。用了一周，脸上的红血丝明显淡了，干燥脱皮都得到了极大改善，妥妥的国货之光！',
    img: '',
    isFavorite: true
  },
  {
    id: 2,
    name: '夏日防晒海报_金箔高奢',
    type: 'image',
    date: '2026-05-20 10:45',
    score: 91,
    product: '清爽控油防晒喷雾',
    content: '',
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60',
    isFavorite: false
  },
  {
    id: 3,
    name: '水光唇蜜主图卡点短视频',
    type: 'video',
    date: '2026-05-19 16:30',
    score: 93,
    product: '凝润修护水光唇蜜',
    content: '',
    img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=60',
    isFavorite: true
  },
  {
    id: 4,
    name: '修护舒缓多肽精华故事种草版',
    type: 'text',
    date: '2026-05-18 14:00',
    score: 87,
    product: '修护多肽精华液',
    content: '每天晚上厚涂一层，脸上红血丝快速消退，换季必备。这款精华液采用了最新的多肽包裹技术，能够直达肌底，从根源修护受损屏障。质地清爽不黏腻，上脸瞬间吸收，是敏感肌姐妹的福音。',
    img: '',
    isFavorite: false
  }
];

const AssetLibrary = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [filterType, setFilterType] = useState('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [detailAsset, setDetailAsset] = useState<any>(null);

  const toggleFavorite = (id: number) => {
    setAssets(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    }));
    showSuccess("收藏状态已切换");
  };

  const handleSelectAsset = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    setAssets(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    showSuccess("选中的素材已批量删除，草稿箱已被清理");
  };

  const handleEdit = (asset: any) => {
    if (asset.type === 'text') {
      navigate('/content');
    } else if (asset.type === 'image') {
      navigate('/image-design');
    } else if (asset.type === 'video') {
      navigate('/video-creation');
    }
  };

  const filteredAssets = assets.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left">
        
        {/* Filter bar with Batch Actions */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3 flex-wrap items-center">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px] bg-slate-50/50">
                  <SelectValue placeholder="全部类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="text">AIGC 文案</SelectItem>
                  <SelectItem value="image">AI 海报主图</SelectItem>
                  <SelectItem value="video">AI 主图视频</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[160px] bg-slate-50/50">
                  <SelectValue placeholder="按关联商品筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部关联商品</SelectItem>
                  <SelectItem value="m霜">御龄紧致面霜</SelectItem>
                  <SelectItem value="fs">控油防晒喷雾</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="newest">
                <SelectTrigger className="w-[140px] bg-slate-50/50">
                  <SelectValue placeholder="最新生成" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">最新生成</SelectItem>
                  <SelectItem value="rating">智能评分最高</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-[11px] text-slate-400 font-medium mr-2">包含已完成素材计 {filteredAssets.length} 份</span>
              {selectedIds.length > 0 && (
                <Button 
                  onClick={handleBatchDelete}
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 text-xs h-9"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  批量删除 ({selectedIds.length})
                </Button>
              )}
              <Button variant="outline" className="text-xs border-slate-200 h-9" onClick={() => showSuccess("正在拉取批量下载包...")}>
                <Download className="w-3.5 h-3.5 mr-1 text-slate-500" />
                批量导出
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredAssets.map(item => {
            const isChecked = selectedIds.includes(item.id);
            return (
              <Card key={item.id} className={cn(
                "border-none shadow-sm overflow-hidden bg-white group hover:ring-1 hover:ring-rose-200 transition-all",
                isChecked && "ring-1 ring-rose-300"
              )}>
                
                {/* Image header placeholder or visual */}
                <div 
                  className="cursor-pointer"
                  onClick={() => setDetailAsset(item)}
                >
                  {item.type === 'text' ? (
                    <div className="h-44 bg-rose-50/40 p-4 border-b border-slate-100 flex flex-col justify-between text-left">
                      <div className="flex justify-between items-start">
                        <FileText className="w-7 h-7 text-rose-400" />
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={isChecked}
                            onCheckedChange={(checked) => handleSelectAsset(item.id, !!checked)}
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 font-mono leading-relaxed line-clamp-4">
                        {item.content}
                      </p>
                      <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-[9px] w-fit hover:bg-rose-100">
                        文案大篇幅
                      </Badge>
                    </div>
                  ) : (
                    <div className="h-44 bg-slate-900 border-b border-slate-100 relative group overflow-hidden flex items-center justify-center">
                      <img src={item.img} className="w-full h-full object-cover opacity-80" alt="asset preview" />
                      
                      {/* Header elements */}
                      <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
                        <Badge className="bg-black/60 text-white font-bold text-[9px] border-none uppercase flex items-center gap-1">
                          {item.type === 'image' ? <ImageIcon className="w-2.5 h-2.5" /> : <VideoIcon className="w-2.5 h-2.5" />}
                          {item.type === 'image' ? "AI 图片" : "AI 视频"}
                        </Badge>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={isChecked}
                            onCheckedChange={(checked) => handleSelectAsset(item.id, !!checked)}
                          />
                        </div>
                      </div>

                      {/* Hover play icon for video */}
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <VideoIcon className="w-8 h-8 text-white stroke-[2]" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer details */}
                <CardContent className="p-4 space-y-3 text-xs text-left">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <span 
                        className="font-bold text-slate-800 truncate block max-w-[150px] cursor-pointer hover:text-rose-500"
                        onClick={() => setDetailAsset(item)}
                      >
                        {item.name}
                      </span>
                      <button 
                        onClick={() => toggleFavorite(item.id)}
                        className={cn(
                          "p-0.5 rounded transition-colors",
                          item.isFavorite ? "text-rose-500" : "text-slate-300 hover:text-rose-400"
                        )}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium font-mono">{item.date}</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100/60">
                    <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                      {item.product}
                    </span>
                    <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-800 border-none font-bold text-[9px]">
                      得分 {item.score}
                    </Badge>
                  </div>

                  {/* Actions bar */}
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-[10px] text-slate-500 hover:text-rose-500 p-0" 
                      onClick={() => handleEdit(item)}
                    >
                      <Edit3 className="w-3 h-3 mr-1" /> 编辑
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-500 hover:text-rose-500 p-0" onClick={() => showSuccess("模板已设为常用并加星。")}>
                      星标常用
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500 hover:bg-rose-50 px-1.5 rounded" onClick={() => showSuccess("正在唤起一键导出高清大图包")}>
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Asset Detail Dialog */}
      <Dialog open={!!detailAsset} onOpenChange={() => setDetailAsset(null)}>
        <DialogContent className="max-w-2xl">
          {detailAsset && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {detailAsset.type === 'text' && <FileText className="w-5 h-5 text-rose-400" />}
                    {detailAsset.type === 'image' && <ImageIcon className="w-5 h-5 text-rose-400" />}
                    {detailAsset.type === 'video' && <VideoIcon className="w-5 h-5 text-rose-400" />}
                    <DialogTitle className="text-lg font-bold">{detailAsset.name}</DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-xs text-slate-400 mt-1">
                  生成于 {detailAsset.date} | 关联商品：{detailAsset.product}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {detailAsset.type === 'text' ? (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
                    {detailAsset.content}
                  </div>
                ) : (
                  <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                    <img src={detailAsset.img} className="max-w-full max-h-full object-contain" alt="detail preview" />
                    {detailAsset.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                          <VideoIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">智能评分</span>
                    <span className="text-lg font-bold text-rose-500">{detailAsset.score}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">素材类型</span>
                    <span className="text-sm font-bold text-slate-700 uppercase">{detailAsset.type}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">收藏状态</span>
                    <span className="text-sm font-bold text-slate-700">{detailAsset.isFavorite ? '已收藏' : '未收藏'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDetailAsset(null)}>关闭</Button>
                <Button 
                  className="bg-rose-400 hover:bg-rose-500 text-white"
                  onClick={() => {
                    handleEdit(detailAsset);
                    setDetailAsset(null);
                  }}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  进入编辑
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AssetLibrary;