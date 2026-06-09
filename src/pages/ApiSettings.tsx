import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Link2, RefreshCw, Key, Database, Play, Info, AlertTriangle, CheckCircle2,
  Trash2, ShieldCheck, Settings, Server, Plus, Code, Download
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface ApiConfig {
  id: string;
  name: string;
  type: '店铺数据接口' | '电商开放 API' | '第三方大盘接口';
  platform: 'Taobao' | 'JD' | 'Douyin' | 'Pinduoduo' | '1688';
  appKey: string;
  status: '正常' | '异常' | '限流';
  lastSync: string;
  autoSync: boolean;
}

const INITIAL_APIS: ApiConfig[] = [
  { id: '1', name: '淘宝旗舰店 API 客户端', type: '电商开放 API', platform: 'Taobao', appKey: 'tb_app_key_884218', status: '正常', lastSync: '10分钟前', autoSync: true },
  { id: '2', name: '抖店自营账号数据拉取', type: '店铺数据接口', platform: 'Douyin', appKey: 'dy_merchant_662098', status: '正常', lastSync: '1小时前', autoSync: true },
  { id: '3', name: '美妆大盘竞品监控指数', type: '第三方大盘接口', platform: 'JD', appKey: 'jd_market_550011', status: '限流', lastSync: '昨天', autoSync: false },
  { id: '4', name: '1688批发商大宗采购映射', type: '电商开放 API', platform: '1688', appKey: 'ali_1688_229987', status: '异常', lastSync: '3天前', autoSync: true }
];

const MOCK_LOGS = [
  { time: '12:00:05', api: '淘宝旗舰店 API', status: 'SUCCESS', details: '拉取 SPU-LIP-99001 规格评价 45 条，已自动清洗多余空白符并入库' },
  { time: '11:45:10', api: '美妆大盘竞品监控', status: 'RATE_LIMIT', details: '警告：大盘指数调用频率超出商户配额限制，已启动第 2 次指数退避重试 (30s)' },
  { time: '11:30:22', api: '1688批发商接口', status: 'EXPIRED_KEY', details: '致命错误：AppSecret 签名鉴权校验失败，已被网关阻断。密钥已过期！' },
  { time: '11:00:15', api: '抖店自营账号数据', status: 'SUCCESS', details: '数据清洗规则过滤成功，拦截并剔除水军及缺货 SKU 共 3 件' }
];

