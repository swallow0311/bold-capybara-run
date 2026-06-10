import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Sparkles, Search, TrendingUp, Target, 
  Filter, Download, ChevronRight, Crown,
  Calendar, Globe, Flame, Eye,
  LayoutGrid, List, BarChart3, Scale, Plus, Trash2,
  RefreshCw, Heart, FileSpreadsheet, Send, AlertCircle,
  ShieldAlert, Zap, Activity, TrendingDown, Settings2,
  ShieldCheck, Box, Coins, Info, Check, HelpCircle, FileText, Upload, Link2
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 导入子组件
import AiAnalysisReport from '@/components/selection/AiAnalysisReport';
import BenchmarkingRadar from '@/components/selection/BenchmarkingRadar';
import DiagnosisReport from '@/components/selection/DiagnosisReport';
import SelectionConfigSheet from '@/components/selection/SelectionConfigSheet';

// 初始种子竞品数据
const TRENDING_PRODUCTS = [
  { 
    rank: 1, id: 'P-001', name: '中达多肽紧致修护眼霜', category: '面部护肤',
    sales: '12.8w+', heat: 9850, avgPrice: 299, ingredients: ['多肽', '酵母'], platform: '抖音',
    img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100',
    scores: { '市场热度': 95, '蓝海竞争': 88, '盈利潜力': 92, '口碑舆情': 85, '风险安全': 98 },
    label: '综合最优',
    isCore: true, // 核心对标对象
    healthStatus: '健康',
    aiSummaryTag: '高潜爆品',
    data: { 
      totalScore: 94, tag: '高潜爆款', trend: '45% 稳定上升', lifecycle: '增长期', season: '四季', 
      trafficSource: '搜索(45%) 视频(35%)', competitorCount: 12, monopoly: '低', cost: 45, 
      priceRange: '¥299 - 350', margin: 65, profit: 150000, roi: 1.5, goodTags: '温和、吸收快', 
      badTags: '包装渗漏', returnRate: 3.2, audienceMatch: '25-40岁女性', supplyStability: '优质稳定', 
      moq: 100, leadTime: 3, infringementRisk: '低', compliance: '已备案',
      // 对比设置指标映射值
      salesTrend: '↑ 45.2% 月度爆发', priceSegment: '¥299.00 - ¥349.00', ratingsCount: '12,840 条', 
      publishDate: '2026-01-15', shippingMethod: '顺丰包邮/海外仓直邮', variantsCount: '3个变体(15ml/30ml/礼盒)'
    },
    aiReport: { feasibility: '高', suggestedPrice: '¥269 - ¥320', competition: '中低', ingredientTrends: '多肽成分在抗老赛道搜索量环比增长45%。', risks: ['包装密封性投诉率略高', '换季流量波动风险'] }
  },
  { 
    rank: 2, id: 'P-002', name: '氨基酸温和洁面乳', category: '面部护肤',
    sales: '8.5w+', heat: 8200, avgPrice: 89, ingredients: ['氨基酸'], platform: '小红书',
    img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100',
    scores: { '市场热度': 85, '蓝海竞争': 40, '盈利潜力': 60, '口碑舆情': 90, '风险安全': 95 },
    label: '热度最优',
    isCore: false,
    healthStatus: '健康',
    aiSummaryTag: '平稳红海',
    data: { 
      totalScore: 78, tag: '红海稳健', trend: '12% 震荡前行', lifecycle: '成熟期', season: '四季', 
      trafficSource: '搜索(60%) 笔记(30%)', competitorCount: 85, monopoly: '高', cost: 15, 
      priceRange: '¥79 - 99', margin: 40, profit: 45000, roi: 2.8, goodTags: '不紧绷、泡沫细', 
      badTags: '清洁力弱', returnRate: 2.5, audienceMatch: '全人群', supplyStability: '极高', 
      moq: 500, leadTime: 5, infringementRisk: '低', compliance: '已备案',
      salesTrend: '→ 12.1% 周期稳定', priceSegment: '¥79.00 - ¥99.00', ratingsCount: '85,400 条', 
      publishDate: '2025-08-10', shippingMethod: '常规中通快递包邮', variantsCount: '2个变体(100g/200g)'
    },
    aiReport: { feasibility: '中', suggestedPrice: '¥79 - ¥99', competition: '极高', ingredientTrends: '氨基酸洁面已进入红海期。', risks: ['同质化严重', '利润空间被压缩'] }
  },
  { 
    rank: 3, id: 'P-003', name: '水漾隔离防晒喷雾', category: '面部护肤',
    sales: '5.2w+', heat: 7500, avgPrice: 129, ingredients: ['物理防晒'], platform: '抖音',
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100',
    scores: { '市场热度': 78, '蓝海竞争': 65, '盈利潜力': 85, '口碑舆情': 75, '风险安全': 80 },
    label: '季节新品',
    isCore: false,
    healthStatus: '风险',
    aiSummaryTag: '高危监控',
    data: { 
      totalScore: 82, tag: '季节爆品', trend: '120% 强力攀升', lifecycle: '爆发期', season: '夏季', 
      trafficSource: '直播(50%) 视频(40%)', competitorCount: 32, monopoly: '中', cost: 28, 
      priceRange: '¥119 - 149', margin: 55, profit: 82000, roi: 1.8, goodTags: '成膜快、不假白', 
      badTags: '味道刺鼻', returnRate: 5.5, audienceMatch: '户外人群', supplyStability: '中等', 
      moq: 200, leadTime: 7, infringementRisk: '中', compliance: '特证要求',
      salesTrend: '↑ 120.4% 季节暴增', priceSegment: '¥119.00 - ¥149.00', ratingsCount: '5,210 条', 
      publishDate: '2026-03-01', shippingMethod: '顺丰陆运包邮', variantsCount: '1个变体(150ml)'
    },
    aiReport: { feasibility: '高', suggestedPrice: '¥119 - ¥149', competition: '中', ingredientTrends: '防晒喷雾在户外场景搜索量激增。', risks: ['物流易燃易爆限制', '季节性强'] }
  }
];

