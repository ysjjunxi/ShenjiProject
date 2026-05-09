import React, { useState } from 'react';
import { 
  Database, 
  Bot,
  Search, 
  ChevronDown, 
  Send, 
  RefreshCw, 
  Code2, 
  Play, 
  MessageSquare, 
  Zap, 
  Sparkles,
  Check,
  Info,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
  ArrowRight,
  Library,
  X,
  ChevronRight,
  TableProperties,
  Eye
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface AIAssistedAnalysisChatProps {
  onLoadToEditor: (sql: string) => void;
  onExecute: (sql: string) => void;
}

const MOCK_DATA_SOURCES = [
  { 
    id: 'ds1', name: '标准审计数据库', type: 'MySQL', status: 'connected',
    tables: [
      { name: '财务凭证表', description: '记录所有财务账套凭证', fields: [{ name: 'voucher_id', type: 'VARCHAR(32)' }, { name: 'amount', type: 'DECIMAL(18,2)' }, { name: 'created_at', type: 'TIMESTAMP' }] },
      { name: '报销明细表', description: '员工日常报销费用明细', fields: [{ name: 'expense_id', type: 'VARCHAR(32)' }, { name: 'emp_name', type: 'VARCHAR(64)' }, { name: 'status', type: 'INT' }] },
      { name: '员工信息表', description: '包含在职及离职员工基础信息', fields: [{ name: 'emp_id', type: 'VARCHAR(32)' }, { name: 'department', type: 'VARCHAR(128)' }] }
    ],
    views: [
      { name: '月度财务统计视图', description: '按月统计的财务凭证汇总视图', fields: [{ name: 'month', type: 'VARCHAR(7)' }, { name: 'total_amount', type: 'DECIMAL(18,2)' }] }
    ]
  },
  { 
    id: 'ds2', name: '核心业务数据库', type: 'Oracle', status: 'connected',
    tables: [
      { name: '订单交易表', description: '核心系统交易流水', fields: [{ name: 'order_id', type: 'VARCHAR(32)' }, { name: 'customer_id', type: 'VARCHAR(32)' }, { name: 'trade_time', type: 'TIMESTAMP' }] },
      { name: '商品库存表', description: '各个仓库的商品实时库存', fields: [{ name: 'product_id', type: 'VARCHAR(32)' }, { name: 'quantity', type: 'INT' }, { name: 'warehouse_id', type: 'VARCHAR(32)' }] },
    ],
    views: [
      { name: '高风险交易视图', description: '金额超过阈值的异常交易', fields: [{ name: 'order_id', type: 'VARCHAR(32)' }, { name: 'risk_score', type: 'DECIMAL(5,2)' }] }
    ]
  },
  { 
    id: 'ds3', name: '人力资源数据库', type: 'PostgreSQL', status: 'connected',
    tables: [
      { name: '绩效考评表', description: '历年员工绩效考核结果', fields: [{ name: 'emp_id', type: 'VARCHAR(32)' }, { name: 'year', type: 'INT' }, { name: 'grade', type: 'VARCHAR(10)' }] },
      { name: '薪资发放表', description: '员工薪酬发放流水', fields: [{ name: 'emp_id', type: 'VARCHAR(32)' }, { name: 'salary', type: 'DECIMAL(18,2)' }, { name: 'pay_date', type: 'DATE' }] },
    ],
    views: []
  }
];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  explanation?: string;
}

