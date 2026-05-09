import React from 'react';
import { 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  FileText, 
  Database, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Edit2,
  FileCode,
  Layout,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DataSource, DictionaryEntry, ConfigFile, SemanticInterfaceConfig } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

interface DataSourceConfigProps {
  dataSourceId: string;
  onBack: () => void;
}

type TabType = 'metadata' | 'mapping' | 'auth' | 'config';

export default function DataSourceConfig({ dataSourceId, onBack }: DataSourceConfigProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('metadata');
  const [selectedTable, setSelectedTable] = React.useState<string>('all');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(dataSourceId);

  // Mock data for the selected data source
  const [config, setConfig] = React.useState({
    semantic: {
      url: 'https://api.audit-ai.com/v1/semantic',
      params: '{"temperature": 0.1, "max_tokens": 2048}',
      apiKey: 'sk-audit-xxxxxxxxxxxx'
    },
    description: `[
  {
    "table": "audit_record",
    "description": "审计记录主表",
    "columns": [
      {"name": "id", "type": "uuid", "comment": "主键ID"},
      {"name": "project_id", "type": "uuid", "comment": "关联项目ID"},
      {"name": "amount", "type": "decimal", "comment": "审计金额"}
    ]
  }
]`,
    dictionary: [
      {
        tableName: 'audit_record',
        tableChineseName: '审计记录表',
        fields: [
          { name: 'id', chineseName: '主键标识', type: 'VARCHAR', description: '唯一识别码' },
          { name: 'project_id', chineseName: '项目编号', type: 'VARCHAR', description: '关联的审计项目ID' },
          { name: 'amount', chineseName: '涉及金额', type: 'DECIMAL', description: '审计发现的违规或疑点金额' }
        ]
      }
    ] as DictionaryEntry[],
    files: [
      { id: 'f1', name: 'mapping_rules.json', content: '{"rules": []}', updatedAt: Date.now() }
    ] as ConfigFile[]
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!selectedId) {
    return (
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h2 className="text-xl font-normal text-gray-900 tracking-tight">数据映射配置</h2>
              <p className="text-sm text-gray-500 mt-1">请选择一个已接入的数据源进行数据映射与配置</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'ds1', name: 'xxx县财政预算管理库', type: 'Oracle', host: '10.10.1.21' }
            ].map((ds) => (
              <button
                key={ds.id}
                onClick={() => setSelectedId(ds.id)}
                className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Database size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{ds.name}</h4>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">{ds.type}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">主机地址</span>
                    <span className="text-gray-600 font-mono">{ds.host}</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end text-blue-600 text-sm font-bold gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <span>进入配置</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => setSelectedId('')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            title="返回数据源列表"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-normal text-gray-900 tracking-tight">数据映射配置</h2>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">ID: {selectedId}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">配置 AI 语义理解、数据字典及自动字段映射</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl w-fit">
          <TabButton active={activeTab === 'metadata'} onClick={() => setActiveTab('metadata')} icon={<Database size={16} />} label="元数据与字典" />
          <TabButton active={activeTab === 'mapping'} onClick={() => setActiveTab('mapping')} icon={<MessageSquare size={16} />} label="AI字段映射" />
          <TabButton active={activeTab === 'auth'} onClick={() => setActiveTab('auth')} icon={<ShieldCheck size={16} />} label="数据授权与隔离" />
          <TabButton active={activeTab === 'config'} onClick={() => setActiveTab('config')} icon={<Settings size={16} />} label="其他配置" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'mapping' && (
              <motion.div 
                key="mapping"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">AI字段映射</h4>
                      <p className="text-xs text-gray-500 mt-1">自动统一将所有用户数据库和字段映射至系统标准数据表中集中展示，支持人工复核与审核。</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                        <RefreshCw size={16} />
                        <span>手动触发数据同步</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all">
                        <Clock size={16} />
                        <span>配置自动同步</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                        <CheckCircle2 size={16} />
                        <span>批量审核通过</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-6 py-3 text-[10px] font-normal text-gray-400 uppercase">源表名</th>
                          <th className="px-6 py-3 text-[10px] font-normal text-gray-400 uppercase">源字段</th>
                          <th className="px-6 py-3 text-[10px] font-normal border-l border-gray-100 text-blue-500 uppercase bg-blue-50/30">推荐标准实体</th>
                          <th className="px-6 py-3 text-[10px] font-normal text-blue-500 uppercase bg-blue-50/30">推荐标准字段</th>
                          <th className="px-6 py-3 text-[10px] font-normal text-gray-400 uppercase text-center">AI 置信度</th>
                          <th className="px-6 py-3 text-[10px] font-normal text-gray-400 uppercase text-center">状态</th>
                          <th className="px-6 py-3 text-[10px] font-normal text-gray-400 uppercase text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {/* Mock mapping rows */}
                        <tr className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-mono text-gray-600">audit_record</td>
                          <td className="px-6 py-4 text-xs font-mono text-gray-800">project_id</td>
                          <td className="px-6 py-4 bg-blue-50/10 border-l border-gray-100">
                            <select className="w-full h-8 text-xs font-normal text-blue-700 bg-blue-50 rounded-lg px-2 border-none focus:ring-0">
                              <option>项目</option>
                              <option>单位/部门</option>
                              <option>资金/补贴</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 bg-blue-50/10">
                            <select className="w-full h-8 text-xs font-normal text-blue-700 bg-blue-50 rounded-lg px-2 border-none focus:ring-0">
                              <option>项目编号</option>
                              <option>项目名称</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-xs font-bold text-green-600">98%</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 text-[10px] font-bold rounded bg-amber-50 text-amber-600">待审核</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-all" title="审核通过"><CheckCircle2 size={16} /></button>
                              <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all" title="驳回/禁用"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-mono text-gray-600">audit_record</td>
                          <td className="px-6 py-4 text-xs font-mono text-gray-800">amount</td>
                          <td className="px-6 py-4 bg-blue-50/10 border-l border-gray-100">
                            <select className="w-full h-8 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg px-2 border-none focus:ring-0">
                              <option>收支明细</option>
                              <option>资金/补贴</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 bg-blue-50/10">
                            <select className="w-full h-8 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg px-2 border-none focus:ring-0">
                              <option>发生金额</option>
                              <option>预算金额</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-xs font-bold text-green-600">95%</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 text-[10px] font-bold rounded bg-green-50 text-green-600">已生效</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-all" title="回滚版本"><RefreshCw size={16} /></button>
                            </div>
                          </td>
                        </tr>
                        {/* More rows... */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'auth' && (
              <motion.div 
                key="auth"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">数据源权限与访问控制</h4>
                      <p className="text-xs text-gray-500 mt-1">支持按租户、项目、字段级授权。授权均只有[只读]权限。</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all">
                      <Plus size={16} />
                      <span>新增授权策略</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 flex items-center gap-2">
                            A分公司三公经费专项审计项目
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded">项目级</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">被授权对象：张审核等3人</p>
                        </div>
                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded">生效中</span>
                      </div>
                      <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                        <span className="font-bold">权限范围：</span>允许只读访问 audit_record, budget_items 表。屏蔽敏感字段(user_idcard)。
                        <br/><span className="text-gray-400 mt-1 inline-block">有效期至：2024-12-31</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'metadata' && (
              <motion.div 
                key="metadata"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">数据字典与元数据</h4>
                      <p className="text-xs text-gray-500 mt-1">支持查看底层表结构、字段级中英文字典维护与批量导入。</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                        <Download size={16} />
                        <span>导出字典</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                        <Upload size={16} />
                        <span>导入字典</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                    <label className="text-sm font-bold text-gray-700">选择数据表</label>
                    <select
                      className="flex-1 h-10 bg-white border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                      value={selectedTable}
                      onChange={e => setSelectedTable(e.target.value)}
                    >
                      <option value="all">全部表</option>
                      {config.dictionary.map(t => (
                        <option key={t.tableName} value={t.tableName}>
                          {t.tableName} {t.tableChineseName ? `(${t.tableChineseName})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {config.dictionary.map((table, tIdx) => (
                    (selectedTable === 'all' || selectedTable === table.tableName) && (
                    <div key={table.tableName} className="space-y-4">
                      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">表名 (元数据)</label>
                          <span className="text-sm font-mono font-bold text-gray-700">{table.tableName}</span>
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">业务含义 (字典)</label>
                          <input 
                            type="text"
                            value={table.tableChineseName}
                            onChange={(e) => {
                              const newDict = [...config.dictionary];
                              newDict[tIdx].tableChineseName = e.target.value;
                              setConfig({ ...config, dictionary: newDict });
                            }}
                            className="w-full h-10 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                        <div className="flex-[2]">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">备注描述</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text"
                              value={table.tableDescription || ''}
                              onChange={(e) => {
                                const newDict = [...config.dictionary];
                                newDict[tIdx].tableDescription = e.target.value;
                                setConfig({ ...config, dictionary: newDict });
                              }}
                              className="w-full h-10 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                              placeholder="添加表备注描述..."
                            />
                            <button 
                              className="p-2.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all flex-shrink-0"
                              title="AI 智能备注"
                            >
                              <Sparkles size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                              <th className="px-6 py-3 text-[10px] font-normal text-gray-400 uppercase">源字段名</th>
                              <th className="px-6 py-3 text-[10px] font-normal text-gray-400 uppercase">数据类型</th>
                              <th className="px-6 py-3 text-[10px] font-normal text-gray-400 uppercase">中文含义</th>
                              <th className="px-6 py-3 text-[10px] font-normal text-gray-400 uppercase">备注描述</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {table.fields.map((field, fIdx) => (
                              <tr key={field.name} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-3 text-sm font-mono text-gray-600">{field.name}</td>
                                <td className="px-6 py-3 text-xs text-blue-500 font-mono font-normal">{field.type}</td>
                                <td className="px-6 py-3">
                                  <input 
                                    type="text"
                                    value={field.chineseName}
                                    onChange={(e) => {
                                      const newDict = [...config.dictionary];
                                      newDict[tIdx].fields[fIdx].chineseName = e.target.value;
                                      setConfig({ ...config, dictionary: newDict });
                                    }}
                                    className="w-full h-9 bg-gray-50 border border-gray-100 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                  />
                                </td>
                                <td className="px-6 py-3">
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="text"
                                      value={field.description}
                                      onChange={(e) => {
                                        const newDict = [...config.dictionary];
                                        newDict[tIdx].fields[fIdx].description = e.target.value;
                                        setConfig({ ...config, dictionary: newDict });
                                      }}
                                      className="flex-1 h-9 bg-gray-50 border border-gray-100 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                    />
                                    <button 
                                      className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all flex-shrink-0"
                                      title="AI 智能备注"
                                    >
                                      <Sparkles size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    )
                  ))}

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button 
                      className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all border border-purple-100 mr-auto"
                      onClick={() => setActiveTab('mapping')}
                    >
                      <Sparkles size={16} />
                      <span>批量AI系统映射</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('mapping')}
                      className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                    >
                      <span>前往字段映射</span>
                      <ArrowRight size={16} />
                    </button>
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm font-medium"
                    >
                      <Save size={16} />
                      <span>保存</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'config' && (
              <motion.div 
                key="config"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-900">配置文件管理</h4>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                      <Plus size={16} />
                      <span>新增配置文件</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {config.files.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                            <FileText size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-400 mt-1">最后修改: {new Date(file.updatedAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Edit2 size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-green-600 text-white rounded-2xl shadow-2xl"
          >
            <CheckCircle2 size={20} />
            <span className="font-bold">配置保存成功！</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
        active ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
