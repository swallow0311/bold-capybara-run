import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Trash2, Save, Info, Upload, Image as ImageIcon,
  LayoutGrid, Table as TableIcon, ShieldCheck, Check
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 预设数据配置
const CATEGORIES_TREE = {
  skincare: {
    label: "美容护肤",
    sub: {
      lotion: {
        label: "面霜/乳液",
        child: ["抗老面霜", "保湿乳液", "修护面霜"]
      },
      serum: {
        label: "面部精华",
        child: ["多肽紧致精华", "舒缓修护补水", "美白淡斑精华"]
      }
    }
  },
  makeup: {
    label: "彩妆香氛",
    sub: {
      lip: {
        label: "唇部彩妆",
        child: ["哑光唇膏", "滋润唇蜜", "丝绒唇釉"]
      }
    }
  }
};

const BRANDS = ["中达美妆 (Chanda)", "雅诗兰黛", "兰蔻", "资生堂", "薇诺娜"];

// 模拟的商品已有数据，用于默认赋值
const MOCK_PRODUCTS_DB: Record<string, any> = {
  '1': {
    name: '中达酵母御龄紧致面霜 50g',
    brand: '中达美妆 (Chanda)',
    catL1: 'skincare',
    catL2: 'lotion',
    catL3: '抗老面霜',
    platform: 'Taobao',
    shopName: '中达美妆官方旗舰店',
    status: '出售中',
    sellPoint: '30% 酵母多肽精粹靶向淡纹，无敏配方，专为轻熟敏感肌肤定制。',
    mainImages: ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&auto=format&fit=crop&q=60"],
    detailImages: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=60"],
    specAttrs: [
      { name: '规格容量', values: ['经典紧致款 50g'] }
    ],
    skuList: [
      { specs: { '规格容量': '经典紧致款 50g' }, skuCode: 'SKU-99001-01', price: '299', stock: '1200', barcode: '6901234567890' }
    ],
    isFreeShipping: true,
    shippingTemplate: 'default',
    guarantees: ['7day', 'genuine']
  },
  '2': {
    name: '中达水漾隔离防晒乳 SPF50+',
    brand: '中达美妆 (Chanda)',
    catL1: 'skincare',
    catL2: 'lotion',
    catL3: '保湿乳液',
    platform: 'Douyin',
    shopName: '中达美妆抖音专营店',
    status: '出售中',
    sellPoint: '清爽防晒不闷痘，SPF50+强力隔离户外紫外线。',
    mainImages: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=60"],
    detailImages: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200&auto=format&fit=crop&q=60"],
    specAttrs: [
      { name: '规格容量', values: ['单支装 50ml'] }
    ],
    skuList: [
      { specs: { '规格容量': '单支装 50ml' }, skuCode: 'SKU-88120-01', price: '129', stock: '500', barcode: '6901234567882' }
    ],
    isFreeShipping: true,
    shippingTemplate: 'default',
    guarantees: ['7day', 'genuine']
  },
  '3': {
    name: '积雪草净化海泥面膜 100g',
    brand: '中达美妆 (Chanda)',
    catL1: 'skincare',
    catL2: 'lotion',
    catL3: '修护面霜',
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
    shippingTemplate: 'default',
    guarantees: ['7day', 'genuine']
  },
  '4': {
    name: '中达凝润修护水光唇蜜',
    brand: '中达美妆 (Chanda)',
    catL1: 'makeup',
    catL2: 'lip',
    catL3: '滋润唇蜜',
    platform: 'Taobao',
    shopName: '中达彩妆官方店',
    status: '出售中',
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
    shippingTemplate: 'default',
    guarantees: ['7day', 'genuine']
  }
};

interface SpecAttribute {
  name: string;
  values: string[];
}

