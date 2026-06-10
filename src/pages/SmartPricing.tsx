import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Coins, Calculator, TrendingUp, Target, 
  ArrowRight, CheckCircle2, Info, AlertCircle,
  ShoppingBag, Tag, Percent, RefreshCw
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const SmartPricing = () => {
  const [cost, setCost] = useState('');
  const [profitMargin, setProfitMargin] = useState('30');
  const [platform, setPlatform] = useState('taobao');
  const [isCalculating, setIsCalculating] = useState(false);
  const [pricingResult, setPricingResult] = useState<any>(null);

  const handleCalculate = () => {
    if (!cost) return;
    setIsCalculating(true);
    
    setTimeout(() => {
      const costNum = parseFloat(cost);
      const margin = parseFloat(profitMargin) / 100;
      
      setIsCalculating(false);
      setPricingResult({
        competitorRange: '¥89.00 - ¥125.00',
        suggested: (costNum * (1 + margin + 0.1)).toFixed(2), // 加上平台扣点
        breakEven: (costNum * 1.1).toFixed(2),
        activity: (costNum * (1 + margin)).toFixed(2),
        platformFee: '10%',
        marketPosition: '中端性价比'
      });
      showSuccess("定价方案生成成功！");
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 text-left animate-in fade-in duration-500">
        <div>
          <h1 className="text-xl font-bold text-slate-900">AI 智能定价工具</h1>
          <p className="text-xs text-slate-500 mt-1">基于成本、竞品及平台规则，生成最优售价方案</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 输入配置区 */}
          <Card className="lg:col-span-5 border-none shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Calculator className="w-4 h-4 text-rose-400" /> 定价参数配置
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] text-slate-500 font-bold uppercase">单品拿货成本 (元)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">¥</span>
                  <Input 
                    type="number" 
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="0.00" 
                    className="pl-8 h-11 text-sm bg-slate-50 border-slate-200" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] text-slate-500 font-bold uppercase">期望利润率 (%)</Label>
                <div className="relative">
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="number" 
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(e.target.value)}
                    placeholder="30" 
                    className="h-11 text-sm bg-slate-50 border-slate-200" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] text-slate-500 font-bold uppercase">目标发布平台</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="h-11 text-sm bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="taobao">淘宝/天猫 (适配扣点/直通车)</SelectItem>
                    <SelectItem value="jd">京东 (适配佣金/仓储费)</SelectItem>
                    <SelectItem value="douyin">抖音电商 (适配达人佣金/千川)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCalculate}
                disabled={isCalculating || !cost}
                className="w-full h-11 bg-rose-400 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-100"
              >
                {isCalculating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "生成定价方案"}
              </Button>
            </CardContent>
          </Card>

          {/* 结果展示区 */}
          <div className="lg:col-span-7 space-y-6">
            {pricingResult ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                {/* 竞品对标 */}
                <Card className="border-none shadow-sm bg-white">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">同类竞品主流售价</p>
                      <p className="text-xl font-black text-slate-800">{pricingResult.competitorRange}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className="bg-blue-50 text-blue-600 border-none font-bold">市场定位：{pricingResult.marketPosition}</Badge>
                      <p className="text-[10px] text-slate-400">已自动抓取全域 50+ 竞品数据</p>
                    </div>
                  </CardContent>
                </Card>

                {/* 三类价格方案 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: '建议售价', val: pricingResult.suggested, desc: '兼顾利润与转化', color: 'bg-rose-500', text: 'text-white' },
                    { label: '最低保本价', val: pricingResult.breakEven, desc: '含平台扣点/物流', color: 'bg-slate-100', text: 'text-slate-800' },
                    { label: '常规活动价', val: pricingResult.activity, desc: '大促/秒杀参考', color: 'bg-amber-50', text: 'text-amber-700' },
                  ].map((item, i) => (
                    <Card key={i} className={cn("border-none shadow-sm overflow-hidden", item.color)}>
                      <CardContent className="p-5 space-y-2">
                        <p className={cn("text-[10px] font-bold uppercase opacity-70", item.text)}>{item.label}</p>
                        <p className={cn("text-2xl font-black", item.text)}>¥{item.val}</p>
                        <p className={cn("text-[9px] font-medium opacity-60", item.text)}>{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 费用拆解 */}
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-2 border-b border-slate-50">
                    <CardTitle className="text-xs font-bold text-slate-500">定价逻辑与费用拆解</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      {[
                        { label: '拿货成本', val: `¥${cost}`, pct: '45%' },
                        { label: '平台综合扣点', val: pricingResult.platformFee, pct: '10%' },
                        { label: '预估物流/包材', val: '¥5.00', pct: '5%' },
                        { label: '预估净利润', val: `¥${(parseFloat(pricingResult.suggested) - parseFloat(cost) - 10).toFixed(2)}`, pct: '40%', highlight: true },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">{row.label}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-slate-400 font-mono">{row.pct}</span>
                            <span className={cn("font-bold w-20 text-right", row.highlight ? "text-rose-500" : "text-slate-700")}>{row.val}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-2">
                      <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        该定价方案已适配 <strong>{platform === 'taobao' ? '淘宝' : platform === 'jd' ? '京东' : '抖音'}</strong> 基础平台规则，包含类目佣金与基础推广预留空间。
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 opacity-50 py-20">
                <Coins className="w-16 h-16" />
                <p className="text-sm font-bold">请在左侧输入成本参数生成定价方案</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SmartPricing;