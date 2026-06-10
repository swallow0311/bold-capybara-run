XX。">
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Copy, RefreshCw, Sparkles, 
  Wand2, CheckCircle2, AlertTriangle, LayoutList, 
  Sparkle, Check, ChevronsUpDown, Search, Edit3, ShieldAlert
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const DEFAULT_FORBIDDEN_WORDS = ["第一", "最强", "根除", "顶级", "特效", "国家级"];

const PRODUCTS = [
  { value: "p1", label: "XX酵母御龄紧致面霜" },
  { value: "p2", label: "XX修护舒缓多肽精华液" },
  { value: "p3", label: "XX凝润修护水光唇蜜" },
];

const ContentFactory = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLockEnabled, setIsLockEnabled] = useState(true);

  // Results state
  const [results, setResults] = useState<any[]>([
    {
      id: 1,
      title: '版本 A：专业科学种草',
      score: 95,
      content: '【敏感肌换季救星】XX修护舒缓多肽精华液真的绝了！里面添加了核心的多肽修护成分，能够快速建立皮肤屏障。很多姐妹担心上脸刺激，但它非常温和。用了一周，脸上的红血丝明显淡了，干燥脱皮都得到了极大改善，妥妥的国货之光！',
      advices: '文字流畅，卖点覆盖全面，合规检测通过率100%。'
    },
    {
      id: 2,
      title: '版本 B：夏日大促福利（含违禁词警告演示）',
      score: 72,
      content: 'XX这款防晒绝对是全网最强的防晒喷雾！夏天出门喷一下，能够第一速度成膜，彻底根除紫外线伤害。大促期间买一送一，赶紧下单抢购！',
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
  
  // Edit states for AI results
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Dialog state
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedPoints, setExtractedPoints] = useState<string[]>([]);
  const [promoTags, setPromoTags] = useState<string[]>(['618', '双十一']);

  // Dynamic evaluation function
  const evaluateText = (text: string, lockEnabled: boolean) => {
    let score = 95;
    let advices = "文字流畅，卖点覆盖全面，合规检测通过率100%。";
    
    const foundWords = DEFAULT_FORBIDDEN_WORDS.filter(word => text.includes(word));
    if (foundWords.length > 0) {
      if (lockEnabled) {
        score = Math.max(50, 95 - foundWords.length * 15);
        advices = `包含高危违禁极限词: ${foundWords.join('、')}。已开启风控，将在上架前自动拦截/平替。`;
      } else {
        score = Math.max(40, 90 - foundWords.length * 20);
        advices = `警报！检测到违禁词: ${foundWords.join('、')}，当前风控锁未开启，可能存在广告法违规处罚风险！`;
      }
    } else {
      if (text.length < 80) {
        score -= 10;
        advices = "生成内容偏短，建议补充更多细节场景化词汇。";
      } else if (text.length > 500) {
        score -= 5;
        advices = "篇幅适中但稍微偏长，建议提炼核心卖点，方便用户快速阅读。";
      }
    }
    return { score, advices };
  };

  // Re-evaluate list whenever safety lock toggles
  useEffect(() => {
    setResults(prev => prev.map(item => {
      const { score, advices } = evaluateText(item.content, isLockEnabled);
      return {
        ...item,
        score,
        advices
      };
    }));
  }, [isLockEnabled]);

  const handleStartEdit = (id: number, content: string) => {
    setEditingId(id);
    setEditingText(content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleSaveEdit = (id: number) => {
    const { score, advices } = evaluateText(editingText, isLockEnabled);
    setResults(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          content: editingText,
          score,
          advices
        };
      }
      return item;
    }));
    setEditingId(null);
    setEditingText('');
    showSuccess("修改已保存，优化建议已重新评估！");
  };

  const handleExtractPoints = () => {
    setIsExtracting(true);
    setExtractedPoints([]);
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
      const v1Content = `【大促必入】XX酵母御龄紧致面霜来了！主打30%高浓度酵母多肽与玻尿酸配合，专为敏感肌淡纹研发。轻薄乳霜质地，夏日用也无负担。${promoTags.join(' & ')}期间限时直降，心动的姐妹快冲！`;
      const v2Content = `深度测评国货抗老面霜！XX这瓶面霜的核心是多肽与深层补水配方，极其温和，敏感肌换季抗衰首选。实测28天细纹改善明显。`;
      
      const v1Eval = evaluateText(v1Content, isLockEnabled);
      const v2Eval = evaluateText(v2Content, isLockEnabled);

      setResults([
        {
          id: 1,
          title: '生成版本 1：高转化带货风',
          score: v1Eval.score,
          content: v1Content,
          advices: v1Eval.advices
        },
        {
          id: 2,
          title: '生成版本 2：深度成分测评',
          score: v2Eval.score,
          content: v2Content,
          advices: v2Eval.advices
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

  const handleCopyAllPoints = () => {
    const allText = extractedPoints.join('\n');
    navigator.clipboard.writeText(allText);
    showSuccess("所有卖点已一键复制！");
  };

  const filteredProducts = PRODUCTS.filter(p => 
    p.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto text-left pb-12">
        
        {/* Top Compliance Info Bar */}
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs">
            <ShieldAlert className={cn("w-4 h-4", isLockEnabled ? "text-emerald-500" : "text-red-500")} />
            <span className={cn("font-bold text-sm", isLockEnabled ? "text-emerald-600" : "text-red-600")}>
              {isLockEnabled ? "营销风控安全锁已开启" : "营销风控安全锁已关闭"}
            </span>
            <span className={cn("text-[11px] ml-1 hidden md:inline-block", isLockEnabled ? "text-emerald-500" : "text-red-500")}>
              {isLockEnabled ? "自动拦截违法词，保障店铺合规上架" : "未开启违法词过滤，可能会导致违规风险"}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              <span>开关风控：</span>
              <button 
                type="button"
                onClick={() => {
                  setIsLockEnabled(!isLockEnabled);
                  showSuccess(isLockEnabled ? "已关闭风控安全锁" : "已开启风控安全锁");
                }}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  isLockEnabled ? "bg-emerald-500" : "bg-red-500"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    isLockEnabled ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>
            
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

              {/* Scene - Single Line */}
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

              {/* Platform - Single Line */}
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

              {/* Include Keys - Single Line */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-500 font-semibold">强化关键词</Label>
                  <span className="text-[10px] text-slate-400">（多个值用“,”隔开）</span>
                </div>
                <Input 
                  value={includeKeys}
                  onChange={(e) => setIncludeKeys(e.target.value)}
                  placeholder="例如：提亮, 熬夜救星" 
                  className="bg-slate-50/50 text-xs"
                />
              </div>

              {/* Exclude Keys - Single Line */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-500 font-semibold text-rose-600">屏蔽关键词</Label>
                  <span className="text-[10px] text-slate-400">（多个值用“,”隔开）</span>
                </div>
                <Input 
                  value={excludeKeys}
                  onChange={(e) => setExcludeKeys(e.target.value)}
                  placeholder="例如：第一, 全网最" 
                  className="bg-slate-50/50 text-xs"
                />
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
                  const isEditing = editingId === res.id;
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
                            onClick={() => handleStartEdit(res.id, res.content)}
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-[10px] text-slate-500 hover:text-rose-500"
                          >
                            <Edit3 className="w-3 h-3 mr-1" /> 编辑
                          </Button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full text-xs text-slate-600 bg-white border border-rose-300 rounded-xl p-3 h-32 leading-relaxed focus-visible:ring-rose-400"
                          />
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-[10px]"
                              onClick={handleCancelEdit}
                            >
                              取消
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-7 text-[10px] bg-rose-400 hover:bg-rose-500 text-white rounded-lg"
                              onClick={() => handleSaveEdit(res.id)}
                            >
                              保存
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100 font-mono whitespace-pre-wrap">
                          {highlightForbiddenWords(res.content)}
                        </div>
                      )}

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
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between group">
                  <span className="font-semibold text-slate-700 flex-1">{point}</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-[9px] hover:bg-rose-100">
                      转化率 +28%
                    </Badge>
                    <button 
                      onClick={() => handleCopy(point)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="复制此卖点"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="mt-4 flex items-center justify-between sm:justify-between w-full">
            <button 
              onClick={handleCopyAllPoints}
              disabled={extractedPoints.length === 0}
              className="text-rose-500 hover:text-rose-600 text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <Copy className="w-3.5 h-3.5" />
              一键复制
            </button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsExtracting(false)} className="text-xs">取消</Button>
              <Button onClick={() => {
                setIsExtracting(false);
                showSuccess("已自动填充至文案主打卖点！");
              }} className="bg-rose-400 hover:bg-rose-500 text-white text-xs">填充至配置区</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ContentFactory;