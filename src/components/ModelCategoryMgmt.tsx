import React from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertCircle,
  Folder,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ModelCategory } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './Pagination';

const MOCK_CATEGORIES: ModelCategory[] = [
  {
    id: 'c1',
    name: '财政收支审计类模型',
    description: '审计预算编制是否科学、执行是否严格符合规定，包含三公经费、国库支付等。',
    parentId: null,
    level: 1,
    modelCount: 12,
  },
  {
    id: 'c2',
    name: '重大政策贯彻执行审计模型',
    description: '审计重大政策落实及资金使用效果，如乡村振兴、专项债券等。',
    parentId: null,
    level: 1,
    modelCount: 11,
  },
  {
    id: 'c3',
    name: '重大项目建设审计模型',
    description: '针对基建工程、水利工程、市政工程的全生命周期审计。',
    parentId: null,
    level: 1,
    modelCount: 10,
  },
  {
    id: 'c4',
    name: '民生保障审计模型',
    description: '审计医保、惠农、低保、教育等民生领域资金使用。',
    parentId: null,
    level: 1,
    modelCount: 12,
  },
  {
    id: 'c5',
    name: '国有资产资源审计模型',
    description: '审计农村集体“三资”、国有资产处置、土地资源使用等。',
    parentId: null,
    level: 1,
    modelCount: 11,
  },
  {
    id: 'c6',
    name: '领导干部审计模型',
    description: '审计领导干部任职期间的经济责任履行、重大决策合规性等。',
    parentId: null,
    level: 1,
    modelCount: 10,
  }
];

export default function ModelCategoryMgmt() {
  const [categories, setCategories] = React.useState<ModelCategory[]>(MOCK_CATEGORIES);
  const [search, setSearch] = React.useState('');
  const [showModal, setShowModal] = React.useState<'add' | 'edit' | 'delete' | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<ModelCategory | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Reset to first page when filtering
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] overflow-y-auto relative">
      {/* Header */}
      <div className="px-8 h-[90px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shrink-0 shadow-sm sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">模型分类管理</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">统一管理系统的业务分类模型目录</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-72 group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索分类名称或描述..."
              className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-300 transition-all"
            />
          </div>
          <button 
            onClick={() => {
              setFormData({ name: '', description: '' });
              setShowModal('add');
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus size={16} />
            <span>新增分类</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="px-8 py-5 text-xs font-normal text-gray-400 uppercase tracking-widest w-[30%]">分类名称</th>
                    <th className="px-8 py-5 text-xs font-normal text-gray-400 uppercase tracking-widest w-[45%]">描述</th>
                    <th className="px-8 py-5 text-xs font-normal text-gray-400 uppercase tracking-widest w-[10%] text-center">包含模型</th>
                    <th className="px-8 py-5 text-xs font-normal text-gray-400 uppercase tracking-widest w-[15%] text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedCategories.map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                            <Folder size={18} />
                          </div>
                          <span className="text-sm font-normal text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.description}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-bold font-arial">
                          {item.modelCount}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setSelectedCategory(item);
                              setFormData({ name: item.name, description: item.description || '' });
                              setShowModal('edit');
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="修改"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedCategory(item);
                              setShowModal('delete');
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="删除"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Folder size={32} className="text-gray-200" />
                          <p>未找到匹配的分类</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredCategories.length}
              pageSize={pageSize}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                  {showModal === 'add' ? '新增业务分类' : showModal === 'edit' ? '修改业务分类' : '确认删除分类'}
                </h3>
                <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full">
                  <X size={16} />
                </button>
              </div>

              <div className="p-8">
                {showModal === 'delete' ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
                      <AlertCircle size={32} />
                    </div>
                    <p className="text-center text-gray-600 leading-relaxed text-sm">
                      确定要删除分类 <span className="font-bold text-gray-900">"{selectedCategory?.name}"</span> 吗？
                    </p>
                    {selectedCategory?.modelCount ? (
                      <p className="text-center text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">
                        注意：该分类下包含 {selectedCategory.modelCount} 个模型，删除可能影响相关的业务流程。
                      </p>
                    ) : null}
                    <p className="text-center text-xs text-gray-400 mt-2">此操作不可恢复，请谨慎确认。</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">分类名称</label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="请输入分类名称 (如: 专项资金审计)"
                        className="w-full h-12 bg-gray-50/50 border border-gray-200 rounded-xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-400 transition-all placeholder:font-normal placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">分类描述</label>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="请输入该分类的业务描述和适用范围..."
                        rows={4}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-400 transition-all resize-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-3xl">
                <button 
                  onClick={() => setShowModal(null)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 rounded-xl transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => setShowModal(null)}
                  className={cn(
                    "px-8 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-lg active:scale-95",
                    showModal === 'delete' ? "bg-red-600 hover:bg-red-700 shadow-red-500/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                  )}
                >
                  确认{showModal === 'delete' ? '删除' : '保存'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
