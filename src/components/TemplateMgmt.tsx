import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  ClipboardList, 
  FileCheck, 
  FilePlus, 
  Trash2, 
  Edit2, 
  Eye, 
  Clock, 
  User, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  X,
  ArrowLeft,
  LayoutGrid,
  List as ListIcon,
  MessageSquarePlus,
  GripVertical,
  Settings,
  ChevronDown,
  Check
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DocumentTemplate, TemplateField, TEMPLATE_TYPES, COMMON_TEMPLATE_TYPES } from '@/src/types';
import { MOCK_TEMPLATES } from '@/src/data/mockTemplates';
import { motion, AnimatePresence } from 'motion/react';
import TemplateEditor from './TemplateEditor';
import Pagination from './Pagination';

const TYPE_CONFIG = {
  evidence: { label: '取证单模板', icon: <ClipboardList size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  working_paper: { label: '审计底稿模板', icon: <FileCheck size={18} />, color: 'text-purple-600', bg: 'bg-purple-50' },
  report: { label: '审计报告模板', icon: <FileText size={18} />, color: 'text-green-600', bg: 'bg-green-50' },
  other: { label: '其他文书模板', icon: <FilePlus size={18} />, color: 'text-orange-600', bg: 'bg-orange-50' },
};

export default function TemplateMgmt() {
  const [view, setView] = React.useState<'list' | 'editor'>('list');
  const [activeType, setActiveType] = React.useState<DocumentTemplate['type']>('evidence');
  const [templateTypeFilter, setTemplateTypeFilter] = React.useState<string>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
  const [filterSearch, setFilterSearch] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTypeOptions = TEMPLATE_TYPES.filter(type => 
    type.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const commonTypes = COMMON_TEMPLATE_TYPES.filter(type => 
    type.toLowerCase().includes(filterSearch.toLowerCase())
  );
  
  const otherTypes = TEMPLATE_TYPES.filter(type => 
    !COMMON_TEMPLATE_TYPES.includes(type as any) && 
    type.toLowerCase().includes(filterSearch.toLowerCase())
  );
  const [templates, setTemplates] = React.useState<DocumentTemplate[]>(MOCK_TEMPLATES);
  const [search, setSearch] = React.useState('');
  const [editingTemplate, setEditingTemplate] = React.useState<DocumentTemplate | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState<string | null>(null);
  const [showDetailId, setShowDetailId] = React.useState<string | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 9;

  const filteredTemplates = templates.filter(t => {
    const matchesTemplateType = templateTypeFilter === 'all' || t.templateType === templateTypeFilter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesTemplateType && matchesSearch;
  });

  // Reset to first page when filtering
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, templateTypeFilter]);

  const totalPages = Math.ceil(filteredTemplates.length / pageSize);
  const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAddTemplate = () => {
    setEditingTemplate({
      id: '',
      name: '',
      type: 'other',
      templateType: '',
      scenario: '',
      content: '',
      fields: [],
      prompts: [],
      creator: '当前用户',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isUsed: false,
      version: 1
    });
    setView('editor');
  };

  const handleEditTemplate = (tpl: DocumentTemplate) => {
    setEditingTemplate(tpl);
    setView('editor');
  };

  const handleDelete = (id: string) => {
    const tpl = templates.find(t => t.id === id);
    if (tpl?.isUsed) {
      alert('该模板正在被使用，无法删除');
      return;
    }
    setShowDeleteModal(id);
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      setTemplates(templates.filter(t => t.id !== showDeleteModal));
      setShowDeleteModal(null);
    }
  };

  const handleBatchDelete = () => {
    const usedTemplates = templates.filter(t => selectedIds.includes(t.id) && t.isUsed);
    if (usedTemplates.length > 0) {
      alert(`选中的模板中有 ${usedTemplates.length} 个正在被使用，无法批量删除`);
      return;
    }
    if (confirm(`确定要删除选中的 ${selectedIds.length} 个模板吗？`)) {
      setTemplates(templates.filter(t => !selectedIds.includes(t.id)));
      setSelectedIds([]);
    }
  };

  if (view === 'editor' && editingTemplate) {
    return (
      <TemplateEditor 
        template={editingTemplate}
        onBack={() => {
          setView('list');
          setEditingTemplate(null);
        }}
        onSave={(tpl) => {
          if (tpl.id) {
            setTemplates(templates.map(t => t.id === tpl.id ? tpl : t));
          } else {
            setTemplates([...templates, { ...tpl, id: 'tpl-' + Date.now() }]);
          }
          setView('list');
          setEditingTemplate(null);
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">文书模板管理</h2>
          <p className="text-sm text-gray-500 mt-0.5">标准化审计文书模板，提升编制效率与规范性</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Template Type Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-blue-300 transition-all",
                templateTypeFilter !== 'all' ? "text-blue-600 border-blue-500/20 bg-blue-50/50" : "text-gray-600"
              )}
            >
              <Filter size={14} className={templateTypeFilter !== 'all' ? "text-blue-600" : "text-gray-400"} />
              <span>{templateTypeFilter === 'all' ? '全部文书类型' : templateTypeFilter}</span>
              <ChevronDown size={14} className={cn("text-gray-300 transition-transform", isFilterDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isFilterDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute z-50 top-full right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col w-64 max-h-80"
                >
                  <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text"
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                        placeholder="搜索文书类型..."
                        autoFocus
                        className="w-full h-9 bg-white border border-gray-200 rounded-lg pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 font-bold"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-hide">
                    <div 
                      onClick={() => {
                        setTemplateTypeFilter('all');
                        setIsFilterDropdownOpen(false);
                        setFilterSearch('');
                      }}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between",
                        templateTypeFilter === 'all' 
                          ? "bg-blue-50 text-blue-600" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span>全部</span>
                      {templateTypeFilter === 'all' && <Check size={14} />}
                    </div>
                    
                    <div className="h-[1px] bg-gray-50 mx-2 my-1" />

                    {commonTypes.length > 0 && (
                      <>
                        <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">常用类型</div>
                        {commonTypes.map(type => (
                          <div 
                            key={type}
                            onClick={() => {
                              setTemplateTypeFilter(type);
                              setIsFilterDropdownOpen(false);
                              setFilterSearch('');
                            }}
                            className={cn(
                              "px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between",
                              templateTypeFilter === type 
                                ? "bg-blue-50 text-blue-600" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <span>{type}</span>
                            {templateTypeFilter === type && <Check size={14} />}
                          </div>
                        ))}
                        <div className="h-[1px] bg-gray-50 mx-2 my-1" />
                      </>
                    )}

                    {otherTypes.length > 0 && (
                      <>
                        {commonTypes.length > 0 && (
                          <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">其他类型</div>
                        )}
                        {otherTypes.map(type => (
                          <div 
                            key={type}
                            onClick={() => {
                              setTemplateTypeFilter(type);
                              setIsFilterDropdownOpen(false);
                              setFilterSearch('');
                            }}
                            className={cn(
                              "px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between",
                              templateTypeFilter === type 
                                ? "bg-blue-50 text-blue-600" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <span>{type}</span>
                            {templateTypeFilter === type && <Check size={14} />}
                          </div>
                        ))}
                      </>
                    )}

                    {commonTypes.length === 0 && otherTypes.length === 0 && (
                      <div className="px-4 py-4 text-center text-xs text-gray-400 italic">
                        未找到匹配类型
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索模板名称..."
              className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-3 ml-2">
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBatchDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all text-sm"
              >
                <Trash2 size={16} />
                <span>批量删除 ({selectedIds.length})</span>
              </button>
            )}
            <button 
              onClick={handleAddTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
            >
              <Plus size={18} />
              <span className="font-medium">新增模板</span>
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 flex flex-col">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {paginatedTemplates.map((tpl) => (
              <TemplateCard 
                key={tpl.id} 
                template={tpl} 
                isSelected={selectedIds.includes(tpl.id)}
                onSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
                onEdit={() => handleEditTemplate(tpl)}
                onDelete={() => handleDelete(tpl.id)}
                onView={() => setShowDetailId(tpl.id)}
              />
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">暂无该类型模板</h3>
                <p className="text-gray-500 mt-1">您可以点击右上角按钮新增一个模板</p>
              </div>
            )}
          </div>
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredTemplates.length}
          pageSize={pageSize}
        />
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(null)}
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
                <h3 className="text-lg font-normal text-gray-900 tracking-tight mb-2">确认删除模板？</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  删除后该模板将无法被调用，此操作不可恢复。
                </p>
              </div>
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowDeleteModal(null)}
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

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailId(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-normal text-gray-900 tracking-tight">模板详情预览</h3>
                <button 
                  onClick={() => setShowDetailId(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 bg-gray-50">
                <div className="bg-white shadow-sm border border-gray-200 p-16 min-h-[800px] mx-auto max-w-[210mm] font-serif text-gray-900 leading-relaxed">
                  {templates.find(t => t.id === showDetailId)?.type === 'evidence' ? (
                    <>
                      <div className="text-center mb-12">
                        <h1 className="text-3xl font-normal text-2xl tracking-tight tracking-[0.5em] mb-4">审计取证单</h1>
                        <div className="flex justify-end text-sm">
                          <span>第 &nbsp;&nbsp;&nbsp;&nbsp; 页（共 &nbsp;&nbsp;&nbsp;&nbsp; 页）</span>
                        </div>
                      </div>

                      <div className="space-y-0 text-lg">
                        <table className="w-full border-collapse border border-gray-900 text-sm">
                          <tbody>
                            <tr>
                              <td className="border border-gray-900 p-4 text-center font-normal w-[15%]">项目名称</td>
                              <td className="border border-gray-900 p-4" colSpan={3}></td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-4 text-center font-normal">被审计（调查）<br/>单位或个人</td>
                              <td className="border border-gray-900 p-4" colSpan={3}></td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-4 text-center font-normal">审计（调查）事项</td>
                              <td className="border border-gray-900 p-4" colSpan={3}></td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-4 text-center font-normal w-[15%]">
                                <div className="flex flex-col h-full justify-center gap-6">
                                  <span>审</span>
                                  <span>计</span>
                                  <span>（调 查）</span>
                                  <span>事</span>
                                  <span>项</span>
                                  <span>摘</span>
                                  <span>要</span>
                                </div>
                              </td>
                              <td className="border border-gray-900 p-6 align-top" colSpan={3}>
                                <div className="min-h-[400px]">
                                  <div className="text-center mb-4 text-gray-400 italic">（写事实或汇总审计事项）</div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-4 text-center font-bold">审计人员</td>
                              <td className="border border-gray-900 p-4 w-[35%]"></td>
                              <td className="border border-gray-900 p-4 text-center font-bold w-[15%]">编制日期</td>
                              <td className="border border-gray-900 p-4 w-[35%]">&nbsp;&nbsp;&nbsp;&nbsp; 年 &nbsp;&nbsp;&nbsp;&nbsp; 月 &nbsp;&nbsp;&nbsp;&nbsp; 日</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-4 text-center font-normal">
                                <div className="flex flex-col h-full justify-center gap-4">
                                  <span>证 据</span>
                                  <span>提 供</span>
                                  <span>单 位</span>
                                  <span>意 见</span>
                                </div>
                              </td>
                              <td className="border border-gray-900 p-4 align-top" colSpan={3}>
                                <div className="min-h-[150px] flex flex-col justify-end">
                                  <div className="text-right pr-12 mb-4">（盖章）</div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-4 text-center font-normal">证据提供单位负责人<br/>（签名）</td>
                              <td className="border border-gray-900 p-4"></td>
                              <td className="border border-gray-900 p-4 text-center font-normal">日期</td>
                              <td className="border border-gray-900 p-4">&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-4 text-xs text-gray-500 leading-relaxed">
                          [说明]：1. 审计取证单主要适用于审计事项比较复杂或者取得的审计证据数量较大时的汇总分析。<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 证据提供单位意见栏填写不下的，可另附说明。
                        </div>
                      </div>
                    </>
                  ) : templates.find(t => t.id === showDetailId)?.type === 'working_paper' ? (
                    <>
                      <div className="text-center mb-12">
                        <h1 className="text-3xl font-normal text-2xl tracking-tight tracking-[0.5em] mb-4">审计工作底稿</h1>
                        <div className="flex justify-between text-sm">
                          <div className="flex items-end gap-1">
                            <span>索引号：</span>
                            <div className="w-32 border-b border-gray-900"></div>
                          </div>
                          <span>第 &nbsp;&nbsp;&nbsp;&nbsp; 页（共 &nbsp;&nbsp;&nbsp;&nbsp; 页）</span>
                        </div>
                      </div>

                      <div className="space-y-0 text-lg">
                        <table className="w-full border-collapse border border-gray-900 text-sm">
                          <tbody>
                            <tr>
                              <td className="border border-gray-900 p-4 text-center font-normal w-[15%]">项目名称</td>
                              <td className="border border-gray-900 p-4" colSpan={3}></td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-4 text-center font-normal">审计（调查）<br/>事项</td>
                              <td className="border border-gray-900 p-4" colSpan={3}></td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-4 text-center font-normal">审计人员</td>
                              <td className="border border-gray-900 p-4 w-[35%]"></td>
                              <td className="border border-gray-900 p-4 text-center font-normal w-[15%]">编制日期</td>
                              <td className="border border-gray-900 p-4 w-[35%]">&nbsp;&nbsp;&nbsp;&nbsp; 年 &nbsp;&nbsp;&nbsp;&nbsp; 月 &nbsp;&nbsp;&nbsp;&nbsp; 日</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-6 align-top" colSpan={4}>
                                <div className="min-h-[250px]">
                                  <div className="font-normal mb-4">审计过程：</div>
                                  <div className="text-gray-400 italic text-sm">
                                    （说明实施审计的步骤和方法、所取得的审计证据的名称和来源；多个底稿间共用审计证据、且证据附在其他底稿后的，需注明“其中，审计证据附在号底稿后”）
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-6 align-top" colSpan={4}>
                                <div className="min-h-[300px]">
                                  <div className="font-normal mb-4">审计认定的事实摘要及审计结论：</div>
                                  <div className="text-gray-400 italic text-sm">
                                    （审计结论包括未发现问题的结论和已发现问题的结论；对已发现问题的结论，需说明得出结论所依据的规定和标准、法律法规具体条款）
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-6 align-top" colSpan={4}>
                                <div className="min-h-[150px]">
                                  <div className="font-normal mb-4">审核意见：</div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-900 p-4 text-center font-normal w-[15%]">审核人员</td>
                              <td className="border border-gray-900 p-4 w-[35%]"></td>
                              <td className="border border-gray-900 p-4 text-center font-normal w-[15%]">审核日期</td>
                              <td className="border border-gray-900 p-4 w-[35%]">&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-4 text-sm">
                          附 件 &nbsp;&nbsp;&nbsp;&nbsp; 页
                        </div>
                      </div>
                    </>
                  ) : templates.find(t => t.id === showDetailId)?.type === 'report' ? (
                    <>
                      <div className="text-center mb-12">
                        <h1 className="text-3xl font-normal text-2xl tracking-tight tracking-[0.2em] mb-8">审计报告</h1>
                        <div className="flex justify-center items-end gap-2 text-sm">
                          <span>编号：</span>
                          <div className="w-64 border-b border-gray-900"></div>
                        </div>
                      </div>

                      <div className="space-y-12 text-lg">
                        {/* 一、审计概况 */}
                        <section>
                          <h2 className="font-normal text-xl tracking-tight text-xl mb-4">一、审计概况</h2>
                          <div className="space-y-8 pl-6">
                            <div>
                              <h3 className="font-normal text-lg tracking-tight mb-3">（一）审计依据</h3>
                              <p className="text-sm text-gray-400 italic">（填写审计依据的法律法规、指令文件等）</p>
                              <div className="min-h-[4em] border-b border-gray-100"></div>
                            </div>
                            <div>
                              <h3 className="font-normal text-lg tracking-tight mb-3">（二）审计范围</h3>
                              <div className="space-y-4">
                                <div className="flex items-end gap-2">
                                  <span>审计期间：</span>
                                  <div className="flex-1 border-b border-gray-900"></div>
                                </div>
                                <div className="flex items-end gap-2">
                                  <span>审计对象：</span>
                                  <div className="flex-1 border-b border-gray-900"></div>
                                </div>
                                <div className="flex items-end gap-2">
                                  <span>审计内容：</span>
                                  <div className="flex-1 border-b border-gray-900"></div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-normal text-lg tracking-tight mb-3">（三）审计方法</h3>
                              <p className="text-sm text-gray-400 italic">（填写审计采用的主要方法）</p>
                              <div className="min-h-[4em] border-b border-gray-100"></div>
                            </div>
                            <div>
                              <h3 className="font-normal text-lg tracking-tight mb-3">（四）审计时间</h3>
                              <p className="text-sm text-gray-400 italic">（填写审计起止时间、现场审计时间、报告撰写时间等）</p>
                              <div className="min-h-[4em] border-b border-gray-100"></div>
                            </div>
                          </div>
                        </section>

                        {/* 二、审计总体评价 */}
                        <section>
                          <h2 className="font-normal text-xl tracking-tight text-xl mb-4">二、审计总体评价</h2>
                          <div className="pl-6">
                            <p className="text-sm text-gray-400 italic mb-4">（填写对被审计单位财政预算管理工作的总体评价）</p>
                            <div className="min-h-[8em] border border-gray-200 p-4 rounded bg-gray-50/30"></div>
                          </div>
                        </section>

                        {/* 三、审计发现的问题及整改建议 */}
                        <section>
                          <h2 className="font-normal text-xl tracking-tight text-xl mb-4">三、审计发现的问题及整改建议</h2>
                          <div className="space-y-10 pl-6">
                            <div className="border-l-4 border-gray-100 pl-6">
                              <h3 className="font-normal text-lg tracking-tight mb-4">（一）[问题类别名称]</h3>
                              <div className="space-y-6">
                                <div>
                                  <p className="font-bold text-base mb-2">具体问题</p>
                                  <p className="text-sm text-gray-400 italic mb-2">（填写问题发生的时间、主体、金额、具体情节、造成的影响）</p>
                                  <div className="min-h-[6em] border-b border-gray-100"></div>
                                </div>
                                <div>
                                  <p className="font-bold text-base mb-2">整改建议</p>
                                  <p className="text-sm text-gray-400 italic mb-2">（填写针对性的整改建议）</p>
                                  <div className="min-h-[4em] border-b border-gray-100"></div>
                                </div>
                              </div>
                            </div>

                            <div className="border-l-4 border-gray-100 pl-6">
                              <h3 className="font-normal text-lg tracking-tight mb-4">（二）[问题类别名称]</h3>
                              <div className="space-y-6">
                                <div>
                                  <p className="font-bold text-base mb-2">具体问题</p>
                                  <p className="text-sm text-gray-400 italic mb-2">（同上）</p>
                                  <div className="min-h-[6em] border-b border-gray-100"></div>
                                </div>
                                <div>
                                  <p className="font-bold text-base mb-2">整改建议</p>
                                  <p className="text-sm text-gray-400 italic mb-2">（同上）</p>
                                  <div className="min-h-[4em] border-b border-gray-100"></div>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 text-center italic">（按实际需要增加问题类别）</p>
                          </div>
                        </section>

                        {/* 四、审计结论 */}
                        <section>
                          <h2 className="font-normal text-xl tracking-tight text-xl mb-4">四、审计结论</h2>
                          <div className="pl-6">
                            <p className="text-sm text-gray-400 italic mb-4">（填写审计总体结论、整改要求、跟踪检查安排等）</p>
                            <div className="min-h-[8em] border border-gray-200 p-4 rounded bg-gray-50/30"></div>
                          </div>
                        </section>

                        {/* 五、其他事项 */}
                        <section>
                          <h2 className="font-normal text-xl tracking-tight text-xl mb-4">五、其他事项</h2>
                          <div className="pl-6 space-y-6">
                            <div>
                              <p className="text-sm text-gray-400 italic mb-2">（填写报告使用范围、资料真实性声明等）</p>
                              <div className="min-h-[3em] border-b border-gray-100"></div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400 italic mb-2">（填写异议复核程序等）</p>
                              <div className="min-h-[3em] border-b border-gray-100"></div>
                            </div>
                          </div>
                        </section>

                        {/* 六、附件 */}
                        <section>
                          <h2 className="font-normal text-xl tracking-tight text-xl mb-4">六、附件</h2>
                          <ul className="pl-10 list-decimal space-y-2 text-base">
                            <li>审计工作底稿</li>
                            <li>相关佐证材料</li>
                            <li>被审计单位提供的相关说明材料</li>
                            <li>延伸审计相关资料</li>
                            <li>其他相关附件</li>
                          </ul>
                        </section>

                        {/* 签名区 */}
                        <div className="mt-20 pt-12 border-t border-gray-200 space-y-12">
                          <div className="grid grid-cols-1 gap-6 max-w-md ml-auto">
                            <div className="flex items-end gap-2">
                              <span className="whitespace-nowrap">审计组组长：</span>
                              <div className="flex-1 border-b border-gray-900"></div>
                            </div>
                            <div className="flex items-end gap-2">
                              <span className="whitespace-nowrap">审计组成员：</span>
                              <div className="flex-1 border-b border-gray-900"></div>
                            </div>
                            <div className="flex items-end gap-2">
                              <span className="whitespace-nowrap">审计报告出具日期：</span>
                              <div className="flex-1 border-b border-gray-900"></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-6 max-w-md ml-auto pt-8 border-t border-dashed border-gray-100">
                            <div className="flex items-end gap-2">
                              <span className="whitespace-nowrap">被审计单位签收人：</span>
                              <div className="flex-1 border-b border-gray-900"></div>
                            </div>
                            <div className="flex items-end gap-2">
                              <span className="whitespace-nowrap">签收日期：</span>
                              <div className="flex-1 border-b border-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
                      <FileText size={48} className="mb-4 opacity-20" />
                      <p>该类型模板预览功能开发中...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-8 py-6 bg-white border-t border-gray-100 flex items-center justify-end">
                <button 
                  onClick={() => setShowDetailId(null)}
                  className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  关闭预览
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TemplateCard({ template, isSelected, onSelect, onEdit, onDelete, onView }: { 
  template: DocumentTemplate; 
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: () => void; 
  onDelete: () => void;
  onView: () => void;
}) {
  return (
    <div className={cn(
      "bg-white border rounded-2xl p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all group relative overflow-hidden cursor-pointer",
      isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-100"
    )} onClick={onView}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
          TYPE_CONFIG[template.type].bg,
          TYPE_CONFIG[template.type].color
        )}>
          {TYPE_CONFIG[template.type].icon}
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={(e) => { e.stopPropagation(); onSelect(template.id); }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          {template.isUsed && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider border border-blue-100">
              使用中
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {template.name}
        </h3>
        {template.templateType && (
          <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
            {template.templateType}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed h-8">
          {template.scenario}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <User size={12} />
            <span>{template.creator}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Clock size={12} />
            <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onView(); }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="查看详情"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="编辑"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="删除"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
