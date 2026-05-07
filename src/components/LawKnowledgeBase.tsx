import React from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  Edit2, 
  FileText, 
  FileCode,
  ExternalLink, 
  ChevronRight, 
  ChevronLeft,
  Filter, 
  Calendar, 
  Building2, 
  BookOpen, 
  MessageSquare, 
  ArrowLeft,
  X,
  Save,
  Upload,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileDown,
  MoreVertical,
  Send,
  History,
  Info,
  Layers,
  FileCheck,
  FileUp,
  Zap,
  Paperclip
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { LawDocument, LawClause, LawQA, QAMessage } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

const CATEGORIES = [
  '财政审计', '企业审计', '金融审计', '资源环境审计', '涉外审计', '经济责任审计', '其他'
];

const MOCK_LAWS: LawDocument[] = [
  {
    id: 'law1',
    title: '中华人民共和国预算法',
    department: '全国人民代表大会',
    publishDate: '2014-08-31',
    effectiveDate: '2015-01-01',
    category: '财政审计',
    description: '为了规范政府预算行为，强化预算约束，健全民主集中制，加强对预算的审查监督，根据宪法，制定本法。',
    content: '第一条 为了规范政府预算行为，强化预算约束，健全民主集中制，加强对预算的审查监督，根据宪法，制定本法。\n第二条 预算、决算的编制、审查、批准、监督，以及预算的执行和调整，依照本法执行。\n第三条 国家实行一级政府一级预算，设立中央，省、自治区、直辖市，设区的市、自治州，县、自治县、不设区的市、市辖区，乡、民族乡、镇五级预算。',
    clauses: [
      { id: 'c1', title: '第一条', content: '立法目的' },
      { id: 'c2', title: '第二条', content: '适用范围' },
      { id: 'c3', title: '第三条', content: '预算级次' }
    ],
    creator: '系统管理员',
    createdAt: Date.now() - 86400000 * 100,
    updatedAt: Date.now() - 86400000 * 10
  },
  {
    id: 'law2',
    title: '中华人民共和国审计法',
    department: '全国人民代表大会常务委员会',
    publishDate: '2021-10-23',
    effectiveDate: '2022-01-01',
    category: '财政审计',
    description: '为了加强国家的审计监督，维护国家财政经济秩序，提高财政资金使用效益，促进廉政建设，保障国民经济和社会健康发展，根据宪法，制定本法。',
    content: '第一条 为了加强国家的审计监督，维护国家财政经济秩序，提高财政资金使用效益，促进廉政建设，保障国民经济和社会健康发展，根据宪法，制定本法。\n第二条 国家实行审计监督制度。国务院各部门和地方各级人民政府及其各部门的财政收支，国有的金融机构和企业事业组织的财务收支，以及其他依照本法规定应当接受审计监督的财政收支、财务收支，依照本法规定接受审计监督。',
    clauses: [
      { id: 'c1', title: '第一条', content: '立法目的' },
      { id: 'c2', title: '第二条', content: '审计监督制度' }
    ],
    creator: '系统管理员',
    createdAt: Date.now() - 86400000 * 50,
    updatedAt: Date.now() - 86400000 * 5
  }
];

interface LawKnowledgeBaseProps {
  readOnly?: boolean;
  title?: string;
  onBack?: () => void;
}

