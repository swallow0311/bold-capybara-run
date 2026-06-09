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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  TrendingDown, TrendingUp, MessageSquare, Lightbulb, ArrowRight,
  AlertCircle, Package, Truck, Filter, Download, Plus, Copy,
  Heart, Database, RefreshCw, BarChart3, HelpCircle, FileText, CheckCircle2,
  Calendar, Check, Settings2, Sparkles, Send, ShieldAlert,
  Search, Eye, Trash2, FileSpreadsheet, Sparkle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

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
  const [selectedCategory, setSelectedCategory] = useState<'cosmetics' | 'apparel' | 'electronics' | 'home'>('cosmetics');
  const [dataSource, setDataSource] = useState('sync');
  const [timeRange, setTimeRange] = useState('30');
  const [polarityFilter, setPolarityFilter] = useState('all');
  
  const [enableSentiment, setEnableSentiment] = useState(true);
  const [enableSellPoint, setEnableSellPoint] = useState(true);
  const [enablePainPoint, setEnablePainPoint] = useState(true);
  
  const [filterSpam, setFilterSpam] = useState(true);
  const [filterShortTxt, setFilterShortTxt] = useState(true);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const [activeTab, setActiveTab] = useState('details');

  const cleanAndClassifyReviews = useMemo(() => {
    let result = [...MOCK_RAW_REVIEWS];
    if (filterSpam) {
      result = result.filter(r => !r.text.includes("刷单") && !r.text.includes("返现"));
    }
    if (filterShortTxt) {
      result = result.filter(r => r.text.length >= 3);
    }
    if (polarityFilter !== 'all') {
      result = result.filter(r => r.polarity === polarityFilter);
    }
    return result;
  }, [filterSpam, filterShortTxt, polarityFilter]);

  useEffect(() => {
    if (cleanAndClassifyReviews.length > 0) {
      setDetailItem(cleanAndClassifyReviews[0]);
    } else {
      setDetailItem(null);
    }
  }, [cleanAndClassifyReviews]);

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

  const triggerBatchAnalysis = () => {
    setIsAnalyzing(true);
    showSuccess("批量分析任务已提交队列...");
    setTimeout(() => {
      setIsAnalyzing(false);
      showSuccess("分析任务已处理完成！");
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
              <Button onClick={triggerBatchAnalysis} disabled={isAnalyzing} className="bg-rose-400 hover:bg-rose-500 text-white h-9 text-xs">
                <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isAnalyzing && "animate-spin")} />
                批量分析
              </Button>
              <Button variant="outline" onClick={() => showSuccess("报告已导出。")} className="h-9 text-xs border-slate-200">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                导出报告
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row gap-4 items-stretch overflow-hidden">
          <div className="w-full lg:w-[280px] shrink-0 space-y-4">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-700">分析维度开关</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-600 font-semibold">情感极性分类</Label>
                  <Switch checked={enableSentiment} onCheckedChange={setEnableSentiment} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-600 font-semibold">卖点提取</Label>
                  <Switch checked={enableSellPoint} onCheckedChange={setEnableSellPoint} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full shrink-0">
              <TabsList className="bg-slate-100/50 p-1">
                <TabsTrigger value="details" className="text-xs gap-2"><FileText className="w-3.5 h-3.5" />分析明细</TabsTrigger>
                <TabsTrigger value="dashboard" className="text-xs gap-2"><BarChart3 className="w-3.5 h-3.5" />图表看板</TabsTrigger>
              </TabsList>
            </Tabs>

            <TabsContent value="details" className="m-0 flex-1 flex flex-col overflow-hidden">
              <Card className="flex-1 border-none shadow-sm overflow-hidden flex flex-col">
                <ScrollArea className="flex-1">
                  <Table>
                    <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="w-[40px] text-center">
                          <Checkbox checked={selectedIds.length > 0} onCheckedChange={(c) => setSelectedIds(c ? cleanAndClassifyReviews.map(i => i.id) : [])} />
                        </TableHead>
                        <TableHead className="text-xs">评价原文</TableHead>
                        <TableHead className="text-xs">情感</TableHead>
                        <TableHead className="text-xs">分类</TableHead>
                        <TableHead className="text-xs">实体</TableHead>
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
                          <TableCell className="max-w-[280px] truncate">{item.text}</TableCell>
                          <TableCell>{getPolarityBadge(item.polarity)}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.entities.map(e => (
                                <Badge key={e} className="bg-rose-50 text-rose-600 border border-rose-100 text-[9px]">{e}</Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard" className="m-0 flex-1 flex flex-col gap-4 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-none shadow-sm bg-white h-[250px]">
                  <CardHeader className="pb-2"><CardTitle className="text-xs font-bold">情感分布</CardTitle></CardHeader>
                  <CardContent className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 9 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white h-[250px]">
                  <CardHeader className="pb-2"><CardTitle className="text-xs font-bold">差评归因</CardTitle></CardHeader>
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
            </TabsContent>
          </div>

          <Card className="w-full lg:w-[400px] border-none shadow-sm shrink-0 flex flex-col overflow-hidden bg-white">
            <CardHeader className="py-3 border-b border-slate-100 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2"><Eye className="w-4 h-4 text-rose-400" />分析详情</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              {detailItem ? (
                <div className="p-5 space-y-6 text-left">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-400 uppercase">原文预览</Label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs leading-relaxed">
                      {detailItem.text}
                    </div>
                  </div>
                  <div className="space-y-2 bg-rose-50 border border-rose-100 p-4 rounded-xl">
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> AI 建议</span>
                    <p className="text-slate-600 leading-relaxed text-xs">{detailItem.suggestion}</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => showSuccess("已复制")} className="h-8 text-[10px] flex-1">复制评价</Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleFav(detailItem.id)} className="h-8 text-[10px] flex-1">收藏评价</Button>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center opacity-40">
                  <ShieldCheck className="w-16 h-16 text-slate-300" />
                  <p className="text-sm font-bold text-slate-500">请选择明细行</p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-white/95 backdrop-blur-md border-t border-rose-200 shadow-2xl p-4 z-40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-rose-500" /> NLP 数据同步</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button onClick={() => showSuccess("已同步卖点")} className="bg-rose-400 hover:bg-rose-500 text-white font-bold h-9 text-xs rounded-xl">一键生成卖点文案</Button>
            <Button onClick={() => showSuccess("已同步规避话术")} variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs h-9">一键生成规避话术</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default SentimentAnalysis;