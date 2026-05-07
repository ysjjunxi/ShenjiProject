import React from 'react';
import { 
  Search, 
  Plus, 
  MessageSquare,
  X,
  Database,
  Shield,
  Book,
  MoreVertical,
  Check,
  ChevronRight,
  ChevronDown,
  Globe,
  FileText,
  Type,
  Paperclip,
  HelpCircle,
  Layers,
  Settings,
  Upload as UploadIcon,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { KnowledgeBase, UserRole } from '@/src/types';
import KnowledgeBaseCard from './KnowledgeBaseCard';
import LawKnowledgeBase from './LawKnowledgeBase';
import PersonalKnowledgeBase from './PersonalKnowledgeBase';
import KnowledgeBaseChat from './KnowledgeBaseChat';
import { motion, AnimatePresence } from 'motion/react';

interface KnowledgeBaseHomeProps {
  category: 'law' | 'audit' | 'personal';
  title: string;
}

// Mocking user role for demonstration - in a real app this would come from an Auth Context
const CURRENT_USER_ROLE: UserRole = 'auditor';

const MOCK_KB_DATA: KnowledgeBase[] = [
  {
    id: 'law-kb-1',
    name: '法律法规知识库',
    description: '法律法规知识库',
    category: 'law',
    docCount: 10,
    status: 'Normal',
    storageType: 'chroma',
    updatedAt: Date.now() - 86400000 * 12
  },
  {
    id: 'audit-kb-1',
    name: '审计资料知识库',
    description: '审计资料知识库',
    category: 'audit',
    docCount: 6,
    status: 'Normal',
    storageType: 'chroma',
    updatedAt: Date.now() - 86400000 * 12
  },
  {
    id: 'personal-kb-1',
    name: '个人资料知识库',
    description: '个人资料知识库',
    category: 'personal',
    docCount: 0,
    status: 'Normal',
    storageType: 'chroma',
    updatedAt: Date.now() - 86400000 * 12
  }
];

export default function KnowledgeBaseHome({ category, title }: KnowledgeBaseHomeProps) {
  const [kbList, setKbList] = React.useState<KnowledgeBase[]>(MOCK_KB_DATA);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedKbId, setSelectedKbId] = React.useState<string | null>(null);
  const [chattingKbId, setChattingKbId] = React.useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  
  // Wizard State
  const [formData, setFormData] = React.useState({
    name: '',
    storageType: 'Vector Store',
    businessType: '',
    description: '',
    kbType: 'doc', // text, doc
    uploadedFiles: [
      {
        id: 'file1',
        name: '0414与用户会议备案记录.txt',
        chunkStrategy: 'hierarchy', // hierarchy, snippet, separator
        chunkSize: 512,
        chunkOverlap: 50,
        separator: '\\n',
      }
    ],
    questions: [] as string[],
  });

  const filteredKbs = kbList.filter(kb => 
    kb.category === category && 
    (kb.name.includes(searchQuery) || kb.description.includes(searchQuery))
  );

  const handleCreate = () => {
    if (!canModify) return;
    if (!formData.name.trim()) return;
    const newKb: KnowledgeBase = {
      id: `${category}-kb-${Date.now()}`,
      name: formData.name,
      description: formData.description || formData.name,
      category,
      docCount: formData.uploadedFiles.length,
      status: 'Normal',
      storageType: formData.storageType,
      updatedAt: Date.now()
    };
    setKbList([newKb, ...kbList]);
    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      storageType: 'Vector Store',
      businessType: '',
      description: '',
      kbType: 'doc',
      uploadedFiles: [
        {
          id: 'file1',
          name: '0414与用户会议备案记录.txt',
          chunkStrategy: 'hierarchy',
          chunkSize: 512,
          chunkOverlap: 50,
          separator: '\\n',
        }
      ],
      questions: [],
    });
  };

  const nextStep = () => {};
  const prevStep = () => {};

  const isReadOnlyCategory = category === 'law' || category === 'audit';
  const canModify = !isReadOnlyCategory || CURRENT_USER_ROLE === 'admin';

  const handleDelete = (id: string) => {
    if (!canModify) {
      alert('权限不足：审计员不支持删除该类知识库。');
      return;
    }
    if (window.confirm('确定要删除该知识库吗？所有文档和配置将丢失。')) {
      setKbList(kbList.filter(kb => kb.id !== id));
    }
  };

  const handleRename = (id: string) => {
    if (!canModify) {
      alert('权限不足：审计员不支持编辑和自命名此知识库。');
      return;
    }
    const name = window.prompt('请输入新名称:');
    if (name) {
      setKbList(kbList.map(kb => kb.id === id ? { ...kb, name } : kb));
    }
  };

  const handleStartChat = (kb: KnowledgeBase) => {
    setChattingKbId(kb.id);
  };

  if (chattingKbId) {
    const chatKb = kbList.find(kb => kb.id === chattingKbId);
    if (chatKb) {
      return (
        <KnowledgeBaseChat 
          kb={chatKb} 
          onBack={() => setChattingKbId(null)} 
        />
      );
    }
  }

  if (selectedKbId) {
    const selectedKb = kbList.find(kb => kb.id === selectedKbId);
    if (selectedKb) {
      if (category === 'personal') {
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <PersonalKnowledgeBase readOnly={!canModify} onBack={() => setSelectedKbId(null)} title={selectedKb.name} />
          </div>
        );
      }
      if (category === 'law' || category === 'audit') {
        return (
              <div className="flex-1 flex flex-col overflow-hidden">
                <LawKnowledgeBase readOnly={!canModify} title={selectedKb.name} onBack={() => setSelectedKbId(null)} />
              </div>
          );
      }
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
          <button onClick={() => setSelectedKbId(null)} className="mb-4 text-blue-600">返回</button>
          <h2 className="text-lg text-gray-800">{selectedKb.name} 管理界面开发中</h2>
        </div>
      );
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Title Area */}
      <div className="px-8 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">管理您的专业审计知识储备，提升AI作业精准度</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="请输入关键词搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            />
          </div>
          {canModify && (
            <button 
              onClick={() => { resetForm(); setShowCreateModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm"
            >
              <Plus size={18} />
              <span>创建知识库</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of KB Cards */}
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredKbs.map(kb => (
          <KnowledgeBaseCard 
            key={kb.id} 
            kb={kb} 
            onOpen={() => setSelectedKbId(kb.id)}
            onChat={handleStartChat}
            onDelete={handleDelete}
            onRename={handleRename}
            readOnly={!canModify}
          />
        ))}

        {filteredKbs.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-32 opacity-30">
             <Database size={64} strokeWidth={1} />
             <p className="mt-4 font-bold tracking-widest uppercase text-xs">暂无知识库内容</p>
          </div>
        )}
        </div>
      </div>

      {/* Create Modal - Multi-step Wizard */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <h3 className="text-base font-normal text-lg tracking-tight text-gray-800 tracking-tight">新增知识库</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Wizard Steps Indicator Removed */}

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                <div className="max-w-3xl mx-auto space-y-10">
                  
                  {/* Section 1: 基本配置 */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">基本配置</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1 col-span-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                           <span className="text-red-500">*</span> 知识库名称
                        </label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="请输入名称"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                           <span className="text-red-500">*</span> 存储类型
                        </label>
                        <div className="relative">
                           <select 
                             value={formData.storageType}
                             onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                             className="w-full px-4 py-3 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-sm focus:outline-none transition-all appearance-none cursor-not-allowed"
                             disabled
                           >
                              <option>Vector Store</option>
                           </select>
                           <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                           <span className="text-red-500">*</span> 业务类型
                        </label>
                        <div className="relative">
                           <select 
                             value={formData.businessType}
                             onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                             className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all appearance-none shadow-sm"
                           >
                              <option value="">请选择业务类型</option>
                              <option>通用业务</option>
                              <option>财政审计</option>
                              <option>金融监督</option>
                              <option>合规检查</option>
                           </select>
                           <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                           <span className="text-red-500">*</span> 描述
                        </label>
                        <textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="请输入描述"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all h-24 resize-none shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: 上传文件 */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                      <span>上传文件</span>
                      <span className="text-xs font-normal text-gray-400 ml-2">(非必填)</span>
                    </h4>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-white group hover:border-blue-400 focus-within:border-blue-400 transition-all cursor-pointer shadow-sm">
                       <div className="w-12 h-12 bg-gray-50 group-hover:bg-blue-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                          <UploadIcon size={24} />
                       </div>
                       <div className="text-center">
                          <h4 className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">点击选择文件，或将文件拖拽到此处</h4>
                          <p className="text-[11px] text-gray-400 mt-1">支持 TXT, MD, PDF, Word, Excel, PPTX, CSV 等格式</p>
                       </div>
                    </div>
                  </div>

                  {/* Section 4: 分片配置 */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                       <span>切分参数设置</span>
                       <span className="text-xs font-normal text-gray-400 ml-2">(非必填)</span>
                    </h4>
                    
                    <div className="space-y-4">
                      {formData.uploadedFiles.map((file, index) => (
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
                                        const newFiles = [...formData.uploadedFiles];
                                        newFiles[index].chunkStrategy = 'hierarchy';
                                        setFormData({ ...formData, uploadedFiles: newFiles });
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
                                        const newFiles = [...formData.uploadedFiles];
                                        newFiles[index].chunkStrategy = 'snippet';
                                        setFormData({ ...formData, uploadedFiles: newFiles });
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
                                        const newFiles = [...formData.uploadedFiles];
                                        newFiles[index].chunkStrategy = 'separator';
                                        setFormData({ ...formData, uploadedFiles: newFiles });
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
                                            const newFiles = [...formData.uploadedFiles];
                                            newFiles[index].chunkSize = parseInt(e.target.value);
                                            setFormData({ ...formData, uploadedFiles: newFiles });
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
                                            const newFiles = [...formData.uploadedFiles];
                                            newFiles[index].chunkOverlap = parseInt(e.target.value);
                                            setFormData({ ...formData, uploadedFiles: newFiles });
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
                                          const newFiles = [...formData.uploadedFiles];
                                          newFiles[index].separator = e.target.value;
                                          setFormData({ ...formData, uploadedFiles: newFiles });
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
                      
                      {formData.uploadedFiles.length === 0 && (
                        <div className="text-center py-6 text-sm text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                          请先在上方上传内容
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-8 py-4 bg-white border-t border-gray-100 flex items-center justify-end shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                 <div className="flex items-center gap-3">
                   <button 
                     onClick={() => setShowCreateModal(false)}
                     className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all active:scale-95"
                   >
                     取消
                   </button>
                   <button 
                     onClick={handleCreate}
                     className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                   >
                     <Database size={16} />
                     确认创建并处理分片
                   </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
