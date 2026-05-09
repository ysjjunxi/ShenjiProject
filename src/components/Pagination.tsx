import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn("flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100", className)}>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        显示 <span className="font-bold text-gray-900">{startItem}-{endItem}</span> / 共 <span className="font-bold text-gray-900">{totalItems}</span> 条记录
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "p-2 rounded-lg border border-gray-200 transition-all",
            currentPage === 1 ? "text-gray-300 bg-gray-50 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50 hover:border-gray-300"
          )}
        >
          <ChevronLeft size={16} />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-8 h-8 rounded-lg text-xs font-bold transition-all",
              currentPage === page 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
            )}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "p-2 rounded-lg border border-gray-200 transition-all",
            currentPage === totalPages ? "text-gray-300 bg-gray-50 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50 hover:border-gray-300"
          )}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
