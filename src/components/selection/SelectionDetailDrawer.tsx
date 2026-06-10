import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, MessageSquare, Zap, ArrowRight, 
  ShieldAlert, ShoppingBag, BarChart3, Send,
  CheckCircle2, AlertCircle, Lightbulb, RefreshCw,
  Eye, FileText, HelpCircle, ShieldCheck, Box, Ship, 
  Coins, Target, Users, MapPin, AlertTriangle, 
  Check, Info, Activity, Flame, Clock, Scale
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface SelectionDetailDrawerProps {
  item: any;
  onClose: () => void;
}

const COLORS = ['#f5756c', '#fca39d', '#fedcd9', '#94a3b8'];

const SelectionDetailDrawer = ({ item, onClose }: SelectionDetailDrawerProps) => {
  if (!item) return null;

  // 模拟渠道流量数据
  const trafficData = [
    { name: '搜索流量', value: 45 },
    { name: '短视频', value: 35 },
    { name: '直播流量', value: 20 },
  ];

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0 flex flex-col text-left border-l-rose-100">
        <SheetHeader className="p-6 border-b border-slate-100 shrink-0 bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-rose-100 shadow-sm">
                <img src={item.img} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-lg font-black text-slate-800">{item.title}</SheetTitle>
                  <Badge className="bg-rose-500 text-white border-none text-[10px] px-2 py-0.5">AI 深度解析中</Badge>
                </div>
                <div className="flex gap-2 mt-1.5">
                  <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">{item.category}</Badge>
                  <Badge variant="outline" className="text-[10px] border-rose-200 text-rose-600 bg-rose-50/50">ID: {item.id}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => showSuccess("已加入实时监控库")}>
                <Activity className="w-3.5 h-3.5 mr-1.5" /> 加入监控
              </Button>
              <Button className="bg-rose-400 hover:bg-rose-500 text-white h-9 text-xs font-bold shadow-lg shadow-rose-100">
                <Send className="w-3.5 h-3.5 mr-1.5" /> 推送至 AIGC 生产
              </Button>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 bg-slate-50/30">
          <div className="p-6 space-y-8 pb-24">
            
            {/* 一、顶部核心评分卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: '综合推荐分', val: item.score, sub: '优质潜力', color: 'text-rose-500', bg: 'bg-rose-50' },
                { label: '市场热度分', val: 88, sub: '趋势上升', color: 'text-orange-500', bg: 'bg-orange-50' },
                { label: '蓝海竞争分', val: 92, sub: '极度蓝海', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: '盈利潜力分', val: 85, sub: '高毛利', color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: '风险安全分', val: 95, sub: '低风险', color: 'text-indigo-500', bg: 'bg-indigo-50' },
              ].map((s, i) => (
                <div key={i} className={cn("p-4 rounded-2xl border border-transparent flex flex-col items-center text-center space-y-1", s.bg)}>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{s.label}</span>
                  <span className={cn("text-2xl font-black", s.color)}>{s.val}</span>
                  <Badge variant="outline" className={cn("text-[9px] border-current/20 bg-white/50", s.color)}>{s.sub}</Badge>
                </div>
              ))}
            </div>

            {/* 二、市场趋势分析 */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-400" /> 二、市场趋势分析
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold">市场生命周期</span>
                      <div className="flex gap-2">
                        <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">快速增长期</Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold">30天搜索热度</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-slate-800">12,840</span>
                        <span className="text-xs text-emerald-500 font-bold flex items-center">↑ 24.5%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[11px] text-slate-400 font-bold">热门飙升词</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['多肽抗老', '紧致眼霜', '敏感肌可用'].map(w => (
                          <Badge key={w} variant="secondary" className="bg-slate-50 text-slate-600 text-[10px] border-none">
                            {w} <Flame className="w-2.5 h-2.5 ml-1 text-orange-400" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400 font-bold">渠道流量占比</span>
                    <div className="h-[120px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={trafficData} innerRadius={30} outerRadius={45} paddingAngle={5} dataKey="value">
                            {trafficData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-3 text-[9px] text-slate-400">
                      <span>● 搜索 (45%)</span><span>● 视频 (35%)</span><span>● 直播 (20%)</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold">季节属性</span>
                      <Badge className="bg-blue-50 text-blue-600 border-none font-bold">四季通用</Badge>
                    </div>
                    <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                      <p className="text-[10px] text-rose-700 leading-relaxed">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        AI 预测：受换季影响，未来 15 天“修护”类搜索词将迎来爆发式增长。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 三、竞争格局分析 */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-400" /> 三、竞争格局分析
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">平台同款数量</span>
                    <p className="text-base font-black text-slate-800">12 件</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">头部垄断度</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px]">低垄断</Badge>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">主流成交价</span>
                    <p className="text-base font-black text-slate-800">¥199 - ¥399</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-rose-400 font-bold uppercase">空白利润价</span>
                    <p className="text-base font-black text-rose-600">¥250 - ¥300</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 竞品核心卖点 TOP5
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['大牌同源成分', '快速吸收', '淡化细纹', '高颜值包装', '明星代言'].map(p => (
                        <Badge key={p} variant="secondary" className="bg-slate-50 text-slate-500 text-[10px] border-none">{p}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[11px] text-rose-500 font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-rose-500" /> 差异化机会点
                    </span>
                    <ul className="space-y-1.5">
                      {['主打“真空泵头”杜绝二次污染', '强调“无敏配方”实测报告', '提供“旅行装”试用装策略'].map((p, i) => (
                        <li key={i} className="text-[11px] text-slate-600 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-rose-400" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 四、盈利收益测算 */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Coins className="w-4 h-4 text-rose-400" /> 四、盈利收益测算
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">货源成本价</span>
                    <p className="text-lg font-black text-slate-800">¥45.00</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">参考售价区间</span>
                    <p className="text-lg font-black text-slate-800">¥299 - ¥350</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase">单件毛利率</span>
                    <p className="text-lg font-black text-emerald-600">65.2%</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">保本售价</span>
                    <p className="text-lg font-black text-slate-800">¥85.00</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">AI 预估月销量</span>
                    <p className="text-lg font-black text-slate-800">5k - 8k</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-rose-500 font-bold uppercase">预估月净利润</span>
                    <p className="text-lg font-black text-rose-500">¥15w - ¥24w</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-indigo-600 font-bold uppercase">盈亏平衡 ROI</span>
                    <p className="text-lg font-black text-indigo-600">1.52</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 五、用户舆情&痛点解析 */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-rose-400" /> 五、用户舆情 & 痛点解析
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <span className="text-[11px] text-emerald-600 font-bold">用户好评关键词</span>
                    <div className="flex flex-wrap gap-2">
                      {['温和不刺激 (42%)', '吸收快 (35%)', '包装高级 (15%)'].map(w => (
                        <Badge key={w} className="bg-emerald-50 text-emerald-700 border-none text-[10px]">{w}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[11px] text-rose-600 font-bold">用户差评痛点</span>
                    <div className="flex flex-wrap gap-2">
                      {['包装渗漏 (质量)', '物流太慢 (物流)', '质地偏油 (质量)'].map(w => (
                        <Badge key={w} className="bg-rose-50 text-rose-700 border-none text-[10px]">{w}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400 font-bold">用户人群画像</span>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-[11px] text-slate-700 font-medium">25-40岁 女性 / 资深成分党</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400 font-bold">核心使用场景</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-[11px] text-slate-700 font-medium">晚间修护 / 熬夜急救 / 送礼</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400 font-bold">潜在未满足需求</span>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px] text-slate-700 font-medium">便携旅行装 / 替换芯环保装</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 六、供应链&履约模块 */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Box className="w-4 h-4 text-rose-400" /> 六、供应链 & 履约模块
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">供货稳定性</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px]">优质稳定</Badge>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">现货状态</span>
                    <Badge className="bg-blue-100 text-blue-700 border-none text-[10px]">有现货</Badge>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">最低起订量 (MOQ)</span>
                    <p className="text-base font-black text-slate-800">100 件</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">补货周期</span>
                    <p className="text-base font-black text-slate-800">3 - 5 天</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">物流属性</span>
                    <Badge variant="outline" className="text-[10px] border-slate-200">轻货 / 易碎</Badge>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">预估退货率</span>
                    <p className="text-base font-black text-rose-500">3.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 七、风险合规&运营适配 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-50">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" /> 风险检测
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">侵权风险 (专利/商标)</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px]">无风险</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">资质合规 (备案/证件)</span>
                    <Badge className="bg-blue-100 text-blue-700 border-none text-[10px]">无需特殊资质</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">平台违规词风险</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px]">已自动规避</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-50">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-400" /> 运营适配
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">适配流量渠道</span>
                    <span className="text-[11px] font-bold text-slate-700">自然搜索 / 短视频</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">转化潜力评级</span>
                    <Badge className="bg-rose-100 text-rose-700 border-none text-[10px]">高转化</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">复购属性</span>
                    <span className="text-[11px] font-bold text-slate-700">高频复购品</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 八、AI 智能结论 */}
            <div className="p-6 bg-slate-900 rounded-3xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-black text-white">AI 智能选品结论</h3>
                </div>
                <Badge className="bg-rose-500 text-white border-none font-bold">优选爆款</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> 核心优势总结
                  </span>
                  <ul className="space-y-2">
                    {['高毛利空间 (65%)，具备极强付费推广容错率', '蓝海赛道，同款竞争极低，易获取自然搜索流量', '用户痛点明确，通过真空泵头差异化极易切入'].map((p, i) => (
                      <li key={i} className="text-[11px] text-slate-300 leading-relaxed">• {p}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> 核心风险提示
                  </span>
                  <ul className="space-y-2">
                    {['需重点关注包装密封性，防止物流损耗', '换季流量波动大，需提前 15 天完成素材铺设'].map((p, i) => (
                      <li key={i} className="text-[11px] text-slate-300 leading-relaxed">• {p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5" /> 运营建议
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: '定价建议', val: '¥299 抢占主流区' },
                    { label: '铺货建议', val: '首批备货 500 件' },
                    { label: '推广渠道', val: '抖音短视频种草' },
                    { label: '备货建议', val: '保持 7 天安全库存' }
                  ].map((adv, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-[9px] text-slate-500 block mb-1">{adv.label}</span>
                      <span className="text-[10px] text-white font-bold">{adv.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>

        <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <Button variant="outline" className="flex-1 h-11 text-xs border-slate-200" onClick={onClose}>暂不处理</Button>
          <Button className="flex-1 h-11 text-xs bg-rose-400 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-100" onClick={() => showSuccess("已成功建立商品档案并同步至 AIGC 模块")}>
            一键上架并生成素材
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// 补全缺失的图标
const ListTodo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 16 2 2 4-4"/><path d="m3 6 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
);

export default SelectionDetailDrawer;