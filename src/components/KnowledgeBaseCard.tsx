import React from 'react';
import { 
  MoreHorizontal, 
  MessageSquare, 
  Book, 
  Shield, 
  Database, 
  Clock,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { KnowledgeBase } from '@/src/types';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface KnowledgeBaseCardProps {
  kb: KnowledgeBase;
  onOpen: (kb: KnowledgeBase) => void;
  onChat: (kb: KnowledgeBase) => void;
  onDelete: (id: string) => void;
  onRename: (id: string) => void;
  readOnly?: boolean;
}

export default function KnowledgeBaseCard({ kb, onOpen, onChat, onDelete, onRename, readOnly }: KnowledgeBaseCardProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 flex flex-col gap-4 relative group hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onOpen(kb)}
    >
      {/* Icon and More Menu */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
           {/* Circuit/Chip Icon from Image */}
           <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M38 12V36C38 37.1046 37.1046 38 36 38H12C10.8954 38 10 37.1046 10 36V12C10 10.8954 10.8954 10 12 10H36C37.1046 10 38 10.8954 38 12Z" fill="#F0F9FF" stroke="#0EA5E9" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M24 16V18" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 30V32" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 24H32" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 24H18" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21V27H27V21H21Z" fill="#0EA5E9" stroke="#0EA5E9" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M18 18L21 21" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 30L27 27" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 18L27 21" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 30L21 27" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        {!readOnly && (
          <div className="relative group/more">
            <button 
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
            >
              <MoreHorizontal size={18} />
            </button>
            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all z-10 py-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(kb.id);
                }}
                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                重命名
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(kb.id);
                }}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50"
              >
                删除
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Title and Description */}
      <div className="space-y-1">
        <h3 className="text-base font-normal text-lg tracking-tight text-gray-800 tracking-tight">{kb.name}</h3>
        <p className="text-xs text-gray-500 font-medium line-clamp-1">{kb.description}</p>
      </div>

      {/* Stats and Tags */}
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-500">
           <Book size={12} />
           {kb.docCount}
        </div>
        <div className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-500">
           {kb.status}
        </div>
        <div className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-500">
           {kb.storageType}
        </div>
      </div>

      {/* Footer Info and Chat Action */}
      <div className="flex items-center justify-between mt-auto pt-4 overflow-hidden">
        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
           <div className="w-1 h-1 bg-gray-400 rounded-full mr-1" />
           {formatDistanceToNow(kb.updatedAt, { addSuffix: true, locale: zhCN })} 更新
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onChat(kb);
          }}
          className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 font-bold transition-colors"
        >
          <MessageSquare size={16} />
          <span className="text-xs">开始对话</span>
        </button>
      </div>
    </div>
  );
}
