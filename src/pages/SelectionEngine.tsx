import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, Search, Settings2, RefreshCw, TrendingUp, 
  AlertTriangle, ArrowRight, BarChart3, Zap, ShieldAlert,
  Filter, Download, Layers, MessageSquare, ShoppingBag,
  ChevronRight, Info, CheckCircle2, XCircle
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";
import SelectionConfigSheet from '@/components/selection/SelectionConfigSheet';
import SelectionDetailDrawer from '@/components/selection/SelectionDetailDrawer';

// 模拟选品结果数据
const MOCK_SELECTION_RESULTS = [
  { 
    id: 'SEL-001', 
    name: '多肽紧致修护眼霜', 
    category: '眼部护理',
    score: 92, 
    type: '高潜力爆款',
    marketHeat: '极高',
    profit: '45%',
    competitorSales: '中等',
    nlpSentiment: '正向 (88%)',
    status: 'success',
    tags: ['蓝海赛道', '成分党关注'],
    opportunity: '竞品普遍反馈包装渗漏，建议采用真空泵头设计。'
  },
  { 
    id: 'SEL-002', 
    name: '氨基酸温和洁面乳', 
    category: '面部清洁',
    score: 65, 
    type: '高竞争饱和品',
    marketHeat: '高',
    profit: '15%',
    competitorSales: '极高',
    nlpSentiment: '中性 (62%)',
    status: 'success',
    tags: ['红海竞争', '价格战严重'],
    opportunity: '市场已饱和，除非有极强价格优势或IP联名，否则不建议切入。'
  },
  { 
    id: 'SEL-003', 
    name: '植物精粹防晒喷雾', 
    category: '防晒隔离',
    score: 42, 
    type: '高差评风险滞销品',
    marketHeat: '中',
    profit: '30%',
    competitorSales: '低',
    nlpSentiment: '负向 (55%)',
    status: 'warning',
    tags: ['过敏风险', '肤感差'],
    opportunity: '竞品过敏率高达12%，需重新研发无敏配方。'
  },
  { 
    id: 'SEL-004', 
    name: '玻尿酸补水面膜 (数据缺失)', 
    category: '面膜',
    score: 0, 
    type: '无效样本',
    marketHeat: '-',
    profit: '-',
    competitorSales: '-',
    nlpSentiment: '-',
    status: 'error',
    tags: ['样本不足', '接口异常'],
    opportunity: '该类目接口调用受限，无法获取完整竞品销量数据。'
  }
];

