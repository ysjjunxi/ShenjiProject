import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  BrainCircuit, 
  ClipboardList, 
  FileCheck,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  AlertCircle,
  Download,
  Edit2,
  Trash2,
  Play,
  RefreshCw,
  Copy,
  Check,
  History,
  Terminal,
  Code,
  Link,
  User,
  Info,
  ExternalLink,
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuditModel, ModelVersion, ToolParam, AuditRule } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { MOCK_RULES } from './AuditRuleMgmt';

interface AuditModelDetailProps {
  model: AuditModel;
  onBack: () => void;
}

type TabType = 'basic' | 'datasource' | 'checkpoints' | 'process';

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'basic', label: '基本信息', icon: <FileText size={18} /> },
  { id: 'datasource', label: '数据源', icon: <ClipboardList size={18} /> },
  { id: 'checkpoints', label: '审查点', icon: <ShieldCheck size={18} /> },
  { id: 'process', label: '审计流程', icon: <BrainCircuit size={18} /> },
];

export default function AuditModelDetail({ model, onBack }: AuditModelDetailProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('basic');
  const [showVersionModal, setShowVersionModal] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopyUrl = () => {
    if (model.callUrl) {
      navigator.clipboard.writeText(model.callUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
              <h2 className="text-xl font-normal text-gray-900 tracking-tight">{model.name}</h2>
              <button 
                onClick={() => setShowVersionModal(true)}
                className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider border border-blue-100 hover:bg-blue-100 transition-all"
              >
                {model.version}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">分类：{model.category} • 创建人：{model.creator}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyUrl}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Link size={16} />}
            <span>{copied ? '已复制' : '复制调用地址'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 bg-white border-b border-gray-100">
        <div className="flex items-center gap-6 max-w-7xl mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 py-4 text-sm font-medium transition-all relative",
                activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'basic' && <BasicInfoTab model={model} />}
              {activeTab === 'datasource' && <DataSourceTab model={model} />}
              {activeTab === 'checkpoints' && <CheckpointsTab model={model} />}
              {activeTab === 'process' && <ProcessTab model={model} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Version Modal */}
      <AnimatePresence>
        {showVersionModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVersionModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-normal text-gray-900 tracking-tight flex items-center gap-2">
                  <History size={24} className="text-blue-600" />
                  版本管理
                </h3>
                <button onClick={() => setShowVersionModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-0 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100 sticky top-0">
                    <tr>
                      <th className="px-8 py-4 font-bold">版本号</th>
                      <th className="px-8 py-4 font-bold">修改记录</th>
                      <th className="px-8 py-4 font-bold">修改人</th>
                      <th className="px-8 py-4 font-bold">修改时间</th>
                      <th className="px-8 py-4 font-bold">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {model.versions.map((v, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{v.version}</span>
                            {v.isDefault && (
                              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-bold rounded uppercase border border-blue-100">DEFAULT</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-4 text-gray-500 max-w-xs truncate">{v.content}</td>
                        <td className="px-8 py-4 text-gray-500 font-medium">{v.creator}</td>
                        <td className="px-8 py-4 text-gray-400 text-xs">{new Date(v.createdAt).toLocaleString()}</td>
                        <td className="px-8 py-4">
                          {!v.isDefault && (
                            <button className="text-blue-600 hover:underline font-medium">设为默认</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
                <button 
                  onClick={() => setShowVersionModal(false)}
                  className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BasicInfoTab({ model }: { model: AuditModel }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 flex items-center gap-2">
          <Info size={20} className="text-blue-600" />
          模型基本信息
        </h3>
        <div className="space-y-4">
          <InfoItem label="模型名称" value={model.name} />
          <InfoItem label="模型分类" value={model.category} />
          <InfoItem label="当前版本" value={model.version} />
          <InfoItem label="创建人" value={model.creator} />
          <InfoItem label="创建时间" value={new Date(model.createdAt).toLocaleString()} />
          <InfoItem label="更新时间" value={new Date(model.updatedAt).toLocaleString()} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" />
          模型描述
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
          {model.description}
        </p>
        <div className="pt-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">调用地址</h4>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 font-mono text-[11px] text-gray-500">
            <Link size={14} className="shrink-0" />
            <span className="truncate flex-1">{model.callUrl || '未生成调用地址'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataSourceTab({ model }: { model: AuditModel }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <h3 className="text-lg font-normal tracking-tight text-gray-900 flex items-center gap-2">
        <ClipboardList size={20} className="text-blue-600" />
        模型数据源
      </h3>
      <div className="grid grid-cols-1 gap-6">
        {model.dataSources?.map((ds, idx) => (
          <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">数据库</span>
                <span className="text-sm font-bold text-gray-900">{ds.db}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">数据表</span>
                <span className="text-sm font-bold text-blue-600">{ds.table}</span>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">查询字段</h4>
              <div className="flex flex-wrap gap-2">
                {ds.fields.map(f => (
                  <span key={f} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-700 shadow-sm">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {(!model.dataSources || model.dataSources.length === 0) && (
          <div className="text-center py-12 text-gray-400 italic">暂无数据源配置</div>
        )}
      </div>
    </div>
  );
}

function CheckpointsTab({ model }: { model: AuditModel }) {
  const rules = model.ruleIds ? MOCK_RULES.filter(r => model.ruleIds?.includes(r.id)) : [];

  if (rules.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
        <ShieldCheck size={32} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-sm font-medium text-gray-900 mb-1">未关联审计规则</h3>
        <p className="text-xs text-gray-500">无法查看审查点，请先在模型编辑器中绑定来自规则库的审计规则。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {rules.map(rule => (
        <div key={rule.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-normal tracking-tight text-gray-900 flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-600" />
              审查点详情 <span className="text-xs text-gray-400 font-normal ml-2">(数据来源于审计规则管理: {rule.name})</span>
            </h3>
          </div>

          {/* Fixed Checkpoints */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3">固定审查点</h4>
            <div className="space-y-3">
              {rule.fixedCheckpoints.map((cp, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h5 className="text-sm font-bold text-gray-900 mb-2">{cp.name}</h5>
                  <p className="text-sm text-gray-600 leading-relaxed bg-white border border-gray-200 p-3 rounded-lg shadow-sm">{cp.description}</p>
                </div>
              ))}
              {rule.fixedCheckpoints.length === 0 && <div className="text-xs text-gray-400 italic">暂无法定审查点</div>}
            </div>
          </div>

          {/* Configurable Checkpoints & Scripts */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3 mt-8">可配置业务审查点及相关执行脚本</h4>
            <div className="space-y-6">
              {rule.configurableCheckpoints && rule.configurableCheckpoints.length > 0 ? (
                <div className="space-y-4">
                  {rule.configurableCheckpoints.map((cc) => (
                    <div key={cc.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
                      <h5 className="text-sm font-bold text-gray-900">{cc.name}</h5>
                      <div className="space-y-2">
                        {cc.logicBlocks.map((lb, bIdx) => (
                          <div key={lb.id} className="text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200 flex items-center flex-wrap gap-2">
                             {bIdx > 0 && <span className="font-bold text-orange-600 mr-2">{lb.relation === 'OR' ? '或' : '且'}</span>}
                             <span className="font-mono text-gray-900">{lb.leftTerm}</span>
                             <span className="mx-2 text-gray-500 font-mono">{lb.operator}</span>
                             {lb.rightType === 'fixed' ? (
                               <span className="font-mono text-gray-900">{lb.rightTerm} {lb.paramUnit}</span>
                             ) : (
                               <span className="font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded">参数: {lb.rightTerm} (默认: {lb.paramValue}{lb.paramUnit}, 范围: {lb.paramRangeMin}~{lb.paramRangeMax})</span>
                             )}
                          </div>
                        ))}
                      </div>
                      {cc.penaltyBasis?.source && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-3">
                          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">判罚依据: {cc.penaltyBasis.source} - {cc.penaltyBasis.chapter}</span>
                          <p className="text-sm text-gray-700">{cc.penaltyBasis.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic">暂无可配置业务审查点</div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-3">相关执行脚本</h4>
              <div className="w-full bg-gray-900 text-blue-100 font-mono p-4 rounded-2xl border border-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                {model.scripts.generation}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProcessTab({ model }: { model: AuditModel }) {
  if (!model.auditProcessMd) {
    return (
      <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
        <BrainCircuit size={32} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-sm font-medium text-gray-900 mb-1">未找到审计流程说明</h3>
        <p className="text-xs text-gray-500">模型尚未配置对应的Markdown流程文件</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className="markdown-body prose prose-sm prose-blue max-w-none">
        <Markdown>{model.auditProcessMd}</Markdown>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-400 font-medium">{label}</span>
      <span className="text-sm font-bold text-gray-900 text-right max-w-[60%]">{value}</span>
    </div>
  );
}
