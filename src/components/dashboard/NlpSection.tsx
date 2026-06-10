import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star, AlertCircle } from 'lucide-react';

const NlpSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-6 bg-emerald-400 rounded-full" />
        <h2 className="text-lg font-bold text-slate-800">评价 NLP 深度洞察 (数据更新至 6月10日)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '综合满意度', value: '4.6 星', icon: Star, color: 'text-amber-400' },
          { label: '正向评价比例', value: '89%', icon: MessageSquare, color: 'text-emerald-500' },
          { label: '负面激增预警', value: '3 款', icon: AlertCircle, color: 'text-rose-500' },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-5 text-left">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
                <item.icon className={item.color} />
              </div>
              <p className="text-xl font-black text-slate-800">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NlpSection;