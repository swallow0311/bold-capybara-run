import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Package, Search, Plus, Edit3, Trash2, RefreshCw, Layers, Eye, ChevronLeft, ChevronRight
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
    category: '面膜/清洁',
    spuCode: 'SPU-FAC-77002',
    priceRange: '¥89.00',
    stock: 0,
    sales: 3200,
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
    category: '唇部彩妆',
    spuCode: 'SPU-LIP-66044',
    priceRange: '¥69.00',
    stock: 2200,
    sales: 1560,
    status: '草稿箱',
    platform: 'Taobao',
    shopName: '中达彩妆官方店',
    skus: [
      { skuCode: 'SKU-66044-01', spec: '01# 水光西红柿红', price: 69, stock: 2200, barcode: '6901234567861' }
    ]
  }
];

const ITEMS_PER_PAGE = 10; // 调整为每页展示 10 条商品数据

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [statusTab, setStatusTab] = useState<'all' | '出售中' | '已售罄' | '仓库中' | '草稿箱'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 当筛选状态或搜索内容改变时，自动将页码重置为第 1 页
  useEffect(() => {
    setCurrentPage(1);
  }, [statusTab, searchQuery]);

  // 计算各个分类的数量
  const counts = {
    all: products.length,
    active: products.filter(p => p.status === '出售中').length,
    soldout: products.filter(p => p.status === '已售罄').length,
    warehouse: products.filter(p => p.status === '仓库中').length,
    draft: products.filter(p => p.status === '草稿箱').length
  };

  const filteredProducts = products.filter(p => {
    const matchesStatus = statusTab === 'all' || p.status === statusTab;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.spuCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // 分页截取商品数据
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePullFromShop = () => {
    setIsSyncing(true);
    showSuccess("开始拉取授权店铺的线上实时商品数据...");
    setTimeout(() => {
      setIsSyncing(false);
      showSuccess("拉取完成：检测到 2 款新品，已自动建立 SPU/SKU 档案。");
    }, 2000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`确定要删除商品「${name}」吗？此操作不可撤销。`)) {
      setProducts(products.filter(p => p.id !== id));
      showSuccess("商品已成功从主档中移除。");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-800 text-xs text-left animate-in fade-in duration-500">
        
        {/* 顶部标题与全局操作 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">店铺商品主档管理</h1>
            <p className="text-slate-500 text-xs mt-0.5">多源电商开放平台商品同步，打通 AI 选品与评价 analysis 物料流</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handlePullFromShop} 
              disabled={isSyncing}
              className="bg-rose-400 hover:bg-rose-500 text-white text-xs h-9 shadow-lg shadow-rose-100"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isSyncing && "animate-spin")} />
              拉取多平台在线商品
            </Button>
            <Button 
              onClick={() => navigate('/products/create')}
              variant="outline" 
              className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-9"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              新建商品
            </Button>
          </div>
        </div>

        {/* 状态切换与搜索 */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
              {[
                { id: 'all', label: `全部商品 (${counts.all})` },
                { id: '出售中', label: `出售中 (${counts.active})` },
                { id: '已售罄', label: `已售罄 (${counts.soldout})` },
                { id: '仓库中', label: `仓库中 (${counts.warehouse})` },
                { id: '草稿箱', label: `草稿箱 (${counts.draft})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusTab(tab.id as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex-1 md:flex-none",
                    statusTab === tab.id ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索商品名称、SPU 编码..." 
                className="pl-9 text-xs h-9 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* 商品列表表格 */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/70">
                <TableRow>
                  <TableHead className="text-xs">商品编码 / 平台</TableHead>
                  <TableHead className="text-xs">商品主档信息</TableHead>
                  <TableHead className="text-xs">所属品牌 / 类目</TableHead>
                  <TableHead className="text-xs text-right">价格区间</TableHead>
                  <TableHead className="text-xs text-right">总库存 / 销量</TableHead>
                  <TableHead className="text-xs text-center">状态</TableHead>
                  <TableHead className="text-xs text-right w-[240px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map(p => (
                    <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-slate-500 block">{p.spuCode}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              "text-[9px] px-1.5 py-0.2 rounded font-black uppercase",
                              p.platform === 'Taobao' && "bg-orange-100 text-orange-600",
                              p.platform === 'JD' && "bg-red-100 text-red-600",
                              p.platform === 'Douyin' && "bg-slate-800 text-white",
                            )}>
                              {p.platform}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[80px]">{p.shopName}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            <Package className="w-5 h-5 text-slate-300" />
                          </div>
                          <span className="font-bold text-slate-700 leading-snug max-w-[200px]">{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="font-medium text-slate-600 block">{p.brand}</span>
                          <span className="text-slate-400">{p.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-700">{p.priceRange}</TableCell>
                      <TableCell className="text-right">
                        <div className="space-y-0.5">
                          <span className={cn("font-bold block", p.stock < 50 ? "text-rose-500" : "text-slate-700")}>
                            {p.stock.toLocaleString()} <span className="text-[9px] font-normal text-slate-400">件</span>
                          </span>
                          <span className="text-slate-400">已售 {p.sales.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "border-none text-[9px] font-bold",
                          p.status === '出售中' && 'bg-emerald-100 text-emerald-700',
                          p.status === '已售罄' && 'bg-rose-100 text-rose-700',
                          p.status === '仓库中' && 'bg-amber-100 text-amber-700',
                          p.status === '草稿箱' && 'bg-slate-100 text-slate-500',
                        )}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/products/view/${p.id}`)}
                            className="h-7 text-[10px] text-rose-600 hover:bg-rose-50"
                          >
                            <Eye className="w-3 h-3 mr-1" /> 查看
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/products/edit/${p.id}`)}
                            className="h-7 text-[10px] text-slate-500 hover:text-slate-700"
                          >
                            <Edit3 className="w-3 h-3 mr-1" /> 编辑
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(p.id, p.name)}
                            className="h-7 text-[10px] text-slate-500 hover:text-slate-700"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> 删除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="w-8 h-8 opacity-20" />
                        <span>暂无符合条件的商品档案</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 分页与底部数据统计 */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2 pt-2 border-t border-slate-100">
          <div className="flex gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>总商品数: {products.length}</span>
            <span>出售中: {counts.active}</span>
            <span>库存预警: {products.filter(p => p.stock < 50).length}</span>
          </div>

          {/* 分页控制栏 */}
          <div className="flex items-center gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-slate-200" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button 
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 text-xs font-bold transition-all",
                    currentPage === pageNum 
                      ? "bg-rose-400 hover:bg-rose-500 text-white border-transparent"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  )}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-slate-200" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ProductManagement;