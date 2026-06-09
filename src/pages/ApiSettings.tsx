import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Link2, RefreshCw, Plus, Search, Filter, Download, 
  Play, ShieldCheck, AlertTriangle, Settings2, 
  Trash2, Eye, FileSpreadsheet, Database, Server,
  Store, Globe, BarChart3, Zap, Info
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";
import ApiConfigSheet from '@/components/api-settings/ApiConfigSheet';
import LogDetailSheet from '@/components/api-settings/LogDetailSheet';

// 模拟接口数据
const INITIAL_APIS = [
  { id: 'API-001', name: '淘宝旗舰店商品评价接口', type: '店铺自有 API', channel: '淘宝开放平台', shop: '中达美妆官方店', status: '正常', lastSync: '10分钟前', updateCount: 1240, platform: 'Taobao' },
  { id: 'API-002', name: '京东竞品价格监控', type: '第三方数据接口', channel: '京东商家开放', shop: '全店通用', status: '待授权', lastSync: '1小时前', updateCount: 0, platform: 'JD' },
  { id: 'API-003', name: '抖音直播间实时流量', type: '店铺自有 API', channel: '抖音开放平台', shop: '中达抖音专营店', status: '正常', lastSync: '5分钟前', updateCount: 8500, platform: 'Douyin' },
  { id: 'API-004', name: '1688大宗采购价格映射', type: '平台开放 API', channel: '1688开放接口', shop: '采购部专用', status: '失效', lastSync: '3天前', updateCount: 0, platform: '1688' },
  { id: 'API-005', name: '全网美妆类目热度指数', type: '第三方数据接口', channel: '市场大盘数据', shop: '全店通用', status: '正常', lastSync: '昨天', updateCount: 450, platform: 'Market' },
];

