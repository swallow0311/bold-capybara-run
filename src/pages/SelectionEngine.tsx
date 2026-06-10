import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  TrendingUp, Zap, Search, Filter, Download, 
  BarChart3, PieChart, Flame, ArrowUpRight, 
  Info, Star, Heart, ExternalLink, Globe,
  ShoppingBag, PlayCircle, Layers
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 模拟趋势数据
const TREND_DATA = [
  { name: '06-01', heat: 400, sales: 240 },
  { name: '06-02', heat: 300, sales: 139 },
  { name: '06-03', heat: 600, sales: 980 },
  { name: '06-04', heat: 800, sales: 390 },
  { name: '06-05', heat: 500, sales: 480 },
  { name: '06-06', heat: 900, sales: 380 },
  { name: '06-07', heat: 1200, sales: 430 },
];

// 模拟蓝海单品数据
const BLUE_OCEAN_PRODUCTS = [
  { id: 1, name: '便携式折叠泡脚桶', platform: '抖音', category: '家居百货', price: '¥39-59', sales: '1.2w+', searchPop: '8.5w', competitors: 12, convProb: '8.5%', tags: ['低竞争', '高增长'] },
  { id: 2, name: '多功能磁吸充电宝', platform: '淘宝', category: '数码配件', price: '¥89-129', sales: '8.5k+', searchPop: '12w', competitors: 45, convProb: '6.2%', tags: ['全域稀缺', '低热度潜力'] },
  { id: 3, name: '无烟静音艾灸盒', platform: '全域', category: '个人护理', price: '¥158-299', sales: '3.2k+', searchPop: '5.4w', competitors: 8, convProb: '12.4%', tags: ['低竞争', '高转化'] },
  { id: 4, name: '夏季凉感冰丝席', platform: '京东', category: '床上用品', price: '¥199-399', sales: '2.4w+', searchPop: '25w', competitors: 120, convProb: '4.8%', tags: ['内容蓝海'] },
];

