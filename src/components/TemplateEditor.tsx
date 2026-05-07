import React from 'react';
import { 
  ArrowLeft, 
  Save,
  FileText,
  Info,
  AlignLeft,
  ChevronDown,
  Search,
  Check,
  UploadCloud,
  X,
  File as FileIcon
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DocumentTemplate, TEMPLATE_TYPES, COMMON_TEMPLATE_TYPES } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

interface TemplateEditorProps {
  template: DocumentTemplate;
  onBack: () => void;
  onSave: (tpl: DocumentTemplate) => void;
}

export default function TemplateEditor({ template, onBack, onSave }: TemplateEditorProps) {
  const [formData, setFormData] = React.useState<DocumentTemplate>({ ...template });
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = React.useState(false);
  const [typeSearch, setTypeSearch] = React.useState('');
  const [isDragging, setIsDragging] = React.useState(false);
  const [attachedFile, setAttachedFile] = React.useState<File | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
        setAttachedFile(file);
      } else {
        alert('仅支持 .doc 或 .docx 格式的文件');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
        setAttachedFile(file);
      } else {
        alert('仅支持 .doc 或 .docx 格式的文件');
      }
    }
    // clear input so the same file can be selected again if removed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTypes = TEMPLATE_TYPES.filter(type => 
    type.toLowerCase().includes(typeSearch.toLowerCase())
  );

  const commonTypes = COMMON_TEMPLATE_TYPES.filter(type => 
    type.toLowerCase().includes(typeSearch.toLowerCase())
  );
  
  const otherTypes = TEMPLATE_TYPES.filter(type => 
    !COMMON_TEMPLATE_TYPES.includes(type as any) && 
    type.toLowerCase().includes(typeSearch.toLowerCase())
  );

  const handleSave = () => {
    if (formData.name.length < 3 || formData.name.length > 30) {
      alert('模板名称长度需在 3 - 30 位之间');
      return;
    }
    if (!formData.templateType) {
      alert('请选择模板类型');
      return;
    }
    onSave({ ...formData, updatedAt: Date.now() });
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-normal text-gray-900 tracking-tight">{template.id ? '修改模板' : '新增模板'}</h2>
            <p className="text-sm text-gray-500 mt-1">配置文书模板的基础信息与内容</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Save size={18} />
            <span>保存模板</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Basic Info */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 flex items-center gap-2">
              <Info size={20} className="text-blue-600" />
              基础信息
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">标题 <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入模板标题 (3-30个字符)"
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">模板类型 <span className="text-red-500">*</span></label>
                <div className="relative" ref={dropdownRef}>
                  <div 
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    className={cn(
                      "w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 flex items-center justify-between cursor-pointer transition-all hover:bg-white hover:border-blue-300",
                      isTypeDropdownOpen && "ring-2 ring-blue-500/20 bg-white border-blue-500"
                    )}
                  >
                    <span className={cn("text-sm", !formData.templateType && "text-gray-400")}>
                      {formData.templateType || "请选择模板类型"}
                    </span>
                    <ChevronDown size={18} className={cn("text-gray-400 transition-transform", isTypeDropdownOpen && "rotate-180")} />
                  </div>

                  <AnimatePresence>
                    {isTypeDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-80"
                      >
                        <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text"
                              value={typeSearch}
                              onChange={(e) => setTypeSearch(e.target.value)}
                              placeholder="搜索类型..."
                              autoFocus
                              className="w-full h-9 bg-white border border-gray-200 rounded-lg pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 font-bold"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
                          {commonTypes.length > 0 && (
                            <>
                              <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">常用类型</div>
                              {commonTypes.map(type => (
                                <div 
                                  key={type}
                                  onClick={() => {
                                    setFormData({ ...formData, templateType: type });
                                    setIsTypeDropdownOpen(false);
                                    setTypeSearch('');
                                  }}
                                  className={cn(
                                    "px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between group",
                                    formData.templateType === type 
                                      ? "bg-blue-50 text-blue-600" 
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  )}
                                >
                                  <span>{type}</span>
                                  {formData.templateType === type && <Check size={14} />}
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
                                    setFormData({ ...formData, templateType: type });
                                    setIsTypeDropdownOpen(false);
                                    setTypeSearch('');
                                  }}
                                  className={cn(
                                    "px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between group",
                                    formData.templateType === type 
                                      ? "bg-blue-50 text-blue-600" 
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  )}
                                >
                                  <span>{type}</span>
                                  {formData.templateType === type && <Check size={14} />}
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
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">适用场景</label>
                <textarea 
                  value={formData.scenario}
                  onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                  placeholder="描述模板适用场景..."
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Attachments Section */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 flex flex-col min-h-[400px]">
            <h3 className="text-lg font-normal tracking-tight text-gray-900 flex items-center gap-2">
              <UploadCloud size={20} className="text-blue-600" />
              上传附件
            </h3>
            
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer text-center",
                isDragging ? "border-blue-500 bg-blue-50/50" : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-blue-300"
              )}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".doc,.docx"
                onChange={handleFileSelect}
              />
              
              {attachedFile ? (
                <div 
                  className="flex flex-col items-center gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                    <FileIcon size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{attachedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(attachedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button 
                    onClick={() => setAttachedFile(null)}
                    className="mt-4 px-4 py-2 text-sm shadow-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <X size={16} /> 删除附件
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-2">点击选择或拖拽文件到此处</p>
                  <p className="text-xs text-gray-500">支持 .doc, .docx 格式</p>
                </>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
