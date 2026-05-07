import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Database, 
  Code, 
  RefreshCw, 
  Calendar, 
  Trash2, 
  Edit2, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  X,
  ChevronRight,
  ChevronDown,
  Info,
  Terminal,
  Settings
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuditTool, ToolParam } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

const BUILT_IN_TOOLS: AuditTool[] = [
  {
    id: 't1',
    name: '表数据读取器',
    description: '从指定数据库表中读取原始审计数据。',
    scenario: '审计项目初期数据采集阶段。',
    type: 'reading',
    isBuiltIn: true,
    isTested: true,
    callCount: 1250,
    usedByModels: 45,
    inputParams: [
      { name: 'tableName', type: 'string', description: '目标表名', required: true },
      { name: 'columns', type: 'array', description: '需要读取的列名列表', required: false }
    ],
    outputParams: [
      { name: 'data', type: 'array', description: '读取到的数据列表', required: true }
    ]
  },
  {
    id: 't2',
    name: 'SQL 执行器',
    description: '在目标数据库上执行自定义 SQL 语句。',
    scenario: '复杂的数据关联查询或批量更新。',
    type: 'processing',
    isBuiltIn: true,
    isTested: true,
    callCount: 3400,
    usedByModels: 82,
    inputParams: [
      { name: 'sql', type: 'string', description: '待执行的 SQL 语句', required: true }
    ],
    outputParams: [
      { name: 'result', type: 'array', description: '执行结果集', required: true }
    ]
  },
  {
    id: 't3',
    name: '字段映射器',
    description: '将源数据字段映射为审计规范字段。',
    scenario: '不同系统间数据结构标准化。',
    type: 'conversion',
    isBuiltIn: true,
    isTested: true,
    callCount: 890,
    usedByModels: 28,
    inputParams: [
      { name: 'sourceData', type: 'array', description: '源数据', required: true },
      { name: 'mapping', type: 'object', description: '映射规则', required: true }
    ],
    outputParams: [
      { name: 'mappedData', type: 'array', description: '映射后的数据', required: true }
    ]
  },
  {
    id: 't4',
    name: '重复值检测',
    description: '根据指定字段检测数据集中的重复记录。',
    scenario: '核查重复报销、重复拨付等审计疑点。',
    type: 'analysis',
    isBuiltIn: true,
    isTested: true,
    callCount: 2100,
    usedByModels: 56,
    inputParams: [
      { name: 'data', type: 'array', description: '待检测数据', required: true },
      { name: 'fields', type: 'array', description: '检测维度字段', required: true }
    ],
    outputParams: [
      { name: 'duplicates', type: 'array', description: '重复记录列表', required: true }
    ]
  },
  {
    id: 't5',
    name: '日期格式化',
    description: '将不同格式的日期字符串统一转换为标准日期格式。',
    scenario: '数据清洗阶段，统一时间维度标准。',
    type: 'conversion',
    isBuiltIn: true,
    isTested: true,
    callCount: 1560,
    usedByModels: 34,
    inputParams: [
      { name: 'data', type: 'array', description: '待处理数据', required: true },
      { name: 'dateField', type: 'string', description: '日期字段名', required: true },
      { name: 'targetFormat', type: 'string', description: '目标格式 (如 YYYY-MM-DD)', required: true }
    ],
    outputParams: [
      { name: 'formattedData', type: 'array', description: '格式化后的数据', required: true }
    ]
  },
  {
    id: 't6',
    name: '数值分箱',
    description: '将连续数值型数据划分为离散的区间（分箱）。',
    scenario: '金额区间统计、年龄段分析等场景。',
    type: 'analysis',
    isBuiltIn: true,
    isTested: true,
    callCount: 780,
    usedByModels: 15,
    inputParams: [
      { name: 'data', type: 'array', description: '待处理数据', required: true },
      { name: 'valueField', type: 'string', description: '数值字段名', required: true },
      { name: 'bins', type: 'array', description: '分箱边界值列表', required: true }
    ],
    outputParams: [
      { name: 'binnedData', type: 'array', description: '分箱后的数据', required: true }
    ]
  },
  {
    id: 't7',
    name: '自定义脱敏工具',
    description: '对敏感字段（如身份证、手机号）进行脱敏处理。',
    scenario: '数据导出前的隐私保护。',
    type: 'processing',
    isBuiltIn: false,
    isTested: true,
    callCount: 120,
    usedByModels: 3,
    inputParams: [
      { name: 'data', type: 'array', description: '待处理数据', required: true },
      { name: 'fields', type: 'array', description: '需要脱敏的字段', required: true }
    ],
    outputParams: [
      { name: 'maskedData', type: 'array', description: '脱敏后的数据', required: true }
    ]
  },
  {
    id: 't8',
    name: '测试用空工具',
    description: '这是一个未被任何模型使用的自定义工具，可以被删除。',
    scenario: '测试删除功能。',
    type: 'conversion',
    isBuiltIn: false,
    isTested: false,
    callCount: 0,
    usedByModels: 0,
    inputParams: [],
    outputParams: []
  }
];

