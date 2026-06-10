import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, Bell, ShieldAlert, MessageSquare, 
  Link2, ShoppingBag, Mail, Smartphone, Save, RotateCcw
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const AlertSettings = () => {
  const handleSave = () => {
    showSuccess("预警配置已成功保存，系统将实时监控业务指标。");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 text-left pb-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">业务预警与通知配置</h1>
            <p className="text-xs text-slate-500 mt-1">自定义库存、合规、口碑及系统接口的风险触发阈值与通知方式</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> 重置
            </Button>
            <Button onClick={handleSave} size="sm" className="h-9 text-xs bg-rose-400 hover:bg-rose-500 text-white">
              <Save className="w-3.5 h-3.5 mr-1.5" /> 保存配置
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-rose-400" />
                库存与素材临界预警
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700">启用低库存报警</span>
                  <p className="text-[10px] text-slate-400">当商品或素材包库存低于阈值时触发</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-slate-500">商品库存报警阈值</Label>
                  <Input type="number" defaultValue="50" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-slate-500">素材包报警阈值</Label>
                  <Input type="number" defaultValue="10" className="h-8 text-xs" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                AIGC 内容合规风险预警
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700">高危违规词实时拦截</span>
                  <p className="text-[10px] text-slate-400">检测到广告法极限词时立即通知运营</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-1.5 pt-1">
                <Label className="text-[11px] text-slate-500">预警触发等级</Label>
                <Select defaultValue="high">
                  <SelectTrigger className="h-8 text-xs bg-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部风险</SelectItem>
                    <SelectItem value="high">仅限重度违规</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Bell className="w-4 h-4 text-rose-400" />
              预警通知渠道与接收人
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">站内信通知</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">邮件通知</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Input placeholder="接收邮箱" className="h-8 text-[10px] bg-white" defaultValue="admin@xx-beauty.com" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AlertSettings;