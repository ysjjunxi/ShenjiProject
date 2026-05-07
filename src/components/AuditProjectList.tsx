import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  User, 
  FileText,
  ChevronRight,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuditProject, ProjectStatus } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PROJECTS } from '../data/mockProjects';

interface AuditProjectListProps {
  onSelectProject: (id: string) => void;
}

const STATUS_MAP: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  authorizing: { label: '数据申请中', color: 'text-blue-600', bg: 'bg-blue-50' },
  suspicion: { label: '疑点生成中', color: 'text-orange-600', bg: 'bg-orange-50' },
  evidence: { label: '取证中', color: 'text-purple-600', bg: 'bg-purple-50' },
  working_paper: { label: '底稿编制中', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  report_generated: { label: '报告已生成', color: 'text-green-600', bg: 'bg-green-50' },
};

export default function AuditProjectList({ onSelectProject }: AuditProjectListProps) {
  const [search, setSearch] = React.useState('');
  const [projects, setProjects] = React.useState<AuditProject[]>(MOCK_PROJECTS);
  const [editingProject, setEditingProject] = React.useState<AuditProject | null>(null);
  const [deletingProjectId, setDeletingProjectId] = React.useState<string | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [createMode, setCreateMode] = React.useState<'import' | 'custom'>('import');
  const [newProject, setNewProject] = React.useState<Partial<AuditProject>>({
    name: '', code: '', object: '', period: '', members: [{ name: '', isLeader: true }]
  });

  const DATASOURCE_PROJECTS = [
    { id: 'ds1', name: '2024年度集团财务综合审计', code: 'DS-2024-001', object: '集团本部财务部', period: '2024-01-01 至 2024-12-31' },
    { id: 'ds2', name: 'A分公司三公经费专项审计', code: 'DS-2024-002', object: 'A分公司', period: '2024-01-01 至 2024-06-30' },
    { id: 'ds3', name: 'B事业部负责人离任审计', code: 'DS-2024-003', object: 'B事业部', period: '2020-01-01 至 2024-03-31' },
    { id: 'ds4', name: '第一季度工程物资采购专项审计', code: 'DS-2024-004', object: '工程建设公司', period: '2024-01-01 至 2024-03-31' }
  ];

  const filtered = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
      setEditingProject(null);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const projectToCreate: AuditProject = {
      id: `new-${Date.now()}`,
      name: newProject.name || '',
      code: newProject.code || '',
      object: newProject.object || '',
      period: newProject.period || '',
      status: 'authorizing',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      members: newProject.members?.length ? newProject.members : [{ name: '当前用户', isLeader: true }]
    };
    setProjects([projectToCreate, ...projects]);
    setIsCreateModalOpen(false);
  };

  const openCreateModal = () => {
    setNewProject({ name: '', code: '', object: '', period: '', members: [{ name: '', isLeader: true }] });
    setCreateMode('import');
    setIsCreateModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingProjectId) {
      setProjects(projects.filter(p => p.id !== deletingProjectId));
      setDeletingProjectId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">审计项目列表</h2>
          <p className="text-sm text-gray-500 mt-1">管理您的所有审计项目全流程</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索项目名称或编码..."
              className="w-80 h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
          >
            <Plus size={18} />
            <span className="font-medium">新增项目</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filtered.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => onSelectProject(project.id)}
              onEdit={() => setEditingProject(project)}
              onDelete={() => setDeletingProjectId(project.id)}
            />
          ))}
          
          {filtered.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">未找到相关项目</h3>
              <p className="text-gray-500 mt-1">请尝试更换搜索关键词</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-normal tracking-tight text-gray-900">新增审计项目</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="flex px-6 pt-3 gap-6 border-b border-gray-100">
                <button 
                  onClick={() => setCreateMode('import')} 
                  className={cn("pb-3 text-sm font-medium transition-colors border-b-2", createMode === 'import' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700")}
                >
                  选择已接入项目
                </button>
                <button 
                  onClick={() => setCreateMode('custom')} 
                  className={cn("pb-3 text-sm font-medium transition-colors border-b-2", createMode === 'custom' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700")}
                >
                  自定义新增
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="flex-1 overflow-y-auto p-6 space-y-4">
                {createMode === 'import' && (
                  <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">选择已接入的审计项目</label>
                    <select 
                      className="w-full h-10 bg-white border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
                      onChange={(e) => {
                        const sel = DATASOURCE_PROJECTS.find(p => p.id === e.target.value);
                        if (sel) {
                          setNewProject({ ...newProject, name: sel.name, code: sel.code, object: sel.object, period: sel.period });
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>请选择数据源项目...</option>
                      {DATASOURCE_PROJECTS.map(dp => (
                        <option key={dp.id} value={dp.id}>{dp.name} ({dp.code})</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <AlertCircle size={12} className="text-blue-500"/>
                      选择后将自动带入单位基础信息
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                  <input 
                    type="text" 
                    required
                    value={newProject.name}
                    onChange={e => setNewProject({...newProject, name: e.target.value})}
                    placeholder="请输入项目名称"
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目编码</label>
                  <input 
                    type="text" 
                    required
                    value={newProject.code}
                    onChange={e => setNewProject({...newProject, code: e.target.value})}
                    placeholder="例如：DS-2024-001"
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">审计对象</label>
                    <input 
                      type="text" 
                      required
                      value={newProject.object}
                      onChange={e => setNewProject({...newProject, object: e.target.value})}
                      placeholder="审计单位或部门"
                      className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">审计周期</label>
                    <input 
                      type="text" 
                      required
                      value={newProject.period}
                      onChange={e => setNewProject({...newProject, period: e.target.value})}
                      placeholder="例如：2024年度"
                      className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                    <span>项目成员</span>
                    <button 
                      type="button"
                      onClick={() => setNewProject({
                        ...newProject, 
                        members: [...(newProject.members || []), { name: '', isLeader: false }]
                      })}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Plus size={12} /> 添加成员
                    </button>
                  </label>
                  <div className="space-y-2">
                    {(newProject.members || []).map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input 
                          type="text" 
                          placeholder="成员姓名"
                          required
                          value={member.name}
                          onChange={e => {
                            const newMembers = [...(newProject.members || [])];
                            newMembers[idx].name = e.target.value;
                            setNewProject({...newProject, members: newMembers});
                          }}
                          className="flex-1 h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                        />
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={member.isLeader}
                            onChange={e => {
                              const newMembers = [...(newProject.members || [])];
                              newMembers[idx].isLeader = e.target.checked;
                              setNewProject({...newProject, members: newMembers});
                            }}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-500">负责人</span>
                        </label>
                        <button 
                          type="button"
                          onClick={() => {
                            const newMembers = (newProject.members || []).filter((_, i) => i !== idx);
                            setNewProject({...newProject, members: newMembers});
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end gap-3 rounded-b-3xl">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    确认创建
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProject(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">编辑审计项目</h3>
                <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20}/>
                </button>
              </div>
              <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                  <input 
                    type="text" 
                    required
                    value={editingProject.name}
                    onChange={e => setEditingProject({...editingProject, name: e.target.value})}
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目编码</label>
                  <input 
                    type="text" 
                    required
                    value={editingProject.code}
                    onChange={e => setEditingProject({...editingProject, code: e.target.value})}
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">审计对象</label>
                  <input 
                    type="text" 
                    required
                    value={editingProject.object}
                    onChange={e => setEditingProject({...editingProject, object: e.target.value})}
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">审计周期</label>
                  <input 
                    type="text" 
                    required
                    value={editingProject.period}
                    onChange={e => setEditingProject({...editingProject, period: e.target.value})}
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                    <span>项目成员</span>
                    <button 
                      type="button"
                      onClick={() => setEditingProject({
                        ...editingProject, 
                        members: [...editingProject.members, { name: '', isLeader: false }]
                      })}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Plus size={12} /> 添加成员
                    </button>
                  </label>
                  <div className="space-y-2">
                    {editingProject.members.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input 
                          type="text" 
                          placeholder="姓名"
                          value={member.name}
                          onChange={e => {
                            const newMembers = [...editingProject.members];
                            newMembers[idx].name = e.target.value;
                            setEditingProject({...editingProject, members: newMembers});
                          }}
                          className="flex-1 h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                        />
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={member.isLeader}
                            onChange={e => {
                              const newMembers = [...editingProject.members];
                              newMembers[idx].isLeader = e.target.checked;
                              setEditingProject({...editingProject, members: newMembers});
                            }}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-500">负责人</span>
                        </label>
                        <button 
                          type="button"
                          onClick={() => {
                            const newMembers = editingProject.members.filter((_, i) => i !== idx);
                            setEditingProject({...editingProject, members: newMembers});
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    保存修改
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deletingProjectId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingProjectId(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-normal text-gray-900 tracking-tight mb-2">确认删除项目？</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  删除后该项目及其所有相关数据将不可恢复。
                </p>
              </div>
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setDeletingProjectId(null)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({ project, onClick, onEdit, onDelete }: { project: AuditProject; onClick: () => void; onEdit: () => void; onDelete: () => void }) {
  const status = STATUS_MAP[project.status];

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer group relative overflow-hidden"
    >
      {/* Status Badge */}
      <div className={cn(
        "absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider",
        status.bg,
        status.color
      )}>
        {status.label}
      </div>

      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 block">
              {project.code}
            </span>
            <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight pr-2">
              {project.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="编辑项目"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="删除项目"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-4 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User size={14} className="shrink-0" />
            <span className="truncate">审计对象：{project.object}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} className="shrink-0" />
            <span className="truncate">审计周期：{project.period}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {project.members.map((m, i) => (
              <div 
                key={i} 
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1",
                  m.isLeader ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-gray-50 text-gray-500 border border-gray-100"
                )}
              >
                <User size={10} />
                <span>{m.name}</span>
                {m.isLeader && <span className="scale-75 origin-left opacity-70">(负责人)</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            创建于 {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
