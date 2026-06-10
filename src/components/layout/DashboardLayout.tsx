import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  PenTool, 
  BarChart3, 
  Settings, 
  Bell, 
  Sparkles,
  ChevronDown,
  ChevronRight,
  FileText,
  ImageIcon,
  VideoIcon,
  FolderOpen,
  ShieldAlert,
  ShoppingBag,
  Link2,
  Cpu,
  ArrowLeft
} from 'lucide-react';
import { cn } from "@/lib/utils";

const menuItems = [
  { name: '核心看板', sub: '数据统计与ROI指标', icon: LayoutDashboard, path: '/' },
  { name: '商品管理', sub: '店铺SPU/SKU一体化管控', icon: ShoppingBag, path: '/products' },
  { name: 'AI选品', sub: '全网爆款趋势挖掘', icon: Search, path: '/selection' },
  { 
    name: 'AIGC内容工厂', 
    sub: '多版本内容智能产出', 
    icon: PenTool, 
    path: '/content',
    isParent: true,
    children: [
      { name: '文案生成', path: '/content', icon: FileText },
      { name: '图片设计', path: '/image-design', icon: ImageIcon },
      { name: '视频创作', path: '/video-creation', icon: VideoIcon },
      { name: '素材库', path: '/asset-library', icon: FolderOpen },
      { name: '合规质检', path: '/compliance-qa', icon: ShieldAlert },
    ]
  },
  { name: '评价NLP分析', sub: '用户口碑与痛点洞察', icon: BarChart3, path: '/sentiment' },
  { 
    name: '系统设置', 
    sub: '开放接口与大模型配置', 
    icon: Settings, 
    path: '/settings/api',
    isParent: true,
    children: [
      { name: 'API接口', path: '/settings/api', icon: Link2 },
      { name: '模型配置', path: '/settings/model', icon: Cpu },
    ]
  },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = locationHook();
  const [isAIGCOpen, setIsAIGCOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  function locationHook() {
    try {
      return useLocation();
    } catch (e) {
      return { pathname: '/' };
    }
  }

  useEffect(() => {
    const isSubPath = ['/content', '/image-design', '/video-creation', '/asset-library', '/compliance-qa'].includes(location.pathname);
    if (isSubPath) {
      setIsAIGCOpen(true);
    }
    const isSettingsSub = ['/settings/api', '/settings/model'].includes(location.pathname);
    if (isSettingsSub) {
      setIsSettingsOpen(true);
    }
  }, [location.pathname]);

  const isCreateOrEditProduct = location.pathname === '/products/create' || location.pathname.startsWith('/products/edit');

  return (
    <div className="flex h-screen bg-[#FFFBFB] text-slate-900 font-sans">
      <aside className="w-72 bg-gradient-to-b from-[#FFF2F0] to-[#FFE3E0] border-r border-[#FAD0CC] flex flex-col shrink-0">
        <div className="p-5 flex items-center gap-2 border-b border-[#FAD0CC]/50 bg-white/20">
          <div className="bg-rose-400 p-2 rounded-xl shadow-sm">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-wide text-rose-800 block">智能 AI 中台</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.isParent) {
              const isAigcMenu = item.name === 'AIGC内容工厂';
              const isOpen = isAigcMenu ? isAIGCOpen : isSettingsOpen;
              const setIsOpen = isAigcMenu ? setIsAIGCOpen : setIsSettingsOpen;
              
              const hasActiveChild = item.children?.some(child => location.pathname === child.path);
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group text-slate-600 hover:bg-white/40 hover:text-slate-900",
                      hasActiveChild && "bg-white/25 text-rose-800 font-bold"
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon className={cn(
                        "w-4 h-4 transition-colors",
                        hasActiveChild ? "text-rose-400" : "text-slate-400 group-hover:text-slate-600"
                      )} />
                      <div className="flex flex-col text-left">
                        <span className="text-[13px] font-bold tracking-wide">{item.name}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 font-medium">{item.sub}</span>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {isOpen && item.children && (
                    <div className="pl-6 space-y-1 border-l-2 border-rose-200/50 ml-6 mt-1">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={cn(
                              "flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150",
                              isChildActive
                                ? "bg-white text-rose-800 shadow-sm border-l-2 border-rose-400"
                                : "text-slate-500 hover:bg-white/30 hover:text-slate-900"
                            )}
                          >
                            <child.icon className={cn(
                              "w-3.5 h-3.5",
                              isChildActive ? "text-rose-500" : "text-slate-400"
                            )} />
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            {isCreateOrEditProduct && (
              <Link to="/products" className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-rose-500 transition-colors mr-1">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
            <h2 className="text-sm font-bold text-slate-800">
              {location.pathname === '/' ? '核心看板' : 
               location.pathname === '/products' ? '商品管理' : 
               location.pathname === '/products/create' ? '新建商品' :
               location.pathname.startsWith('/products/edit') ? '编辑商品' :
               location.pathname === '/selection' ? 'AI选品' :
               location.pathname === '/content' ? '文案生成' :
               location.pathname === '/image-design' ? '图片设计' :
               location.pathname === '/video-creation' ? '视频创作' :
               location.pathname === '/asset-library' ? '素材库' :
               location.pathname === '/compliance-qa' ? '合规质检' :
               location.pathname === '/sentiment' ? '评价NLP分析' :
               location.pathname === '/settings/api' ? 'API接口设置' :
               location.pathname === '/settings/model' ? '大模型配置' : '系统中心'}
            </h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-400 rounded-full border border-white"></span>
            </button>
            <div className="h-5 w-[1px] bg-slate-200"></div>
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

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;