const SelectionEngine = () => {
  const [activeTab, setActiveTab] = useState('trend');
  const [platform, setPlatform] = useState('all');

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">全域智能选品中心</h1>
            <p className="text-xs text-slate-500 mt-1">打通淘京抖快全域数据，AI 驱动趋势挖掘与蓝海品筛选</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200">
              <Download className="w-3.5 h-3.5 mr-1.5" /> 导出选品报告
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 h-11 w-fit shadow-sm rounded-xl">
            <TabsTrigger value="trend" className="px-6 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <TrendingUp className="w-3.5 h-3.5" /> 全域趋势挖掘
            </TabsTrigger>
            <TabsTrigger value="blue-ocean" className="px-6 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <Zap className="w-3.5 h-3.5" /> 蓝海品筛选
            </TabsTrigger>
          </TabsList>

          {/* 1. 全域趋势挖掘 */}
          <TabsContent value="trend" className="space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">平台</span>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="w-[120px] h-8 text-xs bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全域数据</SelectItem>
                      <SelectItem value="taobao">淘宝/天猫</SelectItem>
                      <SelectItem value="jd">京东</SelectItem>
                      <SelectItem value="douyin">抖音</SelectItem>
                      <SelectItem value="kuaishou">快手</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">类目</span>
                  <Select defaultValue="beauty">
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beauty">美容护肤</SelectItem>
                      <SelectItem value="home">家居百货</SelectItem>
                      <SelectItem value="digital">数码家电</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">时间</span>
                  <Select defaultValue="30d">
                    <SelectTrigger className="w-[100px] h-8 text-xs bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">近7天</SelectItem>
                      <SelectItem value="30d">近30天</SelectItem>
                      <SelectItem value="90d">近90天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500 ml-auto">重置筛选</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 趋势核心指标 */}
              <Card className="lg:col-span-2 border-none shadow-sm bg-white">
                <CardHeader className="pb-2 border-b border-slate-50">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-rose-400" /> 行业趋势可视化分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: '市场热度', val: '85.4w', trend: '+12.5%', color: 'text-rose-500' },
                      { label: '搜索涨幅', val: '45.2%', trend: '+5.8%', color: 'text-orange-500' },
                      { label: '销量增速', val: '28.4%', trend: '+2.1%', color: 'text-emerald-500' },
                      { label: '市场竞争度', val: '中等', trend: '稳定', color: 'text-blue-500' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
                        <p className={cn("text-lg font-black", item.color)}>{item.val}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{item.trend}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-[240px] w-full">
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
                        <Area type="monotone" dataKey="heat" stroke="#f5756c" strokeWidth={2} fillOpacity={1} fill="url(#colorHeat)" />
                        <Area type="monotone" dataKey="sales" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* 生命周期与建议 */}
              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-2 border-b border-slate-50">
                    <CardTitle className="text-sm font-bold">品类生命周期判断</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="relative inline-flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex flex-col items-center justify-center">
                        <Badge className="bg-emerald-500 text-white border-none font-bold mb-1">增长期</Badge>
                        <span className="text-[10px] text-slate-400">置信度 92%</span>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg">
                        <Flame className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {['萌芽', '增长', '成熟', '衰退'].map(s => (
                        <div key={s} className={cn("h-1 rounded-full", s === '增长' ? "bg-emerald-500" : "bg-slate-100")} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      当前品类处于快速增长阶段，全域搜索人气持续攀升，建议中小商家积极入场。
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-rose-50/50 border border-rose-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5" /> AI 基础建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-rose-600">入</span>
                      </div>
                      <p className="text-[11px] text-rose-800 leading-relaxed">
                        <strong>建议入场：</strong> 抖音端内容热度极高，货架端同款竞争尚处于中低水平，存在明显的错位竞争机会。
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-amber-600">旺</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        <strong>旺季提醒：</strong> 预计 7 月中旬迎来年度最高峰，建议提前 15 天完成首批测款与素材铺设。
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 2. 全域蓝海品筛选 */}
          <TabsContent value="blue-ocean" className="space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">价格</span>
                  <Input placeholder="¥ 最低" className="w-20 h-8 text-xs" />
                  <span className="text-slate-300">-</span>
                  <Input placeholder="¥ 最高" className="w-20 h-8 text-xs" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">销量</span>
                  <Select defaultValue="1k">
                    <SelectTrigger className="w-[100px] h-8 text-xs bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1k">1000+</SelectItem>
                      <SelectItem value="5k">5000+</SelectItem>
                      <SelectItem value="1w">1w+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">竞争度</span>
                  <Select defaultValue="low">
                    <SelectTrigger className="w-[100px] h-8 text-xs bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低竞争</SelectItem>
                      <SelectItem value="mid">中等</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="h-8 text-xs bg-rose-400 hover:bg-rose-500 text-white px-6 ml-auto">一键筛选蓝海榜单</Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-slate-50/70">
                  <TableRow>
                    <TableHead className="text-xs">单品信息</TableHead>
                    <TableHead className="text-xs">蓝海核心标签</TableHead>
                    <TableHead className="text-xs text-right">售价区间</TableHead>
                    <TableHead className="text-xs text-right">月销量</TableHead>
                    <TableHead className="text-xs text-right">搜索人气</TableHead>
                    <TableHead className="text-xs text-right">竞品数</TableHead>
                    <TableHead className="text-xs text-right">转化概率</TableHead>
                    <TableHead className="text-xs text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BLUE_OCEAN_PRODUCTS.map((p) => (
                    <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-5 h-5 text-slate-300" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-700 text-xs truncate w-40">{p.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Badge className={cn(
                                "text-[8px] px-1 py-0 border-none font-black uppercase",
                                p.platform === '抖音' ? "bg-slate-800 text-white" : 
                                p.platform === '淘宝' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                              )}>{p.platform}</Badge>
                              <span className="text-[10px] text-slate-400">{p.category}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.tags.map(t => (
                            <Badge key={t} variant="secondary" className="bg-rose-50 text-rose-600 border-none text-[9px] font-bold">{t}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-700">{p.price}</TableCell>
                      <TableCell className="text-right font-mono text-slate-600">{p.sales}</TableCell>
                      <TableCell className="text-right font-mono text-slate-600">{p.searchPop}</TableCell>
                      <TableCell className="text-right font-bold text-slate-700">{p.competitors}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-emerald-600 font-black">{p.convProb}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500 hover:bg-rose-50" onClick={() => showSuccess("已加入收藏选品库")}>
                            <Heart className="w-3 h-3 mr-1" /> 收藏
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-500">
                            详情
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 底部数据状态栏 */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-slate-900 text-slate-300 py-3 px-8 z-40 flex items-center justify-between text-[10px] shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-slate-400" /> 全域数据覆盖：淘宝、京东、抖音、快手</span>
            <span className="h-3 w-[1px] bg-slate-700" />
            <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-rose-400" /> 内容热度：分钟级更新 | 交易数据：T+1 更新</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">AI 数据清洗模型运行中 (已剔除虚假订单)</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SelectionEngine;