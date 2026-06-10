import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, Search, Filter, Download, 
  Clock, CheckCircle2, ArrowRight, History,
  ShieldAlert, ShoppingBag, Zap, MessageSquare,
  MoreHorizontal, Eye, Archive
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
  const [records, setProducts] = useState(MOCK_RECORDS);
  const [statusFilter, setStatusFilter] = useState('all');

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

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-800 text-xs text-left animate-in fade-in duration-500">
        
        {/* 顶部统计与操作 */}
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
              <Input placeholder="搜索预警标题、ID 或负责人..." className="pl-9 text-xs h-9 bg-slate-50/50 border-slate-200" />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[120px] h-9 text-xs bg-slate-50">
                <SelectValue placeholder="预警类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="stock">库存预警</SelectItem>
                <SelectItem value="price">价格预警</SelectItem>
                <SelectItem value="compliance">合规预警</SelectItem>
                <SelectItem value="nlp">NLP 预警</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] h-9 text-xs bg-slate-50">
                <SelectValue placeholder="处理状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="processing">处理中</SelectItem>
                <SelectItem value="done">已处理</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="sm" className="h-9 text-xs text-slate-500">重置</Button>
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
                  <TableHead className="text-xs">负责人</TableHead>
                  <TableHead className="text-xs text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map(record => (
                  <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors group">
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
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500 hover:bg-rose-50" onClick={() => showSuccess("正在打开预警详情面板...")}>
                          <Eye className="w-3 h-3 mr-1" /> 详情
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-500 hover:bg-slate-100" onClick={() => showSuccess("已将该预警归档至历史库")}>
                          <Archive className="w-3 h-3 mr-1" /> 归档
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
      </div>
    </DashboardLayout>
  );
};

export default AlertRecords;