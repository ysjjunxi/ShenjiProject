import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { approvalStore, ApprovalRecord } from '../data/mockApprovals';

export default function DataSourceApproval() {
  const [data, setData] = useState<ApprovalRecord[]>(approvalStore.snapshot);
  const [searchProject, setSearchProject] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    return approvalStore.subscribe(() => {
      setData(approvalStore.snapshot);
    });
  }, []);

  const filteredData = data.filter(item => {
    const matchProject = item.project.toLowerCase().includes(searchProject.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchDate = dateRange === '' || item.applyTime.includes(dateRange);
    return matchProject && matchStatus && matchDate;
  });

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    approvalStore.updateApprovalStatus(id, action);
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md border border-green-200"><CheckCircle2 size={12} /> 已通过</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-md border border-red-200"><XCircle size={12} /> 已驳回</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-md border border-amber-200"><Clock size={12} /> 待审批</span>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10 sticky top-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">数据审批</h2>
          <p className="text-sm text-gray-500 mt-1">审批各项目成员对其业务数据库接入和分析的申请。</p>
        </div>
      </div>

      <div className="p-8 flex-1 overflow-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
          {/* Filters */}
          <div className="p-5 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="按审计项目查询..."
                value={searchProject}
                onChange={e => setSearchProject(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
            </div>
            
            <div className="relative min-w-[140px]">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full h-10 pl-10 pr-8 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none font-medium text-gray-700"
              >
                <option value="all">所有状态</option>
                <option value="pending">待审批</option>
                <option value="approved">已通过</option>
                <option value="rejected">已驳回</option>
              </select>
            </div>

            <div className="relative min-w-[160px]">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="date" 
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">审批项目</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">申请人</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">申请数据库</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">申请备注</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">发起/审批时间</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">审批人</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">审批状态</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map(row => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">{row.project}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">{row.applicant}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{row.database}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-[180px] truncate" title={row.applyNote}>{row.applyNote}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-500">发起: {row.applyTime}</div>
                      {row.approveTime !== '-' && <div className="text-xs text-gray-400 mt-1">审批: {row.approveTime}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-sm font-medium", row.approver === '-' ? 'text-gray-400' : 'text-gray-700')}>{row.approver}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {row.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleAction(row.id, 'approved')}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all shadow-blue-500/20"
                          >
                            通过
                          </button>
                          <button 
                            onClick={() => handleAction(row.id, 'rejected')}
                            className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-all"
                          >
                            驳回
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                      没有符合条件的审批记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
