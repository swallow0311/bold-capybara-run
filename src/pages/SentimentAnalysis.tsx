import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  PieChart as PieChartIcon, 
  TrendingDown, 
  MessageSquare, 
  Lightbulb, 
  ArrowRight,
  AlertCircle,
  Package,
  Truck
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const SentimentAnalysis = () => {
  const pieData = [
    { name: '产品配方', value: 45, color: '#6366f1' },
    { name: '包装问题', value: 30, color: '#f59e0b' },
    { name: '物流服务', value: 25, color: '#ef4444' },
  ];

  const lineData = [
    { name: '5.14', count: 45 },
    { name: '5.15', count: 52 },
    { name: '5.16', count: 38 },
    { name: '5.17', count: 65 },
    { name: '5.18', count: 48 },
    { name: '5.19', count: 42 },
    { name: '5.20', count: 35 },
  ];

  const painPoints = [
    { 
      category: '产品配方', 
      icon: AlertCircle, 
      color: 'text-indigo-600',
      points: [
        { text: '上脸有刺痛感，敏感肌不友好', level: '高', quote: '“用了两次脸就红了，刺痛感很明显，不敢再用了。”' },
        { text: '质地太厚重，容易闷痘', level: '中', quote: '“夏天用真的太油了，第二天就长了两个大痘。”' }
      ]
    },
    { 
      category: '包装问题', 
      icon: Package, 
      color: 'text-amber-600',
      points: [
        { text: '泵头容易卡死，出液不均匀', level: '中', quote: '“按压头很难用，有时候按不出来，有时候喷一手。”' }
      ]
    },
    { 
      category: '物流问题', 
      icon: Truck, 
      color: 'text-red-600',
      points: [
        { text: '快递暴力，收到时外盒变形', level: '低', quote: '“盒子都扁了，还好里面的瓶子没碎。”' }
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Config Area */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <Select defaultValue="p1">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="选择商品" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p1">玻色因紧致面霜</SelectItem>
                <SelectItem value="p2">控油防晒喷雾</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="tmall">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="电商平台" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tmall">天猫旗舰店</SelectItem>
                <SelectItem value="jd">京东自营</SelectItem>
                <SelectItem value="dy">抖音小店</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-indigo-600">开始分析</Button>
          </CardContent>
        </Card>

        {/* Overview Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-500">负面标签占比</CardTitle>
            </CardHeader>
            <CardContent className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">差评趋势分析</CardTitle>
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                <TrendingDown className="w-3 h-3" />
                较上周下降 12%
              </div>
            </CardHeader>
            <CardContent className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{r: 4, fill: '#6366f1'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Pain Points Extraction */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              AI 痛点提炼
            </h3>
            {painPoints.map((cat, i) => (
              <Card key={i} className="border-none shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center gap-2">
                  <cat.icon className={cn("w-5 h-5", cat.color)} />
                  <CardTitle className="text-base">{cat.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cat.points.map((p, j) => (
                    <div key={j} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold text-slate-700">{p.text}</span>
                        <Badge variant={p.level === '高' ? 'destructive' : 'secondary'} className="text-[10px]">
                          影响：{p.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                        {p.quote}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Iteration Suggestions */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              迭代建议区
            </h3>
            <Card className="border-none shadow-sm bg-indigo-600 text-white">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs opacity-80 uppercase font-bold">配方优化</p>
                  <p className="text-sm leading-relaxed">
                    建议增加 2% 的积雪草提取物以中和高浓度玻色因可能带来的刺激感，并标注“敏感肌需建立耐受”。
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs opacity-80 uppercase font-bold">包装升级</p>
                  <p className="text-sm leading-relaxed">
                    更换为真空压泵设计，解决目前用户反馈的泵头卡死及出液不均问题。
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20 flex flex-col gap-2">
                  <Button variant="secondary" className="w-full text-indigo-600">
                    同步至产品迭代工单
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent border-white/40 hover:bg-white/10">
                    导出分析报告
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SentimentAnalysis;