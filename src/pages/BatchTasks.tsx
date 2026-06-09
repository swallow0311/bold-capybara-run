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
import { 
  Play, Pause, Trash2, FolderArchive, Download, 
  Layers, PlusCircle, AlertCircle, RefreshCw, CheckCircle2,
  FileSpreadsheet, Sparkles
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

const INITIAL_TASKS = [
  {
    id: 'T-001',
    name: '夏季防晒霜主图批量AI替换',
    time: '2026-05-20 09:30',
    total: 50,
    success: 48,
    pending: 0,
    failed: 2,
    priority: '高',
    status: '部分失败',
    errorDesc: 'SKU_IMG_MISSING: 主图3和主图4清晰度过低，未通过模型最低像素阈值。'
  },
  {
    id: 'T-002',
    name: '小红书多肽紧致面霜文案批量生成',
    time: '2026-05-20 10:15',
    total: 30,
    success: 30,
    pending: 0,
    failed: 0,
    priority: '中',
    status: '已完成',
    errorDesc: ''
  },
  {
    id: 'T-003',
    name: '新品唇蜜短视频脚本自动化卡点视频',
    time: '2026-05-20 11:00',
    total: 20,
    success: 5,
    pending: 15,
    failed: 0,
    priority: '高',
    status: '生成中',
    errorDesc: ''
  }
];

const BatchTasks = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // New task form state
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('high');
  const [skuList, setSkuList] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      showError("请输入任务方案名称");
      return;
    }
    const newTask = {
      id: `T-00${tasks.length + 1}`,
      name: taskName,
      time: new Date().toLocaleString(),
      total: 40,
      success: 0,
      pending: 40,
      failed: 0,
      priority: priority === 'high' ? '高' : '中',
      status: '待运行',
      errorDesc: ''
    };
    setTasks(prev => [newTask, ...prev]);
    setIsNewTaskOpen(false);
    showSuccess(`批量任务「${taskName}」创建并同步至任务流中！`);
    setTaskName('');
    setSkuList('');
  };

  const handleFixError = (taskId: string) => {
    showSuccess(`已为您对任务 ${taskId} 启动AI画质智能增强插值修复，即将重新运行生成。`);
    setSelectedTask(null);
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: '生成中', failed: 0, pending: 2 };
      }
      return t;
    }));
  };

  const triggerExport = () => {
    showSuccess("批量任务执行明细日志已导出至 CSV/Excel。");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left">
        
        {/* Header Toolbar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">批量生产任务中心</h1>
            <p className="text-xs text-slate-500">大促批量新品上新与大批量营销素材自动造，规模化并行调度队列管理。</p>
          </div>
          <Button 
            onClick={() => setIsNewTaskOpen(true)}
            className="bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            新建批量任务
          </Button>
        </div>

        {/* Global actions bar */}
        <div className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex-wrap items-center">
          <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600 border-slate-200" onClick={() => showSuccess("已继续队列中所有等待的任务")}>
            <Play className="w-3.5 h-3.5 mr-1" /> 批量重试/恢复
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600 border-slate-200" onClick={() => showSuccess("所有排队中的任务已暂停调度")}>
            <Pause className="w-3.5 h-3.5 mr-1" /> 批量暂停
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600 border-slate-200" onClick={triggerExport}>
            <Download className="w-3.5 h-3.5 mr-1" /> 批量导出
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50/50" onClick={() => showSuccess("已清空已归档历史任务")}>
            <Trash2 className="w-3.5 h-3.5 mr-1" /> 批量删除
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500 hover:bg-slate-50" onClick={() => showSuccess("所有已完成任务归档存储")}>
            <FolderArchive className="w-3.5 h-3.5 mr-1" /> 任务自动归档
          </Button>
        </div>

        {/* Tasks List */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">
              当前进行中与历史调度任务队列 ({tasks.length} 项)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="w-[100px]">任务ID</TableHead>
                  <TableHead className="min-w-[260px]">任务名称</TableHead>
                  <TableHead className="w-[150px]">优先级</TableHead>
                  <TableHead className="w-[160px]">创建时间</TableHead>
                  <TableHead className="text-center w-[120px]">总数量</TableHead>
                  <TableHead className="w-[220px]">运行进度与细分统计</TableHead>
                  <TableHead className="w-[120px]">状态</TableHead>
                  <TableHead className="text-right w-[140px]">运行操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const pct = Math.round(((task.success + task.failed) / task.total) * 100);
                  return (
                    <TableRow key={task.id} className="hover:bg-slate-50/50 text-xs">
                      <TableCell className="font-mono font-bold text-slate-500">{task.id}</TableCell>
                      <TableCell>
                        <div className="font-bold text-slate-800">{task.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-bold px-1.5 py-0",
                          task.priority === '高' ? "border-rose-200 text-rose-600 bg-rose-50/30" : "border-slate-200 text-slate-500"
                        )}>
                          {task.priority}优先级
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 font-mono">{task.time}</TableCell>
                      <TableCell className="text-center font-bold text-slate-700">{task.total} SKU</TableCell>
                      <TableCell className="space-y-1">
                        <Progress value={pct} className="h-1 bg-slate-100" />
                        <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold">
                          <span className="text-green-600 font-bold">✓ {task.success}</span>
                          <span className="text-amber-600">⌛ {task.pending}</span>
                          {task.failed > 0 && <span className="text-red-500 font-bold">✗ {task.failed}</span>}
                          <span>{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
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
                        {task.failed > 0 ? (
                          <Button 
                            onClick={() => setSelectedTask(task)}
                            size="sm" 
                            variant="ghost" 
                            className="text-xs text-rose-500 font-bold hover:bg-rose-50"
                          >
                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                            错误诊断
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-slate-500 hover:text-rose-500"
                            onClick={() => showSuccess(`正在调起查看明细日志...`)}
                          >
                            查看详情
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
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
                <Sparkles className="w-5 h-5 text-rose-500" />
                新建 AIGC 批量智能任务
              </DialogTitle>
              <DialogDescription className="text-left text-xs">
                配置规格与生成规则，调度大模型引擎进行多线程高并发渲染。
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
                  <Label className="text-slate-500 font-semibold">任务类型</Label>
                  <Select defaultValue="image">
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">AI图片设计批量替换</SelectItem>
                      <SelectItem value="text">文案批量创作优化</SelectItem>
                      <SelectItem value="video">短视频卡点一键生成</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">任务优先级</Label>
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
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-500 font-semibold">导入SKU编号（以逗号/回车隔开）</Label>
                <textarea 
                  value={skuList}
                  onChange={(e) => setSkuList(e.target.value)}
                  placeholder="SKU-LIP-001, SKU-SUN-009, SKU-FAC-012..."
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
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-md">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-rose-600">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  批量任务失败诊断报告
                </DialogTitle>
                <DialogDescription className="text-left text-xs">
                  任务编号：{selectedTask.id} | 检测到 {selectedTask.failed} 个 SKU 异常中止。
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2 text-xs text-left">
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl space-y-1.5">
                  <span className="font-bold block">失败错误代码：</span>
                  <span className="font-mono block bg-white/70 p-2 rounded border border-red-200 leading-normal">
                    {selectedTask.errorDesc || "ERROR_RESOLVING: 模型网络请求超时，请检查服务后重试。"}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
                  <span className="font-bold text-slate-700 block">AI 推荐修复机制：</span>
                  <span className="text-slate-500 leading-relaxed block">
                    检测到因部分原图像素偏低触发红线。建议开启大模型“超分重建”增强，自动提升分辨率至2K再重新录入。
                  </span>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="ghost" onClick={() => setSelectedTask(null)} className="text-xs">
                  取消
                </Button>
                <Button 
                  onClick={() => handleFixError(selectedTask.id)} 
                  className="bg-rose-400 hover:bg-rose-500 text-white text-xs"
                >
                  一键AI超分重建并重试
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