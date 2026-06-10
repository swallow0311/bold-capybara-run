import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Tag } from 'lucide-react';

interface ProductInputSectionProps {
  data: any;
  setData: (data: any) => void;
}

const ProductInputSection = ({ data, setData }: ProductInputSectionProps) => {
  const addSellingPoint = () => {
    setData({ ...data, sellingPoints: [...data.sellingPoints, ''] });
  };

  const updateSellingPoint = (index: number, val: string) => {
    const newList = [...data.sellingPoints];
    newList[index] = val;
    setData({ ...data, sellingPoints: newList });
  };

  const removeSellingPoint = (index: number) => {
    setData({ ...data, sellingPoints: data.sellingPoints.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <div className="w-1 h-4 bg-rose-400 rounded-full" />
        <h3 className="text-sm font-bold text-slate-800">2.1 商品固定基础入参</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 font-bold">商品名称</Label>
          <Input 
            value={data.name} 
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="h-9 text-xs bg-slate-50/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 font-bold">商品类目 (只读)</Label>
          <div className="h-9 flex items-center px-3 bg-slate-100 rounded-md border border-slate-200 text-xs text-slate-500 font-medium">
            {data.category}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-[11px] text-slate-500 font-bold">核心属性 (材质/尺寸/人群/场景)</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="材质，如：30%酵母精粹" className="h-8 text-[11px]" value={data.attrs.material} onChange={(e) => setData({...data, attrs: {...data.attrs, material: e.target.value}})} />
          <Input placeholder="适用人群，如：轻熟敏感肌" className="h-8 text-[11px]" value={data.attrs.audience} onChange={(e) => setData({...data, attrs: {...data.attrs, audience: e.target.value}})} />
          <Input placeholder="使用场景，如：晚间修护" className="h-8 text-[11px]" value={data.attrs.scenario} onChange={(e) => setData({...data, attrs: {...data.attrs, scenario: e.target.value}})} />
          <Input placeholder="尺寸/规格，如：50g/瓶" className="h-8 text-[11px]" value={data.attrs.size} onChange={(e) => setData({...data, attrs: {...data.attrs, size: e.target.value}})} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-[11px] text-slate-500 font-bold">参考卖点 (系统抓取+自定义)</Label>
          <Button variant="ghost" size="sm" onClick={addSellingPoint} className="h-6 text-[10px] text-rose-500">
            <Plus className="w-3 h-3 mr-1" /> 添加卖点
          </Button>
        </div>
        <div className="space-y-2">
          {data.sellingPoints.map((sp: string, i: number) => (
            <div key={i} className="flex gap-2">
              <Input 
                value={sp} 
                onChange={(e) => updateSellingPoint(i, e.target.value)}
                className="h-8 text-[11px] flex-1"
                placeholder="输入核心卖点..."
              />
              <Button variant="ghost" size="sm" onClick={() => removeSellingPoint(i)} className="h-8 w-8 p-0 text-slate-300 hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductInputSection;