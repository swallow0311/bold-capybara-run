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
  UserCircle,
  Sparkles
} from 'lucide-react';
import { cn } from "@/lib/utils";

const menuItems = [
  { name: '首页', icon: LayoutDashboard, path: '/' },
  { name: 'AI选品引擎', icon: Search, path: '/selection' },
  { name: 'AIGC内容工厂', icon: PenTool, path: '/content' },
  { name: '评价NLP分析', icon: BarChart3, path: '/sentiment' },
  { name: '数据中心', icon: Database, path: '/data' },
  { name: '系统设置', icon: Settings, path: '/settings' },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">美妆AI智能中台</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-slate-500" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">运营总监</p>
              <p className="text-xs text-slate-500 truncate">Admin Mode</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-sm font-medium text-slate-500">
            {menuItems.find(i => i.path === location.pathname)?.name || '系统'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
            <span className="text-sm text-slate-600">2024年5月20日 星期一</span>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;