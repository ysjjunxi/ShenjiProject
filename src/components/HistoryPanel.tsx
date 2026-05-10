import React from 'react';
import { 
  Plus, 
  ChevronRight,
  Trash2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Conversation } from '@/src/types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface HistoryPanelProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function HistoryPanel({ 
  conversations, 
  activeId, 
  onSelect, 
  onNew,
  onDelete
}: HistoryPanelProps) {
  const filtered = [...conversations]
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="w-56 h-full bg-[#F5F7FA] border-r border-gray-100 flex flex-col">
      {/* New Conversation Button */}
      <div className="p-4">
        <button 
          onClick={onNew}
          className="w-full h-10 bg-white/50 text-gray-600 border border-gray-100 rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:border-gray-200 transition-all active:scale-95 text-sm font-normal"
        >
          <Plus size={14} className="text-blue-500" />
          <span>新建对话任务</span>
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="space-y-0 py-2">
          {filtered.map((conv) => (
            <div 
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "group relative px-4 py-3 cursor-pointer transition-all border-l-4",
                activeId === conv.id 
                  ? "bg-white border-blue-500 shadow-sm" 
                  : "border-transparent hover:bg-gray-200/50"
              )}
            >
              <div className="flex flex-col gap-1 w-full relative">
                <div className="flex items-center w-full">
                  <h4 className={cn(
                    "text-sm font-medium truncate w-full pr-6",
                    activeId === conv.id ? "text-gray-900" : "text-gray-600"
                  )}>
                    {conv.title}
                  </h4>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-red-50"
                    title="删除对话"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  {format(conv.updatedAt, 'MM-dd HH:mm', { locale: zhCN })}
                </span>
              </div>
            </div>
          ))}
          
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400">暂无历史对话</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
