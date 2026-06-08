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
  { name: 'AI选品', sub: '全网爆款趋势挖掘', icon: Search, path: '/selection' },
  { name: 'AIGC内容工厂', sub: '多版本内容快速生成', icon: PenTool, path: '/content' },
  { name: '评价NLP分析', sub: '用户口碑与痛点洞察', icon: BarChart3, path: '/sentiment' },
  { name: '数据中心', sub: '素材检索与快速复用', icon: Database, path: '/data' },
  { name: '系统设置', sub: '模型参数与风险审查', icon: Settings, path: '/settings' },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#FFFBFB] text-slate-900 font-sans">
      {/* Sidebar - Soft warm coral gradient */}
      <aside className="w-72 bg-gradient-to-b from-[#FFF2F0] to-[#FFE3E0] border-r border-[#FAD0CC] flex flex-col">
        {/* Sidebar Header */}
        <div className="p-5 flex items-center gap-2 border-b border-[#FAD0CC]/50 bg-white/20">
          <div className="bg-rose-400 p-2 rounded-xl shadow-sm">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-wide text-rose-800 block">智能 AI 中台</span>
          </div>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-white shadow-sm border-l-4 border-rose-400 text-rose-800 translate-x-1" 
                    : "text-slate-600 hover:bg-white/40 hover:text-slate-900"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-rose-400" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-bold tracking-wide">{item.name}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-medium">{item.sub}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Slimmed height */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800">
              {menuItems.find(i => i.path === location.pathname)?.name || '系统中心'}
            </h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-400 rounded-full border border-white"></span>
            </button>
            
            <div className="h-5 w-[1px] bg-slate-200"></div>
            
            {/* User Profile Card */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-xs shadow-sm border border-rose-100">
                张
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800">美妆运营-张三</span>
                <span className="text-[10px] text-slate-400 font-medium">账号：zhangsan</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;