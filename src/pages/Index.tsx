import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

// 导入各业务板块组件
import ProductSection from '@/components/dashboard/ProductSection';
import SelectionSection from '@/components/dashboard/SelectionSection';
import AigcSection from '@/components/dashboard/AigcSection';
import NlpSection from '@/components/dashboard/NlpSection';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
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