const ApiSettings = () => {
  const [apis, setApis] = useState(INITIAL_APIS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [editingApi, setEditingApi] = useState<any>(null);
  const [userRole] = useState<'admin' | 'staff'>('admin');

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? apis.map(a => a.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
  };

  const handleManualSync = (name: string) => {
    showSuccess(`已手动触发「${name}」数据同步任务，正在拉取 SPU/SKU 增量数据...`);
  };

  const handleBatchAction = (action: string) => {
    if (selectedIds.length === 0) return;
    showSuccess(`已执行批量${action}操作，涉及 ${selectedIds.length} 个接口通道。`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 text-left">
        
        {/* 顶部标题与新增 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">数据开放 API 鉴权管理</h1>
            <p className="text-xs text-slate-500 mt-1">集成多平台数据接口，打通 AI 选品、评价 NLP 与 AIGC 内容工厂全链路数据流</p>
          </div>
          <Button 
            onClick={() => { setEditingApi(null); setIsConfigOpen(true); }}
            className="bg-rose-400 hover:bg-rose-500 text-white text-xs h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> 新增 API 接口连接
          </Button>
        </div>

        {/* 筛选工具栏 */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">接口类型</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px] h-8 text-xs bg-slate-50">
                  <SelectValue placeholder="全部类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="shop">店铺自有 API</SelectItem>
                  <SelectItem value="platform">平台开放 API</SelectItem>
                  <SelectItem value="third">第三方数据接口</SelectItem>
                  <SelectItem value="general">通用数据接口</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">连通状态</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px] h-8 text-xs bg-slate-50">
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="normal">正常</SelectItem>
                  <SelectItem value="invalid">失效</SelectItem>
                  <SelectItem value="pending">待授权</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">绑定店铺</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px] h-8 text-xs bg-slate-50">
                  <SelectValue placeholder="全部店铺" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部店铺</SelectItem>
                  <SelectItem value="official">中达美妆官方店</SelectItem>
                  <SelectItem value="douyin">中达抖音专营店</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input placeholder="搜索接口名称或标识..." className="pl-8 h-8 text-xs bg-slate-50 border-slate-200" />
            </div>

            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500">重置</Button>
          </CardContent>
        </Card>

        {/* 批量操作栏 */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 bg-rose-50 p-3 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-2">
            <span className="text-xs font-bold text-rose-600">已选中 {selectedIds.length} 项</span>
            <div className="h-4 w-[1px] bg-rose-200 mx-1" />
            <Button onClick={() => handleBatchAction('启用')} variant="outline" size="sm" className="h-7 text-[10px] border-rose-200 text-rose-600 bg-white">批量启用</Button>
            <Button onClick={() => handleBatchAction('停用')} variant="outline" size="sm" className="h-7 text-[10px] border-rose-200 text-rose-600 bg-white">批量停用</Button>
            <Button onClick={() => handleBatchAction('检测')} variant="outline" size="sm" className="h-7 text-[10px] border-rose-200 text-rose-600 bg-white">批量检测连通</Button>
            <Button onClick={() => handleBatchAction('同步')} className="h-7 text-[10px] bg-rose-400 hover:bg-rose-500 text-white">批量同步数据</Button>
          </div>
        )}

        {/* 接口列表 */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/70">
                <TableRow>
                  <TableHead className="w-[40px] text-center">
                    <Checkbox 
                      checked={selectedIds.length === apis.length} 
                      onCheckedChange={(c) => handleSelectAll(!!c)} 
                    />
                  </TableHead>
                  <TableHead className="text-xs">接口名称 / 标识</TableHead>
                  <TableHead className="text-xs">所属渠道 / 类型</TableHead>
                  <TableHead className="text-xs">绑定店铺</TableHead>
                  <TableHead className="text-xs text-center">连通状态</TableHead>
                  <TableHead className="text-xs text-right">最后拉取时间</TableHead>
                  <TableHead className="text-xs text-right">数据更新量</TableHead>
                  <TableHead className="text-xs text-right w-[220px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apis.map(api => (
                  <TableRow key={api.id} className="hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={selectedIds.includes(api.id)} 
                        onCheckedChange={(c) => handleSelectOne(api.id, !!c)} 
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 text-xs block">{api.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{api.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-bold uppercase">
                            {api.platform}
                          </span>
                          <span className="text-[10px] text-slate-500">{api.channel}</span>
                        </div>
                        <Badge variant="secondary" className="text-[9px] font-medium">{api.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Store className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px]">{api.shop}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "border-none text-[9px] font-bold",
                        api.status === '正常' && 'bg-emerald-100 text-emerald-700',
                        api.status === '待授权' && 'bg-amber-100 text-amber-700',
                        api.status === '失效' && 'bg-rose-100 text-rose-700',
                      )}>
                        {api.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-slate-500 font-medium">{api.lastSync}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-xs font-bold text-slate-700">{api.updateCount.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 ml-1">条</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" size="sm" className="h-7 text-[10px] text-slate-500 hover:text-rose-500"
                          onClick={() => { setEditingApi(api); setIsConfigOpen(true); }}
                        >
                          <Settings2 className="w-3 h-3 mr-1" /> 配置
                        </Button>
                        <Button 
                          variant="ghost" size="sm" className="h-7 text-[10px] text-slate-500 hover:text-rose-500"
                          onClick={() => handleManualSync(api.name)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" /> 同步
                        </Button>
                        <Button 
                          variant="ghost" size="sm" className="h-7 text-[10px] text-slate-500 hover:text-rose-500"
                          onClick={() => setIsLogOpen(true)}
                        >
                          <FileSpreadsheet className="w-3 h-3 mr-1" /> 日志
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 联动规则说明卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-gradient-to-br from-rose-50/50 to-white">
            <CardContent className="p-4 flex gap-3">
              <div className="bg-rose-100 p-2 rounded-xl h-fit"><Database className="w-4 h-4 text-rose-500" /></div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">数据自动流转</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">拉取的商品与评价数据将自动流入「评价 NLP 分析」模块进行情感与卖点解析。</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50/50 to-white">
            <CardContent className="p-4 flex gap-3">
              <div className="bg-amber-100 p-2 rounded-xl h-fit"><Zap className="w-4 h-4 text-amber-500" /></div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">驱动 AIGC 生产</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">解析后的结构化洞察将作为文案、图片、视频生成的底层输入，确保内容高度贴合市场。</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50/50 to-white">
            <CardContent className="p-4 flex gap-3">
              <div className="bg-blue-100 p-2 rounded-xl h-fit"><ShieldCheck className="w-4 h-4 text-blue-500" /></div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">失效自动保护</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">接口失效时 AI 选品任务将自动暂停并触发告警，防止因数据断流导致模型预测偏差。</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 配置与调试抽屉 */}
      <ApiConfigSheet 
        open={isConfigOpen} 
        onOpenChange={setIsConfigOpen} 
        api={editingApi} 
        isAdmin={userRole === 'admin'}
      />

      {/* 日志详情抽屉 */}
      <LogDetailSheet 
        open={isLogOpen} 
        onOpenChange={setIsLogOpen} 
      />
    </DashboardLayout>
  );
};

export default ApiSettings;