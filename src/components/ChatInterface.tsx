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
  ArrowUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/src/lib/utils';
import { Message, AUDIT_MODELS } from '@/src/types';
import { motion } from 'motion/react';

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
  const scrollRef = React.useRef<HTMLDivElement>(null);

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
    <div className="flex-1 flex flex-col bg-[#FFFFFF] relative overflow-hidden">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto">
            {/* Welcome Section */}
            <div className="bg-white/40 backdrop-blur-sm border border-gray-100 rounded-[32px] p-12 w-full max-w-2xl shadow-sm mb-12 text-center">
              <div className="w-16 h-16 bg-[#1890ff] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-500/20">
                <Bot size={36} />
              </div>
              <h2 className="text-xl font-normal text-gray-900 tracking-tight mb-2">
                审计AI大模型智能数据分析
              </h2>
              <p className="text-gray-500 text-sm mb-8">
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
          <div className="max-w-4xl mx-auto w-full space-y-8">
            {messages.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}
          </div>
        )}
        {isGenerating && (
          <div className="flex gap-4 max-w-4xl mx-auto w-full">
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
      <div className="px-6 pb-12 pt-2">
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white border border-gray-200 rounded-[28px] shadow-xl shadow-gray-200/50 overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="向您的数据库提问，上传CSV，或生成报告..."
              className="w-full bg-transparent border-none focus:ring-0 text-base resize-none py-6 px-8 min-h-[120px] max-h-[300px] placeholder:text-gray-300"
            />
            
            <div className="flex items-center justify-between px-6 pb-6 pt-2">
              <div className="flex items-center gap-1">
                <ToolbarIcon icon={<Plus size={18} />} />
                <ToolbarIcon icon={<Zap size={18} />} />
                <ToolbarIcon icon={<Book size={18} />} />
                <ToolbarIcon icon={<FileText size={18} />} />
                
                <div className="h-4 w-[1px] bg-gray-200 mx-3" />
                
                <div className="flex items-center gap-2">
                  <ModelSelector 
                    value={selectedModelId} 
                    onChange={onModelChange}
                    options={AUDIT_MODELS.filter(m => m.id === 'deepseek-chat')}
                  />
                  <ModelSelector 
                    value="gpt4-audit" 
                    onChange={() => {}}
                    options={[{ id: 'gpt4-audit', name: 'GPT-4 审计大模型' }]}
                  />
                </div>
              </div>
              
              <button
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                  input.trim() && !isGenerating 
                    ? "bg-gray-200 text-gray-600 hover:bg-gray-300" 
                    : "bg-gray-100 text-gray-300"
                )}
              >
                <ArrowUp size={24} />
              </button>
            </div>
          </div>
          
          {/* Footer removed per user request */}
        </div>
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

function ToolbarIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
        <Bot size={20} />
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