interface SkuEntry {
  specs: Record<string, string>;
  skuCode: string;
  price: string;
  stock: string;
  barcode: string;
}

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 1. 获取已有数据并赋初值
  const initialData = useMemo(() => {
    if (id && MOCK_PRODUCTS_DB[id]) {
      return MOCK_PRODUCTS_DB[id];
    }
    return MOCK_PRODUCTS_DB['1']; // 降级默认
  }, [id]);

  // 基础信息状态
  const [name, setName] = useState(initialData.name);
  const [sellPoint, setSellPoint] = useState(initialData.sellPoint);
  const [brand, setBrand] = useState(initialData.brand);
  const [platform, setPlatform] = useState(initialData.platform);
  const [shopName, setShopName] = useState(initialData.shopName);
  const [status, setStatus] = useState(initialData.status);
  
  // 三级类目级联选择
  const [catL1, setCatL1] = useState<keyof typeof CATEGORIES_TREE | ''>(initialData.catL1);
  const [catL2, setCatL2] = useState<string>(initialData.catL2);
  const [catL3, setCatL3] = useState<string>(initialData.catL3);

  // 图片上传与排序管理状态
  const [mainImages, setMainImages] = useState<string[]>(initialData.mainImages);
  const [detailImages, setDetailImages] = useState<string[]>(initialData.detailImages);

  // SKU 与规格状态
  const [skuView, setSkuView] = useState<'table' | 'grid'>('table');
  const [specAttrs, setSpecAttrs] = useState<SpecAttribute[]>(initialData.specAttrs);
  const [customSpecName, setCustomSpecName] = useState('');
  const [customSpecValueInputs, setCustomSpecValueInputs] = useState<Record<number, string>>({});

  // 批量修改 SKU 用
  const [batchPrice, setBatchPrice] = useState('');
  const [batchStock, setBatchStock] = useState('');
  const [batchBarcode, setBatchBarcode] = useState('');

  // 物流与服务保障
  const [isFreeShipping, setIsFreeShipping] = useState(initialData.isFreeShipping);
  const [shippingTemplate, setShippingTemplate] = useState(initialData.shippingTemplate);
  const [guarantees, setGuarantees] = useState<string[]>(initialData.guarantees);

  // 动态生成 SPU 编码
  const spuCode = useMemo(() => {
    return `SPU-${brand ? brand.slice(0, 3).toUpperCase() : 'SKIN'}-${catL3 ? catL3.slice(0, 3).toUpperCase() : 'GEN'}`;
  }, [brand, catL3]);

  // 动态生成 Cartesian Product 笛卡尔积 SKU 清单
  const generatedSkus = useMemo(() => {
    if (specAttrs.length === 0) return [];
    
    const generateCombinations = (index: number, current: Record<string, string>): Record<string, string>[] => {
      if (index === specAttrs.length) return [current];
      const attr = specAttrs[index];
      let results: Record<string, string>[] = [];
      attr.values.forEach(val => {
        results = [...results, ...generateCombinations(index + 1, { ...current, [attr.name]: val })];
      });
      return results;
    };

    const combinations = generateCombinations(0, {});
    return combinations.map((combo, idx) => {
      return {
        specs: combo,
        skuCode: `SKU-${spuCode || 'PRODUCT'}-${idx + 1}`,
        price: '299',
        stock: '1000',
        barcode: `69012345678${idx}`
      };
    });
  }, [specAttrs, spuCode]);

  // 可编辑 SKU 绑定状态
  const [skuList, setSkuList] = useState<SkuEntry[]>(initialData.skuList);

  // 当属性变化时，生成新的SKU列表
  useEffect(() => {
    if (specAttrs !== initialData.specAttrs) {
      setSkuList(generatedSkus);
    }
  }, [specAttrs, generatedSkus, initialData.specAttrs]);

  // --- 操作函数 ---

  // 新增规格项属性
  const handleAddSpecAttr = () => {
    if (!customSpecName.trim()) {
      showError("请输入新规格属性名称！例如：颜色、尺寸");
      return;
    }
    if (specAttrs.some(a => a.name === customSpecName)) {
      showError("该规格属性已存在");
      return;
    }
    setSpecAttrs([...specAttrs, { name: customSpecName, values: [] }]);
    setCustomSpecName('');
    showSuccess("规格属性添加成功！");
  };

  // 添加单个属性的值
  const handleAddSpecValue = (index: number) => {
    const inputVal = customSpecValueInputs[index] || '';
    if (!inputVal.trim()) return;
    const updated = [...specAttrs];
    if (updated[index].values.includes(inputVal)) {
      showError("属性值已存在");
      return;
    }
    updated[index].values.push(inputVal);
    setSpecAttrs(updated);
    setCustomSpecValueInputs({ ...customSpecValueInputs, [index]: '' });
  };

  // 移除单个属性值
  const handleRemoveSpecValue = (attrIndex: number, valIndex: number) => {
    const updated = [...specAttrs];
    updated[attrIndex].values.splice(valIndex, 1);
    setSpecAttrs(updated);
  };

  // 移除一整类属性
  const handleRemoveSpecAttr = (index: number) => {
    setSpecAttrs(specAttrs.filter((_, i) => i !== index));
  };

  // 批量应用至所有 SKU
  const handleApplyBatchSku = () => {
    if (!batchPrice && !batchStock && !batchBarcode) {
      showError("请输入需要批量填充的内容");
      return;
    }
    setSkuList(prev => prev.map(sku => ({
      ...sku,
      price: batchPrice || sku.price,
      stock: batchStock || sku.stock,
      barcode: batchBarcode || sku.barcode
    })));
    showSuccess("批量应用成功！");
    setBatchPrice('');
    setBatchStock('');
    setBatchBarcode('');
  };

  // 修改单个 SKU 表单单元格
  const handleUpdateSkuCell = (index: number, field: keyof SkuEntry, value: string) => {
    const updated = [...skuList];
    updated[index] = { ...updated[index], [field]: value };
    setSkuList(updated);
  };

  // 批量模拟上传主图与详情图
  const handleUploadImages = (type: 'main' | 'detail') => {
    const isMain = type === 'main';
    const limit = isMain ? 5 : 20;
    const currentList = isMain ? mainImages : detailImages;

    if (currentList.length >= limit) {
      showError(`最多只能上传 ${limit} 张${isMain ? '主图' : '详情图'}`);
      return;
    }

    const mockUrls = [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200&auto=format&fit=crop&q=60"
    ];
    const newPic = mockUrls[Math.floor(Math.random() * mockUrls.length)];

    if (isMain) {
      setMainImages([...mainImages, newPic]);
    } else {
      setDetailImages([...detailImages, newPic]);
    }
    showSuccess(`已成功上传 1 张${isMain ? '主图' : '详情图'}`);
  };

  // 主图排序移动控制
  const handleMoveImage = (type: 'main' | 'detail', index: number, direction: 'left' | 'right') => {
    const isMain = type === 'main';
    const list = isMain ? [...mainImages] : [...detailImages];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    if (isMain) {
      setMainImages(list);
    } else {
      setDetailImages(list);
    }
  };

  // 设为主图控制
  const handleSetPrimary = (index: number) => {
    const list = [...mainImages];
    const primary = list.splice(index, 1)[0];
    list.unshift(primary);
    setMainImages(list);
    showSuccess("已将所选图片设为商品主图首图");
  };

  // 移除图片
  const handleRemoveImage = (type: 'main' | 'detail', index: number) => {
    if (type === 'main') {
      setMainImages(mainImages.filter((_, i) => i !== index));
    } else {
      setDetailImages(detailImages.filter((_, i) => i !== index));
    }
  };

  // 提交编辑更新 (上架)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showError("请输入商品名称！");
    if (!catL3) return showError("请完整选择商品的三级分类类目！");
    if (!brand) return showError("请选择商品所属品牌！");
    if (mainImages.length === 0) return showError("商品至少需要包含 1 张主图！");

    showSuccess(`商品「${name}」修改并上架存盘成功！`);
    navigate('/products');
  };

  // 存草稿
  const handleSaveDraft = () => {
    if (!name.trim()) return showError("请输入商品名称！");
    showSuccess(`商品「${name}」已存为草稿！`);
    navigate('/products');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-24 text-slate-800 text-xs text-left animate-in fade-in duration-300">
        
        {/* 1. 商品基本信息 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">1. 商品基本信息</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            
            {/* 三级级联分类选择 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-500 font-semibold">一级分类</Label>
                <Select value={catL1} onValueChange={(val: any) => { setCatL1(val); setCatL2(''); setCatL3(''); }}>
                  <SelectTrigger className="h-9 text-xs bg-slate-50/50">
                    <SelectValue placeholder="一级类目" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORIES_TREE).map(([key, item]) => (
                      <SelectItem key={key} value={key}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-500 font-semibold">二级分类</Label>
                <Select 
                  value={catL2} 
                  onValueChange={(val) => { setCatL2(val); setCatL3(''); }}
                  disabled={!catL1}
                >
                  <SelectTrigger className="h-9 text-xs bg-slate-50/50">
                    <SelectValue placeholder="二级类目" />
                  </SelectTrigger>
                  <SelectContent>
                    {catL1 && Object.entries(CATEGORIES_TREE[catL1].sub).map(([key, item]) => (
                      <SelectItem key={key} value={key}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-500 font-semibold">三级分类</Label>
                <Select 
                  value={catL3} 
                  onValueChange={(val) => setCatL3(val)}
                  disabled={!catL2}
                >
                  <SelectTrigger className="h-9 text-xs bg-slate-50/50">
                    <SelectValue placeholder="三级类目" />
                  </SelectTrigger>
                  <SelectContent>
                    {catL1 && catL2 && (CATEGORIES_TREE[catL1].sub as any)[catL2]?.child.map((val: string) => (
                      <SelectItem key={val} value={val}>{val}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 品牌与编码 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-500 font-semibold">所属品牌</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="h-9 text-xs bg-slate-50/50">
                    <SelectValue placeholder="选择合规品牌" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANDS.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-500 font-semibold">SPU 主编码</Label>
                <Input 
                  value={spuCode}
                  disabled
                  className="bg-slate-100 border-slate-200 text-xs h-9 font-mono"
                />
              </div>
            </div>

            {/* 目标平台、店铺名称、销售状态 */}
            <div className="grid grid-cols-3 gap-4">
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
                  placeholder="例：中达彩妆官方店"
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
            </div>

            {/* 商品标题 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-slate-500 font-semibold">商品标题</Label>
                <span className={cn(
                  "text-[10px] font-mono",
                  name.length > 60 ? "text-red-500 font-bold" : "text-slate-400"
                )}>
                  {name.length} / 60 字
                </span>
              </div>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 80))}
                placeholder="请输入商品标题"
                className="bg-slate-50/50 border-slate-200 text-xs h-9"
              />
            </div>

            {/* 卖点描述 */}
            <div className="space-y-1.5">
              <Label className="text-slate-500 font-semibold">核心营销卖点描述</Label>
              <textarea 
                value={sellPoint}
                onChange={(e) => setSellPoint(e.target.value)}
                placeholder="例：30% 酵母多肽精粹抗皱修护。"
                className="w-full text-xs text-slate-600 bg-slate-50/50 rounded-xl p-3 border border-slate-200 h-20 resize-none leading-relaxed" 
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. 商品图片上传 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">2. 商品图片上传与排序管理</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* 2.1 主图上传 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-slate-700 font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                  主图首图清单 (上限 5 张)
                </Label>
                <Button 
                  type="button" 
                  onClick={() => handleUploadImages('main')}
                  variant="outline" 
                  size="sm"
                  className="h-8 text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  <Upload className="w-3.5 h-3.5 mr-1" /> 上传主图 ({mainImages.length}/5)
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {mainImages.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col justify-between">
                    <img src={url} alt="main" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white font-bold text-[8px] px-1.5 py-0.5 rounded shadow">
                        首图
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                      <button 
                        type="button"
                        onClick={() => handleRemoveImage('main', idx)}
                        className="self-end text-rose-300 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="space-y-1">
                        {idx > 0 && (
                          <button 
                            type="button"
                            onClick={() => handleSetPrimary(idx)}
                            className="w-full bg-white/20 hover:bg-white/30 text-[9px] font-bold py-0.5 rounded"
                          >
                            设为首图
                          </button>
                        )}
                        <div className="flex gap-1">
                          <button 
                            type="button"
                            onClick={() => handleMoveImage('main', idx, 'left')}
                            disabled={idx === 0}
                            className="flex-1 bg-white/20 hover:bg-white/30 text-[8px] py-0.5 rounded disabled:opacity-30"
                          >
                            前移
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleMoveImage('main', idx, 'right')}
                            disabled={idx === mainImages.length - 1}
                            className="flex-1 bg-white/20 hover:bg-white/30 text-[8px] py-0.5 rounded disabled:opacity-30"
                          >
                            后移
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {mainImages.length < 5 && (
                  <button 
                    type="button"
                    onClick={() => handleUploadImages('main')}
                    className="aspect-square border-2 border-dashed border-slate-200 hover:border-rose-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-rose-500 bg-slate-50/50 transition-all"
                  >
                    <Plus className="w-6 h-6 mb-1" />
                    <span>添加主图</span>
                  </button>
                )}
              </div>
            </div>

            {/* 2.2 详情图上传 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-slate-700 font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  商品详情图清单 (上限 20 张)
                </Label>
                <Button 
                  type="button" 
                  onClick={() => handleUploadImages('detail')}
                  variant="outline" 
                  size="sm"
                  className="h-8 text-xs border-slate-200"
                >
                  <Upload className="w-3.5 h-3.5 mr-1" /> 上传详情图 ({detailImages.length}/20)
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {detailImages.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col justify-between">
                    <img src={url} alt="detail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                      <button 
                        type="button"
                        onClick={() => handleRemoveImage('detail', idx)}
                        className="self-end text-rose-300 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex gap-1 mt-auto">
                        <button 
                          type="button"
                          onClick={() => handleMoveImage('detail', idx, 'left')}
                          disabled={idx === 0}
                          className="flex-1 bg-white/20 hover:bg-white/30 text-[8px] py-0.5 rounded disabled:opacity-30"
                        >
                          前移
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleMoveImage('detail', idx, 'right')}
                          disabled={idx === detailImages.length - 1}
                          className="flex-1 bg-white/20 hover:bg-white/30 text-[8px] py-0.5 rounded disabled:opacity-30"
                        >
                          后移
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {detailImages.length < 20 && (
                  <button 
                    type="button"
                    onClick={() => handleUploadImages('detail')}
                    className="aspect-square border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-rose-500 bg-slate-50/50 transition-all"
                  >
                    <Plus className="w-6 h-6 mb-1" />
                    <span>添加详情图</span>
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. SKU 规格多属性 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-bold text-slate-800">3. SKU 规格多属性配置矩阵</CardTitle>
            <div className="flex bg-slate-100 p-0.5 rounded-lg">
              <button 
                type="button"
                onClick={() => setSkuView('table')}
                className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1",
                  skuView === 'table' ? "bg-white shadow text-rose-600" : "text-slate-500"
                )}
              >
                <TableIcon className="w-3 h-3" /> 表格视图
              </button>
              <button 
                type="button"
                onClick={() => setSkuView('grid')}
                className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1",
                  skuView === 'grid' ? "bg-white shadow text-rose-600" : "text-slate-500"
                )}
              >
                <LayoutGrid className="w-3 h-3" /> 网格视图
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={customSpecName}
                  onChange={(e) => setCustomSpecName(e.target.value)}
                  placeholder="新增规格属性，例：包装颜色、香型" 
                  className="h-8 text-xs flex-1 bg-slate-50"
                />
                <Button 
                  type="button" 
                  onClick={handleAddSpecAttr} 
                  size="sm" 
                  className="bg-slate-900 hover:bg-slate-800 text-white h-8 text-[11px]"
                >
                  新增规格属性组
                </Button>
              </div>

              <div className="space-y-3">
                {specAttrs.map((attr, attrIdx) => (
                  <div key={attrIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2 text-left">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 text-xs">{attr.name}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSpecAttr(attrIdx)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 items-center">
                      {attr.values.map((val, valIdx) => (
                        <Badge key={valIdx} className="bg-white text-slate-700 border border-slate-200 hover:bg-white text-[10px] gap-1 px-2 py-0.5">
                          {val}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSpecValue(attrIdx, valIdx)}
                            className="text-slate-400 hover:text-rose-500 text-[8px]"
                          >
                            ✕
                          </button>
                        </Badge>
                      ))}
                      
                      <div className="flex items-center gap-1">
                        <input 
                          value={customSpecValueInputs[attrIdx] || ''}
                          onChange={(e) => setCustomSpecValueInputs({
                            ...customSpecValueInputs,
                            [attrIdx]: e.target.value
                          })}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecValue(attrIdx))}
                          placeholder="回车确认"
                          className="w-20 h-6 text-[10px] bg-white border border-slate-200 rounded px-1.5 focus:outline-none"
                        />
                        <button 
                          type="button"
                          onClick={() => handleAddSpecValue(attrIdx)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {skuList.length > 0 && (
              <div className="p-3 bg-rose-50/30 rounded-xl border border-rose-100/50 flex items-center justify-between flex-wrap gap-3">
                <span className="font-bold text-rose-700 text-[10px]">批量设置控制台：</span>
                <div className="flex gap-2 flex-wrap items-center">
                  <Input value={batchPrice} onChange={(e) => setBatchPrice(e.target.value)} placeholder="售价" className="w-16 h-7 text-[10px] bg-white" />
                  <Input value={batchStock} onChange={(e) => setBatchStock(e.target.value)} placeholder="库存" className="w-16 h-7 text-[10px] bg-white" />
                  <Input value={batchBarcode} onChange={(e) => setBatchBarcode(e.target.value)} placeholder="国际码" className="w-24 h-7 text-[10px] bg-white" />
                  <Button type="button" onClick={handleApplyBatchSku} className="bg-rose-400 hover:bg-rose-500 text-white h-7 text-[10px] px-3">一键填充</Button>
                </div>
              </div>
            )}

            {skuList.length > 0 ? (
              skuView === 'table' ? (
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        {specAttrs.map(attr => (
                          <th key={attr.name} className="p-3 font-semibold text-[10px]">{attr.name}</th>
                        ))}
                        <th className="p-3 font-semibold text-[10px]">规格编码</th>
                        <th className="p-3 font-semibold text-[10px] text-right">售价 (元)</th>
                        <th className="p-3 font-semibold text-[10px] text-right">可用库存</th>
                        <th className="p-3 font-semibold text-[10px]">商品条码</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {skuList.map((sku, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/30">
                          {specAttrs.map(attr => (
                            <td key={attr.name} className="p-3 font-bold text-slate-700">{sku.specs[attr.name] || '-'}</td>
                          ))}
                          <td className="p-3 font-mono text-slate-500">{sku.skuCode}</td>
                          <td className="p-3 text-right">
                            <input 
                              value={sku.price}
                              onChange={(e) => handleUpdateSkuCell(idx, 'price', e.target.value)}
                              className="w-16 h-7 text-right bg-slate-50 border border-slate-200 rounded px-1.5 focus:bg-white"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <input 
                              value={sku.stock}
                              onChange={(e) => handleUpdateSkuCell(idx, 'stock', e.target.value)}
                              className="w-16 h-7 text-right bg-slate-50 border border-slate-200 rounded px-1.5 focus:bg-white"
                            />
                          </td>
                          <td className="p-3">
                            <input 
                              value={sku.barcode}
                              onChange={(e) => handleUpdateSkuCell(idx, 'barcode', e.target.value)}
                              className="w-32 h-7 bg-slate-50 border border-slate-200 rounded px-1.5 font-mono focus:bg-white"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skuList.map((sku, idx) => (
                    <div key={idx} className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 text-left space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 text-xs">
                            {Object.entries(sku.specs).map(([k, v]) => `${k}:${v}`).join(' / ')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block">{sku.skuCode}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[9px] text-slate-500">售价 (元)</Label>
                          <Input 
                            value={sku.price}
                            onChange={(e) => handleUpdateSkuCell(idx, 'price', e.target.value)}
                            className="h-7 text-[10px] bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] text-slate-500">库存</Label>
                          <Input 
                            value={sku.stock}
                            onChange={(e) => handleUpdateSkuCell(idx, 'stock', e.target.value)}
                            className="h-7 text-[10px] bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] text-slate-500">商品条码</Label>
                          <Input 
                            value={sku.barcode}
                            onChange={(e) => handleUpdateSkuCell(idx, 'barcode', e.target.value)}
                            className="h-7 text-[10px] bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                <Info className="w-8 h-8 mx-auto opacity-30 mb-2" />
                <span>请在上方设置规格属性值，系统将自动生成规格组合矩阵</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. 物流保障与运费模板 */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">4. 物流服务与服务保障</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-0.5 text-left">
                <span className="font-bold text-slate-700 block">全国包邮</span>
                <span className="text-[9px] text-slate-400">开启后商品全国（偏远地区除外）免费配送</span>
              </div>
              <Switch checked={isFreeShipping} onCheckedChange={setIsFreeShipping} />
            </div>

            {!isFreeShipping && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                <Label className="text-slate-500 font-semibold">选择运费模板</Label>
                <Select value={shippingTemplate} onValueChange={setShippingTemplate}>
                  <SelectTrigger className="bg-slate-50/50 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">默认运费模板 (满额包邮/首重¥10)</SelectItem>
                    <SelectItem value="sf">顺丰包邮/首重加价</SelectItem>
                    <SelectItem value="heavy">按重量累计收费模板</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="h-[1px] bg-slate-100 my-2" />

            <div className="space-y-2 text-left">
              <Label className="text-slate-500 font-semibold mb-1 block">服务保障勾选</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: '7day', label: '支持 7 天无理由退换货', desc: '买家可在收到商品起7天内发起无理由退换申请' },
                  { id: 'genuine', label: '100% 正品保障赔付', desc: '假一赔十，保障消费者正品权益心智' },
                  { id: 'ship24', label: '24 小时闪电发货', desc: '下单后24小时内确保物流揽收出库' },
                  { id: 'broken', label: '破损包退换/过敏包退', desc: '运输途中损坏或使用后过敏无条件全额退款' }
                ].map(srv => {
                  const isChecked = guarantees.includes(srv.id);
                  return (
                    <div 
                      key={srv.id} 
                      onClick={() => setGuarantees(prev => isChecked ? prev.filter(g => g !== srv.id) : [...prev, srv.id])}
                      className={cn(
                        "flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all",
                        isChecked ? "bg-rose-50/30 border-rose-200" : "bg-white border-slate-100"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-all",
                        isChecked ? "bg-rose-500 border-rose-500 text-white" : "border-slate-300"
                      )}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5 leading-snug">
                        <span className="font-bold text-slate-800 text-[11px] block">{srv.label}</span>
                        <span className="text-[9px] text-slate-400 leading-normal block">{srv.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100/50 flex items-start gap-2 text-left mt-2">
              <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-rose-700 leading-relaxed">
                AI 水印自动标记：新建的商品图片库会自动注入中达商户隐式合规防伪水印。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 底部悬浮操作栏 */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-40 flex justify-end gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <Button 
            type="button" 
            variant="outline" 
            className="text-xs h-9 px-5 border-slate-200 text-slate-600 hover:bg-slate-50"
            onClick={() => navigate('/products')}
          >
            取消
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            className="text-xs h-9 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700"
            onClick={handleSaveDraft}
          >
            保存草稿
          </Button>
          <Button 
            type="button" 
            className="bg-rose-400 hover:bg-rose-500 text-white font-bold text-xs h-9 px-6"
            onClick={handleSubmit}
          >
            保存并上架
          </Button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default EditProduct;