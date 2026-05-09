import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Edit2, 
  Trash2, 
  Eye, 
  Settings, 
  X, 
  Save, 
  ChevronRight, 
  Info,
  ToggleLeft,
  ToggleRight,
  ClipboardList,
  FileCheck,
  FileText,
  Zap,
  BookOpen,
  Database,
  Layers
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CorrectionRule, RuleParam } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './Pagination';

const CATEGORIES = [
  { id: 'all', label: '全部', icon: <Filter size={18} />, color: 'text-gray-600', bg: 'bg-gray-50' },
  { id: 'spelling', label: '拼写/语法', icon: <Zap size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'sensitive', label: '敏感词', icon: <ShieldCheck size={18} />, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'logic', label: '数据逻辑', icon: <Database size={18} />, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'knowledge', label: '知识性错误', icon: <BookOpen size={18} />, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'consistency', label: '上下文一致性', icon: <Layers size={18} />, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const DOC_TYPES = [
  { id: 'evidence', label: '取证单', icon: <ClipboardList size={14} /> },
  { id: 'working_paper', label: '底稿', icon: <FileCheck size={14} /> },
  { id: 'report', label: '报告', icon: <FileText size={14} /> },
];

const MOCK_RULES: CorrectionRule[] = [
  {
    id: 'rule1',
    name: '金额单位一致性校验',
    category: 'logic',
    docTypes: ['evidence', 'working_paper'],
    logic: '检测文档中出现的金额单位是否统一（如万元与元混用）。',
    suggestion: '统一建议使用“万元”作为计量单位。',
    status: 'enabled',
    params: [
      { key: 'precision', label: '校验精度', value: 2, type: 'number' },
      { key: 'default_unit', label: '默认单位', value: '万元', type: 'select', options: ['元', '万元', '亿元'] }
    ],
    creator: '系统管理员',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'rule2',
    name: '政治敏感词库过滤',
    category: 'sensitive',
    docTypes: ['evidence', 'working_paper', 'report'],
    logic: '基于内置政治敏感词库进行全文扫描。',
    suggestion: '建议替换为中性表述或删除。',
    status: 'enabled',
    params: [
      { key: 'threshold', label: '匹配阈值', value: 0.85, type: 'number' }
    ],
    creator: '安全专家',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 7200000
  },
  {
    id: 'rule3',
    name: '常见错别字自动修正',
    category: 'spelling',
    docTypes: ['report'],
    logic: '检测并修正审计报告中常见的文字排版及拼写错误。',
    suggestion: '自动修正为正确词汇。',
    status: 'disabled',
    params: [],
    creator: '张审计',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 1800000
  }
];

export default function CorrectionRuleMgmt() {
  const [activeCategory, setActiveCategory] = React.useState<CorrectionRule['category'] | 'all'>('all');
  const [rules, setRules] = React.useState<CorrectionRule[]>(MOCK_RULES);
  const [search, setSearch] = React.useState('');
  const [editingRule, setEditingRule] = React.useState<CorrectionRule | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState<string | null>(null);

  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const filteredRules = rules.filter(r => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reset to first page when filtering
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory]);

  const totalPages = Math.ceil(filteredRules.length / pageSize);
  const paginatedRules = filteredRules.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleToggleStatus = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, status: r.status === 'enabled' ? 'disabled' : 'enabled' } : r));
  };

  const handleAddRule = () => {
    setEditingRule({
      id: '',
      name: '',
      category: activeCategory === 'all' ? 'spelling' : activeCategory,
      docTypes: [],
      logic: '',
      suggestion: '',
      status: 'enabled',
      params: [],
      creator: '当前用户',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  };

  const handleSave = (rule: CorrectionRule) => {
    if (rule.id) {
      setRules(rules.map(r => r.id === rule.id ? rule : r));
    } else {
      setRules([...rules, { ...rule, id: 'rule-' + Date.now() }]);
    }
    setEditingRule(null);
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      setRules(rules.filter(r => r.id !== showDeleteModal));
      setShowDeleteModal(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">矫正规则配置</h2>
          <p className="text-sm text-gray-500 mt-0.5 whitespace-nowrap">精细化管理文档矫正逻辑，确保审计文书专业性与准确性</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索规则名称..."
              className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium"
            />
          </div>
          <button 
            onClick={handleAddRule}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm font-medium shrink-0"
          >
            <Plus size={18} />
            <span>新增规则</span>
          </button>
        </div>
      </div>

      {/* Table List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center gap-2 p-1 bg-white border border-gray-100 rounded-xl shadow-sm w-fit">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0",
                  activeCategory === cat.id ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-900"
                )}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden max-w-7xl mx-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-normal text-gray-400 uppercase tracking-wider">规则名称</th>
                <th className="px-6 py-4 text-[10px] font-normal text-gray-400 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-[10px] font-normal text-gray-400 uppercase tracking-wider">更新时间</th>
                <th className="px-6 py-4 text-[10px] font-normal text-gray-400 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedRules.map((rule) => (
                <tr key={rule.id} className={cn(
                  "hover:bg-gray-50/50 transition-colors group",
                  rule.status === 'disabled' && "opacity-60"
                )}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-normal text-gray-900 group-hover:text-blue-600 transition-colors">
                        {rule.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 line-clamp-1">{rule.logic}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStatus(rule.id)}
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                        rule.status === 'enabled' 
                          ? "bg-green-50 text-green-600 border border-green-100" 
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                      )}
                    >
                      {rule.status === 'enabled' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      <span>{rule.status === 'enabled' ? '启用中' : '已禁用'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(rule.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setEditingRule(rule)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setShowDeleteModal(rule.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRules.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">暂无该类型规则</h3>
                    <p className="text-gray-500 mt-1">您可以点击右上角按钮新增一个矫正规则</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRules.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Rule Editor Modal */}
      <AnimatePresence>
        {editingRule && (
          <RuleEditor 
            rule={editingRule} 
            onClose={() => setEditingRule(null)} 
            onSave={handleSave} 
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-normal text-gray-900 tracking-tight mb-2">确认删除规则？</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  删除后该规则将不再参与文档矫正。已完成的矫正任务不受影响。
                </p>
              </div>
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowDeleteModal(null)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RuleEditor({ rule, onClose, onSave }: { rule: CorrectionRule; onClose: () => void; onSave: (r: CorrectionRule) => void }) {
  const [formData, setFormData] = React.useState<CorrectionRule>({ ...rule, docTypes: [], params: [], suggestion: '' });

  const isFormValid = formData.name.trim() !== '' && formData.logic.trim() !== '' && !!formData.category;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-normal text-gray-900 tracking-tight">{rule.id ? '修改矫正规则' : '新增矫正规则'}</h3>
            <p className="text-xs text-gray-500 mt-1">配置规则名称、分类及检测逻辑</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                规则名称
                <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="请输入规则名称"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                规则分类
                <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFormData({ ...formData, category: cat.id as any })}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all",
                      formData.category === cat.id
                        ? "bg-blue-50 border-blue-200 text-blue-600 ring-1 ring-blue-200 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <div className={cn("flex items-center justify-center shrink-0 scale-75", formData.category === cat.id ? "text-blue-600" : "text-gray-400")}>
                      {cat.icon}
                    </div>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                检测逻辑描述
                <span className="text-red-500">*</span>
              </label>
              <textarea 
                value={formData.logic}
                onChange={(e) => setFormData({ ...formData, logic: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[140px] resize-none"
                placeholder="请详细描述该规则的检测逻辑..."
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
          >
            取消
          </button>
          <button 
            disabled={!isFormValid}
            onClick={() => onSave({ ...formData, updatedAt: Date.now() })}
            className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-blue-600"
          >
            <Save size={18} />
            <span>保存规则</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
