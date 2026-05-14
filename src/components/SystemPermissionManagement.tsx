import React, { useState } from 'react';
import { Shield, Menu as MenuIcon, Database, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function SystemPermissionManagement() {
  const [activeTab, setActiveTab] = useState<'data' | 'menu'>('data');

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 overflow-y-auto relative">
      {/* Header */}
      <div className="px-8 h-[90px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">权限管理</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">管理系统菜单访问权限及底层数据隔离权限</p>
        </div>
      </div>

      <div className="p-8 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('data')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === 'data' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              )}
            >
              数据权限
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === 'menu' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              )}
            >
              菜单管理
            </button>
          </div>

          {activeTab === 'data' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-4xl font-sans">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database size={18} className="text-blue-600" />
                数据行列权限配置
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-3 text-sm">
                     <h4 className="font-bold text-gray-800">角色: 业务审计员</h4>
                     <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">配置生效中</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 mb-2">行级权限 (可见范围)</p>
                        <div className="text-sm text-gray-800 flex items-center gap-2">
                          <Check size={14} className="text-green-500" /> 本部门及下属部门数据
                        </div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 mb-2">列级权限 (脱敏配置)</p>
                        <div className="text-sm text-gray-800 flex items-center gap-2">
                          <Shield size={14} className="text-purple-500" /> 隐藏身份证、手机号
                        </div>
                     </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 text-center py-4">选择左侧角色树进行具体配置...</p>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MenuIcon size={18} className="text-blue-600" />
                菜单目录与路由管理
              </h3>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50 border-b border-gray-200">
                    <tr>
                      <th className="p-4 font-normal text-gray-600">菜单名称</th>
                      <th className="p-4 font-normal text-gray-600">路由路径</th>
                      <th className="p-4 font-normal text-gray-600">类型</th>
                      <th className="p-4 font-normal text-gray-600">可见性</th>
                      <th className="p-4 font-normal text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-normal">系统管理</td>
                      <td className="p-4 text-gray-500 font-mono text-xs">/system</td>
                      <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] rounded font-bold uppercase">目录</span></td>
                      <td className="p-4"><span className="text-green-600 flex items-center gap-1.5"><Check size={14}/>显示</span></td>
                      <td className="p-4 text-blue-600 hover:underline cursor-pointer font-medium">编辑</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 pl-8">↳ 权限管理</td>
                      <td className="p-4 text-gray-500 font-mono text-xs">/system/permission</td>
                      <td className="p-4"><span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] rounded font-bold uppercase">菜单</span></td>
                      <td className="p-4"><span className="text-green-600 flex items-center gap-1.5"><Check size={14}/>显示</span></td>
                      <td className="p-4 text-blue-600 hover:underline cursor-pointer font-medium">编辑</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
