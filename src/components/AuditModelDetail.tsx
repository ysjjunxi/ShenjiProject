import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Zap,
  Blocks, 
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
  X,
  BookOpen,
  Database
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuditModel, ModelVersion, ToolParam, ModelCheckpoint } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { KNOWLEDGE_BASES, MOCK_MATERIALS } from '@/src/constants';

interface AuditModelDetailProps {
  model: AuditModel;
  onBack: () => void;
  onUpdate: (updatedModel: AuditModel) => void;
}

type TabType = 'basic' | 'knowledge_base' | 'checkpoints' | 'process';

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'basic', label: '基本信息', icon: <FileText size={18} /> },
  { id: 'knowledge_base', label: '知识库', icon: <BookOpen size={18} /> },
  { id: 'checkpoints', label: '审查点', icon: <ShieldCheck size={18} /> },
  { id: 'process', label: '审计流程', icon: <Zap size={18} /> },
];

export default function AuditModelDetail({ model, onBack, onUpdate }: AuditModelDetailProps) {
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

  const handleSetDefaultVersion = (v: ModelVersion) => {
    const updatedVersions = model.versions.map(version => ({
      ...version,
      isDefault: version.version === v.version
    }));

    const updatedModel: AuditModel = {
      ...model,
      version: v.version,
      versions: updatedVersions,
      updatedAt: Date.now()
    };

    onUpdate(updatedModel);
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
              {activeTab === 'knowledge_base' && <KnowledgeBaseTab model={model} />}
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
                      <th className="px-8 py-4 font-normal">版本号</th>
                      <th className="px-8 py-4 font-normal">修改记录</th>
                      <th className="px-8 py-4 font-normal">修改人</th>
                      <th className="px-8 py-4 font-normal">修改时间</th>
                      <th className="px-8 py-4 font-normal">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {model.versions.map((v, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-normal text-gray-900">{v.version}</span>
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
                            <button 
                              onClick={() => handleSetDefaultVersion(v)}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              设为默认
                            </button>
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

function KnowledgeBaseTab({ model }: { model: AuditModel }) {
  const kb = KNOWLEDGE_BASES.find(k => k.id === model.knowledgeBaseId);
  const materials = MOCK_MATERIALS.filter(m => model.materialIds?.includes(m.id));

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-600" />
          关联知识库详情
        </h3>
        {kb ? (
          <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">{kb.name}</p>
              <p className="text-xs text-gray-500 mt-1">{kb.description || '暂无描述'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">包含文档</p>
                <p className="text-sm font-bold text-gray-900">{kb.docCount} 份</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">存储类型</p>
                <p className="text-sm font-bold text-indigo-600">{kb.storageType}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 italic text-sm">
            未关联知识库
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-50">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList size={18} className="text-gray-400" />
          已选审计资料 ({materials.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map(m => (
            <div key={m.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                <FileText size={16} />
              </div>
              <span className="text-sm font-medium text-gray-700 truncate" title={m.name}>{m.name}</span>
            </div>
          ))}
          {materials.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100 text-gray-400 text-sm">
              未选择具体审计资料，大模型将检索整个知识库。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckpointsTab({ model }: { model: AuditModel }) {
  const checkpoints = model.checkpoints || [];

  if (checkpoints.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
        <ShieldCheck size={32} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-sm font-medium text-gray-900 mb-1">未配置审查点</h3>
        <p className="text-xs text-gray-500">该模型尚未配置审查点，请在编辑器中进行配置。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {checkpoints.map((cp, idx) => (
        <div key={cp.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold ring-1 ring-blue-100">
                {idx + 1}
              </span>
              {cp.name}
            </h3>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed italic">{cp.description}</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Database size={14} /> 关联标准数据表
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cp.standardTables.map((table, tIdx) => (
                  <div key={tIdx} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {table.tableName}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {table.fields.map(f => (
                        <span key={f} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-mono rounded-lg border border-gray-100">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Code size={14} /> 数据查询脚本 (SQL)
              </h4>
              <div className="w-full bg-gray-900 text-blue-100 font-mono p-5 rounded-2xl border border-gray-800 text-sm leading-relaxed whitespace-pre-wrap shadow-inner overflow-hidden">
                {cp.script || '-- 暂未编写脚本'}
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
        <Blocks size={32} className="mx-auto text-gray-300 mb-3" />
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