export default function LawKnowledgeBase({ readOnly, title: propTitle, onBack }: LawKnowledgeBaseProps) {
  const [view, setView] = React.useState<'list' | 'detail' | 'qa' | 'chunks'>('list');
  const [laws, setLaws] = React.useState<LawDocument[]>(MOCK_LAWS);
  const [selectedLaw, setSelectedLaw] = React.useState<LawDocument | null>(null);
  const [search, setSearch] = React.useState({ title: '', department: '', date: '' });
  const [editingLaw, setEditingLaw] = React.useState<LawDocument | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<any[]>([
    {
      id: 'file1',
      name: '法律文书.txt',
      chunkStrategy: 'hierarchy',
      chunkSize: 512,
      chunkOverlap: 50,
      separator: '\\n',
    }
  ]);

  // View Chunks state
  const [viewingLawChunks, setViewingLawChunks] = React.useState<LawDocument | null>(null);

  const filteredLaws = laws.filter(law => {
    return law.title.includes(search.title) && 
           law.department.includes(search.department) &&
           (search.date === '' || law.publishDate.includes(search.date));
  });

  const handleAdd = () => {
    setUploadedFiles([]);
    setShowUploadModal(true);
  };

  const handleSave = (law: LawDocument) => {
    if (law.id) {
      setLaws(laws.map(l => l.id === law.id ? law : l));
    } else {
      setLaws([...laws, { ...law, id: 'law-' + Date.now() }]);
    }
    setEditingLaw(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该法律法规吗？删除后不可恢复。')) {
      setLaws(laws.filter(l => l.id !== id));
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 条法律法规吗？删除后不可恢复。`)) {
      setLaws(laws.filter(l => !selectedIds.includes(l.id)));
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDownload = (law: LawDocument, type: 'original' | 'text') => {
    const fileName = `${law.title}_${law.publishDate}.${type === 'text' ? 'md' : 'pdf'}`;
    alert(`正在准备下载: ${fileName}\n保存路径: ~/Downloads/AuditKnowledge/`);
  };

  const handleBatchDownload = () => {
    alert(`正在批量打包下载 ${selectedIds.length} 条法律法规...`);
  };

  if (view === 'detail' && selectedLaw) {
    return <LawDetail law={selectedLaw} onBack={() => setView('list')} onStartQA={() => setView('qa')} />;
  }

  if (view === 'qa') {
    return <LawQAInterface law={selectedLaw} onBack={() => setView('detail')} />;
  }

  if (view === 'chunks' && viewingLawChunks) {
    return <SharedChunkListView doc={viewingLawChunks} type="law" onBack={() => setView('list')} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all active:scale-90 mr-2"
            >
              <ChevronRight className="rotate-180" size={20} />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{propTitle || '法律法规知识库'}</h2>
            <p className="text-sm text-gray-500 mt-0.5 whitespace-nowrap">{propTitle ? `正在浏览 ${propTitle} 下的文档库` : '集中管理审计相关法律法规，支撑智能问答与合规查询'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <div className="relative w-40">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                value={search.title}
                onChange={(e) => setSearch({ ...search, title: e.target.value })}
                placeholder="法规名称..."
                className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium"
              />
            </div>
            <div className="relative w-32">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                value={search.department}
                onChange={(e) => setSearch({ ...search, department: e.target.value })}
                placeholder="发布部门..."
                className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <>
                <button 
                  onClick={handleBatchDownload}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-xs font-bold"
                >
                  <Download size={16} />
                  <span>下载 ({selectedIds.length})</span>
                </button>
                {!readOnly && (
                  <button 
                    onClick={handleBatchDelete}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-xs font-bold"
                  >
                    <Trash2 size={16} />
                    <span>删除 ({selectedIds.length})</span>
                  </button>
                )}
              </>
            )}
            {!readOnly && (
              <button 
                onClick={handleAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all font-bold"
              >
                <Plus size={16} />
                <span>上传资料</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-7xl mx-auto flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white relative z-10 transition-all">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-normal text-lg tracking-tight text-gray-900">法律法规列表</h3>
              {selectedIds.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">
                  已选 {selectedIds.length} 项
                </span>
              )}
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  <th className="px-6 py-3 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length === filteredLaws.length && filteredLaws.length > 0}
                      onChange={() => {
                        if (selectedIds.length === filteredLaws.length) setSelectedIds([]);
                        else setSelectedIds(filteredLaws.map(l => l.id));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 font-bold">法规名称</th>
                  <th className="px-4 py-3 font-bold">发布部门</th>
                  <th className="px-4 py-3 font-bold">发布日期</th>
                  <th className="px-4 py-3 font-bold">生效日期</th>
                  <th className="px-6 py-3 text-right font-bold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLaws.length > 0 ? filteredLaws.map((law) => (
                  <tr key={law.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(law.id)}
                        onChange={() => toggleSelect(law.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => { setSelectedLaw(law); setView('detail'); }}
                        className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors text-left"
                      >
                        {law.title}
                      </button>
                      <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded uppercase font-black text-[9px]">{law.category}</span>
                        <span className="line-clamp-1 font-medium">{law.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 font-bold">{law.department}</td>
                    <td className="px-4 py-4 text-xs text-gray-500 font-bold">{law.publishDate}</td>
                    <td className="px-4 py-4 text-xs text-gray-500 font-bold">{law.effectiveDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 transition-all focus-within:opacity-100">
                        <button 
                          onClick={() => { setViewingLawChunks(law); setView('chunks'); }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white shadow-sm border border-transparent hover:border-gray-100 rounded-lg transition-all font-bold"
                          title="查看切片详情"
                        >
                          <Layers size={16} />
                        </button>
                        {!readOnly && (
                          <>
                            <button 
                              onClick={() => setEditingLaw(law)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white shadow-sm border border-transparent hover:border-gray-100 rounded-lg transition-all"
                              title="编辑"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(law.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-white shadow-sm border border-transparent hover:border-gray-100 rounded-lg transition-all"
                              title="删除"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                        <div className="relative group/popover inline-block">
                          <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white shadow-sm border border-transparent hover:border-gray-100 rounded-lg transition-all" title="下载">
                            <Download size={16} />
                          </button>
                          <div className="absolute right-0 bottom-full mb-2 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover/popover:opacity-100 group-hover/popover:visible pt-2 pb-2 z-20 transition-all">
                            <button onClick={() => handleDownload(law, 'original')} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                              <Download size={14} /> 原格式下载
                            </button>
                            <button onClick={() => handleDownload(law, 'text')} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                              <FileCode size={14} /> Markdown下载
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center">
                        <BookOpen size={48} className="text-gray-100 mb-4" strokeWidth={1} />
                        <p className="text-sm text-gray-400 font-black tracking-widest uppercase">No laws found matching your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between font-bold">
             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-[#475569]">
                展示本页 {filteredLaws.length} 条 · 总数据量 {laws.length} 条
             </p>
             <div className="flex items-center gap-2">
                <button disabled className="p-1.5 hover:bg-white rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-transparent hover:border-gray-100 shadow-sm">
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-lg shadow-blue-100 transition-all">1</button>
                </div>
                <button disabled className="p-1.5 hover:bg-white rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-transparent hover:border-gray-100 shadow-sm">
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingLaw && (
          <LawEditor 
            law={editingLaw} 
            onClose={() => setEditingLaw(null)} 
            onSave={handleSave} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Upload size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-normal tracking-tight text-gray-900">上传法规文档</h3>
                    <p className="text-[11px] text-gray-400 font-medium font-bold mt-0.5 uppercase tracking-wider">支持 docx, pdf, wps 等主流格式</p>
                  </div>
                </div>
                <button onClick={() => setShowUploadModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-10 flex-1">
                {/* Section 1: 上传文件 */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                    <span>上传文件</span>
                    <span className="text-xs font-normal text-gray-400 ml-2">(非必填)</span>
                  </h4>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-white group hover:border-blue-400 focus-within:border-blue-400 transition-all cursor-pointer shadow-sm">
                     <div className="w-12 h-12 bg-gray-50 group-hover:bg-blue-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                        <Upload size={24} />
                     </div>
                     <div className="text-center">
                        <h4 className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">点击选择文件，或将文件拖拽到此处</h4>
                        <p className="text-[11px] text-gray-400 mt-1">支持 TXT, MD, PDF, Word, Excel, PPTX, CSV 等格式</p>
                     </div>
                  </div>
                </div>

                {/* Section 2: 分片配置 */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                     <span>切分参数设置</span>
                     <span className="text-xs font-normal text-gray-400 ml-2">(非必填)</span>
                  </h4>
                  
                  <div className="space-y-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={file.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                         <div className="px-5 py-4 bg-gray-50/80 flex items-center justify-between border-b border-gray-100">
                            <div className="flex items-center gap-3">
                               <Paperclip size={16} className="text-blue-500" />
                               <span className="text-sm font-bold text-gray-800">{file.name}</span>
                            </div>
                            <button className="text-red-400 hover:text-red-600 text-xs font-bold transition-colors">
                              删除
                            </button>
                         </div>
                         
                         <div className="p-6 space-y-6">
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                               <label className="text-sm font-bold text-gray-700 mr-2">切分类型：</label>
                               <label className="flex items-center gap-2 cursor-pointer group">
                                  <div className={cn(
                                    "w-4 h-4 rounded-full border flex flex-col items-center justify-center transition-all",
                                    file.chunkStrategy === 'hierarchy' ? "border-blue-600 bg-blue-600" : "border-gray-300 group-hover:border-blue-400"
                                  )}>
                                     {file.chunkStrategy === 'hierarchy' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                  </div>
                                  <input 
                                    type="radio" 
                                    className="hidden" 
                                    checked={file.chunkStrategy === 'hierarchy'}
                                    onChange={() => {
                                      const newFiles = [...uploadedFiles];
                                      newFiles[index].chunkStrategy = 'hierarchy';
                                      setUploadedFiles(newFiles);
                                    }}
                                  />
                                  <span className="text-sm font-medium text-gray-700">目录层级切分</span>
                               </label>

                               <label className="flex items-center gap-2 cursor-pointer group">
                                  <div className={cn(
                                    "w-4 h-4 rounded-full border flex flex-col items-center justify-center transition-all",
                                    file.chunkStrategy === 'snippet' ? "border-blue-600 bg-blue-600" : "border-gray-300 group-hover:border-blue-400"
                                  )}>
                                     {file.chunkStrategy === 'snippet' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                  </div>
                                  <input 
                                    type="radio" 
                                    className="hidden" 
                                    checked={file.chunkStrategy === 'snippet'}
                                    onChange={() => {
                                      const newFiles = [...uploadedFiles];
                                      newFiles[index].chunkStrategy = 'snippet';
                                      setUploadedFiles(newFiles);
                                    }}
                                  />
                                  <span className="text-sm font-medium text-gray-700">片段切分</span>
                               </label>

                               <label className="flex items-center gap-2 cursor-pointer group">
                                  <div className={cn(
                                    "w-4 h-4 rounded-full border flex flex-col items-center justify-center transition-all",
                                    file.chunkStrategy === 'separator' ? "border-blue-600 bg-blue-600" : "border-gray-300 group-hover:border-blue-400"
                                  )}>
                                     {file.chunkStrategy === 'separator' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                  </div>
                                  <input 
                                    type="radio" 
                                    className="hidden" 
                                    checked={file.chunkStrategy === 'separator'}
                                    onChange={() => {
                                      const newFiles = [...uploadedFiles];
                                      newFiles[index].chunkStrategy = 'separator';
                                      setUploadedFiles(newFiles);
                                    }}
                                  />
                                  <span className="text-sm font-medium text-gray-700">分隔符切分</span>
                               </label>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                               {file.chunkStrategy === 'snippet' && (
                                 <div className="grid grid-cols-2 gap-6">
                                   <div className="space-y-1">
                                      <label className="text-xs font-bold text-gray-600">片段大小 (Chunk Size)</label>
                                      <input 
                                        type="number"
                                        value={file.chunkSize}
                                        onChange={(e) => {
                                          const newFiles = [...uploadedFiles];
                                          newFiles[index].chunkSize = parseInt(e.target.value);
                                          setUploadedFiles(newFiles);
                                        }}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      />
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-xs font-bold text-gray-600">重叠大小 (Chunk Overlap)</label>
                                      <input 
                                        type="number"
                                        value={file.chunkOverlap}
                                        onChange={(e) => {
                                          const newFiles = [...uploadedFiles];
                                          newFiles[index].chunkOverlap = parseInt(e.target.value);
                                          setUploadedFiles(newFiles);
                                        }}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      />
                                   </div>
                                 </div>
                               )}

                               {file.chunkStrategy === 'separator' && (
                                 <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-600">分隔符 (Separator)</label>
                                    <input 
                                      type="text"
                                      value={file.separator}
                                      onChange={(e) => {
                                        const newFiles = [...uploadedFiles];
                                        newFiles[index].separator = e.target.value;
                                        setUploadedFiles(newFiles);
                                      }}
                                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      placeholder="例如：\n\n"
                                    />
                                 </div>
                               )}

                               {file.chunkStrategy === 'hierarchy' && (
                                 <div className="text-sm text-gray-500 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                   <span className="font-medium text-blue-700">自动按照文档的标题体系（如大标题、子标题）进行层级化切分，最大程度保留文档的结构语义。</span>
                                 </div>
                               )}
                            </div>
                         </div>
                      </div>
                    ))}
                    {uploadedFiles.length === 0 && (
                      <div className="text-center py-6 text-sm text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                        请先在上方上传内容
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-8 py-4 bg-white border-t border-gray-100 flex items-center justify-end shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] gap-3">
                 <button 
                   onClick={() => setShowUploadModal(false)}
                   className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all active:scale-95"
                 >
                   取消
                 </button>
                 <button 
                   onClick={() => {
                     alert('正在处理分片并添加到法律法规知识库...');
                     setShowUploadModal(false);
                   }}
                   className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                 >
                   确认创建并处理分片
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LawDetail({ law, onBack, onStartQA }: { law: LawDocument; onBack: () => void; onStartQA: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">{law.title}</h3>
            <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-0.5">
              <span>发布部门: {law.department}</span>
              <span>•</span>
              <span>发布日期: {law.publishDate}</span>
              <span>•</span>
              <span>生效日期: {law.effectiveDate}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
            <Download size={16} />
            <span>下载文档</span>
          </button>
          <button 
            onClick={onStartQA}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <MessageSquare size={18} />
            <span className="font-medium">开始对话</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Content */}
        <div className="flex-1 overflow-y-auto p-12 bg-gray-50/30">
          <div className="max-w-3xl mx-auto bg-white p-12 rounded-3xl shadow-sm border border-gray-100 min-h-full">
            <h1 className="text-3xl font-normal text-2xl tracking-tight text-gray-900 text-center mb-12">{law.title}</h1>
            <div className="prose prose-blue max-w-none font-serif text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
              {law.content}
            </div>
          </div>
        </div>

        {/* Right: Clauses */}
        <div className="w-80 border-l border-gray-100 bg-white overflow-y-auto p-6">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Layers size={14} className="text-blue-600" />
            条款标注
          </h4>
          <div className="space-y-4">
            {law.clauses.map(clause => (
              <div key={clause.id} className="p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600">{clause.title}</span>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{clause.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LawQAInterface({ law, onBack }: { law: LawDocument | null; onBack: () => void }) {
  const [messages, setMessages] = React.useState<QAMessage[]>([
    { role: 'assistant', content: `您好！我是审计 AI 助手。我已经加载了《${law?.title || '法律法规知识库'}》的内容。您可以向我提问关于该法规的具体条款或审计要求。` }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  // Auto-fill chip for the current law
  const [referencedLaw, setReferencedLaw] = React.useState<LawDocument | null>(law);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: QAMessage = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      const aiMsg: QAMessage = { 
        role: 'assistant', 
        content: `根据《${law?.title}》的相关规定，该问题涉及以下条款：\n\n1. **关于预算级次**：国家实行一级政府一级预算，共设立五级预算。\n2. **关于监督机制**：各级人大常委会对本级预算执行情况进行监督。`,
        citations: [
          { lawId: law?.id || '', lawTitle: law?.title || '', clauseTitle: '第三条' }
        ]
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">法规智能问答</h3>
            <p className="text-xs text-gray-500 mt-0.5">当前依据: 《{law?.title}》</p>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
          <History size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'user' ? "bg-blue-600 text-white" : "bg-white text-blue-600"
              )}>
                {msg.role === 'user' ? <Plus size={20} /> : <Zap size={20} />}
              </div>
              <div className={cn(
                "max-w-[80%] p-6 rounded-3xl shadow-sm border",
                msg.role === 'user' ? "bg-blue-600 text-white border-blue-500 rounded-tr-none" : "bg-white text-gray-800 border-gray-100 rounded-tl-none"
              )}>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.citations && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">法规引用</p>
                    {msg.citations.map((cit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 w-fit">
                        <FileCheck size={14} />
                        <span>《{cit.lawTitle}》 {cit.clauseTitle}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto space-y-4">
          {referencedLaw && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 w-fit group/chip animate-in fade-in slide-in-from-bottom-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <BookOpen size={12} />
              </div>
              <span className="text-[10px] font-bold text-gray-600 truncate max-w-[200px]">{referencedLaw.title}</span>
              <button 
                onClick={() => setReferencedLaw(null)}
                className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors cursor-pointer ml-1"
              >
                <X size={10} />
              </button>
            </div>
          )}
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入您想查询的法律法规问题..."
              className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl pl-6 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all shadow-sm"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-4">AI 助手回答仅供参考，请以法律法规原文为准</p>
      </div>
    </div>
  );
}

function LawEditor({ law, onClose, onSave }: { law: LawDocument; onClose: () => void; onSave: (l: LawDocument) => void }) {
  const [formData, setFormData] = React.useState<LawDocument>({ ...law });
  const [activeTab, setActiveTab] = React.useState<'form' | 'upload' | 'preview'>('form');
  const [isParsing, setIsParsing] = React.useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    // Mock Parsing
    setTimeout(() => {
      setFormData({
        ...formData,
        title: file.name.split('.')[0],
        content: '解析后的法律法规全文内容示例...\n第一条 立法目的...\n第二条 适用范围...',
        markdownContent: '# ' + file.name.split('.')[0] + '\n\n## 第一条 立法目的\n\n解析后的 Markdown 内容...',
        clauses: [
          { id: 'c1', title: '第一条', content: '立法目的' },
          { id: 'c2', title: '第二条', content: '适用范围' }
        ]
      });
      setIsParsing(false);
      setActiveTab('preview');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-normal text-gray-900 tracking-tight">{law.id ? '编辑法律法规' : '新增法律法规'}</h3>
            <p className="text-xs text-gray-500 mt-1">支持手动录入或文档解析，自动构建 AI 知识库</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-8 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6">
            {[
              { id: 'form', label: '基本信息' },
              { id: 'upload', label: '文档解析' },
              { id: 'preview', label: '解析预览' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "py-4 text-sm font-medium transition-all relative",
                  activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeLawTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          <AnimatePresence mode="wait">
            {activeTab === 'form' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid grid-cols-2 gap-6"
              >
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">法规名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="请输入完整的法律法规名称"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">发布部门 <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="如：财政部"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">所属分类</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">发布日期 <span className="text-red-500">*</span></label>
                  <input 
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">生效日期</label>
                  <input 
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">简要描述</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-24 resize-none"
                    placeholder="请输入法规的简要描述或立法目的..."
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'upload' && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full flex flex-col items-center justify-center py-12"
              >
                <div className="w-full max-w-md border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all group relative">
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {isParsing ? <Loader2 size={40} className="animate-spin" /> : <FileUp size={40} />}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {isParsing ? '正在智能解析文档...' : '上传法规文档'}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {isParsing ? '系统正在提取条款、发布部门及日期等关键信息' : '支持 doc, docx, pdf, wps 等格式，解析后自动填充表单'}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'preview' && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                  <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    以下为 AI 解析结果预览，您可以手动修正解析错误。内容将作为 AI 问答的推理依据。
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">全文内容 (Markdown)</label>
                  <textarea 
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-6 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-96 resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
          >
            取消
          </button>
          <button 
            onClick={() => {
              if (!formData.title || !formData.department || !formData.publishDate) {
                alert('名称、发布部门、发布日期为必填项');
                return;
              }
              onSave({ ...formData, updatedAt: Date.now() });
            }}
            className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Save size={18} />
            <span>提交保存</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const MOCK_LAW_CHUNKS: Record<string, any[]> = {
  'law1': [
    { id: 'l1-c0', docId: 'law1', docName: '中华人民共和国预算法', index: 0, content: '第一条 预算法立法目的：规范政府预算行为，强化预算约束，健全民主集中制。', metadata: { type: 'law' } },
    { id: 'l1-c1', docId: 'law1', docName: '中华人民共和国预算法', index: 1, content: '第十二条 各级预算应当保持收支平衡。', metadata: { type: 'law' } }
  ],
  'law2': [
    { id: 'l2-c0', docId: 'law2', docName: '中华人民共和国审计法', index: 0, content: '第一条 审计法立法目的：加强国家审计监督，维护财政经济秩序。', metadata: { type: 'law' } }
  ]
};

function SharedChunkListView({ doc, type, onBack }: { doc: any; type: 'law' | 'doc'; onBack: () => void }) {
  const [search, setSearch] = React.useState('');
  const chunks = type === 'law' ? (MOCK_LAW_CHUNKS[doc.id] || []) : [];
  
  const filteredChunks = chunks.filter(c => 
    c.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
       <div className="bg-white border-b border-gray-100 px-8 py-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                <ChevronLeft size={20} />
             </button>
             <div>
                <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">法规切片详情</h3>
                <p className="text-xs text-gray-500 font-medium">{doc.title || doc.name}</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="搜索切片内容..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium"
                />
             </div>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
             {filteredChunks.map((chunk) => (
                <div key={chunk.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow h-[300px]">
                   <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-black tabular-nums">
                         # {chunk.index}
                      </span>
                      <span className="text-[11px] font-bold text-gray-700 truncate flex-1">{chunk.docName}</span>
                   </div>
                   <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
                         {chunk.content}
                      </p>
                   </div>
                </div>
             ))}
          </div>
          {filteredChunks.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20">
                <Layers size={48} strokeWidth={1} className="mb-4" />
                <p className="text-sm font-medium">暂无匹配的切片内容</p>
             </div>
          )}
       </div>

       <div className="bg-white border-t border-gray-100 px-8 py-3 flex items-center justify-between shrink-0 font-bold">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
             展示 {filteredChunks.length} 条数据
          </p>
          <div className="flex items-center gap-1">
             <button className="p-1 text-gray-400 disabled:opacity-30"><ChevronLeft size={16} /></button>
             <button className="w-6 h-6 rounded bg-blue-600 text-white text-[10px] font-bold shadow-lg shadow-blue-100">1</button>
             <button className="p-1 text-gray-400 disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
       </div>
    </div>
  );
}
