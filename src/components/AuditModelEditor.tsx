import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Database, Code, CheckCircle2, FileText, CheckSquare, Settings, TableProperties, Eye, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuditModel, AuditRule } from '@/src/types';
import { MOCK_RULES } from './AuditRuleMgmt';
import { motion, AnimatePresence } from 'motion/react';

const AVAILABLE_TABLES = [
  { id: 't1', name: '标准表', fields: [{ name: 'id', type: 'VARCHAR(32)' }, { name: 'amount', type: 'DECIMAL(18,2)' }, { name: 'date', type: 'DATE' }, { name: 'department_id', type: 'VARCHAR(32)' }] },
  { id: 't2', name: '凭证清单表', fields: [{ name: 'voucher_id', type: 'VARCHAR(32)' }, { name: 'amount', type: 'DECIMAL(18,2)' }, { name: 'subject_code', type: 'VARCHAR(20)' }, { name: 'date', type: 'DATE' }] },
  { id: 't3', name: '项目台账表', fields: [{ name: 'project_id', type: 'VARCHAR(32)' }, { name: 'project_name', type: 'VARCHAR(255)' }, { name: 'budget', type: 'DECIMAL(18,2)' }, { name: 'manager', type: 'VARCHAR(50)' }] },
  { id: 't4', name: '付款记录表', fields: [{ name: 'payment_id', type: 'VARCHAR(32)' }, { name: 'payee', type: 'VARCHAR(255)' }, { name: 'amount', type: 'DECIMAL(18,2)' }, { name: 'payment_date', type: 'DATE' }] }
];

interface AuditModelEditorProps {
  mode: 'auto' | 'manual';
  initialModel?: AuditModel;
  onBack: () => void;
  onSave: (model: AuditModel) => void;
}

export default function AuditModelEditor({ initialModel, onBack, onSave }: AuditModelEditorProps) {
  // 1. Basic Info
  const [skillId] = useState(initialModel?.id || `sk-${Date.now().toString(36).toUpperCase()}`);
  const [modelName, setModelName] = useState(initialModel?.name || '');
  const [category, setCategory] = useState(initialModel?.category || '财务审计 / 专项资金');
  const [description, setDescription] = useState(initialModel?.description || '');
  const [version] = useState(initialModel?.version || 'v1.0.0');
  
  // 2. Data Source
  const [selectedDB, setSelectedDB] = useState('标准库');
  const [selectedTables, setSelectedTables] = useState<string[]>(
    initialModel?.dataSources?.map(ds => ds.table) || ['标准表']
  );
  const [viewingTable, setViewingTable] = useState<typeof AVAILABLE_TABLES[0] | null>(null);

  // 3. Checkpoints
  const [selectedRules, setSelectedRules] = useState<string[]>(initialModel?.ruleIds || []);
  const [dataQueryScript, setDataQueryScript] = useState(initialModel?.auditLogic || '');

  // 4. Audit Process (Markdown)
  const [auditProcessMd, setAuditProcessMd] = useState(initialModel?.auditProcessMd || '');

  const handleSave = () => {
    const newModel: AuditModel = {
      id: skillId,
      name: modelName || '未命名模型',
      category: category,
      status: initialModel?.status || 'enabled',
      version: version,
      creator: initialModel?.creator || '当前用户',
      createdAt: initialModel?.createdAt || Date.now(),
      updatedAt: Date.now(),
      description: description,
      auditLogic: dataQueryScript,
      laws: initialModel?.laws || [],
      dataSources: selectedTables.map(t => ({ db: selectedDB, table: t, fields: [] })),
      ruleIds: selectedRules,
      auditProcessMd: auditProcessMd,
      scripts: initialModel?.scripts || {
        generation: '-- 生成脚本',
        view: '-- 视图',
        statistics: '-- 统计'
      },
      params: initialModel?.params || {
        statistics: [],
        details: [],
        navigation: []
      },
      versions: initialModel?.versions || [
        { version: version, creator: '当前用户', createdAt: Date.now(), content: '初始生成', isDefault: true }
      ],
      callUrl: initialModel?.callUrl
    };
    onSave(newModel);
  };

  const handleRuleToggle = (ruleId: string) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) ? prev.filter(id => id !== ruleId) : [...prev, ruleId]
    );
  };

  const handleTableToggle = (tableName: string) => {
    setSelectedTables(prev => 
      prev.includes(tableName) ? prev.filter(t => t !== tableName) : [...prev, tableName]
    );
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
            <h2 className="text-xl font-normal text-gray-900 tracking-tight">
              {initialModel ? '编辑审计模型' : '新增审计模型'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">配置模型基本信息、数据源、审查点和流程说明</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            校验并保存
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Section 1: Basic Info */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              1. 基本信息
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Skill ID</label>
                <input 
                  type="text"
                  value={skillId}
                  disabled
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">版本</label>
                <input 
                  type="text"
                  value={version}
                  disabled
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">所选模型名称</label>
                <input 
                  type="text"
                  value={modelName}
                  onChange={e => setModelName(e.target.value)}
                  placeholder="请输入模型名称"
                  className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">所属业务分类</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option>财务审计 / 专项资金</option>
                  <option>财务审计 / 收入审计</option>
                  <option>工程项目审计</option>
                  <option>经济责任审计</option>
                  <option>IT 审计</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">适用场景</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="描述该模型的适用业务场景..."
                  rows={3}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">数据权限</label>
                <input 
                  type="text"
                  value="默认（只读访问，不可篡改源数据）"
                  disabled
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Data Source */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Database size={20} className="text-indigo-600" />
              2. 数据源
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">选择库类型</label>
                <select 
                  value={selectedDB}
                  onChange={e => setSelectedDB(e.target.value)}
                  className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  <option>标准库</option>
                  <option>业务自建库</option>
                  <option>外部接入库</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">选择表</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AVAILABLE_TABLES.map(table => (
                    <div 
                      key={table.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-all",
                        selectedTables.includes(table.name) ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50"
                      )}
                    >
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input 
                          type="checkbox" 
                          checked={selectedTables.includes(table.name)}
                          onChange={() => handleTableToggle(table.name)}
                          className="rounded text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-sm font-bold text-gray-900">{table.name}</span>
                      </label>
                      <button 
                        onClick={() => setViewingTable(table)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                        title="查看表结构"
                      >
                        <Eye size={16} />
                        <span className="text-xs font-medium">结构</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Checkpoints */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckSquare size={20} className="text-purple-600" />
              3. 审查点
            </h3>
            
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">组装审计规则</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_RULES.map(rule => (
                  <label 
                    key={rule.id} 
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                      selectedRules.includes(rule.id) ? "bg-purple-50 border-purple-200" : "bg-white border-gray-100 hover:border-purple-200 hover:bg-purple-50/50"
                    )}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedRules.includes(rule.id)}
                      onChange={() => handleRuleToggle(rule.id)}
                      className="mt-1 rounded text-purple-600 focus:ring-purple-500" 
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-900 block mb-1">{rule.name}</span>
                      <p className="text-xs text-gray-500 line-clamp-2">{rule.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Code size={14} /> 数据查询脚本
              </label>
              <textarea 
                value={dataQueryScript}
                onChange={e => setDataQueryScript(e.target.value)}
                placeholder="-- 编写用于数据查询或提取的 SQL 脚本..."
                rows={8}
                className="w-full bg-gray-900 border border-gray-800 text-purple-100 font-mono rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
            </div>
          </section>

          {/* Section 4: Audit Process */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Settings size={20} className="text-orange-600" />
              4. 审计流程
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">支持 Markdown 格式</label>
              <textarea 
                value={auditProcessMd}
                onChange={e => setAuditProcessMd(e.target.value)}
                placeholder="在此输入审计流程说明 (支持 Markdown)...&#10;&#10;例如:&#10;1. 提取全量支付数据&#10;2. 过滤超授权额度的记录&#10;3. ..."
                rows={8}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
              />
            </div>
          </section>

        </div>
      </div>

      {/* Table Structure Viewer Modal */}
      <AnimatePresence>
        {viewingTable && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingTable(null)}
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
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <TableProperties size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">{viewingTable.name}</h3>
                    <p className="text-xs text-gray-500">表结构详情</p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingTable(null)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">字段名</th>
                        <th className="px-6 py-4">类型</th>
                        <th className="px-6 py-4">说明</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {viewingTable.fields.map((field, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-indigo-600 font-medium">{field.name}</td>
                          <td className="px-6 py-4 font-mono text-gray-500 text-xs">{field.type}</td>
                          <td className="px-6 py-4 text-gray-600">-</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
