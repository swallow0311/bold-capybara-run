import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, Search, Settings2, RefreshCw, TrendingUp, 
  AlertTriangle, ArrowRight, BarChart3, Zap, ShieldAlert,
  Filter, Download, Layers, MessageSquare, ShoppingBag,
  ChevronRight, Info, CheckCircle2, XCircle, Plus,
  ArrowUpDown, Calendar, LayoutGrid, List, Globe, History,
  Flame, MousePointer2, Box, Ship
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";
import SelectionConfigSheet from '@/components/selection/SelectionConfigSheet';
import SelectionDetailDrawer from '@/components/selection/SelectionDetailDrawer';

// 模拟趋势数据
const TREND_DATA = [
  { name: '06-01', heat: 400, supply: 240 },
  { name: '06-03', heat: 600, supply: 280 },
  { name: '06-05', heat: 850, supply: 300 },
  { name: '06-07', heat: 1200, supply: 320 },
  { name: '06-09', heat: 1100, supply: 350 },
  { name: '06-10', heat: 1500, supply: 380 },
];

// 模拟选品数据
const MOCK_SELECTION_DATA = [
  { 
    id: 'SEL-001', 
    img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100',
    title: '多肽紧致修护眼霜', 
    category: '眼部护理',
    score: 92, 
    estSales: '1.2w+',
    compLevel: '低',
    gap: '大', // 供需缺口
    riskTag: '无风险',
    nlpStatus: '已完成',
    status: '蓝海爆款',
    heat: 850,
    profit: '45%',
    price: '¥299',
    compData: { price: '¥350', sales: '8000' },
    tags: ['蓝海赛道', '成分党关注'],
    opportunity: '竞品普遍反馈包装渗漏，建议采用真空泵头设计。'
  },
  { 
    id: 'SEL-002', 
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100',
    title: '氨基酸温和洁面乳', 
    category: '面部清洁',
    score: 65, 
    estSales: '5.5w+',
    compLevel: '极高',
    gap: '小',
    riskTag: '价格战',
    nlpStatus: '已完成',
    status: '已生成素材',
    heat: 920,
    profit: '15%',
    price: '¥89',
    compData: { price: '¥79', sales: '12w+' },
    tags: ['红海竞争', '价格战严重'],
    opportunity: '市场已饱和，除非有极强价格优势或IP联名，否则不建议切入。'
  },
  { 
    id: 'SEL-003', 
    img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100',
    title: '植物精粹防晒喷雾', 
    category: '防晒隔离',
    score: 42, 
    estSales: '2000+',
    compLevel: '中',
    gap: '中',
    riskTag: '过敏预警',
    nlpStatus: '待分析',
    status: '高风险滞销',
    heat: 310,
    profit: '30%',
    price: '¥129',
    compData: { price: '¥119', sales: '5000' },
    tags: ['过敏风险', '肤感差'],
    opportunity: '竞品过敏率高达12%，需重新研发无敏配方。'
  }
];

