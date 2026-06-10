import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Sparkles, Download, TrendingUp, AlertTriangle, 
  Coins, Target, Microscope, ShieldCheck, Info,
  MessageSquare, ShieldAlert, Copy, Check, Send,
  Zap, Heart, AlertCircle
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface AiAnalysisReportProps {
  product: any;
}

const AiAnalysisReport = ({ product }: AiAnalysisReportProps) => {
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!product) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <Target className="w-8 h-8" />
        </div>
        <p className="text-sm font-bold">请从左侧榜单选中单品查看 AI 研判报告</p>
      </div>
    );
  }

  const handleGenerateScripts = () => {
    setIsGenerating(true);
    setIsScriptModalOpen(true);
    setTimeout(() => {
      setIsGenerating(false);
      showSuccess("AI 已根据竞品弱点生成 3 组避坑营销话术");
    }, 1500);
  };

  const getRatingColor = (rating: string) => {
    if (rating === '高') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (rating === '中') return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* 头部概览 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-black text-slate-800">AI 深度研判报告</h3>
          </div>
          <Button size="sm" variant="outline" className="h-8 text-[10px] border-rose-200 text-rose-600" onClick={() => showSuccess("报告导出成功")}>
            <Download className="w-3.5 h-3.5 mr-1.5" /> 导出报告
          </Button>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3 shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase">新品立项可行性评级</span>
            <Badge className={cn("border-none font-black px-3 py-0.5", getRatingColor(product.aiReport.feasibility))}>
              {product.aiReport.feasibility}可行性
            </Badge>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">市场匹配度</span>
              <span className="font-bold text-rose-400">88%</span>
            </div>
            <Progress value={88} className="h-1.5 bg-white/10" />
          </div>
        </div>
      </div>

      {/* 核心研判维度 */}
      <div className="flex-1 space-y-5 overflow-y-auto pr-2">
        {/* 定价与竞争 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Coins className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase">建议定价区间</span>
            </div>
            <p className="text-lg font-black text-slate-800">{product.aiReport.suggestedPrice}</p>
            <p className="text-[9px] text-slate-400">基于竞品均价与毛利测算</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Target className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase">市场竞争度</span>
            </div>
            <p className="text-lg font-black text-slate-800">{product.aiReport.competition}</p>
            <p className="text-[9px] text-slate-400">当前赛道同质化程度</p>
          </div>
        </div>

        {/* 竞品弱点对标 (New) */}
        <Card className="border-none shadow-sm bg-amber-50/30 border border-amber-100">
          <CardHeader className="pb-2 border-b border-amber-100/50">
            <CardTitle className="text-[11px] font-bold flex items-center gap-2 text-amber-700">
              <ShieldAlert className="w-3.5 h-3.5" /> 竞品核心弱点对标 (NLP 抓取)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              {[
                { label: '包装设计', issue: '泵头易渗漏、残留严重', impact: '高退货率' },
                { label: '肤感体验', issue: '夏季使用过于油腻、闷痘', impact: '负面舆情' },
                { label: '成分合规', issue: '部分批次浓度波动大', impact: '信任危机' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 w-14">{item.label}</span>
                    <span className="text-slate-500">{item.issue}</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] border-amber-200 text-amber-600">{item.impact}</Badge>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleGenerateScripts}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold h-8 rounded-lg mt-1"
            >
              <Zap className="w-3 h-3 mr-1.5" /> 生成避坑营销话术
            </Button>
          </CardContent>
        </Card>

        {/* 成分趋势 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-[11px] font-bold flex items-center gap-2 text-indigo-600">
              <Microscope className="w-3.5 h-3.5" /> 主流成分趋势分析
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {product.aiReport.ingredientTrends}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.ingredients.map((ing: string) => (
                <Badge key={ing} variant="secondary" className="bg-indigo-50 text-indigo-700 border-none text-[9px]">
                  {ing}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 风险提示 */}
        <Card className="border-none shadow-sm bg-rose-50/50 border border-rose-100">
          <CardHeader className="pb-2 border-b border-rose-100/50">
            <CardTitle className="text-[11px] font-bold flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-3.5 h-3.5" /> 核心风险提示
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {product.aiReport.risks.map((risk: string, i: number) => (
                <li key={i} className="text-[11px] text-rose-700 flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  {risk}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 运营建议 */}
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase">AI 运营建议</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            建议优先在{product.platform}进行短视频测款，利用“{product.ingredients[0]}”作为核心视觉钩子，避开头部品牌的价格战区间。
          </p>
        </div>
      </div>

      {/* 避坑话术生成弹窗 */}
      <Dialog open={isScriptModalOpen} onOpenChange={setIsScriptModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <DialogTitle className="text-base font-black">AI 避坑营销话术矩阵</DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 text-xs mt-1">
              基于竞品弱点自动生成的差异化营销内容，可直接用于小红书、抖音等平台。
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6 bg-slate-50 max-h-[70vh] overflow-y-auto">
            {isGenerating ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-rose-500 animate-spin" />
                <p className="text-xs font-bold text-slate-500">AI 正在深度解析竞品评价并重构话术...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 话术 1: 小红书测评风 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-rose-100 text-rose-700 border-none text-[10px] font-bold">小红书 · 深度测评风</Badge>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-400 hover:text-rose-500" onClick={() => showSuccess("已复制到剪贴板")}>
                      <Copy className="w-3 h-3 mr-1" /> 复制
                    </Button>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <p className="text-xs font-bold text-slate-800">标题：听我一句劝！别再给那些“漏液”大牌交智商税了...😭</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      家人们谁懂啊！之前跟风买的某大牌{product.name.split(' ')[0]}，泵头设计真的绝了，每次按都漏一手，心疼死我的钱了！💸<br/><br/>
                      直到我发现了这款【中达{product.name.split(' ')[1]}】，真空泵头设计真的太香了！每一滴都新鲜不浪费。而且质地超清爽，完全没有某大牌那种闷痘感。敏感肌姐妹闭眼冲！✨
                    </p>
                  </div>
                </div>

                {/* 话术 2: 抖音直播口播风 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-slate-800 text-white border-none text-[10px] font-bold">抖音 · 直播口播风</Badge>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-400 hover:text-rose-500" onClick={() => showSuccess("已复制到剪贴板")}>
                      <Copy className="w-3 h-3 mr-1" /> 复制
                    </Button>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                      “来，直播间的姐妹们看过来！你们是不是也买过那种几百块一瓶，结果涂完满脸油光、第二天就长痘的面霜？（停顿）<br/><br/>
                      今天我手里这款，直接把‘油腻感’从配方里删掉了！我们用的是30%高浓度酵母，只给营养不给负担！如果你受够了那些‘油腻大牌’，今天这一单，你一定要试一下，不好用你回来找我！”
                    </p>
                  </div>
                </div>

                {/* 话术 3: 详情页对比风 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-indigo-100 text-indigo-700 border-none text-[10px] font-bold">详情页 · 差异化对比</Badge>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-400 hover:text-rose-500" onClick={() => showSuccess("已复制到剪贴板")}>
                      <Copy className="w-3 h-3 mr-1" /> 复制
                    </Button>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 opacity-50">
                        <p className="text-[10px] font-bold text-slate-400 text-center">普通竞品</p>
                        <div className="p-2 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-[9px] text-slate-400 space-y-1">
                          <p>❌ 开放式瓶口，易污染</p>
                          <p>❌ 质地厚重，难吸收</p>
                          <p>❌ 价格虚高，品牌溢价</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-rose-500 text-center">中达出品</p>
                        <div className="p-2 bg-rose-50 rounded-lg border border-rose-100 text-[9px] text-rose-700 space-y-1">
                          <p>✅ 真空泵头，单向锁鲜</p>
                          <p>✅ 一抹化水，靶向渗透</p>
                          <p>✅ 源头直供，极致性价比</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setIsScriptModalOpen(false)}>关闭</Button>
            <Button className="bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold px-6" onClick={() => showSuccess("话术已同步至 AIGC 文案库")}>
              一键同步至文案库
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AiAnalysisReport;