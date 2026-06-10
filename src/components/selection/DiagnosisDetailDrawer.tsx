import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, TrendingDown, AlertCircle, Wand2, 
  BarChart3, MessageSquare, ShoppingBag, ArrowRight,
  CheckCircle2, RefreshCw, FileText, ImageIcon, VideoIcon
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DiagnosisDetailDrawerProps {
  item: any;
  onClose: () => void;
}

const MOCK_CHART = [
  { name: '周一', traffic: 400, cvr: 2.1 },
  { name: '周二', traffic: 300, cvr: 1.8 },
  { name: '周三', traffic: 500, cvr: 2.5 },
  { name: '周四', traffic: 200, cvr: 0.8 },
  { name: '周五', traffic: 150, cvr: 0.5 },
  { name: '周六', traffic: 100, cvr: 0.3 },
  { name: '周日', traffic: 80, cvr: 0.2 },
];

const DiagnosisDetailDrawer = ({ item, onClose }: DiagnosisDetailDrawerProps) => {
  if (!item) return null;

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col text-left">
        <SheetHeader className="p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <SheetTitle className="text-base font-black text-slate-800">{item.name}</SheetTitle>
                <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] mt-1">{item.status}</Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            
            {/* 1. 流量与转化趋势复盘 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <BarChart3 className="w-4 h-4 text-rose-400" /> 近 7 日流量与转化趋势
                </div>
                <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> 转化率下降 75%
                </span>
              </div>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="traffic" stroke="#f5756c" fill="#f5756c" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="cvr" stroke="#fca39d" fill="#fca39d" fillOpacity={0.05} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. AI 滞销归因诊断 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <AlertCircle className="w-4 h-4 text-rose-400" /> AI 深度归因诊断
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: '价格竞争力', status: '极低', desc: '当前售价 ¥89，竞品主流成交价 ¥69-75，溢价过高。', color: 'text-rose-600 bg-rose-50' },
                  { label: '素材质量', status: '中等', desc: '主图点击率 1.2% 低于行业均值 3.5%，背景过于杂乱。', color: 'text-amber-600 bg-amber-50' },
                  { label: '评价口碑', status: '风险', desc: '近 30 日差评率上升，集中在“包装简陋”和“物流慢”。', color: 'text-rose-600 bg-rose-50' }
                ].map((diag, i) => (
                  <div key={i} className={cn("p-4 rounded-2xl border border-transparent space-y-2", diag.color)}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold">{diag.label}</span>
                      <Badge variant="outline" className="text-[9px] border-current">{diag.status}</Badge>
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed">{diag.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 针对性优化建议 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Wand2 className="w-4 h-4 text-rose-400" /> AI 智能优化建议
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">重写营销文案</p>
                      <p className="text-[10px] text-slate-400">当前文案卖点不突出，建议强化“积雪草深层净化”心智。</p>
                    </div>
                    <Button size="sm" className="ml-auto h-7 text-[10px] bg-rose-400 hover:bg-rose-500 text-white">一键重写</Button>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">重做 AI 场景主图</p>
                      <p className="text-[10px] text-slate-400">建议切换为“实验室科学风”背景，提升高客单价信任感。</p>
                    </div>
                    <Button size="sm" className="ml-auto h-7 text-[10px] bg-rose-400 hover:bg-rose-500 text-white">去设计</Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 flex gap-3">
          <Button variant="outline" className="flex-1 h-10 text-xs border-slate-200" onClick={onClose}>暂不处理</Button>
          <Button className="flex-1 h-10 text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold" onClick={() => showSuccess("已将该商品加入重点监控计划")}>
            加入重点监控
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DiagnosisDetailDrawer;