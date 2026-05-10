import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Zap, 
  Clock, 
  User, 
  ChevronRight, 
  ChevronDown,
  Download, 
  Upload, 
  Link, 
  CheckCircle2, 
  XCircle,
  FileText,
  Settings,
  History,
  Terminal,
  ArrowLeft,
  Play,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  LayoutGrid,
  List as ListIcon,
  Code,
  Edit2,
  Trash2,
  X,
  Eye
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuditModel, ModelVersion } from '@/src/types';
import { MOCK_CATEGORIES, KNOWLEDGE_BASES, MOCK_MATERIALS } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';
import AuditModelDetail from './AuditModelDetail';
import AuditModelEditor from './AuditModelEditor';
import Pagination from './Pagination';

export const MOCK_MODELS: AuditModel[] = [
  {
    id: 'm1',
    name: '专项资金重复拨付检测模型',
    category: '财政收支审计类模型',
    status: 'published',
    version: 'v2.1.0',
    creator: '张审计',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 3600000,
    description: '通过对收款单位、金额、用途及拨付时间的多维匹配，识别潜在的重复拨付风险。',
    auditLogic: '1. 提取指定时间范围内的拨付记录；\n2. 按收款单位+金额进行分组；\n3. 过滤出组内记录数 > 1 的数据；\n4. 结合用途描述进行相似度计算。',
    laws: ['《审计法》第二十二条', '《专项资金管理办法》'],
    knowledgeBaseId: 'kb_audit',
    materialIds: ['mat1', 'mat4'],
    checkpoints: [
      {
        id: 'cp1',
        name: '收款单位重复性审查',
        description: '自动分析同一单位在短时间内多次领取同类资金的情况。',
        standardTables: [
          { tableName: '支付流水表', fields: ['vendor_name', 'amount', 'date'] }
        ],
        script: 'SELECT vendor_name, amount, COUNT(*) as count FROM payments GROUP BY vendor_name, amount HAVING count > 1'
      }
    ],
    auditProcessMd: `# 专项资金重复拨付审计流程

## 一、数据准备阶段
1. 建立业务数据库与标准数据库映射
2. 执行ETL任务抽取近三年财务支出数据
3. 对比 \`payments\` 与 \`vouchers\` 数据完整性

## 二、模型运行阶段
1. 配置疑点阈值 (50000元)
2. 运行数据生成脚本，检索满足条件的记录
3. 标注并提取疑似重复拨付结果至中间表 

## 三、结果复核
- 审计人员对输出表结果进行人工判别
- 排除跨行退汇再拨付等合理性因素
- 生成底稿并固化证据
`,
    scripts: {
      generation: 'SELECT * FROM payments WHERE amount IN (SELECT amount FROM payments GROUP BY vendor_id, amount HAVING COUNT(*) > 1)',
      view: 'SELECT vendor_name, amount, payment_date, purpose FROM payments_audit_results',
      statistics: 'SELECT COUNT(*) as total_risk, SUM(amount) as total_amount FROM payments_audit_results'
    },
    params: {
      statistics: [{ name: 'timeRange', type: 'date', description: '审计时间范围', required: true }],
      details: [{ name: 'vendorId', type: 'string', description: '供应商ID', required: false }],
      navigation: [{ name: 'projectId', type: 'string', description: '项目ID', required: true }]
    },
    versions: [
      { version: 'v2.1.0', creator: '张审计', createdAt: Date.now() - 3600000, content: '优化了相似度算法', isDefault: true, status: 'published' },
      { version: 'v2.0.0', creator: '李审计', createdAt: Date.now() - 86400000 * 5, content: '初始版本', isDefault: false, status: 'published' }
    ],
    callUrl: 'https://api.audit.com/v1/skills/m1'
  },
  {
    id: 'm2',
    name: '虚增收入异常检测模型',
    category: '财政收支审计类模型',
    status: 'published',
    version: 'v1.0.5',
    creator: '李审计',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 7200000,
    description: '基于关联交易、异常回款及毛利率波动等维度，识别潜在的虚增收入风险。',
    auditLogic: '1. 分析月度收入波动情况；\n2. 识别关联方交易占比；\n3. 检查回款周期是否异常。',
    laws: ['《会计法》', '《企业会计准则》'],
    knowledgeBaseId: 'kb_audit',
    materialIds: ['mat3'],
    checkpoints: [
      {
        id: 'cp2',
        name: '毛利率波动异常审查',
        description: '检测同一产品在不同客户间的毛利率差异。',
        standardTables: [
          { tableName: '销售订单表', fields: ['product_id', 'customer_id', 'margin'] }
        ],
        script: 'SELECT product_id, STDDEV(margin) as margin_std FROM sales GROUP BY product_id HAVING margin_std > 0.1'
      }
    ],
    auditProcessMd: `# 虚增收入异常检测分析流程

1. 导入ERP销单数据
2. 执行大数据分析引擎
3. 生成异常提示列表`,
    scripts: {
      generation: '-- SQL Logic for revenue anomaly',
      view: '-- View Logic',
      statistics: '-- Stats Logic'
    },
    params: {
      statistics: [],
      details: [],
      navigation: []
    },
    versions: [
      { version: 'v1.0.5', creator: '李审计', createdAt: Date.now() - 7200000, content: '修正了回款周期计算逻辑', isDefault: true, status: 'published' }
    ]
  }
];

export default function AuditModelMgmt() {
  const [view, setView] = React.useState<'list' | 'detail' | 'editor'>('list');
  const [models, setModels] = React.useState<AuditModel[]>(MOCK_MODELS);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedModel, setSelectedModel] = React.useState<AuditModel | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;
  const [editorMode, setEditorMode] = React.useState<'auto' | 'manual'>('auto');
  const [previewModel, setPreviewModel] = React.useState<AuditModel | null>(null);
  const [activeFile, setActiveFile] = React.useState<string>('Skill.md');
  const [showDeleteModal, setShowDeleteModal] = React.useState<string | null>(null);
  const [showDeleteVersionModal, setShowDeleteVersionModal] = React.useState<{ modelId: string, version: ModelVersion } | null>(null);
  const [expandedModelIds, setExpandedModelIds] = React.useState<Set<string>>(new Set());
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);
  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const CATEGORIES = MOCK_CATEGORIES.map(c => c.name);

  const filteredModels = models.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                         m.creator.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || m.category.includes(categoryFilter);
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredModels.length / pageSize);
  const paginatedModels = filteredModels.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAddModel = (mode: 'auto' | 'manual') => {
    setEditorMode(mode);
    setView('editor');
  };

  const handleSelectModel = (model: AuditModel) => {
    setSelectedModel(model);
    setView('detail');
  };

  const handleExport = (model: AuditModel) => {
    const dataStr = JSON.stringify(model, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${model.name}_${model.version}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleEdit = (model: AuditModel) => {
    setSelectedModel(model);
    setEditorMode('manual');
    setView('editor');
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      setModels(models.filter(m => m.id !== showDeleteModal));
      setShowDeleteModal(null);
    }
  };

  const confirmDeleteVersion = () => {
    if (showDeleteVersionModal) {
      const { modelId, version } = showDeleteVersionModal;
      setModels(models.map(m => {
        if (m.id === modelId) {
          const updatedVersions = m.versions.filter(v => v.version !== version.version);
          return {
            ...m,
            versions: updatedVersions,
            version: m.version === version.version ? (updatedVersions.find(v => v.isDefault)?.version || updatedVersions[0]?.version) : m.version
          };
        }
        return m;
      }));
      setShowDeleteVersionModal(null);
    }
  };

  const toggleExpand = (modelId: string) => {
    setExpandedModelIds(prev => {
      const next = new Set(prev);
      if (next.has(modelId)) {
        next.delete(modelId);
      } else {
        next.add(modelId);
      }
      return next;
    });
  };

  const getMaterialsForModel = (model: AuditModel) => {
    return MOCK_MATERIALS.filter(m => model.materialIds?.includes(m.id));
  };

  const currentKB = previewModel ? KNOWLEDGE_BASES.find(kb => kb.id === previewModel.knowledgeBaseId) : null;

  if (view === 'detail' && selectedModel) {
    return (
      <AuditModelDetail 
        model={selectedModel} 
        onBack={() => {
          setView('list');
          setSelectedModel(null);
        }} 
        onUpdate={(updatedModel) => {
          setModels(models.map(m => m.id === updatedModel.id ? updatedModel : m));
          setSelectedModel(updatedModel);
        }}
      />
    );
  }

  if (view === 'editor') {
    return (
      <AuditModelEditor 
        mode={editorMode}
        initialModel={selectedModel || undefined}
        onBack={() => {
          setView('list');
          setSelectedModel(null);
        }}
        onSave={(newModel) => {
          if (selectedModel) {
            setModels(models.map(m => m.id === newModel.id ? newModel : m));
          } else {
            setModels([newModel, ...models]);
          }
          setView('list');
          setSelectedModel(null);
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto relative">
      {/* Header & Filters */}
      <div className="px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20 h-[90px] shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">审计模型管理</h2>
          <p className="text-sm text-gray-500 mt-0.5">全生命周期审计模型管理与配置</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Audit Type Dropdown */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="h-10 bg-gray-50 border border-gray-200 rounded-lg px-4 flex items-center justify-between gap-4 text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-300 transition-all min-w-[140px]"
            >
              <span>{categoryFilter === 'all' ? '全部分类' : categoryFilter}</span>
              <ChevronDown className={cn("text-gray-400 transition-transform", isCategoryDropdownOpen && "rotate-180")} size={16} />
            </button>
            
            <AnimatePresence>
              {isCategoryDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-2 scrollbar-none max-h-64 overflow-y-auto"
                >
                  <button
                    onClick={() => {
                      setCategoryFilter('all');
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm flex items-center justify-between",
                      categoryFilter === 'all' ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <span>全部分类</span>
                    {categoryFilter === 'all' && <Check size={14} />}
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm flex items-center justify-between",
                        categoryFilter === cat ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <span>{cat}</span>
                      {categoryFilter === cat && <Check size={14} />}
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
              placeholder="搜索模型名称、创建人..."
              className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all ml-2">
            <Upload size={16} />
            <span>导入模型</span>
          </button>
          <button 
            onClick={() => handleAddModel('manual')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
          >
            <Plus size={18} />
            <span className="font-medium">新增模型</span>
          </button>
        </div>
      </div>

      {/* Expandable Table List */}
      <div className="flex-1 p-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 w-10"></th>
                <th className="px-6 py-4">模型名称</th>
                <th className="px-6 py-4">模型分类</th>
                <th className="px-6 py-4">适用场景</th>
                <th className="px-6 py-4">当前版本</th>
                <th className="px-6 py-4">创建人</th>
              </tr>
            </thead>
            <tbody>
              {paginatedModels.map((model) => (
                <ModelRow 
                  key={model.id}
                  model={model}
                  isExpanded={expandedModelIds.has(model.id)}
                  onToggleExpand={() => toggleExpand(model.id)}
                  onSelect={() => handleSelectModel(model)}
                  onEdit={(v) => handleEdit({ ...model, version: v.version, status: model.status })} 
                  onDeleteVersion={(v) => setShowDeleteVersionModal({ modelId: model.id, version: v })}
                  onPublishVersion={(v) => {
                    const updatedVersions = model.versions.map(ver => 
                      ver.version === v.version ? { ...ver, status: 'published' as const } : ver
                    );
                    setModels(models.map(m => m.id === model.id ? { 
                      ...m, 
                      status: 'published',
                      versions: updatedVersions
                    } : m));
                  }}
                  onSetDefault={(v) => {
                    const updatedVersions = model.versions.map(ver => ({
                      ...ver,
                      isDefault: ver.version === v.version
                    }));
                    setModels(models.map(m => m.id === model.id ? { 
                      ...m, 
                      version: v.version,
                      versions: updatedVersions 
                    } : m));
                  }}
                  onPreview={(v) => {
                    setPreviewModel({ ...model, version: v.version });
                    setActiveFile('Skill.md');
                  }}
                  onDownload={(v) => handleExport({ ...model, version: v.version })}
                  onSelectVersion={(v) => handleSelectModel({ ...model, version: v.version })}
                  onDeleteModel={() => setShowDeleteModal(model.id)}
                />
              ))}
            </tbody>
          </table>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredModels.length}
            pageSize={pageSize}
          />
          
          {filteredModels.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">未找到相关模型</h3>
              <p className="text-gray-500 mt-1">请尝试更换搜索关键词或筛选条件</p>
            </div>
          )}
        </div>
      </div>

      {/* Skill Preview Modal */}
      <AnimatePresence>
        {previewModel && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewModel(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[700px] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Terminal size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">模型内部构造预览 (Skill)</h3>
                    <p className="text-xs text-gray-500">{previewModel.name}</p>
                  </div>
                </div>
                <button onClick={() => setPreviewModel(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20}/>
                </button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* File Explorer Sidebar */}
                <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col pt-4 shrink-0">
                  <div className="flex-1 overflow-y-auto px-4 space-y-4">
                    {/* Root Folder */}
                    <div className="space-y-1">
                      <button 
                        onClick={() => setActiveFile('Skill.md')}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          activeFile === 'Skill.md' ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:bg-white/50"
                        )}
                      >
                        <FileText size={16} className={activeFile === 'Skill.md' ? "text-blue-500" : "text-gray-400"} />
                        <span>Skill.md</span>
                      </button>
                    </div>

                    {/* Scripts Folder */}
                    <div className="space-y-1">
                      <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <ChevronDown size={12} />
                        scripts/
                      </p>
                      {['generation.sql', 'view.sql', 'statistics.sql'].map(file => (
                        <button 
                          key={file}
                          onClick={() => setActiveFile(file)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ml-2",
                            activeFile === file ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:bg-white/50"
                          )}
                        >
                          <Code size={14} className={activeFile === file ? "text-blue-500" : "text-gray-400"} />
                          <span>{file}</span>
                        </button>
                      ))}
                    </div>

                    {/* Reference Folder */}
                    <div className="space-y-1">
                      <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <ChevronDown size={12} />
                        reference/
                      </p>
                      {getMaterialsForModel(previewModel).map(m => (
                        <button 
                          key={m.id}
                          onClick={() => setActiveFile(m.name)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ml-2",
                            activeFile === m.name ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:bg-white/50"
                          )}
                        >
                          <FileText size={14} className={activeFile === m.name ? "text-blue-500" : "text-gray-400"} />
                          <span className="truncate">{m.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-y-auto p-8 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-gray-900 border-l border-gray-800 text-gray-100 custom-scrollbar">
                    {activeFile === 'Skill.md' && (
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-2xl font-bold text-white mb-2">{previewModel.name} Skill Definition</h1>
                          <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                          <div>
                            <p className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">Model ID</p>
                            <p className="text-blue-400">{previewModel.id}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">Version</p>
                            <p className="text-blue-400">{previewModel.version}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">Category</p>
                            <p className="text-gray-300">{previewModel.category}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">Status</p>
                            <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">ENABLED</span>
                          </div>
                        </div>

                        <section>
                          <h2 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                             <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
                             Audit Logic Description
                          </h2>
                          <p className="text-gray-300 leading-relaxed text-sm bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                            {previewModel.auditLogic}
                          </p>
                        </section>

                        <section>
                          <h2 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                             <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                             Statutory Basis
                          </h2>
                          <div className="space-y-2">
                            {previewModel.laws.map(law => (
                              <div key={law} className="flex items-center gap-2 text-gray-400 bg-gray-800/30 px-3 py-2 rounded-lg border border-gray-700/30">
                                <Link size={12} className="text-blue-400/50" />
                                {law}
                              </div>
                            ))}
                          </div>
                        </section>

                        <section>
                          <h2 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                             <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                             Checkpoints Configuration
                          </h2>
                          <div className="space-y-4">
                            {previewModel.checkpoints.map(cp => (
                              <div key={cp.id} className="p-5 bg-gray-800/40 rounded-2xl border border-gray-700 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-bold text-white">{cp.name}</h3>
                                  <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-400 font-mono">CHECKPOINT</span>
                                </div>
                                <p className="text-xs text-gray-400">{cp.description}</p>
                                <div className="mt-2 space-y-2">
                                  <p className="text-xs font-bold text-gray-500 uppercase">Standard Tables</p>
                                  {cp.standardTables.map(st => (
                                    <div key={st.tableName} className="text-xs text-emerald-400/80 font-mono bg-emerald-500/5 px-2 py-1 rounded">
                                      {st.tableName}: {st.fields.join(', ')}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    )}
                    {activeFile === 'generation.sql' && <div className="text-emerald-400">/* Generated output script */\n\n{previewModel.scripts.generation}</div>}
                    {activeFile === 'view.sql' && <div className="text-blue-400">/* View logic script */\n\n{previewModel.scripts.view}</div>}
                    {activeFile === 'statistics.sql' && <div className="text-orange-400">/* Statistics calculation script */\n\n{previewModel.scripts.statistics}</div>}
                    {getMaterialsForModel(previewModel).some(m => m.name === activeFile) && (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                        <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center text-gray-600 mb-6 border border-gray-700">
                          <FileText size={40} />
                        </div>
                        <p className="text-sm font-medium text-gray-500 mb-2">文件：{activeFile}</p>
                        <p className="text-xs text-gray-600 text-center max-w-xs">
                          参考文件内容由审计知识库引擎动态索引及分片存储，预览模式主要展示模型关联的可读性资产。
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setPreviewModel(null)}
                  className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  确认
                </button>
              </div>
            </motion.div>
          </div>
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
                <h3 className="text-lg font-normal text-gray-900 tracking-tight mb-2">确认删除模型？</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  删除后该模型及其所有版本将不可恢复。
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

      {/* Delete Version Modal */}
      <AnimatePresence>
        {showDeleteVersionModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteVersionModal(null)}
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
                <h3 className="text-lg font-normal text-gray-900 tracking-tight mb-2">确认删除版本？</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  是否确认删除版本 <span className="font-mono font-bold text-gray-900">{showDeleteVersionModal.version.version}</span>？此操作不可撤销。
                </p>
              </div>
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowDeleteVersionModal(null)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={confirmDeleteVersion}
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

function ModelRow({ 
  model, 
  isExpanded,
  onToggleExpand,
  onSelect,
  onEdit,
  onDeleteVersion,
  onPublishVersion,
  onSetDefault,
  onPreview,
  onDownload,
  onSelectVersion,
  onDeleteModel
}: { 
  model: AuditModel; 
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
  onEdit: (v: ModelVersion) => void;
  onDeleteVersion: (v: ModelVersion) => void;
  onPublishVersion: (v: ModelVersion) => void;
  onSetDefault: (v: ModelVersion) => void;
  onPreview: (v: ModelVersion) => void;
  onDownload: (v: ModelVersion) => void;
  onSelectVersion: (v: ModelVersion) => void;
  onDeleteModel: () => void;
}) {
  // Sort versions by createdAt descending
  const sortedVersions = [...model.versions].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <React.Fragment>
      <tr 
        className={cn(
          "hover:bg-gray-50/80 cursor-pointer transition-colors group border-b border-gray-50",
          isExpanded && "bg-blue-50/30"
        )}
        onClick={onToggleExpand}
      >
        <td className="px-6 py-4">
          <ChevronRight size={18} className={cn("text-gray-400 transition-transform", isExpanded && "rotate-90 text-blue-500")} />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              model.status === 'published' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
            )}>
              <Zap size={16} />
            </div>
            <span className="text-sm font-normal text-gray-900 group-hover:text-blue-600 transition-colors">{model.name}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{model.category}</span>
        </td>
        <td className="px-6 py-4 max-w-[300px]">
          <p className="text-xs text-gray-500 truncate" title={model.description}>{model.description}</p>
        </td>
        <td className="px-6 py-4">
          <span className="text-xs font-arial font-bold text-blue-600">{model.version}</span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <User size={14} className="text-gray-400" />
            <span>{model.creator}</span>
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={6} className="bg-gray-50/50 p-0 overflow-hidden">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 py-4"
              >
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-3">版本号</th>
                        <th className="px-6 py-3">创建-发布时间</th>
                        <th className="px-6 py-3">创建人</th>
                        <th className="px-6 py-3">状态</th>
                        <th className="px-6 py-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {sortedVersions.map((v) => (
                        <tr key={v.version} className="hover:bg-gray-50/50 transition-colors group/row">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-arial font-bold text-gray-700">{v.version}</span>
                              {v.isDefault && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">默认</span>
                              )}
                              <button 
                                onClick={(e) => { e.stopPropagation(); onPreview(v); }}
                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-all ml-1"
                                title="预览"
                                id={`preview-v-${v.version}`}
                              >
                                <Eye size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-xs text-gray-500">
                            {new Date(v.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-3">
                            <span className="text-xs text-gray-600">{v.creator}</span>
                          </td>
                          <td className="px-6 py-3">
                            <span className={cn(
                              "text-xs font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                              (v.status || model.status) === 'published' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                            )}>
                              {(v.status || model.status) === 'published' ? '已发布' : '草稿'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-3 px-2">
                              {!v.isDefault && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); onSetDefault(v); }}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                  设为默认
                                </button>
                              )}
                              <button 
                                onClick={(e) => { e.stopPropagation(); onSelectVersion(v); }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="查看详情"
                              >
                                <FileText size={14} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(v); }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="编辑"
                              >
                                <Edit2 size={14} />
                              </button>
                              {(v.status || model.status) === 'draft' && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); onPublishVersion(v); }}
                                  className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                  title="发布"
                                >
                                  <CheckCircle2 size={14} />
                                </button>
                              )}
                              <button 
                                onClick={(e) => { e.stopPropagation(); onDownload(v); }}
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                title="下载"
                              >
                                <Download size={14} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteVersion(v); }}
                                disabled={v.isDefault}
                                className={cn(
                                  "p-1.5 rounded-lg transition-all opacity-0 group-hover/row:opacity-100",
                                  v.isDefault 
                                    ? "text-gray-200 cursor-not-allowed" 
                                    : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                                )}
                                title={v.isDefault ? "默认版本不可删除" : "删除"}
                                id={`delete-v-${v.version}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}