const ApiSettings = () => {
  const [apis, setApis] = useState<ApiConfig[]>(INITIAL_APIS);
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [isTesting, setIsTesting] = useState<string | null>(null);

  const testConnection = (id: string) => {
    setIsTesting(id);
    showSuccess("发起安全沙箱鉴权连接握手检测...");
    setTimeout(() => {
      setIsTesting(null);
      const api = apis.find(a => a.id === id);
      if (api?.platform === '1688') {
        showError("连接握手失败！检测到 Secret 签名不匹配或密钥到期，请重新上传鉴权配置。");
        setApis(prev => prev.map(a => a.id === id ? { ...a, status: '异常' } : a));
      } else if (api?.platform === 'JD') {
        showSuccess("测试成功，但该网关被上游降级限制，建议限流设置 5次/秒。");
        setApis(prev => prev.map(a => a.id === id ? { ...a, status: '限流' } : a));
      } else {
        showSuccess("接口连通性握手测试 SUCCESS：已成功拉取测试 SKU 返回帧，时延 120ms。");
        setApis(prev => prev.map(a => a.id === id ? { ...a, status: '正常' } : a));
      }
    }, 1200);
  };

  const handleToggleAutoSync = (id: string, value: boolean) => {
    setApis(prev => prev.map(a => a.id === id ? { ...a, autoSync: value } : a));
    showSuccess(value ? "定时批量拉取任务已挂载系统 Cron" : "已挂起该定时轮询任务");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-800 text-xs text-left">
        
        {/* API 头部 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">数据开放 API 鉴权管理</h1>
            <p className="text-slate-500 text-xs mt-0.5">配置第三方电商店铺、数据服务商接口凭证与清洗映射规则</p>
          </div>
          <Button onClick={() => showSuccess("正在开启 API 接入安全引导向导...")} className="bg-rose-400 hover:bg-rose-500 text-white text-xs h-9">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            新增 API 接口连接
          </Button>
        </div>

        {/* 接口管理列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="py-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Server className="w-4 h-4 text-rose-400" />
                  API 开放接口鉴权通道配置
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/60">
                    <TableRow>
                      <TableHead className="text-xs">通道名称</TableHead>
                      <TableHead className="text-xs">类别/类型</TableHead>
                      <TableHead className="text-xs">APP KEY</TableHead>
                      <TableHead className="text-xs">同步时间</TableHead>
                      <TableHead className="text-xs text-center">定时轮询</TableHead>
                      <TableHead className="text-xs text-center">状态</TableHead>
                      <TableHead className="text-xs text-right w-[180px]">测试/操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apis.map(api => (
                      <TableRow key={api.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-bold text-slate-700">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-bold uppercase">
                              {api.platform}
                            </span>
                            <span>{api.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[9px]">{api.type}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-slate-400">{api.appKey}</TableCell>
                        <TableCell className="text-slate-500 font-semibold">{api.lastSync}</TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={api.autoSync} 
                            onCheckedChange={(checked) => handleToggleAutoSync(api.id, checked)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(
                            "border-none text-[9px] font-bold",
                            api.status === '正常' && 'bg-emerald-100 text-emerald-700',
                            api.status === '限流' && 'bg-amber-100 text-amber-700',
                            api.status === '异常' && 'bg-rose-100 text-rose-700',
                          )}>
                            {api.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => testConnection(api.id)}
                              disabled={isTesting === api.id}
                              className="h-7 text-[10px] border-slate-200"
                            >
                              {isTesting === api.id ? "握手中..." : "连通测试"}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => showSuccess("接口字段自动映射模版已加载")}
                              className="h-7 text-[10px] text-slate-500 hover:text-rose-500"
                            >
                              <Code className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 实时的抓取接口执行日志 */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="py-4 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Database className="w-4 h-4 text-rose-400" />
                  接口拉取及过滤清洗执行日志
                </CardTitle>
                <Badge variant="outline" className="text-[10px] text-slate-500">自动滚动日志</Badge>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[220px]">
                  <div className="space-y-2.5 font-mono text-[11px] text-slate-600">
                    {logs.map((log, index) => (
                      <div key={index} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2.5">
                        <span className="text-slate-400 shrink-0 font-semibold">{log.time}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-slate-800">{log.api}</span>
                            <Badge className={cn(
                              "text-[8px] px-1 py-0 border-none font-bold",
                              log.status === 'SUCCESS' && 'bg-emerald-100 text-emerald-700',
                              log.status === 'RATE_LIMIT' && 'bg-amber-100 text-amber-700',
                              log.status === 'EXPIRED_KEY' && 'bg-rose-100 text-rose-700',
                            )}>
                              {log.status}
                            </Badge>
                          </div>
                          <p className="text-slate-500 leading-normal">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            
            {/* 全局字段映射规则 */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-rose-400" />
                  全局接口清洗及字段映射设置
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="space-y-0.5 max-w-[200px]">
                    <span className="font-bold text-slate-700 block">自动清洗无效评价</span>
                    <span className="text-[10px] text-slate-400">拉取时自动拦截并丢弃字符长度低于3的空置评论。</span>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="space-y-0.5 max-w-[200px]">
                    <span className="font-bold text-slate-700 block">字段名同义映射</span>
                    <span className="text-[10px] text-slate-400">将淘宝 `spu_name` 与京东 `title` 映射为统一 `name` 字段。</span>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="space-y-0.5 max-w-[200px]">
                    <span className="font-bold text-slate-700 block">限流指数避退重试</span>
                    <span className="text-[10px] text-slate-400">遇到上游并发限流（HTTP 429）自动退避重试3次。</span>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100 flex items-start gap-2 text-rose-700 leading-normal">
                  <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-[10px]">
                    大盘联动：在此拉取清洗入库的数据，将会以标准 SPU 主档形式自动同步供给到<strong>AI选品</strong>、与<strong>评价NLP分析</strong>功能中。
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 限流和重试规则 */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-700">接口性能限制阀门</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <Label className="text-slate-500 font-semibold">请求频率限制 (请求数/秒)</Label>
                  <Input type="number" defaultValue="20" className="h-8 text-xs bg-slate-50/50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-500 font-semibold">连接超时阈值 (秒)</Label>
                  <Input type="number" defaultValue="15" className="h-8 text-xs bg-slate-50/50" />
                </div>
                <Button onClick={() => showSuccess("接口限流及重试参数成功锁定。")} className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold h-9 mt-2">
                  应用限流与重试阀值
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default ApiSettings;