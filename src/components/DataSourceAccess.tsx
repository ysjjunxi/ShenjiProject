import React from 'react';
import { 
  Plus, 
  Search, 
  Database, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  ShieldCheck, 
  RefreshCw,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Server,
  Settings,
  Power
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DataSource, DataSourceType } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './Pagination';

const DATABASE_TYPES: DataSourceType[] = ['SQLServer', 'Oracle', 'MySQL', '神通'];

const MOCK_DATA_SOURCES: DataSource[] = [
  {
    id: 'ds1',
    name: 'xxx县财政预算管理库',
    type: 'Oracle',
    host: '10.10.1.21',
    port: 1521,
    databaseName: 'cz_ys',
    username: 'audit_user',
    status: 'connected',
    description: '财政收支审计、政策审计',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
    isReferenced: true
  },
  {
    id: 'ds2',
    name: 'xxx县国库集中支付系统',
    type: 'SQLServer',
    host: '192.168.10.5',
    port: 1433,
    databaseName: 'master',
    username: 'audit_user',
    status: 'connected',
    description: '',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
    isReferenced: true
  },
  {
    id: 'ds3',
    name: 'xxx行政事业单位财务核算库',
    type: 'MySQL',
    host: '192.168.10.12',
    port: 3306,
    databaseName: 'cw_hs',
    username: 'audit_user',
    status: 'connected',
    description: '',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 1,
    isReferenced: true
  },
  {
    id: 'ds4',
    name: 'xxx乡镇财政管理及三资平台',
    type: 'SQLServer',
    host: '10.0.1.55',
    port: 1433,
    databaseName: 'xz_sz',
    username: 'audit_user',
    status: 'connected',
    description: '',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 1,
    isReferenced: true
  },
  {
    id: 'ds5',
    name: 'xxx村集体财务代管系统',
    type: 'MySQL',
    host: '10.0.2.88',
    port: 3306,
    databaseName: 'cj_dg',
    username: 'audit_user',
    status: 'connected',
    description: '',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 1,
    isReferenced: true
  },
  {
    id: 'ds6',
    name: 'xxx政府采购及公共资源交易平台',
    type: 'Oracle',
    host: '10.10.1.33',
    port: 1521,
    databaseName: 'zfcg',
    username: 'audit_user',
    status: 'connected',
    description: '',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 1,
    isReferenced: true
  },
  {
    id: 'ds7',
    name: 'xxx非税收入及财政票据管理库',
    type: 'SQLServer',
    host: '192.168.10.20',
    port: 1433,
    databaseName: 'master',
    username: 'audit_user',
    status: 'connected',
    description: '',
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 1,
    isReferenced: true
  },
  {
    id: 'ds8',
    name: 'xxx乡村振兴及衔接资金系统',
    type: 'MySQL',
    host: '192.168.20.10',
    port: 3306,
    databaseName: 'xczx',
    username: 'audit_user',
    status: 'connected',
    description: '',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1,
    isReferenced: true
  },
  {
    id: 'ds9',
    name: 'xxx专项债券及国债管理系统',
    type: 'Oracle',
    host: '10.10.1.45',
    port: 1521,
    databaseName: 'zxzq',
    username: 'audit_user',
    status: 'disconnected',
    description: '',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 1,
    isReferenced: false
  },
  {
    id: 'ds10',
    name: 'xxx社保及医保基金监管系统',
    type: 'Oracle',
    host: '10.10.2.10',
    port: 1521,
    databaseName: 'shbz',
    username: 'audit_user',
    status: 'connected',
    description: '',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 1,
    isReferenced: true
  }
];

interface DataSourceAccessProps {
  onConfigure?: (id: string) => void;
}

export default function DataSourceAccess({ onConfigure }: DataSourceAccessProps) {
  const [dataSources, setDataSources] = React.useState<DataSource[]>(MOCK_DATA_SOURCES);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [editingSource, setEditingSource] = React.useState<DataSource | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const PAGE_SIZE = 10;

  const filteredSources = dataSources.filter(ds => 
    ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ds.host.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredSources.length / PAGE_SIZE);
  const paginatedSources = filteredSources.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleAdd = () => {
    setEditingSource({
      id: '',
      name: '',
      type: 'MySQL',
      host: '',
      port: 3306,
      databaseName: '',
      username: '',
      password: '',
      status: 'disconnected',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isReferenced: false
    });
    setIsModalOpen(true);
  };

  const handleEdit = (ds: DataSource) => {
    setEditingSource({ ...ds, password: '' }); // Don't show old password
    setIsModalOpen(true);
  };

  const handleDelete = (ds: DataSource) => {
    if (ds.isReferenced) {
      alert('该数据源已被项目引用，需先解除关联再删除');
      return;
    }
    if (window.confirm(`确定要删除数据源 "${ds.name}" 吗？此操作不可撤销。`)) {
      setDataSources(dataSources.filter(s => s.id !== ds.id));
    }
  };

  const handleToggleStatus = (ds: DataSource) => {
    setDataSources(dataSources.map(s => {
      if (s.id === ds.id) {
        return { ...s, status: s.status === 'disabled' ? 'disconnected' : 'disabled' } as DataSource;
      }
      return s;
    }));
  };

  const handleSave = (ds: DataSource) => {
    if (ds.id) {
      setDataSources(dataSources.map(s => s.id === ds.id ? ds : s));
    } else {
      const newDs = { ...ds, id: 'ds-' + Date.now() };
      setDataSources([...dataSources, newDs]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-normal text-gray-900 tracking-tight">数据源接入</h2>
          <p className="text-sm text-gray-500 mt-0.5">统一管理异构数据库接入，为审计分析提供数据支撑</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索数据源名称或地址..."
              className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            />
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm font-medium"
          >
            <Plus size={18} />
            <span>新增数据源</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden max-w-7xl mx-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-normal text-gray-400 uppercase tracking-wider">数据源名称</th>
                <th className="px-6 py-4 text-[10px] font-normal text-gray-400 uppercase tracking-wider">类型</th>
                <th className="px-6 py-4 text-[10px] font-normal text-gray-400 uppercase tracking-wider">连接地址</th>
                <th className="px-6 py-4 text-[10px] font-normal text-gray-400 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-[10px] font-normal text-gray-400 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedSources.map((ds) => (
                <tr key={ds.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                        ds.type === 'MySQL' ? "bg-blue-50 text-blue-600" :
                        ds.type === 'Oracle' ? "bg-red-50 text-red-600" :
                        ds.type === 'SQLServer' ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"
                      )}>
                        <Database size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-normal text-gray-900">{ds.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">库名: {ds.databaseName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                      {ds.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600 font-mono">{ds.host}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">端口: {ds.port}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        ds.status === 'connected' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" :
                        ds.status === 'error' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : 
                        ds.status === 'disabled' ? "bg-gray-400" : "bg-blue-400"
                      )} />
                      <span className={cn(
                        "text-xs font-medium",
                        ds.status === 'connected' ? "text-green-600" :
                        ds.status === 'error' ? "text-red-600" : 
                        ds.status === 'disabled' ? "text-gray-500" : "text-blue-500"
                      )}>
                        {ds.status === 'connected' ? '正常' : ds.status === 'error' ? '异常' : ds.status === 'disabled' ? '已禁用' : '未测试'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleToggleStatus(ds)}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          ds.status === 'disabled' ? "text-green-600 hover:bg-green-50" : "text-amber-600 hover:bg-amber-50"
                        )}
                        title={ds.status === 'disabled' ? "启用" : "禁用"}
                      >
                        <Power size={16} />
                      </button>
                      <button 
                        onClick={() => handleEdit(ds)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(ds)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
            totalItems={filteredSources.length}
            pageSize={PAGE_SIZE}
          />

          {filteredSources.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">未找到数据源</h3>
              <p className="text-gray-500 mt-1">请尝试调整搜索条件或新增数据源</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && editingSource && (
          <DataSourceModal 
            source={editingSource}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DataSourceModal({ source, onClose, onSave }: { source: DataSource; onClose: () => void; onSave: (ds: DataSource) => void }) {
  const [formData, setFormData] = React.useState<DataSource>({ ...source });
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ success: boolean; message: string } | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    // Mock connection test with 2s delay (requirement says within 10s)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple validation for mock
    if (!formData.host || !formData.username || !formData.password) {
      setTestResult({ success: false, message: '配置信息不完整，请检查地址、账号和密码' });
      setFormData(prev => ({ ...prev, status: 'error', errorMessage: '配置不完整' }));
    } else if (formData.host === '1.1.1.1') {
      setTestResult({ success: false, message: '主机不可达，请检查网络连接或防火墙设置' });
      setFormData(prev => ({ ...prev, status: 'error', errorMessage: '主机不可达' }));
    } else if (formData.username === 'error') {
      setTestResult({ success: false, message: '账号密码错误，请重新输入' });
      setFormData(prev => ({ ...prev, status: 'error', errorMessage: '账号密码错误' }));
    } else {
      setTestResult({ success: true, message: '连接测试成功！' });
      setFormData(prev => ({ ...prev, status: 'connected', errorMessage: undefined }));
    }
    setIsTesting(false);
  };

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
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-normal text-gray-900 tracking-tight">{source.id ? '修改数据源' : '新增数据源'}</h3>
            <p className="text-xs text-gray-500 mt-1">配置数据库连接信息，支持异构数据库统一接入</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">数据源名称 <span className="text-red-500">*</span></label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="如：财务系统主库"
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">适用场景</label>
              <textarea 
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="描述该数据源适用的审计场景，如：财政收支审计、政策审计"
                className="w-full h-20 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">数据库类型 <span className="text-red-500">*</span></label>
              <select 
                value={formData.type}
                onChange={(e) => {
                  const type = e.target.value as DataSourceType;
                  let port = 3306;
                  if (type === 'Oracle') port = 1521;
                  if (type === 'SQLServer') port = 1433;
                  if (type === '神通') port = 2003;
                  setFormData({ ...formData, type, port });
                }}
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              >
                {DATABASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">数据库名称 <span className="text-red-500">*</span></label>
              <input 
                type="text"
                value={formData.databaseName}
                onChange={(e) => setFormData({ ...formData, databaseName: e.target.value })}
                placeholder="Database Name / SID"
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">主机地址 <span className="text-red-500">*</span></label>
              <div className="relative">
                <Server size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  placeholder="127.0.0.1"
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">端口号 <span className="text-red-500">*</span></label>
              <input 
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">登录账号 <span className="text-red-500">*</span></label>
              <input 
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Username"
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">登录密码 <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password"
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-2xl flex items-start gap-3 border",
                testResult.success ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
              )}
            >
              {testResult.success ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
              <p className="text-sm font-medium">{testResult.message}</p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <button 
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all disabled:opacity-50"
          >
            {isTesting ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            <span>测试连接</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
            >
              取消
            </button>
            <button 
              onClick={() => {
                if (!formData.name || !formData.host || !formData.databaseName || !formData.username || !formData.password) {
                  alert('请填写所有必填项');
                  return;
                }
                if (formData.status !== 'connected') {
                  alert('请先通过连接测试');
                  return;
                }
                onSave({ ...formData, updatedAt: Date.now() });
              }}
              className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <CheckCircle2 size={18} />
              <span>保存配置</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
