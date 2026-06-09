import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Search, Download, TrendingUp, Flame, Sparkles, Mic, SlidersHorizontal, 
  ChevronDown, ChevronUp, Columns, Scale, Maximize2, Trash2, ArrowUpRight, 
  HelpCircle, Award, Clock
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from "@/lib/utils";

// 扩展后的高维度商品及商业决策数据
const INITIAL_PRODUCTS = [
  { 
    id: 1, 
    img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=150&auto=format&fit=crop&q=60',
    name: '中达酵母御龄紧致面霜', 
    shop: '中达美妆官方旗舰店',
    category: '面霜',
    price: 299, 
    sales: 123400, 
    salesTrend: '+45%',
    influencers: 1234, 
    roi: '4.2',
    commission: '25%',
    convRate: '3.8%',
    platform: 'dy',
    tags: ['抗老紧致', '高转化率', '早C晚A'],
    type: 'recommend',
    aiReport: '该产品在35+精致妈妈人群中转化率极高。受早C晚A趋势红利带动，本月流量同比增长72%。推荐采用头部达人矩阵分发+自播配合。',
    historyData: [
      { date: '5-01', sales: 1200 },
      { date: '5-05', sales: 1900 },
      { date: '5-10', sales: 2400 },
      { date: '5-15', sales: 2900 },
      { date: '5-20', sales: 3400 },
    ]
  },
  { 
    id: 2, 
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=60',
    name: '中达修护舒缓多肽精华液', 
    shop: '中达海外旗舰店',
    category: '精华',
    price: 399, 
    sales: 87000, 
    salesTrend: '+32%',
    influencers: 892, 
    roi: '3.8',
    commission: '30%',
    convRate: '2.9%',
    platform: 'xhs',
    tags: ['敏感肌', '高佣金', '屏障修护'],
    type: 'darkhorse',
    aiReport: '随着季节交替，敏感修护心智大幅度爆发。建议搭配短视频“换季修护指南”展开中腰部美妆达人纯佣合作。',
    historyData: [
      { date: '5-01', sales: 800 },
      { date: '5-05', sales: 1100 },
      { date: '5-10', sales: 1500 },
      { date: '5-15', sales: 1700 },
      { date: '5-20', sales: 2100 },
    ]
  },
  { 
    id: 3, 
    img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&auto=format&fit=crop&q=60',
    name: '中达凝润修护水光唇蜜', 
    shop: '中达彩妆官方店',
    category: '彩妆',
    price: 69, 
    sales: 201000, 
    salesTrend: '+12%',
    influencers: 2145, 
    roi: '4.8',
    commission: '20%',
    convRate: '5.1%',
    platform: 'tb',
    tags: ['水光感', '国潮爆款', '平价亲民'],
    type: 'recommend',
    aiReport: '小红书夏日白开水妆容推荐单品，目前在彩妆榜霸榜TOP3，回购率达35%，是理想的店播福利款与起盘破零品。',
    historyData: [
      { date: '5-01', sales: 3200 },
      { date: '5-05', sales: 4500 },
      { date: '5-10', sales: 4900 },
      { date: '5-15', sales: 5200 },
      { date: '5-20', sales: 6000 },
    ]
  },
  { 
    id: 4, 
    img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&auto=format&fit=crop&q=60',
    name: '中达清爽控油防晒喷雾', 
    shop: '中达美妆官方旗舰店',
    category: '防晒',
    price: 89, 
    sales: 98000, 
    salesTrend: '+85%',
    influencers: 1540, 
    roi: '5.1',
    commission: '22%',
    convRate: '4.5%',
    platform: 'dy',
    tags: ['夏日爆款', '广谱防晒', '防汗抗水'],
    type: 'new',
    aiReport: '进入夏季以来全网刚需，配合直播间“秒杀买赠”活动极易爆单。注意快速跟进千川流量直投，缩短回本周期。',
    historyData: [
      { date: '5-01', sales: 1500 },
      { date: '5-05', sales: 2800 },
      { date: '5-10', sales: 4100 },
      { date: '5-15', sales: 5800 },
      { date: '5-20', sales: 7900 },
    ]
  },
  { 
    id: 5, 
    img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=150&auto=format&fit=crop&q=60',
    name: '积雪草净化海泥面膜', 
    shop: '中达个人护理专营店',
    category: '面膜',
    price: 129, 
    sales: 54000, 
    salesTrend: '-4%',
    influencers: 450, 
    roi: '2.9',
    commission: '15%',
    convRate: '1.8%',
    platform: 'ks',
    tags: ['深层清洁', '温和去角质', '日常护理'],
    type: 'darkhorse',
    aiReport: '清洁泥膜竞争非常激烈，建议从小红书“一周局部清洁”细分痛点场景开展针对性投流，避免正面竞品价格战。',
    historyData: [
      { date: '5-01', sales: 900 },
      { date: '5-05', sales: 920 },
      { date: '5-10', sales: 880 },
      { date: '5-15', sales: 850 },
      { date: '5-20', sales: 810 },
    ]
  }
];

