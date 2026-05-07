import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  ChevronDown, 
  Send, 
  RefreshCw, 
  Code2, 
  Play, 
  MessageSquare, 
  BrainCircuit, 
  Sparkles,
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
    id: 'ds1', name: '生产环境财务库', type: 'MySQL', status: 'connected',
    tables: [
      { name: '财务凭证表', description: '记录所有财务账套凭证', fields: [{ name: 'voucher_id', type: 'VARCHAR(32)' }, { name: 'amount', type: 'DECIMAL(18,2)' }, { name: 'created_at', type: 'TIMESTAMP' }] },
      { name: '报销明细表', description: '员工日常报销费用明细', fields: [{ name: 'expense_id', type: 'VARCHAR(32)' }, { name: 'emp_name', type: 'VARCHAR(64)' }, { name: 'status', type: 'INT' }] }
    ]
  },
  { 
    id: 'ds2', name: '人力资源系统库', type: 'Oracle', status: 'connected',
    tables: [
      { name: '员工信息表', description: '包含在职及离职员工基础信息', fields: [{ name: 'emp_id', type: 'VARCHAR(32)' }, { name: 'department', type: 'VARCHAR(128)' }] }
    ]
  },
  { id: 'ds3', name: '审计底稿归档库', type: 'SQLServer', status: 'connected', tables: [] },
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
    }
  ]);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const [showInputDsDropdown, setShowInputDsDropdown] = React.useState(false);
  const [dbSearchQuery, setDbSearchQuery] = React.useState('');
  const [viewingTable, setViewingTable] = React.useState<any>(null);
  const [previewDsId, setPreviewDsId] = React.useState<string | null>(null);

  const selectedDs = MOCK_DATA_SOURCES.find(ds => ds.id === selectedDsId);
  const previewDs = MOCK_DATA_SOURCES.find(ds => ds.id === (previewDsId || selectedDsId));
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const filteredDatabases = MOCK_DATA_SOURCES.filter(ds => 
    ds.name.toLowerCase().includes(dbSearchQuery.toLowerCase()) ||
    ds.type.toLowerCase().includes(dbSearchQuery.toLowerCase())
  );

  React.useEffect(() => {
    if (showInputDsDropdown) {
      setPreviewDsId(selectedDsId);
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
      <div className="px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0 flex items-center justify-between">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-normal text-gray-900 tracking-tight">AI 辅助分析</h2>
            <p className="text-sm text-gray-500 mt-1">通过自然语言与 AI 对话，自动生成专业审计 SQL 语句</p>
          </div>
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
              {msg.role === 'user' ? <MessageSquare size={20} /> : <BrainCircuit size={20} />}
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
                    <button 
                      onClick={() => onExecute(msg.sql || '')}
                      className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
                    >
                      <Play size={12} />
                      执行 SQL
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
              <BrainCircuit size={20} />
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
          <div className="relative bg-gray-50 border border-gray-200 rounded-[24px] transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white focus-within:border-blue-200 shadow-sm">
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
                        className="absolute bottom-[calc(100%+12px)] left-0 w-[600px] h-[400px] bg-white border border-gray-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[9999] overflow-hidden flex flex-col"
                      >
                          <div className="p-4 border-b border-gray-50 shrink-0">
                            <div className="relative">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                type="text"
                                value={dbSearchQuery}
                                onChange={(e) => setDbSearchQuery(e.target.value)}
                                placeholder="搜索数据库"
                                className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                              />
                            </div>
                          </div>

                          <div className="flex flex-1 min-h-0">
                            {/* Left Side: Databases */}
                            <div className="w-1/2 border-r border-gray-50 overflow-y-auto p-2">
                              {filteredDatabases.length > 0 ? (
                                filteredDatabases.map(ds => (
                                  <div key={ds.id} className="mb-2 last:mb-0" onMouseEnter={() => setPreviewDsId(ds.id)}>
                                    <button
                                      onClick={() => {
                                        setSelectedDsId(ds.id);
                                        setShowInputDsDropdown(false);
                                      }}
                                      className={cn(
                                        "w-full flex items-center gap-3 p-3 text-left transition-all rounded-2xl group",
                                        (previewDsId || selectedDsId) === ds.id ? "bg-blue-50/50" : "hover:bg-gray-50"
                                      )}
                                    >
                                      <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all",
                                        selectedDsId === ds.id 
                                          ? "bg-blue-600 text-white" 
                                          : "bg-gradient-to-br from-blue-400 to-blue-600 text-white opacity-80 group-hover:opacity-100"
                                      )}>
                                        <Database size={18} />
                                      </div>
                                      <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-0.5">
                                          <span className="text-sm font-bold text-gray-800 tracking-tight truncate">{ds.name}</span>
                                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded text-[9px] font-black uppercase tracking-widest shrink-0">{ds.type}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 truncate">{ds.tables?.length || 0} 个数据表</p>
                                      </div>
                                      <ChevronRight 
                                        size={16} 
                                        className={cn(
                                          "text-gray-400 transition-transform duration-200",
                                          selectedDsId === ds.id ? "text-blue-500" : "opacity-0 group-hover:opacity-100"
                                        )} 
                                      />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <div className="p-8 text-center">
                                  <p className="text-xs text-gray-400">未找到相关数据源</p>
                                </div>
                              )}
                            </div>

                            {/* Right Side: Tables */}
                            <div className="w-1/2 overflow-y-auto p-2 bg-gray-50/30">
                              {previewDs ? (
                                <div className="space-y-1">
                                  {previewDs.tables && previewDs.tables.length > 0 ? (
                                    previewDs.tables.map(table => (
                                      <div key={table.name} className="flex items-center justify-between p-3 hover:bg-white rounded-xl group/table transition-all border border-transparent hover:border-gray-200 hover:shadow-sm">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                          <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                            <TableProperties size={14} />
                                          </div>
                                          <div className="flex flex-col overflow-hidden">
                                            <span className="text-xs font-bold text-gray-700 truncate">{table.name}</span>
                                            <span className="text-[10px] text-gray-400 truncate">{table.description || '-'}</span>
                                          </div>
                                        </div>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setViewingTable(table);
                                            setShowInputDsDropdown(false);
                                          }}
                                          className="opacity-0 group-hover/table:opacity-100 px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg text-[10px] font-bold shadow-sm hover:bg-blue-50 transition-all shrink-0 flex items-center gap-1"
                                        >
                                          <Eye size={12} />
                                          查看
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                                      <TableProperties size={24} className="text-gray-300 mb-2" />
                                      <p className="text-xs text-gray-400">该数据库暂无表结构数据</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="p-8 text-center flex items-center justify-center h-full">
                                  <p className="text-xs text-gray-400">请选择左侧数据库</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between shrink-0">
                            <span className="text-[11px] font-bold text-gray-400">{filteredDatabases.length} 个数据库可用</span>
                            <button className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                              <span>管理数据库</span>
                              <ArrowRight size={12} />
                            </button>
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
                  className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
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
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-lg z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <TableProperties size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">{viewingTable.name}</h3>
                    <p className="text-xs text-gray-500">{viewingTable.description || '表结构详情'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingTable(null)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">字段名</th>
                        <th className="px-6 py-4">类型</th>
                        <th className="px-6 py-4">说明</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {viewingTable.fields.map((field: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-blue-600 font-medium">{field.name}</td>
                          <td className="px-6 py-4 font-mono text-gray-500 text-xs">{field.type}</td>
                          <td className="px-6 py-4 text-gray-600">-</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
