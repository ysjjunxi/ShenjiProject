import React from 'react';

export function SystemOrg() {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">组织管理</h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
         <span className="text-gray-400">部门结构树与组织架构管理</span>
      </div>
    </div>
  );
}

export function SystemRole() {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">角色管理</h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
         <span className="text-gray-400">系统角色定义与资源绑定</span>
      </div>
    </div>
  );
}

export function SystemUser() {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">用户管理</h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
         <span className="text-gray-400">用户账号信息与状态管理</span>
      </div>
    </div>
  );
}

export function SystemLog() {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">日志查询</h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
         <span className="text-gray-400">操作日志与系统异常日志查询</span>
      </div>
    </div>
  );
}
