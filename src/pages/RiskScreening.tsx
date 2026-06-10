import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, Search, 
  RefreshCw, CheckCircle2, Info, AlertCircle,
  Truck, TrendingDown, MessageSquare, FileWarning
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const RiskScreening = () => {
  const [input, setInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = () => {
    if (!input.trim()) return;
    setIsScanning(true);
    setResult(null);
    
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        level: '中',
        score: 65,
        dimensions: [
          { label: '合规风险', status: '低', desc: '未发现禁售风险，标题包含 1 处敏感词“第一”，建议修改。', icon: ShieldCheck, color: 'text-emerald-500' },
          { label: '供应链风险', status: '高', desc: '该货源近期发货延迟率上升 15%，存在较高的缺货风险。', icon: Truck, color: 'text-rose-500' },
          { label: '市场风险', status: '中', desc: '品类内卷度较高，短期内可能面临激烈的价格战。', icon: TrendingDown, color: 'text-amber-500' },
          { label: '售后风险', status: '低', desc: '评价数据稳定，质量问题反馈率低于行业均值。', icon: MessageSquare, color: 'text-emerald-500' },
        ],
        advice: '建议更换更稳定的供应链渠道，并优化标题中的极限词以规避平台处罚。'
      });
      showSuccess("AI 风险筛查完成！");
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 text-left animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-slate-900">基础 AI 风险前置筛查</h1>
          <p className="text-sm text-slate-500">上传单品链接或输入关键词，AI 自动预判合规、供应、市场及售后风险</p>
        </div>

        {/* 搜索输入区 */}
        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="粘贴商品链接 (淘宝/京东/抖音) 或输入商品关键词..." 
                  className="pl-12 h-12 text-sm bg-slate-50 border-slate-200 focus:bg-white transition-all"
                />
              </div>
              <Button 
                onClick={handleScan}
                disabled={isScanning || !input.trim()}
                className="h-12 px-8 bg-rose-400 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-100"
              >
                {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : "一键 AI 检测"}
              </Button>
            </div>
            <div className="flex gap-4 mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider justify-center">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 合规检测</span>
              <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> 供应检测</span>
              <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3" /> 市场检测</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 售后检测</span>
            </div>
          </CardContent>
        </Card>

        {/* 扫描动画 */}
        {isScanning && (
          <div className="py-20 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-rose-100 border-t-rose-400 animate-spin" />
              <ShieldAlert className="absolute inset-0 m-auto w-10 h-10 text-rose-400 animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-slate-700">AI 正在深度扫描全域数据...</p>
              <p className="text-xs text-slate-400">正在比对 10w+ 违规词库与供应链实时动态</p>
            </div>
          </div>
        )}

        {/* 检测结果 */}
        {result && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 风险等级卡片 */}
              <Card className="md:col-span-1 border-none shadow-sm bg-slate-900 text-white">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">综合风险等级</p>
                  <div className={cn(
                    "w-24 h-24 rounded-full border-8 flex items-center justify-center text-3xl font-black",
                    result.level === '高' ? "border-rose-500 text-rose-500" : 
                    result.level === '中' ? "border-amber-500 text-amber-500" : "border-emerald-500 text-emerald-500"
                  )}>
                    {result.level}
                  </div>
                  <div className="space-y-1 w-full">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span>安全指数</span>
                      <span>{result.score}/100</span>
                    </div>
                    <Progress value={result.score} className="h-1.5 bg-white/10" />
                  </div>
                </CardContent>
              </Card>

              {/* 维度详情 */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.dimensions.map((dim: any, i: number) => (
                  <Card key={i} className="border-none shadow-sm bg-white">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <dim.icon className={cn("w-4 h-4", dim.color)} />
                          <span className="text-xs font-bold text-slate-700">{dim.label}</span>
                        </div>
                        <Badge className={cn(
                          "text-[9px] border-none font-bold",
                          dim.status === '高' ? "bg-rose-100 text-rose-600" : 
                          dim.status === '中' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                        )}>{dim.status}风险</Badge>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{dim.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI 规避建议 */}
            <Card className="border-none shadow-sm bg-rose-50 border border-rose-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> AI 规避建议
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-xs text-rose-800 leading-relaxed font-medium">
                  {result.advice}
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-3">
              <Button variant="outline" className="text-xs h-10 px-8 border-slate-200">重新检测</Button>
              <Button className="text-xs h-10 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold">保存至风控档案</Button>
            </div>
          </div>
        )}

        {/* 初始占位 */}
        {!result && !isScanning && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300 space-y-4 opacity-50">
            <FileWarning className="w-16 h-16" />
            <p className="text-sm font-bold">暂无检测记录，请输入商品信息开始筛查</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RiskScreening;