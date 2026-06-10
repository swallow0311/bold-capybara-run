import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ImageIcon, VideoIcon, Download } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const AssetLibrary = () => {
  const assets = [
    { id: 1, name: 'XX酵母面霜_专业测评版', type: 'text', date: '2026-06-10 09:12', score: 95, product: 'XX御龄紧致面霜' },
    { id: 2, name: '夏日防晒海报_金箔高奢', type: 'image', date: '2026-06-10 10:45', score: 91, product: '清爽控油防晒喷雾' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {assets.map(item => (
            <Card key={item.id} className="border-none shadow-sm overflow-hidden bg-white">
              <div className="h-44 bg-rose-50/40 p-4 border-b border-slate-100 flex flex-col justify-center items-center">
                {item.type === 'text' ? <FileText className="w-10 h-10 text-rose-400" /> : <ImageIcon className="w-10 h-10 text-rose-400" />}
              </div>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{item.date}</p>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-500">{item.product}</span>
                  <Badge className="bg-amber-100 text-amber-800 border-none font-bold text-[9px]">得分 {item.score}</Badge>
                </div>
                <Button variant="ghost" size="sm" className="w-full text-rose-500 h-8" onClick={() => showSuccess("下载中...")}>
                  <Download className="w-3.5 h-3.5 mr-1" /> 下载素材
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssetLibrary;