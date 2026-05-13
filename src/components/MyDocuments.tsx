import React from 'react';
import { 
  Search, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Clock, 
  X,
  FileDown
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { MOCK_SAVED_DOCUMENTS, SavedDocument } from '@/src/data/mockDocuments';
import Markdown from 'react-markdown';
import Pagination from './Pagination';

export default function MyDocuments() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [documents, setDocuments] = React.useState<SavedDocument[]>(MOCK_SAVED_DOCUMENTS);
  const [previewDoc, setPreviewDoc] = React.useState<SavedDocument | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to first page when searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredDocs.length / pageSize);
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这份文书吗？此操作不可撤销。')) {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleDownload = (doc: SavedDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would generate a file (PDF/Docx)
    alert(`正在准备下载: ${doc.name}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      {/* Header */}
      <div className="px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">我的文书</h2>
          <p className="text-sm text-gray-500 mt-0.5">管理您在智能文书编写中生成并保存的所有文档</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-72">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索文书名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
           </div>
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm max-w-7xl mx-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-normal text-gray-500 uppercase tracking-wider">文书名称</th>
                <th className="px-6 py-4 text-xs font-normal text-gray-500 uppercase tracking-wider">类型</th>
                <th className="px-6 py-4 text-xs font-normal text-gray-500 uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-4 text-xs font-normal text-gray-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedDocs.map((doc) => (
                <tr 
                  key={doc.id} 
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  onClick={() => setPreviewDoc(doc)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-normal text-gray-900 group-hover:text-blue-600">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-500 uppercase">{doc.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{format(doc.createdAt, 'yyyy-MM-dd HH:mm')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={(e) => handleDownload(doc, e)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="下载"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(doc.id, e)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredDocs.length}
            pageSize={pageSize}
          />

          {/* Empty State */}
          {filteredDocs.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mb-4 animate-pulse">
                <FileText size={40} />
              </div>
              <h3 className="text-gray-900 font-normal text-lg tracking-tight mb-1">未搜索到相关文书</h3>
              <p className="text-xs text-gray-400 max-w-[200px]">尝试更换关键字，或者前往“智能文书填写”模块生成新文书</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewDoc(null)}
              className="absolute inset-0 bg-gray-900/60"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">{previewDoc.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">{previewDoc.type}</span>
                      <span className="text-[10px] text-gray-400 font-medium">生成于 {format(previewDoc.createdAt, 'yyyy-MM-dd HH:mm')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => handleDownload(previewDoc, e)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                  >
                    <FileDown size={18} />
                    下载文书
                  </button>
                  <button 
                    onClick={() => setPreviewDoc(null)}
                    className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 bg-gray-50/50 custom-scrollbar">
                <div className="max-w-3xl mx-auto bg-white shadow-2xl shadow-gray-200/50 rounded-2xl p-16 min-h-[1000px] border border-gray-100 relative">
                   {/* Watermark */}
                   <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center -rotate-12 select-none">
                     <span className="text-[120px] font-bold">DRAFT</span>
                   </div>
                   
                   <div className="prose prose-blue max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed">
                     <Markdown>{previewDoc.content}</Markdown>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
