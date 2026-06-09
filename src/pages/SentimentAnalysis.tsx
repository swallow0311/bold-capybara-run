import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  TrendingDown, TrendingUp, MessageSquare, Lightbulb, ArrowRight,
  AlertCircle, Package, Truck, Filter, Download, Plus, Copy,
  Heart, Database, RefreshCw, BarChart3, HelpCircle, FileText, CheckCircle2,
  Calendar, Check, Settings2, Sparkles, Send, ShieldAlert,
  Search, Eye, Trash2, FileSpreadsheet, Sparkle, ChevronDown
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 丰富的高维度产品及评论 Mock 数据
const PRODUCTS_DATA = [
  {
    id: 'p1',
    name: '中达酵母御龄紧致面霜',
    goodRate: '92%',
    badRate: '7%',
    sellPoints: ['抗老紧致', '深层锁水', '温和无敏', '吸收快', '包装精美'],
    painPoints: ['过敏红肿', '闷痘长粉刺', '质地偏油', '泵头难按', '客服回复慢'],
    wordCloud: {
      positive: [
        { text: '好用', size: 22, color: 'text-rose-500 font-bold' },
        { text: '水润', size: 18, color: 'text-rose-400 font-semibold' },
        { text: '温和', size: 16, color: 'text-amber-500' },
        { text: '正品', size: 14, color: 'text-emerald-500' },
        { text: '包装精美', size: 12, color: 'text-slate-500' }
      ],
      negative: [
        { text: '刺痛', size: 22, color: 'text-red-500 font-bold' },
        { text: '太油', size: 18, color: 'text-orange-500 font-semibold' },
        { text: '闷痘', size: 16, color: 'text-amber-600' },
        { text: '难按', size: 14, color: 'text-slate-600' },
        { text: '客服慢', size: 12, color: 'text-slate-400' }
      ]
    },
    sellPointsTable: [
      { word: '抗老紧致', heat: 95, count: 45, tag: '核心卖点' },
      { word: '深层锁水', heat: 88, count: 32, tag: '强效补水' },
      { word: '温和无敏', heat: 75, count: 18, tag: '安全配方' }
    ],
    painPointsTable: [
      { word: '过敏红肿', freq: 12, quote: '用了两次脸就红了，刺痛感很明显', category: '质量' },
      { word: '闷痘长粉刺', freq: 8, quote: '夏天用真的太油了，第二天就长了两个大痘', category: '质量' },
      { word: '泵头难按', freq: 5, quote: '按压头设计不科学，按不出来', category: '尺寸' }
    ],
    dimensionHeat: [
      { name: '温和度', value: 92 },
      { name: '保湿度', value: 85 },
      { name: '抗老功效', value: 78 },
      { name: '包装设计', value: 60 },
      { name: '客服态度', value: 45 }
    ],
    reviews: [
      { text: "面霜效果很好，用了两次脸就红了，刺痛感很明显，不敢再用了。", polarity: "差评", category: "质量", entities: ["刺痛感", "红"], isSpam: false, length: 30 },
      { text: "夏天用真的太油了，第二天就长了两个大痘，配方可能不太适合我这种油皮。", polarity: "差评", category: "质量", entities: ["太油", "长痘"], isSpam: false, length: 35 },
      { text: "按压头设计不科学，按不出来，出液很不均匀，弄得一手都是。", polarity: "差评", category: "尺寸", entities: ["按压头", "出液不均"], isSpam: false, length: 28 },
      { text: "顺丰很快，昨天下单今天就到了，包装很精美，还有一堆赠品！", polarity: "好评", category: "物流", entities: ["顺丰很快", "包装精美"], isSpam: false, length: 29 },
      { text: "请问这个面霜敏感肌可以用吗？用完会不会过敏啊？", polarity: "咨询", category: "客服", entities: ["敏感肌", "过敏"], isSpam: false, length: 22 },
      { text: "客服态度太敷衍了，问了半天都是机器人自动回复，根本不理人。", polarity: "差评", category: "客服", entities: ["客服态度", "机器人"], isSpam: false, length: 27 },
      { text: "产品味道怪怪的，有种化学塑料的气味，跟专柜买的完全不一样。", polarity: "差评", category: "色差", entities: ["化学气味"], isSpam: false, length: 29 },
      { text: "质地非常水润，推开后一秒化水，控油效果能维持大半天！", polarity: "好评", category: "质量", entities: ["水润", "控油"], isSpam: false, length: 25 },
      { text: "刷单返现加微信：123456，好评有礼！", polarity: "好评", category: "客服", entities: ["刷单"], isSpam: true, length: 18 },
      { text: "好用", polarity: "好评", category: "质量", entities: ["好用"], isSpam: false, length: 2 }
    ]
  },
  {
    id: 'p2',
    name: '中达修护舒缓多肽精华液',
    goodRate: '94%',
    badRate: '5%',
    sellPoints: ['屏障修护', '舒缓红血丝', '清爽不粘腻', '高活性多肽', '吸收极快'],
    painPoints: ['略微粘稠', '味道偏淡', '滴管不好用', '见效慢', '价格偏高'],
    wordCloud: {
      positive: [
        { text: '修护', size: 22, color: 'text-rose-500 font-bold' },
        { text: '舒缓', size: 18, color: 'text-rose-400 font-semibold' },
        { text: '清爽', size: 16, color: 'text-amber-500' },
        { text: '退红', size: 14, color: 'text-emerald-500' },
        { text: '好吸收', size: 12, color: 'text-slate-500' }
      ],
      negative: [
        { text: '粘稠', size: 22, color: 'text-red-500 font-bold' },
        { text: '见效慢', size: 18, color: 'text-orange-500 font-semibold' },
        { text: '滴管', size: 16, color: 'text-amber-600' },
        { text: '偏贵', size: 14, color: 'text-slate-600' },
        { text: '无感', size: 12, color: 'text-slate-400' }
      ]
    },
    sellPointsTable: [
      { word: '屏障修护', heat: 92, count: 38, tag: '核心卖点' },
      { word: '舒缓红血丝', heat: 85, count: 24, tag: '退红舒缓' },
      { word: '清爽不粘腻', heat: 78, count: 15, tag: '肤感极佳' }
    ],
    painPointsTable: [
      { word: '略微粘稠', freq: 6, quote: '刚上脸有点粘，过一会吸收了还好', category: '质量' },
      { word: '滴管不好用', freq: 4, quote: '滴管吸不上来，设计有点鸡肋', category: '尺寸' },
      { word: '见效慢', freq: 3, quote: '用了一周感觉没啥大变化，可能需要坚持', category: '质量' }
    ],
    dimensionHeat: [
      { name: '修护力', value: 95 },
      { name: '温和度', value: 90 },
      { name: '吸收度', value: 88 },
      { name: '包装设计', value: 55 },
      { name: '性价比', value: 40 }
    ],
    reviews: [
      { text: "修护效果绝了，脸上的红血丝明显淡了，皮肤状态稳定了很多。", polarity: "好评", category: "质量", entities: ["修护", "红血丝"], isSpam: false, length: 30 },
      { text: "刚上脸有点粘，过一会吸收了还好，味道淡淡的几乎没有。", polarity: "中性", category: "质量", entities: ["粘", "味道淡"], isSpam: false, length: 28 },
      { text: "滴管吸不上来，设计有点鸡肋，每次都要按好几下。", polarity: "差评", category: "尺寸", entities: ["滴管", "设计"], isSpam: false, length: 25 },
      { text: "用了一周感觉没啥大变化，可能需要坚持用吧，价格稍微有点贵。", polarity: "差评", category: "质量", entities: ["见效慢", "价格贵"], isSpam: false, length: 32 },
      { text: "刷单返现加微信：123456，好评有礼！", polarity: "好评", category: "客服", entities: ["刷单"], isSpam: true, length: 18 },
      { text: "好用", polarity: "好评", category: "质量", entities: ["好用"], isSpam: false, length: 2 }
    ]
  }
];

