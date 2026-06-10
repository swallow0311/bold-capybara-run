import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Mic } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const INITIAL_PRODUCTS = [
  { 
    id: 1, 
    img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=150',
    name: 'XX酵母御龄紧致面霜', 
    shop: 'XX美妆官方旗舰店',
    category: '面霜',
    price: 299, 
    sales: 123400, 
    salesTrend: '+45%',
    roi: '4.2',
    commission: '25%',
    type: 'recommend'
  }
];

const SelectionEngine = () => {
  const [searchKey, setSearchKey] = useState('');

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left">
        <Card className="border-none shadow-sm bg-gradient-to-r from-rose-50/40 via-white to-rose-50/20">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-lg">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>AI 选品助理</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">更新时间：今天 08:30 (每半小时智能同步)</span>
            </div>
            <div className="relative flex items-center bg-white border border-rose-200 rounded-2xl p-1 shadow-sm">
              <Search className="w-5 h-5 text-slate-400 ml-4 mr-2" />
              <input 
                type="text" 
                placeholder="探索美妆新商机..."
                className="flex-1 bg-transparent border-none outline-none text-sm py-3"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <Button onClick={() => showSuccess("搜索中...")} className="bg-rose-400 hover:bg-rose-500 text-white rounded-xl px-6">智能检索</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">爆款推荐榜 (数据更新至 6月10日)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead>商品信息</TableHead>
                  <TableHead className="text-right">价格</TableHead>
                  <TableHead className="text-right">销量</TableHead>
                  <TableHead className="text-right">周增速</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INITIAL_PRODUCTS.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={p.img} className="w-10 h-10 rounded object-cover" alt="" />
                        <div>
                          <p className="font-bold text-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.shop}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">¥{p.price}</TableCell>
                    <TableCell className="text-right">{(p.sales / 10000).toFixed(1)}万</TableCell>
                    <TableCell className="text-right text-green-600 font-bold">{p.salesTrend}</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-amber-100 text-amber-800 border-none text-[10px]">ROI {p.roi}</Badge>
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

export default SelectionEngine;