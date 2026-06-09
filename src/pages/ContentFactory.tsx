import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Copy, RefreshCw, Sparkles, 
  Wand2, CheckCircle2, AlertTriangle, LayoutList, 
  Sparkle, ShieldAlert, Check, ChevronsUpDown, Search
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const DEFAULT_FORBIDDEN_WORDS = ["第一", "最强", "根除", "顶级", "特效", "国家级"];

const PRODUCTS = [
  { value: "p1", label: "中达酵母御龄紧致面霜" },
  { value: "p2", label: "中达修护舒缓多肽精华液" },
  { value: "p3", label: "中达凝润修护水光唇蜜" },
];

const ContentFactory = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any[]>([
    {
      id: 1,
      title: '版本 A：专业科学种草',
      score: 95,
      content: '【敏感肌换季救星】中达修护舒缓多肽精华液真的绝了！里面添加了核心的多肽修护成分，能够快速建立皮肤屏障。很多姐妹担心上脸刺激，但它非常温和。用了一周，脸上的红血丝明显淡了，干燥脱皮都得到了极大改善，妥妥的国货之光！',
      advices: '建议搭配“防晒喷雾”进行联合营销组合，转化率可提升20%。'
    },
    {
      id: 2,
      title: '版本 B：夏日大促福利（含违禁词警告演示）',
      score: 72,
      content: '中达这款防晒绝对是全网最强的防晒喷雾！夏天出门喷一下，能够第一速度成膜，彻底根除紫外线伤害。大促期间买一送一，赶紧下单抢购！',
      advices: '包含广告法违禁极限词 “最强”、“第一”、“根除”。已自动在合规检测中标识，请点击修复。'
    }
  ]);

  // Form states
  const [open, setOpen] = useState(false);
  const [productValue, setProductValue] = useState("p1");
  const [scene, setScene] = useState('xhs');
  const [style, setStyle] = useState('感性种草');
  const [platform, setPlatform] = useState('xhs');
  const [lengthLimit, setLengthLimit] = useState(300);
  const [includeKeys, setIncludeKeys] = useState('补水, 舒缓, 敏感肌');
  const [excludeKeys, setExcludeKeys] = useState('特效, 根除');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog state
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedPoints, setExtractedPoints] = useState<string[]>([]);
  const [promoTags, setPromoTags] = useState<string[]>(['618', '双十一']);

  const handleExtractPoints = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setExtractedPoints([
        "30% 酵母多肽精粹：靶向抗老淡纹",
        "5重玻尿酸：瞬时补水，深层锁水",
        "无敏配方：专为敏感脆弱肌肤研发",
        "轻薄乳霜质地：不闷痘，夏日轻盈无负担"
      ]);
    }, 800);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResults([
        {
          id: 1,
          title: '生成版本 1：高转化带货风',
          score: 94,
          content: `【大促必入】中达酵母御龄紧致面霜来了！主打30%高浓度酵母多肽与玻尿酸配合，专为敏感肌淡纹研发。轻薄乳霜质地，夏日用也无负担。${promoTags.join(' & ')}期间限时直降，心动的姐妹快冲！`,
          advices: '文字流畅，卖点覆盖全面，合规检测通过率100%。'
        },
        {
          id: 2,
          title: '生成版本 2：深度成分测评',
          score: 91,
          content: '深度测评国货抗老面霜！中达这瓶面霜的核心是多肽与深层补水配方，摒弃了传统厚重质地，敏感肌换季抗衰首选。实测28天细纹改善明显，适合搭配短视频脚本分发。',
          advices: '科普度高，建议搭配成分分析图表发布以增强说服力。'
        }
      ]);
      setIsGenerating(false);
      showSuccess("AIGC 多版本文案批量生成成功！");
    }, 1200);
  };

  const highlightForbiddenWords = (text: string) => {
    let highlighted = text;
    DEFAULT_FORBIDDEN_WORDS.forEach(word => {
      const regex = new RegExp(word, 'g');
      highlighted = highlighted.replace(regex, `<span class="bg-red-100 text-red-600 px-1 rounded font-bold border border-red-200 decoration-wavy line-through">${word}</span>`);
    });
    return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("复制到剪贴板成功！");
  };

  const filteredProducts = PRODUCTS.filter(p => 
    p.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto text-left pb-12">
        
        {/* Top Compliance Info */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span className="font-bold text-slate-800">营销风控安全锁已开启</span>
            <span className="text-[10px] text-slate-400">自动拦截违法词，保障店铺合规上架</span>
          </div>
          <div className="ml-auto">
            <Button 
              onClick={handleExtractPoints} 
              variant="outline" 
              className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs h-8"
            >
              <Sparkle className="w-3.5 h-3.5 mr-1 text-rose-400" />
              卖点智能提取
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel (5 columns) - Params */}
          <Card className="lg:col-span-5 border-none shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-rose-400" />
                文案参数配置面板
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-4 text-xs text-slate-700">
              
              {/* Product Searchable Select */}
              <div className="space-y-1.5">
                <Label className="text-slate-500 font-semibold">选中商品素材</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-slate-50/50 border-slate-200 font-normal text-xs h-9"
                    >
                      {productValue
                        ? PRODUCTS.find((p) => p.value === productValue)?.label
                        : "搜索并选择商品..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
                    <div className="flex items-center gap-2 px-2 pb-2 border-b border-slate-100">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="搜索商品名称..."
                        className="w-full text-xs bg-transparent border-none outline-none py-1.5"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto pt-1 space-y-0.5">
                      {filteredProducts.length === 0 ? (
                        <div className="text-[11px] text-slate-400 text-center py-4">未找到相关商品</div>
                      ) : (
                        filteredProducts.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => {
                              setProductValue(p.value);
                              setOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-2 py-2 rounded-lg text-left text-xs transition-colors hover:bg-rose-50/50",
                              productValue === p.value ? "bg-rose-50 text-rose-700 font-bold" : "text-slate-600"
                            )}
                          >
                            <span>{p.label}</span>
                            {productValue === p.value && <Check className="w-3.5 h-3.5 text-rose-500" />}
                          </button>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Scene & Platform */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">文案创作场景</Label>
                  <Select value={scene} onValueChange={setScene}>
                    <SelectTrigger className="bg-slate-50/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xhs">小红书种草长文</SelectItem>
                      <SelectItem value="dy">短视频口播脚本</SelectItem>
                      <SelectItem value="live">直播间憋单话术</SelectItem>
                      <SelectItem value="detail">详情页卖点提炼</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">目标投放平台</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="bg-slate-50/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xhs">小红书 (XHS)</SelectItem>
                      <SelectItem value="dy">抖音电商 (DY)</SelectItem>
                      <SelectItem value="tb">淘宝直播 (TB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tone style selection */}
              <div className="space-y-1.5">
                <Label className="text-slate-500 font-semibold">文案语气风格</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['专业成分风', '感性种草', '大促促销', '幽默诙谐', '闺蜜种草', '高冷贵妇'].map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStyle(item)}
                      className={cn(
                        "py-1.5 px-1 border rounded-lg text-center font-medium transition-all",
                        style === item 
                          ? "bg-rose-50 border-rose-300 text-rose-700 shadow-sm"
                          : "bg-slate-50/40 border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Word Limit Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-500 font-semibold">期望输出字数</Label>
                  <span className="font-bold text-rose-500">{lengthLimit} 字</span>
                </div>
                <Slider 
                  value={[lengthLimit]} 
                  onValueChange={(val) => setLengthLimit(val[0])}
                  max={800} 
                  min={50}
                  step={50}
                />
              </div>

              {/* Advanced constraints */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold">强化关键词</Label>
                  <Input 
                    value={includeKeys}
                    onChange={(e) => setIncludeKeys(e.target.value)}
                    placeholder="例如：提亮, 熬夜救星" 
                    className="bg-slate-50/50 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-500 font-semibold text-rose-600">屏蔽关键词</Label>
                  <Input 
                    value={excludeKeys}
                    onChange={(e) => setExcludeKeys(e.target.value)}
                    placeholder="例如：第一, 全网最" 
                    className="bg-slate-50/50 text-xs"
                  />
                </div>
              </div>

              {/* Promotion Tags */}
              <div className="space-y-2 pt-2">
                <Label className="text-slate-500 font-semibold">融入大促氛围标签</Label>
                <div className="flex gap-4 flex-wrap">
                  {['618狂欢节', '双11嘉年华', '夏日防御季', '上新特惠'].map(tag => {
                    const isChecked = promoTags.includes(tag);
                    return (
                      <div key={tag} className="flex items-center gap-1.5 cursor-pointer" onClick={() => {
                        setPromoTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
                      }}>
                        <div className={cn(
                          "w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors",
                          isChecked ? "bg-rose-500 border-rose-500 text-white" : "border-slate-300 bg-white"
                        )}>
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="text-slate-600 font-medium select-none">{tag}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Run Trigger */}
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold h-10 rounded-xl mt-4 shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    开始智能生成
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right panel (7 columns) - Multi-version Output */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutList className="w-4 h-4 text-rose-400" />
                  <CardTitle className="text-sm font-bold text-slate-800">AI 生成文案对比区</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px]">
                  已就绪 {results.length} 版本
                </Badge>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {results.map((res) => {
                  const hasWarning = res.score < 80;
                  return (
                    <div key={res.id} className={cn(
                      "p-5 rounded-xl border transition-all space-y-3",
                      hasWarning 
                        ? "border-amber-200 bg-amber-50/20" 
                        : "border-slate-100 bg-slate-50/40 hover:border-rose-200"
                    )}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800">{res.title}</span>
                          <Badge className={cn(
                            "text-[10px] font-bold border-none",
                            res.score >= 90 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          )}>
                            得分 {res.score}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            onClick={() => handleCopy(res.content)}
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-[10px] text-slate-500 hover:text-rose-500"
                          >
                            <Copy className="w-3 h-3 mr-1" /> 复制
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-[10px] text-slate-500 hover:text-rose-500"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" /> 改写
                          </Button>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100 font-mono whitespace-pre-wrap">
                        {highlightForbiddenWords(res.content)}
                      </div>

                      <div className="flex items-start gap-2 text-[10px] bg-white p-2.5 rounded-lg border border-slate-100/60">
                        {hasWarning ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-0.5 text-left">
                          <span className="font-bold text-slate-700 block">AI 优化建议</span>
                          <span className="text-slate-500">{res.advices}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog: AI Smart Selling Points Extraction */}
      <Dialog open={isExtracting} onOpenChange={setIsExtracting}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <Sparkles className="w-5 h-5 text-rose-500" />
              AI 智能卖点提炼
            </DialogTitle>
            <DialogDescription className="text-left text-xs">
              基于该商品的备案数据及核心配方，提取出的最大卖点转化概率对比如下：
            </DialogDescription>
          </DialogHeader>

          {extractedPoints.length === 0 ? (
            <div className="py-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-rose-400" />
              <span className="text-xs">提取中...</span>
            </div>
          ) : (
            <div className="space-y-3 mt-2 text-xs text-left">
              {extractedPoints.map((point, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                  <span className="font-semibold text-slate-700">{point}</span>
                  <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-[9px] hover:bg-rose-100">
                    转化率 +28%
                  </Badge>
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setIsExtracting(false)} className="text-xs">取消</Button>
            <Button onClick={() => {
              setIsExtracting(false);
              showSuccess("已自动填充至文案主打卖点！");
            }} className="bg-rose-400 hover:bg-rose-500 text-white text-xs">填充至配置区</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ContentFactory;