const SentimentAnalysis = () => {
  // 筛选项状态
  const [dataSource, setDataSource] = useState('sync');
  const [productFilter, setProductFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('30');
  const [polarityFilter, setPolarityFilter] = useState('all');

  // 规则设置状态
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [rules, setRules] = useState({
    sentiment: true,
    sellPoint: true,
    painPoint: true,
    qa: true,
    wordCloud: true,
    spamFilter: true,
    shortFilter: true
  });

  // 选中的产品（默认选中第一个）
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS_DATA[0]>(PRODUCTS_DATA[0]);

  // 穿透查看明细弹窗状态
  const [drillDownMetric, setDrillDownMetric] = useState<string | null>(null);
  const [drillDownProduct, setDrillDownProduct] = useState<typeof PRODUCTS_DATA[0] | null>(null);
  const [wordFilter, setWordFilter] = useState<string | null>(null);

  // 动态计算每个产品的统计数值（根据规则设置实时变化）
  const computedProducts = useMemo(() => {
    return PRODUCTS_DATA.map(product => {
      const reviews = product.reviews;
      
      // 过滤规则
      const spamReviews = reviews.filter(r => r.isSpam);
      const shortReviews = reviews.filter(r => r.length < 3);
      
      let validReviews = [...reviews];
      if (rules.spamFilter) {
        validReviews = validReviews.filter(r => !r.isSpam);
      }
      if (rules.shortFilter) {
        validReviews = validReviews.filter(r => r.length >= 3);
      }

      const validGood = validReviews.filter(r => r.polarity === '好评').length;
      const validBad = validReviews.filter(r => r.polarity === '差评').length;
      
      const invalidReviews = reviews.filter(r => 
        (rules.spamFilter && r.isSpam) || (rules.shortFilter && r.length < 3)
      );
      const invalidCount = invalidReviews.length;

      const good = reviews.filter(r => r.polarity === '好评').length;
      const bad = reviews.filter(r => r.polarity === '差评').length;
      const total = reviews.length;

      return {
        ...product,
        validGood,
        validBad,
        invalid: invalidCount,
        good,
        bad,
        total
      };
    });
  }, [rules]);

  // 过滤后的产品列表
  const filteredProducts = useMemo(() => {
    if (productFilter === 'all') return computedProducts;
    return computedProducts.filter(p => p.id === productFilter);
  }, [computedProducts, productFilter]);

  // 穿透明细过滤逻辑
  const drillDownReviews = useMemo(() => {
    if (!drillDownProduct || !drillDownMetric) return [];
    let list = [...drillDownProduct.reviews];

    // 基础过滤
    if (drillDownMetric === 'validGood') {
      list = list.filter(r => r.polarity === '好评');
      if (rules.spamFilter) list = list.filter(r => !r.isSpam);
      if (rules.shortFilter) list = list.filter(r => r.length >= 3);
    } else if (drillDownMetric === 'validBad') {
      list = list.filter(r => r.polarity === '差评');
      if (rules.spamFilter) list = list.filter(r => !r.isSpam);
      if (rules.shortFilter) list = list.filter(r => r.length >= 3);
    } else if (drillDownMetric === 'invalid') {
      list = list.filter(r => (rules.spamFilter && r.isSpam) || (rules.shortFilter && r.length < 3));
    } else if (drillDownMetric === 'good') {
      list = list.filter(r => r.polarity === '好评');
    } else if (drillDownMetric === 'bad') {
      list = list.filter(r => r.polarity === '差评');
    }

    // 词云点击穿透过滤
    if (wordFilter) {
      list = list.filter(r => r.text.includes(wordFilter));
    }

    return list;
  }, [drillDownProduct, drillDownMetric, wordFilter, rules]);

  // 穿透弹窗标题
  const drillDownTitle = useMemo(() => {
    if (!drillDownProduct || !drillDownMetric) return '';
    const metricNames: any = {
      validGood: '有效好评明细',
      validBad: '有效差评明细',
      invalid: '无效评论明细',
      good: '好评明细',
      bad: '差评明细',
      total: '总评论明细'
    };
    return `${drillDownProduct.name} - ${metricNames[drillDownMetric]}${wordFilter ? ` (包含关键词: ${wordFilter})` : ''}`;
  }, [drillDownProduct, drillDownMetric, wordFilter]);

  // 详情面板图表数据
  const pieData = useMemo(() => {
    if (!selectedProduct) return [];
    const good = selectedProduct.reviews.filter(r => r.polarity === '好评').length;
    const bad = selectedProduct.reviews.filter(r => r.polarity === '差评').length;
    const neutral = selectedProduct.reviews.filter(r => r.polarity === '中性').length;
    const qa = selectedProduct.reviews.filter(r => r.polarity === '咨询').length;
    return [
      { name: '好评', value: good, color: '#f5756c' },
      { name: '差评', value: bad, color: '#fca39d' },
      { name: '中性', value: neutral, color: '#fedcd9' },
      { name: '咨询', value: qa, color: '#94a3b8' }
    ];
  }, [selectedProduct]);

  const barData = useMemo(() => {
    if (!selectedProduct) return [];
    const quality = selectedProduct.reviews.filter(r => r.category === '质量' && r.polarity === '差评').length;
    const logistics = selectedProduct.reviews.filter(r => r.category === '物流' && r.polarity === '差评').length;
    const size = selectedProduct.reviews.filter(r => r.category === '尺寸' && r.polarity === '差评').length;
    const colorDiff = selectedProduct.reviews.filter(r => r.category === '色差' && r.polarity === '差评').length;
    const service = selectedProduct.reviews.filter(r => r.category === '客服' && r.polarity === '差评').length;
    return [
      { name: '质量', 频次: quality },
      { name: '物流', 频次: logistics },
      { name: '尺寸', 频次: size },
      { name: '色差', 频次: colorDiff },
      { name: '客服', 频次: service }
    ];
  }, [selectedProduct]);

  const handleWordClick = (word: string, metric: 'good' | 'bad') => {
    setWordFilter(word);
    setDrillDownProduct(selectedProduct);
    setDrillDownMetric(metric);
    showSuccess(`已筛选包含“${word}”的原始评价明细`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-800 text-xs text-left">
        
        {/* 顶部筛选项与操作栏 */}
        <Card className="border-none shadow-sm shrink-0 bg-white">
          <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">数据源</span>
                <Select value={dataSource} onValueChange={setDataSource}>
                  <SelectTrigger className="w-[140px] h-9 bg-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sync">本店商品同步</SelectItem>
                    <SelectItem value="manual">手动导入文本</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">所属产品</span>
                <Select value={productFilter} onValueChange={setProductFilter}>
                  <SelectTrigger className="w-[200px] h-9 bg-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部产品</SelectItem>
                    {PRODUCTS_DATA.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">时间段</span>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[110px] h-9 bg-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">近 7 天</SelectItem>
                    <SelectItem value="30">近 30 天</SelectItem>
                    <SelectItem value="all">全部评价</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">极性筛选</span>
                <Select value={polarityFilter} onValueChange={setPolarityFilter}>
                  <SelectTrigger className="w-[110px] h-9 bg-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部极性</SelectItem>
                    <SelectItem value="好评">仅看好评</SelectItem>
                    <SelectItem value="差评">仅看差评</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => showSuccess("报告已成功导出。")} className="h-9 text-xs border-slate-200">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                导出
              </Button>
              <Button variant="outline" onClick={() => setIsRulesOpen(true)} className="h-9 text-xs border-rose-200 text-rose-600 hover:bg-rose-50">
                <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                规则设置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 主体内容区：左侧产品列表，右侧评论记录详情页 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* 左侧产品维度列表 */}
          <Card className="xl:col-span-7 border-none shadow-sm overflow-hidden flex flex-col bg-white">
            <CardHeader className="py-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Database className="w-4 h-4 text-rose-400" />
                产品维度评价统计列表
              </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[650px]">
              <Table>
                <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="text-xs">所属产品</TableHead>
                    <TableHead className="text-xs text-right">有效好评数</TableHead>
                    <TableHead className="text-xs text-right">有效差评数</TableHead>
                    <TableHead className="text-xs text-right">无效评论数</TableHead>
                    <TableHead className="text-xs text-right">好评数</TableHead>
                    <TableHead className="text-xs text-right">差评数</TableHead>
                    <TableHead className="text-xs text-right">总评论数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((p) => (
                    <TableRow 
                      key={p.id} 
                      className={cn(
                        "cursor-pointer transition-colors text-xs",
                        selectedProduct?.id === p.id ? "bg-rose-50/30" : "hover:bg-slate-50/50"
                      )}
                      onClick={() => setSelectedProduct(p)}
                    >
                      <TableCell className="font-bold text-slate-700 max-w-[180px] truncate">{p.name}</TableCell>
                      
                      {/* 有效好评数 */}
                      <TableCell className="text-right">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrillDownProduct(p);
                            setDrillDownMetric('validGood');
                            setWordFilter(null);
                          }}
                          className="text-rose-500 hover:underline font-semibold cursor-pointer"
                        >
                          {p.validGood}
                        </span>
                      </TableCell>

                      {/* 有效差评数 */}
                      <TableCell className="text-right">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrillDownProduct(p);
                            setDrillDownMetric('validBad');
                            setWordFilter(null);
                          }}
                          className="text-rose-500 hover:underline font-semibold cursor-pointer"
                        >
                          {p.validBad}
                        </span>
                      </TableCell>

                      {/* 无效评论数 */}
                      <TableCell className="text-right">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrillDownProduct(p);
                            setDrillDownMetric('invalid');
                            setWordFilter(null);
                          }}
                          className="text-rose-500 hover:underline font-semibold cursor-pointer"
                        >
                          {p.invalid}
                        </span>
                      </TableCell>

                      {/* 好评数 */}
                      <TableCell className="text-right">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrillDownProduct(p);
                            setDrillDownMetric('good');
                            setWordFilter(null);
                          }}
                          className="text-rose-500 hover:underline font-semibold cursor-pointer"
                        >
                          {p.good}
                        </span>
                      </TableCell>

                      {/* 差评数 */}
                      <TableCell className="text-right">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrillDownProduct(p);
                            setDrillDownMetric('bad');
                            setWordFilter(null);
                          }}
                          className="text-rose-500 hover:underline font-semibold cursor-pointer"
                        >
                          {p.bad}
                        </span>
                      </TableCell>

                      {/* 总评论数 */}
                      <TableCell className="text-right">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrillDownProduct(p);
                            setDrillDownMetric('total');
                            setWordFilter(null);
                          }}
                          className="text-rose-500 hover:underline font-semibold cursor-pointer"
                        >
                          {p.total}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>

          {/* 右侧评论记录详情页 */}
          <Card className="xl:col-span-5 border-none shadow-sm flex flex-col overflow-hidden bg-white">
            <CardHeader className="py-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-400" />
                商品评论整体分析数据
              </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[650px]">
              {selectedProduct ? (
                <div className="p-5 space-y-6 text-left">
                  
                  {/* 5.1 数据概览卡片 */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">5.1 数据概览</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                        <span className="text-[10px] text-slate-400 block mb-1">总评价数</span>
                        <span className="text-lg font-bold text-slate-800">{selectedProduct.total}</span>
                      </div>
                      <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/50 text-center">
                        <span className="text-[10px] text-emerald-600 block mb-1">好评率</span>
                        <span className="text-lg font-bold text-emerald-600">{selectedProduct.goodRate}</span>
                      </div>
                      <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100/50 text-center">
                        <span className="text-[10px] text-rose-600 block mb-1">差评率</span>
                        <span className="text-lg font-bold text-rose-600">{selectedProduct.badRate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold block mb-1.5">高频卖点 TOP5</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedProduct.sellPoints.map(p => (
                            <Badge key={p} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-medium">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold block mb-1.5">高频痛点 TOP5</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedProduct.painPoints.map(p => (
                            <Badge key={p} className="bg-rose-50 text-rose-700 border border-rose-100 text-[9px] font-medium">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5.2 可视化图表 */}
                  <div className="space-y-4">
                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">5.2 可视化图表</Label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* 情感分布饼图 */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 h-[180px] flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">情感分布</span>
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={pieData} innerRadius={30} outerRadius={45} paddingAngle={3} dataKey="value">
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-2 text-[8px] text-slate-400 mt-1">
                          <span>● 好评</span>
                          <span>● 差评</span>
                          <span>● 中性</span>
                        </div>
                      </div>

                      {/* 差评归因柱状图 */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 h-[180px] flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">差评归因</span>
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                              <XAxis dataKey="name" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                              <Tooltip />
                              <Bar dataKey="频次" fill="#fca39d" radius={[3, 3, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* 维度热度排行 */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <span className="text-[10px] text-slate-500 font-bold block">维度热度排行</span>
                      <div className="space-y-2">
                        {selectedProduct.dimensionHeat.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[9px] font-semibold text-slate-600">
                              <span>{item.name}</span>
                              <span>{item.value}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-400 rounded-full" style={{ width: `${item.value}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 5.3 词云预览 */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">5.3 词云预览 (点击词跳转对应原始评价)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* 好评词云 */}
                      <div className="p-3 bg-emerald-50/20 rounded-xl border border-emerald-100/50">
                        <span className="text-[10px] text-emerald-700 font-bold block mb-2">好评词云</span>
                        <div className="flex flex-wrap gap-2 justify-center items-center min-h-[80px]">
                          {selectedProduct.wordCloud.positive.map((w, idx) => (
                            <span 
                              key={idx} 
                              onClick={() => handleWordClick(w.text, 'good')}
                              className={cn("cursor-pointer hover:underline transition-all", w.color)}
                              style={{ fontSize: `${w.size}px` }}
                            >
                              {w.text}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 差评词云 */}
                      <div className="p-3 bg-rose-50/20 rounded-xl border border-rose-100/50">
                        <span className="text-[10px] text-rose-700 font-bold block mb-2">差评词云</span>
                        <div className="flex flex-wrap gap-2 justify-center items-center min-h-[80px]">
                          {selectedProduct.wordCloud.negative.map((w, idx) => (
                            <span 
                              key={idx} 
                              onClick={() => handleWordClick(w.text, 'bad')}
                              className={cn("cursor-pointer hover:underline transition-all", w.color)}
                              style={{ fontSize: `${w.size}px` }}
                            >
                              {w.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5.4 结构化表格 */}
                  <div className="space-y-4">
                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">5.4 结构化表格</Label>
                    
                    {/* 5.4.1 正向卖点表 */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-bold block">5.4.1 正向卖点表</span>
                      <div className="border border-slate-100 rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow>
                              <TableHead className="text-[10px] py-1.5">卖点词</TableHead>
                              <TableHead className="text-[10px] py-1.5 text-right">热度</TableHead>
                              <TableHead className="text-[10px] py-1.5 text-right">关联评价条数</TableHead>
                              <TableHead className="text-[10px] py-1.5 text-center">情感标签</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedProduct.sellPointsTable.map((row, idx) => (
                              <TableRow key={idx} className="hover:bg-slate-50/50">
                                <TableCell className="py-1.5 font-bold text-slate-700">{row.word}</TableCell>
                                <TableCell className="py-1.5 text-right font-semibold text-rose-500">{row.heat}</TableCell>
                                <TableCell className="py-1.5 text-right">{row.count} 条</TableCell>
                                <TableCell className="py-1.5 text-center">
                                  <Badge className="bg-emerald-50 text-emerald-700 border-none text-[9px]">{row.tag}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* 5.4.2 负面痛点表 */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-bold block">5.4.2 负面痛点表</span>
                      <div className="border border-slate-100 rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow>
                              <TableHead className="text-[10px] py-1.5">痛点词</TableHead>
                              <TableHead className="text-[10px] py-1.5 text-right">出现频次</TableHead>
                              <TableHead className="text-[10px] py-1.5">差评典型原文</TableHead>
                              <TableHead className="text-[10px] py-1.5 text-center">问题归类</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedProduct.painPointsTable.map((row, idx) => (
                              <TableRow key={idx} className="hover:bg-slate-50/50">
                                <TableCell className="py-1.5 font-bold text-slate-700">{row.word}</TableCell>
                                <TableCell className="py-1.5 text-right font-semibold text-rose-500">{row.freq}</TableCell>
                                <TableCell className="py-1.5 max-w-[120px] truncate text-slate-500" title={row.quote}>{row.quote}</TableCell>
                                <TableCell className="py-1.5 text-center">
                                  <Badge className="bg-rose-50 text-rose-700 border-none text-[9px]">{row.category}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center opacity-40">
                  <AlertCircle className="w-16 h-16 text-slate-300" />
                  <p className="text-sm font-bold text-slate-500">请选择左侧产品查看整体分析</p>
                </div>
              )}
            </ScrollArea>
          </Card>

        </div>
      </div>

      {/* 穿透查看明细弹窗 */}
      <Dialog open={!!drillDownMetric} onOpenChange={() => { setDrillDownMetric(null); setWordFilter(null); }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <Sparkles className="w-5 h-5 text-rose-500" />
              {drillDownTitle}
            </DialogTitle>
            <DialogDescription>
              穿透查看该指标下的原始评价明细，并按每条分析对应的“情感、分类、实体”。
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 mt-4 border border-slate-100 rounded-xl">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-xs">评价原文</TableHead>
                  <TableHead className="text-xs text-center w-[80px]">情感</TableHead>
                  <TableHead className="text-xs text-center w-[100px]">分类</TableHead>
                  <TableHead className="text-xs">实体</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drillDownReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                      暂无符合过滤规则的评价明细
                    </TableCell>
                  </TableRow>
                ) : (
                  drillDownReviews.map((r, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/50 text-xs">
                      <TableCell className="font-medium text-slate-700 leading-relaxed">{r.text}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "border-none text-[10px] font-bold",
                          r.polarity === '好评' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        )}>
                          {r.polarity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-[10px]">{r.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {r.entities.map(e => (
                            <Badge key={e} className="bg-rose-50 text-rose-600 border border-rose-100 text-[9px]">
                              {e}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* 规则设置抽屉 */}
      <Sheet open={isRulesOpen} onOpenChange={setIsRulesOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto flex flex-col">
          <SheetHeader className="pb-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-rose-500" />
              <SheetTitle>合规质检与过滤规则设置</SheetTitle>
            </div>
            <SheetDescription>
              自定义AI分析维度与数据过滤规则，设置后列表统计数值将实时更新。
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-6 space-y-6 text-xs text-left">
            {/* 分析维度自定义开关 */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Sparkle className="w-4 h-4 text-rose-500" />
                分析维度自定义开关
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/60">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">情感分类</p>
                    <p className="text-[10px] text-slate-400">自动识别好评、差评、中性及咨询意图</p>
                  </div>
                  <Switch 
                    checked={rules.sentiment} 
                    onCheckedChange={(checked) => setRules(prev => ({ ...prev, sentiment: checked }))} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/60">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">卖点提取</p>
                    <p className="text-[10px] text-slate-400">智能提炼正向高频卖点与核心优势</p>
                  </div>
                  <Switch 
                    checked={rules.sellPoint} 
                    onCheckedChange={(checked) => setRules(prev => ({ ...prev, sellPoint: checked }))} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/60">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">差评归因</p>
                    <p className="text-[10px] text-slate-400">深度剖析负面评价的质量、物流、服务等归因</p>
                  </div>
                  <Switch 
                    checked={rules.painPoint} 
                    onCheckedChange={(checked) => setRules(prev => ({ ...prev, painPoint: checked }))} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/60">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">问答解析</p>
                    <p className="text-[10px] text-slate-400">提取高频售前咨询意图与痛点疑虑</p>
                  </div>
                  <Switch 
                    checked={rules.qa} 
                    onCheckedChange={(checked) => setRules(prev => ({ ...prev, qa: checked }))} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/60">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">词云生成</p>
                    <p className="text-[10px] text-slate-400">提取高频词汇并生成可视化交互词云</p>
                  </div>
                  <Switch 
                    checked={rules.wordCloud} 
                    onCheckedChange={(checked) => setRules(prev => ({ ...prev, wordCloud: checked }))} 
                  />
                </div>
              </div>
            </div>

            {/* 过滤规则配置 */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-rose-500" />
                过滤规则配置
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/60">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">开启水军过滤</p>
                    <p className="text-[10px] text-slate-400">自动拦截“刷单”、“返现”等无价值水军评价</p>
                  </div>
                  <Switch 
                    checked={rules.spamFilter} 
                    onCheckedChange={(checked) => setRules(prev => ({ ...prev, spamFilter: checked }))} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/60">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">过滤低于 3 个字短评</p>
                    <p className="text-[10px] text-slate-400">自动剔除“好用”、“不错”等无实质分析价值的极短评</p>
                  </div>
                  <Switch 
                    checked={rules.shortFilter} 
                    onCheckedChange={(checked) => setRules(prev => ({ ...prev, shortFilter: checked }))} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setIsRulesOpen(false)}>取消</Button>
            <Button size="sm" className="bg-rose-400 hover:bg-rose-500 text-white" onClick={() => {
              setIsRulesOpen(false);
              showSuccess("质检与过滤规则配置已成功应用！");
            }}>保存配置</Button>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

// 简易 Select 组件封装
const Select = ({ children, value, onValueChange }: any) => (
  <div className="relative">
    <select 
      value={value} 
      onChange={(e) => onValueChange?.(e.target.value)}
      className="w-full h-9 px-3 pr-8 text-xs bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-rose-300"
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
  </div>
);

const SelectTrigger = ({ children, className }: any) => <div className={className}>{children}</div>;
const SelectValue = ({ placeholder }: any) => <span>{placeholder}</span>;
const SelectContent = ({ children }: any) => <>{children}</>;
const SelectItem = ({ value, children }: any) => <option value={value}>{children}</option>;

export default SentimentAnalysis;