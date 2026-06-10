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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, Search, TrendingUp, Target, 
  Filter, Download, ChevronRight, ArrowUpDown,
  Calendar, Globe, Flame, MousePointer2, Eye,
  LayoutGrid, List, BarChart3, Scale, Plus, Trash2,
  RefreshCw, Heart, FileSpreadsheet, Send, AlertCircle,
  ShieldAlert, Zap, Activity, TrendingDown, Settings2,
  ShieldCheck, Box, Coins, Info, Check, HelpCircle
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 导入子组件
import AiAnalysisReport from '@/components/selection/AiAnalysisReport';
import BenchmarkingRadar from '@/components/selection/BenchmarkingRadar';
import BenchmarkingTable from '@/components/selection/BenchmarkingTable';
import DiagnosisDetailDrawer from '@/components/selection/DiagnosisDetailDrawer';
import SelectionConfigSheet from '@/components/selection/SelectionConfigSheet';

// 模拟爆款榜单数据
const TRENDING_PRODUCTS = [
  { 
    rank: 1, id: 'P-001', name: '中达多肽紧致修护眼霜', category: '面部护肤',
    sales: '12.8w+', heat: 9850, avgPrice: 299, ingredients: ['多肽', '酵母'], platform: '抖音',
    img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100',
    scores: { '市场热度': 95, '蓝海竞争': 88, '盈利潜力': 92, '口碑舆情': 85, '风险安全': 98 },
    label: '综合最优',
    data: { totalScore: 94, tag: '高潜爆款', trend: 45, lifecycle: '增长期', season: '四季', trafficSource: '搜索(45%) 视频(35%)', competitorCount: 12, monopoly: '低', cost: 45, priceRange: '¥299-350', margin: 65, profit: 150000, roi: 1.5, goodTags: '温和、吸收快', badTags: '包装渗漏', returnRate: 3.2, audienceMatch: '25-40岁女性', supplyStability: '优质稳定', moq: 100, leadTime: 3, infringementRisk: '低', compliance: '已备案' },
    aiReport: { feasibility: '高', suggestedPrice: '¥269 - ¥320', competition: '中低', ingredientTrends: '多肽成分在抗老赛道搜索量环比增长45%。', risks: ['包装密封性投诉率略高', '换季流量波动风险'] }
  },
  { 
    rank: 2, id: 'P-002', name: '氨基酸温和洁面乳', category: '面部护肤',
    sales: '8.5w+', heat: 8200, avgPrice: 89, ingredients: ['氨基酸'], platform: '小红书',
    img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100',
    scores: { '市场热度': 85, '蓝海竞争': 40, '盈利潜力': 60, '口碑舆情': 90, '风险安全': 95 },
    label: '热度最优',
    data: { totalScore: 78, tag: '红海稳健', trend: 12, lifecycle: '成熟期', season: '四季', trafficSource: '搜索(60%) 笔记(30%)', competitorCount: 85, monopoly: '高', cost: 15, priceRange: '¥79-99', margin: 40, profit: 45000, roi: 2.8, goodTags: '不紧绷、泡沫细', badTags: '清洁力弱', returnRate: 2.5, audienceMatch: '全人群', supplyStability: '极高', moq: 500, leadTime: 5, infringementRisk: '低', compliance: '已备案' },
    aiReport: { feasibility: '中', suggestedPrice: '¥79 - ¥99', competition: '极高', ingredientTrends: '氨基酸洁面已进入红海期。', risks: ['同质化严重', '利润空间被压缩'] }
  },
  { 
    rank: 3, id: 'P-003', name: '水漾隔离防晒喷雾', category: '面部护肤',
    sales: '5.2w+', heat: 7500, avgPrice: 129, ingredients: ['物理防晒'], platform: '抖音',
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100',
    scores: { '市场热度': 78, '蓝海竞争': 65, '盈利潜力': 85, '口碑舆情': 75, '风险安全': 80 },
    label: '季节新品',
    data: { totalScore: 82, tag: '季节爆品', trend: 120, lifecycle: '爆发期', season: '夏季', trafficSource: '直播(50%) 视频(40%)', competitorCount: 32, monopoly: '中', cost: 28, priceRange: '¥119-149', margin: 55, profit: 82000, roi: 1.8, goodTags: '成膜快、不假白', badTags: '味道刺鼻', returnRate: 5.5, audienceMatch: '户外人群', supplyStability: '中等', moq: 200, leadTime: 7, infringementRisk: '中', compliance: '特证要求' },
    aiReport: { feasibility: '高', suggestedPrice: '¥119 - ¥149', competition: '中', ingredientTrends: '防晒喷雾在户外场景搜索量激增。', risks: ['物流易燃易爆限制', '季节性强'] }
  }
];

