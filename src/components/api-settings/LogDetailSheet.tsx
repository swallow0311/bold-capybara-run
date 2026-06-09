import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileSpreadsheet, Download, Search, Calendar, User } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface LogDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MOCK_LOGS = [
  { id: 1, time: '2026-05-20 14:30:05', api: '淘宝评价拉取', status: 'SUCCESS', traffic: '1.2MB', operator: '张三', params: '{"spu_id": "99001"}' },
  { id: 2, time: '2026-05-20 14:25:12', api: '京东价格监控', status: 'TIMEOUT', traffic: '0.1MB', operator: '系统自动', params: '{"sku_id": "88120"}' },
  { id: 3, time: '2026-05-20 14:10:45', api: '抖音流量统计', status: 'SUCCESS', traffic: '4.5MB', operator: '李四', params: '{"room_id": "live_01"}' },
  { id: 4, time: '2026-05-20 13:55:20', api: '淘宝评价拉取', status: 'AUTH_FAIL', traffic: '0.05MB', operator: '张三', params: '{"spu_id": "99001"}' },
  { id: 5, time: '2026-05-20 13:40:10', api: '市场大盘指数', status: 'SUCCESS', traffic: '0.8MB', operator: '系统自动', params: '{"cat_id": "cream"}' },
];

const LogDetailSheet = ({ open, onOpenChange }: LogDetailSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-rose-500" />
              <SheetTitle>接口调用全量日志</SheetTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs border-slate-200"
              onClick={() => showSuccess("正在导出近 7 天调用日志明细...")}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> 导出日志
            </Button>
          </div>
          <SheetDescription>记录接口调用的详细入参、返回状态及流量消耗，用于异常排查与安全审计。</SheetDescription>
        </SheetHeader>

        <div className="p-4 bg-slate-50 border-b border-slate-100 flex gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input placeholder="搜索操作人或接口名..." className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none" />
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs bg-white"><Calendar className="w-3.5 h-3.5 mr-1.5" /> 时间范围</Button>
        </div>

        <ScrollArea className="flex-1">
          <Table>
            <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="text-[11px]">调用时间</TableHead>
                <TableHead className="text-[11px]">接口名称</TableHead>
                <TableHead className="text-[11px] text-center">状态</TableHead>
                <TableHead className="text-[11px] text-right">流量</TableHead>
                <TableHead className="text-[11px]">操作人</TableHead>
                <TableHead className="text-[11px] text-right">详情</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_LOGS.map(log => (
                <TableRow key={log.id} className="hover:bg-slate-50/50 text-[11px]">
                  <TableCell className="font-mono text-slate-400">{log.time}</TableCell>
                  <TableCell className="font-bold text-slate-700">{log.api}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "border-none text-[9px] font-bold",
                      log.status === 'SUCCESS' && 'bg-emerald-100 text-emerald-700',
                      log.status === 'TIMEOUT' && 'bg-amber-100 text-amber-700',
                      log.status === 'AUTH_FAIL' && 'bg-rose-100 text-rose-700',
                    )}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-500">{log.traffic}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-300" />
                      <span>{log.operator}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="text-rose-500 hover:underline font-bold" onClick={() => showSuccess(`入参明细：${log.params}`)}>查看</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default LogDetailSheet;