import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Database, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";

const DataCenter = () => {
  const assets = [
    { id: 'SKU-LIP-001', name: 'XX凝润修护水光唇蜜', type: '素材包', stock: '12件', threshold: '50件', status: '低库存报警' },
    { id: 'SKU-SUN-009', name: 'XX水漾隔离防晒乳', type: '视频素材', stock: '45件', threshold: '100件', status: '备货充足' },
    { id: 'SKU-FAC-012', name: 'XX酵母御龄紧致面霜', type: '口播文案', stock: '8件', threshold: '30件', status: '低库存报警' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header toolbar */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">数据中心素材库</h1>
            <p className="text-sm text-slate-500">快速检索企业核心商品素材与多渠道运营数据指标</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> 导出素材</Button>
            <Button size="sm" className="bg-rose-400 hover:bg-rose-500 text-white"><Plus className="w-4 h-4 mr-2" /> 录入新品档案</Button>
          </div>
        </div>

        {/* Filter bar */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input className="pl-9 bg-slate-50/50" placeholder="按编码、新品关键词搜索..." />
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800">筛选</Button>
          </CardContent>
        </Card>

        {/* Channels and warnings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Channel performance */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Database className="w-4 h-4 text-rose-400" />
                多渠道获客效果对比
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: '抖音带货小黄车', value: '¥101,230', pct: 68 },
                  { name: '千川引流大出价', value: '¥67,310', pct: 45 },
                  { name: '小红书置换KOL/KOF', value: '¥48,220', pct: 32 },
                  { name: '天猫淘宝直通车', value: '¥35,900', pct: 24 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{item.name}</span>
                      <span>{item.value} ({item.pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low stock warning */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-amber-600">低库存/素材临界告警</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assets.filter(a => a.status === '低库存报警').map((item, idx) => (
                <div key={idx} className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    <Badge variant="destructive" className="text-[9px] px-1 py-0.5">补货临界</Badge>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>当前库存：{item.stock}</span>
                    <span>阈值：{item.threshold}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs py-1 h-7 border-amber-200 text-amber-700 hover:bg-amber-100">补货下单</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Table representation */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">全量资产与素材列表</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>素材编码</TableHead>
                  <TableHead>商品名称</TableHead>
                  <TableHead>素材类别</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === '低库存报警' ? 'destructive' : 'secondary'} className="text-[10px]">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-500">更新素材</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DataCenter;