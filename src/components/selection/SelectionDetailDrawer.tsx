import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, MessageSquare, Zap, ArrowRight, 
  ShieldAlert, ShoppingBag, BarChart3, Send,
  CheckCircle2, AlertCircle, Lightbulb, RefreshCw,
  Eye, FileText, HelpCircle, ShieldCheck, Box, Ship, Coins
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface SelectionDetailDrawerProps {
  item: any;
  onClose: () => void;
}

const COLORS = ['#f5756c', '#fca39d', '#fedcd9', '#94a3b8'];

const SelectionDetailDrawer = ({ item, onClose }: SelectionDetailDrawerProps) => {
  if (!item) return null;

  const nlpData = [
    { name: '好评', value: 88 },
    { name: '中性', value: 7 },
    { name: '差评', value: 5 },
  ];

  const painPoints = [
    { name: '包装渗漏', val: 45 },
    { name: '物流慢', val: 25 },
    { name: '肤感油腻', val: 20 },
    { name: '价格贵', val: 10 },
  ];

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-3xl p-0 flex flex-col text-left">
        <SheetHeader className="p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={item.img} className="w-12 h-12 rounded-xl object-cover border border-slate-100" alt="" />
              <div>
                <SheetTitle className="text-base font-black text-slate-800">{item.title}</SheetTitle>
                <div className="flex gap-2 mt-1">
                  <Badge className="bg-rose-50 text-rose-600 border-none text-[10px]">潜力分 {item.score}</Badge>
                  <Badge variant="outline" className="text-[10px] border-slate-200">{item.category}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-[10px] border-slate-200">加入监控</Button>
              <Button className="bg-rose-400 hover:bg-rose-500 text-white h-8 text-[10px] font-bold">批量生成素材</Button>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            
            {/* 1. 核心数据与竞品对比 (对标京东) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">建议零售价</span>
                <p className="text-xl font-black text-slate-800">{item.price}</p>
                <p className="text-[9px] text-slate-400">毛利空间: <span className="text-emerald-500 font-bold">{item.profit}</span></p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">预估月销量</span>
                <p className="text-xl font-black text-slate-800">{item.estSales}</p>
                <p className="text-[9px] text-slate-400">热度指数: <span className="text-rose-500 font-bold">{item.heat}</span></p>
              </div>
              <div className="p-4 bg-rose-50/30 rounded-2xl border border-rose-100 space-y-1">
                <span className="text-[10px] text-rose-400 font-bold uppercase">竞品核心数据</span>
                <p className="text-xl font-black text-rose-600">{item.compData.price}</p>
                <p className="text-[9px] text-rose-400">竞品月销: <span className="font-bold">{item.compData.sales}</span></p>
              </div>
            </div>

            {/* 2. 供应链与价格竞争力 (对标 1688) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Box className="w-4 h-4 text-rose-400" /> 供应链与价格竞争力分析
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm bg-slate-50/50">
                  <CardHeader className="p-4 pb-0"><CardTitle className="text-[11px] font-bold text-slate-500">价格区间竞争力热力图</CardTitle></CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-5 gap-1 h-12">
                      {[20, 45, 85, 60, 15].map((val, i) => (
                        <div key={i} className={cn("rounded-sm flex items-center justify-center text-[8px] font-bold", val > 70 ? "bg-rose-400 text-white" : "bg-rose-50 text-rose-700")}>
                          {val}%
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-400 mt-1">
                      <span>低价区</span><span>主流区</span><span>高价区</span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-3">※ 建议定价在主流区边缘，利用 AIGC 强化高溢价心智。</p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-slate-50/50">
                  <CardHeader className="p-4 pb-0"><CardTitle className="text-[11px] font-bold text-slate-500">供应链稳定性评估</CardTitle></CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]"><span className="text-slate-500">货源充足度</span><span className="font-bold text-emerald-500">极高</span></div>
                      <Progress value={95} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]"><span className="text-slate-500">物流响应速度</span><span className="font-bold text-amber-500">中等</span></div>
                      <Progress value={65} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 3. NLP 评价分析卡片 (对标淘宝) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <MessageSquare className="w-4 h-4 text-rose-400" /> NLP 评价深度洞察
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500" onClick={() => showSuccess("正在重新拉取全网评价进行语义聚类...")}>
                  <RefreshCw className="w-3 h-3 mr-1" /> 重新分析
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm bg-slate-50/50">
                  <CardHeader className="p-4 pb-0"><CardTitle className="text-[11px] font-bold text-slate-500">情感分布 (Sentiment)</CardTitle></CardHeader>
                  <CardContent className="p-4 h-[160px] flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={nlpData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                          {nlpData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1 ml-4">
                      {nlpData.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-2 text-[10px]">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-slate-500">{d.name}</span>
                          <span className="font-bold text-slate-700">{d.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-slate-50/50">
                  <CardHeader className="p-4 pb-0"><CardTitle className="text-[11px] font-bold text-slate-500">核心痛点归因 (Pain Points)</CardTitle></CardHeader>
                  <CardContent className="p-4 h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={painPoints} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={60} />
                        <Tooltip />
                        <Bar dataKey="val" fill="#fca39d" radius={[0, 4, 4, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 智能提炼 TOP 卖点
                  </span>
                  <div className="space-y-2">
                    {['30% 酵母精粹', '28天显著淡纹', '无敏配方', '真空泵头设计'].map(p => (
                      <div key={p} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl text-[11px]">
                        <span className="font-medium text-slate-700">{p}</span>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px]">高频提及</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> 高频用户问答 (Q&A)
                  </span>
                  <div className="space-y-2">
                    {[
                      { q: '敏感肌可以用吗？', a: 'AI 建议：强调无敏配方与实测报告' },
                      { q: '白天可以用吗？', a: 'AI 建议：说明无光敏成分，全天可用' }
                    ].map((qa, i) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-100 rounded-xl space-y-1">
                        <p className="text-[11px] font-bold text-slate-800">Q: {qa.q}</p>
                        <p className="text-[10px] text-slate-400">A: {qa.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. 合规风险提示 */}
            <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                  <ShieldAlert className="w-4 h-4" /> 合规风险与 AI 修复建议
                </div>
                <Badge className="bg-rose-100 text-rose-700 border-none text-[9px]">中风险</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-slate-700 font-bold">检测到违规点：竞品文案包含“全网第一”极限词</p>
                    <p className="text-slate-500 leading-relaxed">
                      AI 修复建议：建议将“第一”修改为“核心主打”或“口碑之选”，已自动为您在 AIGC 模块中规避此类词汇。
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 flex gap-3">
          <Button variant="outline" className="flex-1 h-10 text-xs border-slate-200">
            <Eye className="w-3.5 h-3.5 mr-1.5" /> 查看竞品素材
          </Button>
          <Button className="flex-1 h-10 text-xs bg-rose-400 hover:bg-rose-500 text-white font-bold">
            <Send className="w-3.5 h-3.5 mr-1.5" /> 推送至 AIGC 批量生产
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SelectionDetailDrawer;