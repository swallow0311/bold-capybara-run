import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Sparkles, Search, TrendingUp, Target, 
  Filter, Download, ChevronRight, ArrowUpDown,
  Calendar, Globe, Flame, MousePointer2, Eye,
  LayoutGrid, List, BarChart3, Scale, Plus, Trash2,
  RefreshCw, Heart, FileSpreadsheet, Send, AlertCircle,
  ShieldAlert, Zap
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";
import AiAnalysisReport from '@/components/selection/AiAnalysisReport';
import BenchmarkingRadar from '@/components/selection/BenchmarkingRadar';
import BenchmarkingTable from '@/components/selection/BenchmarkingTable';
import BenchmarkingStrategy from '@/components/selection/BenchmarkingStrategy';

// 模拟爆款榜单数据
const TRENDING_PRODUCTS = [
  { 
    rank: 1, 
    id: 'P-001', 
    name: '中达多肽紧致修护眼霜', 
    category: '面部护肤',
    sales: '12.8w+', 
    heat: 9850, 
    avgPrice: 299, 
    ingredients: ['多肽', '酵母', '玻尿酸'], 
    platform: '抖音',
    img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100',
    // 固定算法权重计算：综合分=市场热度25%+蓝海竞争25%+盈利潜力25%+口碑舆情15%+风险合规10%
    scores: { '市场热度': 95, '蓝海竞争': 88, '盈利潜力': 92, '口碑舆情': 85, '风险安全': 98 },
    label: '综合最优',
    data: { 
      totalScore: 94, tag: '高潜爆款', trend: 45, lifecycle: '增长期', season: '四季', 
      trafficSource: '搜索(45%) 视频(35%)', competitorCount: 12, monopoly: '低', 
      cost: 45, priceRange: '¥299-350', margin: 65, profit: 150000, roi: 1.5, 
      goodTags: '温和、吸收快', badTags: '包装渗漏', returnRate: 3.2, audienceMatch: '25-40岁女性',
      supplyStability: '优质稳定', moq: 100, leadTime: 3, infringementRisk: '低', compliance: '已备案'
    },
    aiReport: { feasibility: '高', suggestedPrice: '¥269 - ¥320', competition: '中低', ingredientTrends: '多肽成分在抗老赛道搜索量环比增长45%。', risks: ['包装密封性投诉率略高', '换季流量波动风险'] }
  },
  { 
    rank: 2, 
    id: 'P-002', 
    name: '氨基酸温和洁面乳', 
    category: '面部护肤',
    sales: '8.5w+', 
    heat: 8200, 
    avgPrice: 89, 
    ingredients: ['氨基酸', '积雪草'], 
    platform: '小红书',
    img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100',
    scores: { '市场热度': 85, '蓝海竞争': 40, '盈利潜力': 60, '口碑舆情': 90, '风险安全': 95 },
    label: '热度最优',
    data: { 
      totalScore: 78, tag: '红海稳健', trend: 12, lifecycle: '成熟期', season: '四季', 
      trafficSource: '搜索(60%) 笔记(30%)', competitorCount: 85, monopoly: '高', 
      cost: 15, priceRange: '¥79-99', margin: 40, profit: 45000, roi: 2.8, 
      goodTags: '不紧绷、泡沫细', badTags: '清洁力弱', returnRate: 2.5, audienceMatch: '全人群',
      supplyStability: '极高', moq: 500, leadTime: 5, infringementRisk: '低', compliance: '已备案'
    },
    aiReport: { feasibility: '中', suggestedPrice: '¥79 - ¥99', competition: '极高', ingredientTrends: '氨基酸洁面已进入红海期。', risks: ['同质化严重', '利润空间被压缩'] }
  },
  { 
    rank: 3, 
    id: 'P-003', 
    name: '水漾隔离防晒喷雾', 
    category: '面部护肤',
    sales: '5.2w+', 
    heat: 7500, 
    avgPrice: 129, 
    ingredients: ['烟酰胺', '物理防晒'], 
    platform: '抖音',
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100',
    scores: { '市场热度': 78, '蓝海竞争': 65, '盈利潜力': 85, '口碑舆情': 75, '风险安全': 80 },
    label: '潜力最大',
    data: { 
      totalScore: 82, tag: '季节爆品', trend: 120, lifecycle: '爆发期', season: '夏季', 
      trafficSource: '直播(50%) 视频(40%)', competitorCount: 32, monopoly: '中', 
      cost: 28, priceRange: '¥119-149', margin: 55, profit: 82000, roi: 1.8, 
      goodTags: '成膜快、不假白', badTags: '味道刺鼻', returnRate: 5.5, audienceMatch: '户外人群',
      supplyStability: '中等', moq: 200, leadTime: 7, infringementRisk: '中', compliance: '特证要求'
    },
    aiReport: { feasibility: '高', suggestedPrice: '¥119 - ¥149', competition: '中', ingredientTrends: '防晒喷雾在户外场景搜索量激增。', risks: ['物流易燃易爆限制', '季节性强'] }
  }
];

