import React, { useState } from 'react';
import { Settings, Database, RefreshCw, Save, Clock, Play } from 'lucide-react';

export default function SystemOpsManagement() {
  const [activeTab, setActiveTab] = useState<'dict' | 'config'>('config');

  // Config State
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [cronExpression, setCronExpression] = useState('0 0 * * *');
  const [immediateExecution, setImmediateExecution] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 overflow-hidden">
      {/* Header */}
      <div className="px-8 h-[90px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shrink-0 z-10">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">综合管理</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">管理系统字典数据与后台自动任务配置</p>
        </div>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('dict')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dict' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              字典管理
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'config' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              配置管理
            </button>
          </div>

          {activeTab === 'dict' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[400px]">
               <Database size={48} className="text-gray-300 mb-4" />
               <h3 className="text-lg font-bold text-gray-900">数据字典管理</h3>
               <p className="text-gray-500 text-sm mt-2">在这里维护系统全局的常量、枚举值和下拉选项数据。</p>
               <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                 新增字典项
               </button>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings size={18} className="text-blue-600" />
                后台任务与同步配置
              </h3>
              
              <div className="space-y-6">
                {/* Sync Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">开启数据同步</h4>
                    <p className="text-xs text-gray-500 mt-1">自动将第三方系统数据同步至本地数仓</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={syncEnabled}
                      onChange={(e) => setSyncEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Cron Frequency */}
                <div className={`transition-all duration-300 ${syncEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={16} /> 定时频率设置 (Cron)
                  </label>
                  <input 
                    type="text" 
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    placeholder="例如: 0 0 * * *"
                  />
                  <p className="text-xs text-gray-500 mt-2">当前设置: 每天凌晨执行一次</p>
                </div>

                {/* Immediate Execution Toggle */}
                <div className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all ${syncEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">保存后立即执行</h4>
                    <p className="text-xs text-gray-500 mt-1">配置更新后，立即触发一次数据同步任务</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={immediateExecution}
                      onChange={(e) => setImmediateExecution(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm active:scale-95"
                    onClick={() => alert('保存成功!')}
                  >
                    <Save size={16} />
                    保存配置
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