const SelectionEngine = () => {
  const [mode, setMode] = useState('blue-ocean');
  const [timeRange, setTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState('market');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartSelection = () => {
    setIsCalculating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCalculating(false);
          showSuccess("AI 选品计算完成！已识别 12 个蓝海机会点。");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left animate-in fade-in duration-500">
        
        {/* 1. 顶部大盘趋势看板 (对标京东/淘宝) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-2 border-b border-slate-50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                <CardTitle className="text-sm font-bold">全网类目热度与供需趋势预测</CardTitle>
              </div>
              <Badge className="bg-rose-50 text-rose-600 border-none text-[10px]">实时更新</Badge>
            </CardHeader>
            <CardContent className="p-4 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id="colorHeat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f5756c" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f5756c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="heat" stroke="#f5756c" strokeWidth={3} fillOpacity={1} fill="url(#colorHeat)" name="搜索热度" />
                  <Line type="monotone" dataKey="supply" stroke="#94a3b8" strokeDasharray="5 5" name="市场供应量" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <CardTitle className="text-sm font-bold">全网美妆热搜关键词 TOP</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { text: '早C晚A', heat: '99w+', color: 'text-rose-500 bg-rose-50' },
                  { text: '敏感肌修护', heat: '85w+', color: 'text-orange-500 bg-orange-50' },
                  { text: '多肽抗老', heat: '72w+', color: 'text-slate-700 bg-slate-50' },
                  { text: '水光感唇蜜', heat: '68w+', color: 'text-slate-700 bg-slate-50' },
                  { text: '物理防晒', heat: '55w+', color: 'text-slate-700 bg-slate-50' },
                  { text: '氨基酸洁面', heat: '42w+', color: 'text-slate-700 bg-slate-50' },
                ].map((kw, i) => (
                  <div key={i} className={cn("px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all hover:scale-105 cursor-pointer", kw.color)}>
                    <span className="text-xs font-bold">{kw.text}</span>
                    <span className="text-[9px] opacity-60">{kw.heat}</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-[10px] text-slate-400 hover:text-rose-500">查看更多商机词 <ChevronRight className="w-3 h-3 ml-1" /></Button>
            </CardContent>
          </Card>
        </div>

        {/* 2. AI 实时推荐商品池 (对标 1688) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-black text-slate-800">AI 智能推荐蓝海商品池</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsConfigOpen(true)} className="h-8 text-[10px] border-slate-200">
                <Settings2 className="w-3.5 h-3.5 mr-1.5" /> 权重配置
              </Button>
              <Button onClick={handleStartSelection} disabled={isCalculating} className="bg-rose-400 hover:bg-rose-500 text-white h-8 text-[10px] font-bold">
                {isCalculating ? <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1.5" />}
                换一批推荐
              </Button>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {MOCK_SELECTION_DATA.map((item, i) => (
              <Card key={i} className="min-w-[280px] border-none shadow-sm bg-white group hover:ring-2 hover:ring-rose-100 transition-all">
                <CardContent className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                      <img src={item.img} className="w-full h-full object-cover" alt="" />
                      <div className="absolute top-0 left-0 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-br-lg">
                        潜力 {item.score}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-emerald-50 text-emerald-700 border-none text-[9px]">供需缺口: {item.gap}</Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">预估月销: <span className="text-slate-700 font-bold">{item.estSales}</span></p>
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                    {item.opportunity}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 h-8 text-[10px] bg-rose-400 hover:bg-rose-500 text-white font-bold" onClick={() => showSuccess("已成功建立商品档案并同步至 AIGC 模块")}>
                      一键上架
                    </Button>
                    <Button variant="outline" className="w-8 h-8 p-0 border-slate-200" onClick={() => setSelectedItem(item)}>
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 3. 选品模式与过滤 (对标淘宝/京东) */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'blue-ocean', label: '蓝海挖掘', icon: Sparkles },
                  { id: 'competitor', label: '竞品对标', icon: TrendingUp },
                  { id: 'own-store', label: '本店分析', icon: ShoppingBag }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2",
                      mode === m.id ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <m.icon className="w-3.5 h-3.5" />
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[120px] h-9 text-xs bg-slate-50">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">近 7 天</SelectItem>
                    <SelectItem value="30">近 30 天</SelectItem>
                    <SelectItem value="90">近 90 天</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input placeholder="搜索类目、关键词或竞品..." className="pl-9 h-9 text-xs bg-slate-50 border-slate-200" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2 border-t border-slate-50">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">价格区间</span>
                <div className="flex items-center gap-2">
                  <Input placeholder="Min" className="h-8 text-xs" />
                  <span className="text-slate-300">-</span>
                  <Input placeholder="Max" className="h-8 text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">所属类目</span>
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 text-xs bg-slate-50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类目</SelectItem>
                    <SelectItem value="skincare">面部护肤</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">好评率阈值</span>
                <Select defaultValue="80">
                  <SelectTrigger className="h-8 text-xs bg-slate-50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="80">80% 以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">竞争度阈值</span>
                <Select defaultValue="low">
                  <SelectTrigger className="h-8 text-xs bg-slate-50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">仅看低竞争</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full h-8 text-xs border-slate-200">重置过滤</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. 选品分类 Tabs 与 列表 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 h-11 w-full justify-start shadow-sm rounded-xl">
            <TabsTrigger value="market" className="flex-1 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <Globe className="w-3.5 h-3.5" /> 大盘蓝海选品
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex-1 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <TrendingUp className="w-3.5 h-3.5" /> 竞品监控库
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <BarChart3 className="w-3.5 h-3.5" /> 本店商品分析
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <History className="w-3.5 h-3.5" /> 历史选品任务
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="mt-6">
            <Card className="border-none shadow-sm overflow-hidden bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/70">
                    <TableRow>
                      <TableHead className="text-xs">商品信息</TableHead>
                      <TableHead className="text-xs text-center">潜力综合分</TableHead>
                      <TableHead className="text-xs">预估销量/热度</TableHead>
                      <TableHead className="text-xs">竞争等级</TableHead>
                      <TableHead className="text-xs">风险/NLP状态</TableHead>
                      <TableHead className="text-xs text-center">状态标签</TableHead>
                      <TableHead className="text-xs text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_SELECTION_DATA.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={item.img} className="w-10 h-10 rounded-lg object-cover border border-slate-100" alt="" />
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800 text-xs block truncate max-w-[180px]">{item.title}</span>
                              <span className="text-[10px] text-slate-400">{item.category}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-rose-100 bg-rose-50">
                            <span className="text-xs font-black text-rose-600">{item.score}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-700 block">{item.estSales}</span>
                            <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold">
                              <TrendingUp className="w-2.5 h-2.5" /> {item.heat}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "border-none text-[9px] font-bold",
                            item.compLevel === '低' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          )}>
                            {item.compLevel}竞争
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className={cn(
                              "text-[8px] px-1 py-0 border-none",
                              item.riskTag === '无风险' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'
                            )}>
                              {item.riskTag}
                            </Badge>
                            <div className="flex items-center gap-1 text-[9px] text-slate-400">
                              <MessageSquare className="w-2.5 h-2.5" /> {item.nlpStatus}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(
                            "border-none text-[9px] font-bold",
                            item.status === '蓝海爆款' && 'bg-rose-500 text-white',
                            item.status === '高风险滞销' && 'bg-slate-800 text-white',
                            item.status === '已生成素材' && 'bg-indigo-100 text-indigo-700',
                          )}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-[10px] text-rose-600 hover:bg-rose-50"
                            onClick={() => setSelectedItem(item)}
                          >
                            深度拆解 <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 权重配置抽屉 */}
      <SelectionConfigSheet 
        open={isConfigOpen} 
        onOpenChange={setIsConfigOpen} 
      />

      {/* 详情拆解抽屉 */}
      <SelectionDetailDrawer 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </DashboardLayout>
  );
};

export default SelectionEngine;