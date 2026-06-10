import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, Bell, ShieldAlert, MessageSquare, 
  ShoppingBag, Mail, Smartphone, Save, RotateCcw,
  TrendingUp, Database, Zap, Coins, Clock, ShieldCheck,
  Search, BarChart3, Activity
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const AlertSettings = () => {
  const handleSave = () => {
    showSuccess("全局预警阈值配置已成功保存，系统监控引擎已即时更新。");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 text-left pb-24 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">业务预警与通知配置中心</h1>
            <p className="text-xs text-slate-500 mt-1">自定义全链路风险触发阈值，确保 XX 品牌运营安全与 AIGC 内容合规</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> 重置默认
            </Button>
            <Button onClick={handleSave} size="sm" className="h-9 text-xs bg-rose-400 hover:bg-rose-500 text-white shadow-lg shadow-rose-100">
              <Save className="w-3.5 h-3.5 mr-1.5" /> 保存全局配置
            </Button>
          </div>
        </div>

        <Tabs defaultValue="commerce" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 h-11 w-full justify-start shadow-sm rounded-xl">
            <TabsTrigger value="commerce" className="flex-1 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <ShoppingBag className="w-3.5 h-3.5" /> 商品与选品预警
            </TabsTrigger>
            <TabsTrigger value="aigc" className="flex-1 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <Zap className="w-3.5 h-3.5" /> AIGC 与合规预警
            </TabsTrigger>
            <TabsTrigger value="nlp" className="flex-1 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <MessageSquare className="w-3.5 h-3.5" /> 评价 NLP 预警
            </TabsTrigger>
            <TabsTrigger value="system" className="flex-1 gap-2 text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600">
              <Bell className="w-3.5 h-3.5" /> 通知与时效设置
            </TabsTrigger>
          </TabsList>

          {/* 1. 商品与选品预警 */}
          <TabsContent value="commerce" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 库存预警 */}
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-rose-400" /> 库存预警阈值设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-slate-500">安全库存阈值 (件)</Label>
                      <Input type="number" defaultValue="10" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-slate-500">积压天数阈值 (天)</Label>
                      <Input type="number" defaultValue="90" className="h-8 text-xs" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] text-slate-500">预警接收人</Label>
                    <div className="flex gap-2">
                      {['商品运营', '采购负责人', '店长'].map(role => (
                        <Badge key={role} variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px] px-2 py-0.5">{role}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 价格预警 */}
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-600">
                    <TrendingUp className="w-4 h-4" /> 价格预警阈值设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-slate-500">价格异常变动阈值 (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" defaultValue="30" className="h-8 text-xs" />
                      <span className="text-[10px] text-slate-400">± 波动触发</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-700">低于成本价预警</span>
                      <p className="text-[9px] text-slate-400">自动比对 ERP 成本价，防止亏本销售</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* AI 选品预警 */}
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-600">
                    <Search className="w-4 h-4" /> AI 选品预警阈值设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-slate-500">推荐命中率阈值 (%)</Label>
                      <Input type="number" defaultValue="70" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-slate-500">选品成功率阈值 (%)</Label>
                      <Input type="number" defaultValue="60" className="h-8 text-xs" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-indigo-50/30 rounded-lg border border-indigo-100">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-indigo-700">预警智能推送</span>
                      <p className="text-[9px] text-indigo-600/70">发现全网 TOP50 爆款机会时自动推送</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* 数据质量监控 */}
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-600">
                    <Database className="w-4 h-4" /> 数据质量监控
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-slate-500">数据源健康检查周期</Label>
                    <Select defaultValue="hour">
                      <SelectTrigger className="h-8 text-xs bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">实时</SelectItem>
                        <SelectItem value="hour">每小时</SelectItem>
                        <SelectItem value="day">每日</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-slate-500">数据完整性阈值 (%)</Label>
                    <Input type="number" defaultValue="95" className="h-8 text-xs" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 2. AIGC 与合规预警 */}
          <TabsContent value="aigc" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AIGC 内容预警 */}
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-500">
                    <Zap className="w-4 h-4" /> AIGC 内容预警阈值设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-slate-500">生成失败率阈值 (%)</Label>
                      <Input type="number" defaultValue="5" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-slate-500">内容质量评分阈值 (分)</Label>
                      <Input type="number" defaultValue="60" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-slate-500">生成响应时长阈值 (秒)</Label>
                      <Input type="number" defaultValue="30" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-slate-500">API 错误率阈值 (%)</Label>
                      <Input type="number" defaultValue="1" className="h-8 text-xs" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 合规预警 */}
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-600">
                    <ShieldCheck className="w-4 h-4" /> 合规预警设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-700">违禁词库自动同步</span>
                      <p className="text-[9px] text-slate-400">自动同步国家广告法官方词库</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-slate-500">审核拒绝率阈值 (%)</Label>
                    <Input type="number" defaultValue="10" className="h-8 text-xs" />
                  </div>
                </CardContent>
              </Card>

              {/* 成本预警 */}
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-600">
                    <Coins className="w-4 h-4" /> 成本预警设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-slate-500">日 API 预算阈值 (¥)</Label>
                    <Input type="number" defaultValue="500" className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-slate-500">存储空间预警阈值 (%)</Label>
                    <Input type="number" defaultValue="90" className="h-8 text-xs" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 3. 评价 NLP 预警 */}
          <TabsContent value="nlp" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-600">
                    <BarChart3 className="w-4 h-4" /> 评价 NLP 预警阈值设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-slate-500">负面评价激增倍数 (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" defaultValue="300" className="h-8 text-xs" />
                      <span className="text-[10px] text-slate-400">相对历史均值</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-slate-500">情感骤降阈值 (星)</Label>
                      <Input type="number" defaultValue="2" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-slate-500">问题类型占比阈值 (%)</Label>
                      <Input type="number" defaultValue="40" className="h-8 text-xs" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-600">
                    <Activity className="w-4 h-4" /> 智能预警规则
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  {[
                    { label: '热门商品监控', desc: '销量 TOP10 自动开启深度监控' },
                    { label: '新问题自动发现', desc: 'AI 自动聚类并识别评价中的新痛点' },
                    { label: '刷评行为检测', desc: '自动识别并剔除疑似水军评价' }
                  ].map(rule => (
                    <div key={rule.label} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-700">{rule.label}</span>
                        <p className="text-[9px] text-slate-400">{rule.desc}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 4. 通知与时效设置 */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                    <Clock className="w-4 h-4 text-rose-400" /> 响应时效设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-slate-500">差评响应时效 (小时)</Label>
                    <Input type="number" defaultValue="24" className="h-8 text-xs" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-slate-400">高级预警</Label>
                      <Badge className="bg-rose-100 text-rose-700 border-none text-[10px] w-full justify-center">立即</Badge>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-slate-400">中级预警</Label>
                      <Input type="number" defaultValue="48" className="h-7 text-[10px] text-center" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-slate-400">通知级</Label>
                      <Input type="number" defaultValue="72" className="h-7 text-[10px] text-center" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                    <Bell className="w-4 h-4 text-rose-400" /> 预警通知渠道
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  {[
                    { label: '站内消息', icon: Smartphone },
                    { label: '短信通知', icon: Smartphone },
                    { label: '邮件通知', icon: Mail }
                  ].map(channel => (
                    <div key={channel.label} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2">
                        <channel.icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">{channel.label}</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm bg-rose-50/30 border border-rose-100">
              <CardContent className="p-5 flex gap-4">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1 text-left">
                  <span className="text-xs font-bold text-rose-700">超时自动升级规则</span>
                  <p className="text-[11px] text-rose-600/80 leading-relaxed">
                    • 中级预警 48h 未处理 → 自动升级为高级预警并抄送部门负责人。<br />
                    • 高级预警 2h 未处理 → 自动触发电话语音通知负责人。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AlertSettings;