export default function AIAssistedAnalysisChat({ onLoadToEditor, onExecute }: AIAssistedAnalysisChatProps) {
  const [selectedDsId, setSelectedDsId] = React.useState('ds1');
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '你好，我是数据库查询智能体！我可以根据自然语言描述，自动生成 SQL 查询语句。'
    },
    {
      role: 'user',
      content: '帮我查询一下财务凭证表中，金额大于10000的记录，并且按创建时间倒序排列。'
    },
    {
      role: 'assistant',
      content: '好的，我已经为您生成了查询财务凭证表中金额大于10000的记录的 SQL 语句：',
      sql: 'SELECT voucher_id, amount, created_at\nFROM 财务凭证表\nWHERE amount > 10000\nORDER BY created_at DESC;',
      explanation: '该查询从“财务凭证表”中筛选出金额（amount）大于 10000 的所有凭证记录，并使用 ORDER BY 语句根据创建时间（created_at）进行降序（DESC）排列，以便您最先看到最新的大额凭证。'
    }
  ]);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const [showInputDsDropdown, setShowInputDsDropdown] = React.useState(false);
  const [dbSearchQuery, setDbSearchQuery] = React.useState('');
  const [viewingTable, setViewingTable] = React.useState<any>(null);
  const [popoverSelectedDsId, setPopoverSelectedDsId] = React.useState('ds1');

  const selectedDs = MOCK_DATA_SOURCES.find(ds => ds.id === selectedDsId);
  const popoverDs = MOCK_DATA_SOURCES.find(ds => ds.id === popoverSelectedDsId);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const filteredDatabases = MOCK_DATA_SOURCES.filter(ds => 
    ds.name.toLowerCase().includes(dbSearchQuery.toLowerCase())
  );

  React.useEffect(() => {
    if (showInputDsDropdown) {
      setPopoverSelectedDsId(selectedDsId || 'ds1');
    }
  }, [showInputDsDropdown, selectedDsId]);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3-flash-preview";
      
      const systemInstruction = `你是一个专业的审计数据分析专家。
你的任务是将用户的自然语言查询需求转换为高质量的 SQL 语句。
当前数据源类型: ${selectedDs?.type}。
规则:
1. 仅支持生成 SELECT 查询语句，严禁生成 DELETE, UPDATE, DROP, INSERT 等修改数据的语句。
2. 必须符合 ${selectedDs?.type} 的语法规范。
3. 如果用户需求不明确，请基于常识和审计经验进行合理推断。
4. 返回格式必须为 JSON，包含以下字段:
   - sql: 生成的 SQL 语句
   - explanation: 对 SQL 语句的详细解释，包括查询逻辑、涉及的表和字段含义。
   - content: 给用户的简短回复。`;

      const response = await ai.models.generateContent({
        model,
        contents: [
          { role: 'user', parts: [{ text: `历史对话: ${JSON.stringify(messages.slice(-4))}\n当前需求: ${currentInput}` }] }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.content || '已为您生成 SQL 语句。',
        sql: result.sql,
        explanation: result.explanation
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Generation Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，生成 SQL 时遇到错误。请检查您的网络连接或尝试重新描述需求。' 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const lastSqlMessage = [...messages].reverse().find(m => m.sql);

  return (
    <div className="flex-1 flex flex-col bg-white h-full relative z-50">
      {/* Header */}
      <div className="px-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[50px] shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-normal text-gray-900 tracking-tight">AI 辅助分析及 SQL 生成</h2>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gray-50/30">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
              <Sparkles size={40} />
            </div>
            <p className="text-sm text-gray-600 font-medium whitespace-pre-wrap">
              你好，我是数据库查询智能体！我可以根据自然语言描述，自动生成 SQL 查询语。
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4 max-w-4xl",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
              msg.role === 'user' ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-gray-100"
            )}>
              {msg.role === 'user' ? <MessageSquare size={20} /> : <Bot size={20} />}
            </div>
            <div className={cn(
              "space-y-3 max-w-[85%]",
              msg.role === 'user' ? "text-right" : "text-left"
            )}>
              <div className={cn(
                "p-4 rounded-2xl shadow-sm inline-block",
                msg.role === 'user' ? "bg-blue-600 text-white" : "bg-white border border-gray-100 text-gray-800"
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.sql && (
                <div className="space-y-3">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800">
                    <div className="px-4 py-2 bg-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-blue-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedDs?.type} SQL</span>
                      </div>
                      <button className="p-1 text-gray-500 hover:text-white transition-all">
                        <Copy size={14} />
                      </button>
                    </div>
                    <div className="p-4 font-mono text-sm text-blue-400 overflow-x-auto text-left">
                      <pre>{msg.sql}</pre>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <button 
                      onClick={() => onLoadToEditor(msg.sql || '')}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all"
                    >
                      载入 SQL 编辑器
                    </button>
                  </div>
                </div>
              )}

              {msg.explanation && (
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3">
                  <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">逻辑解释</p>
                    <p className="text-xs text-blue-800 leading-relaxed">{msg.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isGenerating && (
          <div className="flex gap-4 mr-auto">
            <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 text-blue-600 flex items-center justify-center animate-pulse">
              <Zap size={20} />
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
              </div>
              <span className="text-sm text-gray-400">AI 正在思考并生成 SQL...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative group bg-gray-50 border border-gray-100 rounded-[28px] transition-all focus-within:bg-white focus-within:ring-0 shadow-sm flex flex-col">
            {selectedDsId && selectedDs && (
              <div className="px-5 pt-4">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 text-[11px] font-bold">
                  <Database size={12} />
                  <span>当前环境: {selectedDs.name}</span>
                  <button 
                    onClick={() => setSelectedDsId('')} 
                    className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
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
              placeholder="请输入您的数据查询需求，例如：查询 2024 年所有金额超过 10 万元的采购订单"
              className="w-full min-h-[100px] max-h-[200px] bg-transparent p-5 pr-16 text-sm focus:outline-none resize-none border-none"
            />
            
            <div className="px-4 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* DB Selector Trigger */}
                <div className="relative">
                  <button 
                    onClick={() => setShowInputDsDropdown(!showInputDsDropdown)}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      showInputDsDropdown ? "bg-blue-100 text-blue-600 shadow-inner" : "bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100"
                    )}
                  >
                    <Database size={18} />
                  </button>

                  <AnimatePresence>
                    {showInputDsDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-[calc(100%+12px)] left-0 w-[560px] bg-white border border-gray-100 rounded-[24px] shadow-2xl z-[9999] overflow-hidden flex flex-col"
                        style={{ fontFamily: 'Arial, "Microsoft YaHei", sans-serif' }}
                      >
                        <div className="flex-1 flex min-h-[360px] max-h-[480px]">
                          {/* Left: Database List */}
                          <div className="w-1/3 border-r border-gray-50 flex flex-col bg-gray-50/30">
                            <div className="p-3 border-b border-gray-50 bg-white/50">
                              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest px-2">数据库</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                              {MOCK_DATA_SOURCES.map(ds => (
                                <div 
                                  key={ds.id}
                                  onClick={() => {
                                    setPopoverSelectedDsId(ds.id);
                                    setSelectedDsId(ds.id);
                                  }}
                                  className={cn(
                                    "px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center gap-2 group",
                                    popoverSelectedDsId === ds.id 
                                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                                      : "text-gray-600 hover:bg-white hover:shadow-sm"
                                  )}
                                >
                                  <Database size={14} className={popoverSelectedDsId === ds.id ? "text-white" : "text-gray-400 group-hover:text-blue-500"} />
                                  <span className="truncate flex-1">{ds.name}</span>
                                  {selectedDsId === ds.id && (
                                    <div className={cn("w-1.5 h-1.5 rounded-full", popoverSelectedDsId === ds.id ? "bg-white" : "bg-blue-500")} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right: Tables & Views List */}
                          <div className="flex-1 flex flex-col bg-white">
                            <div className="p-3 border-b border-gray-50 flex items-center justify-between">
                              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest px-2">数据表与视图</span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                              <div className="space-y-6">
                                {/* Tables Section */}
                                <div>
                                  <div className="flex items-center gap-2 mb-3 px-1">
                                    <Library size={12} className="text-blue-500" />
                                    <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">数据表 ({popoverDs?.tables.length || 0})</span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-2">
                                    {popoverDs?.tables.map((table: any) => (
                                      <div 
                                        key={table.name}
                                        onClick={() => setViewingTable(table)}
                                        className="group p-3 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between"
                                      >
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-800 line-clamp-1">{table.name}</span>
                                            <Eye size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                          </div>
                                          <p className="text-[12px] text-gray-500 line-clamp-1 mt-0.5">{table.description}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Views Section */}
                                {(popoverDs?.views?.length || 0) > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                      <Sparkles size={12} className="text-purple-500" />
                                      <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">数据库视图 ({(popoverDs as any).views.length})</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                      {(popoverDs as any).views.map((view: any) => (
                                        <div 
                                          key={view.name}
                                          onClick={() => setViewingTable(view)}
                                          className="group p-3 rounded-xl border border-gray-50 hover:border-purple-100 hover:bg-purple-50/30 transition-all cursor-pointer flex items-center justify-between"
                                        >
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-bold text-gray-800 line-clamp-1">{view.name}</span>
                                              <Eye size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-[12px] text-gray-500 line-clamp-1 mt-0.5">{view.description}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isGenerating}
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Table Structure Viewer Modal */}
      <AnimatePresence>
        {viewingTable && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingTable(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
              style={{ fontFamily: 'Arial, "Microsoft YaHei", sans-serif' }}
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                    <TableProperties size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">{viewingTable.name}</h3>
                      <span className={cn(
                        "text-[12px] font-bold px-1.5 py-0.5 rounded",
                        viewingTable.name.includes('视图') ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {viewingTable.name.includes('视图') ? 'VIEW' : 'TABLE'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{viewingTable.description || '元数据结构详情'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingTable(null)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all hover:rotate-90"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">字段名称 (Name)</th>
                        <th className="px-6 py-4">数据类型 (Type)</th>
                        <th className="px-6 py-4 text-right">约束 (Constraint)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-mono">
                      {viewingTable.fields.map((field: any, idx: number) => (
                        <tr key={idx} className="hover:bg-blue-50/10 transition-colors group text-sm">
                          <td className="px-6 py-4">
                            <span className="font-bold text-blue-600 uppercase italic">{field.name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[12px] font-medium text-gray-500">{field.type}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {idx === 0 && (
                                <span className="px-1.5 py-0.5 bg-yellow-50 text-yellow-600 text-[12px] font-bold rounded uppercase">PK</span>
                              )}
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[12px] font-bold rounded uppercase">NULL</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 z-20">
                <button 
                  onClick={() => setViewingTable(null)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-all"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
