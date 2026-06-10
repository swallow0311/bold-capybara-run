import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Sparkles, Search, TrendingUp, Target, 
  Filter, Download, ChevronRight, ArrowUpDown,
  Calendar, Globe, Flame, MousePointer2, Eye,
  LayoutGrid, List, BarChart3
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";
import AiAnalysisReport from '@/components/selection/AiAnalysisReport';

// 模拟爆款榜单数据
const TRENDING_PRODUCTS = [
  { 
    rank: 1, 
    id: 'P-001', 
    name: '中达多肽紧致修护眼霜', 
    sales: '12.8w+', 
    heat: 9850, 
    avgPrice: 299, 
    ingredients: ['多肽', '酵母', '玻尿酸'], 
    platform: '抖音',
    aiReport: {
      feasibility: '高',
      suggestedPrice: '¥269 - ¥320',
      competition: '中低',
      ingredientTrends: '多肽成分在抗老赛道搜索量环比增长45%，用户对“即时紧致”需求旺盛。',
      risks: ['包装密封性投诉率略高', '换季流量波动风险', '竞品低价促销冲击']
    }
  },
  { 
    rank: 2, 
    id: 'P-002', 
    name: '氨基酸温和洁面乳', 
    sales: '8.5w+', 
    heat: 8200, 
    avgPrice: 89, 
    ingredients: ['氨基酸', '积雪草'], 
    platform: '小红书',
    aiReport: {
      feasibility: '中',
      suggestedPrice: '¥79 - ¥99',
      competition: '极高',
      ingredientTrends: '氨基酸洁面已进入红海期，用户开始关注“洗后不紧绷”的附加功效。',
      risks: ['同质化严重', '利润空间被压缩', '获客成本持续走高']
    }
  },
  { 
    rank: 3, 
    id: 'P-003', 
    name: '水漾隔离防晒喷雾', 
    sales: '5.2w+', 
    heat: 7500, 
    avgPrice: 129, 
    ingredients: ['烟酰胺', '物理防晒'], 
    platform: '抖音',
    aiReport: {
      feasibility: '高',
      suggestedPrice: '¥119 - ¥149',
      competition: '中',
      ingredientTrends: '防晒喷雾在户外场景搜索量激增，便携性是核心决策因素。',
      risks: ['物流易燃易爆限制', '季节性强', '成分合规性抽检']
    }
  },
  { 
    rank: 4, 
    id: 'P-004', 
    name: '丝绒哑光唇釉 01#', 
    sales: '4.8w+', 
    heat: 6800, 
    avgPrice: 69, 
    ingredients: ['维E', '植物油'], 
    platform: '小红书',
    aiReport: {
      feasibility: '低',
      suggestedPrice: '¥59 - ¥79',
      competition: '极高',
      ingredientTrends: '哑光质地热度下滑，水光感唇蜜正在成为新趋势。',
      risks: ['色差投诉风险', '品牌忠诚度低', '生命周期短']
    }
  }
];

const SelectionEngine = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [platform, setPlatform] = useState('all');
  const [category, setCategory] = useState('all');

  // 过滤逻辑
  const filteredProducts = useMemo(() => {
    return TRENDING_PRODUCTS.filter(p => {
      const matchesSearch = !searchQuery || p.name.includes(searchQuery);
      const matchesPlatform = platform === 'all' || p.platform === platform;
      return matchesSearch && matchesPlatform;
    });
  }, [searchQuery, platform]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-6 max-w-[1600px] mx-auto pb-12 text-left animate-in fade-in duration-500">
        
        {/* 1. 筛选区 */}
        <Card className="border-none shadow-sm bg-white shrink-0">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] text-slate-400 font-bold uppercase">来源平台</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="h-9 text-xs bg-slate-50">
                  <SelectValue placeholder="全部平台" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部平台</SelectItem>
                  <SelectItem value="抖音">抖音电商</SelectItem>
                  <SelectItem value="小红书">小红书</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] text-slate-400 font-bold uppercase">美妆品类</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-9 text-xs bg-slate-50">
                  <SelectValue placeholder="全部分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  <SelectItem value="skincare">面部护肤</SelectItem>
                  <SelectItem value="makeup">时尚彩妆</SelectItem>
                  <SelectItem value="body">身体护理</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] text-slate-400 font-bold uppercase">时间范围</Label>
              <Select defaultValue="30">
                <SelectTrigger className="h-9 text-xs bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">近 7 天</SelectItem>
                  <SelectItem value="30">近 30 天</SelectItem>
                  <SelectItem value="90">近 90 天</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-[10px] text-slate-400 font-bold uppercase">关键词搜索</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索爆款商品名称、成分..." 
                  className="pl-9 h-9 text-xs bg-slate-50 border-slate-200" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 主体内容区：左侧榜单 + 右侧研判 */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          
          {/* 2. 爆款数据榜单区 */}
          <Card className="flex-1 border-none shadow-sm overflow-hidden flex flex-col bg-white">
            <CardHeader className="py-4 border-b border-slate-100 shrink-0 flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-rose-400" />
                全网美妆爆款实时榜单
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-[10px] text-slate-400">
                  <ArrowUpDown className="w-3 h-3 mr-1" /> 按销量排序
                </Button>
              </div>
            </CardHeader>
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[60px] text-center text-xs">排名</TableHead>
                    <TableHead className="text-xs">商品名称</TableHead>
                    <TableHead className="text-xs text-right">销量</TableHead>
                    <TableHead className="text-xs text-right">热度</TableHead>
                    <TableHead className="text-xs text-right">均价</TableHead>
                    <TableHead className="text-xs">成分标签</TableHead>
                    <TableHead className="text-xs text-center">来源</TableHead>
                    <TableHead className="text-xs text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((p) => (
                    <TableRow 
                      key={p.id} 
                      className={cn(
                        "cursor-pointer transition-colors group",
                        selectedProduct?.id === p.id ? "bg-rose-50/30" : "hover:bg-slate-50/50"
                      )}
                      onClick={() => setSelectedProduct(p)}
                    >
                      <TableCell className="text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black",
                          p.rank <= 3 ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          {p.rank}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold text-slate-700 text-xs max-w-[180px] truncate">
                        {p.name}
                      </TableCell>
                      <TableCell className="text-right font-black text-slate-800 text-xs">{p.sales}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 text-rose-500 font-bold text-xs">
                          <Flame className="w-3 h-3" /> {p.heat}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-600 text-xs">¥{p.avgPrice}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.ingredients.slice(0, 2).map((ing: string) => (
                            <Badge key={ing} variant="secondary" className="bg-slate-100 text-slate-500 border-none text-[9px] px-1.5 py-0">
                              {ing}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "border-none text-[9px] font-bold",
                          p.platform === '抖音' ? "bg-slate-800 text-white" : "bg-rose-100 text-rose-600"
                        )}>
                          {p.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          查看详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* 3. AI 研判结果区 */}
          <Card className="w-full lg:w-[400px] border-none shadow-sm flex flex-col overflow-hidden bg-white shrink-0">
            <CardContent className="p-6 h-full">
              <AiAnalysisReport product={selectedProduct} />
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default SelectionEngine;