const STORE_DIAGNOSIS_DATA = [
  { id: 'S-001', name: '中达酵母御龄面霜', status: '健康', traffic: '1.2w', cvr: '3.5%', sentiment: '92%', trend: 'up' },
  { id: 'S-002', name: '积雪草净化海泥面膜', status: '风险', traffic: '2.5k', cvr: '0.8%', sentiment: '75%', trend: 'down' },
  { id: 'S-003', name: '水漾隔离防晒乳', status: '滞销', traffic: '800', cvr: '0.2%', sentiment: '88%', trend: 'down' },
];

const SelectionEngine = () => {
  const [activeTab, setActiveTab] = useState('potential');
  
  // 需求1: 默认选中榜单第一条商品展示详情
  const [selectedProduct, setSelectedProduct] = useState<any>(TRENDING_PRODUCTS[0]);
  
  const [compareList, setCompareList] = useState<any[]>(TRENDING_PRODUCTS.slice(0, 3));
  
  // 竞品对标选品中右侧详情选中的商品
  const [selectedCompareProduct, setSelectedCompareProduct] = useState<any>(TRENDING_PRODUCTS[0]);

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [diagnosisItem, setDiagnosisItem] = useState<any>(null);

  // 筛选配置状态
  const [industry, setIndustry] = useState('beauty');
  const [timeRange, setTimeRange] = useState('30d');
  const [showMarketScore, setShowMarketScore] = useState(true);
  const [showProfitScore, setShowProfitScore] = useState(true);
  const [showRiskScore, setShowRiskScore] = useState(true);

  // AI 预设策略切换
  const handleStrategyPreset = (strategy: string) => {
    if (strategy === 'profit') {
      showSuccess("已载入【高利润卡位】策略：上调毛利率与定价权重，优先展示高溢价单品。");
    } else if (strategy === 'risk') {
      showSuccess("已载入【低风险稳健】策略：强化专利侵权与资质合规权重，屏蔽高敏属性。");
    } else if (strategy === 'volume') {
      showSuccess("已载入【流量爆发】策略：大盘搜索热度与30天增速权重调至最高。");
    }
  };

  // 竞品对标准入校验
  const validation = useMemo(() => {
    if (compareList.length < 2) return { valid: false, msg: "至少选择 2 款商品进行竞品对标分析" };
    if (compareList.length > 5) return { valid: false, msg: "最多支持 5 款商品同时对标" };
    const categories = new Set(compareList.map(p => p.category));
    if (categories.size > 1) return { valid: false, msg: "仅支持同三级类目商品对比，请重新选择商品" };
    return { valid: true, msg: "" };
  }, [compareList]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-6 max-w-[1600px] mx-auto pb-12 text-left animate-in fade-in duration-500">
        
        {/* 顶部标签式功能切换 */}
        <div className="flex justify-between items-center shrink-0">
          <TabsList className="bg-white border border-slate-200 p-1 h-11 shadow-sm rounded-xl">
            <button
              onClick={() => setActiveTab('potential')}
              className={cn("px-5 py-2 rounded-lg text-xs font-bold transition-all", activeTab === 'potential' ? "bg-rose-50 text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              <Zap className="w-3.5 h-3.5 inline mr-1.5" /> 蓝海潜力选品
            </button>
            <button
              onClick={() => setActiveTab('benchmarking')}
              className={cn("px-5 py-2 rounded-lg text-xs font-bold transition-all", activeTab === 'benchmarking' ? "bg-rose-50 text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              <Scale className="w-3.5 h-3.5 inline mr-1.5" /> 竞品对标选品
            </button>
            <button
              onClick={() => setActiveTab('diagnosis')}
              className={cn("px-5 py-2 rounded-lg text-xs font-bold transition-all", activeTab === 'diagnosis' ? "bg-rose-50 text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              <Activity className="w-3.5 h-3.5 inline mr-1.5" /> 本店商品诊断
            </button>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => setIsConfigOpen(true)}>
              <Settings2 className="w-3.5 h-3.5 mr-1.5" /> 全局权重配置
            </Button>
          </div>
        </div>

        {/* 1. 蓝海潜力选品 */}
        {activeTab === 'potential' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-[500px]">
            <Card className="flex-1 border-none shadow-sm overflow-hidden flex flex-col bg-white">
              <CardHeader className="py-4 border-b border-slate-100 shrink-0 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2"><Flame className="w-4 h-4 text-rose-400" /> 全网蓝海潜力爆款榜</CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="7d"><SelectTrigger className="h-8 text-[10px] w-24"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7d">近7天</SelectItem><SelectItem value="30d">近30天</SelectItem></SelectContent></Select>
                </div>
              </CardHeader>
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[60px] text-center text-xs">排名</TableHead>
                      <TableHead className="text-xs">商品信息</TableHead>
                      <TableHead className="text-xs text-right">潜力分</TableHead>
                      <TableHead className="text-xs text-right">热度趋势</TableHead>
                      <TableHead className="text-xs text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TRENDING_PRODUCTS.map((p) => (
                      <TableRow key={p.id} className={cn("cursor-pointer transition-colors group", selectedProduct?.id === p.id ? "bg-rose-50/30" : "hover:bg-slate-50/50")} onClick={() => setSelectedProduct(p)}>
                        <TableCell className="text-center"><span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black", p.rank <= 3 ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400")}>{p.rank}</span></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={p.img} className="w-8 h-8 rounded-lg object-cover" alt="" />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-700 text-xs truncate w-40">{p.name}</p>
                              <p className="text-[10px] text-slate-400">{p.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-black text-rose-500 text-xs">{p.data.totalScore}</TableCell>
                        <TableCell className="text-right"><div className="flex items-center justify-end gap-1 text-emerald-500 font-bold text-xs">↑ {p.data.trend}%</div></TableCell>
                        <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500">分析</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
            <Card className="w-full lg:w-[400px] border-none shadow-sm flex flex-col overflow-hidden bg-white shrink-0">
              <CardContent className="p-6 h-full">
                <AiAnalysisReport product={selectedProduct} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* 2. 竞品对标选品：三栏优化布局 */}
        {activeTab === 'benchmarking' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch flex-1 overflow-hidden min-h-[600px]">
            
            {/* 左侧：竞品配置区 (3 cols) */}
            <div className="xl:col-span-3 flex flex-col gap-4">
              <Card className="border-none shadow-sm bg-white flex-1 flex flex-col">
                <CardHeader className="py-4 border-b border-slate-100">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase">左侧：竞品配置区</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1">
                  <CardContent className="p-4 space-y-6">
                    
                    {/* 2.1 行业与时间筛选 */}
                    <div className="space-y-3">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase">行业与时间筛选</Label>
                      <div className="space-y-2">
                        <Select value={industry} onValueChange={setIndustry}>
                          <SelectTrigger className="h-8 text-[11px] bg-slate-50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beauty">美容护肤 / 护肤品</SelectItem>
                            <SelectItem value="makeup">彩妆香氛 / 彩妆</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                          <SelectTrigger className="h-8 text-[11px] bg-slate-50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7d">近 7 天流量分析</SelectItem>
                            <SelectItem value="30d">近 30 天周期复盘</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* 2.2 竞品输入模块 */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase">竞品配置池</Label>
                        <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-mono">{compareList.length}/5</Badge>
                      </div>
                      <div className="space-y-2">
                        {compareList.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100 group">
                            <div className="flex items-center gap-2 min-w-0">
                              <img src={p.img} className="w-8 h-8 rounded-lg object-cover" alt="" />
                              <span className="text-[11px] font-bold text-slate-700 truncate w-32">{p.name}</span>
                            </div>
                            <button 
                              onClick={() => setCompareList(prev => prev.filter(item => item.id !== p.id))}
                              className="text-slate-300 hover:text-rose-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {compareList.length < 5 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-[10px] h-8 border-dashed border-slate-200"
                            onClick={() => {
                              if (compareList.length >= 5) return;
                              const missing = TRENDING_PRODUCTS.find(p => !compareList.some(item => item.id === p.id));
                              if (missing) {
                                setCompareList([...compareList, missing]);
                                showSuccess("竞品已载入对比配置区");
                              } else {
                                showError("爆款池中无更多可用商品");
                              }
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" /> 添加竞品
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* 2.3 对比设置 */}
                    <div className="space-y-3">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase">对比设置维度筛选</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg">
                          <span className="text-[11px] text-slate-600">市场热度指标</span>
                          <Switch checked={showMarketScore} onCheckedChange={setShowMarketScore} className="scale-75" />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg">
                          <span className="text-[11px] text-slate-600">盈利商业维度</span>
                          <Switch checked={showProfitScore} onCheckedChange={setShowProfitScore} className="scale-75" />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg">
                          <span className="text-[11px] text-slate-600">风险安全合规度</span>
                          <Switch checked={showRiskScore} onCheckedChange={setShowRiskScore} className="scale-75" />
                        </div>
                      </div>
                    </div>

                    {/* 2.4 AI 策略预设 */}
                    <div className="space-y-3">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase">AI 策略权重预设</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <Button variant="outline" size="sm" className="justify-start text-[10px] h-8 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100" onClick={() => handleStrategyPreset('profit')}>
                          <Coins className="w-3.5 h-3.5 mr-2 text-rose-500" /> 高利润卡位预设
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start text-[10px] h-8 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100" onClick={() => handleStrategyPreset('risk')}>
                          <ShieldCheck className="w-3.5 h-3.5 mr-2 text-emerald-500" /> 低风险稳健预设
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start text-[10px] h-8 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100" onClick={() => handleStrategyPreset('volume')}>
                          <TrendingUp className="w-3.5 h-3.5 mr-2 text-indigo-500" /> 流量爆发预设
                        </Button>
                      </div>
                    </div>

                  </CardContent>
                </ScrollArea>
              </Card>
            </div>

            {/* 中间：AI选品推荐与对比列表 (6 cols) */}
            <div className="xl:col-span-6 flex flex-col gap-4">
              
              {/* 2.5 竞品概览卡片 (对标摘要) */}
              <div className="grid grid-cols-3 gap-3 shrink-0">
                <Card className="border-none shadow-sm bg-white p-4 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">对标商品数</span>
                  <p className="text-lg font-black text-slate-800 mt-1">{compareList.length} 款</p>
                  <span className="text-[9px] text-slate-400 block mt-0.5">三级类目对齐</span>
                </Card>
                <Card className="border-none shadow-sm bg-white p-4 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">首位潜力分</span>
                  <p className="text-lg font-black text-rose-500 mt-1">{compareList[0]?.data.totalScore || 0}</p>
                  <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">高潜极速上新</span>
                </Card>
                <Card className="border-none shadow-sm bg-white p-4 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">参考利润均值</span>
                  <p className="text-lg font-black text-slate-800 mt-1">65%</p>
                  <span className="text-[9px] text-slate-400 block mt-0.5">毛利空间充沛</span>
                </Card>
              </div>

              {/* 2.6 关键指标对比图 (雷达图/多维对比图) */}
              <Card className="border-none shadow-sm bg-white shrink-0">
                <CardHeader className="py-3 border-b border-slate-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold text-slate-500">关键指标对比雷达图</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex items-center justify-center">
                  {validation.valid ? (
                    <BenchmarkingRadar data={compareList} />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-slate-400 text-xs">对比数据量不足，请从左侧添加</div>
                  )}
                </CardContent>
              </Card>

              {/* 2.7 推荐选品对比表格 */}
              <Card className="border-none shadow-sm bg-white flex-1 flex flex-col overflow-hidden">
                <CardHeader className="py-4 border-b border-slate-100 shrink-0 flex flex-row justify-between items-center">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase">横向数据对比矩阵</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] border-slate-200" onClick={() => showSuccess("自定义展示列配置已生效")}>
                      <Settings2 className="w-3 h-3 mr-1" /> 自定义列
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] border-slate-200" onClick={() => showSuccess("对比明细已导出为 Excel 格式")}>
                      <Download className="w-3 h-3 mr-1" /> 导出数据
                    </Button>
                  </div>
                </CardHeader>
                <div className="flex-1 overflow-auto">
                  {validation.valid ? (
                    <Table>
                      <TableHeader className="bg-slate-50/60 sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="text-[10px]">竞品名称</TableHead>
                          {showMarketScore && <TableHead className="text-[10px] text-right">大盘热度</TableHead>}
                          {showProfitScore && <TableHead className="text-[10px] text-right">参考成本/售价</TableHead>}
                          {showRiskScore && <TableHead className="text-[10px] text-center">侵权风险</TableHead>}
                          <TableHead className="text-[10px] text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {compareList.map(p => (
                          <TableRow 
                            key={p.id} 
                            onClick={() => setSelectedCompareProduct(p)}
                            className={cn("cursor-pointer hover:bg-slate-50/50 text-[11px]", selectedCompareProduct?.id === p.id ? "bg-rose-50/30" : "")}
                          >
                            <TableCell className="font-bold text-slate-700 flex items-center gap-2">
                              <img src={p.img} className="w-6 h-6 rounded object-cover" alt="" />
                              <span className="truncate w-36">{p.name}</span>
                            </TableCell>
                            {showMarketScore && <TableCell className="text-right font-black text-rose-500">{p.scores.市场热度}</TableCell>}
                            {showProfitScore && (
                              <TableCell className="text-right text-slate-600 font-mono">
                                ¥{p.data.cost} / ¥{p.avgPrice}
                              </TableCell>
                            )}
                            {showRiskScore && (
                              <TableCell className="text-center">
                                <Badge className={cn("border-none text-[8px]", p.data.infringementRisk === '低' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')}>
                                  {p.data.infringementRisk}风险
                                </Badge>
                              </TableCell>
                            )}
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="h-6 text-[9px] text-rose-500" onClick={(e) => { e.stopPropagation(); handleRemoveCompare(p.id); }}>
                                移除
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs">对比组商品数量不足，请从左侧添加</div>
                  )}
                </div>
              </Card>

            </div>

            {/* 右侧：详情与洞察面板 (3 cols) */}
            <div className="xl:col-span-3 flex flex-col gap-4">
              <Card className="border-none shadow-sm bg-white flex-1 flex flex-col overflow-hidden">
                <CardHeader className="py-4 border-b border-slate-100 shrink-0">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase">右侧：详情与洞察面板</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1">
                  {selectedCompareProduct ? (
                    <div className="p-4 space-y-6 text-left">
                      
                      {/* 3.1 选中商品深度数据分析 */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold text-slate-400 uppercase">选中商品深度数据</Label>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                          <div className="flex gap-3">
                            <img src={selectedCompareProduct.img} className="w-10 h-10 rounded-lg object-cover" alt="" />
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-800 truncate w-40">{selectedCompareProduct.name}</p>
                              <Badge className="bg-rose-100 text-rose-700 border-none text-[9px] mt-1">潜力分 {selectedCompareProduct.data.totalScore}</Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                            <p>月度销量: <strong className="text-slate-800">{selectedCompareProduct.sales}</strong></p>
                            <p>竞争对手: <strong className="text-slate-800">{selectedCompareProduct.data.competitorCount}家</strong></p>
                            <p>参考毛利: <strong className="text-emerald-600">{selectedCompareProduct.data.margin}%</strong></p>
                            <p>退货风险: <strong className="text-rose-500">{selectedCompareProduct.data.returnRate}%</strong></p>
                          </div>
                        </div>
                      </div>

                      {/* 3.2 AI 选品核心理由 */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold text-slate-400 uppercase">AI 选品立项研判</Label>
                        <div className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100/60 space-y-2">
                          <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[10px]">
                            <Sparkles className="w-3.5 h-3.5" /> 核心推荐优势
                          </div>
                          <ul className="space-y-1 text-[11px] text-rose-700/90 leading-relaxed list-disc pl-4">
                            <li>毛利空间高达 65%，付费推广容错率极强</li>
                            <li>大盘同类型搜索热度环比激增 45% 以上</li>
                            <li>避开红海恶性竞价，实现利润溢出卡位</li>
                          </ul>
                        </div>
                      </div>

                      {/* 3.3 同款/类似商品竞品 */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold text-slate-400 uppercase">同款/类似在售竞品</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { name: '大牌替代款 B 紧致霜', price: '¥268', sales: '3.4k+' },
                            { name: '物理高倍抗老眼乳', price: '¥199', sales: '8.2k+' }
                          ].map((item, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-700 truncate w-32">{item.name}</span>
                              <div className="text-right">
                                <span className="font-bold text-slate-800 block">{item.price}</span>
                                <span className="text-[9px] text-slate-400">月销{item.sales}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3.4 行动落地建议 (供货/广告) */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold text-slate-400 uppercase">可落地行动建议</Label>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5 text-[11px] text-slate-600">
                          <div className="flex gap-2">
                            <Box className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-800 block">供货建议:</strong>
                              首批起订 MOQ 设置为 100 件，控制初次铺货风险；备货周期 3 天内完成。
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-800 block">广告出价建议:</strong>
                              盈亏平衡 ROI 锁定为 1.52，推荐首选小红书 KOL 种草与搜索广告测款。
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs">请点击中间列表查看商品详情</div>
                  )}
                </ScrollArea>
              </Card>
            </div>

          </div>
        )}

        {/* 3. 本店商品诊断 */}
        {activeTab === 'diagnosis' && (
          <div className="m-0 space-y-6 flex-1 min-h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: '健康商品', val: 12, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: '风险商品', val: 3, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: '滞销/待优化', val: 5, color: 'text-rose-500', bg: 'bg-rose-50' },
              ].map((s, i) => (
                <Card key={i} className="border-none shadow-sm bg-white">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{s.label}</p>
                      <p className={cn("text-2xl font-black", s.color)}>{s.val}</p>
                    </div>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}>
                      <Activity className={cn("w-5 h-5", s.color)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="py-4 border-b border-slate-100 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-rose-400" /> 本店商品健康度扫描</CardTitle>
                <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200" onClick={() => showSuccess("全店商品健康度扫描已启动...")}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> 重新扫描
                </Button>
              </CardHeader>
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="text-xs">商品名称</TableHead>
                    <TableHead className="text-xs text-center">健康状态</TableHead>
                    <TableHead className="text-xs text-right">7日流量</TableHead>
                    <TableHead className="text-xs text-right">转化率 (CVR)</TableHead>
                    <TableHead className="text-xs text-right">好评率</TableHead>
                    <TableHead className="text-xs text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {STORE_DIAGNOSIS_DATA.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-700 text-xs">{item.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "border-none text-[9px] font-bold",
                          item.status === '健康' ? 'bg-emerald-100 text-emerald-700' : 
                          item.status === '风险' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        )}>{item.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">{item.traffic}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 font-bold text-xs">
                          {item.cvr}
                          {item.trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-600 text-xs">{item.sentiment}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500" onClick={() => setDiagnosisItem(item)}>
                          诊断详情 <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* 底部固定状态栏 */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-slate-900 text-slate-300 py-3 px-8 z-40 flex items-center justify-between text-[10px] shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> 数据更新时间：2026年6月10日 09:30</span>
            <span className="h-3 w-[1px] bg-slate-700" />
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-rose-400" /> AI 核心推荐置信度：98.4%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">厦门超算中心节点连接中</span>
          </div>
        </div>

      </div>

      <SelectionConfigSheet open={isConfigOpen} onOpenChange={setIsConfigOpen} />
      <DiagnosisDetailDrawer item={diagnosisItem} onClose={() => setDiagnosisItem(null)} />
    </DashboardLayout>
  );
};

export default SelectionEngine;