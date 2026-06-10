import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Package, Search, Plus, Edit3, Trash2, RefreshCw, Layers, Store
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  spuCode: string;
  priceRange: string;
  stock: number;
  sales: number;
  status: '出售中' | '已售罄' | '仓库中' | '草稿箱';
  platform: 'Taobao' | 'JD' | 'Douyin' | '1688';
  shopName: string;
  skus: Array<{
    skuCode: string;
    spec: string;
    price: number;
    stock: number;
    barcode: string;
  }>;
}

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: '1',
    name: '中达酵母御龄紧致面霜 50g',
    brand: '中达美妆 (Chanda)',
    category: '面霜/乳液',
    spuCode: 'SPU-LIP-99001',
    priceRange: '¥299.00',
    stock: 2450,
    sales: 12840,
    status: '出售中',
    platform: 'Taobao',
    shopName: '中达美妆官方旗舰店',
    skus: [
      { skuCode: 'SKU-99001-01', spec: '经典紧致款 50g', price: 299, stock: 1200, barcode: '6901234567890' },
      { skuCode: 'SKU-99001-02', spec: '润泽保湿款 50g', price: 299, stock: 1250, barcode: '6901234567891' }
    ]
  },
  {
    id: '2',
    name: '中达水漾隔离防晒乳 SPF50+',
    brand: '中达美妆 (Chanda)',
    category: '防晒霜/喷雾',
    spuCode: 'SPU-SUN-88120',
    priceRange: '¥129.00 - ¥189.00',
    stock: 850,
    sales: 5400,
    status: '出售中',
    platform: 'Douyin',
    shopName: '中达美妆抖音专营店',
    skus: [
      { skuCode: 'SKU-88120-01', spec: '单支装 50ml', price: 129, stock: 500, barcode: '6901234567882' },
      { skuCode: 'SKU-88120-02', spec: '两支特惠装 50ml*2', price: 189, stock: 350, barcode: '6901234567883' }
    ]
  },
  {
    id: '3',
    name: '积雪草净化海泥面膜 100g',
    brand: '中达美妆 (Chanda)',
    category: '水洗面膜',
    spuCode: 'SPU-FAC-77002',
    priceRange: '¥89.00',
    stock: 0,
    sales: 890,
    status: '已售罄',
    platform: 'JD',
    shopName: '中达美妆京东旗舰店',
    skus: [
      { skuCode: 'SKU-77002-01', spec: '积雪草深层清洁 100g', price: 89, stock: 0, barcode: '6901234567875' }
    ]
  },
  {
    id: '4',
    name: '中达凝润修护水光唇蜜',
    brand: '中达美妆 (Chanda)',
    category: '唇蜜/唇釉',
    spuCode: 'SPU-LIP-66044',
    priceRange: '¥69.00',
    stock: 4500,
    sales: 20100,
    status: '出售中',
    platform: 'Taobao',
    shopName: '中达彩妆官方店',
    skus: [
      { skuCode: 'SKU-66044-01', spec: '01# 水光西红柿红', price: 69, stock: 2200, barcode: '6901234567861' },
      { skuCode: 'SKU-66044-02', spec: '02# 裸粉豆沙蜜', price: 69, stock: 2300, barcode: '6901234567862' }
    ]
  }
];

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [statusTab, setStatusTab] = useState<'all' | '出售中' | '已售罄' | '仓库中' | '草稿箱'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesStatus = statusTab === 'all' || p.status === statusTab;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.spuCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleEdit = (product: ProductItem) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handlePullFromShop = () => {
    setIsSyncing(true);
    showSuccess("开始拉取授权店铺的线上实时商品数据...");
    setTimeout(() => {
      setIsSyncing(false);
      showSuccess("拉取完成：检测到3个新品，已自动建立SPU及对应SKU档案并流转至AIGC物料库。");
    }, 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该商品大类主档吗？删除后其关联SKU及NLP评价关联分析将需要重新挂载。")) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showSuccess("商品主档删除成功！");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-800 text-xs text-left">
        
        {/* 控制统计头部面板 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">店铺商品主档管理</h1>
            <p className="text-slate-500 text-xs mt-0.5">多源电商开放平台商品同步，打通AI选品与评价分析物料流</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePullFromShop} disabled={isSyncing} className="bg-rose-400 hover:bg-rose-500 text-white text-xs h-9">
              <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isSyncing && "animate-spin")} />
              拉取多平台在线商品
            </Button>
            <Button onClick={() => navigate('/products/create')} variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-9">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              新建商品
            </Button>
          </div>
        </div>

        {/* 筛选过滤工具条 */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 flex-1">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="按商品SPU名称、品牌、商品编码搜索..." 
                  className="pl-9 text-xs h-9 bg-slate-50/50 border-slate-200"
                />
              </div>

              <select 
                defaultValue="all" 
                className="h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-300"
              >
                <option value="all">所有平台</option>
                <option value="Taobao">淘宝/天猫</option>
                <option value="JD">京东</option>
                <option value="Douyin">抖音小店</option>
                <option value="1688">1688</option>
              </select>

              <select 
                defaultValue="all" 
                className="h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-300"
              >
                <option value="all">所有品类分类</option>
                <option value="cream">面霜/乳液</option>
                <option value="sun">防晒霜/喷雾</option>
                <option value="fac">面膜/清洁</option>
                <option value="lip">唇部彩妆</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 状态 Tab */}
        <div className="flex border-b border-slate-200">
          {(['all', '出售中', '已售罄', '仓库中', '草稿箱'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={cn(
                "px-5 py-2.5 font-bold text-xs border-b-2 -mb-px transition-all",
                statusTab === tab 
                  ? "border-rose-400 text-rose-600 font-bold" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              {tab === 'all' ? '全部商品' : tab}
              <span className="ml-1.5 text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.2 rounded-full font-medium">
                {tab === 'all' 
                  ? products.length 
                  : products.filter(p => p.status === tab).length
                }
              </span>
            </button>
          ))}
        </div>

        {/* 主体表格与SKU折叠面板 */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/70">
                <TableRow>
                  <TableHead className="text-xs w-[120px]">商品编码/SPU</TableHead>
                  <TableHead className="text-xs">商品主图 & 名称</TableHead>
                  <TableHead className="text-xs">关联品牌</TableHead>
                  <TableHead className="text-xs">关联店铺及渠道</TableHead>
                  <TableHead className="text-xs text-right">价格区间</TableHead>
                  <TableHead className="text-xs text-right">可用总库存</TableHead>
                  <TableHead className="text-xs text-right">累计销量</TableHead>
                  <TableHead className="text-xs text-center">状态</TableHead>
                  <TableHead className="text-xs text-right w-[150px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(p => (
                  <React.Fragment key={p.id}>
                    {/* SPU 主行 */}
                    <TableRow className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-mono font-bold text-slate-700">{p.spuCode}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-rose-50 border border-slate-150 flex items-center justify-center text-slate-400 shrink-0">
                            <Package className="w-5 h-5 text-rose-400" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-xs hover:text-rose-500 block cursor-pointer" onClick={() => handleEdit(p)}>
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{p.category}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-600">{p.brand}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] hover:bg-slate-100 font-bold">
                            {p.platform === 'Taobao' && '淘宝旗舰店'}
                            {p.platform === 'JD' && '京东商圈'}
                            {p.platform === 'Douyin' && '抖音抖店'}
                            {p.platform === '1688' && '1688大宗'}
                          </Badge>
                          <span className="text-slate-400 text-[10px]">{p.shopName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-800">{p.priceRange}</TableCell>
                      <TableCell className="text-right font-semibold text-slate-700">
                        {p.stock === 0 ? <span className="text-rose-500 font-bold">缺货/下架</span> : p.stock}
                      </TableCell>
                      <TableCell className="text-right text-slate-600 font-semibold">{p.sales} 件</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "border-none text-[9px] font-bold",
                          p.status === '出售中' && 'bg-emerald-100 text-emerald-700',
                          p.status === '已售罄' && 'bg-rose-100 text-rose-700',
                          p.status === '仓库中' && 'bg-amber-100 text-amber-700',
                          p.status === '草稿箱' && 'bg-slate-100 text-slate-600',
                        )}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(p)} className="h-7 text-[10px] text-slate-500 hover:text-rose-500 p-0 px-2">
                            <Edit3 className="w-3 h-3 mr-1" /> 编辑
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="h-7 text-[10px] text-rose-500 hover:bg-rose-50 p-0 px-2 rounded">
                            <Trash2 className="w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* SKU 规格细分折叠行 */}
                    <TableRow className="bg-slate-50/30">
                      <TableCell colSpan={9} className="p-3 pl-8">
                        <div className="bg-white rounded-lg border border-slate-100 p-3 shadow-inner">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                            <span className="font-bold text-[10px] text-slate-500 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-rose-400" />
                              关联 SKU 规格细分清单 ({p.skus.length} 个规格)
                            </span>
                            <span className="text-[10px] text-slate-400">一物一码追溯系统已连接</span>
                          </div>
                          
                          <Table>
                            <TableHeader className="bg-slate-50/50">
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="text-[10px] py-1">SKU 规格编码</TableHead>
                                <TableHead className="text-[10px] py-1">商品规类型属性</TableHead>
                                <TableHead className="text-[10px] py-1 text-right">单件售价</TableHead>
                                <TableHead className="text-[10px] py-1 text-right">可售配额库存</TableHead>
                                <TableHead className="text-[10px] py-1">商品国际条形码</TableHead>
                                <TableHead className="text-[10px] py-1 text-right">配置</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {p.skus.map(sku => (
                                <TableRow key={sku.skuCode} className="hover:bg-slate-50/20 text-[10px]">
                                  <TableCell className="font-mono text-slate-500">{sku.skuCode}</TableCell>
                                  <TableCell className="font-bold text-slate-700">{sku.spec}</TableCell>
                                  <TableCell className="text-right font-bold text-rose-500">¥{sku.price.toFixed(2)}</TableCell>
                                  <TableCell className="text-right font-semibold text-slate-600">{sku.stock}</TableCell>
                                  <TableCell className="font-mono text-slate-400">{sku.barcode}</TableCell>
                                  <TableCell className="text-right">
                                    <button onClick={() => showSuccess("正在打通AI生成主图/详情海报覆盖此SKU主档规格")} className="text-rose-500 font-bold hover:underline">
                                      AI渲染
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProductManagement;