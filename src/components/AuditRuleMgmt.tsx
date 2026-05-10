import React from 'react';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  X,
  Settings,
  ShieldCheck,
  FileText,
  Save,
  Info,
  Terminal,
  Play,
  Activity,
  AlertTriangle,
  Clock,
  Calendar,
  Building2,
  Wallet,
  ChevronRight,
  Minus,
  CheckCircle,
  ChevronDown,
  Check,
  BookOpen,
  Link2,
  Upload
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuditRule, RuleParam } from '@/src/types';
import { MOCK_MODELS } from './AuditModelMgmt';
import { MOCK_RULES } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './Pagination';

export default function AuditRuleMgmt({ hideHeader = false }: { hideHeader?: boolean }) {
  const [view, setView] = React.useState<'list' | 'config'>('list');
  const [rules, setRules] = React.useState<AuditRule[]>(MOCK_RULES);
  const [search, setSearch] = React.useState('');
  const [businessTypeFilter, setBusinessTypeFilter] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [isTypeDropdownOpen2, setIsTypeDropdownOpen2] = React.useState(false);
  const dropdownRef2 = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [editingRule, setEditingRule] = React.useState<AuditRule | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState<string | null>(null);
  const [modelsViewerData, setModelsViewerData] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen2(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const BUSINESS_TYPES = ['通用业务', '财务审计业务', '专项资金业务', '工程审计业务', '经济责任审计业务'];

  const filteredRules = rules.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                         r.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = businessTypeFilter === 'all' || r.businessType === businessTypeFilter;
    return matchesSearch && matchesType;
  });

  // Reset to first page when filtering
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, businessTypeFilter]);

  const totalPages = Math.ceil(filteredRules.length / pageSize);
  const paginatedRules = filteredRules.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAddRule = () => {
    setEditingRule({
      id: '',
      name: '',
      businessType: '通用业务',
      ruleType: 'general',
      description: '',
      fixedCheckpoints: [{ name: '', description: '' }],
      configurableCheckpoints: [{
        id: 'cc_' + Date.now(),
        name: '',
        logicGroups: [
          {
            id: 'lg_' + Date.now(),
            relation: 'AND',
            logicBlocks: [
              { id: 'lb_' + Date.now(), leftTerm: '', operator: '>', rightTerm: '', rightType: 'param', relation: '' }
            ],
            penaltyBasis: { source: '', chapter: '', content: '' }
          }
        ]
      }],
      standardTables: [],
      outputData: '',
      apiUrl: '',
      status: 'enabled',
      creator: '当前用户',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    setView('config');
  };

  const handleImportRules = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content);
        
        // Basic validation: check if it's an array or a single object
        const newRules = Array.isArray(imported) ? imported : [imported];
        
        // Ensure required fields are present (very basic check)
        const validRules = newRules.filter(r => r.name && r.businessType).map(r => ({
          ...r,
          id: 'rule-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          status: r.status || 'enabled',
          creator: r.creator || '导入用户',
          standardTables: r.standardTables || []
        }));

        if (validRules.length > 0) {
          setRules([...rules, ...validRules]);
          // Reset input
          if (fileInputRef.current) fileInputRef.current.value = '';
          alert(`成功导入 ${validRules.length} 条规则`);
        } else {
          alert('未能识别有效的规则配置，请检查文件格式。');
        }
      } catch (err) {
        console.error('Import failed:', err);
        alert('解析文件失败，请确保文件是有效的 JSON 格式。');
      }
    };
    reader.readAsText(file);
  };

  const handleEditRule = (rule: AuditRule) => {
    setEditingRule(rule);
    setView('config');
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      setRules(rules.filter(r => r.id !== showDeleteModal));
      setShowDeleteModal(null);
    }
  };

  const handleSaveRule = (rule: AuditRule) => {
    if (rule.id) {
      setRules(rules.map(r => r.id === rule.id ? rule : r));
    } else {
      setRules([...rules, { ...rule, id: 'rule-' + Date.now() }]);
    }
    setView('list');
    setEditingRule(null);
  };

  if (view === 'config' && editingRule) {
    return (
      <RuleConfig 
        rule={editingRule} 
        onBack={() => {
          setView('list');
          setEditingRule(null);
        }} 
        onSave={handleSaveRule}
      />
    );
  }

  return (
    <div className={cn("flex-1 flex flex-col overflow-hidden", !hideHeader && "bg-white")}>
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleImportRules}
        accept=".json"
        className="hidden"
      />
      {/* Header */}
      {!hideHeader && (
        <div className="px-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0">
          <div>
            <h2 className="text-xl font-normal text-gray-900 tracking-tight">审查点管理</h2>
            <p className="text-sm text-gray-500 mt-0.5">定义审计业务逻辑规则，支持多模型灵活配置</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Audit Type Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="h-10 bg-gray-50 border border-gray-200 rounded-lg px-4 flex items-center justify-between gap-4 text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-300 transition-all min-w-[160px]"
              >
                <span>{businessTypeFilter === 'all' ? '全部业务类型' : businessTypeFilter}</span>
                <ChevronDown className={cn("text-gray-400 transition-transform", isTypeDropdownOpen && "rotate-180")} size={16} />
              </button>
              
              <AnimatePresence>
                {isTypeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-2 scrollbar-none max-h-64 overflow-y-auto"
                  >
                    <button
                      onClick={() => {
                        setBusinessTypeFilter('all');
                        setIsTypeDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm flex items-center justify-between",
                        businessTypeFilter === 'all' ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <span>全部业务类型</span>
                      {businessTypeFilter === 'all' && <Check size={14} />}
                    </button>
                    {BUSINESS_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setBusinessTypeFilter(type);
                          setIsTypeDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm flex items-center justify-between",
                          businessTypeFilter === type ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <span>{type}</span>
                        {businessTypeFilter === type && <Check size={14} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Box */}
            <div className="relative w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索审查点名称和描述"
                className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium"
              />
            </div>
            <button 
              onClick={handleAddRule}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
            >
              <Plus size={18} />
              <span className="font-medium">新增审查点</span>
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className={cn("flex-1 overflow-y-auto p-6 bg-gray-50/30", hideHeader && "pt-0")}>
        {hideHeader && (
          <div className="max-w-7xl mx-auto mb-4 flex items-center justify-end gap-3">
            {/* Audit Type Dropdown */}
            <div className="relative" ref={dropdownRef2}>
              <button
                onClick={() => setIsTypeDropdownOpen2(!isTypeDropdownOpen2)}
                className="h-10 bg-white border border-gray-200 rounded-lg px-4 flex items-center justify-between gap-4 text-sm font-medium text-gray-700 hover:border-gray-300 transition-all min-w-[160px]"
              >
                <span>{businessTypeFilter === 'all' ? '全部业务类型' : businessTypeFilter}</span>
                <ChevronDown className={cn("text-gray-400 transition-transform", isTypeDropdownOpen2 && "rotate-180")} size={16} />
              </button>
              
              <AnimatePresence>
                {isTypeDropdownOpen2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-2 scrollbar-none max-h-64 overflow-y-auto"
                  >
                    <button
                      onClick={() => {
                        setBusinessTypeFilter('all');
                        setIsTypeDropdownOpen2(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm flex items-center justify-between",
                        businessTypeFilter === 'all' ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <span>全部业务类型</span>
                      {businessTypeFilter === 'all' && <Check size={14} />}
                    </button>
                    {BUSINESS_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setBusinessTypeFilter(type);
                          setIsTypeDropdownOpen2(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm flex items-center justify-between",
                          businessTypeFilter === type ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <span>{type}</span>
                        {businessTypeFilter === type && <Check size={14} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索审查点名称和描述"
                className="w-64 h-10 bg-white border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
            </div>
            <button 
              onClick={handleAddRule}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Plus size={18} />
              <span className="font-medium">新增审查点</span>
            </button>
          </div>
        )}
        <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-normal">审查点名称</th>
                <th className="px-6 py-4 font-normal">适用业务类型</th>
                <th className="px-6 py-4 font-normal">审查点类型</th>
                <th className="px-6 py-4 font-normal">执行规则</th>
                <th className="px-6 py-4 font-normal">描述</th>
                <th className="px-6 py-4 font-normal">状态</th>
                <th className="px-6 py-4 font-normal">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div 
                      onClick={() => handleEditRule(rule)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-normal text-gray-900 group-hover:text-blue-600 transition-colors">{rule.name}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          {rule.creator}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-bold tracking-wider bg-purple-50 text-purple-600 border border-purple-100">
                      {rule.businessType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 font-medium">
                      {rule.ruleType === 'general' ? '通用规则' : '专用规则'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={rule.fixedCheckpoints.map(c => c.name).concat(rule.configurableCheckpoints?.map(c => c.name) || []).join(', ')}>
                    {rule.fixedCheckpoints.length + (rule.configurableCheckpoints?.length || 0)}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={rule.description}>
                    {rule.description}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {rule.status === 'enabled' ? (
                        <div className="flex items-center gap-1.5 text-green-600">
                          <CheckCircle2 size={14} />
                          <span className="text-xs font-medium">已启用</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <RefreshCw size={14} />
                          <span className="text-xs font-medium">已禁用</span>
                        </div>
                      )}
                      
                      <div className="w-px h-3 bg-gray-200"></div>

                      {(() => {
                        const relatedModels = MOCK_MODELS.filter(m => 
                          m.checkpoints?.some(cp => cp.ruleId === rule.id)
                        );
                        if (relatedModels.length > 0) {
                          return (
                            <button 
                              onClick={() => setModelsViewerData(relatedModels)}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded transition-colors"
                            >
                              <span>已关联 {relatedModels.length} 个模型</span>
                            </button>
                          );
                        }
                        return <span className="text-xs text-gray-400 px-2">未关联模型</span>;
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditRule(rule)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (!MOCK_MODELS.some(m => m.checkpoints?.some(cp => cp.ruleId === rule.id))) {
                            setShowDeleteModal(rule.id);
                          }
                        }}
                        disabled={MOCK_MODELS.some(m => m.checkpoints?.some(cp => cp.ruleId === rule.id))}
                        title={MOCK_MODELS.some(m => m.checkpoints?.some(cp => cp.ruleId === rule.id)) ? "已被使用的规则不可删除" : "删除模型"}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          MOCK_MODELS.some(m => m.checkpoints?.some(cp => cp.ruleId === rule.id))
                            ? "text-gray-300 cursor-not-allowed opacity-50"
                            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                        )}
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
            totalItems={filteredRules.length}
            pageSize={pageSize}
          />
          
          {filteredRules.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings size={32} className="text-gray-200" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">未找到相关规则</h3>
              <p className="text-gray-500 mt-1">请尝试更换搜索关键词或筛选条件</p>
            </div>
          )}
        </div>
      </div>

      {/* Models Viewer Modal */}
      <AnimatePresence>
        {modelsViewerData && (
          <ModelsViewerModal 
            models={modelsViewerData} 
            onClose={() => setModelsViewerData(null)} 
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
                  删除后该规则将无法在模型中被调用，此操作不可恢复。
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

function RuleConfig({ rule, onBack, onSave }: { rule: AuditRule; onBack: () => void; onSave: (rule: AuditRule) => void }) {
  const [formData, setFormData] = React.useState<AuditRule>({ ...rule });
  const [showLawSelector, setShowLawSelector] = React.useState<{ccIndex: number, lgIndex: number} | null>(null);

  const handleSelectLaw = (index: {ccIndex: number, lgIndex: number}, pb: { source: string, chapter: string, content: string }) => {
    setShowLawSelector(null);
    const newConfigurable = [...formData.configurableCheckpoints];
    const lg = [...newConfigurable[index.ccIndex].logicGroups];
    lg[index.lgIndex] = { ...lg[index.lgIndex], penaltyBasis: pb };
    newConfigurable[index.ccIndex] = { ...newConfigurable[index.ccIndex], logicGroups: lg };
    setFormData({ ...formData, configurableCheckpoints: newConfigurable });
  };

  const addConfigurableCheckpoint = () => {
    if (formData.configurableCheckpoints.length >= 1) return;
    setFormData({
      ...formData,
      configurableCheckpoints: [
        ...formData.configurableCheckpoints,
        {
          id: 'cc_' + Date.now(),
          name: '',
          logicGroups: [{
            id: 'lg_' + Date.now(),
            relation: 'AND',
            logicBlocks: [
              { id: 'lb_' + Date.now(), leftTerm: '', operator: '>', rightTerm: '', rightType: 'param', relation: '' }
            ],
            penaltyBasis: { source: '', chapter: '', content: '' }
          }]
        }
      ]
    });
  };

  const updateConfigurableCheckpoint = (index: number, changes: any) => {
    const newList = [...formData.configurableCheckpoints];
    newList[index] = { ...newList[index], ...changes };
    setFormData({ ...formData, configurableCheckpoints: newList });
  };

  const removeConfigurableCheckpoint = (index: number) => {
    const newList = [...formData.configurableCheckpoints];
    newList.splice(index, 1);
    setFormData({ ...formData, configurableCheckpoints: newList });
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-normal text-gray-900 tracking-tight">{formData.id ? '修改审查点' : '新增审查点'}</h2>
            <p className="text-sm text-gray-500 mt-0.5">配置规则的详细执行参数与信息</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
          {/* Basic Info */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 flex items-center gap-2">
              <Info size={20} className="text-blue-600" />
              基本信息
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">审查点名称</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入审查点名称"
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">审查点类型</label>
                <select 
                  value={formData.ruleType}
                  onChange={(e) => setFormData({ ...formData, ruleType: e.target.value as any })}
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                >
                  <option value="general">通用规则</option>
                  <option value="dedicated">专用规则</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">适用业务类型</label>
                <select 
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                >
                  <option value="通用业务">通用业务</option>
                  <option value="财务审计业务">财务审计业务</option>
                  <option value="专项资金业务">专项资金业务</option>
                  <option value="工程审计业务">工程审计业务</option>
                  <option value="经济责任审计业务">经济责任审计业务</option>
                </select>
              </div>
              <div className="space-y-2 pr-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">规则调用地址(API)</label>
                <input 
                  type="text"
                  value={formData.apiUrl}
                  onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                  placeholder="如: /api/rules/check"
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">规则描述</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="简要说明规则的功能"
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Logic Config */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 flex items-center gap-2">
              <ShieldCheck size={20} className="text-purple-600" />
              执行逻辑与判定
            </h3>
            
            <div className="space-y-6">
              {/* Fixed Checkpoints */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">法定固定规则</label>
                  {formData.fixedCheckpoints.length === 0 && (
                    <button 
                      onClick={() => setFormData({...formData, fixedCheckpoints: [...formData.fixedCheckpoints, { name: '', description: '' }]})} 
                      className="text-xs text-purple-600 font-medium hover:text-purple-700"
                    >
                      + 新增法定固定规则
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {formData.fixedCheckpoints.map((cp, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                      <input className="w-full text-sm font-bold bg-transparent border-b border-dashed border-gray-300 pb-1 outline-none mb-2 focus:border-purple-500 placeholder-gray-400" placeholder="审查点名称" value={cp.name} onChange={e => {
                        const newCp = [...formData.fixedCheckpoints];
                        newCp[idx].name = e.target.value;
                        setFormData({...formData, fixedCheckpoints: newCp});
                      }} />
                      <textarea className="w-full text-xs text-gray-600 bg-transparent outline-none resize-none placeholder-gray-400" rows={2} placeholder="详细内容" value={cp.description} onChange={e => {
                        const newCp = [...formData.fixedCheckpoints];
                        newCp[idx].description = e.target.value;
                        setFormData({...formData, fixedCheckpoints: newCp});
                      }} />
                    </div>
                  ))}
                  {formData.fixedCheckpoints.length === 0 && <div className="text-center py-4 bg-gray-50 border border-dashed rounded-xl border-gray-200 text-xs text-gray-400">暂无法定固定规则</div>}
                </div>
              </div>

              {/* Business Checkpoints (Configurable) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">可配置业务规则</label>
                  {formData.configurableCheckpoints.length === 0 && (
                    <button onClick={addConfigurableCheckpoint} className="text-xs text-orange-600 font-medium hover:text-orange-700 bg-orange-50 px-2 py-1 rounded">+ 新增可配置业务规则</button>
                  )}
                </div>
                <div className="space-y-6">
                  {formData.configurableCheckpoints.map((cc, index) => (
                    <div key={cc.id} className="p-5 bg-orange-50/20 rounded-2xl border border-orange-100 relative group/cc">
                      <div className="mb-4 pr-10">
                        <label className="text-xs text-orange-600 font-bold uppercase tracking-widest mb-1 block">判断规则名称</label>
                        <input className="w-full text-sm font-bold bg-transparent border-b border-dashed border-gray-300 pb-1 mb-2 outline-none focus:border-orange-500 placeholder-gray-400" placeholder="例如: 合同违规判定" value={cc.name} onChange={e => updateConfigurableCheckpoint(index, { name: e.target.value })} />
                      </div>

                      {/* Logic Groups */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-widest"><Terminal size={14} className="inline mr-1 text-orange-500" /> 逻辑块配置</label>
                          <button onClick={() => {
                            const logicGroups = [...cc.logicGroups, {
                              id: 'lg_' + Date.now(),
                              relation: 'AND',
                              logicBlocks: [{ id: 'lb_' + Date.now(), leftTerm: '', operator: '>', rightTerm: '', rightType: 'param' as const, relation: 'AND' }],
                              penaltyBasis: { source: '', chapter: '', content: '' }
                            }];
                            updateConfigurableCheckpoint(index, { logicGroups });
                          }} className="text-xs bg-orange-100 text-orange-600 px-3 py-1.5 rounded hover:bg-orange-200 transition-colors">+ 添加新逻辑块</button>
                        </div>
                        
                        <div className="space-y-8">
                          {cc.logicGroups.map((lg, lgIndex) => (
                            <div key={lg.id} className="p-4 bg-white rounded-xl border border-orange-200 shadow-sm relative group/lg">
                              {lgIndex > 0 && (
                                <div className="absolute -top-[16px] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-sm border border-orange-200 overflow-hidden z-20">
                                  <select 
                                    value={lg.relation} 
                                    onChange={(e) => {
                                      const logicGroups = [...cc.logicGroups];
                                      logicGroups[lgIndex] = { ...logicGroups[lgIndex], relation: e.target.value };
                                      updateConfigurableCheckpoint(index, { logicGroups });
                                    }}
                                    className="text-xs font-bold text-orange-600 outline-none w-12 text-center cursor-pointer py-1 bg-transparent hover:bg-orange-50 transition-colors appearance-none"
                                    style={{ textAlignLast: 'center' }}
                                  >
                                    <option value="AND">且</option>
                                    <option value="OR">或</option>
                                  </select>
                                </div>
                              )}
                              <button onClick={() => {
                                const logicGroups = [...cc.logicGroups];
                                logicGroups.splice(lgIndex, 1);
                                updateConfigurableCheckpoint(index, { logicGroups });
                              }} className="absolute -top-3 -right-3 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/lg:opacity-100 transition-opacity hover:bg-red-200 shadow-sm z-20">
                                <X size={12} />
                              </button>
                              
                              <div className="flex items-center justify-between mb-4 mt-2">
                                 <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><Terminal size={14} className="text-orange-500" /> 规则校验逻辑块 ({lgIndex + 1})</label>
                                 <button onClick={() => {
                                   const logicGroups = [...cc.logicGroups];
                                   logicGroups[lgIndex].logicBlocks.push({ id: 'lb_' + Date.now(), leftTerm: '', operator: '>', rightTerm: '', rightType: 'param' as const, relation: 'AND' });
                                   updateConfigurableCheckpoint(index, { logicGroups });
                                 }} className="text-xs font-medium text-orange-600 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">+ 添加校验条件</button>
                              </div>
                              <div className="relative pl-12 pt-4 pb-4 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm pr-4 mb-4">
                                {lg.logicBlocks.length > 1 && (
                                  <div className="absolute left-[20px] top-10 bottom-10 w-px bg-gray-300"></div>
                                )}
                                
                                {lg.logicBlocks.map((lb, bIdx) => (
                                  <div key={lb.id} className="relative mb-4 last:mb-0 group/lbwrapper z-10">
                                     {bIdx > 0 && (
                                       <div className="absolute -left-[28px] top-1/2 w-[28px] h-px bg-gray-300 -z-10"></div>
                                     )}
                                     
                                     {bIdx > 0 && (
                                       <div className="absolute -left-[40px] top-1/2 -translate-y-1/2 bg-white rounded-md shadow-sm border border-orange-200 overflow-hidden group-hover/lbwrapper:border-orange-400 transition-colors z-20">
                                          <select 
                                            value={lb.relation} 
                                            onChange={(e) => {
                                              const logicGroups = [...cc.logicGroups];
                                              logicGroups[lgIndex].logicBlocks[bIdx] = { ...logicGroups[lgIndex].logicBlocks[bIdx], relation: e.target.value };
                                              updateConfigurableCheckpoint(index, { logicGroups });
                                            }}
                                            className="text-xs font-bold text-orange-600 outline-none w-10 text-center cursor-pointer py-1 bg-transparent hover:bg-orange-50 transition-colors appearance-none"
                                            style={{ textAlignLast: 'center' }}
                                          >
                                            <option value="AND">且</option>
                                            <option value="OR">或</option>
                                          </select>
                                       </div>
                                     )}
                                     
                                     <div className="w-full flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-orange-300 transition-colors group/lb">
                                       <input placeholder="变量A (如: 合同金额)" value={lb.leftTerm} onChange={e => { const lgs = [...cc.logicGroups]; lgs[lgIndex].logicBlocks[bIdx] = { ...lgs[lgIndex].logicBlocks[bIdx], leftTerm: e.target.value }; updateConfigurableCheckpoint(index, { logicGroups: lgs}); }} className="w-1/3 min-w-[120px] bg-gray-50 border border-transparent hover:border-gray-300 focus:border-orange-400 focus:bg-white rounded-lg px-3 py-1.5 text-xs outline-none transition-all" />
                                       <select value={lb.operator} onChange={e => { const lgs = [...cc.logicGroups]; lgs[lgIndex].logicBlocks[bIdx] = { ...lgs[lgIndex].logicBlocks[bIdx], operator: e.target.value }; updateConfigurableCheckpoint(index, { logicGroups: lgs}); }} className="w-16 bg-gray-50 border border-transparent hover:border-gray-300 focus:border-orange-400 focus:bg-white rounded-lg px-2 py-1.5 text-xs outline-none font-mono font-bold text-center transition-all appearance-none">
                                         <option value=">">&gt;</option><option value="<">&lt;</option><option value=">=">&gt;=</option><option value="<=">&lt;=</option><option value="==">==</option><option value="!=">!=</option>
                                       </select>
                                       <input placeholder="变量B / 固定值" value={lb.rightTerm} onChange={e => { const lgs = [...cc.logicGroups]; lgs[lgIndex].logicBlocks[bIdx] = { ...lgs[lgIndex].logicBlocks[bIdx], rightTerm: e.target.value }; updateConfigurableCheckpoint(index, { logicGroups: lgs}); }} className="flex-1 min-w-[100px] bg-gray-50 border border-transparent hover:border-gray-300 focus:border-orange-400 focus:bg-white rounded-lg px-3 py-1.5 text-xs outline-none transition-all" />
                                       
                                       <div className="w-px h-6 bg-gray-200 mx-1"></div>
                                       
                                       <div className="flex gap-2 items-center shrink-0">
                                         <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                                           <input type="checkbox" checked={lb.rightType==='param'} onChange={e => { const lgs = [...cc.logicGroups]; lgs[lgIndex].logicBlocks[bIdx] = { ...lgs[lgIndex].logicBlocks[bIdx], rightType: e.target.checked?'param':'fixed' }; updateConfigurableCheckpoint(index, { logicGroups: lgs}); }} className="w-3.5 h-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                                           参数化
                                         </label>
                                       </div>
                                       
                                       {lb.rightType === 'param' && (
                                         <div className="flex gap-1.5 items-center shrink-0 bg-gray-50 p-1 rounded-lg border border-gray-100">
                                            <input placeholder="默认值(如 5)" value={lb.paramValue||''} onChange={e => { const lgs = [...cc.logicGroups]; lgs[lgIndex].logicBlocks[bIdx] = { ...lgs[lgIndex].logicBlocks[bIdx], paramValue: e.target.value }; updateConfigurableCheckpoint(index, { logicGroups: lgs}); }} className="w-16 bg-white border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-orange-400 placeholder:text-xs" />
                                            <input placeholder="下限~上限" value={lb.paramRangeMin || lb.paramRangeMax ? `${lb.paramRangeMin||''}~${lb.paramRangeMax||''}` : ''} onChange={e => { const lgs = [...cc.logicGroups]; const parts = e.target.value.split('~'); lgs[lgIndex].logicBlocks[bIdx] = { ...lgs[lgIndex].logicBlocks[bIdx], paramRangeMin: parts[0]||'', paramRangeMax: parts[1]||'' }; updateConfigurableCheckpoint(index, { logicGroups: lgs}); }} className="w-20 bg-white border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-orange-400 placeholder:text-xs" title="输入格式: 下限~上限" />
                                            <input placeholder="单位" value={lb.paramUnit||''} onChange={e => { const lgs = [...cc.logicGroups]; lgs[lgIndex].logicBlocks[bIdx] = { ...lgs[lgIndex].logicBlocks[bIdx], paramUnit: e.target.value }; updateConfigurableCheckpoint(index, { logicGroups: lgs}); }} className="w-12 bg-white border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-orange-400 placeholder:text-xs" />
                                         </div>
                                       )}
                                       
                                       <button onClick={() => { const lgs = [...cc.logicGroups]; lgs[lgIndex].logicBlocks.splice(bIdx, 1); updateConfigurableCheckpoint(index, { logicGroups: lgs}); }} className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors ml-1 opacity-0 group-hover/lb:opacity-100"><X size={16}/></button>
                                     </div>
                                  </div>
                                ))}
                                {lg.logicBlocks.length === 0 && <p className="text-xs text-center text-gray-400 py-4">暂无校验逻辑，请添加</p>}
                              </div>

                              {/* Penalty Basis (One-to-One) */}
                              <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                                 <div className="flex items-center justify-between mb-3">
                                   <label className="text-xs font-bold text-green-700 flex items-center gap-1.5"><BookOpen size={14}/> 对应判罚依据 <span className="font-normal text-green-600/70">(一对一匹配)</span></label>
                                   <button onClick={() => setShowLawSelector({ccIndex: index, lgIndex: lgIndex})} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded shadow-sm hover:bg-green-200 flex items-center gap-1 transition-colors">
                                     <Search size={12}/> 从法律法规知识库选择
                                   </button>
                                 </div>
                                 <div className="grid grid-cols-2 gap-3 mb-3">
                                   <input placeholder="法规来源名称，如: 《预算法》" value={lg.penaltyBasis.source} onChange={e => { const lgs = [...cc.logicGroups]; lgs[lgIndex].penaltyBasis = {...lg.penaltyBasis, source: e.target.value}; updateConfigurableCheckpoint(index, { logicGroups: lgs }); }} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-green-400" />
                                   <input placeholder="具体章节条款，如: 第八条" value={lg.penaltyBasis.chapter} onChange={e => { const lgs = [...cc.logicGroups]; lgs[lgIndex].penaltyBasis = {...lg.penaltyBasis, chapter: e.target.value}; updateConfigurableCheckpoint(index, { logicGroups: lgs }); }} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-green-400" />
                                 </div>
                                 <textarea placeholder="相关法规内容的引述说明..." value={lg.penaltyBasis.content} onChange={e => { const lgs = [...cc.logicGroups]; lgs[lgIndex].penaltyBasis = {...lg.penaltyBasis, content: e.target.value}; updateConfigurableCheckpoint(index, { logicGroups: lgs }); }} rows={2} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs outline-none focus:border-green-400 resize-none leading-relaxed text-gray-600" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                  {formData.configurableCheckpoints.length === 0 && (
                    <div className="py-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                      <ShieldCheck size={24} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-xs text-gray-500">暂无可配置业务规则</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Output Content */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-normal tracking-tight text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              疑点输出配置
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">输出疑点数据格式/描述</label>
                <textarea 
                  value={formData.outputData}
                  onChange={(e) => setFormData({ ...formData, outputData: e.target.value })}
                  placeholder="描述规则触发后输出的疑点数据结构特点"
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Save Button Fixed Bottom Bar */}
      <div className="border-t border-gray-100 bg-white p-4 sticky bottom-0 z-10 shrink-0">
        <div className="max-w-5xl mx-auto flex justify-end gap-3">
          <button 
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all active:scale-95 border border-transparent hover:border-gray-200"
          >
            取消
          </button>
          <button 
            onClick={() => onSave({ ...formData, updatedAt: Date.now() })}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20 active:scale-95"
          >
            <Save size={16} />
            <span>保存规则</span>
          </button>
        </div>
      </div>
      
      {/* Law Selector Modal */}
      <AnimatePresence>
        {showLawSelector !== null && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLawSelector(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">选择判罚依据</h3>
                    <p className="text-xs text-gray-500">从法律法规知识库中选择对应的条款</p>
                  </div>
                </div>
                <button onClick={() => setShowLawSelector(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-4 border-b border-gray-100 shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="搜索相关法规文档或具体内容..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:bg-white shadow-sm transition-colors" />
                  </div>
                </div>
                
                <div className="flex-1 flex min-h-0 bg-white">
                  {/* Left Column: Law Documents */}
                  <div className="w-1/3 border-r border-gray-100 flex flex-col overflow-y-auto p-4 space-y-2 bg-gray-50/30">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-2">法规文件推荐</h4>
                    
                    <div className="p-3 rounded-xl border border-green-500 bg-green-50 cursor-pointer transition-colors shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText size={16} className="text-green-600" />
                        <span className="text-sm font-bold text-green-900 line-clamp-1">《中华人民共和国预算法》</span>
                      </div>
                      <p className="text-xs text-green-700/70 pl-6">包含 124 条款</p>
                    </div>

                    <div className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-700 line-clamp-1">《党政机关厉行节约反对浪费条例》</span>
                      </div>
                      <p className="text-xs text-gray-400 pl-6">包含 65 条款</p>
                    </div>
                    
                    <div className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-700 line-clamp-1">《中华人民共和国政府采购法》</span>
                      </div>
                      <p className="text-xs text-gray-400 pl-6">包含 88 条款</p>
                    </div>
                  </div>
                  
                  {/* Right Column: Clauses */}
                  <div className="w-2/3 flex flex-col overflow-y-auto p-4 space-y-3 bg-white">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-1">包含条款</h4>
                    
                    <div onClick={() => { if(showLawSelector) handleSelectLaw(showLawSelector, { source: '《中华人民共和国预算法》', chapter: '第三十二条', content: '各级预算应当根据年度经济社会发展目标、国家宏观调控总体要求和跨年度预算平衡的需要，参考上一年预算执行情况、有关支出绩效评价结果和本年度收支预测，按照规定程序征求各方面意见后，进行编制。'})}} className="bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-green-500 hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-2">
                         <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">第三十二条</span>
                         <button className="text-xs text-green-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">选择此条款</button>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
                        各级预算应当根据年度经济社会发展目标、国家宏观调控总体要求和跨年度预算平衡的需要，参考上一年预算执行情况、有关支出绩效评价结果和本年度收支预测，按照规定程序征求各方面意见后，进行编制。
                      </p>
                    </div>

                    <div onClick={() => { if (showLawSelector) handleSelectLaw(showLawSelector, { source: '《中华人民共和国预算法》', chapter: '第三十三条', content: '省、自治区、直辖市一般公共预算上下级独立，中央不对地方转移支付。'})}} className="bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-green-500 hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-2">
                         <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">第三十三条</span>
                         <button className="text-xs text-green-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">选择此条款</button>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
                        省、自治区、直辖市一般公共预算应当为其下级政府统筹安排财力，按照建立现代财政制度的要求，深化财税体制改革，完善预算管理制度，健全地方税体系。
                      </p>
                    </div>
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

function ModelsViewerModal({ models, onClose }: { models: any[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
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
              <Link2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">已关联的具体模型</h3>
              <p className="text-xs text-gray-500">此规则正在被以下审计模型使用</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {models.map(model => (
            <div key={model.id} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{model.name}</span>
                <span className="text-xs uppercase font-bold tracking-widest text-gray-400">{model.category}</span>
              </div>
              <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg border border-green-100">
                {model.status === 'enabled' ? '已启用' : '已禁用'}
              </div>
            </div>
          ))}
          {models.length === 0 && (
            <div className="text-center py-12 text-gray-400 italic">暂无关联模型</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
