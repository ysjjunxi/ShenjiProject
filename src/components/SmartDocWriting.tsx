import React from 'react';
import { 
  Send, 
  FileText, 
  BookOpen, 
  Paperclip, 
  Save, 
  Download, 
  Share2, 
  Sparkles,
  User,
  Bot,
  Plus,
  Search,
  ChevronDown,
  Trash2,
  Check,
  MoreVertical,
  ArrowRight,
  Clock,
  Layout,
  Type,
  Star,
  BrainCircuit as BrainIcon,
  Upload,
  Database,
  X,
  Library,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { DocumentTemplate, TEMPLATE_TYPES } from '@/src/types';
import { MOCK_TEMPLATES } from '@/src/data/mockTemplates';
import { MOCK_KB_DOCUMENTS, KBDocument } from '@/src/data/mockKnowledgeBase';
import { MOCK_PROJECTS } from '@/src/data/mockProjects';
import Markdown from 'react-markdown';
import { format } from 'date-fns';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface CommonPrompt {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  templateType?: string;
}

interface PageProps {
  onNavigate?: (view: string) => void;
  initialProjectId?: string;
}

export default function SmartDocWriting({ onNavigate, initialProjectId }: PageProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(initialProjectId || null);
  const [showProjectMenu, setShowProjectMenu] = React.useState(false);
  const projectMenuRef = React.useRef<HTMLDivElement>(null);

  const selectedProject = React.useMemo(() => MOCK_PROJECTS.find(p => p.id === selectedProjectId), [selectedProjectId]);

  const [currentDraft, setCurrentDraft] = React.useState('');
  const [showSavePromptModal, setShowSavePromptModal] = React.useState(false);
  const [showSaveDocModal, setShowSaveDocModal] = React.useState(false);
  const [newPromptName, setNewPromptName] = React.useState('');
  const [newDocName, setNewDocName] = React.useState('');
  const [newDocType, setNewDocType] = React.useState('审计报告');
  
  // Lists for dropdowns
  const [commonPrompts, setCommonPrompts] = React.useState<CommonPrompt[]>([
    { id: '1', name: '正式审计语气', content: '请使用专业、客观、严谨的审计语言进行编写，确保措辞符合国家审计准则。', createdAt: Date.now() - 86400000 * 5 },
    { id: '2', name: '事实先行原则', content: '在描述审计发现时，请遵循“事实、依据、定性、处理意见”的逻辑顺序。', createdAt: Date.now() - 86400000 * 2 }
  ]);
  
  const [selectedTemplates, setSelectedTemplates] = React.useState<DocumentTemplate[]>([]);
  const [selectedQuickTemplates, setSelectedQuickTemplates] = React.useState<string[]>([]);
  const [showTemplateMenu, setShowTemplateMenu] = React.useState(false);
  const [templateCategoryFilter, setTemplateCategoryFilter] = React.useState<string>('all');
  const [showPromptMenu, setShowPromptMenu] = React.useState(false);
  const [showReferenceMenu, setShowReferenceMenu] = React.useState(false);
  const [showKBModal, setShowKBModal] = React.useState(false);
  const [kbCategory, setKbCategory] = React.useState<'audit' | 'personal'>('audit');
  const [selectedKBDocs, setSelectedKBDocs] = React.useState<KBDocument[]>([]);
  
  const [projectSearch, setProjectSearch] = React.useState('');
  const [templateSearch, setTemplateSearch] = React.useState('');
  const [isSlotsExpanded, setIsSlotsExpanded] = React.useState(false);

  const missingSlots = React.useMemo(() => {
    const slots = [];
    if (!currentDraft) return slots;
    const regex = /【(\*?)([^】]+)】/g;
    let match;
    while ((match = regex.exec(currentDraft)) !== null) {
        slots.push({
            id: `slot-${match[2]}`,
            name: match[2],
            isRequired: match[1] === '*'
        });
    }
    return slots;
}, [currentDraft]);

  const handleScrollToSlot = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleGenerateExample = () => {
    const exampleContent = `# 关于某市XX局财政收支情况的审计报告

**文号：** 【*文号】
**被审计单位：** 【*被审计单位】

## 一、基本情况
【*被审计单位】于【审计起止日期】对XXX情况进行了审计。审计结果表明，该局2023年预算执行情况总体良好，基本保证了全市公共卫生事业的正常运转。

## 二、审计发现的主要问题

### 1. 预算编制不细化，调剂频繁
2023年，该局在年初预算中挂列预备费200万元，年中全部调剂用于日常办公支出，违反了【*违规事实定性】及相关规定，涉及金额200万元。

### 2. 信息化系统升级项目进展严重滞后
“智慧医疗二期”项目预算拨款500万元，截至2023年底支付进度仅为15%。主要原因是项目立项论证不充分，导致采购流程反复优化，项目处于实际停滞状态。

### 3. 多发放津补贴
审计发现，该局下属二级机构在2023年春节期间以“加班补助”名义违规向全体人员发放交通卡，合计金额【违规金额】。

## 三、审计处理意见与建议
【*处理意见及依据】

---
**审计组组长：** 【*审计组组长】
**日期：** 【*日期】`;
    
    setCurrentDraft(exampleContent);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: '为您生成了一份典型的《审计报告》示例，您可以在右侧预览区域查看格式与措辞参考。',
      timestamp: Date.now()
    }]);
  };

  const templateMenuRef = React.useRef<HTMLDivElement>(null);
  const promptMenuRef = React.useRef<HTMLDivElement>(null);
  const referenceMenuRef = React.useRef<HTMLDivElement>(null);
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Initial welcome message
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `你好，我是您的智能审计文书助手！需要编写哪一种类型的文书呢？`,
        timestamp: Date.now()
      }]);
    }
  }, []);

  // Dropdown outside click handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templateMenuRef.current && !templateMenuRef.current.contains(event.target as Node)) {
        setShowTemplateMenu(false);
      }
      // Fixed prompt menu outside click to ignore clicking the trigger button
      if (promptMenuRef.current && !promptMenuRef.current.contains(event.target as Node)) {
        const trigger = document.getElementById('prompt-trigger');
        if (trigger && !trigger.contains(event.target as Node)) {
          setShowPromptMenu(false);
        }
      }
      if (referenceMenuRef.current && !referenceMenuRef.current.contains(event.target as Node)) {
        setShowReferenceMenu(false);
      }
      if (projectMenuRef.current && !projectMenuRef.current.contains(event.target as Node)) {
        setShowProjectMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customContent?: string) => {
    const text = customContent || input;
    if (!text.trim() && selectedTemplates.length === 0 && selectedKBDocs.length === 0 && selectedQuickTemplates.length === 0) return;
    if (isGenerating) return;

    // Build context string from attachments
    let contextStr = "";
    if (selectedTemplates.length > 0) {
      contextStr += `\n已关联模板：${selectedTemplates.map(t => t.name).join(', ')}`;
    }
    if (selectedQuickTemplates.length > 0) {
      contextStr += `\n已确定文书类型：${selectedQuickTemplates.join(', ')}`;
    }
    if (selectedKBDocs.length > 0) {
      contextStr += `\n已关联参考资料：${selectedKBDocs.map(d => d.name).join(', ')}`;
    }

    const fullPrompt = `${text}${contextStr}`;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text || (selectedTemplates.length > 0 ? `依据已选模板编写文书` : `编写审计文书`),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    // Clear attachments on send? Or keep? Usually clear if they are "per message" associations. 
    // The user said "similar to your own dialog window", usually they persist until cleared or sent.
    setSelectedTemplates([]);
    setSelectedQuickTemplates([]);
    setSelectedKBDocs([]);
    
    setIsGenerating(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `你是一个专业的审计专家。基于以下要求和附件参考编写审计文书：\n${fullPrompt}\n\n如果是特定类型的文书，请遵循标准格式。请提供完整的文档内容。` }] }
        ],
        config: {
          systemInstruction: "你是一个专业的审计文书助手。你的任务是协助审计人员编写高质量、规范的审计文书。回复时，请将正式的文书内容放在结果中。输出的文书应包含完整的标题、正文结构。"
        }
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || '无法生成内容，请稍后重试。',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentDraft(response.text || '');
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，生成过程中遇到错误。请检查您的网络连接并重试。',
        timestamp: Date.now()
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePrompt = () => {
    if (!input.trim() || !newPromptName.trim()) return;
    const newPrompt: CommonPrompt = {
      id: Date.now().toString(),
      name: newPromptName,
      content: input,
      createdAt: Date.now(),
      templateType: selectedTemplates[0]?.templateType || selectedTemplates[0]?.name
    };
    setCommonPrompts(prev => [...prev, newPrompt]);
    setNewPromptName('');
    setShowSavePromptModal(false);
    alert('提示词保存成功！');
  };

  const handleSaveDocument = () => {
    if (!newDocName.trim()) return;
    // Simulate persistence for the session if needed, or just show success
    setShowSaveDocModal(false);
    setNewDocName('');
    alert('文书保存成功！您可以在“我的文书”中查看和管理该文档。');
  };

  const handleDeletePrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个常用提示词吗？')) {
      setCommonPrompts(prev => prev.filter(p => p.id !== id));
    }
  };

  const applyTemplate = (type: string) => {
    if (!selectedQuickTemplates.includes(type)) {
      setSelectedQuickTemplates(prev => [...prev, type]);
    }
  };

  const applyActualTemplate = (tpl: DocumentTemplate) => {
    if (!selectedTemplates.find(t => t.id === tpl.id)) {
      setSelectedTemplates(prev => [...prev, tpl]);
    }
    setShowTemplateMenu(false);
  };

  const filteredTemplatesByCat = MOCK_TEMPLATES.filter(tpl => 
    (templateCategoryFilter === 'all' || tpl.templateType === templateCategoryFilter) &&
    (templateSearch === '' || tpl.name.includes(templateSearch))
  );

  const availableCategories = Array.from(new Set(MOCK_TEMPLATES.map(t => t.templateType)));

  const handleExport = () => {
    if (!currentDraft) return;
    const blob = new Blob([currentDraft], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `审计文书_${new Date().toLocaleDateString()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex bg-gray-50 overflow-hidden h-full">
      {/* Left Chat Section */}
      <div className="w-[450px] flex flex-col bg-white border-r border-gray-200 relative">
        <div className="px-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-20 h-[60px] shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900 line-height-tight">智能文书助手</h3>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">AI Writing Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            <button 
              id="prompt-trigger"
              onClick={() => setShowPromptMenu(!showPromptMenu)}
              className={cn(
                "p-2 rounded-lg transition-colors flex items-center gap-1.5",
                showPromptMenu ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-400"
              )}
              title="提示词管理"
            >
              <Sparkles size={16} />
              <span className="text-[10px] font-bold">提示词</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
              <Clock size={16} />
            </button>

            {/* Prompt Menu Moved to Header Dropdown */}
            <AnimatePresence>
              {showPromptMenu && (
                <motion.div 
                  ref={promptMenuRef}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl p-3 z-50 max-h-[400px] overflow-y-auto custom-scrollbar"
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={12} className="text-blue-500" />
                      常用提示词
                    </h4>
                    <button 
                      onClick={() => setShowPromptMenu(false)}
                      className="text-gray-300 hover:text-gray-600 transition-colors"
                    >
                      <X size={14}/>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {commonPrompts.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => {
                          setInput(p.content);
                          setShowPromptMenu(false);
                        }}
                        className="p-3 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 border border-transparent hover:border-gray-100 rounded-xl cursor-pointer transition-all group flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 group-hover:text-blue-600 truncate max-w-[150px]">{p.name}</span>
                          <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                            <span className="text-[9px] text-gray-300 font-medium group-hover:text-blue-300 transition-colors">
                              {format(p.createdAt, 'MM-dd')}
                            </span>
                            <button 
                              onClick={(e) => handleDeletePrompt(p.id, e)}
                              className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
                              title="删除提示词"
                            >
                              <Trash2 size={10} />
                            </button>
                            <Star size={10} className="text-orange-400 group-hover:block" />
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed group-hover:text-blue-400 font-medium italic">
                          {p.content}
                        </p>
                        {p.templateType && (
                          <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-400 font-medium">
                            <Layout size={10} className="text-gray-300" />
                            <span>模板: {p.templateType}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex gap-3",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'user' ? "bg-gray-100 text-gray-600" : "bg-blue-50 text-blue-600"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "max-w-[85%] space-y-2",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "p-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10 rounded-tr-none" 
                    : "bg-gray-50 border border-gray-100 text-gray-800 shadow-sm rounded-tl-none"
                )}>
                  <div className="prose prose-sm max-w-none">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                  
                  {msg.id === 'welcome' && (
                    <div className="mt-4 grid grid-cols-1 gap-1.5 overflow-hidden">
                      {TEMPLATE_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => applyTemplate(type)}
                          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all text-left group"
                        >
                          <FileText size={12} className="text-gray-400 group-hover:text-blue-500" />
                          <span className="truncate">{type}</span>
                          <ArrowRight size={10} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all" />
                        </button>
                      ))}
                      <button
                        onClick={handleGenerateExample}
                        className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-100 rounded-xl text-[11px] font-bold text-orange-600 hover:bg-orange-100 transition-all text-left mt-1 border-dashed"
                      >
                        <Sparkles size={12} className="text-orange-500" />
                        <span>查看审计报告示例</span>
                        <ArrowRight size={10} className="ml-auto" />
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 px-1">
                  {format(msg.timestamp, 'HH:mm')}
                </span>
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="relative group bg-gray-50 border border-gray-100 rounded-3xl focus-within:bg-white focus-within:ring-0 transition-all shadow-sm flex flex-col">
            {/* Attachments Section Inside Box */}
            {(selectedTemplates.length > 0 || selectedKBDocs.length > 0 || selectedQuickTemplates.length > 0 || selectedProject) && (
              <div className="flex flex-wrap gap-2 p-3 pb-1 border-b border-gray-100/50 bg-gray-50/50">
                {selectedProject && (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] font-bold text-emerald-700 shadow-sm animate-in fade-in zoom-in slide-in-from-bottom-2">
                    <Briefcase size={12} className="text-emerald-500" />
                    <span>关联项目: {selectedProject.name}</span>
                    <button onClick={() => setSelectedProjectId(null)} className="ml-1 hover:text-red-500 transition-colors opacity-60 hover:opacity-100">
                      <X size={12} />
                    </button>
                  </div>
                )}
                {selectedQuickTemplates.map(type => (
                  <div key={type} className="flex items-center gap-2 px-2.5 py-1.5 bg-orange-50 border border-orange-100 rounded-xl text-[10px] font-bold text-orange-700 shadow-sm animate-in fade-in zoom-in slide-in-from-bottom-2">
                    <Layout size={12} className="text-orange-500" />
                    <span>文书类型: {type}</span>
                    <button onClick={() => setSelectedQuickTemplates(prev => prev.filter(t => t !== type))} className="ml-1 hover:text-red-500 transition-colors opacity-60 hover:opacity-100">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {selectedTemplates.map(tpl => (
                  <div key={tpl.id} className="flex items-center gap-2 px-2.5 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-bold text-blue-700 shadow-sm animate-in fade-in zoom-in slide-in-from-bottom-2">
                    <FileText size={12} className="text-blue-500" />
                    <span>模板: {tpl.name}</span>
                    <button onClick={() => setSelectedTemplates(prev => prev.filter(t => t.id !== tpl.id))} className="ml-1 hover:text-red-500 transition-colors opacity-60 hover:opacity-100">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {selectedKBDocs.map(doc => (
                  <div key={doc.id} className="flex items-center gap-2 px-2.5 py-1.5 bg-purple-50 border border-purple-100 rounded-xl text-[10px] font-bold text-purple-700 shadow-sm animate-in fade-in zoom-in slide-in-from-bottom-2">
                    <Database size={12} className="text-purple-500" />
                    <span>参考: {doc.name}</span>
                    <button onClick={() => setSelectedKBDocs(prev => prev.filter(d => d.id !== doc.id))} className="ml-1 hover:text-red-500 transition-colors opacity-60 hover:opacity-100">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="请输入主题和写作要求..."
              className="w-full min-h-[120px] max-h-[300px] p-4 bg-transparent text-sm focus:outline-none transition-all custom-scrollbar resize-none font-medium text-gray-700 placeholder:text-gray-400"
            />

            <div className="p-3 border-t border-gray-100/50 flex items-center justify-between bg-white/40">
              <div className="flex items-center gap-1.5">
                {/* Project Selector */}
                <div className="relative" ref={projectMenuRef}>
                  <button 
                    onClick={() => setShowProjectMenu(!showProjectMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all"
                  >
                    <Briefcase size={14} />
                    <span>审计项目</span>
                    <ChevronDown size={12} className={cn("transition-transform", showProjectMenu && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showProjectMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full mb-3 left-0 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[300px]"
                      >
                        <div className="p-2 border-b border-gray-100 relative bg-gray-50/50">
                          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="搜索项目..." 
                            value={projectSearch}
                            onChange={e => setProjectSearch(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500/50 outline-none shadow-sm placeholder:font-normal font-medium text-gray-700"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
                          {MOCK_PROJECTS.filter(p => p.name.includes(projectSearch)).map(p => (
                            <div 
                              key={p.id}
                              onClick={() => {
                                setSelectedProjectId(p.id);
                                setShowProjectMenu(false);
                              }}
                              className={cn(
                                "px-3 py-2 text-xs font-medium rounded-xl cursor-pointer transition-all truncate",
                                selectedProjectId === p.id ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                              )}
                              title={p.name}
                            >
                              {p.name}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Template Selector */}
                <div className="relative" ref={templateMenuRef}>
                  <button 
                    onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all"
                  >
                    <Layout size={14} />
                    <span>文书模板</span>
                    <ChevronDown size={12} className={cn("transition-transform", showTemplateMenu && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showTemplateMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full mb-3 left-0 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[400px]"
                      >
                        <div className="p-2 border-b border-gray-100 bg-gray-50 flex flex-col gap-2">
                          <div className="relative">
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              placeholder="搜索模板..." 
                              value={templateSearch}
                              onChange={e => setTemplateSearch(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500/50 outline-none shadow-sm placeholder:font-normal font-medium text-gray-700"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <button 
                              onClick={() => setTemplateCategoryFilter('all')}
                              className={cn(
                                "px-2 py-1 rounded-lg text-[10px] font-bold transition-all",
                                templateCategoryFilter === 'all' ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-100"
                              )}
                            >
                              全部
                            </button>
                            {availableCategories.map(cat => (
                              <button 
                                key={cat}
                                onClick={() => setTemplateCategoryFilter(cat)}
                                className={cn(
                                  "px-2 py-1 rounded-lg text-[10px] font-bold transition-all",
                                  templateCategoryFilter === cat ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-100"
                                )}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
                          {filteredTemplatesByCat.map(tpl => (
                            <div 
                              key={tpl.id}
                              onClick={() => applyActualTemplate(tpl)}
                              className="px-3 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-xl cursor-pointer transition-all flex flex-col gap-1 group"
                            >
                              <div className="flex items-center gap-2">
                                <FileText size={14} className="text-gray-400 group-hover:text-blue-500" />
                                <span className="truncate">{tpl.name}</span>
                              </div>
                              <div className="flex items-center gap-2 ml-5">
                                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[9px] text-gray-400 font-bold uppercase">{tpl.templateType}</span>
                                <span className="text-[9px] text-gray-300 font-medium truncate italic">{tpl.scenario}</span>
                              </div>
                            </div>
                          ))}
                          {filteredTemplatesByCat.length === 0 && (
                            <div className="px-4 py-4 text-center text-xs text-gray-400 italic">
                              该类型下暂无模板
                            </div>
                          )}
                        </div>
                        <div className="p-2 border-t border-gray-50 bg-gray-50/50">
                          <button 
                            onClick={() => {
                              if (onNavigate) {
                                onNavigate('template_mgmt');
                              } else {
                                alert('跳转至模板管理...');
                              }
                            }}
                            className="w-full py-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 bg-white rounded-lg shadow-sm"
                          >
                            <Plus size={12} />
                            管理更多模板
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Reference Materials */}
                <div className="relative" ref={referenceMenuRef}>
                  <button 
                    onClick={() => setShowReferenceMenu(!showReferenceMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all"
                  >
                    <Paperclip size={14} />
                    <span>参考资料</span>
                    <ChevronDown size={12} className={cn("transition-transform", showReferenceMenu && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showReferenceMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full mb-3 left-0 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                      >
                        <div 
                          onClick={() => {
                            alert('文件上传功能对接中...');
                            setShowReferenceMenu(false);
                          }}
                          className="px-3 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-xl cursor-pointer transition-colors flex items-center gap-2.5"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Upload size={14} />
                          </div>
                          <span>从上传文件</span>
                        </div>
                        <div 
                          onClick={() => {
                            setShowKBModal(true);
                            setShowReferenceMenu(false);
                          }}
                          className="px-3 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-xl cursor-pointer transition-colors flex items-center gap-2.5"
                        >
                          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                            <Database size={14} />
                          </div>
                          <span>从知识库中选择</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {input.trim() && (
                  <button 
                    onClick={() => {
                      if (selectedTemplates.length === 0) {
                        alert('请先选择文书模板再保存常用提示词');
                        return;
                      }
                      setShowSavePromptModal(true);
                    }}
                    className="p-2 text-gray-300 hover:text-orange-500 transition-colors"
                    title="保存为常用提示词"
                  >
                    <Save size={18} />
                  </button>
                )}
                <button 
                  onClick={() => handleSend()}
                  disabled={(!input.trim() && selectedTemplates.length === 0 && selectedKBDocs.length === 0 && selectedQuickTemplates.length === 0) || isGenerating}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg",
                    (input.trim() || selectedTemplates.length > 0 || selectedKBDocs.length > 0 || selectedQuickTemplates.length > 0) && !isGenerating 
                      ? "bg-blue-600 text-white shadow-blue-500/20 hover:scale-105" 
                      : "bg-gray-100 text-gray-400 shadow-none pointer-events-none"
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Preview Section */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden border-l border-white shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
        <div className="px-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10 h-[60px] shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900">文书预览</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGenerateExample} 
              className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all border border-orange-100 mr-2"
            >
              <Sparkles size={12} />
              生成示例
            </button>
            <button 
              onClick={() => {
                if (!currentDraft) {
                  alert('请先生成文书后再保存');
                  return;
                }
                setNewDocName(selectedTemplates[0]?.name || '新建审计报告');
                setShowSaveDocModal(true);
              }} 
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
            >
              <Save size={14} />
              保存文书
            </button>
            <button 
              onClick={handleExport}
              disabled={!currentDraft}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gray-900 rounded-xl hover:bg-black transition-all shadow-lg disabled:opacity-50 disabled:hover:bg-gray-900"
            >
              <Download size={14} />
              导出文书
            </button>
          </div>
        </div>

        {currentDraft && missingSlots.length > 0 && (
          <div className="bg-orange-50 border-b border-orange-100 shrink-0 z-20 relative w-full shadow-sm">
            <div 
              className="px-6 py-2 flex items-center justify-between cursor-pointer hover:bg-orange-100/50 transition-colors"
              onClick={() => setIsSlotsExpanded(!isSlotsExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <AlertCircle size={12} />
                </div>
                <div className="flex items-center text-xs">
                  <span className="font-bold text-orange-800">未填槽总计：{missingSlots.length} 项</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-orange-600">
                <span>{isSlotsExpanded ? '点击折叠' : '点击展开'}</span>
                <ChevronDown size={14} className={cn("transition-transform", isSlotsExpanded ? "rotate-180" : "")} />
              </div>
            </div>
            
            <AnimatePresence>
              {isSlotsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-orange-100/50"
                >
                  <div className="px-6 py-3 bg-orange-50/50 flex flex-wrap gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {missingSlots.map((slot, idx) => (
                      <button
                        key={`${slot.id}-${idx}`}
                        onClick={(e) => { e.stopPropagation(); handleScrollToSlot(slot.id); }}
                        className={cn(
                          "px-2.5 py-1 rounded-[6px] text-[11px] font-bold transition-all border flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5",
                          slot.isRequired 
                            ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:shadow-red-500/20" 
                            : "bg-white text-orange-700 border-orange-200 hover:bg-orange-50 hover:shadow-orange-500/10"
                        )}
                      >
                        {slot.isRequired && <span className="text-red-500">*</span>}
                        {slot.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-12 bg-gray-50/20 custom-scrollbar relative">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-2xl min-h-[842px] p-16 relative border border-gray-50">
              {/* Watermark/Texture */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden rounded-2xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 whitespace-nowrap text-[80px] font-bold text-gray-900">
                  AUDIT REPORT
                </div>
              </div>
              
              {!currentDraft ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-32">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-200">
                    <Type size={32} />
                  </div>
                  <div>
                    <h4 className="text-gray-400 font-bold">暂无生成内容</h4>
                    <p className="text-xs text-gray-300 mt-1 max-w-[200px]">在左侧输入写作要求，AI 将为您实时生成专业的审计文书</p>
                  </div>
                </div>
              ) : (
                <div className="prose prose-blue max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-loose">
                  <Markdown
                    components={{
                      code({node, className, children, ...props}: any) {
                        const match = /^__slot__:(req|opt):(.*)$/.exec(String(children));
                        if (match) {
                          const isReq = match[1] === 'req';
                          const name = match[2];
                          return (
                            <span 
                              id={`slot-${name}`} 
                              className="bg-yellow-100 text-yellow-800 border-b border-yellow-400 px-1 mx-1 rounded-sm font-bold cursor-pointer hover:bg-yellow-200 transition-colors inline-block"
                              title={isReq ? "必填项" : "选填项"}
                            >
                              {name}
                            </span>
                          );
                        }
                        return <code className={className} {...props}>{children}</code>;
                      }
                    }}
                  >
                    {currentDraft.replace(/【(\*?)([^】]+)】/g, (match, isReq, name) => `\`__slot__:${isReq ? 'req' : 'opt'}:${name}\``)}
                  </Markdown>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KB Selection Modal */}
      <AnimatePresence>
        {showKBModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowKBModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">选择参考资料</h3>
                    <p className="text-xs text-gray-400 font-medium">从系统知识库中选择已有资料作为写作参考</p>
                  </div>
                  <button onClick={() => setShowKBModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                  <button 
                    onClick={() => setKbCategory('audit')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all",
                      kbCategory === 'audit' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    <Library size={16} />
                    <span>审计资料知识库</span>
                  </button>
                  <button 
                    onClick={() => setKbCategory('personal')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all",
                      kbCategory === 'personal' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    <User size={16} />
                    <span>个人资料知识库</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {MOCK_KB_DOCUMENTS.filter(d => d.category === kbCategory).map(doc => {
                  const isSelected = selectedKBDocs.some(d => d.id === doc.id);
                  return (
                    <div 
                      key={doc.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedKBDocs(prev => prev.filter(d => d.id !== doc.id));
                        } else {
                          setSelectedKBDocs(prev => [...prev, doc]);
                        }
                      }}
                      className={cn(
                        "p-4 border rounded-2xl cursor-pointer transition-all flex items-center justify-between group",
                        isSelected 
                          ? "bg-blue-50 border-blue-200" 
                          : "bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50/10"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                          isSelected ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-white transition-colors"
                        )}>
                          <FileText size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{doc.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded uppercase">{doc.type}</span>
                            <span className="text-[10px] text-gray-400 font-medium">{doc.size}</span>
                            <span className="text-[10px] text-gray-400 font-medium">更新于 {format(doc.updatedAt, 'yyyy-MM-dd')}</span>
                          </div>
                        </div>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200"
                      )}>
                        {isSelected && <Check size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold">已选择 {selectedKBDocs.length} 项参考资料</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowKBModal(false)}
                    className="px-6 py-2.5 text-xs font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => setShowKBModal(false)}
                    className="px-8 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                  >
                    确定选择
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Prompt Modal */}
      <AnimatePresence>
        {showSavePromptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSavePromptModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
            >
              <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 mb-2">保存为常用提示词</h3>
              <p className="text-xs text-gray-400 mb-4 font-medium">输入一个便于记忆的名称，方便下次快速调用该指令。</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">提示词名称</label>
                  <input 
                    type="text"
                    value={newPromptName}
                    onChange={(e) => setNewPromptName(e.target.value)}
                    placeholder="例如：规范化底稿偏好..."
                    autoFocus
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 font-bold transition-all"
                  />
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">提示词预览</label>
                  <p className="text-xs text-gray-500 line-clamp-3 font-medium leading-relaxed italic">"{input}"</p>
                </div>
              </div>

              <div className="flex gap-2 mt-8">
                <button 
                  onClick={() => setShowSavePromptModal(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                >
                  取消
                </button>
                <button 
                  onClick={handleSavePrompt}
                  disabled={!newPromptName.trim()}
                  className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  确认保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Document Modal */}
      <AnimatePresence>
        {showSaveDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSaveDocModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
            >
              <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 mb-2">保存审计文书</h3>
              <p className="text-xs text-gray-400 mb-4 font-medium">确认文书名称和类型，以便在“我的文书”中进行后续管理。</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">报告名称</label>
                  <input 
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="请输入报告名称..."
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 font-bold transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">报告类型</label>
                  <select 
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 font-bold transition-all"
                  >
                    <option value="审计报告">审计报告</option>
                    <option value="审计底稿">审计底稿</option>
                    <option value="情况说明">情况说明</option>
                    <option value="处理意见">处理意见</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-8">
                <button 
                  onClick={() => setShowSaveDocModal(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveDocument}
                  disabled={!newDocName.trim()}
                  className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  确认保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
