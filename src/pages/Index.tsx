import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  FileText, 
  MessageSquareWarning, 
  ArrowRight,
  PlusCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const stats = [
    { title: '爆款数据条数', value: '12,840', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: '今日生成内容', value: '156', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: '差评分析条数', value: '892', icon: MessageSquareWarning, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const quickActions = [
    { title: 'AI 选品引擎', desc: '挖掘全网爆款趋势', path: '/selection', icon: PlusCircle },
    { title: 'AIGC 内容工厂', desc: '一键生成营销文案', path: '/content', icon: FileText },
    { title: '评价 NLP 分析', desc: '深度洞察用户痛点', path: '/sentiment', icon: MessageSquareWarning },
  ];

  const tasks = [
    { id: 1, title: '夏季防晒新品立项分析', status: '进行中', time: '2小时前' },
    { id: 2, title: '抖音直播间口播稿生成', status: '已完成', time: '5小时前' },
    { id: 3, title: '某品牌面霜差评聚类分析', status: '待处理', time: '昨天' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">早安，产品经理</h1>
          <p className="text-slate-500 mt-1">欢迎回到美妆AI智能中台，今天有 3 个新任务等待处理。</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className={`${stat.color} w-6 h-6`} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.path}>
              <Card className="hover:border-indigo-200 transition-all cursor-pointer group border-slate-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <action.icon className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                  </div>
                  <CardTitle className="text-lg mt-4">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">{action.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Tasks */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">近期任务列表</CardTitle>
            <Button variant="ghost" size="sm" className="text-indigo-600">查看全部</Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <div key={task.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                    <span className="text-sm font-medium text-slate-700">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      task.status === '已完成' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {task.status}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {task.time}
                    </div>
                  </div>
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