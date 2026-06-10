import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, ImageIcon, Info, ShieldCheck, Check, ShoppingBag, Store
} from 'lucide-react';
import { cn } from "@/lib/utils";

const MOCK_PRODUCTS_DB: Record<string, any> = {
  '1': {
    name: '中达酵母御龄紧致面霜 50g',
    brand: '中达美妆 (Chanda)',
    category: '面霜/乳液',
    platform: 'Taobao',
    shopName: '中达美妆官方旗舰店',
    status: '出售中',
    sellPoint: '30% 酵母多肽精粹靶向淡纹，无敏配方，专为轻熟敏感肌肤定制。',
    mainImages: ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&auto=format&fit=crop&q=60"],
    detailImages: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=60"],
    specAttrs: [
      { name: '规格容量', values: ['经典紧致款 50g', '润泽保湿款 50g'] }
    ],
    skuList: [
      { specs: { '规格容量': '经典紧致款 50g' }, skuCode: 'SKU-99001-01', price: '299', stock: '1200', barcode: '6901234567890' },
      { specs: { '规格容量': '润泽保湿款 50g' }, skuCode: 'SKU-99001-02', price: '299', stock: '1250', barcode: '6901234567891' }
    ],
    isFreeShipping: true,
    guarantees: ['7day', 'genuine']
  },
  '2': {
    name: '中达水漾隔离防晒乳 SPF50+',
    brand: '中达美妆 (Chanda)',
    category: '防晒霜/喷雾',
    platform: 'Douyin',
    shopName: '中达美妆抖音专营店',
    status: '出售中',
    sellPoint: '清爽防晒不闷痘，SPF50+强力隔离户外紫外线。',
    mainImages: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=60"],
    detailImages: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200&auto=format&fit=crop&q=60"],
    specAttrs: [
      { name: '规格容量', values: ['单支装 50ml', '两支特惠装 50ml*2'] }
    ],
    skuList: [
      { specs: { '规格容量': '单支装 50ml' }, skuCode: 'SKU-88120-01', price: '129', stock: '500', barcode: '6901234567882' },
      { specs: { '规格容量': '两支特惠装 50ml*2' }, skuCode: 'SKU-88120-02', price: '189', stock: '350', barcode: '6901234567883' }
    ],
    isFreeShipping: true,
    guarantees: ['7day', 'genuine']
  },
  '3': {
    name: '积雪草净化海泥面膜 100g',
    brand: '中达美妆 (Chanda)',
    category: '面膜/清洁',
    platform: 'JD',
    shopName: '中达美妆京东旗舰店',
    status: '已售罄',
    sellPoint: '积雪草深层清洁海泥，吸附毛孔脏污，温和不紧绷。',
    mainImages: ["https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200&auto=format&fit=crop&q=60"],
    detailImages: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200&auto=format&fit=crop&q=60"],
    specAttrs: [
      { name: '规格容量', values: ['积雪草深层清洁 100g'] }
    ],
    skuList: [
      { specs: { '规格容量': '积雪草深层清洁 100g' }, skuCode: 'SKU-77002-01', price: '89', stock: '0', barcode: '6901234567875' }
    ],
    isFreeShipping: true,
    guarantees: ['7day', 'genuine']
  },
  '4': {
    name: '中达凝润修护水光唇蜜',
    brand: '中达美妆 (Chanda)',
    category: '唇部彩妆',
    platform: 'Taobao',
    shopName: '中达彩妆官方店',
    status: '草稿箱',
    sellPoint: '水光饱满西红柿红，温和淡化唇纹，长效保湿。',
    mainImages: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200&auto=format&fit=crop&q=60"],
    detailImages: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=60"],
    specAttrs: [
      { name: '规格容量', values: ['01# 水光西红柿红'] }
    ],
    skuList: [
      { specs: { '规格容量': '01# 水光西红柿红' }, skuCode: 'SKU-66044-01', price: '69', stock: '2200', barcode: '6901234567861' }
    ],
    isFreeShipping: true,
    guarantees: ['7day', 'genuine']
  }
};

const ViewProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const product = useMemo(() => {
    if (id && MOCK_PRODUCTS_DB[id]) {
      return MOCK_PRODUCTS_DB[id];
    }
    return MOCK_PRODUCTS_DB['1'];
  }, [id]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-24 text-slate-800 text-xs text-left animate-in fade-in duration-300">
        
        {/* 顶部导航与操作 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 text-slate-500 hover:text-rose-500 hover:bg-slate-100 rounded-lg"
              onClick={() => navigate('/products')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-slate-900">查看商品详情</h1>
              <p className="text-[10px] text-slate-400">只读视图，不允许直接在此页中进行任何编辑保存操作</p>
            </div>
          </div>
          <Badge className={cn(
            "border-none text-xs font-bold px-3 py-1",
            product.status === '出售中' && 'bg-emerald-100 text-emerald-700',
            product.status === '已售罄' && 'bg-rose-100 text-rose-700',
            product.status === '仓库中' && 'bg-amber-100 text-amber-700',
            product.status === '草稿箱' && 'bg-slate-100 text-slate-500',
          )}>
            {product.status}
          </Badge>
        </div>

        {/* 1. 基本信息卡片 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">1. 基本数据建档</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-slate-400 block">一级类目</span>
                <span className="font-bold text-slate-700">美容护肤 / 彩妆香氛</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block">二级类目</span>
                <span className="font-bold text-slate-700">{product.category}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block">所属品牌</span>
                <span className="font-bold text-slate-700">{product.brand}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-2 border-t border-slate-50">
              <div className="space-y-1">
                <span className="text-slate-400 block">同步平台</span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-black uppercase inline-block",
                  product.platform === 'Taobao' && "bg-orange-100 text-orange-600",
                  product.platform === 'JD' && "bg-red-100 text-red-600",
                  product.platform === 'Douyin' && "bg-slate-800 text-white",
                )}>
                  {product.platform}
                </span>
              </div>
              <div className="space-y-1 col-span-2">
                <span className="text-slate-400 block">关联同步店铺</span>
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-slate-400" />
                  {product.shopName}
                </span>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-50">
              <span className="text-slate-400 block">商品核心标题</span>
              <p className="font-bold text-slate-800 text-sm leading-relaxed">{product.name}</p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-50">
              <span className="text-slate-400 block">核心营销卖点描述</span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{product.sellPoint}</p>
            </div>
          </CardContent>
        </Card>

        {/* 2. 商品图片展示 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">2. 橱窗主图与详情图</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <span className="text-slate-500 font-bold block">商品主图清单</span>
              <div className="flex gap-4 flex-wrap">
                {product.mainImages.map((url: string, index: number) => (
                  <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                    <img src={url} alt="main" className="w-full h-full object-cover" />
                    {index === 0 && (
                      <span className="absolute top-1 left-1 bg-rose-500 text-white font-bold text-[8px] px-1.5 py-0.5 rounded shadow">
                        首图
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-50">
              <span className="text-slate-500 font-bold block">商品详情图</span>
              <div className="flex gap-4 flex-wrap">
                {product.detailImages.map((url: string, index: number) => (
                  <div key={index} className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                    <img src={url} alt="detail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. SKU 属性组合表格 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">3. SKU 规格多属性配置矩阵</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    {product.specAttrs.map((attr: any) => (
                      <TableHead key={attr.name} className="text-[10px] py-2.5 font-bold">{attr.name}</TableHead>
                    ))}
                    <TableHead className="text-[10px] py-2.5 font-bold">规格编码</TableHead>
                    <TableHead className="text-[10px] py-2.5 font-bold text-right">售价 (元)</TableHead>
                    <TableHead className="text-[10px] py-2.5 font-bold text-right">可用库存</TableHead>
                    <TableHead className="text-[10px] py-2.5 font-bold">商品条码</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.skuList.map((sku: any, idx: number) => (
                    <TableRow key={idx}>
                      {product.specAttrs.map((attr: any) => (
                        <TableCell key={attr.name} className="py-3 font-bold text-slate-700">{sku.specs[attr.name] || '-'}</TableCell>
                      ))}
                      <TableCell className="py-3 font-mono text-slate-500">{sku.skuCode}</TableCell>
                      <TableCell className="py-3 text-right font-bold text-slate-800">¥{sku.price}</TableCell>
                      <TableCell className="py-3 text-right font-bold text-slate-800">{sku.stock} 件</TableCell>
                      <TableCell className="py-3 font-mono text-slate-500">{sku.barcode}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 4. 物流保障 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">4. 物流与服务保障详情</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-700 block">配送运费规则</span>
                <span className="text-[10px] text-slate-400">当前商品已绑定：{product.isFreeShipping ? '全国包邮模板' : '阶梯收费运费模板' }</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">已启用</Badge>
            </div>

            <div className="space-y-2">
              <span className="text-slate-500 font-bold block mb-1">包含服务承诺</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: '7day', label: '支持 7 天无理由退换货', desc: '买家可在收到商品起7天内发起无理由退换申请' },
                  { id: 'genuine', label: '100% 正品保障赔付', desc: '假一赔十，保障消费者正品权益心智' },
                  { id: 'ship24', label: '24 小时闪电发货', desc: '下单后24小时内确保物流揽收出库' },
                  { id: 'broken', label: '破损包退换/过敏包退', desc: '运输途中损坏或使用后过敏无条件全额退款' }
                ].filter(srv => product.guarantees.includes(srv.id)).map(srv => (
                  <div key={srv.id} className="flex items-start gap-2.5 p-3 bg-rose-50/20 border border-rose-100 rounded-xl">
                    <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 text-[11px] block">{srv.label}</span>
                      <span className="text-[9px] text-slate-400 leading-normal block">{srv.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 底部返回操作栏 */}
        <div className="flex justify-end pt-4">
          <Button 
            type="button" 
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 px-6 rounded-xl"
            onClick={() => navigate('/products')}
          >
            返回商品列表
          </Button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ViewProduct;