const TYPE_LABELS = {
  reading: { label: '数据读取', color: 'text-blue-600', bg: 'bg-blue-50', icon: <Database size={14} /> },
  processing: { label: '数据处理', color: 'text-purple-600', bg: 'bg-purple-50', icon: <Code size={14} /> },
  conversion: { label: '格式转换', color: 'text-orange-600', bg: 'bg-orange-50', icon: <RefreshCw size={14} /> },
  analysis: { label: '数据分析', color: 'text-green-600', bg: 'bg-green-50', icon: <Settings size={14} /> },
};

export default function ToolMgmt() {
  const [view, setView] = React.useState<'list' | 'config'>('list');
  const [tools, setTools] = React.useState<AuditTool[]>(BUILT_IN_TOOLS);
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [editingTool, setEditingTool] = React.useState<AuditTool | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState<string | null>(null);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = React.useState(false);

  const filteredTools = tools.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                         t.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddTool = () => {
    setEditingTool({
      id: '',
      name: '',
      description: '',
      scenario: '',
      type: 'processing',
      isBuiltIn: false,
      isTested: false,
      callCount: 0,
      usedByModels: 0,
      inputParams: [],
      outputParams: [],
      script: ''
    });
    setView('config');
  };

  const handleEditTool = (tool: AuditTool) => {
    setEditingTool(tool);
    setView('config');
  };

  const handleDeleteTool = (id: string) => {
    const tool = tools.find(t => t.id === id);
    if (tool && tool.usedByModels > 0) {
      alert(`该工具正在被 ${tool.usedByModels} 个模型调用，无法删除`);
      return;
    }
    setShowDeleteModal(id);
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      setTools(tools.filter(t => t.id !== showDeleteModal));
      setShowDeleteModal(null);
    }
  };

  const handleSaveTool = (tool: AuditTool) => {
    if (tool.id) {
      setTools(tools.map(t => t.id === tool.id ? tool : t));
    } else {
      setTools([...tools, { ...tool, id: 'custom-' + Date.now() }]);
    }
    setView('list');
    setEditingTool(null);
  };

  if (view === 'config' && editingTool) {
    return (
      <ToolConfig 
        tool={editingTool} 
        onBack={() => {
          setView('list');
          setEditingTool(null);
        }} 
        onSave={handleSaveTool}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">工具集管理</h2>
          <p className="text-sm text-gray-500 mt-0.5">审计模型的原子化工具库，支持多模型复用</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Type Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              className="h-10 bg-gray-50 border border-gray-200 rounded-lg px-4 flex items-center justify-between gap-4 text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-300 transition-all min-w-[140px]"
            >
              <span>{typeFilter === 'all' ? '全部类型' : TYPE_LABELS[typeFilter as keyof typeof TYPE_LABELS]?.label || '全部类型'}</span>
              <ChevronDown className={cn("text-gray-400 transition-transform", isTypeDropdownOpen && "rotate-180")} size={16} />
            </button>
            
            <AnimatePresence>
              {isTypeDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsTypeDropdownOpen(false)} 
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl z-20 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setTypeFilter('all');
                        setIsTypeDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm transition-all flex items-center gap-2",
                        typeFilter === 'all' ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Filter size={14} />
                      全部类型
                    </button>
                    {Object.entries(TYPE_LABELS).map(([key, info]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setTypeFilter(key);
                          setIsTypeDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left text-sm transition-all flex items-center gap-2",
                          typeFilter === key ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <span className={info.color}>{info.icon}</span>
                        {info.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="relative w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索工具名称或描述..."
              className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium"
            />
          </div>

          <button 
            onClick={handleAddTool}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm font-medium"
          >
            <Plus size={18} />
            <span>新增工具</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold">工具名称</th>
                <th className="px-6 py-4 font-bold">功能描述</th>
                <th className="px-6 py-4 font-bold">参数数量</th>
                <th className="px-6 py-4 font-bold">类型</th>
                <th className="px-6 py-4 font-bold">状态</th>
                <th className="px-6 py-4 font-bold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div 
                      onClick={() => handleEditTool(tool)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        TYPE_LABELS[tool.type].bg,
                        TYPE_LABELS[tool.type].color
                      )}>
                        {TYPE_LABELS[tool.type].icon}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{tool.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          {tool.isBuiltIn ? 'BUILT-IN' : 'CUSTOM'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{tool.description}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {tool.inputParams.length + tool.outputParams.length}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                      TYPE_LABELS[tool.type].bg,
                      TYPE_LABELS[tool.type].color
                    )}>
                      {TYPE_LABELS[tool.type].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {tool.isTested ? (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 size={14} />
                        <span className="text-xs font-medium">已测试</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-orange-500">
                        <AlertCircle size={14} />
                        <span className="text-xs font-medium">待测试</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditTool(tool)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      {!tool.isBuiltIn && (
                        <button 
                          onClick={() => handleDeleteTool(tool.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTools.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings size={32} className="text-gray-200" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">未找到相关工具</h3>
              <p className="text-gray-500 mt-1">请尝试更换搜索关键词或筛选条件</p>
            </div>
          )}
        </div>
      </div>

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
                <h3 className="text-lg font-normal text-gray-900 tracking-tight mb-2">确认删除工具？</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  删除后该工具将无法在新的模型中被调用，此操作不可恢复。
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

function ToolConfig({ tool, onBack, onSave }: { tool: AuditTool; onBack: () => void; onSave: (tool: AuditTool) => void }) {
  const [formData, setFormData] = React.useState<AuditTool>({ ...tool });
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ success: boolean; message: string } | null>(null);

  const handleTest = () => {
    setIsTesting(true);
    setTestResult(null);
    // Simulate test
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({ success: true, message: '工具测试通过，逻辑验证有效。' });
      setFormData(prev => ({ ...prev, isTested: true }));
    }, 1500);
  };

  const addParam = (type: 'input' | 'output') => {
    const newParam: ToolParam = { name: '', type: 'string', description: '', required: true };
    if (type === 'input') {
      setFormData({ ...formData, inputParams: [...formData.inputParams, newParam] });
    } else {
      setFormData({ ...formData, outputParams: [...formData.outputParams, newParam] });
    }
  };

  const updateParam = (type: 'input' | 'output', index: number, updates: Partial<ToolParam>) => {
    const params = type === 'input' ? [...formData.inputParams] : [...formData.outputParams];
    params[index] = { ...params[index], ...updates };
    if (type === 'input') {
      setFormData({ ...formData, inputParams: params });
    } else {
      setFormData({ ...formData, outputParams: params });
    }
  };

  const removeParam = (type: 'input' | 'output', index: number) => {
    const params = type === 'input' ? [...formData.inputParams] : [...formData.outputParams];
    params.splice(index, 1);
    if (type === 'input') {
      setFormData({ ...formData, inputParams: params });
    } else {
      setFormData({ ...formData, outputParams: params });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-normal text-gray-900 tracking-tight">{formData.id ? '修改工具' : '新增自定义工具'}</h2>
              {formData.isBuiltIn && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider border border-blue-100">
                  内置工具
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">配置工具的参数、逻辑与适用场景</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!formData.isBuiltIn && (
            <button 
              onClick={handleTest}
              disabled={isTesting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all disabled:opacity-50"
            >
              {isTesting ? <RefreshCw size={18} className="animate-spin" /> : <Play size={18} />}
              <span>测试工具</span>
            </button>
          )}
          <button 
            onClick={() => onSave(formData)}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            保存工具
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Basic Info */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 flex items-center gap-2">
              <Info size={20} className="text-blue-600" />
              基本信息
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">工具名称</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={formData.isBuiltIn}
                  placeholder="请输入工具名称 (3-20位)"
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">工具类型</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  disabled={formData.isBuiltIn}
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all disabled:opacity-60"
                >
                  <option value="reading">数据读取</option>
                  <option value="processing">数据处理</option>
                  <option value="conversion">格式转换</option>
                  <option value="analysis">数据分析</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">功能描述</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="简要说明工具的功能逻辑"
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">适用场景</label>
                <textarea 
                  value={formData.scenario}
                  onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                  disabled={formData.isBuiltIn}
                  placeholder="说明该工具在审计业务中的具体应用场景"
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none disabled:opacity-60"
                />
              </div>
            </div>
          </section>

          {/* Parameters */}
          <div className="grid grid-cols-2 gap-6">
            {/* Input Params */}
            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 flex items-center gap-2">
                  <Terminal size={20} className="text-blue-600" />
                  输入参数
                </h3>
                {!formData.isBuiltIn && (
                  <button 
                    onClick={() => addParam('input')}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {formData.inputParams.map((param, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 relative group">
                    {!formData.isBuiltIn && (
                      <button 
                        onClick={() => removeParam('input', idx)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text"
                        value={param.name}
                        onChange={(e) => updateParam('input', idx, { name: e.target.value })}
                        disabled={formData.isBuiltIn}
                        placeholder="参数名"
                        className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60"
                      />
                      <select 
                        value={param.type}
                        onChange={(e) => updateParam('input', idx, { type: e.target.value as any })}
                        disabled={formData.isBuiltIn}
                        className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                        <option value="array">Array</option>
                        <option value="object">Object</option>
                      </select>
                    </div>
                    <input 
                      type="text"
                      value={param.description}
                      onChange={(e) => updateParam('input', idx, { description: e.target.value })}
                      disabled={formData.isBuiltIn}
                      placeholder="参数描述"
                      className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60"
                    />
                  </div>
                ))}
                {formData.inputParams.length === 0 && (
                  <p className="text-center py-4 text-gray-400 text-xs italic">暂无输入参数</p>
                )}
              </div>
            </section>

            {/* Output Params */}
            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-600" />
                  输出参数
                </h3>
                {!formData.isBuiltIn && (
                  <button 
                    onClick={() => addParam('output')}
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {formData.outputParams.map((param, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 relative group">
                    {!formData.isBuiltIn && (
                      <button 
                        onClick={() => removeParam('output', idx)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text"
                        value={param.name}
                        onChange={(e) => updateParam('output', idx, { name: e.target.value })}
                        disabled={formData.isBuiltIn}
                        placeholder="参数名"
                        className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60"
                      />
                      <select 
                        value={param.type}
                        onChange={(e) => updateParam('output', idx, { type: e.target.value as any })}
                        disabled={formData.isBuiltIn}
                        className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                        <option value="array">Array</option>
                        <option value="object">Object</option>
                      </select>
                    </div>
                    <input 
                      type="text"
                      value={param.description}
                      onChange={(e) => updateParam('output', idx, { description: e.target.value })}
                      disabled={formData.isBuiltIn}
                      placeholder="参数描述"
                      className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60"
                    />
                  </div>
                ))}
                {formData.outputParams.length === 0 && (
                  <p className="text-center py-4 text-gray-400 text-xs italic">暂无输出参数</p>
                )}
              </div>
            </section>
          </div>

          {/* Script Editor (Only for Custom) */}
          {!formData.isBuiltIn && (
            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 flex items-center gap-2">
                <Code size={20} className="text-blue-600" />
                执行脚本 (SQL/Python)
              </h3>
              <div className="relative group">
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <span className="px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded uppercase tracking-widest opacity-40">PYTHON 3.9</span>
                </div>
                <textarea 
                  value={formData.script}
                  onChange={(e) => setFormData({ ...formData, script: e.target.value })}
                  placeholder="# 在此编写工具执行逻辑\ndef execute(params):\n    # TODO: 实现逻辑\n    return {}"
                  rows={10}
                  className="w-full bg-gray-900 text-blue-100 font-mono p-6 rounded-2xl border border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed"
                />
              </div>
            </section>
          )}

          {/* Test Result */}
          <AnimatePresence>
            {testResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-6 rounded-2xl border flex items-start gap-4",
                  testResult.success ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"
                )}
              >
                {testResult.success ? <CheckCircle2 size={24} className="text-green-600 shrink-0" /> : <AlertCircle size={24} className="text-red-600 shrink-0" />}
                <div>
                  <p className="font-bold text-sm">{testResult.success ? '测试成功' : '测试失败'}</p>
                  <p className="text-xs mt-1 opacity-80">{testResult.message}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
