import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

const SelectionEngine = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const products = [
    { id: 1, name: '玻色因紧致面霜', sales: '12.5w+', trend: '+15%', price: '¥399', tags: ['抗老', '修护'], platform: '小红书' },
    { id: 2, name: '清爽控油防晒喷雾', sales: '8.2w+', trend: '+45%', price: '¥89', tags: ['防晒', '平价'], platform: '抖音' },
    { id: 3, name: '积雪草舒缓精华液', sales: '5.1w+', trend: '-2%', price: '¥158', tags: ['敏感肌', '舒缓'], platform: '抖音' },
    { id: 4, name: '哑光丝绒唇釉 #05', sales: '20w+', trend: '+8%', price: '¥69', tags: ['彩妆', '爆款'], platform: '小红书' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-6">
        {/* Filter Area */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex flex-wrap items-center gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="平台选择" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部平台</SelectItem>
                <SelectItem value="dy">抖音</SelectItem>
                <SelectItem value="xhs">小红书</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="skincare">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="美妆品类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skincare">护肤</SelectItem>
                <SelectItem value="makeup">彩妆</SelectItem>
                <SelectItem value="tool">美妆工具</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input className="pl-9" placeholder="搜索关键词或商品ID..." />
            </div>

            <Button className="bg-rose-400 hover:bg-rose-500 text-white">开始爬取分析</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* List Area */}
          <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">爆款数据榜单</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[60px]">排名</TableHead>
                    <TableHead>商品名称</TableHead>
                    <TableHead>销量</TableHead>
                    <TableHead>热度趋势</TableHead>
                    <TableHead>均价</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p, i) => (
                    <TableRow 
                      key={p.id} 
                      className={cn("cursor-pointer", selectedItem?.id === p.id && "bg-rose-50/50")}
                      onClick={() => setSelectedItem(p)}
                    >
                      <TableCell className="font-medium text-slate-400">0{i+1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{p.name}</div>
                        <div className="flex gap-1 mt-1">
                          {p.tags.map(t => <Badge key={t} variant="secondary" className="text-[10px] px-1 py-0">{t}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell>{p.sales}</TableCell>
                      <TableCell className={p.trend.startsWith('+') ? "text-green-600" : "text-red-600"}>
                        {p.trend}
                      </TableCell>
                      <TableCell>{p.price}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600">详情</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* AI Analysis Area */}
          <Card className="border-none shadow-sm flex flex-col">
            <CardHeader className="border-b border-slate-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-400" />
                  AI 研判报告
                </CardTitle>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Download className="w-4 h-4 text-slate-600" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 overflow-auto">
              {selectedItem ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">新品立项可行性</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="text-3xl font-bold text-rose-500">高</div>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-400 w-[85%]"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">建议定价</p>
                      <p className="text-lg font-bold mt-1">¥128 - ¥168</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">市场竞争度</p>
                      <p className="text-lg font-bold mt-1 text-orange-500">中等偏高</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      主流成分趋势
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['烟酰胺', '视黄醇', '透明质酸', '神经酰胺'].map(c => (
                        <span key={c} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="text-xs font-bold text-amber-800 flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-3 h-3" />
                      风险提示
                    </p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      该品类目前在抖音平台流量见顶，建议从小红书切入“早C晚A”细分场景进行差异化竞争。
                    </p>
                  </div>

                  <Button className="w-full bg-rose-400 hover:bg-rose-500 text-white">导出完整分析报告</Button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Search className="w-12 h-12 opacity-20" />
                  <p className="text-sm">请在左侧选择单品查看AI analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SelectionEngine;