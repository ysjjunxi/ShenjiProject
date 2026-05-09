import React from 'react';
import { 
  Plus, 
  Zap, 
  Book, 
  FileText,
  Bot,
  Search,
  PieChart,
  ClipboardList,
  Scale,
  ChevronDown,
  ArrowUp,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Upload,
  X,
  Send, 
  Database,
  Link as LinkIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/src/lib/utils';
import { Message, AUDIT_MODELS } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { KNOWLEDGE_BASES } from '@/src/constants';
import { MOCK_MODELS } from './AuditModelMgmt';

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (text: string) => void;
  onClear: () => void;
  isGenerating: boolean;
  selectedModelId: string;
  onModelChange: (id: string) => void;
}

export default function ChatInterface({
  messages,
  onSend,
  onClear,
  isGenerating,
  selectedModelId,
  onModelChange
}: ChatInterfaceProps) {
  const [input, setInput] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'steps' | 'files' | 'result'>('steps');
  const [showModelPicker, setShowModelPicker] = React.useState(false);
  const [showKBPicker, setShowKBPicker] = React.useState(false);
  const [kbSearch, setKbSearch] = React.useState('');
  const [modelSearch, setModelSearch] = React.useState('');
  const [modelPage, setModelPage] = React.useState(1);
  const itemsPerPage = 5;
  
  const [selectedKBId, setSelectedKBId] = React.useState<string | null>(null);
  const [selectedAuditModelId, setSelectedAuditModelId] = React.useState<string | null>(null);
  
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const modelPickerRef = React.useRef<HTMLDivElement>(null);
  const kbPickerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelPickerRef.current && !modelPickerRef.current.contains(event.target as Node)) {
        setShowModelPicker(false);
      }
      if (kbPickerRef.current && !kbPickerRef.current.contains(event.target as Node)) {
        setShowKBPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const publishedModels = MOCK_MODELS.filter(m => m.status === 'published');
  const filteredModels = publishedModels.filter(m => 
    m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
    m.category.toLowerCase().includes(modelSearch.toLowerCase())
  );
  const totalModelPages = Math.ceil(filteredModels.length / itemsPerPage);
  const paginatedModels = filteredModels.slice((modelPage - 1) * itemsPerPage, modelPage * itemsPerPage);

  const filteredKBs = KNOWLEDGE_BASES.filter(kb => 
    kb.name.toLowerCase().includes(kbSearch.toLowerCase())
  );

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isGenerating) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex bg-[#FFFFFF] relative overflow-hidden">
      {/* Middle: Conversation */}
      <div className="w-[600px] flex flex-col shrink-0 border-r border-gray-100">
        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6">
              {/* Welcome Section */}
              <div className="bg-white/40 backdrop-blur-sm border border-gray-100 rounded-[32px] p-8 w-full shadow-sm text-center">
                <div className="w-16 h-16 bg-[#1890ff] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-500/20">
                  <Bot size={36} />
                </div>
                <h2 className="text-xl font-normal text-gray-900 tracking-tight mb-2">
                  审计AI大模型智能数据分析
                </h2>
                <p className="text-gray-500 text-xs mb-8">
                  您可以输入自然语言描述审计需求，我会为您提供专业的分析和建议
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <SuggestionItem 
                    icon={<Search size={16} className="text-blue-500" />} 
                    text="查询专项资金拨付异常数据" 
                    onClick={() => setInput("查询专项资金拨付异常数据")}
                  />
                  <SuggestionItem 
                    icon={<PieChart size={16} className="text-blue-500" />} 
                    text="分析预算执行差异情况" 
                    onClick={() => setInput("分析预算执行差异情况")}
                  />
                  <SuggestionItem 
                    icon={<ClipboardList size={16} className="text-blue-500" />} 
                    text="解读该审计项目报告" 
                    onClick={() => setInput("解读该审计项目报告")}
                  />
                  <SuggestionItem 
                    icon={<Scale size={16} className="text-blue-500" />} 
                    text="查找相关法律法规" 
                    onClick={() => setInput("查找相关法律法规")}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto w-full space-y-8">
              {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} />
              ))}
            </div>
          )}
          {isGenerating && (
            <div className="flex gap-4 max-w-2xl mx-auto w-full">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Bot size={20} />
              </div>
              <div className="flex-1 pt-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-6 pb-8 pt-2">
          <div className="max-w-2xl mx-auto relative">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  alert(`准备上传: ${e.target.files[0].name}`);
                }
              }} 
            />
            
            <div className="bg-white border border-gray-200 rounded-[24px] shadow-xl shadow-gray-200/20">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="选择知识库或从本地上传文件提问"
                className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none py-5 px-6 min-h-[100px] max-h-[300px] placeholder:text-gray-300 outline-none"
              />
              
              <div className="flex items-center justify-between px-6 pb-5 pt-1">
                <div className="flex items-center gap-1">
                  <div className="relative">
                    <ToolbarIcon 
                      icon={<Plus size={16} />} 
                      onClick={() => fileInputRef.current?.click()}
                      title="上传文件"
                    />
                  </div>
                  
                  <div className="relative" ref={modelPickerRef}>
                    <ToolbarIcon 
                      icon={<Zap size={16} />} 
                      active={showModelPicker || !!selectedAuditModelId}
                      onClick={() => setShowModelPicker(!showModelPicker)}
                      title="选择审计模型"
                    />
                    <AnimatePresence>
                      {showModelPicker && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] z-[100] overflow-hidden flex flex-col"
                        >
                          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">选择审计模型</span>
                            <Zap size={14} className="text-blue-500" />
                          </div>

                          <div className="p-3 border-b border-gray-50">
                            <div className="relative">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                type="text"
                                value={modelSearch}
                                onChange={(e) => {
                                  setModelSearch(e.target.value);
                                  setModelPage(1);
                                }}
                                placeholder="搜索审计模型..."
                                className="w-full h-8 bg-gray-100 border-none rounded-lg pl-9 pr-3 text-[11px] focus:ring-1 focus:ring-blue-500/20"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          <div className="min-h-[200px] overflow-y-auto p-2 space-y-1">
                            {paginatedModels.map(model => (
                              <button
                                key={model.id}
                                onClick={() => {
                                  setSelectedAuditModelId(model.id === selectedAuditModelId ? null : model.id);
                                  setShowModelPicker(false);
                                }}
                                className={cn(
                                  "w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3",
                                  selectedAuditModelId === model.id 
                                    ? "bg-blue-50 text-blue-600 font-bold" 
                                    : "text-gray-600 hover:bg-gray-50"
                                )}
                              >
                                <div className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                  selectedAuditModelId === model.id ? "bg-blue-100" : "bg-gray-100"
                                )}>
                                  <Zap size={16} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs truncate">{model.name}</p>
                                  <p className="text-[9px] text-gray-400 uppercase tracking-tighter">{model.category}</p>
                                </div>
                              </button>
                            ))}
                            {paginatedModels.length === 0 && (
                              <div className="py-8 text-center">
                                <Search size={24} className="text-gray-100 mx-auto mb-2" />
                                <p className="text-[10px] text-gray-400">未找到相关模型</p>
                              </div>
                            )}
                          </div>

                          {totalModelPages > 1 && (
                            <div className="px-3 py-2 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
                              <button 
                                disabled={modelPage === 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModelPage(prev => Math.max(1, prev - 1));
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ChevronDown size={16} className="rotate-90" />
                              </button>
                              <span className="text-[10px] font-bold text-gray-400">
                                {modelPage} / {totalModelPages}
                              </span>
                              <button 
                                disabled={modelPage === totalModelPages}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModelPage(prev => Math.min(totalModelPages, prev + 1));
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ChevronDown size={16} className="-rotate-90" />
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative" ref={kbPickerRef}>
                    <ToolbarIcon 
                      icon={<FileText size={16} />} 
                      active={showKBPicker || !!selectedKBId}
                      onClick={() => setShowKBPicker(!showKBPicker)}
                      title="选择知识库"
                    />
                    <AnimatePresence>
                      {showKBPicker && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute bottom-full left-0 mb-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] z-[100] overflow-hidden flex flex-col"
                        >
                          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">选择知识库</span>
                            <Database size={14} className="text-blue-500" />
                          </div>
                          
                          <div className="p-3 border-b border-gray-50">
                            <div className="relative">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                type="text"
                                value={kbSearch}
                                onChange={(e) => setKbSearch(e.target.value)}
                                placeholder="搜索知识库..."
                                className="w-full h-8 bg-gray-100 border-none rounded-lg pl-9 pr-3 text-[11px] focus:ring-1 focus:ring-blue-500/20"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                            {filteredKBs.map(kb => (
                              <button
                                key={kb.id}
                                onClick={() => {
                                  setSelectedKBId(kb.id === selectedKBId ? null : kb.id);
                                  setShowKBPicker(false);
                                }}
                                className={cn(
                                  "w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3",
                                  selectedKBId === kb.id 
                                    ? "bg-blue-50 text-blue-600 font-bold" 
                                    : "text-gray-600 hover:bg-gray-50"
                                )}
                              >
                                <div className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                                  selectedKBId === kb.id ? "bg-blue-100" : "bg-gray-100"
                                )}>
                                  {kb.category === 'law' ? <Scale size={16} /> :
                                   kb.category === 'audit' ? <Book size={16} /> :
                                   <FileText size={16} />}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs truncate">{kb.name}</p>
                                  <p className="text-[9px] text-gray-400 font-normal line-clamp-1">{kb.description}</p>
                                </div>
                              </button>
                            ))}
                            {filteredKBs.length === 0 && (
                              <div className="py-8 text-center">
                                <Search size={24} className="text-gray-100 mx-auto mb-2" />
                                <p className="text-[10px] text-gray-400">未找到相关知识库</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="h-4 w-[1px] bg-gray-100 mx-3" />
                  
                  <div className="flex items-center gap-2">
                    <ModelSelector 
                      value={selectedModelId} 
                      onChange={onModelChange}
                      options={AUDIT_MODELS.filter(m => m.id === 'deepseek-chat')}
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isGenerating}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    input.trim() && !isGenerating 
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20" 
                      : "bg-gray-100 text-gray-300"
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Analysis Panel (Agent Computer style) */}
      <div className="flex-1 flex flex-col bg-[#F9FBFF]">
        {/* Fake Computer Header */}
        <div className="h-[50px] border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="ml-4 flex items-center gap-2 text-xs font-bold text-gray-500">
              <Bot size={14} className="text-blue-500" />
              <span>AI 智能体的电脑</span>
            </div>
          </div>
          <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
            重新执行
          </button>
        </div>

        {/* Tabs Headers */}
        <div className="flex items-center border-b border-gray-100 bg-white shrink-0">
          <button 
            onClick={() => setActiveTab('steps')}
            className={cn(
              "px-6 py-3 text-xs font-bold transition-all relative flex items-center gap-2",
              activeTab === 'steps' ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Zap size={14} />
            执行步骤
            {activeTab === 'steps' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('files')}
            className={cn(
              "px-6 py-3 text-xs font-bold transition-all relative flex items-center gap-2",
              activeTab === 'files' ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Book size={14} />
            任务文件
            <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[9px] font-black text-gray-400 ml-1">3</span>
            {activeTab === 'files' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('result')}
            className={cn(
              "px-6 py-3 text-xs font-bold transition-all relative flex items-center gap-2",
              activeTab === 'result' ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <FileText size={14} />
            结果
            {activeTab === 'result' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'steps' && (
              <motion.div 
                key="steps"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <StepItem 
                  title="load_skill" 
                  status="completed" 
                  desc="找到了技能文件，现在加载SKILL.md来了解工作流程。 Phase: 加载技能"
                />
                <StepItem 
                  title="get_skill_resource" 
                  status="completed" 
                  desc="现在我已经了解了技能的工作流程。我需要先查看参考文档了解数据库结构，然后执行审计脚本。让我先查看 workflow.md 和..."
                />
                <StepItem 
                  title="shell_interpreter" 
                  status="completed" 
                  desc="让我尝试不同的路径格式。 Phase: 查看参考文档"
                />
                <StepItem 
                  title="ReAct Round 8" 
                  status="error" 
                  desc="现在我已经了解了工作流程，让我查一下数据库结构并执行审计脚本。 Phase: 查看数据库结构"
                />
                <StepItem 
                  title="shell_interpreter" 
                  status="running" 
                  desc="现在我已经了解了数据库结构和工作流程。让我先查看一下审计脚本的目录结构，然后执行审计脚本。 Phase: 查看审计脚本"
                />
              </motion.div>
            )}

            {activeTab === 'files' && (
              <motion.div 
                key="files"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 gap-3"
              >
                {['workflow.md', 'db_schema.sql', 'audit_logic.py'].map(file => (
                  <div key={file} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400 group-hover:text-blue-500" />
                      <span className="text-sm text-gray-700 font-medium">{file}</span>
                    </div>
                    <button className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">查看详情</button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'result' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl border border-gray-100 p-8 space-y-6 shadow-sm"
              >
                <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <PieChart size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">执行结果摘要</h4>
                    <p className="text-xs text-gray-500 mt-0.5">由 AI 智能体生成于 11:45</p>
                  </div>
                </div>
                
                <div className="prose prose-sm prose-slate max-w-none">
                  <h5 className="font-bold text-gray-900 mb-2">主要发现:</h5>
                  <ul className="text-xs text-gray-600 leading-relaxed space-y-2">
                    <li>识别出 <strong>3</strong> 处潜在的重复拨付疑点，涉及金额 <strong>¥150,000</strong>。</li>
                    <li>发现了 <strong>5</strong> 个项目存在拨付逾期风险。</li>
                    <li>审计脚本执行正常，覆盖了 <strong>98%</strong> 的预设规则。</li>
                  </ul>
                </div>
                
                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                  生成审计底稿
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Footer Status */}
        <div className="h-10 border-t border-gray-100 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-gray-400">就绪</span>
            <span className="text-[10px] text-gray-300 ml-2">1 个输出</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">Step ID: step-18</span>
        </div>
      </div>
    </div>
  );
}

function StepItem({ title, status, desc }: { title: string, status: 'completed' | 'error' | 'running', desc: string }) {
  return (
    <div className="flex gap-3 relative">
      {/* Connector line */}
      <div className="absolute left-4 top-8 bottom-0 w-[1px] bg-gray-100 group-last:hidden" />
      
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10",
        status === 'completed' ? "bg-emerald-50 text-emerald-600" :
        status === 'error' ? "bg-red-50 text-red-600" :
        "bg-blue-50 text-blue-600 animate-pulse"
      )}>
        {status === 'completed' ? <CheckCircle2 size={16} /> :
         status === 'error' ? <AlertCircle size={16} /> :
         <RefreshCw size={14} className="animate-spin" />}
      </div>
      
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex-1 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-1">
          <h5 className="text-xs font-bold text-gray-900 font-mono">{title}</h5>
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
            status === 'completed' ? "bg-emerald-100 text-emerald-700 font-black" :
            status === 'error' ? "bg-red-100 text-red-700" :
            "bg-blue-100 text-blue-700"
          )}>
            {status === 'completed' ? '完成' : status === 'error' ? '错误' : '运行中'}
          </span>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed italic">{desc}</p>
      </div>
    </div>
  );
}

function SuggestionItem({ icon, text, onClick }: { icon: React.ReactNode; text: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl text-left hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
    >
      <div className="shrink-0 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-xs font-medium text-gray-700 truncate">{text}</span>
    </button>
  );
}

function ToolbarIcon({ icon, onClick, title, active }: { icon: React.ReactNode; onClick?: () => void; title?: string; active?: boolean }) {
  return (
    <button 
      onClick={onClick}
      title={title}
      className={cn(
        "p-2 rounded-lg transition-colors",
        active ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
      )}
    >
      {icon}
    </button>
  );
}

function ModelSelector({ value, onChange, options }: { value: string; onChange: (id: string) => void; options: any[] }) {
  return (
    <div className="relative inline-flex items-center">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 pr-8 text-xs font-medium text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/20 hover:bg-gray-100 transition-colors"
      >
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-3 text-gray-400 pointer-events-none" />
    </div>
  );
}

function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
        isUser ? "bg-gray-900 text-white" : "bg-blue-50 text-blue-600"
      )}>
                      <Bot size={20} className={cn(isUser ? "text-white" : "text-blue-600")} />
      </div>
      
      <div className={cn(
        "flex-1 space-y-2",
        isUser ? "text-right" : "text-left"
      )}>
        <div className={cn(
          "inline-block max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
          isUser 
            ? "bg-blue-100 text-blue-900 shadow-sm" 
            : "bg-white text-gray-800 border border-gray-100 shadow-sm"
        )}>
          <div className="prose prose-sm max-w-none prose-slate">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className={cn("flex flex-wrap gap-2 mt-2", isUser ? "justify-end" : "justify-start")}>
            {message.citations.map((cite, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-blue-50/50 border border-blue-100 rounded-md text-[10px] text-blue-600 font-medium">
                <span className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center text-[8px]">{i + 1}</span>
                <span className="truncate max-w-[150px]">{cite.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
