import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShieldCheck, Database, Sliders, Filter, Zap, 
  Play, Code, AlertCircle, CheckCircle2, RefreshCw,
  Plus, Trash2, Info, Lock, Unlock, Settings2, ArrowRight
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface ApiConfigSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  api?: any;
  isAdmin: boolean;
}

const ApiConfigSheet = ({ open, onOpenChange, api, isAdmin }: ApiConfigSheetProps) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);

  const handleTest = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        status: 'success',
        latency: '124ms',
        data: {
          code: 200,
          message: "success",
          data: {
            items: [
              { spu_id: "SPU123", sales_30d: 4500, price: 299.00, rating: 4.8 },
              { spu_id: "SPU456", sales_30d: 1200, price: 159.00, rating: 4.5 }
            ]
          }
        }
      });
      showSuccess("接口连通性检测成功！已获取原始 JSON 预览。");
    }, 1500);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[1000px] p-0 flex flex-col">
        <div className="flex h-full">
          
          {/* 左侧配置区 (60%) */}
          <div className="flex-1 flex flex-col border-r border-slate-100">
            <SheetHeader className="p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-rose-500" />
                <SheetTitle>{api ? '编辑接口配置' : '新增 API 接口连接'}</SheetTitle>
              </div>
              <SheetDescription>配置接口鉴权、拉取范围及限流规则。标识符将用于 AI 选品模型识别。</SheetDescription>
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="p-6">
                <Tabs defaultValue="basic" className="space-y-6">
                  <TabsList className="bg-slate-100/50 p-1 w-full justify-start">
                    <TabsTrigger value="basic" className="text-xs gap-2"><ShieldCheck className="w-3.5 h-3.5" />基础鉴权</TabsTrigger>
                    <TabsTrigger value="data" className="text-xs gap-2"><Database className="w-3.5 h-3.5" />数据范围</TabsTrigger>
                    <TabsTrigger value="schedule" className="text-xs gap-2"><Sliders className="w-3.5 h-3.5" />限流调度</TabsTrigger>
                    <TabsTrigger value="filter" className="text-xs gap-2"><Filter className="w-3.5 h-3.5" />数据过滤</TabsTrigger>
                  </TabsList>

                  {/* 3.1 基础鉴权配置 */}
                  <TabsContent value="basic" className="space-y-5 text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">接口名称</Label>
                        <Input placeholder="例如：淘宝旗舰店评价拉取" className="h-9 text-xs" defaultValue={api?.name} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">接口标识 (唯一编码)</Label>
                        <Input placeholder="例如：TB_REVIEW_PULL" className="h-9 text-xs font-mono" defaultValue={api?.id} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">接口请求地址 (Endpoint)</Label>
                      <div className="flex gap-2">
                        <Select defaultValue="GET">
                          <SelectTrigger className="w-[100px] h-9 text-xs bg-slate-50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="https://api.taobao.com/router/rest" className="h-9 text-xs flex-1" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">鉴权模式</Label>
                      <Select defaultValue="appkey">
                        <SelectTrigger className="h-9 text-xs bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appkey">AppKey + AppSecret</SelectItem>
                          <SelectItem value="token">Token 令牌</SelectItem>
                          <SelectItem value="cookie">账号 Cookie</SelectItem>
                          <SelectItem value="oauth">OAuth 2.0 授权</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] text-slate-500">AppKey / Client ID</Label>
                        <Input defaultValue="8842189902" className="h-8 text-xs bg-white" disabled={!isAdmin} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label className="text-[11px] text-slate-500">AppSecret / Secret Key</Label>
                          <button onClick={() => setShowSecret(!showSecret)} className="text-[10px] text-rose-500 font-bold">
                            {showSecret ? '隐藏密钥' : '查看明文'}
                          </button>
                        </div>
                        <div className="relative">
                          <Input 
                            type={showSecret ? 'text' : 'password'} 
                            defaultValue="sk_live_51MzXxxxxxxxxxxxx" 
                            className="h-8 text-xs bg-white pr-8" 
                            disabled={!isAdmin}
                          />
                          {!isAdmin && <Lock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-slate-700">自定义请求头 (Headers)</Label>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-rose-500" onClick={() => setHeaders([...headers, { key: '', value: '' }])}>
                          <Plus className="w-3 h-3 mr-1" /> 添加 Header
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {headers.map((h, i) => (
                          <div key={i} className="flex gap-2">
                            <Input placeholder="Key" className="h-8 text-xs flex-1" defaultValue={h.key} />
                            <Input placeholder="Value" className="h-8 text-xs flex-1" defaultValue={h.value} />
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-300 hover:text-rose-500" onClick={() => setHeaders(headers.filter((_, idx) => idx !== i))}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* 3.2 数据范围配置 */}
                  <TabsContent value="data" className="space-y-5 text-left">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">绑定店铺 / 商家 ID</Label>
                      <Select defaultValue="multi">
                        <SelectTrigger className="h-9 text-xs bg-slate-50">
                          <SelectValue placeholder="选择店铺" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multi">批量多选 (已选 2 个店铺)</SelectItem>
                          <SelectItem value="official">中达美妆官方旗舰店</SelectItem>
                          <SelectItem value="douyin">中达抖音专营店</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-slate-700">数据拉取维度开关</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: '商品基础 SPU/SKU', key: 'base' },
                          { label: '近 30 天销量', key: 'sales' },
                          { label: '访客流量', key: 'traffic' },
                          { label: '搜索关键词', key: 'keywords' },
                          { label: '竞品价格', key: 'competitor' },
                          { label: '用户评价', key: 'reviews' },
                          { label: '类目大盘热度', key: 'market' }
                        ].map(dim => (
                          <div key={dim.key} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[11px] font-medium text-slate-600">{dim.label}</span>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">拉取周期配置</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger className="h-9 text-xs bg-slate-50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">实时轮询 (每 5 分钟)</SelectItem>
                            <SelectItem value="daily">每日定时拉取 (凌晨 02:00)</SelectItem>
                            <SelectItem value="manual">手动触发</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">数据存储时效</Label>
                        <Select defaultValue="30d">
                          <SelectTrigger className="h-9 text-xs bg-slate-50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7d">7 天</SelectItem>
                            <SelectItem value="30d">30 天</SelectItem>
                            <SelectItem value="forever">永久存储</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 3.3 限流与调度 */}
                  <TabsContent value="schedule" className="space-y-5 text-left">
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-700 leading-relaxed">
                        请严格遵守平台 QPS 限制。调用超限可能导致 AppKey 被封禁或商户账号降权。
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">接口 QPS 限流阈值</Label>
                        <div className="flex items-center gap-2">
                          <Input type="number" defaultValue="20" className="h-9 text-xs" />
                          <span className="text-[10px] text-slate-400 shrink-0">次/秒</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">单次最大拉取数量</Label>
                        <Input type="number" defaultValue="1000" className="h-9 text-xs" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">失败重试次数</Label>
                        <Select defaultValue="3">
                          <SelectTrigger className="h-9 text-xs bg-slate-50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">不重试</SelectItem>
                            <SelectItem value="1">1 次</SelectItem>
                            <SelectItem value="3">3 次</SelectItem>
                            <SelectItem value="5">5 次</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">重试间隔 (秒)</Label>
                        <Input type="number" defaultValue="30" className="h-9 text-xs" />
                      </div>
                    </div>
                  </TabsContent>

                  {/* 3.4 数据过滤 */}
                  <TabsContent value="filter" className="space-y-5 text-left">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">白名单类目设置</Label>
                      <Input placeholder="输入允许拉取的类目 ID，用逗号隔开" className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">黑名单类目设置</Label>
                      <Input placeholder="输入禁止拉取的类目 ID，用逗号隔开" className="h-9 text-xs" />
                    </div>

                    <div className="space-y-3 pt-2">
                      {[
                        { label: '过滤低销量商品 (月销 < 10)', key: 'low_sales' },
                        { label: '自动剔除已下架商品', key: 'offline' },
                        { label: '过滤违规/风险商品', key: 'illegal' },
                        { label: '自动清洗重复商品数据', key: 'dedupe' }
                      ].map(f => (
                        <div key={f.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-xs font-medium text-slate-700">{f.label}</span>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>取消</Button>
              <Button className="bg-rose-400 hover:bg-rose-500 text-white h-9 px-6 text-xs font-bold rounded-xl">
                保存接口配置
              </Button>
            </div>
          </div>

          {/* 右侧调试面板 (40%) */}
          <div className="w-[400px] bg-slate-50/50 flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-sm text-slate-800">接口实时调试面板</span>
                </div>
                <Button 
                  onClick={handleTest} 
                  disabled={isTesting}
                  size="sm" 
                  className="h-8 text-[10px] bg-slate-900 hover:bg-slate-800 text-white rounded-lg"
                >
                  {isTesting ? <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" /> : <Play className="w-3 h-3 mr-1.5" />}
                  一键连通检测
                </Button>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-slate-400 uppercase">模拟请求入参 (JSON)</Label>
                <textarea 
                  className="w-full h-24 bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] focus:outline-none"
                  defaultValue={`{\n  "method": "taobao.item.get",\n  "num_iid": "6543210",\n  "fields": "title,price,sales"\n}`}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {/* 原始返回预览 */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">原始返回 JSON 预览</Label>
                  {testResult ? (
                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-slate-300 overflow-x-auto">
                      <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
                    </div>
                  ) : (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Code className="w-6 h-6 opacity-20" />
                      <span className="text-[10px]">暂无调试数据，请点击上方检测</span>
                    </div>
                  )}
                </div>

                {/* 字段映射配置 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase">数据字段映射配置</Label>
                    <Info className="w-3 h-3 text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: '销量 (Sales)', standard: 'sales_30d', source: 'sales_30d' },
                      { label: '价格 (Price)', standard: 'price', source: 'price' },
                      { label: '评价数 (Reviews)', standard: 'review_count', source: 'rating_count' },
                      { label: '好评率 (Rate)', standard: 'good_rate', source: 'positive_rate' }
                    ].map(map => (
                      <div key={map.standard} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 w-24">{map.label}</span>
                        <ArrowRight className="w-3 h-3 text-slate-300" />
                        <Input defaultValue={map.source} className="h-7 text-[10px] flex-1 bg-slate-50 border-none" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 错误日志实时展示 */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">错误日志实时展示</Label>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg flex gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-rose-700 block">调用超时 (Timeout)</span>
                        <span className="text-[9px] text-rose-600/70">2026-05-20 14:20:05 | 网关响应超过 15s</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg flex gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-amber-700 block">接口限流 (Rate Limit)</span>
                        <span className="text-[9px] text-amber-600/70">2026-05-20 12:00:12 | 触发 QPS 阈值限制</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ApiConfigSheet;