const STORE_DIAGNOSIS_DATA = [
  { id: 'S-001', name: '中达酵母御龄面霜', status: '健康', traffic: '1.2w', cvr: '3.5%', sentiment: '92%', trend: 'up', profitMargin: '65%', aiSummaryTag: '高频复购' },
  { id: 'S-002', name: '积雪草净化海泥面膜', status: '风险', traffic: '2.5k', cvr: '0.8%', sentiment: '75%', trend: 'down', profitMargin: '40%', aiSummaryTag: '包装缺陷' },
  { id: 'S-003', name: '水漾隔离防晒乳', status: '滞销', traffic: '800', cvr: '0.2%', sentiment: '88%', trend: 'down', profitMargin: '55%', aiSummaryTag: '流量下滑' },
];

const SelectionEngine = () => {
  const [activeTab, setActiveTab] = useState('potential');
  
  // 蓝海潜力选中
  const [selectedProduct, setSelectedProduct] = useState<any>(TRENDING_PRODUCTS[0]);
  
  // 本店商品诊断选中与筛选状态
  const [selectedDiagnosisProduct, setSelectedDiagnosisProduct] = useState<any>(STORE_DIAGNOSIS_DATA[0]);
  const [diagnosisStatusFilter, setDiagnosisStatusFilter] = useState('all');
  const [diagnosisTagFilter, setDiagnosisTagFilter] = useState('all');

  // 竞品配置区解析池数据
  const [parsedPool, setParsedPool]<dyad-write path="src/pages/SelectionEngine.tsx" description="完整输出 SelectionEngine.tsx，修正 DashboardLayout 标签闭合及所有状态定义。">
import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Sparkles, Search, TrendingUp, Target, 
  Filter, Download, ChevronRight, Crown,
  Calendar, Globe, Flame, Eye,
  LayoutGrid, List, BarChart3, Scale, Plus, Trash2,
  RefreshCw, Heart, FileSpreadsheet, Send, AlertCircle,
  ShieldAlert, Zap, Activity, TrendingDown, Settings2,
  ShieldCheck, Box, Coins, Info, Check, HelpCircle, FileText, Upload, Link2
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 导入子组件
import AiAnalysisReport from '@/components/selection/AiAnalysisReport';
import BenchmarkingRadar from '@/components/selection/BenchmarkingRadar';
import DiagnosisReport from '@/components/selection/DiagnosisReport';
import SelectionConfigSheet from '@/components/selection/SelectionConfigSheet';

// 初始种子竞品数据
const TRENDING_PRODUCTS = [
  { 
    rank: 1, id: 'P-001', name: '中达多肽紧致修护眼霜', category: '面部护肤',
    sales: '12.8w+', heat: 9850, avgPrice: 299, ingredients: ['多肽', '酵母'], platform: '抖音',
    img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100',
    scores: { '市场热度': 95, '蓝海竞争': 88, '盈利潜力': 92, '口碑舆情': 85, '风险安全': 98 },
    label: '综合最优',
    isCore: true, // 核心对标对象
    healthStatus: '健康',
    aiSummaryTag: '高潜爆品',
    data: { 
      totalScore: 94, tag: '高潜爆款', trend: '45% 稳定上升', lifecycle: '增长期', season: '四季', 
      trafficSource: '搜索(45%) 视频(35%)', competitorCount: 12, monopoly: '低', cost: 45, 
      priceRange: '¥299 - 350', margin: 65, profit: 150000, roi: 1.5, goodTags: '温和、吸收快', 
      badTags: '包装渗漏', returnRate: 3.2, audienceMatch: '25-40岁女性', supplyStability: '优质稳定', 
      moq: 100, leadTime: 3, infringementRisk: '低', compliance: '已备案',
      salesTrend: '↑ 45.2% 月度爆发', priceSegment: '¥299.00 - ¥349.00', ratingsCount: '12,840 条', 
      publishDate: '2026-01-15', shippingMethod: '顺丰包邮/海外仓直邮', variantsCount: '3个变体(15ml/30ml/礼盒)'
    },
    aiReport: { feasibility: '高', suggestedPrice: '¥269 - ¥320', competition: '中低', ingredientTrends: '多肽成分在抗老赛道搜索量环比增长45%。', risks: ['包装密封性投诉率略高', '换季流量波动风险'] }
  },
  { 
    rank: 2, id: 'P-002', name: '氨基酸温和洁面乳', category: '面部护肤',
    sales: '8.5w+', heat: 8200, avgPrice: 89, ingredients: ['氨基酸'], platform: '小红书',
    img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100',
    scores: { '市场热度': 85, '蓝海竞争': 40, '盈利潜力': 60, '口碑舆情': 90, '风险安全': 95 },
    label: '热度最优',
    isCore: false,
    healthStatus: '健康',
    aiSummaryTag: '平稳红海',
    data: { 
      totalScore: 78, tag: '红海稳健', trend: '12% 震荡前行', lifecycle: '成熟期', season: '四季', 
      trafficSource: '搜索(60%) 笔记(30%)', competitorCount: 85, monopoly: '高', cost: 15, 
      priceRange: '¥79 - 99', margin: 40, profit: 45000, roi: 2.8, goodTags: '不紧绷、泡沫细', 
      badTags: '清洁力弱', returnRate: 2.5, audienceMatch: '全人群', supplyStability: '极高', 
      moq: 500, leadTime: 5, infringementRisk: '低', compliance: '已备案',
      salesTrend: '→ 12.1% 周期稳定', priceSegment: '¥79.00 - ¥99.00', ratingsCount: '85,400 条', 
      publishDate: '2025-08-10', shippingMethod: '常规中通快递包邮', variantsCount: '2个变体(100g/200g)'
    },
    aiReport: { feasibility: '中', suggestedPrice: '¥79 - ¥99', competition: '极高', ingredientTrends: '氨基酸洁面已进入红海期。', risks: ['同质化严重', '利润空间被压缩'] }
  },
  { 
    rank: 3, id: 'P-003', name: '水漾隔离防晒喷雾', category: '面部护肤',
    sales: '5.2w+', heat: 7500, avgPrice: 129, ingredients: ['物理防晒'], platform: '抖音',
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100',
    scores: { '市场热度': 78, '蓝海竞争': 65, '盈利潜力': 85, '口碑舆情': 75, '风险安全': 80 },
    label: '季节新品',
    isCore: false,
    healthStatus: '风险',
    aiSummaryTag: '高危监控',
    data: { 
      totalScore: 82, tag: '季节爆品', trend: '120% 强力攀升', lifecycle: '爆发期', season: '夏季', 
      trafficSource: '直播(50%) 视频(40%)', competitorCount: 32, monopoly: '中', cost: 28, 
      priceRange: '¥119 - 149', margin: 55, profit: 82000, roi: 1.8, goodTags: '成膜快、不假白', 
      badTags: '味道刺鼻', returnRate: 5.5, audienceMatch: '户外人群', supplyStability: '中等', 
      moq: 200, leadTime: 7, infringementRisk: '中', compliance: '特证要求',
      salesTrend: '↑ 120.4% 季节暴增', priceSegment: '¥119.00 - ¥149.00', ratingsCount: '5,210 条', 
      publishDate: '2026-03-01', shippingMethod: '顺丰陆运包邮', variantsCount: '1个变体(150ml)'
    },
    aiReport: { feasibility: '高', suggestedPrice: '¥119 - ¥149', competition: '中', ingredientTrends: '防晒喷雾在户外场景搜索量激增。', risks: ['物流易燃易爆限制', '季节性强'] }
  }
];

const STORE_DIAGNOSIS_DATA = [
  { id: 'S-001', name: '中达酵母御龄面霜', status: '健康', traffic: '1.2w', cvr: '3.5%', sentiment: '92%', trend: 'up', profitMargin: '65%', aiSummaryTag: '高频复购' },
  { id: 'S-002', name: '积雪草净化海泥面膜', status: '风险', traffic: '2.5k', cvr: '0.8%', sentiment: '75%', trend: 'down', profitMargin: '40%', aiSummaryTag: '包装缺陷' },
  { id: 'S-003', name: '水漾隔离防晒乳', status: '滞销', traffic: '800', cvr: '0.2%', sentiment: '88%', trend: 'down', profitMargin: '55%', aiSummaryTag: '流量下滑' },
];

const SelectionEngine = () => {
  const [activeTab, setActiveTab] = useState('potential');
  
  // 蓝海潜力选中
  const [selectedProduct, setSelectedProduct] = useState<any>(TRENDING_PRODUCTS[0]);
  
  // 本店商品诊断选中与筛选状态
  const [selectedDiagnosisProduct, setSelectedDiagnosisProduct] = useState<any>(STORE_DIAGNOSIS_DATA[0]);
  const [diagnosisStatusFilter, setDiagnosisStatusFilter] = useState('all');
  const [diagnosisTagFilter, setDiagnosisTagFilter] = useState('all');

  // 竞品配置区解析池数据
  const [parsedPool, setParsedPool] = useState<any[]>([
    { id: 'PARSED-01', name: '海外高端鱼子酱面霜 (亚马逊标杆)', category: '面部护肤', img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100', platform: 'Amazon', brand: 'Lamer', asin: 'B08F567X' },
    { id: 'PARSED-02', name: '纯有机绿茶控油乳液 (Shopify爆款)', category: '面部护肤', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100', platform: 'Shopify', brand: 'Innisfree', asin: 'B07T890Y' }
  ]);

  // 左侧三种竞品输入状态
  const [inputMode, setInputMode] = useState<'link' | 'search' | 'csv'>('link');
  const [linkInput, setLinkInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  
  // 对比与对齐设置
  const [alignmentMode, setAlignmentMode] = useState<'category' | 'price' | 'audience'>('category');
  const [indicators, setIndicators] = useState({
    sales: true,
    price: true,
    ratings: true,
    publish: true,
    shipping: true,
    variants: true
  });

  // 对标对比组列表
  const [compareList, setCompareList] = useState<any[]>(TRENDING_PRODUCTS.slice(0, 3));
  const [selectedCompareProduct, setSelectedCompareProduct] = useState<any>(TRENDING_PRODUCTS[0]);

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // 本店诊断数据过滤逻辑
  const filteredDiagnosisData = useMemo(() => {
    return STORE_DIAGNOSIS_DATA.filter(item => {
      const matchesStatus = diagnosisStatusFilter === 'all' || item.status === diagnosisStatusFilter;
      const matchesTag = diagnosisTagFilter === 'all' || item.aiSummaryTag === diagnosisTagFilter;
      return matchesStatus && matchesTag;
    });
  }, [diagnosisStatusFilter, diagnosisTagFilter]);

  // 当过滤数据变动时自动校准第一条数据的默认选中
  useEffect(() => {
    if (filteredDiagnosisData.length > 0) {
      const exists = filteredDiagnosisData.some(p => p.id === selectedDiagnosisProduct?.id);
      if (!exists) {
        setSelectedDiagnosisProduct(filteredDiagnosisData[0]);
      }
    } else {
      setSelectedDiagnosisProduct(null);
    }
  }, [filteredDiagnosisData, selectedDiagnosisProduct]);

  // 链接解析
  const handleParseLink = () => {
    if (!linkInput.trim()) {
      showError("请输入有效的竞品店铺或商品链接");
      return;
    }
    const id = `PARSED-${Date.now()}`;
    const parsedItem = {
      id,
      name: `AI解析竞品 - ${linkInput.replace(/(https?:\/\/)?(www\.)?/, '').slice(0, 25)}...`,
      category: '面部护肤',
      img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100',
      platform: linkInput.includes('amazon') ? 'Amazon' : linkInput.includes('shopify') ? 'Shopify' : 'TikTok Shop',
      brand: 'ParsedBrand',
      asin: 'B09W123Z'
    };
    setParsedPool([parsedItem, ...parsedPool]);
    setLinkInput('');
    showSuccess("链接解析成功！已自动提取产品缩略图与所属类目，载入竞品配置池。");
  };

  // 自动补全输入检测
  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
    if (val.trim().length > 1) {
      setAutocompleteSuggestions([
        `${val} - 兰蔻眼霜 15ml (ASIN: B08F567X)`,
        `${val} - 雅诗兰黛面霜 50ml (ASIN: B07T890Y)`,
        `${val} - 资生堂红腰子 75ml (ASIN: B09W123Z)`
      ]);
    } else {
      setAutocompleteSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    const id = `PARSED-${Date.now()}`;
    const parsedItem = {
      id,
      name: suggestion.split(' (')[0],
      category: '面部护肤',
      img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100',
      platform: 'Amazon',
      brand: 'SearchBrand',
      asin: suggestion.includes('B08F') ? 'B08F567X' : 'B07T890Y'
    };
    setParsedPool([parsedItem, ...parsedPool]);
    setSearchInput('');
    setAutocompleteSuggestions([]);
    showSuccess("自动补全成功！竞品已生成配置档录入解析池。");
  };

  // CSV批量导入
  const handleCsvUpload = () => {
    showSuccess("正在批量解析上传的 CSV 对标竞品清单...");
    setTimeout(() => {
      const mockBatch = Array.from({ length: 18 }).map((_, i) => ({
        id: `BATCH-${Date.now()}-${i}`,
        name: `CSV导入竞品 #${i+1} (ASIN-${1000 + i})`,
        category: '面部护肤',
        img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100',
        platform: 'Shopify',
        brand: 'BatchBrand',
        asin: `B08FBATCH${i}`
      }));
      setParsedPool([...mockBatch, ...parsedPool]);
      showSuccess("批量导入成功！已导入 18 款对标竞品（已过滤 2 个失效地址，符合上限20个限制）。");
    }, 1200);
  };

  // 添加为对比组 & 设置核心对标
  const handleAddToCompare = (item: any) => {
    if (compareList.length >= 5) {
      showError("最多支持对比 5 款商品，请先移除已有对标组商品");
      return;
    }
    if (compareList.some(c => c.id === item.id)) {
      showError("该竞品已在对比组中");
      return;
    }
    const newCompareItem = {
      ...item,
      rank: compareList.length + 1,
      isCore: compareList.length === 0,
      scores: { '市场热度': 80, '蓝海竞争': 70, '盈利潜力': 75, '口碑舆情': 82, '风险安全': 90 },
      data: {
        totalScore: 82, tag: '高潜对标', trend: '↑ 24% 增长', lifecycle: '进入期', season: '四季', 
        trafficSource: '直播(30%) 视频(70%)', competitorCount: 15, monopoly: '低', cost: 38, 
        priceRange: '¥180 - 240', margin: 58, profit: 89000, roi: 1.6, goodTags: '控油强、不粘腻', 
        badTags: '香味过浓', returnRate: 4.1, audienceMatch: '年轻白领', supplyStability: '稳定', 
        moq: 150, leadTime: 5, infringementRisk: '低', compliance: '已备案',
        salesTrend: '↑ 24.5% 平稳增长', priceSegment: '¥180.00 - ¥240.00', ratingsCount: '1,420 条', 
        publishDate: '2026-02-10', shippingMethod: '极速空运直达', variantsCount: '2个变体(标准版/体验装)'
      },
      aiReport: { feasibility: '中', suggestedPrice: '¥199', competition: '低', ingredientTrends: '草本绿色成分增长趋势明显。', risks: ['海关进口备案流程限制'] }
    };
    setCompareList([...compareList, newCompareItem]);
    showSuccess("成功将该商品添加为对比组！");
  };

  // 设置核心对标对象
  const handleSetCoreProduct = (id: string) => {
    setCompareList(prev => prev.map(p => ({
      ...p,
      isCore: p.id === id
    })));
    const target = compareList.find(p => p.id === id);
    if (target) {
      setSelectedCompareProduct(target);
      showSuccess(`已成功将「${target.name}」设为本次分析的核心对标对象`);
    }
  };

  const handleRemoveCompare = (id: string) => {
    const list = compareList.filter(item => item.id !== id);
    setCompareList(list);
    // 如果移除的是核心对标，则转移核心位置
    if (compareList.find(c => c.id === id)?.isCore && list.length > 0) {
      list[0].isCore = true;
      setSelectedCompareProduct(list[0]);
    }
    showSuccess("已从对比列表中移除");
  };

  // 竞品对标准入校验
  const validation = useMemo(() => {
    if (compareList.length < 2) return { valid: false, msg: "至少选择 2 款商品进行对标分析" };
    if (compareList.length > 5) return { valid: false, msg: "最多支持 5 款商品同时对标" };
    return { valid: true, msg: "" };
  }, [compareList]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-6 max-w-[1600px] mx-auto pb-12 text-left animate-in fade-in duration-500">
        
        {/* 顶部标签式功能切换 */}
        <div className="flex justify-between items-center shrink-0">
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit shadow-sm">
            <button
              onClick={() => setActiveTab('potential')}
              className={cn(
                "px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5", 
                activeTab === 'potential' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Zap className="w-3.5 h-3.5" /> 蓝海潜力选品
            </button>
            <button
              onClick={() => setActiveTab('benchmarking')}
              className={cn(
                "px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5", 
                activeTab === 'benchmarking' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Scale className="w-3.5 h-3.5" /> 竞品对标选品
            </button>
            <button
              onClick={() => setActiveTab('diagnosis')}
              className={cn(
                "px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5", 
                activeTab === 'diagnosis' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Activity className="w-3.5 h-3.5" /> 本店商品诊断
            </button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" onClick={() => setIsConfigOpen(true)}>
              <Settings2 className="w-3.5 h-3.5 mr-1.5" /> 全局权重配置
            </Button>
          </div>
        </div>

        {/* 1. 蓝海潜力选品 */}
        {activeTab === 'potential' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-[500px]">
            <Card className="flex-1 border-none shadow-sm overflow-hidden flex flex-col bg-white">
              <CardHeader className="py-4 border-b border-slate-100 shrink-0 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2"><Flame className="w-4 h-4 text-rose-400" /> 全网蓝海潜力爆款榜</CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="7d"><SelectTrigger className="h-8 text-[10px] w-24"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7d">近7天</SelectItem><SelectItem value="30d">近30天</SelectItem></SelectContent></Select>
                </div>
              </CardHeader>
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[60px] text-center text-xs">排名</TableHead>
                      <TableHead className="text-xs">商品信息</TableHead>
                      <TableHead className="text-xs text-center">健康状态</TableHead>
                      <TableHead className="text-xs text-right">潜力分</TableHead>
                      <TableHead className="text-xs text-right">热度趋势</TableHead>
                      <TableHead className="text-xs text-right">AI总结标签</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TRENDING_PRODUCTS.map((p) => (
                      <TableRow key={p.id} className={cn("cursor-pointer transition-colors group", selectedProduct?.id === p.id ? "bg-rose-50/30" : "hover:bg-slate-50/50")} onClick={() => setSelectedProduct(p)}>
                        <TableCell className="text-center"><span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black", p.rank <= 3 ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400")}>{p.rank}</span></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={p.img} className="w-8 h-8 rounded-lg object-cover" alt="" />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-700 text-xs truncate w-40">{p.name}</p>
                              <p className="text-[10px] text-slate-400">{p.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(
                            "border-none text-[9px] font-bold",
                            p.healthStatus === '健康' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          )}>{p.healthStatus}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-black text-rose-500 text-xs">{p.data.totalScore}</TableCell>
                        <TableCell className="text-right"><div className="flex items-center justify-end gap-1 text-emerald-500 font-bold text-xs">↑ {p.data.trend}</div></TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="border-rose-100 text-rose-600 bg-rose-50/50 text-[9px]">{p.aiSummaryTag}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
            <Card className="w-full lg:w-[400px] border-none shadow-sm flex flex-col overflow-hidden bg-white shrink-0">
              <CardContent className="p-6 h-full">
                <AiAnalysisReport product={selectedProduct} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* 2. 竞品对标选品 */}
        {activeTab === 'benchmarking' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch flex-1 overflow-hidden min-h-[650px] relative">
            
            {/* 左侧：竞品配置区 (3 cols) */}
            <div className="xl:col-span-3 flex flex-col gap-4">
              <Card className="border-none shadow-sm bg-white flex-1 flex flex-col overflow-hidden">
                <CardHeader className="py-4 border-b border-slate-100 shrink-0">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Settings2 className="w-4 h-4 text-rose-400" />
                    竞品对比配置面板
                  </CardTitle>
                </CardHeader>
                
                <ScrollArea className="flex-1">
                  <CardContent className="p-4 space-y-6">
                    
                    {/* 1.1 三种输入方式切换 */}
                    <div className="space-y-3">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase">竞品输入渠道</Label>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg text-center text-[10px] font-bold">
                        <button 
                          onClick={() => setInputMode('link')} 
                          className={cn("flex-1 py-1 rounded", inputMode === 'link' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500")}
                        >
                          链接解析
                        </button>
                        <button 
                          onClick={() => setInputMode('search')} 
                          className={cn("flex-1 py-1 rounded", inputMode === 'search' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500")}
                        >
                          编码补全
                        </button>
                        <button 
                          onClick={() => setInputMode('csv')} 
                          className={cn("flex-1 py-1 rounded", inputMode === 'csv' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500")}
                        >
                          CSV批量
                        </button>
                      </div>

                      {/* 输入区域渲染 */}
                      {inputMode === 'link' && (
                        <div className="space-y-2">
                          <Label className="text-[10px] text-slate-400">支持Amazon/Shopify/TikTok Shop链接</Label>
                          <div className="flex gap-1">
                            <Input 
                              placeholder="粘贴竞品店铺或商品链接..." 
                              value={linkInput} 
                              onChange={(e) => setLinkInput(e.target.value)}
                              className="h-8 text-xs bg-slate-50/50"
                            />
                            <Button size="sm" onClick={handleParseLink} className="h-8 bg-rose-400 hover:bg-rose-500 text-white text-[10px]">
                              解析
                            </Button>
                          </div>
                        </div>
                      )}

                      {inputMode === 'search' && (
                        <div className="space-y-2 relative">
                          <Label className="text-[10px] text-slate-400">输入竞品品牌/ASIN/SKU自动补全</Label>
                          <div className="relative">
                            <Input 
                              placeholder="例如：Lancome 或 B08F..." 
                              value={searchInput} 
                              onChange={(e) => handleSearchInputChange(e.target.value)}
                              className="h-8 text-xs bg-slate-50/50"
                            />
                            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                          </div>
                          {autocompleteSuggestions.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
                              {autocompleteSuggestions.map((item, idx) => (
                                <div 
                                  key={idx} 
                                  onClick={() => handleSelectSuggestion(item)}
                                  className="p-2.5 text-[10px] text-slate-700 hover:bg-rose-50/50 cursor-pointer transition-colors"
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {inputMode === 'csv' && (
                        <div className="space-y-2">
                          <Label className="text-[10px] text-slate-400">批量导入竞品列表 (最多20个)</Label>
                          <div 
                            onClick={handleCsvUpload}
                            className="border border-dashed border-slate-200 bg-slate-50 hover:bg-rose-50/10 hover:border-rose-300 rounded-xl p-3 text-center cursor-pointer transition-all"
                          >
                            <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                            <span className="text-[10px] font-bold text-slate-600 block">选择并导入竞品 CSV 表单</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. AI 解析池 */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-slate-400" />
                        AI 竞品解析池 ({parsedPool.length})
                      </Label>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {parsedPool.map((item) => (
                          <div key={item.id} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2 min-w-0">
                              <img src={item.img} className="w-7 h-7 rounded object-cover border" alt="" />
                              <div className="min-w-0 text-left">
                                <p className="font-bold text-slate-700 truncate w-32">{item.name}</p>
                                <span className="text-[8px] text-slate-400 uppercase font-mono">{item.platform} | {item.category}</span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 text-[9px] text-rose-500 font-bold hover:bg-rose-50 px-1.5"
                              onClick={() => handleAddToCompare(item)}
                            >
                              加入对标
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4.1 对比设置 - 指标选择 */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        对标指标选择
                      </Label>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                        {[
                          { id: 'sales', label: '销量趋势' },
                          { id: 'price', label: '价格区间' },
                          { id: 'ratings', label: '评分数量' },
                          { id: 'publish', label: '上架时间' },
                          { id: 'shipping', label: '物流方式' },
                          { id: 'variants', label: '变体数量' }
                        ].map((metric) => (
                          <label key={metric.id} className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-rose-50/20">
                            <Checkbox 
                              checked={(indicators as any)[metric.id]} 
                              onCheckedChange={(checked) => setIndicators(prev => ({ ...prev, [metric.id]: !!checked }))}
                            />
                            <span>{metric.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 4.2 对齐模式 */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-slate-400" />
                        对标数据对齐模式
                      </Label>
                      <Select value={alignmentMode} onValueChange={(v: any) => setAlignmentMode(v)}>
                        <SelectTrigger className="h-8 text-xs bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="category">相同类目对齐 (面部护肤)</SelectItem>
                          <SelectItem value="price">相同价格带对齐 (¥200-¥350)</SelectItem>
                          <SelectItem value="audience">相同目标人群对齐 (轻熟女性)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  </CardContent>
                </ScrollArea>
              </Card>
            </div>

            {/* 中间：AI选品推荐与对比列表 (6 cols) */}
            <div className="xl:col-span-6 flex flex-col gap-4 overflow-hidden">
              
              {/* 竞品概览卡片 (对标摘要) */}
              <div className="grid grid-cols-3 gap-3 shrink-0">
                <Card className="border-none shadow-sm bg-white p-4 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">对比组规模</span>
                  <p className="text-lg font-black text-slate-800 mt-1">{compareList.length} 款对标竞品</p>
                  <span className="text-[9px] text-slate-400 block mt-0.5">限制对比 3-5 个</span>
                </Card>
                <Card className="border-none shadow-sm bg-white p-4 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">核心对标对象</span>
                  <p className="text-xs font-black text-rose-500 mt-1 truncate">
                    {compareList.find(c => c.isCore)?.name || '未指定'}
                  </p>
                  <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">基准数据源</span>
                </Card>
                <Card className="border-none shadow-sm bg-white p-4 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">对齐模式</span>
                  <p className="text-lg font-black text-slate-800 mt-1">
                    {alignmentMode === 'category' ? '相同类目' : alignmentMode === 'price' ? '相同价格' : '目标人群'}
                  </p>
                  <span className="text-[9px] text-slate-400 block mt-0.5">多因子数据校准</span>
                </Card>
              </div>

              {/* 关键指标雷达图 */}
              <Card className="border-none shadow-sm bg-white shrink-0">
                <CardHeader className="py-2.5 border-b border-slate-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold text-slate-500">关键能力雷达图对标</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex items-center justify-center">
                  {validation.valid ? (
                    <BenchmarkingRadar data={compareList} />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-slate-400 text-xs">对比组竞品数少于2，请先在左侧选择</div>
                  )}
                </CardContent>
              </Card>

              {/* 推荐选品对比表格 */}
              <Card className="border-none shadow-sm bg-white flex-1 flex flex-col overflow-hidden">
                <CardHeader className="py-4 border-b border-slate-100 shrink-0 flex flex-row justify-between items-center">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase">对标数据矩阵 (动态渲染)</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] border-slate-200" onClick={() => showSuccess("横向数据对比已同步刷新")}>
                      <RefreshCw className="w-3 h-3 mr-1" /> 刷新
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] border-slate-200" onClick={() => showSuccess("对标对比数据表已成功导出")}>
                      <Download className="w-3 h-3 mr-1" /> 导出Excel
                    </Button>
                  </div>
                </CardHeader>
                <div className="flex-1 overflow-auto">
                  {validation.valid ? (
                    <Table>
                      <TableHeader className="bg-slate-50 sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="text-[10px] min-w-[150px]">对比指标</TableHead>
                          {compareList.map(p => (
                            <TableHead key={p.id} className={cn("text-[10px] text-center min-w-[120px] relative", p.isCore && "bg-rose-50/20")}>
                              <div className="flex flex-col items-center gap-1 py-1">
                                <div className="relative">
                                  <img src={p.img} className="w-6 h-6 rounded object-cover" alt="" />
                                  {p.isCore && (
                                    <Crown className="w-3 h-3 text-amber-500 absolute -top-1.5 -right-1.5 fill-amber-500" />
                                  )}
                                </div>
                                <span className="font-bold text-slate-800 truncate w-24 block text-center">{p.name}</span>
                                <div className="flex gap-1 mt-0.5">
                                  {!p.isCore ? (
                                    <button 
                                      onClick={() => handleSetCoreProduct(p.id)} 
                                      className="text-[8px] bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 px-1 rounded font-bold"
                                    >
                                      设为核心
                                    </button>
                                  ) : (
                                    <span className="text-[8px] bg-amber-100 text-amber-800 px-1 rounded font-bold">核心对标</span>
                                  )}
                                  <button 
                                    onClick={() => handleRemoveCompare(p.id)} 
                                    className="text-[8px] bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 px-1 rounded font-bold"
                                  >
                                    删除
                                  </button>
                                </div>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* 销量趋势 */}
                        {indicators.sales && (
                          <TableRow className="text-xs hover:bg-slate-50/30">
                            <TableCell className="font-bold text-slate-500">销量趋势 (月销)</TableCell>
                            {compareList.map(p => (
                              <TableCell key={p.id} className={cn("text-center font-bold text-slate-700", p.isCore && "bg-rose-50/10")}>{p.data.salesTrend}</TableCell>
                            ))}
                          </TableRow>
                        )}
                        {/* 价格区间 */}
                        {indicators.price && (
                          <TableRow className="text-xs hover:bg-slate-50/30">
                            <TableCell className="font-bold text-slate-500">价格区间</TableCell>
                            {compareList.map(p => (
                              <TableCell key={p.id} className={cn("text-center font-bold text-slate-700", p.isCore && "bg-rose-50/10")}>{p.data.priceSegment}</TableCell>
                            ))}
                          </TableRow>
                        )}
                        {/* 评分数量 */}
                        {indicators.ratings && (
                          <TableRow className="text-xs hover:bg-slate-50/30">
                            <TableCell className="font-bold text-slate-500">评分数量</TableCell>
                            {compareList.map(p => (
                              <TableCell key={p.id} className={cn("text-center font-bold text-slate-700", p.isCore && "bg-rose-50/10")}>{p.data.ratingsCount}</TableCell>
                            ))}
                          </TableRow>
                        )}
                        {/* 上架时间 */}
                        {indicators.publish && (
                          <TableRow className="text-xs hover:bg-slate-50/30">
                            <TableCell className="font-bold text-slate-500">上架时间</TableCell>
                            {compareList.map(p => (
                              <TableCell key={p.id} className={cn("text-center font-bold text-slate-700", p.isCore && "bg-rose-50/10")}>{p.data.publishDate}</TableCell>
                            ))}
                          </TableRow>
                        )}
                        {/* 物流方式 */}
                        {indicators.shipping && (
                          <TableRow className="text-xs hover:bg-slate-50/30">
                            <TableCell className="font-bold text-slate-500">物流方式</TableCell>
                            {compareList.map(p => (
                              <TableCell key={p.id} className={cn("text-center font-bold text-slate-700 text-[10px]", p.isCore && "bg-rose-50/10")}>{p.data.shippingMethod}</TableCell>
                            ))}
                          </TableRow>
                        )}
                        {/* 变体数量 */}
                        {indicators.variants && (
                          <TableRow className="text-xs hover:bg-slate-50/30">
                            <TableCell className="font-bold text-slate-500">颜色/尺寸变体数</TableCell>
                            {compareList.map(p => (
                              <TableCell key={p.id} className={cn("text-center font-bold text-slate-700 text-[10px]", p.isCore && "bg-rose-50/10")}>{p.data.variantsCount}</TableCell>
                            ))}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs py-20 gap-2">
                      <AlertCircle className="w-8 h-8 opacity-30 text-rose-400" />
                      <span>{validation.msg}</span>
                    </div>
                  )}
                </div>
              </Card>

            </div>

            {/* 右侧：详情与洞察面板 (3 cols) */}
            <div className="xl:col-span-3 flex flex-col gap-4">
              <Card className="border-none shadow-sm bg-white flex-1 flex flex-col overflow-hidden">
                <CardHeader className="py-4 border-b border-slate-100 shrink-0">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Target className="w-4 h-4 text-rose-400" />
                    详情与洞察面板
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1">
                  {selectedCompareProduct ? (
                    <div className="p-4 space-y-6 text-left">
                      
                      {/* 3.1 选中商品深度分析 */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold text-slate-400 uppercase">选中商品深度对标分析</Label>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                          <div className="flex gap-3">
                            <img src={selectedCompareProduct.img} className="w-10 h-10 rounded-lg object-cover border" alt="" />
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-800 truncate w-40">{selectedCompareProduct.name}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Badge className="bg-rose-100 text-rose-700 border-none text-[8px] font-bold">潜力分 {selectedCompareProduct.data.totalScore}</Badge>
                                {selectedCompareProduct.isCore && (
                                  <Badge className="bg-amber-100 text-amber-800 border-none text-[8px] font-bold flex items-center gap-0.5"><Crown className="w-2.5 h-2.5 fill-amber-700 text-amber-700" /> 核心基准</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-200/60 text-[10px] text-slate-500">
                            <p>月度销量: <strong className="text-slate-800">{selectedCompareProduct.sales}</strong></p>
                            <p>平台竞争度: <strong className="text-slate-800">{selectedCompareProduct.data.competitorCount}家</strong></p>
                            <p>参考毛利率: <strong className="text-emerald-600">{selectedCompareProduct.data.margin}%</strong></p>
                            <p>退货风险比: <strong className="text-rose-500">{selectedCompareProduct.data.returnRate}%</strong></p>
                          </div>
                        </div>
                      </div>

                      {/* 3.2 AI 选品理由 */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold text-slate-400 uppercase">AI 选品理由与立项建议</Label>
                        <div className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100/60 space-y-2">
                          <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[10px]">
                            <Sparkles className="w-3.5 h-3.5 text-rose-500" /> 核心选品研判结论
                          </div>
                          <ul className="space-y-1.5 text-[11px] text-rose-700/90 leading-relaxed list-disc pl-4">
                            <li>毛利定价模型显示高达 {selectedCompareProduct.data.margin}% 溢价能力</li>
                            <li>大盘搜索占比高且同款较少，广告 ROI 转化极佳</li>
                            <li>好评集中在“{selectedCompareProduct.data.goodTags}”，无劣质口碑风控隐患</li>
                          </ul>
                        </div>
                      </div>

                      {/* 3.3 同款/类似商品竞品 */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold text-slate-400 uppercase">同款/类似商品关联对标</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { name: '竞品 B 紧致水光霜', price: '¥268', sales: '3.4k+', flag: '高热' },
                            { name: '防脱妆修护眼乳', price: '¥199', sales: '8.2k+', flag: '红海' }
                          ].map((item, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                              <div className="min-w-0 text-left">
                                <span className="font-bold text-slate-700 truncate w-32 block">{item.name}</span>
                                <span className="text-[9px] text-slate-400">平均售价：{item.price}</span>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-slate-200 text-slate-600 text-[8px] font-bold border-none px-1.5 py-0">{item.flag}</Badge>
                                <span className="text-[9px] text-slate-400 block mt-0.5">月销{item.sales}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3.4 行动建议 (供货/广告) */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold text-slate-400 uppercase">错位竞争行动建议</Label>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5 text-[11px] text-slate-600">
                          <div className="flex gap-2">
                            <Box className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-800 block">货源供货策略:</strong>
                              首批起订量 MOQ 建议在 {selectedCompareProduct.data.moq} 件，保持 {selectedCompareProduct.data.leadTime} 天的极限稳产备料周期。
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-800 block">广告起量推广建议:</strong>
                              对比组中建议设定广告 ROI 保护在 {selectedCompareProduct.data.roi}，核心对准“{selectedCompareProduct.data.audienceMatch}”开展定向短视频测款。
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs">请点击对比组列表查看商品详情</div>
                  )}
                </ScrollArea>
              </Card>
            </div>

          </div>
        )}

        {/* 3. 本店商品诊断 */}
        {activeTab === 'diagnosis' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-[500px]">
            {/* 左侧：列表与筛选 */}
            <Card className="flex-1 border-none shadow-sm overflow-hidden flex flex-col bg-white">
              <CardHeader className="py-4 border-b border-slate-100 shrink-0 space-y-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  本店商品健康度扫描
                </CardTitle>
                
                {/* 增加筛选条件 */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">健康状态</span>
                    <Select value={diagnosisStatusFilter} onValueChange={setDiagnosisStatusFilter}>
                      <SelectTrigger className="w-28 h-8 text-[11px] bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有状态</SelectItem>
                        <SelectItem value="健康">健康</SelectItem>
                        <SelectItem value="风险">风险</SelectItem>
                        <SelectItem value="滞销">滞销</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">AI总结标签</span>
                    <Select value={diagnosisTagFilter} onValueChange={setDiagnosisTagFilter}>
                      <SelectTrigger className="w-28 h-8 text-[11px] bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有标签</SelectItem>
                        <SelectItem value="高频复购">高频复购</SelectItem>
                        <SelectItem value="包装缺陷">包装缺陷</SelectItem>
                        <SelectItem value="流量下滑">流量下滑</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-[11px] text-slate-400 hover:text-rose-500" 
                    onClick={() => { setDiagnosisStatusFilter('all'); setDiagnosisTagFilter('all'); }}
                  >
                    重置
                  </Button>
                </div>
              </CardHeader>

              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="text-xs">商品名称</TableHead>
                      <TableHead className="text-xs text-center">健康状态</TableHead>
                      <TableHead className="text-xs text-right">预计利润空间</TableHead>
                      <TableHead className="text-xs text-right">7日流量</TableHead>
                      <TableHead className="text-xs text-right">转化率 (CVR)</TableHead>
                      <TableHead className="text-xs text-right">好评率</TableHead>
                      <TableHead className="text-xs text-right">AI总结标签</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDiagnosisData.length > 0 ? (
                      filteredDiagnosisData.map((item) => (
                        <TableRow 
                          key={item.id} 
                          className={cn(
                            "cursor-pointer transition-colors text-xs",
                            selectedDiagnosisProduct?.id === item.id ? "bg-rose-50/30" : "hover:bg-slate-50/50"
                          )}
                          onClick={() => setSelectedDiagnosisProduct(item)}
                        >
                          <TableCell className="font-bold text-slate-700 text-xs">{item.name}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "border-none text-[9px] font-bold",
                              item.status === '健康' ? 'bg-emerald-100 text-emerald-700' : 
                              item.status === '风险' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                            )}>{item.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-black text-rose-500 text-xs">{item.profitMargin}</TableCell>
                          <TableCell className="text-right font-mono text-xs">{item.traffic}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 font-bold text-xs">
                              {item.cvr}
                              {item.trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-slate-600 text-xs">{item.sentiment}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="border-rose-100 text-rose-600 bg-rose-50/50 text-[9px]">{item.aiSummaryTag}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-40 text-center text-slate-400">
                          暂无符合筛选条件的诊断商品
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* 右侧：诊断详情直接在页面展示 */}
            <Card className="w-full lg:w-[400px] border-none shadow-sm flex flex-col overflow-hidden bg-white shrink-0">
              <CardContent className="p-6 h-full">
                <DiagnosisReport product={selectedDiagnosisProduct} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* 底部固定状态栏 */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-slate-900 text-slate-300 py-3 px-8 z-40 flex items-center justify-between text-[10px] shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> 数据更新时间：2026年6月10日 09:30</span>
            <span className="h-3 w-[1px] bg-slate-700" />
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-rose-400" /> AI 核心推荐置信度：98.4%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">厦门超算中心节点连接中</span>
          </div>
        </div>

      </div>

      <SelectionConfigSheet open={isConfigOpen} onOpenChange={setIsConfigOpen} />
    </DashboardLayout>
  );
};

export default SelectionEngine;