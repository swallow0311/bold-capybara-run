import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, Search, Download, 
  Clock, ArrowRight, History,
  ShieldAlert, ShoppingBag, Zap, MessageSquare,
  Eye, Archive, TrendingUp, User, Info, CheckCircle2,
  Play, Check, X, RefreshCw, ListChecks, ClipboardList
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 扩展 Mock 数据，增加处理历史记录
const MOCK_RECORDS = [
  { 
    id: 'AL-20260610-001', 
    type: '库存', 
    title: 'XX酵母面霜库存告急', 
    level: '高级', 
    status: '待处理', 
    time: '2026-06-10 09:15', 
    owner: '张三', 
    desc: '当前库存 8 件，低于安全阈值 10 件。',
    history: [
      { time: '2026-06-10 09:15', action: '系统触发预警', operator: '系统', content: '触发库存安全阈值告警' }
    ]
  },
  { 
    id: 'AL-20260610-002', 
    type: '合规', 
    title: 'AIGC 文案包含极限词', 
    level: '高级', 
    status: '处理中', 
    time: '2026-06-10 08:40', 
    owner: '李四', 
    desc: '检测到“全网最强”违禁词，已自动拦截。',
    history: [
      { time: '2026-06-10 08:40', action: '系统触发预警', operator: '系统', content: '触发 AIGC 合规拦截规则' },
      { time: '2026-06-10 09:00', action: '开始处理', operator: '李四', content: '正在联系文案组修改关键词' }
    ]
  },
  { 
    id: 'AL-20260609-045', 
    type: 'NLP', 
    title: '评价负面情感激增', 
    level: '中级', 
    status: '已处理', 
    time: '2026-06-09 16:20', 
    owner: '王五', 
    desc: '近24h负面评价占比达15%，主要反馈过敏。',
    history: [
      { time: '2026-06-09 16:20', action: '系统触发预警', operator: '系统', content: '触发 NLP 情感波动告警' },
      { time: '2026-06-09 17:00', action: '开始处理', operator: '王五', content: '核实过敏批次' },
      { time: '2026-06-10 10:00', action: '标记完成', operator: '王五', content: '已下架对应批次并开启售后通道' }
    ]
  },
];

