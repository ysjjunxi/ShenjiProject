import React from 'react';
import { LogOut, ChevronDown, PanelLeftClose, PanelLeftOpen, Lock, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Header({ isCollapsed, onToggleCollapse }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showChangePassword, setShowChangePassword] = React.useState(false);
  const [passwordForm, setPasswordForm] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChanging, setIsChanging] = React.useState(false);
  const [changeSuccess, setChangeSuccess] = React.useState(false);

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      // In a real app, clear tokens/session
      window.location.reload(); // Refresh to mock logout
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('新密码与确认密码不一致');
      return;
    }
    
    setIsChanging(true);
    // Mock API call
    setTimeout(() => {
      setIsChanging(false);
      setChangeSuccess(true);
      setTimeout(() => {
        setShowChangePassword(false);
        setChangeSuccess(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }, 1500);
    }, 1000);
  };

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
            <button 
              onClick={() => {
                setShowChangePassword(true);
                setShowUserMenu(false);
              }}
              className="w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
            >
              <Lock size={16} />
              <span>修改密码</span>
            </button>
            <div className="h-px bg-gray-100 my-2" />
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <LogOut size={16} />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePassword && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isChanging && setShowChangePassword(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-normal text-gray-900 tracking-tight">修改密码</h3>
                <button 
                  onClick={() => setShowChangePassword(false)}
                  disabled={isChanging}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {changeSuccess ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Lock size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">密码修改成功</h4>
                  <p className="text-sm text-gray-500 mt-2">您的新密码已生效，请妥善保管。</p>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                    <input 
                      type="password"
                      required
                      value={passwordForm.oldPassword}
                      onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                      className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                      placeholder="输入当前使用的密码"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                    <input 
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                      placeholder="输入新密码 (至少6位)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                    <input 
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                      placeholder="再次输入新密码"
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowChangePassword(false)}
                      disabled={isChanging}
                      className="flex-1 h-11 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      type="submit"
                      disabled={isChanging}
                      className="flex-1 h-11 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    >
                      {isChanging ? '提交中...' : '提交修改'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
