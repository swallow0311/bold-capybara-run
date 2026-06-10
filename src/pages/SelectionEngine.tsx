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
  Flame, MousePointer2, Box, Ship, Eye, Link2, Activity,
  Target, FileText, Wand2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";
import SelectionConfigSheet from '@/components/selection/SelectionConfigSheet';
import SelectionDetailDrawer from '@/components/selection/SelectionDetailDrawer';
import DiagnosisDetailDrawer from '@/components/selection/DiagnosisDetailDrawer';

// 模拟蓝海选品数据
const BLUE_OCEAN_DATA = [
  { id: 'SEL-001', img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100', title: '多肽紧致修护眼霜', category: '眼部护理', score: 92, growth: '+45%', comp: '低', sales: '1.2w+', profit: '45%', risk: '低', gap: '大' },
  { id: 'SEL-002', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100', title: '氨基酸温和洁面乳', category: '面部清洁', score: 65, growth: '+12%', comp: '极高', sales: '5.5w+', profit: '15%', risk: '低', gap: '小' },
  { id: 'SEL-003', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100', title: '植物精粹防晒喷雾', category: '防晒隔离', score: 42, growth: '-5%', comp: '中', sales: '2000+', profit: '30%', risk: '中', gap: '中' },
];

// 模拟竞品对标数据
const COMPETITOR_DATA = [
  { id: 'COMP-01', name: '某大牌酵母面霜', price: '¥399', sales: '5w+', activity: '买一送一', painPoints: '包装漏液、质地太厚', advantage: '品牌背书强', gap: '可切入轻薄质地赛道' },
  { id: 'COMP-02', name: '网红修护精华', price: '¥159', sales: '10w+', activity: '直播间专享', painPoints: '过敏率高、见效慢', advantage: '营销声量大', gap: '主打敏感肌实测报告' },
];

// 模拟本店诊断数据
const STORE_DIAGNOSIS_DATA = [
  { id: '1', name: '中达酵母御龄紧致面霜', status: '潜力上升', traffic: '高', cvr: '3.2%', sales: 12840, issue: '主图点击率略低', suggestion: '重做AI场景主图' },
  { id: '2', name: '中达水漾隔离防晒乳', status: '稳定动销', traffic: '中', cvr: '2.8%', sales: 5400, issue: '评价出现负面关键词', suggestion: '痛点整改/话术优化' },
  { id: '3', name: '积雪草净化海泥面膜', status: '滞销衰退', traffic: '低', cvr: '0.5%', sales: 3200, issue: '价格高于竞品20%', suggestion: '调价建议/买赠活动' },
];

const SelectionEngine = () => {
  const [activeModule, setActiveModule] = useState('blue-ocean');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>(null);
  const [compLink, setCompLink] = useState('');

  const handleImportComp = () => {
    if (!compLink) return showError("请输入竞品链接或类目关键词");
    showSuccess("正在抓取竞品全维度数据并进行 AI 卖点拆解...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left animate-in fade-in duration-500">
        
        {/* 顶部模块切换 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
            {[
              { id: 'blue-ocean', label: '蓝海潜力选品', icon: Globe, sub: '大盘挖掘' },
              { id: 'competitor', label: '竞品对标选品', icon: Target, sub: '差异化切入' },
              { id: 'store', label: '本店商品诊断', icon: Activity, sub: '存量盘活' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={cn(
                  "px-6 py-2 rounded-xl transition-all flex items-center gap-3",
                  activeModule === m.id ? "bg-rose-500 text-white shadow-lg shadow-rose-100" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <m.icon className="w-4 h-4" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold">{m.label}</span>
                  <span className={cn("text-[9px] font-medium", activeModule === m.id ? "text-rose-100" : "text-slate-400")}>{m.sub}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsConfigOpen(true)} className="h-10 text-xs border-slate-200">
              <Settings2 className="w-3.5 h-3.5 mr-1.5" /> 选品权重配置
            </Button>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white h-10 text-xs font-bold">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> 全店深度复盘
            </Button>
          </div>
        </div>

        {/* 模块 1: 蓝海潜力选品 */}
        {activeModule === 'blue-ocean' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            {/* 筛选工具栏 */}
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-slate-400 font-bold uppercase">价格带</Label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Min" className="h-8 text-xs" />
                    <span className="text-slate-300">-</span>
                    <Input placeholder="Max" className="h-8 text-xs" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-slate-400 font-bold uppercase">最低月销量</Label>
                  <Input type="number" defaultValue="1000" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-slate-400 font-bold uppercase">好评率阈值</Label>
                  <Select defaultValue="85"><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="85">85% 以上</SelectItem><SelectItem value="90">90% 以上</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-slate-400 font-bold uppercase">竞争压力</Label>
                  <Select defaultValue="low"><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">仅看低竞争</SelectItem><SelectItem value="mid">中低竞争</SelectItem></SelectContent></Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full h-8 text-xs bg-rose-400 hover:bg-rose-500 text-white">应用筛选匹配货源</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/70">
                    <TableRow>
                      <TableHead className="text-xs">潜力商品信息</TableHead>
                      <TableHead className="text-xs text-center">潜力分</TableHead>
                      <TableHead className="text-xs">市场增速</TableHead>
                      <TableHead className="text-xs">供需缺口</TableHead>
                      <TableHead className="text-xs">利润空间</TableHead>
                      <TableHead className="text-xs">风险等级</TableHead>
                      <TableHead className="text-xs text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BLUE_OCEAN_DATA.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={item.img} className="w-10 h-10 rounded-lg object-cover border border-slate-100" alt="" />
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800 text-xs block">{item.title}</span>
                              <span className="text-[10px] text-slate-400">{item.category}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-rose-100 bg-rose-50">
                            <span className="text-xs font-black text-rose-600">{item.score}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-emerald-600 font-bold">{item.growth}</TableCell>
                        <TableCell><Badge className="bg-amber-100 text-amber-700 border-none text-[10px]">缺口{item.gap}</Badge></TableCell>
                        <TableCell className="font-bold text-slate-700">{item.profit}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "text-[9px] border-none",
                            item.risk === '低' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          )}>{item.risk}风险</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500" onClick={() => setSelectedItem(item)}>
                            深度拆解 <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 模块 2: 竞品对标选品 */}
        {activeModule === 'competitor' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-rose-400" /> 批量导入竞品链接/类目
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex gap-3">
                <Input 
                  value={compLink}
                  onChange={(e) => setCompLink(e.target.value)}
                  placeholder="粘贴淘宝/京东/抖音商品链接，或输入类目关键词..." 
                  className="flex-1 h-10 text-xs bg-slate-50/50" 
                />
                <Button onClick={handleImportComp} className="bg-slate-900 hover:bg-slate-800 text-white h-10 px-6 text-xs font-bold">
                  开始 AI 拆解
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {COMPETITOR_DATA.map((comp) => (
                <Card key={comp.id} className="border-none shadow-sm bg-white group hover:ring-2 hover:ring-rose-100 transition-all">
                  <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 font-bold text-xs">竞</div>
                      <CardTitle className="text-xs font-bold">{comp.name}</CardTitle>
                    </div>
                    <Badge className="bg-slate-100 text-slate-500 border-none text-[10px]">{comp.sales} 销量</Badge>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">核心痛点 (NLP 抓取)</span>
                        <p className="text-[11px] text-rose-600 font-bold">{comp.painPoints}</p>
                      </div>
                      <div className="p-3 bg-emerald-50/30 rounded-xl space-y-1">
                        <span className="text-[10px] text-emerald-600 font-bold uppercase">差异化切入机会</span>
                        <p className="text-[11px] text-emerald-700 font-bold">{comp.gap}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 h-8 text-[10px] border-slate-200">
                        <FileText className="w-3 h-3 mr-1.5" /> 生成避坑话术
                      </Button>
                      <Button className="flex-1 h-8 text-[10px] bg-rose-400 hover:bg-rose-500 text-white font-bold">
                        <Wand2 className="w-3 h-3 mr-1.5" /> 同步至文案创作
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 模块 3: 本店商品智能诊断 */}
        {activeModule === 'store' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: '潜力上升品', count: 5, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: '稳定动销品', count: 12, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: '滞销衰退品', count: 8, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: '高风险品', count: 2, color: 'text-rose-500', bg: 'bg-rose-50' },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm bg-white">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{stat.label}</p>
                      <p className={cn("text-2xl font-black", stat.color)}>{stat.count}</p>
                    </div>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                      <Activity className={cn("w-5 h-5", stat.color)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold">全店商品 AI 诊断复盘列表</CardTitle>
                <Button variant="outline" size="sm" className="h-8 text-[10px] border-rose-200 text-rose-600">
                  批量生成优化任务
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/70">
                    <TableRow>
                      <TableHead className="text-xs">商品名称</TableHead>
                      <TableHead className="text-xs">诊断状态</TableHead>
                      <TableHead className="text-xs">流量/转化</TableHead>
                      <TableHead className="text-xs">核心问题诊断</TableHead>
                      <TableHead className="text-xs">AI 优化建议</TableHead>
                      <TableHead className="text-xs text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {STORE_DIAGNOSIS_DATA.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-bold text-slate-700 text-xs">{item.name}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "border-none text-[9px] font-bold",
                            item.status === '潜力上升' && "bg-emerald-100 text-emerald-700",
                            item.status === '稳定动销' && "bg-blue-100 text-blue-700",
                            item.status === '滞销衰退' && "bg-amber-100 text-amber-700",
                          )}>{item.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-slate-400"><span>CVR</span><span>{item.cvr}</span></div>
                            <Progress value={parseFloat(item.cvr) * 20} className="h-1" />
                          </div>
                        </TableCell>
                        <TableCell className="text-rose-600 font-medium text-[11px]">{item.issue}</TableCell>
                        <TableCell className="text-slate-500 text-[11px]">{item.suggestion}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500" onClick={() => setSelectedDiagnosis(item)}>
                            查看诊断详情
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

      </div>

      {/* 权重配置抽屉 */}
      <SelectionConfigSheet open={isConfigOpen} onOpenChange={setIsConfigOpen} />

      {/* 选品详情抽屉 */}
      <SelectionDetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* 诊断详情抽屉 */}
      <DiagnosisDetailDrawer item={selectedDiagnosis} onClose={() => setSelectedDiagnosis(null)} />
    </DashboardLayout>
  );
};

export default SelectionEngine;