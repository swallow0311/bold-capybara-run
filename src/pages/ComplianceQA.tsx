import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, Upload, 
  RefreshCw, Check, Sparkles, BookOpen, AlertCircle
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const MOCK_RISKS = [
  {
    id: 1,
    type: '极限词违规',
    source: '中达面霜_大促文案版本B',
    desc: '违规使用了绝对化极限用词：“最强”、“第一”。违反《新广告法》第九条极限词限制。',
    content: '中达这款防晒绝对是全网“最强”的防晒喷雾！夏天出门喷一下，能够“第一”速度成膜，彻底根除紫外线伤害。',
    fixed: false
  },
  {
    id: 2,
    type: '违规宣称与夸大功效',
    source: '积雪草净化泥膜详情海报',
    desc: '过度承诺医学级疗效词汇：“彻底根除”。化妆品不允许宣称疾病治疗功效。',
    content: '使用该泥膜能够“彻底根除”毛孔粗大与顽固粉刺，三秒见效，永久不再复发！',
    fixed: false
  }
];

const ComplianceQA = () => {
  const [risks, setRisks] = useState(MOCK_RISKS);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          showSuccess("合规性批量扫描结束！发现 2 项合规违规风险。");
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleFix = (id: number) => {
    setRisks(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, fixed: true };
      }
      return item;
    }));
    showSuccess(`已为您对风险项 ${id} 实施AI平替修饰词替换，替换后已符合法理规范。`);
  };

  const highlightForbiddenWords = (text: string) => {
    let highlighted = text;
    ["最强", "第一", "彻底根除", "永久"].forEach(word => {
      const regex = new RegExp(word, 'g');
      highlighted = highlighted.replace(regex, `<span class="bg-red-100 text-red-600 px-1 rounded font-bold border border-red-200 line-through decoration-double">${word}</span>`);
    });
    return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left">
        
        {/* Header Toolbar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">新广告法合规风控质检中心</h1>
            <p className="text-xs text-slate-500">内容上架各大电商平台前的智能合规质检与自动风险拦截，规避违规封店处罚。</p>
          </div>
          <Button 
            onClick={startScan}
            disabled={isScanning}
            className="bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                正在深度扫描排查中 {scanProgress}%
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 mr-1.5" />
                一键启动合规批量扫描
              </>
            )}
          </Button>
        </div>

        {/* Scan Progress Bar */}
        {isScanning && (
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>极限词与虚假宣称比对检索库深度匹配中...</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2 bg-slate-100" />
            </CardContent>
          </Card>
        )}

        {/* Statistics metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-rose-50 p-3.5 rounded-xl">
                <ShieldAlert className="text-rose-500 w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">待修复风险阻断项</span>
                <span className="text-xl font-bold text-slate-800">
                  {risks.filter(r => !r.fixed).length} 个
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-emerald-50 p-3.5 rounded-xl">
                <CheckCircle2 className="text-emerald-500 w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">AI一键修复合规率</span>
                <span className="text-xl font-bold text-slate-800">100%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-amber-50 p-3.5 rounded-xl">
                <AlertTriangle className="text-amber-600 w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">敏感词比对更新</span>
                <span className="text-xl font-bold text-slate-800">今日 08:00</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload entry / Check area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Area (4 cols) - Guidelines & quick check */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-rose-400" />
                  新广告法典型警示库
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs text-slate-700">
                <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-100/60 space-y-1 text-left">
                  <span className="font-bold text-rose-800 block">第一/最高级等极限绝对化词</span>
                  <span className="text-slate-500 leading-normal block">
                    化妆品绝对禁止使用“顶级”、“第一”、“最好”等极限词描述，被监管查实易触发重罚起步。
                  </span>
                </div>

                <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-100 space-y-1 text-left">
                  <span className="font-bold text-amber-800 block">宣称彻底治疗皮肤疾病</span>
                  <span className="text-slate-500 leading-normal block">
                    禁止明示或暗示对皮炎、脱发、色斑等病症的治愈能力，所有功效宣传需具有可靠功效报告佐证。
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Upload className="w-4 h-4 text-rose-400" />
                  外部文本临时速检
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <textarea 
                  placeholder="粘贴外文或者临时起草的宣传语，实时触发合规风控诊断..."
                  className="w-full text-xs text-slate-600 bg-slate-50/50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-300 h-28 resize-none leading-relaxed" 
                />
                <Button 
                  onClick={() => showSuccess("速检通过！未发现违规敏感极限词汇。")}
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold h-9 text-xs rounded-xl"
                >
                  运行临时合规速检
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Area (8 cols) - Risk diagnosis reports */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                  风险定位与高亮排查明细
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {risks.map(risk => (
                  <div key={risk.id} className={cn(
                    "p-5 rounded-xl border transition-all space-y-3",
                    risk.fixed 
                      ? "border-emerald-200 bg-emerald-50/15" 
                      : "border-rose-100 bg-rose-50/15 hover:border-rose-300"
                  )}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-rose-500 text-white border-none text-[9px] font-bold">
                          {risk.type}
                        </Badge>
                        <span className="font-bold text-xs text-slate-700">{risk.source}</span>
                      </div>
                      {risk.fixed ? (
                        <span className="text-[11px] font-bold text-green-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> 已完成AI平替修复
                        </span>
                      ) : (
                        <Button 
                          onClick={() => handleFix(risk.id)}
                          size="sm" 
                          className="h-7 text-[10px] bg-rose-400 hover:bg-rose-500 text-white"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          一键AI合规修复
                        </Button>
                      )}
                    </div>

                    <div className="p-3 bg-white border border-slate-100 rounded-lg text-xs text-slate-600 leading-relaxed font-mono">
                      {risk.fixed ? (
                        <div className="text-green-600 font-bold">
                          【AI 修复方案】：将极限违规词自动替换为合规的平替描述（例如：“全网最强”修护平替为“温和修护”；去除了“第一”和“彻底根除”等敏感宣传词汇）。
                        </div>
                      ) : (
                        highlightForbiddenWords(risk.content)
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-start gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{risk.desc}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplianceQA;