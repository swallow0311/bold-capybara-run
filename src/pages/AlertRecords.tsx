import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle, Search, Download, 
  Clock, ArrowRight, History,
  ShieldAlert, ShoppingBag, Zap, MessageSquare,
  Eye, Archive, TrendingUp, User, Info, CheckCircle2,
  Play, Check, X, RefreshCw, ListChecks
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const MOCK_RECORDS = [
  { id: 'AL-20260610-001', type: '库存', title: 'XX酵母面霜库存告急', level: '高级', status: '待处理', time: '2026-06-10 09:15', owner: '张三', desc: '当前库存 8 件，低于安全阈值 10 件。' },
  { id: 'AL-20260610-002', type: '合规', title: 'AIGC 文案包含极限词', level: '高级', status: '处理中', time: '2026-06-10 08:40', owner: '李四', desc: '检测到“全网最强”违禁词，已自动拦截。' },
  { id: 'AL-20260609-045', type: 'NLP', title: '评价负面情感激增', level: '中级', status: '已处理', time: '2026-06-09 16:20', owner: '王五', desc: '近24h负面评价占比达15%，主要反馈过敏。' },
  { id: 'AL-20260609-012', type: '价格', title: '竞品价格大幅下调', level: '通知', status: '已验证', time: '2026-06-09 10:05', owner: '系统', desc: '竞品 A 价格下调 20%，建议关注。' },
  { id: 'AL-20260608-088', type: '系统', title: 'API 调用错误率超标', level: '高级', status: '已归档', time: '2026-06-08 23:50', owner: '技术部', desc: '淘宝接口响应超时率达 3.5%。' },
];

const AlertRecords = () => {
  const [records, setRecords] = useState(MOCK_RECORDS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<typeof MOCK_RECORDS[0] | null>(null);

  const getLevelBadge = (level: string) => {
    const styles: any = {
      '高级': 'bg-rose-100 text-rose-700',
      '中级': 'bg-amber-100 text-amber-700',
      '通知': 'bg-blue-100 text-blue-700',
    };
    return <Badge className={cn("border-none text-[10px] font-bold", styles[level])}>{level}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      '待处理': 'bg-slate-100 text-slate-600',
      '处理中': 'bg-indigo-100 text-indigo-700',
      '已处理': 'bg-emerald-100 text-emerald-700',
      '已验证': 'bg-teal-100 text-teal-700',
      '已归档': 'bg-slate-50 text-slate-400',
    };
    return <Badge className={cn("border-none text-[10px] font-bold", styles[status])}>{status}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons: any = {
      '库存': ShoppingBag,
      '合规': ShieldAlert,
      'NLP': MessageSquare,
      '价格': TrendingUp,
      '系统': Zap,
    };
    const Icon = icons[type] || AlertTriangle;
    return <Icon className="w-3.5 h-3.5 text-slate-400" />;
  };

  // 更改单条预警状态
  const handleStatusChange = (id: string, newStatus: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showSuccess(`预警状态已成功更新为「${newStatus}」`);
  };

  // 批量更改状态
  const handleBatchStatusChange = (newStatus: string) => {
    setRecords(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status: newStatus } : r));
    showSuccess(`已批量将 ${selectedIds.length} 项预警标记为「${newStatus}」`);
    setSelectedIds([]);
  };

  // 归档操作
  const handleArchive = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: '已归档' } : r));
    showSuccess("预警记录已成功归档并从待办中移除。");
  };

  // 过滤后的数据列表
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'pending' && r.status === '待处理') ||
        (statusFilter === 'processing' && r.status === '处理中') ||
        (statusFilter === 'done' && (r.status === '已处理' || r.status === '已验证' || r.status === '已归档'));
        
      const matchesSearch = searchQuery.trim() === '' ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.owner.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [records, statusFilter, searchQuery]);

  // 获取快捷操作按钮配置
  const getQuickAction = (record: typeof MOCK_RECORDS[0]) => {
    switch (record.status) {
      case '待处理':
        return { label: '开始处理', icon: Play, color: 'text-indigo-600 hover:bg-indigo-50', nextStatus: '处理中' };
      case '处理中':
        return { label: '标记完成', icon: Check, color: 'text-emerald-600 hover:bg-emerald-50', nextStatus: '已处理' };
      case '已处理':
        return { label: '效果验证', icon: CheckCircle2, color: 'text-teal-600 hover:bg-teal-50', nextStatus: '已验证' };
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-slate-800 text-xs text-left animate-in fade-in duration-500">
        
        {/* 顶部标题与操作 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">预警记录中心</h1>
            <p className="text-xs text-slate-500 mt-1">实时追踪全链路预警状态流转，确保风险闭环处理</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => showSuccess("正在导出预警分析报告...")}>
              <Download className="w-3.5 h-3.5 mr-1.5" /> 导出报告
            </Button>
          </div>
        </div>

        {/* 状态流转示意图 */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {[
                { label: '待处理', desc: '新预警', color: 'bg-slate-100 text-slate-600' },
                { label: '处理中', desc: '正在跟进', color: 'bg-indigo-100 text-indigo-700' },
                { label: '已处理', desc: '处理完成', color: 'bg-emerald-100 text-emerald-700' },
                { label: '已验证', desc: '效果确认', color: 'bg-teal-100 text-teal-700' },
                { label: '已归档', desc: '历史记录', color: 'bg-slate-50 text-slate-400' },
              ].map((step, i, arr) => (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn("px-4 py-1.5 rounded-full font-bold text-[11px] shadow-sm", step.color)}>
                      {step.label}
                    </div>
                    <span className="text-[10px] text-slate-400">{step.desc}</span>
                  </div>
                  {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-slate-200 mb-6" />}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 筛选工具栏 */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索预警标题、ID 或负责人..." 
                className="pl-9 text-xs h-9 bg-slate-50/50 border-slate-200" 
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] h-9 text-xs bg-slate-50">
                <SelectValue placeholder="处理状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="processing">处理中</SelectItem>
                <SelectItem value="done">已处理/归档</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="sm" className="h-9 text-xs text-slate-500" onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}>重置</Button>
          </CardContent>
        </Card>

        {/* 记录列表 */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/70">
                <TableRow>
                  <TableHead className="w-[40px] text-center">
                    <Checkbox 
                      checked={selectedIds.length === filteredRecords.length && filteredRecords.length > 0} 
                      onCheckedChange={(c) => setSelectedIds(c ? filteredRecords.map(r => r.id) : [])} 
                    />
                  </TableHead>
                  <TableHead className="text-xs">预警 ID / 时间</TableHead>
                  <TableHead className="text-xs">类型</TableHead>
                  <TableHead className="text-xs">预警标题与描述</TableHead>
                  <TableHead className="text-xs text-center">优先级</TableHead>
                  <TableHead className="text-xs text-center">当前状态</TableHead>
                  <TableHead className="text-xs">负责人</TableHead>
                  <TableHead className="text-xs text-right w-[240px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                      暂无符合条件的预警记录
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map(record => {
                    const quickAction = getQuickAction(record);
                    return (
                      <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={selectedIds.includes(record.id)} 
                            onCheckedChange={(c) => setSelectedIds(prev => c ? [...prev, record.id] : prev.filter(i => i !== record.id))} 
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-400 font-mono block">{record.id}</span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {record.time}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {getTypeIcon(record.type)}
                            <span className="font-medium text-slate-600">{record.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5 max-w-[300px]">
                            <span className="font-bold text-slate-800 text-xs block">{record.title}</span>
                            <p className="text-[10px] text-slate-400 truncate">{record.desc}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{getLevelBadge(record.level)}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <span className="text-[11px] font-medium text-slate-600">{record.owner}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {quickAction && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn("h-7 text-[10px] font-bold px-2", quickAction.color)}
                                onClick={() => handleStatusChange(record.id, quickAction.nextStatus)}
                              >
                                <quickAction.icon className="w-3 h-3 mr-1" /> {quickAction.label}
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-[10px] text-rose-500 hover:bg-rose-50 px-2" 
                              onClick={() => setSelectedRecord(record)}
                            >
                              <Eye className="w-3 h-3 mr-1" /> 详情
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-[10px] text-slate-500 hover:bg-slate-100 px-2"
                              disabled={record.status === '已归档'}
                              onClick={() => handleArchive(record.id)}
                            >
                              <Archive className="w-3 h-3 mr-1" /> 归档
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 自动升级逻辑提示 */}
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
          <History className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-left">
            <span className="text-xs font-bold text-amber-700">超时自动升级监控中</span>
            <p className="text-[11px] text-amber-600/80 leading-relaxed">
              系统正在实时监控所有“待处理”预警。若中级预警超过 48h 未响应，将自动标记为“高级”并推送至部门主管；高级预警超过 2h 未响应，将触发语音外呼提醒。
            </p>
          </div>
        </div>

        {/* 底部批量操作栏 */}
        <div className={cn(
          "fixed bottom-6 left-72 right-8 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl p-4 rounded-2xl z-40 transition-all flex items-center justify-between",
          selectedIds.length === 0 ? "translate-y-32 opacity-0" : "translate-y-0 opacity-100"
        )}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-xs font-bold text-rose-600">已选中 {selectedIds.length} 项预警</span>
              <button onClick={() => setSelectedIds([])} className="text-rose-400 hover:text-rose-600"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="h-6 w-[1px] bg-slate-200" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => handleBatchStatusChange('处理中')}>
                <Play className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> 批量开始处理
              </Button>
              <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => handleBatchStatusChange('已处理')}>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> 批量标记完成
              </Button>
              <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => handleBatchStatusChange('已验证')}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-teal-500" /> 批量效果验证
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-rose-500" onClick={() => handleBatchStatusChange('已归档')}>
              <Archive className="w-3.5 h-3.5 mr-1.5" /> 批量归档记录
            </Button>
            <Button className="bg-rose-400 hover:bg-rose-500 text-white h-9 px-6 text-xs font-bold rounded-xl shadow-lg shadow-rose-200">
              生成批量处理报告
            </Button>
          </div>
        </div>
      </div>

      {/* 预警详情侧抽屉 */}
      <Sheet open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        {selectedRecord && (
          <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 text-left">
            <SheetHeader className="p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <SheetTitle>预警任务处理工作流</SheetTitle>
              </div>
              <SheetDescription>查看预警源数据、流转历史，进行指派与闭环处理。</SheetDescription>
            </SheetHeader>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto text-slate-700">
              {/* 基本元信息 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block font-mono">任务ID: {selectedRecord.id}</span>
                    <span className="text-xs font-bold text-slate-800">{selectedRecord.title}</span>
                  </div>
                  {getLevelBadge(selectedRecord.level)}
                </div>
              </div>

              {/* 异常详情原因 */}
              <div className="space-y-2">
                <Label className="text-slate-500 font-semibold block">风险警示描述</Label>
                <div className="p-4 bg-rose-50/20 border border-rose-100 rounded-xl text-xs leading-relaxed text-slate-700">
                  {selectedRecord.desc}
                </div>
              </div>

              {/* 状态处理流转 */}
              <div className="space-y-3">
                <Label className="text-slate-500 font-semibold block">风险流转状态更新</Label>
                <div className="space-y-2">
                  <Select 
                    value={selectedRecord.status} 
                    onValueChange={(val) => handleStatusChange(selectedRecord.id, val)}
                  >
                    <SelectTrigger className="bg-slate-50/50 text-xs">
                      <SelectValue placeholder="更新处理状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="待处理">待处理 (待确认风险)</SelectItem>
                      <SelectItem value="处理中">处理中 (正在跟进整改)</SelectItem>
                      <SelectItem value="已处理">已处理 (完成修正待确认)</SelectItem>
                      <SelectItem value="已验证">已验证 (效果复核确认)</SelectItem>
                      <SelectItem value="已归档">已归档 (存入历史归档)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 责任人与时间信息 */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block">当前负责人</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {selectedRecord.owner}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block">触发触发时间</span>
                  <div className="text-xs font-bold text-slate-700 font-mono">
                    {selectedRecord.time}
                  </div>
                </div>
              </div>

              {/* 预警处理流转日志 */}
              <div className="space-y-3">
                <Label className="text-slate-500 font-semibold block">预警日志轨迹</Label>
                <div className="relative border-l border-slate-200 pl-4 ml-2 space-y-4 text-[11px]">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-4 ring-rose-100" />
                    <span className="font-bold text-slate-700 block">系统自动生成预警</span>
                    <span className="text-[10px] text-slate-400 font-mono">今天 {selectedRecord.time.split(' ')[1]}</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-slate-300 rounded-full" />
                    <span className="text-slate-600 block">触发 QPS / 超算规则检测分析</span>
                    <span className="text-[10px] text-slate-400">进行归因检测</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(null)}>关闭窗口</Button>
              <Button 
                onClick={() => {
                  handleStatusChange(selectedRecord.id, '已处理');
                  setSelectedRecord(null);
                }} 
                className="bg-rose-400 hover:bg-rose-500 text-white font-bold h-9 text-xs"
              >
                已处理完成
              </Button>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </DashboardLayout>
  );
};

export default AlertRecords;