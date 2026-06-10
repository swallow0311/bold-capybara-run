import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, ImageIcon, VideoIcon, Search, Filter, 
  Download, Trash2, Heart, FolderOpen, Plus,
  RefreshCw, Calendar, CheckCircle2, XCircle, Info
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 导入子组件
import CopyAssetCard from '@/components/asset-library/CopyAssetCard';
import ImageAssetCard from '@/components/asset-library/ImageAssetCard';
import VideoAssetCard from '@/components/asset-library/VideoAssetCard';

// 模拟全量素材数据
const INITIAL_ASSETS = [
  {
    id: 'A1',
    type: 'copy',
    product: '中达酵母御龄紧致面霜',
    category: '面霜/乳液',
    config: { platform: '小红书', style: '温柔种草', focus: '功能' },
    time: '2026-06-10 14:30:05',
    status: '正常',
    usage: '未使用',
    content: '熬夜党的救星来啦！✨ 睡前抹上这款中达面霜，30%酵母精粹在夜间悄悄修护。28天见证紧致奇迹。',
    wordCount: 120,
    compliance: '合规',
    originality: '95%'
  },
  {
    id: 'A2',
    type: 'image',
    product: '中达水漾隔离防晒乳',
    category: '防晒隔离',
    config: { size: '800x800', style: '夏日清爽', quality: 'HD' },
    time: '2026-06-10 12:15:20',
    status: '已收藏',
    usage: '已复用',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'
  },
  {
    id: 'A3',
    type: 'video',
    product: '中达凝润修护水光唇蜜',
    category: '唇部彩妆',
    config: { resolution: '1080P', style: '卡点动效', voice: '甜美女孩' },
    time: '2026-06-10 10:45:12',
    status: '正常',
    usage: '未使用',
    cover: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400',
    duration: '15s',
    script: '夏日清爽水光感，一抹打造嘟嘟唇...'
  },
  {
    id: 'A4',
    type: 'copy',
    product: null,
    category: '通用素材',
    config: { platform: '朋友圈', style: '接地气', focus: '性价比' },
    time: '2026-06-09 18:20:00',
    status: '正常',
    usage: '已编辑',
    content: '家人们谁懂啊！这款面霜真的绝绝子，平价大碗还好用，敏感肌冲就完事了！',
    wordCount: 85,
    compliance: '合规',
    originality: '88%'
  }
];

const AssetLibrary = () => {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [activeTab, setActiveTab] = useState('copy');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 基础过滤逻辑（不含类型过滤，用于计算各页签数量）
  const baseFilteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchesSearch = !searchQuery || 
        (a.product?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.content?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'favorite' && a.status === '已收藏') ||
        (statusFilter === 'used' && a.usage !== '未使用');
      
      return matchesSearch && matchesStatus;
    });
  }, [assets, searchQuery, statusFilter]);

  // 最终展示列表（含类型过滤）
  const filteredAssets = useMemo(() => {
    return baseFilteredAssets.filter(a => a.type === activeTab);
  }, [baseFilteredAssets, activeTab]);

  // 计算各页签数量
  const counts = useMemo(() => ({
    copy: baseFilteredAssets.filter(a => a.type === 'copy').length,
    image: baseFilteredAssets.filter(a => a.type === 'image').length,
    video: baseFilteredAssets.filter(a => a.type === 'video').length,
  }), [baseFilteredAssets]);

  const handleDelete = (id: string) => {
    if (window.confirm("确定要删除该素材吗？删除后将无法找回。")) {
      setAssets(prev => prev.filter(a => a.id !== id));
      showSuccess("素材已成功移出资产库");
    }
  };

  const handleToggleFavorite = (id: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        const isFav = a.status === '已收藏';
        showSuccess(isFav ? "已取消收藏" : "已加入我的收藏");
        return { ...a, status: isFav ? '正常' : '已收藏' };
      }
      return a;
    }));
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确定要批量删除选中的 ${selectedIds.length} 项素材吗？`)) {
      setAssets(prev => prev.filter(a => !selectedIds.includes(a.id)));
      setSelectedIds([]);
      showSuccess("批量删除成功");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left animate-in fade-in duration-500">
        
        {/* 1. 筛选板块 */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 flex-1 w-full">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索商品名称、内容关键词、类目..." 
                  className="pl-9 text-xs h-9 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-9 text-xs bg-slate-50">
                  <SelectValue placeholder="素材状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部素材</SelectItem>
                  <SelectItem value="favorite">我的收藏</SelectItem>
                  <SelectItem value="used">已复用/编辑</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" className="h-9 text-xs text-slate-500" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>重置</Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => showSuccess("正在准备全量素材导出包...")}>
                <Download className="w-3.5 h-3.5 mr-1.5" /> 批量导出
              </Button>
              <Button className="bg-rose-400 hover:bg-rose-500 text-white text-xs h-9 shadow-lg shadow-rose-100" onClick={() => showSuccess("正在同步最新创作记录...")}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> 同步创作记录
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 2. 选项卡板块 (独立出来) */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit shadow-sm">
          {[
            { id: 'copy', label: '文案素材', icon: FileText, count: counts.copy },
            { id: 'image', label: '图片素材', icon: ImageIcon, count: counts.image },
            { id: 'video', label: '视频素材', icon: VideoIcon, count: counts.video }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedIds([]); }}
              className={cn(
                "px-6 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-[9px]",
                activeTab === tab.id ? "bg-rose-50 text-rose-600" : "bg-slate-200 text-slate-500"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* 批量操作提示 */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-rose-50 p-3 rounded-xl border border-rose-100 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-rose-600">已选中 {selectedIds.length} 项素材</span>
              <Button variant="outline" size="sm" className="h-7 text-[10px] border-rose-200 text-rose-600 bg-white" onClick={handleBatchDelete}>批量删除</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] border-rose-200 text-rose-600 bg-white" onClick={() => showSuccess("批量导出任务已创建")}>批量导出</Button>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-400" onClick={() => setSelectedIds([])}>取消选择</Button>
          </div>
        )}

        {/* 素材列表展示区 */}
        <div className="min-h-[500px]">
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map(asset => (
                <div key={asset.id} className="relative">
                  {activeTab === 'copy' && <CopyAssetCard asset={asset} onDelete={handleDelete} onToggleFavorite={handleToggleFavorite} />}
                  {activeTab === 'image' && <ImageAssetCard asset={asset} onDelete={handleDelete} onToggleFavorite={handleToggleFavorite} />}
                  {activeTab === 'video' && <VideoAssetCard asset={asset} onDelete={handleDelete} onToggleFavorite={handleToggleFavorite} />}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-40">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                <FolderOpen className="w-10 h-10 text-slate-300" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-slate-500">暂无相关素材记录</p>
                <p className="text-xs text-slate-400">前往创作工具生成内容后，系统将自动同步至此</p>
              </div>
              <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> 开始创作
              </Button>
            </div>
          )}
        </div>

        {/* 底部数据统计 */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <div className="flex gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>总素材数: {assets.length}</span>
            <span>文案: {assets.filter(a => a.type === 'copy').length}</span>
            <span>图片: {assets.filter(a => a.type === 'image').length}</span>
            <span>视频: {assets.filter(a => a.type === 'video').length}</span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-2 max-w-md">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-700 leading-relaxed">
              素材库将永久保留您的创作版本。二次编辑后的内容将生成新的素材卡片，不会覆盖原始版本。
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AssetLibrary;