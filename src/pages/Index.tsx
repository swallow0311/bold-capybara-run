import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  FileText, 
  MessageSquareWarning, 
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Index = () => {
  const navigate = useNavigate();

  // 1. KPI 整合各板块核心数据
  const stats = [
    { title: 'AI 选品爆款探测', value: '12,840 款', icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-50', desc: '本月发掘黑马率 +45%' },
    { title: 'AIGC 生产总资产', value: '2,580 个', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50', desc: '质检通过率达 98.6%' },
    { title: 'NLP 口碑满意度', value: '94.2%', icon: MessageSquareWarning, color: 'text-orange-500', bg: 'bg-orange-50', desc: '昨日差评预警 3 条' },
    { title: '托管在售商品数', value: '4 个', icon: ShoppingBag, color: 'text-indigo-500', bg: 'bg-indigo-50', desc: '下辖 7 个 SKU 细分规格' },
  ];

  const quickActions = [
    { title: 'AI 选品引擎', desc: '发掘市场蓝海与黑马爆款', path: '/selection', icon: PlusCircle },
    { title: 'AIGC 内容工厂', desc: '批量输出图文及卡点视频', path: '/content', icon: FileText },
    { title: '评价 NLP 分析', desc: '深度抽取用户痛点及满意度', path: '/sentiment', icon: MessageSquareWarning },
  ];

  // 2. AIGC 近7天生成趋势数据
  const chartData = [
    { date: '周一', 文案数: 24, 图片数: 12, 视频数: 5 },
    { date: '周二', 文案数: 35, 图片数: 18, 视频数: 8 },
    { date: '周三', 文案数: 29, 图片数: 15, 视频数: 6 },
    { date: '周四', 文案数: 42, 图片数: 25, 视频数: 12 },
    { date: '周五', 文案数: 56, 图片数: 30, 视频数: 15 },
    { date: '周六', 文案数: 18, 图片数: 8, 视频数: 4 },
    { date: '周日', 文案数: 22, 图片数: 10, 5: 5 },
  ];

  // 3. 实时智能行动流与运营建议
  const aiAdvices = [
    { 
      id: 1, 
      type: 'warning', 
      title: '商品口碑异动警报', 
      desc: '中达御龄紧致面霜近两日差评率升至 7%，主要痛点集中于“闷痘”和“包装按压头难按”。', 
      action: '前往 NLP 精准穿透', 
      path: '/sentiment' 
    },
    { 
      id: 2, 
      type: 'info', 
      title: '爆款流量追击建议', 
      desc: 'AI 选品挖掘到“中达控油防晒喷雾”本月流量环比暴增 85%，目前带货 ROI 高达 5.1。', 
      action: '前往生成带货视频', 
      path: '/video-creation' 
    },
    { 
      id: 3, 
      type: 'success', 
      title: '内容资产上新就绪', 
      desc: '已成功提炼唇蜜模特试色合规无水印高清大图，支持一键分发小红书。', 
      action: '前往素材库分发', 
      path: '/asset-library' 
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Welcome */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              早安，中达美妆运营负责人
            </h1>
            <p className="text-slate-500 mt-1 text-xs">欢迎使用美妆大模型智能运营中台。系统已连接多端 API，今天有 3 个待优化项需要介入。</p>
          </div>
          <Badge className="bg-rose-100 hover:bg-rose-100 text-rose-700 font-bold border-none text-[11px] px-3 py-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> 智能建议引擎已就绪
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white hover:shadow-md transition-all">
              <CardContent className="p-5 flex items-center gap-4 text-left">
                <div className={`${stat.bg} p-3 rounded-xl shrink-0`}>
                  <stat.icon className={`${stat.color} w-6 h-6`} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.title}</p>
                  <p className="text-xl font-black text-slate-800">{stat.value}</p>
                  <span className="text-[10px] text-slate-400 block font-medium">{stat.desc}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AIGC Generation Trend & Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Trend Chart */}
          <Card className="lg:col-span-8 border-none shadow-sm bg-white">
            <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-400" />
                AIGC 跨媒介素材周产出趋势
              </CardTitle>
              <span className="text-[10px] text-slate-400">更新时间：今天 09:00</span>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="文案数" fill="#f5756c" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="图片数" fill="#fca39d" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="视频数" fill="#fedcd9" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-[10px] text-slate-400 mt-2 font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#f5756c] rounded-full" /> AIGC文案</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#fca39d] rounded-full" /> AI电商图片</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#fedcd9] rounded-full" /> AI卡点短视频</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} to={action.path} className="block flex-1">
                <Card className="hover:border-rose-200 transition-all cursor-pointer group border-slate-100 bg-white h-full">
                  <CardContent className="p-5 flex flex-col justify-between h-full text-left">
                    <div className="flex justify-between items-start">
                      <action.icon className="w-8 h-8 text-slate-400 group-hover:text-rose-500 transition-colors" />
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div className="mt-4">
                      <span className="text-xs font-bold text-slate-800 block">{action.title}</span>
                      <span className="text-[10px] text-slate-400 block mt-1 leading-relaxed">{action.desc}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

        </div>

        {/* AI Actionable Recommendations */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-slate-150">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              运营大脑行动指南 (AI-Driven Actions)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="divide-y divide-slate-100 text-xs">
              {aiAdvices.map((advice) => (
                <div key={advice.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3 flex-1">
                    {advice.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
                    {advice.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />}
                    {advice.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                    
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-[13px] block">{advice.title}</span>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{advice.desc}</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate(advice.path)}
                    size="sm" 
                    className="h-8 text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-150 rounded-xl px-4 shrink-0 font-bold"
                  >
                    {advice.action} <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default Index;