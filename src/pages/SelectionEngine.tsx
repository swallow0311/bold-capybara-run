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
  ShieldAlert, Zap, Activity, TrendingDown, Settings2
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 导入子组件
import AiAnalysisReport from '@/components/selection/AiAnalysisReport';
import BenchmarkingRadar from '@/components/selection/BenchmarkingRadar';
import BenchmarkingTable from '@/components/selection/BenchmarkingTable';
import BenchmarkingStrategy from '@/components/selection/BenchmarkingStrategy';
import DiagnosisDetailDrawer from '@/components/selection/DiagnosisDetailDrawer';
import SelectionConfigSheet from '@/components/selection/SelectionConfigSheet';

// 模拟数据
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
  }
];

const STORE_DIAGNOSIS_DATA = [
  { id: 'S-001', name: '中达酵母御龄面霜', status: '健康', traffic: '1.2w', cvr: '3.5%', sentiment: '92%', trend: 'up' },
  { id: 'S-002', name: '积雪草净化海泥面膜', status: '风险', traffic: '2.5k', cvr: '0.8%', sentiment: '75%', trend: 'down' },
  { id: 'S-003', name: '水漾隔离防晒乳', status: '滞销', traffic: '800', cvr: '0.2%', sentiment: '88%', trend: 'down' },
];

const SelectionEngine = () => {
  const [activeTab, setActiveTab] = useState('potential');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [compareList, setCompareList] = useState<any[]>(TRENDING_PRODUCTS.slice(0, 2));
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [diagnosisItem, setDiagnosisItem] = useState<any>(null);

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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full space-y-6 max-w-[1600px] mx-auto pb-12 text-left animate-in fade-in duration-500">
        
        <div className="flex justify-between items-center">
          <TabsList className="bg-white border border-slate-200 p-1 h-11 shadow-sm rounded-xl">
            <TabsTrigger value="potential" className="gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <Zap className="w-3.5 h-3.5" /> 蓝海潜力选品
            </TabsTrigger>
            <TabsTrigger value="benchmarking" className="gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <Scale className="w-3.5 h-3.5" /> 竞品对标选品
            </TabsTrigger>
            <TabsTrigger value="diagnosis" className="gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <Activity className="w-3.5 h-3.5" /> 本店商品诊断
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => setIsConfigOpen(true)}>
              <Settings2 className="w-3.5 h-3.5 mr-1.5" /> 权重配置
            </Button>
            {activeTab === 'benchmarking' && validation.valid && (
              <Button className="bg-rose-400 hover:bg-rose-500 text-white text-xs h-9" onClick={() => showSuccess("正在生成深度对标报告...")}>
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> 导出对标报告
              </Button>
            )}
          </div>
        </div>

        {/* 1. 蓝海潜力选品 */}
        <TabsContent value="potential" className="m-0 space-y-6">
          <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
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
              <CardContent className="p-6 h-full"><AiAnalysisReport product={selectedProduct} /></CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. 竞品对标选品 */}
        <TabsContent value="benchmarking" className="m-0 space-y-8">
          {!validation.valid ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center"><ShieldAlert className="w-10 h-10 text-rose-400" /></div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-slate-800">{validation.msg}</h3>
                <p className="text-sm text-slate-400">请从蓝海榜单或收藏夹中勾选 2-5 款同类目商品进行深度对标</p>
              </div>
              <Button onClick={() => setActiveTab('potential')} className="bg-rose-400 hover:bg-rose-500 text-white px-8">前往选品</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-5 border-none shadow-sm bg-white">
                  <CardHeader className="pb-2 border-b border-slate-50"><CardTitle className="text-sm font-bold flex items-center gap-2"><Scale className="w-4 h-4 text-rose-400" /> 五维能力雷达对标</CardTitle></CardHeader>
                  <CardContent className="p-6"><BenchmarkingRadar data={compareList} /></CardContent>
                </Card>
                <Card className="lg:col-span-7 border-none shadow-sm bg-white">
                  <CardHeader className="pb-2 border-b border-slate-50"><CardTitle className="text-sm font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-rose-400" /> AI 全局对比结论</CardTitle></CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                      <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-rose-200">1</div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-rose-700">综合最优入局品：{compareList[0]?.name}</p>
                        <p className="text-[11px] text-rose-600/80 mt-1">该单品在毛利空间与竞争蓝海度上取得平衡，建议作为首选立项目标。</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">内卷严重品</span>
                        <p className="text-xs font-bold text-slate-700 mt-1">氨基酸洁面乳</p>
                        <Badge className="bg-amber-100 text-amber-700 border-none text-[9px] mt-2">高获客成本</Badge>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">高风险预警</span>
                        <p className="text-xs font-bold text-slate-700 mt-1">水漾防晒喷雾</p>
                        <Badge className="bg-rose-100 text-rose-700 border-none text-[9px] mt-2">侵权/售后风险</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800">全维度横向对标矩阵</h3>
                  <div className="flex gap-4 text-[10px]">
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold"><div className="w-2 h-2 rounded-full bg-emerald-500" /> 维度最优</span>
                    <span className="flex items-center gap-1.5 text-rose-600 font-bold"><div className="w-2 h-2 rounded-full bg-rose-500" /> 维度最差</span>
                  </div>
                </div>
                <BenchmarkingTable products={compareList} />
              </div>
              <BenchmarkingStrategy products={compareList} />
            </>
          )}
        </TabsContent>

        {/* 3. 本店商品诊断 */}
        <TabsContent value="diagnosis" className="m-0 space-y-6">
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
        </TabsContent>

      </Tabs>

      <SelectionConfigSheet open={isConfigOpen} onOpenChange={setIsConfigOpen} />
      <DiagnosisDetailDrawer item={diagnosisItem} onClose={() => setDiagnosisItem(null)} />
    </DashboardLayout>
  );
};

export default SelectionEngine;