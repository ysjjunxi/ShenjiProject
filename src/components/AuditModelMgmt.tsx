import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  BrainCircuit, 
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
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuditModel, ModelVersion } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import AuditModelDetail from './AuditModelDetail';
import AuditModelEditor from './AuditModelEditor';

export const MOCK_MODELS: AuditModel[] = [
  {
    id: 'm1',
    name: '专项资金重复拨付检测模型',
    category: '财务审计 / 专项资金',
    status: 'enabled',
    version: 'v2.1.0',
    creator: '张审计',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 3600000,
    description: '通过对收款单位、金额、用途及拨付时间的多维匹配，识别潜在的重复拨付风险。',
    auditLogic: '1. 提取指定时间范围内的拨付记录；\n2. 按收款单位+金额进行分组；\n3. 过滤出组内记录数 > 1 的数据；\n4. 结合用途描述进行相似度计算。',
    laws: ['《审计法》第二十二条', '《专项资金管理办法》'],
    ruleIds: ['r1'],
    dataSources: [
      {
        db: '财务主数据库 (FinanceDB_Prod)',
        table: '支付流水表 (payments)',
        fields: ['vendor_id', 'vendor_name', 'amount', 'payment_date', 'purpose', 'status']
      },
      {
        db: '财务主数据库 (FinanceDB_Prod)',
        table: '凭证表 (vouchers)',
        fields: ['voucher_id', 'amount', 'subject_code']
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
      { version: 'v2.1.0', creator: '张审计', createdAt: Date.now() - 3600000, content: '优化了相似度算法', isDefault: true },
      { version: 'v2.0.0', creator: '李审计', createdAt: Date.now() - 86400000 * 5, content: '初始版本', isDefault: false }
    ],
    callUrl: 'https://api.audit.com/v1/skills/m1'
  },
  {
    id: 'm2',
    name: '虚增收入异常检测模型',
    category: '财务审计 / 收入审计',
    status: 'enabled',
    version: 'v1.0.5',
    creator: '李审计',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 7200000,
    description: '基于关联交易、异常回款及毛利率波动等维度，识别潜在的虚增收入风险。',
    auditLogic: '1. 分析月度收入波动情况；\n2. 识别关联方交易占比；\n3. 检查回款周期是否异常。',
    laws: ['《会计法》', '《企业会计准则》'],
    dataSources: [
      {
        db: 'ERP主库 (ERP_Main)',
        table: '销售订单表 (sales_orders)',
        fields: ['order_id', 'customer_id', 'total_amount', 'order_date']
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
      { version: 'v1.0.5', creator: '李审计', createdAt: Date.now() - 7200000, content: '修正了回款周期计算逻辑', isDefault: true }
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
  const [editorMode, setEditorMode] = React.useState<'auto' | 'manual'>('auto');
  const [mdModel, setMdModel] = React.useState<AuditModel | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState<string | null>(null);
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

  const CATEGORIES = ['财务审计', '专项资金', '工程项目'];

  const filteredModels = models.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                         m.creator.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || m.category.includes(categoryFilter);
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  if (view === 'detail' && selectedModel) {
    return (
      <AuditModelDetail 
        model={selectedModel} 
        onBack={() => {
          setView('list');
          setSelectedModel(null);
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
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header & Filters */}
      <div className="px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0 flex items-center justify-between">
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
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm">
              <Plus size={18} />
              <span className="font-medium">新增模型</span>
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
              <button 
                onClick={() => handleAddModel('auto')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <BrainCircuit size={16} />
                <span>AI 自动生成</span>
              </button>
              <button 
                onClick={() => handleAddModel('manual')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Settings size={16} />
                <span>手动组装编写</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredModels.map((model) => (
            <ModelCard 
              key={model.id} 
              model={model} 
              onClick={() => handleSelectModel(model)}
              onExport={() => handleExport(model)}
              onEdit={() => handleEdit(model)}
              onDelete={() => setShowDeleteModal(model.id)}
              onViewMD={() => setMdModel(model)}
            />
          ))}
          
          {filteredModels.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BrainCircuit size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">未找到相关模型</h3>
              <p className="text-gray-500 mt-1">请尝试更换搜索关键词或筛选条件</p>
            </div>
          )}
        </div>
      </div>

      {/* MD Modal */}
      <AnimatePresence>
        {mdModel && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMdModel(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl h-[600px] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 flex items-center gap-2">
                  <FileText size={20} className="text-purple-600"/>
                  模型 Markdown 视图
                </h3>
                <button onClick={() => setMdModel(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20}/>
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto bg-gray-900 text-gray-100 font-mono text-sm leading-relaxed whitespace-pre-wrap">
{`# ${mdModel.name}

**分类**: ${mdModel.category}
**版本**: ${mdModel.version}
**创建人**: ${mdModel.creator}
**更新时间**: ${new Date(mdModel.updatedAt).toLocaleString()}

## 描述
${mdModel.description}

## 审计思路
${mdModel.auditLogic}

## 法规依据
${mdModel.laws.map(l => `- ${l}`).join('\n')}

## 脚本配置
### 数据生成 (Generation)
\`\`\`sql
${mdModel.scripts.generation}
\`\`\`

### 结果视图 (View)
\`\`\`sql
${mdModel.scripts.view}
\`\`\`

### 统计视图 (Statistics)
\`\`\`sql
${mdModel.scripts.statistics}
\`\`\`
`}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => {
                    const mdText = `# ${mdModel.name}\n\n**分类**: ${mdModel.category}\n**版本**: ${mdModel.version}\n**创建人**: ${mdModel.creator}\n**更新时间**: ${new Date(mdModel.updatedAt).toLocaleString()}\n\n## 描述\n${mdModel.description}\n\n## 审计思路\n${mdModel.auditLogic}\n\n## 法规依据\n${mdModel.laws.map(l => `- ${l}`).join('\n')}\n\n## 脚本配置\n### 数据生成 (Generation)\n\`\`\`sql\n${mdModel.scripts.generation}\n\`\`\`\n\n### 结果视图 (View)\n\`\`\`sql\n${mdModel.scripts.view}\n\`\`\`\n\n### 统计视图 (Statistics)\n\`\`\`sql\n${mdModel.scripts.statistics}\n\`\`\``;
                    navigator.clipboard.writeText(mdText);
                    alert('已复制到剪贴板');
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                >
                  <Copy size={16} />
                  复制 Markdown
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
    </div>
  );
}

function ModelCard({ 
  model, 
  onClick, 
  onExport,
  onEdit,
  onDelete,
  onViewMD
}: { 
  model: AuditModel; 
  onClick: () => void; 
  onExport: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewMD: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
          model.status === 'enabled' ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
        )}>
          <BrainCircuit size={24} />
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewMD();
            }}
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
            title="查看 Markdown"
          >
            <FileText size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="编辑模型"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onExport();
            }}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
            title="导出模型"
          >
            <Download size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="删除模型"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{model.category}</span>
          <span className="text-[10px] font-bold text-gray-300">•</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{model.version}</span>
        </div>
        <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {model.name}
        </h3>
        <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
          {model.description}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <User size={12} />
            <span>{model.creator}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Clock size={12} />
            <span>{new Date(model.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}
