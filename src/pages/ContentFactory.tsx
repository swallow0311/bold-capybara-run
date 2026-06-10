import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Wand2, Sparkles, ShieldAlert, RefreshCw, 
  Copy, Check, FileText, Send, Eraser, 
  Palette, MessageSquare, Info
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 导入子配置组件
import ProductInputSection from '@/components/content-factory/ProductInputSection';
import ConfigSection from '@/components/content-factory/ConfigSection';
import AdvancedConfigSection from '@/components/content-factory/AdvancedConfigSection';

const ContentFactory = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  
  // 1. 商品基础数据状态
  const [productData, setProductData] = useState({
    name: '中达酵母御龄紧致面霜',
    category: '美容护肤 > 面霜/乳液',
    attrs: {
      material: '30%酵母多肽精粹',
      audience: '25-40岁轻熟敏感肌',
      scenario: '晚间深度修护',
      size: '50g/瓶'
    },
    sellingPoints: ['靶向淡纹', '深层锁水', '无敏配方']
  });

  // 2. 核心配置状态
  const [config, setConfig] = useState({
    type: 'title',
    platform: 'taobao',
    style: 'premium',
    focus: 'function',
    length: 'standard'
  });

  // 3. 高级配置状态
  const [advConfig, setAdvConfig] = useState({
    include: '',
    exclude: '',
    originality: 'mid',
    intensity: 'mid',
    compliance: true
  });

  const handleGenerate = () => {
    if (!config.type) {
      showError("请选择对应的文案生成类型");
      return;
    }

    setIsGenerating(true);
    setResults([]);

    // 模拟 AI 生成逻辑
    setTimeout(() => {
      const mockResults = [
        {
          tag: '【专业高级+突出功能】',
          content: `【${productData.name}】专为${productData.attrs.audience}研制。蕴含${productData.attrs.material}，直击肌底老化。${productData.sellingPoints[0]}，28天见证紧致奇迹。`
        },
        {
          tag: '【温柔种草+突出场景】',
          content: `熬夜党的救星来啦！✨ 睡前抹上这款${productData.name}，${productData.attrs.material}在夜间悄悄修护。${productData.sellingPoints[1]}，第二天醒来皮肤水润透亮，完全不紧绷。`
        },
        {
          tag: '【高转化营销+突出性价比】',
          content: `大牌同源成分！${productData.attrs.material}加持，价格却只要三分之一。${productData.sellingPoints[2]}，敏感肌也能放心冲。限时买一送一，错过等一年！`
        }
      ];
      setResults(mockResults);
      setIsGenerating(false);
      showSuccess("AI 已根据您的配置生成 3 组差异化商用文案。");
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("文案已成功复制到剪贴板。");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-4 relative text-left">
        
        {/* 顶部风控状态栏 */}
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <ShieldAlert className={cn("w-4 h-4", advConfig.compliance ? "text-emerald-500" : "text-amber-500")} />
            <span className={cn("font-bold text-sm", advConfig.compliance ? "text-emerald-600" : "text-amber-600")}>
              {advConfig.compliance ? "AI 营销风控安全锁已开启：自动拦截极限词" : "风控安全锁已关闭：请注意合规性"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-400">
              模型底座：中达美妆垂直大模型 v2.0
            </Badge>
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          
          {/* 左侧配置面板 (40%) */}
          <Card className="w-[450px] border-none shadow-sm flex flex-col overflow-hidden bg-white shrink-0">
            <CardHeader className="py-4 border-b border-slate-100 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-rose-400" />
                文案生成参数配置
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                <ProductInputSection data={productData} setData={setProductData} />
                <ConfigSection config={config} setConfig={setConfig} />
                <AdvancedConfigSection adv={advConfig} setAdv={setAdvConfig} />
              </div>
            </ScrollArea>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold h-11 rounded-xl shadow-lg shadow-rose-100"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    AI 正在深度构思中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    开始智能生成 (单次3组)
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* 右侧结果展示区 (60%) */}
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <Card className="flex-1 border-none shadow-sm flex flex-col overflow-hidden bg-white">
              <CardHeader className="py-4 border-b border-slate-100 shrink-0 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-400" />
                  AI 生成文案对比区
                </CardTitle>
                {results.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] text-slate-400" onClick={() => setResults([])}>
                    <Eraser className="w-3 h-3 mr-1" /> 清空结果
                  </Button>
                )}
              </CardHeader>
              
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {results.length > 0 ? (
                    results.map((res, idx) => (
                      <div key={idx} className="group relative animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                        <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-3 hover:border-rose-200 hover:bg-white transition-all shadow-sm hover:shadow-md">
                          <div className="flex justify-between items-center">
                            <Badge className="bg-rose-100 text-rose-700 border-none text-[10px] font-bold px-2 py-0.5">
                              版本 {String.fromCharCode(65 + idx)}：{res.tag}
                            </Badge>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-rose-500" onClick={() => handleCopy(res.content)}>
                                <Copy className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed font-mono whitespace-pre-wrap">
                            {res.content}
                          </p>
                          
                          {/* 二次编辑指令栏 */}
                          <div className="pt-3 border-t border-slate-100 flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-[10px] border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                              onClick={() => showSuccess("正在基于原意进行语句润色...")}
                            >
                              <Palette className="w-3 h-3 mr-1" /> 润色文案
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-[10px] border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                              onClick={() => showSuccess("正在保留卖点并切换至指定风格...")}
                            >
                              <RefreshCw className="w-3 h-3 mr-1" /> 换个风格
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-7 text-[10px] bg-slate-900 hover:bg-slate-800 text-white ml-auto"
                              onClick={() => showSuccess("文案已成功推送到商品详情页草稿箱")}
                            >
                              <Send className="w-3 h-3 mr-1" /> 一键应用
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-[500px] flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                        <MessageSquare className="w-10 h-10 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-500">暂无生成结果</p>
                        <p className="text-xs text-slate-400">请在左侧配置商品信息与文案偏好，点击“开始智能生成”</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>

            {/* 底部提示 */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 shrink-0">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-700 leading-relaxed">
                <strong>AI 生成提示：</strong> 每次生成将消耗 1 次算力配额。生成的文案已自动通过合规性初筛，但建议在正式发布前进行人工复核。
              </p>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContentFactory;