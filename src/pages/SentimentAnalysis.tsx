import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingDown, TrendingUp, MessageSquare, Lightbulb, ArrowRight,
  AlertCircle, Package, Truck, Filter, Download, Plus, Copy,
  Heart, Database, RefreshCw, BarChart3, HelpCircle, FileText, CheckCircle2,
  Calendar, Check, Settings2, Sparkles, Send, ShieldAlert, ShieldCheck,
  Search, Eye, Trash2, FileSpreadsheet, Sparkle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 原始评价与NLP抽取实体标签的模拟数据库
const MOCK_RAW_REVIEWS = [
  { id: 1, text: "面霜效果很好，用了两次脸就红了，刺痛感很明显，不敢再用了。", polarity: "差评", category: "质量", entities: ["刺痛感", "红"], time: "2026-05-20 10:30", suggestion: "该评价反映了明显的‘刺痛’与‘发红’过敏症状。建议在AIGC内容工厂中生成文案时，强调‘无敏配方、专为敏感脆弱肌研发’，并避免夸大瞬时功效。" },
  { id: 2, text: "夏天用真的太油了，第二天就长了两个大痘，配方可能不太适合我这种油皮。", polarity: "差评", category: "质量", entities: ["太油", "长痘"], time: "2026-05-20 11:15", suggestion: "用户痛点为‘夏日闷油长痘’。建议在推广时主打‘轻薄乳霜质地，夏日轻盈无负担’，引导油痘肌用户避开厚涂。" },
  { id: 3, text: "按压头设计不科学，按不出来，出液很不均匀，弄得一手都是。", polarity: "差评", category: "尺寸", entities: ["按压头", "出液不均"], time: "2026-05-20 12:00", suggestion: "属于包装器械设计缺陷。已将‘按压头难用’痛点同步产品研发中心；营销端可引导用户垂直按压或轻拍泵头排气。" },
  { id: 4, text: "顺丰很快，昨天下单今天就到了，包装很精美，还有一堆赠品！", polarity: "好评", category: "物流", entities: ["顺丰很快", "包装精美"], time: "2026-05-20 14:20", suggestion: "优质正向反馈，强调了‘物流时效’与‘精美包装’。可作为核心买点导入文案，如‘顺丰直达，高奢礼盒尊享’。" },
  { id: 5, text: "请问这个面霜敏感肌可以用吗？用完会不会过敏啊？", polarity: "咨询", category: "客服", entities: ["敏感肌", "过敏"], time: "2026-05-20 15:45", suggestion: "属于高频售前疑虑。AI客服话术已自动关联：‘产品通过无敏测试，特添积雪草舒缓成分，敏感肌可安心使用。’" },
  { id: 6, text: "客服态度太敷衍了，问了半天都是机器人自动回复，根本不理人。", polarity: "差评", category: "客服", entities: ["客服态度", "机器人"], time: "2026-05-20 16:10", suggestion: "客服响应体验不佳。建议店铺优化智能客服转人工的逻辑阈值，在大促期间增加人工客服排班。" },
  { id: 7, text: "产品味道怪怪的，有种化学塑料的气味，跟专柜买的完全不一样，怀疑是色差或者版本不对。", polarity: "差评", category: "色差", entities: ["化学气味", "专柜"], time: "2026-05-20 16:40", suggestion: "味道与版本差异疑虑。建议在详情页首屏显著位置补充‘自研防伪溯源码’与‘无香精添加天然气味说明’。" },
  { id: 8, text: "质地非常水润，推开后一秒化水，控油效果能维持大半天！", polarity: "好评", category: "质量", entities: ["水润", "控油"], time: "2026-05-20 17:02", suggestion: "极佳的功效种草点。建议同步至短视频口播文案：‘一抹化水，大汗淋漓也能清爽控油一整天’。" }
];

const CATEGORY_DEFAULT_SELL_POINTS = {
  cosmetics: ['强效屏障修护', '28天抗老淡纹', '清爽控油不粘腻', '温和去角质', '高透水光感'],
  apparel: ['亲肤柔软面料', '版型修身立体', '干爽防汗透气', '洗后不易变形', '色彩自然百搭'],
  electronics: ['高帧率丝滑运行', '超长强劲续航', '机身轻薄便携', '音质纯净保真', '极速闪充技术'],
  home: ['环保无味板材', '人体工学支撑', '静音顺滑抽屉', '稳固抗震防潮', '轻奢极简设计']
};

