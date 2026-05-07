import React from 'react';
import { 
  Plus, 
  RefreshCw, 
  ChevronRight,
  Search,
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
  const [search, setSearch] = React.useState('');

  const filtered = conversations
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="w-64 h-full bg-[#f0f2f5] border-r border-[#d9d9d9] flex flex-col">
      {/* New Conversation Button */}
      <div className="p-4">
        <button 
          onClick={onNew}
          className="w-full h-10 bg-blue-600 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-sm active:scale-95"
        >
          <Plus size={16} />
          <span className="font-medium text-sm">新建对话</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索对话..."
            className="w-full h-8 bg-white border border-[#d9d9d9] rounded pl-9 pr-3 text-xs focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2 px-4">
          <h3 className="text-xs font-medium text-gray-500">
            所有对话
          </h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <RefreshCw size={12} />
          </button>
        </div>
        
        <div className="space-y-0">
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
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h4 className={cn(
                    "text-xs font-medium truncate pr-6",
                    activeId === conv.id ? "text-gray-900" : "text-gray-600"
                  )}>
                    {conv.title}
                  </h4>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-red-50"
                    title="删除对话"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <span className="text-[10px] text-gray-400">
                  {format(conv.updatedAt, 'MM-dd HH:mm', { locale: zhCN })}
                </span>
              </div>
            </div>
          ))}
          
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-xs text-gray-400">暂无历史对话</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
