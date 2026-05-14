import React from 'react';

export function SystemOrg() {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 overflow-y-auto relative">
      {/* Header */}
      <div className="px-8 h-[90px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">组织管理</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">部门结构树与组织架构管理</p>
        </div>
      </div>
      <div className="p-8 flex-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
           <span className="text-gray-400">正在进入组织管理系统...</span>
        </div>
      </div>
    </div>
  );
}

export function SystemRole() {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 overflow-y-auto relative">
      {/* Header */}
      <div className="px-8 h-[90px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">角色管理</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">系统角色定义与资源绑定</p>
        </div>
      </div>
      <div className="p-8 flex-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
           <span className="text-gray-400">正在进入角色管理系统...</span>
        </div>
      </div>
    </div>
  );
}

export function SystemUser() {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 overflow-y-auto relative">
      {/* Header */}
      <div className="px-8 h-[90px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">用户管理</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">用户账号信息与状态管理</p>
        </div>
      </div>
      <div className="p-8 flex-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
           <span className="text-gray-400">正在进入用户管理系统...</span>
        </div>
      </div>
    </div>
  );
}

export function SystemLog() {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 overflow-y-auto relative">
      {/* Header */}
      <div className="px-8 h-[90px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">日志查询</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">操作日志与系统异常日志查询</p>
        </div>
      </div>
      <div className="p-8 flex-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
           <span className="text-gray-400">正在进入日志查询系统...</span>
        </div>
      </div>
    </div>
  );
}
