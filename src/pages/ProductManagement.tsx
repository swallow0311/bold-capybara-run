import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Package, Search, Plus, Edit3, Trash2, RefreshCw, Layers
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
    name: 'XX酵母御龄紧致面霜 50g',
    brand: 'XX美妆 (Chanda)',
    category: '面霜/乳液',
    spuCode: 'SPU-LIP-99001',
    priceRange: '¥299.00',
    stock: 2450,
    sales: 12840,
    status: '出售中',
    platform: 'Taobao',
    shopName: 'XX美妆官方旗舰店',
    skus: [
      { skuCode: 'SKU-99001-01', spec: '经典紧致款 50g', price: 299, stock: 1200, barcode: '6901234567890' },
      { skuCode: 'SKU-99001-02', spec: '润泽保湿款 50g', price: 299, stock: 1250, barcode: '6901234567891' }
    ]
  },
  {
    id: '2',
    name: 'XX水漾隔离防晒乳 SPF50+',
    brand: 'XX美妆 (Chanda)',
    category: '防晒霜/喷雾',
    spuCode: 'SPU-SUN-88120',
    priceRange: '¥129.00 - ¥189.00',
    stock: 850,
    sales: 5400,
    status: '出售中',
    platform: 'Douyin',
    shopName: 'XX美妆抖音专营店',
    skus: [
      { skuCode: 'SKU-88120-01', spec: '单支装 50ml', price: 129, stock: 500, barcode: '6901234567882' },
      { skuCode: 'SKU-88120-02', spec: '两支特惠装 50ml*2', price: 189, stock: 350, barcode: '6901234567883' }
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
                          p.spuCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handlePullFromShop = () => {
    setIsSyncing(true);
    showSuccess("开始拉取授权店铺的线上实时商品数据...");
    setTimeout(() => {
      setIsSyncing(false);
      showSuccess("拉取完成：检测到新品，已自动建立档案。");
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-800 text-xs text-left">
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

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索商品名称或编码..." 
                className="pl-9 text-xs h-9 bg-slate-50/50 border-slate-200"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/70">
                <TableRow>
                  <TableHead className="text-xs">商品编码</TableHead>
                  <TableHead className="text-xs">商品名称</TableHead>
                  <TableHead className="text-xs">品牌</TableHead>
                  <TableHead className="text-xs text-right">价格</TableHead>
                  <TableHead className="text-xs text-center">状态</TableHead>
                  <TableHead className="text-xs text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(p => (
                  <TableRow key={p.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono font-bold">{p.spuCode}</TableCell>
                    <TableCell className="font-bold">{p.name}</TableCell>
                    <TableCell>{p.brand}</TableCell>
                    <TableCell className="text-right font-bold">{p.priceRange}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn("border-none text-[9px] font-bold", p.status === '出售中' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/products/edit/${p.id}`)} className="h-7 text-[10px]">编辑</Button>
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

export default ProductManagement;