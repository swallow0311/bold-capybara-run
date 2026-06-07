import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  PenTool, 
  BarChart3, 
  Database, 
  Settings, 
  Bell, 
  Sparkles
} from 'lucide-react';
import { cn } from "@/lib/utils";

const menuItems = [
  { name: '核心看板', sub: '数据统计与ROI指标', icon: LayoutDashboard, path: '/' },
  { name: 'AI选品引擎', sub: '全网爆款趋势挖掘', icon: Search, path: '/selection' },
  { name: 'AIGC内容工厂', sub: '多版本内容快速生成', icon: PenTool, path: '/content' },
  { name: '评价NLP分析', sub: '用户口碑与痛点洞察', icon: BarChart3, path: '/sentiment' },
  { name: '数据中心', sub: '素材检索与快速复用', icon: Database, path: '/data' },
  { name: '系统设置', sub: '模型参数与风险审查', icon: Settings, path: '/settings' },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#F9ECEE]/20 text-slate-900 font-sans">
      {/* Sidebar - Reference the screenshot style */}
      <aside className="w-72 bg-[#FBF1F2] border-r border-rose-100 flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-rose-100/60 bg-white/40">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-sm">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-widest text-slate-800 block">ZHONGDA BEAUTY</span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider">AIGC ENGINE V2.4</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-400 px-3 mb-2 tracking-wider">导航中心</div>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-white shadow-sm border-l-4 border-indigo-600 text-slate-900 translate-x-1" 
                    : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-bold tracking-wide">{item.name}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-medium">{item.sub}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 bg-white/40 border-t border-rose-100/60">
          <div className="text-[10px] text-center text-slate-400 font-medium">美妆AI智能决策系统</div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Reference the screenshot style */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-rose-100/60 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700">厦门中达美妆</span>
            <span className="text-slate-300">/</span>
            <h2 className="text-sm font-bold text-slate-800">
              {menuItems.find(i => i.path === location.pathname)?.name || '系统中心'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            {/* LLM Engine status badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-green-50/80 border border-green-100 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-green-700">LLM Engine Ready</span>
            </div>
            
            <button className="p-2 text-slate-400 hover:text-slate-600 relative hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-6 w-[1px] bg-slate-200"></div>
            
            {/* User Profile Card from screenshot */}
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shadow-sm border border-rose-200">
                中
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800">中达美妆运营-王经理</span>
                <span className="text-[10px] text-slate-400 font-medium">主理人</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#FAF6F6]/40">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;