const SelectionEngine = () => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchKey, setSearchKey] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(['面霜', '精华', '防晒']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCommission, setSelectedCommission] = useState('all');
  
  // 交互控制
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [compareProducts, setCompareProducts] = useState<any[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(true);

  // 智能立项表单状态
  const [projectName, setProjectName] = useState('');
  const [projectChannel, setProjectChannel] = useState('dy');
  const [initialStock, setInitialStock] = useState('1000');
  const [projectNotes, setProjectNotes] = useState('');

  // 快捷入口Tab切换状态
  const [activeTab, setActiveTab] = useState<'recommend' | 'darkhorse' | 'new'>('recommend');

  // 搜索逻辑
  const handleSearch = (val: string) => {
    setSearchKey(val);
    if (val.trim() && !searchHistory.includes(val)) {
      setSearchHistory(prev => [val, ...prev].slice(0, 10));
    }
  };

  const handleVoiceSearch = () => {
    showSuccess("正在唤起语音输入...");
  };

  // 展开折叠行
  const toggleRow = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // 核心对比逻辑：复选框勾选即对比
  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      if (compareProducts.length >= 4) {
        showError("最多同时选中4件商品进行对比");
        return;
      }
      const product = products.find(p => p.id === id);
      if (product) {
        setCompareProducts(prev => [...prev, product]);
        setSelectedProductIds(prev => [...prev, id]);
      }
    } else {
      setCompareProducts(prev => prev.filter(p => p.id !== id));
      setSelectedProductIds(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const toSelect = filteredProducts.slice(0, 4);
      if (filteredProducts.length > 4) {
        showError("最多同时选中4件商品进行对比，已为您选中前4项");
      }
      setSelectedProductIds(toSelect.map(p => p.id));
      setCompareProducts(toSelect);
    } else {
      setSelectedProductIds([]);
      setCompareProducts([]);
    }
  };

  const handleRemoveFromCompare = (id: number) => {
    setCompareProducts(prev => prev.filter(p => p.id !== id));
    setSelectedProductIds(prev => prev.filter(pId => pId !== id));
  };

  const triggerExport = () => {
    showSuccess("已为您导出筛选出的选品明细数据至 Excel");
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      showError("请输入立项方案名称");
      return;
    }
    showSuccess(`立项成功！方案「${projectName}」已同步至中后台工作流。`);
    setDetailProduct(null);
    setProjectName('');
    setProjectNotes('');
  };

  // 联合筛选逻辑
  const filteredProducts = products.filter(p => {
    const matchesTab = p.type === activeTab;
    const matchesSearch = p.name.includes(searchKey) || p.shop.includes(searchKey) || p.category.includes(searchKey);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || p.platform === selectedPlatform;
    
    let matchesCommission = true;
    if (selectedCommission !== 'all') {
      const rate = parseInt(p.commission);
      if (selectedCommission === 'high') matchesCommission = rate >= 25;
      if (selectedCommission === 'mid') matchesCommission = rate >= 15 && rate < 25;
      if (selectedCommission === 'low') matchesCommission = rate < 15;
    }

    return matchesTab && matchesSearch && matchesCategory && matchesPlatform && matchesCommission;
  });

  // 计算各榜单数据量
  const tabCounts = {
    recommend: products.filter(p => p.type === 'recommend').length,
    darkhorse: products.filter(p => p.type === 'darkhorse').length,
    new: products.filter(p => p.type === 'new').length,
  };

  // 动态表头标题
  const dynamicInfoTitle = activeTab === 'recommend' ? '爆款基本信息' : activeTab === 'darkhorse' ? '潜力黑马基本信息' : '新品基本信息';

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24">
        
        {/* AI Search Assistant Block */}
        <Card className="border-none shadow-sm overflow-hidden bg-gradient-to-r from-rose-50/40 via-white to-rose-50/20">
          <CardContent className="p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base md:text-lg">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>AI 选品助理</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">更新时间：今天 08:30 (每半小时智能同步)</span>
            </div>
            
            <div className="relative flex items-center bg-white border border-rose-200 rounded-2xl p-1 shadow-sm focus-within:ring-2 focus-within:ring-rose-400 focus-within:border-transparent transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-4 mr-2" />
              <input 
                type="text" 
                placeholder="探索美妆新商机：输入品类、核心功效或粘贴抖音/小红书分享链接..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400 py-3"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKey)}
              />
              <button 
                onClick={handleVoiceSearch}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl mr-2 transition-colors"
                title="语音搜索"
              >
                <Mic className="w-5 h-5" />
              </button>
              <Button onClick={() => handleSearch(searchKey)} className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl px-6 py-2">
                智能检索
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="text-slate-400 font-semibold">热门推荐词：</span>
                {['防晒霜', '多肽精华', '敏感修护', '平价唇蜜', '深层泥膜'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => handleSearch(tag)}
                    className="px-3 py-1 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-full transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              
              {searchHistory.length > 0 && (
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 历史搜索：
                  </span>
                  {searchHistory.map((tag, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSearchKey(tag)}
                      className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Entrance Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'recommend', title: '📈 爆款推荐榜', count: tabCounts.recommend, desc: '根据近7天多渠道销售环比增速智能综合排序', style: 'hover:border-rose-300' },
            { id: 'darkhorse', title: '🔥 潜力黑马榜', count: tabCounts.darkhorse, desc: '低佣高转化、社媒声量高频异动的潜力美妆', style: 'hover:border-amber-300' },
            { id: 'new', title: '🆕 新品爆款榜', count: tabCounts.new, desc: '入驻30天内实现销售裂变并完成数据转化的新星', style: 'hover:border-indigo-300' }
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <Card 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`cursor-pointer transition-all border ${isSelected ? 'border-rose-400 bg-rose-50/30' : 'border-slate-100 bg-white'} ${tab.style}`}
              >
                <CardContent className="p-5 flex flex-col gap-1 text-left">
                  <div className="flex justify-between items-center">
                    <span className={`font-bold text-sm ${isSelected ? 'text-rose-600' : 'text-slate-800'}`}>{tab.title}</span>
                    <Badge variant="secondary" className={cn("text-[10px]", isSelected ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500")}>
                      {tab.count} 条
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 leading-relaxed">{tab.desc}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters Panel */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <CardTitle className="text-sm font-bold text-slate-800">多维度爆款指标筛选</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)} 
              className="text-xs text-slate-500 hover:text-rose-500"
            >
              {showFilters ? '折叠筛选 ▲' : '展开筛选 ▼'}
            </Button>
          </CardHeader>

          {showFilters && (
            <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-500">主推品类</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="全部品类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部品类</SelectItem>
                    <SelectItem value="面霜">面霜</SelectItem>
                    <SelectItem value="精华">精华</SelectItem>
                    <SelectItem value="彩妆">彩妆</SelectItem>
                    <SelectItem value="防晒">防晒</SelectItem>
                    <SelectItem value="面膜">面膜</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-500">数据来源平台</label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="全部平台" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部平台</SelectItem>
                    <SelectItem value="dy">抖音电商 (DY)</SelectItem>
                    <SelectItem value="xhs">小红书置换 (XHS)</SelectItem>
                    <SelectItem value="tb">淘宝直通 (TB)</SelectItem>
                    <SelectItem value="ks">快手电商 (KS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-500">达人带货佣金率</label>
                <Select value={selectedCommission} onValueChange={setSelectedCommission}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="全部比例" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部比例</SelectItem>
                    <SelectItem value="high">高佣金 (25%及以上)</SelectItem>
                    <SelectItem value="mid">中佣金 (15%-25%)</SelectItem>
                    <SelectItem value="low">低利润 (15%以下)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-500">价格区间 (¥)</label>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="不限" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">不限</SelectItem>
                    <SelectItem value="0-100">¥0 - ¥100</SelectItem>
                    <SelectItem value="100-300">¥100 - ¥300</SelectItem>
                    <SelectItem value="300-500">¥300 - ¥500</SelectItem>
                    <SelectItem value="500+">¥500以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          )}
        </Card>

        {/* High Density Table & Operations */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-800">数据总表 ({filteredProducts.length} 条)</span>
              {selectedProductIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100">
                    已选 {selectedProductIds.length} 项对比
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200">
                <Columns className="w-3.5 h-3.5 mr-1" /> 自定义列表
              </Button>
              <Button onClick={triggerExport} variant="outline" size="sm" className="h-8 text-xs border-rose-200 text-rose-600 hover:bg-rose-50/50">
                <Download className="w-3.5 h-3.5 mr-1" /> 导出数据
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="w-[45px] text-center">
                    <Checkbox 
                      checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0} 
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    />
                  </TableHead>
                  <TableHead className="w-[60px] text-center font-bold">展开</TableHead>
                  <TableHead className="min-w-[260px]">{dynamicInfoTitle}</TableHead>
                  <TableHead className="text-right">主推均价</TableHead>
                  <TableHead className="text-right">累计销量</TableHead>
                  <TableHead className="text-right">周增速</TableHead>
                  <TableHead className="text-right">带货佣金率</TableHead>
                  <TableHead className="text-right">主推ROI</TableHead>
                  <TableHead className="text-right">转化率</TableHead>
                  <TableHead className="text-center w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((p) => {
                  const isExpanded = expandedRows.includes(p.id);
                  const isChecked = selectedProductIds.includes(p.id);
                  return (
                    <React.Fragment key={p.id}>
                      <TableRow className={cn(
                        "transition-all",
                        isExpanded ? 'bg-rose-50/20' : 'hover:bg-slate-50/50',
                        isChecked && "bg-rose-50/40"
                      )}>
                        {/* Checkbox - 勾选即对比 */}
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={isChecked} 
                            onCheckedChange={(checked) => handleSelectItem(p.id, !!checked)}
                          />
                        </TableCell>
                        
                        {/* Expand Trigger */}
                        <TableCell className="text-center">
                          <button 
                            onClick={() => toggleRow(p.id)}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-rose-500 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </TableCell>

                        {/* Product info */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={p.img} 
                              alt={p.name} 
                              className="w-12 h-12 object-cover rounded-lg shadow-sm border border-slate-100" 
                            />
                            <div className="text-left space-y-1">
                              <h4 className="font-bold text-xs text-slate-800 line-clamp-1 hover:text-rose-500 transition-colors cursor-pointer" onClick={() => setDetailProduct(p)}>
                                {p.name}
                              </h4>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.2 rounded-md uppercase">
                                  {p.platform === 'dy' && '抖音'}
                                  {p.platform === 'xhs' && '小红书'}
                                  {p.platform === 'tb' && '淘宝'}
                                  {p.platform === 'ks' && '快手'}
                                </span>
                                <span className="text-[10px] text-slate-400">{p.shop}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {p.tags.map(t => (
                                  <Badge key={t} variant="secondary" className="text-[9px] px-1 py-0 bg-rose-50 text-rose-600 border border-rose-100">
                                    {t}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Price */}
                        <TableCell className="text-right font-semibold text-xs text-slate-800">
                          ¥{p.price}
                        </TableCell>

                        {/* Sales */}
                        <TableCell className="text-right font-bold text-xs text-slate-800">
                          {(p.sales / 10000).toFixed(1)}万
                        </TableCell>

                        {/* Trend */}
                        <TableCell className="text-right font-bold text-xs text-green-600">
                          {p.salesTrend}
                        </TableCell>

                        {/* Commission */}
                        <TableCell className="text-right font-semibold text-xs text-rose-600">
                          {p.commission}
                        </TableCell>

                        {/* ROI */}
                        <TableCell className="text-right">
                          <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-800 text-[10px] font-bold border-none">
                            ROI {p.roi}
                          </Badge>
                        </TableCell>

                        {/* Conversion Rate */}
                        <TableCell className="text-right font-semibold text-slate-600">
                          {p.convRate}
                        </TableCell>

                        {/* Action buttons */}
                        <TableCell className="text-center">
                          <Button 
                            onClick={() => setDetailProduct(p)} 
                            size="sm" 
                            className="h-7 text-[11px] bg-rose-400 hover:bg-rose-500 text-white"
                          >
                            <Maximize2 className="w-3 h-3 mr-1" /> 立项详情
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expandable row */}
                      {isExpanded && (
                        <TableRow className="bg-rose-50/10 border-b border-rose-100/40">
                          <TableCell colSpan={10} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pl-14">
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">AI 选品研判</span>
                                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-rose-100/50">
                                  {p.aiReport}
                                </p>
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">近期销量走势</span>
                                <div className="h-24 bg-white rounded-lg border border-slate-100 p-2">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={p.historyData}>
                                      <Tooltip />
                                      <XAxis dataKey="date" hide />
                                      <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                                      <Line type="monotone" dataKey="sales" stroke="#f5756c" strokeWidth={2} dot={{ r: 3 }} />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination mock */}
        <div className="flex justify-between items-center text-xs text-slate-500 bg-white p-4 rounded-xl border border-slate-100">
          <span>显示 1-{filteredProducts.length} / 共 1,234 条</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>{"<"}</Button>
            <Button size="sm" className="h-8 w-8 p-0 bg-rose-400 hover:bg-rose-500 text-white">1</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">...</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">{">"}</Button>
          </div>
        </div>
      </div>

      {/* Floating Comparison Pool / Bar (Fixed at bottom) */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-white/95 backdrop-blur-md border-t border-rose-200 shadow-2xl p-4 z-40 transition-all flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-rose-500" />
              对比池 ({compareProducts.length}/4)
            </span>
            <span className="text-[10px] text-slate-400">勾选列表复选框即可加入对比，最多4件</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {compareProducts.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl shadow-sm">
                <img src={p.img} alt={p.name} className="w-6 h-6 rounded object-cover" />
                <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">{p.name}</span>
                <button 
                  onClick={() => handleRemoveFromCompare(p.id)}
                  className="text-slate-400 hover:text-rose-500 p-0.5 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              onClick={() => {
                setCompareProducts([]);
                setSelectedProductIds([]);
              }}
              variant="ghost" 
              size="sm" 
              className="text-xs text-slate-500 hover:text-rose-500"
            >
              清空
            </Button>
            <Button 
              onClick={() => setIsCompareOpen(true)}
              size="sm" 
              className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl"
            >
              进入同框对比
            </Button>
          </div>
        </div>
      )}

      {/* Product Compare Dialog (Modal popup) */}
      <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-rose-500" />
              商品同框多维度对比
            </DialogTitle>
            <DialogDescription>
              核心指标直接对照，辅助决策最佳投流推广方案。
            </DialogDescription>
          </DialogHeader>

          {compareProducts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">对比池中暂无商品</div>
          ) : (
            <div className="grid grid-cols-5 border border-slate-100 rounded-xl overflow-hidden mt-4 text-xs">
              {/* Dimensions Labels Column */}
              <div className="col-span-1 bg-slate-50/80 font-bold border-r border-b border-slate-100 flex flex-col justify-between p-3 space-y-6">
                <div></div>
                <div className="text-left font-semibold text-slate-500">价格 (¥)</div>
                <div className="text-left font-semibold text-slate-500">累计销量</div>
                <div className="text-left font-semibold text-slate-500">佣金比例</div>
                <div className="text-left font-semibold text-slate-500">行业转化率</div>
                <div className="text-left font-semibold text-slate-500">带货ROI</div>
                <div className="text-left font-semibold text-slate-500">AI研判简评</div>
                <div className="text-left font-semibold text-slate-500">操作</div>
              </div>

              {/* Compare Items Columns */}
              {Array.from({ length: 4 }).map((_, idx) => {
                const item = compareProducts[idx];
                if (!item) {
                  return (
                    <div key={idx} className="col-span-1 border-r border-b border-slate-100 bg-slate-50/20 p-4 flex flex-col items-center justify-center text-slate-300">
                      <HelpCircle className="w-8 h-8 mb-2 opacity-50" />
                      <span>待添加对比</span>
                    </div>
                  );
                }
                return (
                  <div key={item.id} className="col-span-1 border-r border-b border-slate-100 p-3 flex flex-col justify-between space-y-6">
                    <div className="text-center space-y-2">
                      <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded-lg mx-auto shadow-sm" />
                      <div className="font-bold text-[10px] text-slate-800 line-clamp-2">{item.name}</div>
                    </div>
                    <div className="text-center font-bold text-rose-500">¥{item.price}</div>
                    <div className="text-center font-semibold text-slate-700">{(item.sales / 10000).toFixed(1)}万</div>
                    <div className="text-center font-semibold text-rose-600">{item.commission}</div>
                    <div className="text-center font-semibold text-slate-600">{item.convRate}</div>
                    <div className="text-center">
                      <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-800 border-none font-bold text-[10px]">{item.roi}</Badge>
                    </div>
                    <div className="text-center text-[9px] text-slate-500 leading-normal line-clamp-4 bg-slate-50 p-2 rounded-lg">
                      {item.aiReport}
                    </div>
                    <div className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-rose-500 hover:bg-rose-50"
                        onClick={() => handleRemoveFromCompare(item.id)}
                      >
                        移除
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Detail Drawer */}
      <Sheet open={!!detailProduct} onOpenChange={() => setDetailProduct(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detailProduct && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2 text-rose-600">
                  <ArrowUpRight className="w-5 h-5" />
                  AI 智能诊断与立项表
                </SheetTitle>
                <SheetDescription className="text-left text-xs">
                  深度AI诊断该商品的市场红利、营销策略，并直接发起立项流转。
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 text-left text-xs">
                {/* Visual Section */}
                <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <img src={detailProduct.img} alt={detailProduct.name} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-800 leading-snug">{detailProduct.name}</h3>
                    <p className="text-slate-400">{detailProduct.shop}</p>
                    <div className="flex gap-1.5 mt-2">
                      {detailProduct.tags.map(t => (
                        <Badge key={t} className="bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-50 text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Indicators */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 border border-slate-100 rounded-lg bg-white shadow-sm">
                    <span className="text-[10px] text-slate-400 block mb-0.5">主推均价</span>
                    <span className="text-sm font-bold text-rose-500">¥{detailProduct.price}</span>
                  </div>
                  <div className="p-2.5 border border-slate-100 rounded-lg bg-white shadow-sm">
                    <span className="text-[10px] text-slate-400 block mb-0.5">带货佣金率</span>
                    <span className="text-sm font-bold text-rose-600">{detailProduct.commission}</span>
                  </div>
                  <div className="p-2.5 border border-slate-100 rounded-lg bg-white shadow-sm">
                    <span className="text-[10px] text-slate-400 block mb-0.5">引流转化率</span>
                    <span className="text-sm font-bold text-slate-700">{detailProduct.convRate}</span>
                  </div>
                  <div className="p-2.5 border border-slate-100 rounded-lg bg-white shadow-sm">
                    <span className="text-[10px] text-slate-400 block mb-0.5">主推ROI</span>
                    <span className="text-sm font-bold text-slate-700">{detailProduct.roi}</span>
                  </div>
                </div>

                {/* AI diagnosis */}
                <div className="space-y-2 bg-gradient-to-br from-rose-50/40 to-rose-50/10 border border-rose-100 p-4 rounded-xl">
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI 选品诊断研判
                  </span>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {detailProduct.aiReport}
                  </p>
                </div>

                {/* Interactive Project Initiation Form */}
                <form onSubmit={handleCreateProject} className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Award className="w-4 h-4 text-rose-400" />
                    <span>智能立项配置</span>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-slate-500 font-medium">新品方案名称</Label>
                    <Input 
                      placeholder="例：2026夏日新选品-[紧致面霜]快速测试计划" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-slate-500 font-medium">主推广平台</Label>
                      <Select value={projectChannel} onValueChange={setProjectChannel}>
                        <SelectTrigger className="bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dy">抖音直播/千川</SelectItem>
                          <SelectItem value="xhs">小红书置换KOL</SelectItem>
                          <SelectItem value="tb">淘宝直播</SelectItem>
                          <SelectItem value="ks">快手挂车</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-500 font-medium">预估首批备货 (件)</Label>
                      <Input 
                        type="number"
                        placeholder="1000" 
                        value={initialStock}
                        onChange={(e) => setInitialStock(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-slate-500 font-medium">研发/投流备注（选填）</Label>
                    <Input 
                      placeholder="添加对研发方向、主打卖点、预算的要求..." 
                      value={projectNotes}
                      onChange={(e) => setProjectNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50"
                      onClick={() => handleSelectItem(detailProduct.id, true)}
                    >
                      加入对比池
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 bg-rose-400 hover:bg-rose-500 text-white rounded-xl"
                    >
                      一键同步立项
                    </Button>
                  </div>
                </form>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default SelectionEngine;