import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Play, Pause, Trash2, FolderArchive, Download, 
  Layers, PlusCircle, AlertCircle, RefreshCw, CheckCircle2,
  FileSpreadsheet, Sparkles, Send, Ban, History, HelpCircle,
  Sliders, ShieldCheck, ChevronDown, ChevronUp
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 带有详细全局参数继承快照及子任务错误拦截数据的 mock 任务列表
const INITIAL_TASKS = [
  {
    id: 'T-001',
    name: '夏季防晒乳大促详情页主图批量AI替换',
    time: '2026-05-20 09:30',
    total: 50,
    success: 45,
    pending: 0,
    failed: 5,
    priority: '高',
    status: '部分失败',
    threads: 8,
    snapshot: { style: '温暖珊瑚', size: '1:1 正方形', res: '超清 2K', subtitle: '经典简约白', bgm: '热烈夏日', sticker: '限时秒杀' },
    subtasks: [
      { id: 'SUB-001', sku: 'SKU-SUN-101', status: '已完成', error: '' },
      { id: 'SUB-002', sku: 'SKU-SUN-102', status: '已完成', error: '' },
      { id: 'SUB-003', sku: 'SKU-SUN-103', status: '合规拦截', error: '【合规拦截】检测到广告法极限词：“第一款防晒”' },
      { id: 'SUB-004', sku: 'SKU-SUN-104', status: '素材缺失', error: '【素材缺失】未检索到该商品的透明背景产品图素材' },
      { id: 'SUB-005', sku: 'SKU-SUN-105', status: '渲染超时', error: '【渲染超时】GPU物理算力节点在 60s 内无响应' }
    ]
  },
  {
    id: 'T-002',
    name: '小红书酵母紧致面霜种草图文大批量生成',
    time: '2026-05-20 10:15',
    total: 30,
    success: 30,
    pending: 0,
    failed: 0,
    priority: '中',
    status: '已完成',
    threads: 5,
    snapshot: { style: '莫兰迪粉', size: '3:4 竖图', res: '标准 1024', subtitle: '醒目活力黄', bgm: '无', sticker: '无' },
    subtasks: [
      { id: 'SUB-101', sku: 'SKU-FAC-201', status: '已完成', error: '' },
      { id: 'SUB-102', sku: 'SKU-FAC-202', status: '已完成', error: '' },
      { id: 'SUB-103', sku: 'SKU-FAC-203', status: '已完成', error: '' }
    ]
  },
  {
    id: 'T-003',
    name: '水光唇蜜短视频自动化卡点与字幕批量渲染',
    time: '2026-05-20 11:00',
    total: 20,
    success: 6,
    pending: 14,
    failed: 0,
    priority: '高',
    status: '生成中',
    threads: 4,
    snapshot: { style: '夏日冰爽', size: '9:16 竖屏', res: '超清 2K', subtitle: '大促爆发红', bgm: '轻奢电子', sticker: '爆款首发' },
    subtasks: [
      { id: 'SUB-201', sku: 'SKU-LIP-301', status: '已完成', error: '' },
      { id: 'SUB-202', sku: 'SKU-LIP-302', status: '进行中', error: '' },
      { id: 'SUB-203', sku: 'SKU-LIP-303', status: '排队中', error: '' }
    ]
  }
];

