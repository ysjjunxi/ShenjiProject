import React from 'react';
import { 
  Database, 
  Save, 
  FolderOpen, 
  Trash2, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  Copy, 
  Maximize2, 
  Minimize2,
  Code2,
  Wand2,
  History,
  BookOpen,
  X,
  Send,
  BrainCircuit,
  Terminal,
  FileCode,
  AlignLeft,
  Undo2,
  Redo2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface SQLEditorProps {
  initialSql?: string;
  onExecute: (sql: string) => void;
  hideHeader?: boolean;
  onToggleAIAssist?: () => void;
  isAIAssistOpen?: boolean;
}

const MOCK_DATA_SOURCES = [
  { id: 'ds1', name: 'xxx县财政预算管理库', type: 'Oracle' },
  { id: 'ds2', name: 'xxx县国库集中支付系统', type: 'SQLServer' },
  { id: 'ds3', name: 'xxx行政事业单位财务核算库', type: 'MySQL' },
  { id: 'ds4', name: 'xxx乡镇财政管理及三资平台', type: 'SQLServer' },
];

const MOCK_SCRIPTS = [
  { id: 's1', name: '无预算支出疑点筛查', sql: 'SELECT * FROM t_budget_execution WHERE approval_id IS NULL;', date: '2025-03-20' },
  { id: 's2', name: '超预算支出预警', sql: 'SELECT e.dept_code, SUM(e.expense_amount) as total_spent, a.approved_amount \nFROM t_budget_execution e \nJOIN t_budget_approval a ON e.approval_id = a.approval_id \nGROUP BY e.dept_code, a.approved_amount \nHAVING SUM(e.expense_amount) > a.approved_amount;', date: '2025-03-21' },
  { id: 's3', name: '违规预算调整查询', sql: 'SELECT * FROM t_budget_adjustment WHERE is_compliant = 0;', date: '2025-03-22' },
  { id: 's4', name: '资金长期闲置监控', sql: 'SELECT * FROM t_budget_idle_funds WHERE idle_days > 180 AND has_explanation = 0;', date: '2025-03-23' },
];

const SQL_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP', 'BY', 'ORDER', 'LIMIT', 'JOIN', 'ON', 'LEFT', 'RIGHT', 'INNER', 'AS', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'IN', 'NOT', 'NULL', 'IS', 'BETWEEN', 'LIKE', 'HAVING', 'DISTINCT', 'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'];

export default function SQLEditor({ initialSql = '', onExecute, hideHeader, onToggleAIAssist, isAIAssistOpen }: SQLEditorProps) {
  const [sql, setSql] = React.useState(initialSql);
  const [showHistory, setShowHistory] = React.useState(false);
  const [syntaxError, setSyntaxError] = React.useState<string | null>(null);
  const [isChecking, setIsChecking] = React.useState(false);
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [scriptName, setScriptName] = React.useState('');

  React.useEffect(() => {
    if (initialSql) setSql(initialSql);
  }, [initialSql]);

  const highlightSql = (code: string) => {
    if (!code) return '';
    
    // Escape HTML first
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Highlight strings
    highlighted = highlighted.replace(/'(.*?)'/g, '<span class="text-green-400">\'$1\'</span>');

    // Highlight keywords
    SQL_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlighted = highlighted.replace(regex, (match) => `<span class="text-purple-400 font-bold">${match.toUpperCase()}</span>`);
    });
    
    // Highlight numbers - only if NOT inside a span tag
    // This regex matches digits that are NOT preceded by a character that could be part of a tag attribute
    highlighted = highlighted.replace(/\b(\d+)\b(?![^<]*>)/g, '<span class="text-amber-400">$1</span>');

    return highlighted;
  };

  const handleFormat = () => {
    // Simple formatting logic
    let formatted = sql.trim()
      .replace(/\s+/g, ' ')
      .replace(/\b(SELECT|FROM|WHERE|AND|OR|GROUP BY|ORDER BY|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|HAVING|LIMIT)\b/gi, '\n$1')
      .trim();
    setSql(formatted);
  };

  const handleSyntaxCheck = () => {
    setIsChecking(true);
    setSyntaxError(null);
    
    // Mock syntax check
    setTimeout(() => {
      setIsChecking(false);
      if (sql.toLowerCase().includes('from') && !sql.toLowerCase().includes('select')) {
        setSyntaxError("语法错误: 缺少 SELECT 关键字");
      } else if (sql.length > 0 && !sql.toLowerCase().includes('from')) {
        setSyntaxError("语法错误: 缺少 FROM 关键字");
      } else if (sql.length === 0) {
        setSyntaxError("错误: SQL 语句不能为空");
      } else {
        // Success
      }
    }, 800);
  };

  const insertCode = (code: string) => {
    setSql(prev => prev + (prev ? '\n' : '') + code);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      {!hideHeader && (
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-20 shrink-0 sticky top-0 min-h-[64px]">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSql('')}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2"
              title="清空"
            >
              <Trash2 size={16} />
              <span className="text-sm font-bold">清空</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleFormat}
              className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <AlignLeft size={14} />
              格式化
            </button>
            {onToggleAIAssist && (
              <button 
                onClick={onToggleAIAssist}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                  isAIAssistOpen ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Sparkles size={14} />
                AI 辅助
              </button>
            )}
          </div>
        </div>
      )}

      <div className={cn(
        "flex-1 flex overflow-hidden bg-gray-50/50",
        hideHeader ? "p-4 gap-4" : "px-6 pb-6 pt-4 gap-6"
      )}>
        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] relative overflow-hidden rounded-2xl shadow-xl border border-[#333]">
          {/* Toolbar */}
          <div className="px-4 py-2 bg-[#252526] border-b border-[#333] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#37373d] rounded transition-all">
                  <Undo2 size={14} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#37373d] rounded transition-all">
                  <Redo2 size={14} />
                </button>
              </div>
              <div className="h-4 w-px bg-[#333]" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SQL 编辑器</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 font-mono">Line 1, Col 1</span>
            </div>
          </div>

          {/* Code Area */}
          <div className="flex-1 relative font-mono text-sm overflow-hidden">
            <div className="absolute inset-0 p-6 pointer-events-none whitespace-pre-wrap break-all overflow-y-auto scrollbar-hide text-gray-300">
              <div dangerouslySetInnerHTML={{ __html: highlightSql(sql) }} />
            </div>
            <textarea 
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              spellCheck={false}
              className="absolute inset-0 w-full h-full p-6 bg-transparent text-transparent caret-blue-400 resize-none focus:outline-none whitespace-pre-wrap break-all overflow-y-auto"
              placeholder="在此输入 SQL 语句..."
            />
          </div>

          {/* Bottom Controls */}
          <div className="py-3 px-4 bg-[#252526] border-t border-[#333] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSyntaxCheck}
                disabled={isChecking}
                className="px-4 py-1.5 bg-[#37373d] text-gray-300 rounded text-xs font-bold hover:bg-[#45454b] transition-all flex items-center gap-2"
              >
                {isChecking ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                语法校验
              </button>
              
              <AnimatePresence>
                {syntaxError ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-red-400 text-xs font-medium"
                  >
                    <AlertCircle size={14} />
                    {syntaxError}
                  </motion.div>
                ) : !isChecking && sql.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-green-400 text-xs font-medium"
                  >
                    <CheckCircle2 size={14} />
                    语法校验通过
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => onExecute(sql)}
              disabled={!sql.trim()}
              className="px-6 py-1.5 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
            >
              <Play size={14} fill="currentColor" />
              执行查询
            </button>
          </div>
        </div>
      </div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <History size={20} className="text-blue-600" />
                  <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">历史脚本记录</h3>
                </div>
                <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                {MOCK_SCRIPTS.map(script => (
                  <button
                    key={script.id}
                    onClick={() => {
                      setSql(script.sql);
                      setShowHistory(false);
                    }}
                    className="w-full p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-900">{script.name}</span>
                      <span className="text-[10px] text-gray-400">{script.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono truncate">{script.sql}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSaveModal(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
            >
              <h3 className="text-lg font-normal text-gray-900 tracking-tight mb-4">保存 SQL 脚本</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">脚本名称</label>
                  <input 
                    type="text"
                    value={scriptName}
                    onChange={(e) => setScriptName(e.target.value)}
                    placeholder="请输入脚本名称..."
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 h-12 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      // Save logic
                      setShowSaveModal(false);
                      setScriptName('');
                    }}
                    className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                  >
                    确认保存
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
