import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, X, RefreshCw, Send, Wand2, Copy, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';

export default function AIAssistPanel({ sql, onInsertCode, onClose }: { sql: string, onInsertCode: (code: string) => void, onClose?: () => void }) {
  const [aiInput, setAiInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);

  const handleAiAsk = async () => {
    if (!aiInput.trim() || isAiGenerating) return;
    
    setIsAiGenerating(true);
    setAiResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3-flash-preview";
      
      const prompt = `作为 SQL 专家，请回答以下关于 SQL 编写的问题。
当前 SQL: ${sql}
用户问题: ${aiInput}

请返回 JSON 格式:
{
  "suggestion": "你的建议或解释",
  "code": "推荐的代码片段 (如果有)"
}`;

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}');
      setAiResponse(result);
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsAiGenerating(false);
      setAiInput('');
    }
  };

  return (
    <div className="w-[320px] bg-white border-l border-gray-200 flex flex-col h-full shrink-0 shadow-[-2px_0_10px_rgba(0,0,0,0.02)] z-10">
      <div className="px-5 py-3 border-b border-gray-100 bg-white flex items-center justify-between min-h-[64px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <BrainCircuit size={18} />
          </div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">AI 辅助分析</h3>
        </div>
        
        <button 
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50/30 scrollbar-hide">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            您可以询问关于 SQL 优化、复杂查询逻辑或特定数据库函数的问题。
          </p>
          <div className="relative">
            <textarea 
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="例如：如何优化这个查询的性能？"
              className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none shadow-inner"
            />
            <button 
              onClick={handleAiAsk}
              disabled={!aiInput.trim() || isAiGenerating}
              className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 disabled:shadow-none"
            >
              {isAiGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </div>

        {aiResponse && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-blue-50/80 border border-blue-100 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 size={14} className="text-blue-600" />
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">AI 建议</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed font-medium">{aiResponse.suggestion}</p>
            </div>

            {aiResponse.code && (
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800">
                <div className="px-3 py-2 bg-gray-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">代码片段</span>
                  <button 
                    onClick={() => onInsertCode(aiResponse.code || '')}
                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                  >
                    <Copy size={12} />
                    应用到编辑器
                  </button>
                </div>
                <div className="p-3 font-mono text-xs text-blue-400 overflow-x-auto">
                  <pre>{aiResponse.code}</pre>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">快捷问题建议</h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              '优化当前 SQL 性能', 
              '解释当前 SQL 的执行逻辑', 
              '添加日期过滤条件', 
              '统计各部门数据分布'
            ].map(func => (
              <button 
                key={func}
                onClick={() => setAiInput(func)}
                className="p-3 bg-white border border-gray-100 rounded-xl text-xs font-medium text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all text-left flex items-center justify-between group shadow-sm"
              >
                {func}
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-blue-500 pr-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