const SelectionEngine = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleStartSelection = () => {
    setIsCalculating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCalculating(false);
          showSuccess("AI 选品计算完成！已识别 12 个蓝海机会点。");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const filteredResults = useMemo(() => {
    if (activeTab === 'all') return MOCK_SELECTION_RESULTS;
    if (activeTab === 'potential') return MOCK_SELECTION_RESULTS.filter(r => r.type === '高潜力爆款');
    if (activeTab === 'risk') return MOCK_SELECTION_RESULTS.filter(r => r.type === '高差评风险滞销品');
    return MOCK_SELECTION_RESULTS;
  }, [activeTab]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left animate-in fade-in duration-500">
        
        {/* 顶部操作与配置 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI 选品效能中心</h1>
            <p className="text-xs text-slate-500 mt-1">整合全网大盘、竞品及 NLP 评价数据，深度挖掘蓝海赛道机会</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsConfigOpen(true)}
              className="h-9 text-xs border-slate-200"
            >
              <Settings2 className="w-3.5 h-3.5 mr-1.5" /> 权重配置
            </Button>
            <Button 
              onClick={handleStartSelection}
              disabled={isCalculating}
              className="bg-rose-400 hover:bg-rose-500 text-white h-9 text-xs shadow-lg shadow-rose-100"
            >
              {isCalculating ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
              启动批量并行选品计算
            </Button>
          </div>
        </div>

        {/* 计算进度条 */}
        {isCalculating && (
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>正在分析多维度数据流 (搜索/竞品/NLP/经营)...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </CardContent>
          </Card>
        )}

        {/* 核心指标概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: '今日扫描商品', value: '12,580', icon: ShoppingBag, color: 'text-blue-500' },
            { label: '识别蓝海机会', value: '12', icon: Zap, color: 'text-amber-500' },
            { label: '平均预测准确率', value: '89.2%', icon: CheckCircle2, color: 'text-emerald-500' },
            { label: '异常/低质拦截', value: '156', icon: ShieldAlert, color: 'text-rose-500' },
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-sm bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn("p-3 rounded-xl bg-slate-50", item.color)}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
                  <p className="text-xl font-black text-slate-800">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 选品结果列表 */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="pb-0 border-b border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                选品计算结果明细
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-[10px] text-slate-500"><Filter className="w-3 h-3 mr-1" /> 筛选</Button>
                <Button variant="ghost" size="sm" className="h-8 text-[10px] text-slate-500"><Download className="w-3 h-3 mr-1" /> 导出</Button>
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-transparent p-0 h-10 gap-6">
                <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-rose-400 rounded-none bg-transparent px-0 text-xs font-bold">全部结果</TabsTrigger>
                <TabsTrigger value="potential" className="data-[state=active]:border-b-2 data-[state=active]:border-rose-400 rounded-none bg-transparent px-0 text-xs font-bold">高潜力爆款</TabsTrigger>
                <TabsTrigger value="risk" className="data-[state=active]:border-b-2 data-[state=active]:border-rose-400 rounded-none bg-transparent px-0 text-xs font-bold">高风险预警</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/70">
                <TableRow>
                  <TableHead className="text-xs">商品名称 / 类目</TableHead>
                  <TableHead className="text-xs text-center">潜力得分</TableHead>
                  <TableHead className="text-xs">分类标签</TableHead>
                  <TableHead className="text-xs">市场热度</TableHead>
                  <TableHead className="text-xs">利润空间</TableHead>
                  <TableHead className="text-xs">NLP 情感</TableHead>
                  <TableHead className="text-xs text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 text-xs block">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-rose-100 bg-rose-50">
                        <span className="text-xs font-black text-rose-600">{item.score || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={cn(
                          "border-none text-[9px] font-bold",
                          item.type === '高潜力爆款' && 'bg-emerald-100 text-emerald-700',
                          item.type === '高竞争饱和品' && 'bg-amber-100 text-amber-700',
                          item.type === '高差评风险滞销品' && 'bg-rose-100 text-rose-700',
                          item.type === '无效样本' && 'bg-slate-100 text-slate-500',
                        )}>
                          {item.type}
                        </Badge>
                        <div className="flex gap-1">
                          {item.tags.map(tag => (
                            <span key={tag} className="text-[8px] text-slate-400">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-600">{item.marketHeat}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-700">{item.profit}</TableCell>
                    <TableCell className="text-xs text-slate-500">{item.nlpSentiment}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {item.status === 'error' ? (
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500" onClick={() => showError("接口调用异常：API-403 权限受限，请检查开放平台授权。")}>
                            <AlertTriangle className="w-3 h-3 mr-1" /> 查看告警
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-[10px] text-rose-600 hover:bg-rose-50"
                            onClick={() => setSelectedItem(item)}
                          >
                            <BarChart3 className="w-3 h-3 mr-1" /> 深度拆解
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 底部说明 */}
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[11px] text-amber-800 font-bold">数据合规与样本说明</p>
            <p className="text-[10px] text-amber-700/80 leading-relaxed">
              当前计算已自动过滤 156 个数据缺失或违规商品。若识别到接口调用异常，系统将自动挂起该类目计算并输出告警。
              所有选品结果已同步挂载至 AIGC 模块，可直接在“内容工厂”中调用该商品档案生成素材。
            </p>
          </div>
        </div>
      </div>

      {/* 权重配置抽屉 */}
      <SelectionConfigSheet 
        open={isConfigOpen} 
        onOpenChange={setIsConfigOpen} 
      />

      {/* 详情拆解抽屉 */}
      <SelectionDetailDrawer 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </DashboardLayout>
  );
};

export default SelectionEngine;