const BatchTasks = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [diagnosticTask, setDiagnosticTask] = useState<any>(null);

  // New task form state
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('high');
  const [concurrency, setConcurrency] = useState('5');
  const [inheritParams, setInheritParams] = useState(true);
  const [skuList, setSkuList] = useState('');

  // 展开折叠详细子任务列表
  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(prev => [...prev, id]);
    } else {
      setSelectedTaskIds(prev => prev.filter(taskId => taskId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(tasks.map(t => t.id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  // 批量重试/恢复
  const handleBatchRetry = () => {
    if (selectedTaskIds.length === 0) {
      showError("请先在列表中勾选要操作的任务");
      return;
    }
    showSuccess(`已成功为任务 ${selectedTaskIds.join(', ')} 触发批量异常修复重试，优先级别重设为高。`);
    setTasks(prev => prev.map(t => {
      if (selectedTaskIds.includes(t.id)) {
        return { ...t, status: '生成中', failed: 0, pending: t.total - t.success };
      }
      return t;
    }));
  };

  // 批量终止/暂停
  const handleBatchAbort = () => {
    if (selectedTaskIds.length === 0) {
      showError("请先在列表中勾选要操作的任务");
      return;
    }
    showSuccess(`已强制终止任务 ${selectedTaskIds.join(', ')} 的并发算力调度。`);
    setTasks(prev => prev.map(t => {
      if (selectedTaskIds.includes(t.id) && t.status === '生成中') {
        return { ...t, status: '部分失败' };
      }
      return t;
    }));
  };

  // 批量一键上架
  const handleBatchPublish = () => {
    if (selectedTaskIds.length === 0) {
      showError("请先在列表中选择已完成的任务上架");
      return;
    }
    showSuccess(`任务 ${selectedTaskIds.join(', ')} 对应的成品已批量发布同步至对应电商商品主图槽位！`);
  };

  // 一键清空无效任务 (状态为 失败或部分失败 的任务)
  const handleClearInvalid = () => {
    setTasks(prev => prev.filter(t => t.status !== '部分失败' && t.status !== '已失败'));
    setSelectedTaskIds([]);
    showSuccess("已清空列表中所有出现失败的无效任务。");
  };

  // 批量版本回溯
  const handleVersionRollback = () => {
    if (selectedTaskIds.length === 0) {
      showError("请先选择任务进行版本回溯");
      return;
    }
    showSuccess(`参数快照已回滚！已将任务 ${selectedTaskIds.join(', ')} 还原到上一个历史版本。`);
  };

  // 新建任务提交
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      showError("请输入批量任务方案名称");
      return;
    }
    const skus = skuList.split(',').map(s => s.trim()).filter(Boolean);
    const totalCount = skus.length || 20;

    const newTask = {
      id: `T-00${tasks.length + 1}`,
      name: taskName,
      time: new Date().toLocaleString(),
      total: totalCount,
      success: 0,
      pending: totalCount,
      failed: 0,
      priority: priority === 'high' ? '高' : '中',
      status: '待运行',
      threads: parseInt(concurrency),
      snapshot: inheritParams 
        ? { style: '温暖珊瑚', size: '1:1 正方形', res: '超清 2K', subtitle: '经典简约白', bgm: '热烈夏日', sticker: '限时秒杀' }
        : { style: '默认冷色', size: '自适应', res: '标准', subtitle: '无', bgm: '无', sticker: '无' },
      subtasks: skus.map((sku, index) => ({
        id: `SUB-${100 + index}`,
        sku: sku,
        status: '排队中',
        error: ''
      }))
    };

    setTasks(prev => [newTask, ...prev]);
    setIsNewTaskOpen(false);
    showSuccess(`批量任务「${taskName}」创建成功！开启限流队列并发运行。`);
    setTaskName('');
    setSkuList('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left">
        
        {/* Header Toolbar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">批量生产任务中心</h1>
            <p className="text-xs text-slate-500">支持高并发多SKU并行流转，统一继承全局视觉风格，避免电商大促上新产生风格畸变与网络堵塞。</p>
          </div>
          <Button 
            onClick={() => setIsNewTaskOpen(true)}
            className="bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            新建批量生成任务
          </Button>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex-wrap items-center justify-between">
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600 border-slate-200" onClick={handleBatchRetry}>
              <Play className="w-3.5 h-3.5 mr-1" /> 批量重试/恢复
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600 border-slate-200" onClick={handleBatchAbort}>
              <Ban className="w-3.5 h-3.5 mr-1 text-red-500" /> 批量终止
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600 border-slate-200" onClick={handleBatchPublish}>
              <Send className="w-3.5 h-3.5 mr-1 text-emerald-500" /> 批量一键上架
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600 border-slate-200" onClick={handleVersionRollback}>
              <History className="w-3.5 h-3.5 mr-1 text-blue-500" /> 批量版本回溯
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50/50" onClick={handleClearInvalid}>
              <Trash2 className="w-3.5 h-3.5 mr-1" /> 清空无效任务
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500 hover:bg-slate-50" onClick={() => showSuccess("批量任务报表导出成功！")}>
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> 导出详情
            </Button>
          </div>
        </div>

        {/* Tasks List Table */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800">
              当前进行中与历史调度任务队列 ({tasks.length} 项)
            </CardTitle>
            <Badge variant="outline" className="text-[10px] border-emerald-200 bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-3 h-3 mr-1" /> 算力限流保护已启用
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="w-[45px] text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300"
                      checked={selectedTaskIds.length === tasks.length && tasks.length > 0} 
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableHead>
                  <TableHead className="w-[60px] text-center font-bold">展开</TableHead>
                  <TableHead className="w-[100px]">任务ID</TableHead>
                  <TableHead className="min-w-[220px]">任务方案名称</TableHead>
                  <TableHead className="w-[120px]">并发限制</TableHead>
                  <TableHead className="w-[100px]">优先级</TableHead>
                  <TableHead className="w-[150px]">创建时间</TableHead>
                  <TableHead className="w-[200px]">执行进度与细分统计</TableHead>
                  <TableHead className="w-[100px] text-center">状态</TableHead>
                  <TableHead className="text-right w-[140px]">运行诊断</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const isExpanded = expandedRows.includes(task.id);
                  const isChecked = selectedTaskIds.includes(task.id);
                  const pct = Math.round(((task.success + task.failed) / task.total) * 100);
                  
                  return (
                    <React.Fragment key={task.id}>
                      <TableRow className={cn(
                        "hover:bg-slate-50/50 text-xs transition-colors",
                        isChecked && "bg-rose-50/20",
                        isExpanded && "bg-slate-50/50"
                      )}>
                        <TableCell className="text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300"
                            checked={isChecked}
                            onChange={(e) => handleSelectItem(task.id, e.target.checked)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <button 
                            onClick={() => toggleRow(task.id)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-500 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </TableCell>
                        <TableCell className="font-mono font-bold text-slate-500">{task.id}</TableCell>
                        <TableCell>
                          <div className="font-bold text-slate-800">{task.name}</div>
                        </TableCell>
                        <TableCell className="font-mono text-slate-500">{task.threads} 线程并行限流</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "text-[9px] font-bold px-1.5 py-0",
                            task.priority === '高' ? "border-rose-200 text-rose-600 bg-rose-50/30" : "border-slate-200 text-slate-500"
                          )}>
                            {task.priority}优先级
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 font-mono">{task.time}</TableCell>
                        <TableCell className="space-y-1">
                          <Progress value={pct} className="h-1 bg-slate-100" />
                          <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold">
                            <span className="text-green-600 font-bold">✓ {task.success}</span>
                            <span className="text-amber-600">⌛ {task.pending}</span>
                            {task.failed > 0 && <span className="text-red-500 font-bold">✗ {task.failed}</span>}
                            <span>{pct}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(
                            "text-[10px] font-bold border-none",
                            task.status === '已完成' && "bg-green-100 text-green-700",
                            task.status === '生成中' && "bg-blue-100 text-blue-700",
                            task.status === '部分失败' && "bg-amber-100 text-amber-700",
                            task.status === '待运行' && "bg-slate-100 text-slate-600"
                          )}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            onClick={() => setDiagnosticTask(task)}
                            size="sm" 
                            variant="ghost" 
                            className="text-xs text-rose-500 font-bold hover:bg-rose-50"
                          >
                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                            故障诊断
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded row: details parameter snapshots + sub-task logs */}
                      {isExpanded && (
                        <TableRow className="bg-slate-50/30">
                          <TableCell colSpan={10} className="p-5">
                            <div className="pl-14 space-y-4">
                              {/* Inherited Parameters Snapshot */}
                              <div className="bg-white p-3 rounded-lg border border-slate-100 space-y-2">
                                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                                  <Sliders className="w-3.5 h-3.5 text-rose-400" />
                                  <span>全局统一继承参数快照（保障风格排版色调高度统一）</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-[10px]">
                                  <div className="p-2 bg-slate-50 rounded">
                                    <span className="text-slate-400 block mb-0.5">预设色调风格</span>
                                    <span className="font-bold text-slate-700">{task.snapshot.style}</span>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded">
                                    <span className="text-slate-400 block mb-0.5">输出画幅尺寸</span>
                                    <span className="font-bold text-slate-700">{task.snapshot.size}</span>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded">
                                    <span className="text-slate-400 block mb-0.5">画面质量等级</span>
                                    <span className="font-bold text-slate-700">{task.snapshot.res}</span>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded">
                                    <span className="text-slate-400 block mb-0.5">商用字幕模板</span>
                                    <span className="font-bold text-slate-700">{task.snapshot.subtitle}</span>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded">
                                    <span className="text-slate-400 block mb-0.5">背景音频配乐</span>
                                    <span className="font-bold text-slate-700">{task.snapshot.bgm}</span>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded">
                                    <span className="text-slate-400 block mb-0.5">活动动态角标</span>
                                    <span className="font-bold text-slate-700">{task.snapshot.sticker}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Detailed sub-task status logs */}
                              <div className="bg-white p-3 rounded-lg border border-slate-100 space-y-2">
                                <div className="text-slate-700 font-bold text-xs">子任务异常捕获与调度日志</div>
                                <div className="divide-y divide-slate-100">
                                  {task.subtasks.map((sub, sIdx) => (
                                    <div key={sIdx} className="py-2.5 flex justify-between items-center text-[11px]">
                                      <div className="flex items-center gap-3">
                                        <span className="font-mono text-slate-400">{sub.id}</span>
                                        <span className="font-bold text-slate-700">{sub.sku}</span>
                                        {sub.error && (
                                          <span className="text-red-500 font-medium">{sub.error}</span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Badge className={cn(
                                          "text-[9px] px-1.5 py-0 border-none font-bold",
                                          sub.status === '已完成' && "bg-green-50 text-green-700",
                                          sub.status === '进行中' && "bg-blue-50 text-blue-700",
                                          sub.status === '排队中' && "bg-slate-100 text-slate-500",
                                          sub.status === '合规拦截' && "bg-amber-50 text-amber-700",
                                          sub.status === '素材缺失' && "bg-red-50 text-red-700",
                                          sub.status === '渲染超时' && "bg-red-50 text-red-700"
                                        )}>
                                          {sub.status}
                                        </Badge>
                                        {sub.error && (
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 text-[9px] text-rose-500 p-1 hover:bg-rose-50"
                                            onClick={() => showSuccess(`已为子项 ${sub.sku} 重新加入生成队列。`)}
                                          >
                                            单条重试
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialog: Create New Batch Task */}
      <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateTask}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-rose-600">
                <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
                新建 AIGC 批量智能任务
              </DialogTitle>
              <DialogDescription className="text-left text-xs">
                配置并发线程规格与风格渲染规则，开始对多SKU进行平稳并发调度。
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4 text-xs text-left">
              <div className="space-y-1.5">
                <Label className="text-slate-500 font-semibold">任务名称</Label>
                <Input 
                  placeholder="例：2026年618大促多肽系列详情页主图批量AI融合"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">任务优先级 (自动排队)</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">高优先级 (算力双倍加速)</SelectItem>
                      <SelectItem value="normal">中普通队列运行</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">限流并发限制 (避堵)</Label>
                  <Select value={concurrency} onValueChange={setConcurrency}>
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 线程并行</SelectItem>
                      <SelectItem value="5">5 线程并行 (推荐)</SelectItem>
                      <SelectItem value="8">8 线程并行 (高负荷)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-700 block">自动继承用户预设参数</span>
                  <span className="text-[10px] text-slate-400">全局继承上一次设定的尺寸、画质、音乐等，保证风格高度统一</span>
                </div>
                <Switch 
                  checked={inheritParams} 
                  onCheckedChange={setInheritParams} 
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-500 font-semibold">导入 SKU 编号 (以逗号隔开)</Label>
                <textarea 
                  value={skuList}
                  onChange={(e) => setSkuList(e.target.value)}
                  placeholder="SKU-SUN-101, SKU-SUN-102, SKU-SUN-103..."
                  className="w-full text-xs text-slate-600 bg-slate-50/50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-300 h-20 resize-none" 
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsNewTaskOpen(false)} className="text-xs">
                取消
              </Button>
              <Button type="submit" className="bg-rose-400 hover:bg-rose-500 text-white text-xs">
                提交并排队
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Failure Detail Diagnostic Modal */}
      <Dialog open={!!diagnosticTask} onOpenChange={() => setDiagnosticTask(null)}>
        <DialogContent className="max-w-md">
          {diagnosticTask && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-rose-600">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  批量任务智能故障诊断与排查
                </DialogTitle>
                <DialogDescription className="text-left text-xs">
                  任务ID：{diagnosticTask.id} | 精准定位发生异常的 SKU 子任务节点。
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2 text-xs text-left">
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl space-y-2">
                  <span className="font-bold block text-xs">捕捉到的拦截与异常：</span>
                  <div className="space-y-1.5 font-mono text-[10px] bg-white/70 p-2.5 rounded border border-red-200 leading-normal">
                    {diagnosticTask.subtasks.filter((s: any) => s.error).map((s: any, idx: number) => (
                      <div key={idx} className="truncate">
                        • {s.sku}: {s.error}
                      </div>
                    )) || "无异常记录。"}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5">
                  <span className="font-bold text-slate-700 block">AI 推荐修复机制：</span>
                  <span className="text-slate-500 leading-relaxed block">
                    针对广告法极限词拦截的 SKU，系统推荐使用“AI合规质检替换”后一键重试。针对网络超时的 SKU，将自动分配备用空闲算力节点重跑。
                  </span>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="ghost" onClick={() => setDiagnosticTask(null)} className="text-xs">
                  取消
                </Button>
                <Button 
                  onClick={() => {
                    showSuccess("AI 智能纠错完毕，已成功对失败的子项重新发起渲染重试！");
                    setDiagnosticTask(null);
                  }} 
                  className="bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  一键AI纠正并重试
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BatchTasks;