const SelectionEngine = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [compareList, setCompareList] = useState<any[]>(TRENDING_PRODUCTS.slice(0, 3));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [platform, setPlatform] = useState('all');

  // 准入规则校验
  const validation = useMemo(() => {
    if (compareList.length < 2) return { valid: false, msg: "至少选择 2 款商品进行竞品对标分析" };
    if (compareList.length > 5) return { valid: false, msg: "最多支持 5 款商品同时对标" };
    const categories = new Set(compareList.map(p => p.category));
    if (categories.size > 1) return { valid: false, msg: "仅支持同三级类目商品对比，请重新选择商品" };
    return { valid: true, msg: "" };
  }, [compareList]);

  const filteredProducts = useMemo(() => {
    return TRENDING_PRODUCTS.filter(p => {
      const matchesSearch = !searchQuery || p.name.includes(searchQuery);
      const matchesPlatform = platform === 'all' || p.platform === platform;
      return matchesSearch && matchesPlatform;
    });
  }, [searchQuery, platform]);

  const handleRemoveCompare = (id: string) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
    showSuccess("已从对比队列中移除");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-6 max-w-[1600px] mx-auto pb-12 text-left animate-in fade-in duration-500">
        
        <div className="flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-white border border-slate-200 p-1 h-11 shadow-sm rounded-xl">
              <TabsTrigger value="trending" className="gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
                <BarChart3 className="w-3.5 h-3.5" /> 全网爆款榜单
              </TabsTrigger>
              <TabsTrigger value="benchmarking" className="gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
                <Scale className="w-3.5 h-3.5" /> 竞品深度对标
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {activeTab === 'benchmarking' && validation.valid && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => showSuccess("正在生成 PDF 对比报告...")}>
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> 导出对比报告
              </Button>
              <Button className="bg-rose-400 hover:bg-rose-500 text-white text-xs h-9" onClick={() => showSuccess("已将对比组商品批量加入收藏")}>
                <Heart className="w-3.5 h-3.5 mr-1.5" /> 批量收藏
              </Button>
            </div>
          )}
        </div>

        {/* 1. 榜单页签内容 */}
        <TabsContent value="trending" className="m-0 space-y-6">
          <Card className="border-none shadow-sm bg-white shrink-0">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-slate-400 font-bold uppercase">来源平台</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="h-9 text-xs bg-slate-50"><SelectValue placeholder="全部平台" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">全部平台</SelectItem><SelectItem value="抖音">抖音电商</SelectItem><SelectItem value="小红书">小红书</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-[10px] text-slate-400 font-bold uppercase">关键词搜索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索爆款商品名称、成分..." className="pl-9 h-9 text-xs bg-slate-50 border-slate-200" />
                </div>
              </div>
              <div className="flex items-end pb-0.5">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-9 text-xs">开始挖掘</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
            <Card className="flex-1 border-none shadow-sm overflow-hidden flex flex-col bg-white">
              <CardHeader className="py-4 border-b border-slate-100 shrink-0 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-rose-400" /> 全网美妆爆款实时榜单</CardTitle>
              </CardHeader>
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[60px] text-center text-xs">排名</TableHead>
                      <TableHead className="text-xs">商品名称</TableHead>
                      <TableHead className="text-xs text-right">销量</TableHead>
                      <TableHead className="text-xs text-right">热度</TableHead>
                      <TableHead className="text-xs text-center">来源</TableHead>
                      <TableHead className="text-xs text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((p) => (
                      <TableRow key={p.id} className={cn("cursor-pointer transition-colors group", selectedProduct?.id === p.id ? "bg-rose-50/30" : "hover:bg-slate-50/50")} onClick={() => setSelectedProduct(p)}>
                        <TableCell className="text-center"><span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black", p.rank <= 3 ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400")}>{p.rank}</span></TableCell>
                        <TableCell className="font-bold text-slate-700 text-xs max-w-[180px] truncate">{p.name}</TableCell>
                        <TableCell className="text-right font-black text-slate-800 text-xs">{p.sales}</TableCell>
                        <TableCell className="text-right"><div className="flex items-center justify-end gap-1 text-rose-500 font-bold text-xs"><Flame className="w-3 h-3" /> {p.heat}</div></TableCell>
                        <TableCell className="text-center"><Badge className={cn("border-none text-[9px] font-bold", p.platform === '抖音' ? "bg-slate-800 text-white" : "bg-rose-100 text-rose-600")}>{p.platform}</Badge></TableCell>
                        <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">查看详情</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
            <Card className="w-full lg:w-[400px] border-none shadow-sm flex flex-col overflow-hidden bg-white shrink-0">
              <CardContent className="p-6 h-full"><AiAnalysisReport product={selectedProduct} /></CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. 竞品对标页签内容 */}
        <TabsContent value="benchmarking" className="m-0 space-y-8">
          {!validation.valid ? (
            /* 异常兜底展示 */
            <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center">
                <ShieldAlert className="w-10 h-10 text-rose-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-slate-800">{validation.msg}</h3>
                <p className="text-sm text-slate-400">请返回榜单勾选同类目商品，或从收藏夹中批量导入</p>
              </div>
              <Button onClick={() => setActiveTab('trending')} className="bg-rose-400 hover:bg-rose-500 text-white px-8">返回选品榜单</Button>
            </div>
          ) : (
            <>
              {/* 5.1 对比商品选择区 */}
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {compareList.map(p => (
                  <Card key={p.id} className="border-none shadow-sm bg-white group relative overflow-hidden">
                    <CardContent className="p-3 flex items-center gap-3">
                      <img src={p.img} className="w-12 h-12 rounded-xl object-cover border border-slate-100" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 truncate">{p.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] px-1.5 py-0">评分 {p.data.totalScore}</Badge>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveCompare(p.id)} className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </CardContent>
                  </Card>
                ))}
                {compareList.length < 5 && (
                  <button className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-slate-400 hover:border-rose-300 hover:text-rose-500 transition-all bg-white/50">
                    <Plus className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">添加对标品</span>
                  </button>
                )}
              </div>

              {/* 5.2 综合对比总览 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-5 border-none shadow-sm bg-white">
                  <CardHeader className="pb-2 border-b border-slate-50">
                    <CardTitle className="text-sm font-bold flex items-center gap-2"><Scale className="w-4 h-4 text-rose-400" /> 五维能力雷达对标</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <BenchmarkingRadar data={compareList} />
                  </CardContent>
                </Card>

                <Card className="lg:col-span-7 border-none shadow-sm bg-white">
                  <CardHeader className="pb-2 border-b border-slate-50">
                    <CardTitle className="text-sm font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-rose-400" /> AI 全局对比结论</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                      <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-rose-200">1</div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-rose-700">综合最优入局品：{compareList[0]?.name}</p>
                        <p className="text-[11px] text-rose-600/80 mt-1">该单品在毛利空间与竞争蓝海度上取得完美平衡，建议作为首选铺货目标。</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">内卷严重品</span>
                        <p className="text-xs font-bold text-slate-700 mt-1">{compareList[1]?.name}</p>
                        <Badge className="bg-amber-100 text-amber-700 border-none text-[9px] mt-2">高获客成本</Badge>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">高风险预警</span>
                        <p className="text-xs font-bold text-slate-700 mt-1">{compareList[2]?.name}</p>
                        <Badge className="bg-rose-100 text-rose-700 border-none text-[9px] mt-2">侵权/售后风险</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 5.3 全维度表格对标区 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4 text-rose-400" />
                    <h3 className="text-sm font-black text-slate-800">全维度横向对标矩阵</h3>
                  </div>
                  <div className="flex gap-4 text-[10px]">
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold"><div className="w-2 h-2 rounded-full bg-emerald-500" /> 维度最优</span>
                    <span className="flex items-center gap-1.5 text-rose-600 font-bold"><div className="w-2 h-2 rounded-full bg-rose-500" /> 维度最差</span>
                  </div>
                </div>
                <BenchmarkingTable products={compareList} />
              </div>

              {/* 5.4 AI 差异化智能拆解区 */}
              <BenchmarkingStrategy products={compareList} />

              {/* 5.6 落地操作功能区 */}
              <div className="fixed bottom-6 left-72 right-8 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl p-4 rounded-2xl z-40 flex items-center justify-between animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-xl border border-rose-100">
                    <span className="text-xs font-bold text-rose-600">已选中 {compareList.length} 款对标品</span>
                  </div>
                  <div className="h-6 w-[1px] bg-slate-200" />
                  <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => showSuccess("正在基于对比差异生成差异化营销素材...")}>
                    <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> 差异化素材生成
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-rose-500">批量移除</Button>
                  <Button className="bg-rose-400 hover:bg-rose-500 text-white h-9 px-6 text-xs font-bold rounded-xl shadow-lg shadow-rose-200">
                    一键批量铺货
                  </Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>

      </div>
    </DashboardLayout>
  );
};

export default SelectionEngine;