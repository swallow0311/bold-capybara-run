import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar } from 'lucide-react';

// 导入各业务板块组件
import ProductSection from '@/components/dashboard/ProductSection';
import SelectionSection from '@/components/dashboard/SelectionSection';
import AigcSection from '@/components/dashboard/AigcSection';
import NlpSection from '@/components/dashboard/NlpSection';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        
        {/* 顶部欢迎与全局状态 */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              智能运营中台核心看板
            </h1>
            <p className="text-slate-500 mt-1 text-xs flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              数据更新至：2026年5月20日 09:30 (实时同步中)
            </p>
          </div>
          <div className="flex gap-3">
            <Badge className="bg-rose-100 hover:bg-rose-100 text-rose-700 font-bold border-none text-[11px] px-3 py-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> 
              AI 决策引擎已就绪
            </Badge>
            <Badge variant="outline" className="text-slate-400 border-slate-200 text-[11px] px-3 py-1">
              算力剩余: 78%
            </Badge>
          </div>
        </div>

        {/* 1. 商品管理板块 */}
        <section id="product-management" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProductSection />
        </section>

        <div className="h-[1px] bg-slate-200 w-full" />

        {/* 2. AI 选品板块 */}
        <section id="ai-selection" className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <SelectionSection />
        </section>

        <div className="h-[1px] bg-slate-200 w-full" />

        {/* 3. AIGC 内容工厂板块 */}
        <section id="aigc-factory" className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <AigcSection />
        </section>

        <div className="h-[1px] bg-slate-200 w-full" />

        {/* 4. 评价 NLP 分析板块 */}
        <section id="sentiment-nlp" className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
          <NlpSection />
        </section>

      </div>
    </DashboardLayout>
  );
};

export default Index;