const SentimentAnalysis = () => {
  // 核心交互与过滤状态
  const [selectedCategory, setSelectedCategory] = useState<'cosmetics' | 'apparel' | 'electronics' | 'home'>('cosmetics');
  const [dataSource, setDataSource] = useState('sync');
  const [timeRange, setTimeRange] = useState('30');
  const [polarityFilter, setPolarityFilter] = useState('all');
  
  // NLP配置面板状态
  const [enableSentiment, setEnableSentiment] = useState(true);
  const [enableSellPoint, setEnableSellPoint] = useState(true);
  const [enablePainPoint, setEnablePainPoint] = useState(true);
  const [enableQAParsing, setEnableQAParsing] = useState(true);
  const [enableWordCloud, setEnableWordCloud] = useState(true);
  
  const [filterSpam, setFilterSpam] = useState(true);
  const [filterShortTxt, setFilterShortTxt] = useState(true);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [importText, setImportText] = useState('');
  
  // 页面子选项卡 (明细列表与数据看板)
  const [activeTab, setActiveTab] = useState('details');

  // 数据清洗与NLP解析流
  const cleanAndClassifyReviews = useMemo(() => {
    let result = [...MOCK_RAW_REVIEWS];
    
    // 1. 水军/刷评过滤逻辑
    if (filterSpam) {
      result = result.filter(r => !r.text.includes("刷单") && !r.text.includes("返现"));
    }
    // 2. 过滤过短评价 (低于3字)
    if (filterShortTxt) {
      result = result.filter(r => r.text.length >= 3);
    }
    // 3. 情感快速筛选
    if (polarityFilter !== 'all') {
      result = result.filter(r => r.polarity === polarityFilter);
    }

    return result;
  }, [filterSpam, filterShortTxt, polarityFilter]);

  // 默认选中明细列表的第一条数据
  useEffect(() => {
    if (cleanAndClassifyReviews.length > 0) {
      setDetailItem(cleanAndClassifyReviews[0]);
    } else {
      setDetailItem(null);
    }
  }, [cleanAndClassifyReviews]);

  // 各维度数据汇总
  const stats = useMemo(() => {
    const total = cleanAndClassifyReviews.length;
    const good = cleanAndClassifyReviews.filter(r => r.polarity === '好评').length;
    const bad = cleanAndClassifyReviews.filter(r => r.polarity === '差评').length;
    const neutral = cleanAndClassifyReviews.filter(r => r.polarity === '中性').length;
    const qa = cleanAndClassifyReviews.filter(r => r.polarity === '咨询').length;

    const goodRate = total > 0 ? Math.round((good / total) * 100) : 0;
    const badRate = total > 0 ? Math.round((bad / total) * 100) : 0;

    const attributionData = {
      质量: cleanAndClassifyReviews.filter(r => r.category === '质量' && r.polarity === '差评').length,
      物流: cleanAndClassifyReviews.filter(r => r.category === '物流' && r.polarity === '差评').length,
      尺寸: cleanAndClassifyReviews.filter(r => r.category === '尺寸' && r.polarity === '差评').length,
      色差: cleanAndClassifyReviews.filter(r => r.category === '色差' && r.polarity === '差评').length,
      客服: cleanAndClassifyReviews.filter(r => r.category === '客服' && r.polarity === '差评').length,
    };

    return { total, good, bad, neutral, qa, goodRate, badRate, attributionData };
  }, [cleanAndClassifyReviews]);

  const sellPoints = useMemo(() => {
    if (stats.total === 0) {
      return CATEGORY_DEFAULT_SELL_POINTS[selectedCategory].map((point, index) => ({
        id: index,
        word: point,
        heat: 10,
        count: 0,
        tag: "类目兜底"
      }));
    }
    return [
      { id: 1, word: selectedCategory === 'cosmetics' ? "水润舒缓" : "柔软亲肤", heat: 92, count: 18, tag: "好评" },
      { id: 2, word: selectedCategory === 'cosmetics' ? "深层锁水" : "修身立体", heat: 88, count: 12, tag: "好评" },
      { id: 3, word: selectedCategory === 'cosmetics' ? "温和无敏" : "透气排汗", heat: 75, count: 9, tag: "好评" },
      { id: 4, word: "包装大气", heat: 64, count: 5, tag: "好评" }
    ];
  }, [selectedCategory, stats.total]);

  const painPoints = [
    { id: 1, word: "过敏刺痛", freq: 15, quote: "用了两次脸就红了，刺痛感很明显", category: "质量" },
    { id: 2, word: "闷痘太油", freq: 12, quote: "夏天用真的太油了，第二天就长了两个大痘", category: "质量" },
    { id: 3, word: "泵头卡死", freq: 8, quote: "按压头设计不科学，按不出来", category: "尺寸" },
    { id: 4, word: "机器人回复", freq: 5, quote: "问了半天都是机器人自动回复", category: "客服" }
  ];

  const qaIntents = [
    { id: 1, q: "这套产品适合敏感肌日常用吗？会过敏吗？", heat: 124, type: "适用肤质" },
    { id: 2, q: "买赠的赠品是和正装一样功效的吗？", heat: 89, type: "营销活动" },
    { id: 3, q: "搭配精华一起用，抗老效果会不会更好？", heat: 56, type: "搭配使用" }
  ];

  const pieData = [
    { name: '好评', value: stats.good, color: '#f5756c' },
    { name: '差评', value: stats.bad, color: '#fca39d' },
    { name: '中性', value: stats.neutral, color: '#fedcd9' },
    { name: '咨询', value: stats.qa, color: '#94a3b8' }
  ];

  const attributionBarData = [
    { name: '质量', 频次: stats.attributionData.质量 },
    { name: '物流', 频次: stats.attributionData.物流 },
    { name: '尺寸', 频次: stats.attributionData.尺寸 },
    { name: '色差', 频次: stats.attributionData.色差 },
    { name: '客服', 频次: stats.attributionData.客服 }
  ];

  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
  };

  const handleToggleFav = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    showSuccess("收藏状态已更新！");
  };

  const syncToContentFactory = (type: 'sell' | 'pain') => {
    if (type === 'sell') {
      const topSell = sellPoints.map(p => p.word).join(', ');
      showSuccess(`已成功同步高频卖点「${topSell}」至 AIGC 内容工厂，已填充标题及详情宣传短句。`);
    } else {
      showSuccess(`已成功同步核心痛点问题至 AIGC 规避模块，将自动在生成物中过滤虚假夸大描述。`);
    }
  };

  const syncToVideoCreation = () => {
    showSuccess("已将用户高频关注的「敏感肌适用性」及「水润舒缓效果」作为动态脚本大纲同步至视频创作模块！");
  };

  const triggerBatchAnalysis = () => {
    setIsAnalyzing(true);
    showSuccess("批量分析任务已提交队列，后台离线处理中...");
    setTimeout(() => {
      setIsAnalyzing(false);
      showSuccess("后台批量分析任务已处理完成！");
    }, 1500);
  };

  const getPolarityBadge = (polarity: string) => {
    const styles: any = {
      '好评': 'bg-emerald-100 text-emerald-700',
      '差评': 'bg-rose-100 text-rose-700',
      '中性': 'bg-slate-100 text-slate-600',
      '咨询': 'bg-blue-100 text-blue-700'
    };
    return <Badge className={cn("border-none text-[10px] font-bold", styles[polarity])}>{polarity}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-[1600px] mx-auto pb-24 text-slate-800 text-xs text-left">
        
        {/* 2.1 顶部筛选操作栏 */}
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
                    <SelectItem value="batchsku">批量 SKU 导入</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">目类选择</span>
                <Select value={selectedCategory} onValueChange={(val: any) => setSelectedCategory(val)}>
                  <SelectTrigger className="w-[120px] h-9 bg-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cosmetics">美妆个护</SelectItem>
                    <SelectItem value="apparel">服饰内衣</SelectItem>
                    <SelectItem value="electronics">3C数码</SelectItem>
                    <SelectItem value="home">家居家装</SelectItem>
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
                    <SelectItem value="咨询">仅看咨询</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={triggerBatchAnalysis} disabled={isAnalyzing} className="bg-rose-400 hover:bg-rose-500 text-white h-9 text-xs">
                <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isAnalyzing && "animate-spin")} />
                批量分析
              </Button>
              <Button variant="outline" onClick={() => showSuccess("分析报告已成功导出为 Excel格式文件。")} className="h-9 text-xs border-slate-200">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                导出分析报告
              </Button>
              <Button variant="ghost" onClick={() => { setImportText(''); showSuccess("缓存与手动输入区已清空。"); }} className="h-9 text-xs text-slate-500 hover:bg-slate-100">
                清空缓存
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 异常状态提示 */}
        {stats.total < 10 && stats.total > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>数据样本量过少（共 {stats.total} 条），NLP分析结果仅供参考，推荐导入更多历史评论数据。</span>
          </div>
        )}

        {stats.total === 0 && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <span>暂无满足过滤条件的真实用户评价，将自动基于系统预设的类目通用卖点数据进行兜底内容生成。</span>
          </div>
        )}

        {/* 2.2 统一布局架构 */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch overflow-hidden">
          
          {/* 左侧 NLP 分析配置面板 */}
          <div className="w-full lg:w-[280px] shrink-0 space-y-4">
            {dataSource === 'manual' && (
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-xs font-bold text-slate-700">手动导入评论文本</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="在此输入或粘贴多行评论文本以进行单次或批量解析..."
                    className="w-full text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-300 h-28 resize-none leading-relaxed"
                  />
                  <Button onClick={() => showSuccess("已重新载入至右侧NLP明细池。")} className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs h-8">
                    导入并解析
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-700">分析维度自定义开关</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-600 font-semibold">情感倾向极性分类</Label>
                  <Switch checked={enableSentiment} onCheckedChange={setEnableSentiment} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-600 font-semibold">高频卖点提取</Label>
                  <Switch checked={enableSellPoint} onCheckedChange={setEnableSellPoint} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-600 font-semibold">差评原因多维归因</Label>
                  <Switch checked={enablePainPoint} onCheckedChange={setEnablePainPoint} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-600 font-semibold">问大家咨询意图解析</Label>
                  <Switch checked={enableQAParsing} onCheckedChange={setEnableQAParsing} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-600 font-semibold">生成极性对比词云</Label>
                  <Switch checked={enableWordCloud} onCheckedChange={setEnableWordCloud} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-700">清洗过滤规则配置</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-700 block">水军及灌水刷评过滤</span>
                    <span className="text-[10px] text-slate-400 block">自动剔除“返现/刷单”等噪音数据</span>
                  </div>
                  <Switch checked={filterSpam} onCheckedChange={setFilterSpam} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-700 block">过滤无意义短文本</span>
                    <span className="text-[10px] text-slate-400 block">自动过滤低于 3 个字的短评</span>
                  </div>
                  <Switch checked={filterShortTxt} onCheckedChange={setFilterShortTxt} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2.3 中间主展示区 */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            
            {/* 顶层切换 Tab */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full shrink-0">
              <TabsList className="bg-slate-100/50 p-1">
                <TabsTrigger value="details" className="text-xs gap-2"><FileText className="w-3.5 h-3.5" />评价数据分析明细</TabsTrigger>
                <TabsTrigger value="dashboard" className="text-xs gap-2"><BarChart3 className="w-3.5 h-3.5" />可视化图表看板</TabsTrigger>
              </TabsList>
            </Tabs>

            <TabsContent value="details" className="m-0 flex-1 flex flex-col overflow-hidden">
              <Card className="flex-1 border-none shadow-sm overflow-hidden flex flex-col">
                <CardHeader className="py-3 border-b border-slate-100 shrink-0">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span>用户评价NLP抽取分析明细列表</span>
                    <Badge variant="outline" className="text-[10px] text-rose-500 border-rose-200">点击列表行查看右侧分析详情</Badge>
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1">
                  <div className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="w-[40px] text-center">
                            <Checkbox checked={selectedIds.length > 0} onCheckedChange={(c) => setSelectedIds(c ? cleanAndClassifyReviews.map(i => i.id) : [])} />
                          </TableHead>
                          <TableHead className="text-xs w-[80px]">ID</TableHead>
                          <TableHead className="text-xs min-w-[200px]">用户评价原文</TableHead>
                          <TableHead className="text-xs w-[100px]">情感倾向</TableHead>
                          <TableHead className="text-xs w-[100px]">分类维度</TableHead>
                          <TableHead className="text-xs w-[120px]">抽取实体维度</TableHead>
                          <TableHead className="text-xs w-[120px]">分析时间</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cleanAndClassifyReviews.map((item) => (
                          <TableRow 
                            key={item.id} 
                            className={cn(
                              "cursor-pointer transition-colors text-xs",
                              detailItem?.id === item.id ? "bg-rose-50/30" : "hover:bg-slate-50/50"
                            )}
                            onClick={() => setDetailItem(item)}
                          >
                            <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                              <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={(c) => handleSelectItem(item.id, !!c)} />
                            </TableCell>
                            <TableCell className="font-bold text-slate-500">#{item.id}</TableCell>
                            <TableCell className="max-w-[280px] truncate text-slate-700 font-medium">{item.text}</TableCell>
                            <TableCell>{getPolarityBadge(item.polarity)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-slate-200 text-slate-600 text-[10px]">
                                {item.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {item.entities.map(e => (
                                  <Badge key={e} className="bg-rose-50 text-rose-600 border border-rose-100 text-[9px] hover:bg-rose-50">
                                    {e}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-400 font-mono">{item.time}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard" className="m-0 flex-1 flex flex-col gap-4 overflow-y-auto">
              {/* 数据概览卡片 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-4 text-center space-y-1">
                    <span className="text-slate-400 text-[10px] block">总分析评价数</span>
                    <span className="text-lg font-extrabold text-slate-800">{stats.total} 条</span>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardContent className="p-4 text-center space-y-1">
                    <span className="text-slate-400 text-[10px] block">综合好评率</span>
                    <span className="text-lg font-extrabold text-green-600">{stats.goodRate}%</span>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardContent className="p-4 text-center space-y-1">
                    <span className="text-slate-400 text-[10px] block">负向差评率</span>
                    <span className="text-lg font-extrabold text-rose-500">{stats.badRate}%</span>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardContent className="p-4 text-center space-y-1">
                    <span className="text-slate-400 text-[10px] block">高频卖点 TOP1</span>
                    <span className="text-xs font-bold text-slate-700 truncate block">
                      {sellPoints[0]?.word || "无"}
                    </span>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-rose-50/20">
                  <CardContent className="p-4 text-center space-y-1">
                    <span className="text-rose-500 text-[10px] block font-bold">高频痛点 TOP1</span>
                    <span className="text-xs font-bold text-rose-600 truncate block">
                      {painPoints[0]?.word || "无"}
                    </span>
                  </CardContent>
                </Card>
              </div>

              {/* 可视化图表区 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 情感分布饼图 */}
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-700">情感极性分布比例</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 9 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* 差评原因多维归因柱状图 */}
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-700">差评多维度归因分析</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attributionBarData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                        <Tooltip />
                        <Bar dataKey="频次" fill="#f5756c" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* 词云与表格看板 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 正向卖点表 */}
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-2 border-b border-slate-50">
                    <CardTitle className="text-xs font-bold text-slate-700">高频正向卖点聚合表</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow>
                          <TableHead className="text-xs">提取卖点</TableHead>
                          <TableHead className="text-xs text-right">关注热度</TableHead>
                          <TableHead className="text-xs text-right">关联评价</TableHead>
                          <TableHead className="text-xs text-center">极性标签</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sellPoints.map((item) => (
                          <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="font-bold text-slate-700">{item.word}</TableCell>
                            <TableCell className="text-right font-mono text-rose-500 font-bold">{item.heat}%</TableCell>
                            <TableCell className="text-right font-mono text-slate-500">{item.count} 条</TableCell>
                            <TableCell className="text-center">
                              <Badge className="bg-green-100 text-green-700 border-none font-bold text-[9px]">
                                {item.tag}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* 负面痛点表 */}
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-2 border-b border-slate-50">
                    <CardTitle className="text-xs font-bold text-slate-700">高频负向痛点分析表</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow>
                          <TableHead className="text-xs">痛点分类</TableHead>
                          <TableHead className="text-xs text-right">发生频次</TableHead>
                          <TableHead className="text-xs">典型用户评价原文</TableHead>
                          <TableHead className="text-xs">痛点归类</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {painPoints.map((item) => (
                          <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="font-bold text-rose-600">{item.word}</TableCell>
                            <TableCell className="text-right font-mono text-slate-500">{item.freq} 次</TableCell>
                            <TableCell className="max-w-[150px] truncate text-slate-500 italic">“{item.quote}”</TableCell>
                            <TableCell>
                              <Badge className="bg-rose-50 text-rose-600 border-none font-bold text-[9px]">
                                {item.category}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* 问大家 */}
              {enableQAParsing && (
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-2 border-b border-slate-50">
                    <CardTitle className="text-xs font-bold text-slate-700">问大家 (QA) 用户关注意图解析</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow>
                          <TableHead className="text-xs">咨询意图方向</TableHead>
                          <TableHead className="text-xs">典型问题句式</TableHead>
                          <TableHead className="text-xs text-right">关注度热数值</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {qaIntents.map((intent) => (
                          <TableRow key={intent.id} className="hover:bg-slate-50/50">
                            <TableCell className="font-bold text-slate-700">{intent.type}</TableCell>
                            <TableCell className="text-slate-500">“{intent.q}”</TableCell>
                            <TableCell className="text-right font-mono font-bold text-rose-500">{intent.heat}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>

          {/* 2.4 右侧详情面板 */}
          <Card className="w-full lg:w-[400px] border-none shadow-sm shrink-0 flex flex-col overflow-hidden bg-white">
            <CardHeader className="py-3 border-b border-slate-100 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-400" />
                NLP 智能分析详情
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              {detailItem ? (
                <div className="p-5 space-y-6 text-left">
                  {/* 原始文本预览与标红高亮 */}
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-400 uppercase">评价内容原文 (标红实体词)</Label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs leading-relaxed font-mono">
                      {detailItem.text.split(new RegExp(`(${detailItem.entities.join('|')})`, 'g')).map((part: string, i: number) => {
                        const isEntity = detailItem.entities.includes(part);
                        return isEntity ? (
                          <span key={i} className="bg-rose-100 text-rose-600 px-1 rounded font-bold border border-rose-200">
                            {part}
                          </span>
                        ) : (
                          part
                        );
                      })}
                    </div>
                  </div>

                  {/* 提取结果维度 */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-slate-400 uppercase">实体与分类抽取</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/60">
                        <span className="text-[10px] text-slate-400 block mb-0.5">情感倾向极性</span>
                        {getPolarityBadge(detailItem.polarity)}
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/60">
                        <span className="text-[10px] text-slate-400 block mb-0.5">归因分类</span>
                        <Badge className="bg-rose-50 text-rose-700 border-none font-bold text-[10px] hover:bg-rose-50">
                          {detailItem.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/60 space-y-2">
                      <span className="text-[10px] text-slate-400 block">抽取实体标签</span>
                      <div className="flex flex-wrap gap-1.5">
                        {detailItem.entities.length > 0 ? (
                          detailItem.entities.map((ent: string) => (
                            <Badge key={ent} className="bg-rose-100 text-rose-700 border-none text-[9px] hover:bg-rose-100">
                              {ent}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-[10px]">未检测到明显属性实体</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI 优化话术建议 */}
                  <div className="space-y-2 bg-gradient-to-br from-rose-50/40 to-rose-50/10 border border-rose-100 p-4 rounded-xl">
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> AI 营销/质检防线建议
                    </span>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      {detailItem.suggestion}
                    </p>
                  </div>

                  {/* 联动操作按钮 */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        navigator.clipboard.writeText(detailItem.text);
                        showSuccess("评价原文已复制到剪贴板！");
                      }} 
                      className="h-8 text-[10px] flex-1 border-slate-200"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" /> 复制评价
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleToggleFav(detailItem.id)}
                      className={cn(
                        "h-8 text-[10px] flex-1 border-slate-200",
                        favorites.includes(detailItem.id) ? "text-rose-500" : "text-slate-500"
                      )}
                    >
                      <Heart className="w-3.5 h-3.5 mr-1 fill-current" />
                      {favorites.includes(detailItem.id) ? "已收藏" : "收藏评价"}
                    </Button>
                  </div>

                  <Button 
                    onClick={() => {
                      showSuccess("该条目涉及的词频指标与正面诉求已自动归档至企业云素材库中，支持后续二次调用复用。");
                    }} 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 text-xs rounded-xl"
                  >
                    一键加入素材库
                  </Button>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-40">
                  <ShieldCheck className="w-16 h-16 text-slate-300" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-500">暂未选择明细行</p>
                    <p className="text-xs text-slate-400">请从左侧列表中点击选择查看单条分析报告</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* 2.5 底部联动功能栏 */}
        <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-white/95 backdrop-blur-md border-t border-rose-200 shadow-2xl p-4 z-40 transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              NLP 数据同步与跨模块协同生成
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button 
              onClick={() => syncToContentFactory('sell')} 
              className="bg-rose-400 hover:bg-rose-500 text-white font-bold h-9 text-xs rounded-xl"
            >
              一键生成卖点文案
            </Button>
            <Button 
              onClick={() => syncToContentFactory('pain')} 
              variant="outline" 
              className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs h-9"
            >
              一键生成规避话术
            </Button>
            <Button 
              onClick={syncToVideoCreation} 
              variant="outline" 
              className="border-slate-200 text-slate-600 hover:bg-slate-50 text-xs h-9"
            >
              一键生成视频脚本
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => showSuccess("评价库结构化特征已直接同步归入多渠道通用素材中心。")} 
              className="text-xs text-slate-500 font-bold"
            >
              导出 NLP 结构化数据
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default SentimentAnalysis;