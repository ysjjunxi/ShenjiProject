import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  Globe, 
  Settings2, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Edit2,
  Zap,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import Pagination from './Pagination';

interface LLMConfig {
  id: string;
  name: string;
  modelType: string;
  apiUrl: string;
  apiKey: string;
  responseTime: number; // 秒
  maxTokens: number;
  precision: 'fp16' | 'fp32' | 'int8';
  status: 'active' | 'inactive';
  updatedAt: number;
}const MOCK_LLM_MODELS: LLMConfig[] = [
  {
    id: 'llm_1',
    name: 'DeepSeek-V3-Audit',
    modelType: 'Specialized Audit',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: 'sk-************************8a2d',
    responseTime: 30,
    maxTokens: 4096,
    precision: 'fp16',
    status: 'active',
    updatedAt: Date.now() - 86400000 * 2
  }
];

export default function SystemLLMManagement() {
  const [models, setModels] = React.useState<LLMConfig[]>(MOCK_LLM_MODELS);
  const [isAddingMode, setIsAddingMode] = React.useState(false);
  const [editingModel, setEditingModel] = React.useState<LLMConfig | null>(null);
  const [showApiKeyMap, setShowApiKeyMap] = React.useState<Record<string, boolean>>({});
  const [testStatus, setTestStatus] = React.useState<Record<string, 'idle' | 'testing' | 'success' | 'error'>>({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(models.length / pageSize);
  const paginatedModels = models.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleApiKey = (id: string) => {
    setShowApiKeyMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTestConnection = (id: string) => {
    setTestStatus(prev => ({ ...prev, [id]: 'testing' }));
    // Simulate API testing
    setTimeout(() => {
      setTestStatus(prev => ({ ...prev, [id]: Math.random() > 0.2 ? 'success' : 'error' }));
    }, 1500);
  };

  const handleSave = (modelData: LLMConfig) => {
    if (editingModel) {
      setModels(prev => prev.map(m => m.id === modelData.id ? modelData : m));
    } else {
      setModels(prev => [...prev, { ...modelData, id: 'llm_' + Date.now() }]);
    }
    setIsAddingMode(false);
    setEditingModel(null);
  };

  const handleDelete = (id: string) => {
    if (id === 'llm_1') {
      alert('核心模型配置不可删除');
      return;
    }
    if (confirm('确定要删除此模型配置吗？这将影响所有关联的AI功能。')) {
      setModels(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 overflow-hidden">
      {/* Header */}
      <div className="px-8 h-[90px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shrink-0 z-10">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">LLM大模型管理</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">配置系统核心大语言模型能力、API接口及运行参数</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col">
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-6">
            {paginatedModels.map((model) => (
            <motion.div 
              key={model.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      model.status === 'active' ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"
                    )}>
                      <Zap size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-gray-900">{model.name}</h3>
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded",
                          model.status === 'active' ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                        )}>
                          {model.status === 'active' ? '已激活' : '已停用'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-medium">{model.modelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleTestConnection(model.id)}
                      disabled={testStatus[model.id] === 'testing'}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        testStatus[model.id] === 'success' ? "bg-green-50 text-green-600 border border-green-100" :
                        testStatus[model.id] === 'error' ? "bg-red-50 text-red-600 border border-red-100" :
                        "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100"
                      )}
                    >
                      {testStatus[model.id] === 'testing' ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : testStatus[model.id] === 'success' ? (
                        <CheckCircle2 size={14} />
                      ) : testStatus[model.id] === 'error' ? (
                        <AlertCircle size={14} />
                      ) : (
                        <Globe size={14} />
                      )}
                      {testStatus[model.id] === 'testing' ? '测试中...' : 
                       testStatus[model.id] === 'success' ? '连接成功' : 
                       testStatus[model.id] === 'error' ? '连接失败' : '连通性测试'}
                    </button>
                    <button 
                      onClick={() => {
                        setEditingModel(model);
                        setIsAddingMode(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    {model.id !== 'llm_1' && (
                      <button 
                        onClick={() => handleDelete(model.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* API Configuration */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[.2em]">
                      <Globe size={12} className="text-blue-500" />
                      接口配置
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">端点地址 (Endpoint)</label>
                        <code className="text-xs font-mono text-gray-700 break-all">{model.apiUrl}</code>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 relative group">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">API 密钥 (Authentication)</label>
                        <div className="flex items-center justify-between">
                          <code className="text-xs font-mono text-gray-700">
                            {showApiKeyMap[model.id] ? model.apiKey : 'sk-********************************'}
                          </code>
                          <button 
                            onClick={() => toggleApiKey(model.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            {showApiKeyMap[model.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Model Parameters */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[.2em]">
                      <Settings2 size={12} className="text-orange-500" />
                      运行参数
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">超时阈值</label>
                        <span className="text-sm font-black text-gray-800">{model.responseTime}s</span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">最大Token</label>
                        <span className="text-sm font-black text-gray-800">{model.maxTokens}</span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">推理精度</label>
                        <span className="text-xs font-bold text-blue-600 uppercase italic">{model.precision}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 px-3 py-2 bg-orange-50/30 rounded-xl border border-orange-100/50">
                      <Zap size={14} className="text-orange-500" />
                      <p className="text-[10px] text-orange-700 font-medium leading-relaxed">
                        当前批次并发限制: 50 QPM · 自动重试机制已开启
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={models.length}
          pageSize={pageSize}
        />
      </div>

      {/* Add/Edit Modal */}
      {isAddingMode && (
        <ModelEditModal 
          model={editingModel || undefined}
          onClose={() => {
            setIsAddingMode(false);
            setEditingModel(null);
          }}
          onSave={handleSave}
          isDuplicateName={(name, id) => models.some(m => m.name === name && m.id !== id)}
        />
      )}
    </div>
  );
}

function ModelEditModal({ model, onClose, onSave, isDuplicateName }: { 
  model?: LLMConfig, 
  onClose: () => void, 
  onSave: (m: LLMConfig) => void,
  isDuplicateName: (name: string, id: string) => boolean
}) {
  const [formData, setFormData] = React.useState<Partial<LLMConfig>>(model || {
    name: '',
    modelType: 'General Purpose',
    apiUrl: '',
    apiKey: '',
    responseTime: 30,
    maxTokens: 4096,
    precision: 'fp16',
    status: 'active'
  });
  
  const [error, setError] = React.useState<string | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = React.useState(false);
  const [showPrecisionDropdown, setShowPrecisionDropdown] = React.useState(false);

  const validate = () => {
    if (!formData.name) return '请输入模型名称';
    if (/[\W_]/.test(formData.name.replace(/-/g, ''))) return '模型名称不可包含特殊字符（允许使用连字符）';
    if (isDuplicateName(formData.name, model?.id || '')) return '该模型名称已存在';
    if (!formData.apiUrl) return '请输入调用地址';
    if (!formData.apiKey) return '请输入 API Key';
    return null;
  };

  const handleApply = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    onSave({
      ...formData as LLMConfig,
      updatedAt: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{model ? '编辑模型配置' : '添加新模型'}</h3>
            <p className="text-sm text-gray-500 mt-1">请填写模型的基础参数与安全凭证</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-full transition-all">
            <Plus className="rotate-45" size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold animate-shake">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">模型显示名称</label>
              <input 
                type="text"
                placeholder="例如: DeepSeek-V3"
                value={formData.name}
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  setError(null);
                }}
                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm focus:outline-none focus:ring-0 placeholder-gray-300 font-bold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">模型分类 / 类型</label>
              <div className="relative">
                <button 
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold flex items-center justify-between hover:border-blue-200 transition-all outline-none"
                >
                  <span className="text-gray-900">{formData.modelType === 'General Purpose' ? '通用模型' : 
                          formData.modelType === 'Specialized Audit' ? '审计专用' :
                          formData.modelType === 'Enterprise Audit' ? '企业级审计' : '复杂推理'}</span>
                  <Plus className={cn("text-gray-400 transition-transform", showTypeDropdown ? "rotate-45" : "")} size={18} />
                </button>
                <AnimatePresence>
                  {showTypeDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                      className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 flex flex-col gap-1"
                    >
                      {[
                        { label: '通用模型', value: 'General Purpose' },
                        { label: '审计专用', value: 'Specialized Audit' },
                        { label: '企业级审计', value: 'Enterprise Audit' },
                        { label: '复杂推理', value: 'Reasoning' }
                      ].map(opt => (
                        <div 
                          key={opt.value}
                          onClick={() => { setFormData({ ...formData, modelType: opt.value }); setShowTypeDropdown(false); }}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between",
                            formData.modelType === opt.value ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {opt.label}
                          {formData.modelType === opt.value && <Plus size={14} className="rotate-45" />}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">接口调用地址 (API URL)</label>
            <input 
              type="text"
              placeholder="https://api.yourprovider.com/v1/..."
              value={formData.apiUrl}
              onChange={e => setFormData({ ...formData, apiUrl: e.target.value })}
              className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-mono focus:outline-none focus:ring-0 placeholder-gray-300 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">API Key (加密存储)</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="password"
                placeholder="请输入您的密钥..."
                value={formData.apiKey}
                onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 text-sm font-mono focus:outline-none focus:ring-0 placeholder-gray-300 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">超时 (秒)</label>
              <input 
                type="number"
                value={formData.responseTime}
                onChange={e => setFormData({ ...formData, responseTime: parseInt(e.target.value) })}
                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-center outline-none focus:ring-0 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Max Tokens</label>
              <input 
                type="number"
                value={formData.maxTokens}
                onChange={e => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-center outline-none focus:ring-0 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">推理精度</label>
              <div className="relative">
                <button 
                  onClick={() => setShowPrecisionDropdown(!showPrecisionDropdown)}
                  className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold flex items-center justify-between hover:border-blue-200 transition-all outline-none"
                >
                  <span className="text-gray-900 uppercase italic">{formData.precision}</span>
                  <Plus className={cn("text-gray-400 transition-transform", showPrecisionDropdown ? "rotate-45" : "")} size={18} />
                </button>
                <AnimatePresence>
                  {showPrecisionDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                      className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 flex flex-col gap-1"
                    >
                      {[
                        { label: 'FP32', value: 'fp32' },
                        { label: 'FP16', value: 'fp16' },
                        { label: 'INT8', value: 'int8' }
                      ].map(opt => (
                        <div 
                          key={opt.value}
                          onClick={() => { setFormData({ ...formData, precision: opt.value as any }); setShowPrecisionDropdown(false); }}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between",
                            formData.precision === opt.value ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {opt.label}
                          {formData.precision === opt.value && <Plus size={14} className="rotate-45" />}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleApply}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            确认并保存
          </button>
        </div>
      </motion.div>
    </div>
  );
}
