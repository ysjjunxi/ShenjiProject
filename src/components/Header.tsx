import React from 'react';
import { Settings, LogOut, User, ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface HeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Header({ isCollapsed, onToggleCollapse }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-4 shrink-0 z-50 shadow-sm">
      {/* Left: Logo & System Name */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleCollapse}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors mr-1"
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-black text-lg">A</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-normal text-2xl tracking-tight text-gray-900 leading-none">审计AI大模型</h1>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1 scale-95 origin-left">智能数据分析平台</p>
        </div>
      </div>

      {/* Right: User Avatar & Menu */}
      <div className="relative group">
        <div 
          className="flex items-center gap-3 pl-4 py-2 cursor-pointer hover:bg-gray-50 rounded-xl transition-all"
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900">张俊</p>
            <p className="text-[10px] text-gray-400 font-medium">高级审计员</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
            张
          </div>
          <ChevronDown size={14} className={cn("text-gray-400 transition-transform", showUserMenu && "rotate-180")} />
        </div>

        {/* Dropdown Menu */}
        <div 
          className={cn(
            "absolute right-0 top-full pt-2 w-48 transition-all duration-200 origin-top-right",
            showUserMenu ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2">
            <button className="w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors">
              <User size={16} />
              <span>个人中心</span>
            </button>
            <button className="w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors">
              <Settings size={16} />
              <span>系统设置</span>
            </button>
            <div className="h-px bg-gray-100 my-2" />
            <button className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
              <LogOut size={16} />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
