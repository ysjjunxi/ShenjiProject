import React from 'react';
import { 
  Send, 
  Trash2, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  Bot,
  User,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Brain,
  SlidersHorizontal,
  BookOpen,
  StopCircle,
  RotateCcw,
  FileText,
  Smile,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { KnowledgeBase } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

interface KnowledgeBaseChatProps {
  kb: KnowledgeBase;
  onBack: () => void;
}

export default function KnowledgeBaseChat({ kb, onBack }: KnowledgeBaseChatProps) {
  const [sessions, setSessions] = React.useState<ChatSession[]>([
    { id: 'session-1', title: '平台小助手', icon: <Bot size={16} className="text-blue-500" /> },
    { id: 'session-2', title: kb.name, icon: <BookOpen size={16} className="text-green-600" /> },
    { id: 'session-3', title: `${kb.name} 相关咨询`, icon: <BookOpen size={16} className="text-green-600" /> },
  ]);
  const [activeSessionId, setActiveSessionId] = React.useState('session-2');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'm1',
      role: 'user',
      content: '中华人民共和国审计法第二条的内容是什么',
      timestamp: Date.now() - 1000 * 60,
    },
    {
      id: 'm2',
      role: 'assistant',
      content: '根据提供的知识库内容，中华人民共和国审计法第二条的内容如下：\n\n*   **审计监督范围**：国家实行审计监督制度。坚持中国共产党对审计工作的领导，构建集中统一、全面覆盖、权威高效的审计监督体系。国务院和县级以上地方人民政府设立审计机关。\n*   **审计监督对象**：国务院各部门和地方各级人民政府及其各部门的财政收支，国有的金融机构和企业事业单位组织的财务收支，以及其他依照本法规应接受审计的财政收支、财务收支，依照本法规接受审计监督。\n*   **审计监督内容**：审计机关对前款所列财政收支或者财务收支的真实、合法和效益，依法进行审计监督。\n\n**引用来源**：知识库中《中华人民共和国审计法》的目录后正文部分明确列出了第二条的上述内容。',
      timestamp: Date.now(),
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    
    // Simple mock response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `这是针对“${inputValue}”的模拟回复。在实际应用中，这里会调用后端 API 并接入知识库进行检索增强（RAG）。`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1000);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id && sessions.length > 1) {
      setActiveSessionId(sessions[0].id === id ? sessions[1].id : sessions[0].id);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#f8f9fb] overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {!sidebarCollapsed && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-[#F5F7FA] border-r border-gray-100 flex flex-col shrink-0 overflow-hidden relative"
          >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
           <span className="text-sm font-medium text-gray-500">对话列表</span>
           <button 
              onClick={onBack}
              className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-blue-600"
              title="返回列表"
           >
              <X size={16} />
           </button>
        </div>
        
        <button 
          onClick={() => {
            const newId = `session-${Date.now()}`;
            const newSession = { 
              id: newId, 
              title: '新对话', 
              icon: <MessageSquare size={16} className="text-blue-500" /> 
            };
            setSessions([newSession, ...sessions]);
            setActiveSessionId(newId);
            setMessages([]);
          }}
          className="w-full h-10 bg-white/50 text-gray-600 border border-gray-100 rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:border-gray-200 transition-all active:scale-95 text-sm font-normal"
        >
          <Plus size={14} className="text-blue-500" />
          <span>新建对话任务</span>
        </button>
     </div>
             
             <div className="flex-1 overflow-y-auto">
                {sessions.map(session => (
                   <div 
                      key={session.id}
                      onClick={() => setActiveSessionId(session.id)}
                      className={cn(
                        "group relative px-4 py-3 cursor-pointer transition-all border-l-4",
                        activeSessionId === session.id 
                          ? "bg-white border-blue-500 shadow-sm" 
                          : "border-transparent hover:bg-gray-200/50"
                      )}
                   >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 min-w-0 pr-6">
                            <div className="shrink-0">
                               {session.icon || <MessageSquare size={16} className="text-gray-400" />}
                            </div>
                            <h4 className={cn(
                              "text-sm font-medium truncate",
                              activeSessionId === session.id ? "text-gray-900" : "text-gray-600"
                            )}>
                               {session.title}
                            </h4>
                          </div>
                          <button 
                            onClick={(e) => deleteSession(e, session.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-red-50"
                            title="删除对话"
                          >
                             <Trash2 size={14} />
                          </button>
                        </div>
                        <span className="text-xs text-gray-400 pl-[26px]">
                          刚刚
                        </span>
                      </div>
                   </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F8FA] relative">
        {/* Header */}
        <div className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">{kb.name}</h2>
              <p className="text-[11px] text-gray-400 font-medium">知识库对话助手 • 实时分析中</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all" title="对话设置">
              <SlidersHorizontal size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all" title="清空对话" onClick={() => setMessages([])}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 pb-48 scroll-smooth"
        >
           {messages.map((msg) => (
             <div 
                key={msg.id}
                className={cn(
                  "flex gap-4 max-w-5xl mx-auto items-start",
                  msg.role === 'user' ? "flex-row tabular-nums" : ""
                )}
             >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm font-bold text-xs uppercase",
                  msg.role === 'user' ? "bg-blue-500 text-white" : "bg-transparent ring-0 shadow-none"
                )}>
                   {msg.role === 'user' ? 'd' : (
                     <div className="w-8 h-8 flex items-center justify-center bg-white shadow shadow-blue-100 rounded-lg text-blue-600">
                        <Bot size={20} />
                     </div>
                   )}
                </div>
                
                <div className={cn(
                  "flex-1 min-w-0 max-w-full",
                  msg.role === 'user' ? "pt-1.5" : "bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm"
                )}>
                   <div className={cn(
                      "prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-gray-900 prose-ul:my-2 prose-li:my-1",
                      msg.role === 'user' ? "text-gray-800 font-medium text-[15px]" : "text-gray-700 text-[14px]"
                   )}>
                      <Markdown>{msg.content}</Markdown>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Input Area Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
           <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              {/* Controls Bar */}
              <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-blue-100 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 transition-all group">
                       <Bot size={14} className="text-blue-600" />
                       <span className="text-xs font-bold text-gray-700">deepseek-chat</span>
                       <ChevronDown size={12} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded-lg shadow-sm cursor-pointer hover:bg-blue-100 transition-all group">
                       <BookOpen size={14} className="text-blue-600" />
                       <span className="text-xs font-bold text-blue-700">{kb.name}</span>
                       <div className="px-1 py-0.5 bg-blue-600 text-[8px] text-white rounded font-black uppercase">Active</div>
                    </div>
                    <div className="h-4 w-[1px] bg-gray-200 mx-1" />
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                       <SlidersHorizontal size={12} />
                       <span>0.6</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                       <StopCircle size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                       <RotateCcw size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                       <FileText size={16} />
                    </button>
                 </div>
              </div>

              {/* Text Area */}
              <div className="p-4 relative">
                 <textarea 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       handleSend();
                     }
                   }}
                   placeholder="可以问我任何问题, shift + Enter 换行"
                   className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 pb-12 resize-none h-24 placeholder:text-gray-300 outline-none"
                 />
                 
                 <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                       <Smile size={18} />
                    </button>
                 </div>

                 <button 
                   onClick={handleSend}
                   disabled={!inputValue.trim()}
                   className={cn(
                     "absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                     inputValue.trim() 
                       ? "bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-95" 
                       : "bg-gray-100 text-gray-400 cursor-not-allowed"
                   )}
                 >

                   <Send size={18} />
                 </button>
              </div>
           </div>
        </div>

        {/* Floating Actions on the right */}
        <div className="absolute right-6 bottom-1/4 flex flex-col gap-3">
           <div className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all cursor-pointer">
              <FileText size={20} />
           </div>
           <div className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all cursor-pointer">
              <Smile size={20} />
           </div>
        </div>
      </div>
    </div>
  );
}