const AlertRecords = () => {
  const [records, setRecords] = useState(MOCK_RECORDS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 详情抽屉状态
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  
  // 操作弹窗状态
  const [actionModal, setActionDialog] = useState<{
    isOpen: boolean;
    recordId: string | null;
    type: 'process' | 'complete' | 'verify' | 'archive' | null;
    inputValue: string;
  }>({
    isOpen: false,
    recordId: null,
    type: null,
    inputValue: ''
  });

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

  // 打开操作弹窗
  const openActionModal = (recordId: string, type: 'process' | 'complete' | 'verify' | 'archive') => {
    setActionDialog({
      isOpen: true,
      recordId,
      type,
      inputValue: ''
    });
  };

  // 提交操作
  const handleActionSubmit = () => {
    const { recordId, type, inputValue } = actionModal;
    if (!recordId || !type) return;

    // 校验逻辑
    const isRequired = type !== 'archive';
    if (isRequired && (!inputValue.trim() || inputValue.length < 1)) {
      showError(type === 'process' ? "请输入处理内容" : "请输入备注信息");
      return;
    }
    if (inputValue.length > 200) {
      showError("内容不能超过 200 个字符");
      return;
    }

    const now = new Date().toLocaleString();
    const statusMap: any = {
      process: '处理中',
      complete: '已处理',
      verify: '已验证',
      archive: '已归档'
    };
    const actionNameMap: any = {
      process: '开始处理',
      complete: '标记完成',
      verify: '效果验证',
      archive: '归档记录'
    };

    setRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: statusMap[type],
          history: [
            ...r.history,
            { time: now, action: actionNameMap[type], operator: '当前用户', content: inputValue || (type === 'archive' ? '无备注归档' : '') }
          ]
        };
      }
      return r;
    }));

    showSuccess(`操作成功，预警状态已更新为「${statusMap[type]}」`);
    setActionDialog({ isOpen: false, recordId: null, type: null, inputValue: '' });
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
        r.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [records, statusFilter, searchQuery]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-slate-800 text-xs text-left animate-in fade-in duration-500">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">预警记录中心</h1>
            <p className="text-xs text-slate-500 mt-1">实时追踪全链路预警状态流转，确保风险闭环处理</p>
          </div>
          <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => showSuccess("正在导出预警分析报告...")}>
            <Download className="w-3.5 h-3.5 mr-1.5" /> 导出报告
          </Button>
        </div>

        {/* 筛选工具栏 */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索预警标题或 ID..." 
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
                  <TableHead className="text-xs">预警 ID / 时间</TableHead>
                  <TableHead className="text-xs">类型</TableHead>
                  <TableHead className="text-xs">预警标题与描述</TableHead>
                  <TableHead className="text-xs text-center">优先级</TableHead>
                  <TableHead className="text-xs text-center">当前状态</TableHead>
                  <TableHead className="text-xs text-right w-[200px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map(record => (
                  <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors">
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {/* 动态操作按钮 */}
                        {record.status === '待处理' && (
                          <Button 
                            variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50"
                            onClick={() => openActionModal(record.id, 'process')}
                          >
                            <Play className="w-3 h-3 mr-1" /> 处理
                          </Button>
                        )}
                        {record.status === '处理中' && (
                          <Button 
                            variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50"
                            onClick={() => openActionModal(record.id, 'complete')}
                          >
                            <Check className="w-3 h-3 mr-1" /> 完成
                          </Button>
                        )}
                        {record.status === '已处理' && (
                          <Button 
                            variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-teal-600 hover:bg-teal-50"
                            onClick={() => openActionModal(record.id, 'verify')}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> 验证
                          </Button>
                        )}
                        {record.status === '已验证' && (
                          <Button 
                            variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-slate-600 hover:bg-slate-100"
                            onClick={() => openActionModal(record.id, 'archive')}
                          >
                            <Archive className="w-3 h-3 mr-1" /> 归档
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500 hover:bg-rose-50" 
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye className="w-3 h-3 mr-1" /> 详情
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 操作输入弹窗 */}
      <Dialog open={actionModal.isOpen} onOpenChange={(open) => !open && setActionDialog({ ...actionModal, isOpen: false })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              {actionModal.type === 'process' && <><Play className="w-4 h-4 text-indigo-500" /> 开始处理预警</>}
              {actionModal.type === 'complete' && <><Check className="w-4 h-4 text-emerald-500" /> 标记处理完成</>}
              {actionModal.type === 'verify' && <><CheckCircle2 className="w-4 h-4 text-teal-500" /> 验证处理效果</>}
              {actionModal.type === 'archive' && <><Archive className="w-4 h-4 text-slate-500" /> 归档预警记录</>}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                {actionModal.type === 'process' ? '处理内容' : '备注信息'}
                {actionModal.type !== 'archive' && <span className="text-rose-500 ml-1">*</span>}
              </Label>
              <Textarea 
                value={actionModal.inputValue}
                onChange={(e) => setActionDialog({ ...actionModal, inputValue: e.target.value })}
                placeholder={actionModal.type === 'archive' ? "请输入归档备注（选填）" : "请输入详细说明（1-200字）"}
                className="text-xs h-24 resize-none"
              />
              <div className="text-right text-[10px] text-slate-400">
                {actionModal.inputValue.length} / 200
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setActionDialog({ ...actionModal, isOpen: false })}>取消</Button>
            <Button size="sm" className="bg-rose-400 hover:bg-rose-500 text-white" onClick={handleActionSubmit}>确认提交</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 详情侧抽屉 */}
      <Sheet open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        {selectedRecord && (
          <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 text-left">
            <SheetHeader className="p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <SheetTitle>预警任务详情轨迹</SheetTitle>
              </div>
              <SheetDescription>查看预警源数据及全生命周期处理记录。</SheetDescription>
            </SheetHeader>

            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
              {/* 1. 预警基础信息 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Info className="w-4 h-4 text-rose-400" /> 预警基础信息
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">预警 ID</span>
                    <span className="font-mono font-bold text-slate-700">{selectedRecord.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">预警类型</span>
                    <span className="font-bold text-slate-700">{selectedRecord.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">当前状态</span>
                    {getStatusBadge(selectedRecord.status)}
                  </div>
                  <div className="space-y-1 pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block">风险描述</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{selectedRecord.desc}</p>
                  </div>
                </div>
              </div>

              {/* 2. 处理记录轨迹 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <ClipboardList className="w-4 h-4 text-rose-400" /> 处理记录轨迹
                </div>
                <div className="relative border-l-2 border-slate-100 ml-2 pl-6 space-y-8">
                  {selectedRecord.history.map((log: any, idx: number) => (
                    <div key={idx} className="relative">
                      {/* 节点圆点 */}
                      <div className={cn(
                        "absolute -left-[33px] top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                        idx === selectedRecord.history.length - 1 ? "bg-rose-500 ring-4 ring-rose-100" : "bg-slate-300"
                      )} />
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">{log.action}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <User className="w-3 h-3" />
                          <span>操作人：{log.operator}</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                          {log.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 shrink-0">
              <Button variant="outline" className="w-full" onClick={() => setSelectedRecord(null)}>关闭详情</Button>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </DashboardLayout>
  );
};

export default AlertRecords;