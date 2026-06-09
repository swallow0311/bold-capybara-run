import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Save, Info } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface SkuInput {
  spec: string;
  price: string;
  stock: string;
  barcode: string;
}

const CreateProduct = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [spuCode, setSpuCode] = useState('');
  const [platform, setPlatform] = useState('Taobao');
  const [shopName, setShopName] = useState('');
  const [skus, setSkus] = useState<SkuInput[]>([
    { spec: '默认规格', price: '', stock: '', barcode: '' }
  ]);

  const handleAddSku = () => {
    setSkus([...skus, { spec: '', price: '', stock: '', barcode: '' }]);
  };

  const handleRemoveSku = (index: number) => {
    if (skus.length === 1) {
      showError("商品至少包含一个 SKU 规格！");
      return;
    }
    setSkus(skus.filter((_, i) => i !== index));
  };

  const handleSkuChange = (index: number, field: keyof SkuInput, value: string) => {
    const newSkus = [...skus];
    newSkus[index][field] = value;
    setSkus(newSkus);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showError("请输入商品名称！");
    if (!category.trim()) return showError("请输入商品类目！");
    if (!spuCode.trim()) return showError("请输入 SPU 编码！");
    if (!shopName.trim()) return showError("请输入关联店铺名称！");

    // 验证 SKU
    for (let i = 0; i < skus.length; i++) {
      if (!skus[i].spec.trim()) return showError(`请输入第 ${i + 1} 个 SKU 的规格名称！`);
      if (!skus[i].price || isNaN(Number(skus[i].price))) return showError(`请输入第 ${i + 1} 个 SKU 的有效售价！`);
      if (!skus[i].stock || isNaN(Number(skus[i].stock))) return showError(`请输入第 ${i + 1} 个 SKU 的有效可用库存！`);
    }

    showSuccess(`新建商品「${name}」主档成功！`);
    navigate('/products');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto pb-12 text-slate-800 text-xs text-left">
        {/* Back header */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-slate-500 hover:text-rose-500"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">新建商品主档</h1>
            <p className="text-slate-500 text-xs mt-0.5">创建 SPU 基础信息并配置关联的 SKU 规格清单</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left / Middle: SPU Details & SKUs (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SPU Base info */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-800">SPU 基础信息配置</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">商品 SPU 名称</Label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例：中达酵母御龄紧致面霜"
                    className="bg-slate-50/50 border-slate-200 text-xs h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-slate-500 font-semibold">SPU 主编码</Label>
                    <Input 
                      value={spuCode}
                      onChange={(e) => setSpuCode(e.target.value)}
                      placeholder="例：SPU-LIP-99001"
                      className="bg-slate-50/50 border-slate-200 text-xs h-9 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-slate-500 font-semibold">商品类目分类</Label>
                    <Input 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="例：面霜/乳液"
                      className="bg-slate-50/50 border-slate-200 text-xs h-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SKU Specification configuration */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold text-slate-800">关联 SKU 规格细分配置</CardTitle>
                <Button 
                  type="button" 
                  onClick={handleAddSku} 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  新增 SKU 规格
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {skus.map((sku, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-150 relative space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[10px] text-slate-400">规格 #{index + 1}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-slate-400 hover:text-rose-500 rounded-md"
                        onClick={() => handleRemoveSku(index)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-slate-500">规格/规格属性</Label>
                        <Input 
                          value={sku.spec}
                          onChange={(e) => handleSkuChange(index, 'spec', e.target.value)}
                          placeholder="例：经典紧致款 50g"
                          className="bg-white border-slate-200 text-[11px] h-8"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] text-slate-500">单件售价 (元)</Label>
                        <Input 
                          value={sku.price}
                          onChange={(e) => handleSkuChange(index, 'price', e.target.value)}
                          placeholder="例：299"
                          className="bg-white border-slate-200 text-[11px] h-8"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] text-slate-500">配额库存 (件)</Label>
                        <Input 
                          value={sku.stock}
                          onChange={(e) => handleSkuChange(index, 'stock', e.target.value)}
                          placeholder="例：1000"
                          className="bg-white border-slate-200 text-[11px] h-8"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] text-slate-500">条形码/编码</Label>
                        <Input 
                          value={sku.barcode}
                          onChange={(e) => handleSkuChange(index, 'barcode', e.target.value)}
                          placeholder="例：6901234..."
                          className="bg-white border-slate-200 text-[11px] h-8 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Area: Platform, Shop Settings & Info (1 col) */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-800">关联店铺与在架配置</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">发布目标平台</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="bg-slate-50/50 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Taobao">淘宝/天猫</SelectItem>
                      <SelectItem value="JD">京东</SelectItem>
                      <SelectItem value="Douyin">抖音小店</SelectItem>
                      <SelectItem value="1688">1688批发网</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">关联店铺名称</Label>
                  <Input 
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="请输入店铺名称，例：中达彩妆官方店"
                    className="bg-slate-50/50 border-slate-200 text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">在架销售状态</Label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger className="bg-slate-50/50 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="出售中">出售中</SelectItem>
                      <SelectItem value="已售罄">已售罄</SelectItem>
                      <SelectItem value="仓库中">仓库中</SelectItem>
                      <SelectItem value="草稿箱">草稿箱</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100 flex items-start gap-2">
                  <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-rose-700 leading-relaxed">
                    新建商品并存盘后，系统会自动将该商品档案推送至“AI 选品”及“AIGC内容工厂”中，便于立即进行素材生成。
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 text-xs h-9 border-slate-200 text-slate-700"
                    onClick={() => navigate('/products')}
                  >
                    取消
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 text-xs h-9 bg-rose-400 hover:bg-rose-500 text-white font-bold"
                  >
                    <Save className="w-3.5 h-3.5 mr-1" />
                    保存并建档
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateProduct;