import React from 'react';
import { 
  Database, 
  Search, 
  ChevronRight, 
  Table, 
  List, 
  Info, 
  RefreshCw,
  LayoutGrid,
  FileText,
  Columns,
  Hash,
  Type,
  Calendar,
  Key,
  ArrowLeft,
  Eye,
  Filter,
  ChevronLeft,
  Clock,
  ChevronDown,
  Save,
  Download,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DataSource, DictionaryEntry } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_DATA_SOURCES_LIST = [
  { id: 'ds1', name: 'xxx县财政预算管理库', type: 'Oracle' },
  { id: 'ds2', name: 'A分公司财务费用系统', type: 'MySQL' }
];

const MOCK_TABLES_BY_DS: Record<string, any[]> = {
  ds1: [
    { name: 't_budget_approval', chineseName: '部门预算批复表', description: '记录年度各部门、各预算科目的批复金额', columns: 9, rows: 12050, updateTime: '2025-01-21 10:00:00' },
    { name: 't_budget_execution', chineseName: '预算执行明细表', description: '记录每一笔实际支出明细', columns: 10, rows: 45600, updateTime: '2025-09-10 16:30:00' },
    { name: 't_budget_adjustment', chineseName: '预算调整审批表', description: '记录预算追加、调剂的审批信息', columns: 9, rows: 840, updateTime: '2025-09-05 09:15:00' },
    { name: 't_budget_idle_funds', chineseName: '预算项目资金闲置监控表', description: '记录项目资金到账后的使用情况', columns: 9, rows: 720, updateTime: '2025-09-30 11:00:00' }
  ],
  ds2: [
    { name: 'expense_invoice', chineseName: '费用报销发票表', description: '报销系统发票主数据', columns: 8, rows: 15400, updateTime: '2025-10-01 10:00:00' }
  ]
};

const MOCK_COLUMNS_BY_TABLE: Record<string, any[]> = {
  t_budget_approval: [
    { name: 'approval_id', type: 'VARCHAR', length: 32, isPrimary: true, sourceComment: '唯一审批编号', chineseName: '批复单号', description: '财政局下达预算的唯一识别单号' },
    { name: 'dept_code', type: 'VARCHAR', length: 20, isPrimary: false, sourceComment: '预算单位代码', chineseName: '部门编码', description: '单位内部标准编码' },
    { name: 'dept_name', type: 'VARCHAR', length: 100, isPrimary: false, sourceComment: '预算单位全称', chineseName: '部门名称', description: '预算所属一级部门' },
    { name: 'budget_year', type: 'INT', length: 4, isPrimary: false, sourceComment: '年份', chineseName: '预算年度', description: '资金归属的财政年度' },
    { name: 'account_code', type: 'VARCHAR', length: 30, isPrimary: false, sourceComment: '科目代码', chineseName: '预算科目代码', description: '政府统计支出科目编码' },
    { name: 'account_name', type: 'VARCHAR', length: 100, isPrimary: false, sourceComment: '科目名称', chineseName: '预算科目名称', description: '科目的具体名称描述' },
    { name: 'approved_amount', type: 'DECIMAL', length: '18,2', isPrimary: false, sourceComment: '批复总计', chineseName: '批复金额', description: '年初预算下达的计划总金额' },
    { name: 'approver', type: 'VARCHAR', length: 50, isPrimary: false, sourceComment: '审批员', chineseName: '批复部门', description: '负责该预算下达的职能股室' },
    { name: 'approve_date', type: 'DATE', length: null, isPrimary: false, sourceComment: '批复时间戳', chineseName: '批复日期', description: '该笔预算正式生效的时间' }
  ],
  t_budget_execution: [
    { name: 'exec_id', type: 'VARCHAR', length: 32, isPrimary: true, sourceComment: '流水号', chineseName: '执行流水号', description: '国库集中支付流水' },
    { name: 'approval_id', type: 'VARCHAR', length: 32, isPrimary: false, sourceComment: '关联ID', chineseName: '关联批复单号', description: '对应的预算起源单号' },
    { name: 'dept_code', type: 'VARCHAR', length: 20, isPrimary: false, sourceComment: '单位ID', chineseName: '支出部门编码', description: '实际花钱的单位编码' },
    { name: 'voucher_no', type: 'VARCHAR', length: 30, isPrimary: false, sourceComment: '凭证号', chineseName: '记账凭证号', description: '会计核算的凭证编号' },
    { name: 'payee', type: 'VARCHAR', length: 100, isPrimary: false, sourceComment: '收款人账号名', chineseName: '收款方', description: '最终收款的企业或个人名称' },
    { name: 'expense_date', type: 'DATE', length: null, isPrimary: false, sourceComment: '入账时间', chineseName: '支出日期', description: '资金离开国库的时间' },
    { name: 'expense_amount', type: 'DECIMAL', length: '18,2', isPrimary: false, sourceComment: '单笔金额', chineseName: '支出金额', description: '单次收支业务的金额' },
    { name: 'expense_usage', type: 'VARCHAR', length: 200, isPrimary: false, sourceComment: '摘要', chineseName: '支出用途', description: '具体的业务背景说明' },
    { name: 'actual_account_code', type: 'VARCHAR', length: 30, isPrimary: false, sourceComment: '科目代码', chineseName: '实际入账科目代码', description: '会计核算使用的科目' },
    { name: 'has_approval_doc', type: 'TINYINT', length: 1, isPrimary: false, sourceComment: '状态位', chineseName: '是否有审批单', description: '是否附加了纸质或电子审批附件' }
  ]
};

const MOCK_DATA_ROWS_BY_TABLE: Record<string, any[]> = {
  t_budget_approval: [
    { approval_id: 'YS2025-001-01', dept_code: '301001', dept_name: 'xxx县农业农村局', budget_year: 2025, account_code: '2130101', account_name: '行政运行', approved_amount: '4,850,000.00', approver: '财政局预算股', approve_date: '2025-01-18' },
    { approval_id: 'YS2025-001-02', dept_code: '301001', dept_name: 'xxx县农业农村局', budget_year: 2025, account_code: '2130153', account_name: '农田建设', approved_amount: '18,200,000.00', approver: '财政局预算股', approve_date: '2025-01-18' },
    { approval_id: 'YS2025-001-03', dept_code: '301001', dept_name: 'xxx县农业农村局', budget_year: 2025, account_code: '2130599', account_name: '其他巩固脱贫衔接乡村振兴支出', approved_amount: '23,500,000.00', approver: '财政局预算股', approve_date: '2025-01-18' },
    { approval_id: 'YS2025-002-01', dept_code: '302001', dept_name: 'xxx县教育局', budget_year: 2025, account_code: '2050202', account_name: '小学教育', approved_amount: '42,800,000.00', approver: '财政局预算股', approve_date: '2025-01-18' }
  ],
  t_budget_execution: [
    { exec_id: 'EX2501012', approval_id: 'YS2025-001-01', dept_code: '301001', voucher_no: 'JZ-2025-01-021', payee: 'xxx县机关加油站', expense_date: '2025-01-22', expense_amount: '4,500.00', expense_usage: '公务用车加油充值', actual_account_code: '2130101', has_approval_doc: 1 },
    { exec_id: 'EX2501035', approval_id: 'YS2025-001-02', dept_code: '301001', voucher_no: 'JZ-2025-01-088', payee: 'xxx县水利工程公司', expense_date: '2025-01-28', expense_amount: '1,200,000.00', expense_usage: '2024年高标准农田项目进度款', actual_account_code: '2130153', has_approval_doc: 1 }
  ]
};

export default function DataSourcePreview() {
  const [selectedDs, setSelectedDs] = React.useState('ds1');
  const [selectedTable, setSelectedTable] = React.useState<string | null>('t_budget_approval');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'structure' | 'data'>('structure');
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // State for editable dictionary values
  const [dictionaryData, setDictionaryData] = React.useState<Record<string, any[]>>({});
  const [tableDictData, setTableDictData] = React.useState<Record<string, { chineseName: string, description: string }>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const currentTables = MOCK_TABLES_BY_DS[selectedDs] || [];
  const filteredTables = currentTables.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.chineseName.includes(searchQuery)
  );

  const baseTableInfo = currentTables.find(t => t.name === selectedTable);
  const currentTableInfo = baseTableInfo ? {
    ...baseTableInfo,
    ...tableDictData[baseTableInfo.name]
  } : undefined;

  const handleTableDictChange = (field: 'chineseName' | 'description', value: string) => {
    if (!selectedTable || !baseTableInfo) return;
    setTableDictData(prev => ({
      ...prev,
      [selectedTable]: {
        chineseName: prev[selectedTable]?.chineseName ?? baseTableInfo.chineseName,
        description: prev[selectedTable]?.description ?? baseTableInfo.description,
        [field]: value
      }
    }));
  };
  
  // Get columns from state if modified, otherwise from mock
  const currentColumns = React.useMemo(() => {
    if (!selectedTable) return [];
    if (dictionaryData[selectedTable]) {
      return dictionaryData[selectedTable];
    }
    return MOCK_COLUMNS_BY_TABLE[selectedTable] || [];
  }, [selectedTable, dictionaryData]);

  const currentDataRows = selectedTable ? (MOCK_DATA_ROWS_BY_TABLE[selectedTable] || []) : [];

  // Reset table selection when data source changes
  React.useEffect(() => {
    const tables = MOCK_TABLES_BY_DS[selectedDs] || [];
    if (tables.length > 0) {
      setSelectedTable(tables[0].name);
    } else {
      setSelectedTable(null);
    }
  }, [selectedDs]);

  const handleDictChange = (colName: string, field: 'chineseName' | 'description', value: string) => {
    if (!selectedTable) return;
    
    const currentCols = dictionaryData[selectedTable] || MOCK_COLUMNS_BY_TABLE[selectedTable] || [];
    const newCols = [...currentCols];
    const colIdx = newCols.findIndex(c => c.name === colName);
    if (colIdx !== -1) {
      newCols[colIdx] = { ...newCols[colIdx], [field]: value };
      setDictionaryData({
        ...dictionaryData,
        [selectedTable]: newCols
      });
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1000);
  };

  const handleExport = () => {
    const table = currentTableInfo;
    if (!table) return;
    console.log("Exporting structure and dictionary for ", table.name);
    alert(`已为您生成 ${table.chineseName}_表结构字典.xlsx`);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Left: Sidebar (Database selector + Table List) */}
      <div className="w-[320px] border-r border-gray-100 bg-gray-50/30 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100 bg-white">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">当前数据源</span>
              <div className="relative">
                <select 
                  value={selectedDs}
                  onChange={(e) => setSelectedDs(e.target.value)}
                  className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-4 pr-10 text-sm font-bold text-gray-700 hover:bg-white hover:border-blue-200 focus:ring-2 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                >
                  {MOCK_DATA_SOURCES_LIST.map(ds => (
                    <option key={ds.id} value={ds.id}>{ds.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索数据库表..."
                className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 text-xs focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-300 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <Table size={14} className="text-gray-400" />
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">数据库表目录</h4>
            </div>
            <span className="text-[10px] bg-gray-200/50 text-gray-500 px-2 py-0.5 rounded-full font-bold tabular-nums">{filteredTables.length}</span>
          </div>
          
          <div className="space-y-1">
            {filteredTables.map(table => (
              <button
                key={table.name}
                onClick={() => {
                  setSelectedTable(table.name);
                  setActiveTab('structure');
                }}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border text-left transition-all relative group overflow-hidden",
                  selectedTable === table.name 
                    ? "bg-blue-50/50 border-blue-600 shadow-sm" 
                    : "bg-white border-transparent hover:bg-gray-100/50 text-gray-900"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn(
                    "text-xs font-bold truncate transition-colors",
                    selectedTable === table.name ? "text-blue-600" : "text-gray-700"
                  )}>
                    {table.chineseName}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 tabular-nums shrink-0">{table.rows.toLocaleString()}</span>
                </div>
                <p className="text-[10px] font-mono text-gray-400 truncate mt-0.5 opacity-60">
                  {table.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#F9FAFB]">
        <AnimatePresence mode="wait">
          {selectedTable ? (
            <motion.div
              key={selectedTable}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Toolbar Area */}
              <div className="bg-white border-b border-gray-100 flex items-center justify-between px-8 h-16 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2 p-1 bg-gray-100/80 rounded-xl border border-gray-200/50">
                  <button 
                    onClick={() => setActiveTab('structure')}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                      activeTab === 'structure' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <Columns size={14} />
                    表结构 & 字典
                  </button>
                  <button 
                    onClick={() => setActiveTab('data')}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                      activeTab === 'data' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <Eye size={14} />
                    数据预览
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-6 px-4 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">规模</span>
                      <span className="text-xs font-bold text-gray-900 tabular-nums">{currentTableInfo?.rows.toLocaleString()}</span>
                    </div>
                    <div className="w-px h-3 bg-gray-200" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">字段</span>
                      <span className="text-xs font-bold text-gray-900 tabular-nums">{currentTableInfo?.columns}</span>
                    </div>
                  </div>
                  
                  <div className="h-6 w-px bg-gray-200 mx-1" />
                  
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-xs font-bold">
                    <RefreshCw size={14} className="text-blue-600" />
                    <span>同步</span>
                  </button>

                  <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-xs font-bold"
                  >
                    <Download size={14} />
                    导出结构
                  </button>
                </div>
              </div>

              {/* Editable Table Header Info */}
              {activeTab === 'structure' && (
                <div className="px-8 py-6 bg-white border-b border-gray-50">
                  <div className="flex items-end gap-6 max-w-[1400px] mx-auto">
                    <div className="space-y-1.5 flex-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">数据表名称 (业务含义)</label>
                      <input 
                        type="text"
                        value={currentTableInfo?.chineseName || ''}
                        onChange={(e) => handleTableDictChange('chineseName', e.target.value)}
                        className="w-full h-10 border border-gray-200 rounded-xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all bg-gray-50/30"
                        placeholder="输入表中文名..."
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">数据表备注描述</label>
                      <input 
                        type="text"
                        value={currentTableInfo?.description || ''}
                        onChange={(e) => handleTableDictChange('description', e.target.value)}
                        className="w-full h-10 border border-gray-200 rounded-xl px-4 text-sm text-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all bg-gray-50/30"
                        placeholder="输入详细描述..."
                      />
                    </div>
                    <button className="h-10 w-10 flex items-center justify-center shrink-0 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all border border-purple-100 shadow-sm active:scale-95" title="AI智能摘要表名与描述">
                      <Sparkles size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Content Area */}
              <div className="flex-1 overflow-auto p-8">
                <div className="max-w-[1400px] mx-auto h-full">
                  {activeTab === 'structure' ? (
                      <div className="space-y-6">
                        {/* Control Bar */}
                        <div className="flex items-center justify-between pb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <List size={14} />
                              字段层级定义
                            </h4>
                            <span className="text-[10px] text-gray-400 font-medium">配置字典后有助于 AI 更精准理解业务含义</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-purple-200 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all text-xs font-bold shadow-sm active:scale-95">
                              <Sparkles size={16} />
                              一键摘要
                            </button>
                            <button 
                              onClick={handleExport}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-xs font-bold"
                            >
                              <Download size={16} />
                              导出结构 Excel
                            </button>
                            <button 
                              onClick={handleSave}
                              disabled={isSaving}
                              className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-xl transition-all text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95",
                                saveSuccess ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                              )}
                            >
                              {isSaving ? <RefreshCw size={16} className="animate-spin" /> : 
                               saveSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
                              <span>{saveSuccess ? '配置已保存' : '保存字典配置'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Structure Table */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                          <div className="overflow-x-auto overflow-y-visible">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                  <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider min-w-[200px]">字段名称 & 类型</th>
                                  <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16 text-center">主键</th>
                                  <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">源注释</th>
                                  <th className="px-6 py-5 text-[10px] font-bold text-blue-500 uppercase tracking-wider bg-blue-50/30">配置: 字典名称</th>
                                  <th className="px-6 py-5 text-[10px] font-bold text-blue-500 uppercase tracking-wider bg-blue-50/30">配置: 业务含义 (AI 映射基础)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {currentColumns.map((col) => (
                                  <tr key={col.name} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-sm font-mono font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{col.name}</span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-bold py-0.5 px-2 bg-gray-100 text-gray-500 rounded-md uppercase">
                                            {col.type} {col.length ? `(${col.length})` : ''}
                                          </span>
                                          {col.type === 'VARCHAR' ? <Type size={12} className="text-green-400" /> : 
                                           col.type === 'DECIMAL' || col.type === 'INT' ? <Hash size={12} className="text-blue-400" /> : 
                                           <Calendar size={12} className="text-purple-400" />}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                      {col.isPrimary ? (
                                        <div className="inline-flex items-center justify-center w-6 h-6 bg-amber-50 rounded-lg text-amber-500 border border-amber-100 mx-auto">
                                          <Key size={14} />
                                        </div>
                                      ) : null}
                                    </td>
                                    <td className="px-6 py-5">
                                      <span className="text-xs text-gray-400 font-medium italic">
                                        {col.sourceComment || '-'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-5 bg-blue-50/10">
                                      <input 
                                        type="text"
                                        value={col.chineseName}
                                        onChange={(e) => handleDictChange(col.name, 'chineseName', e.target.value)}
                                        className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-sm font-bold text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 transition-all placeholder:text-gray-200 shadow-sm"
                                        placeholder="输入中文名称..."
                                      />
                                    </td>
                                    <td className="px-6 py-5 bg-blue-50/10">
                                      <div className="flex items-center gap-2">
                                        <input 
                                          type="text"
                                          value={col.description}
                                          onChange={(e) => handleDictChange(col.name, 'description', e.target.value)}
                                          className="flex-1 h-10 bg-white border border-gray-200 rounded-xl px-3 text-sm text-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 transition-all placeholder:text-gray-200 shadow-sm"
                                          placeholder="输入详细业务定义..."
                                        />
                                        <button className="p-2 text-purple-600 bg-white hover:bg-purple-50 border border-purple-100 rounded-xl transition-all shrink-0 shadow-sm active:scale-95 opacity-0 group-hover:opacity-100" title="AI 增强建议">
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
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Data Filter Bar */}
                        <div className="flex items-center justify-between pb-2">
                          <div className="flex items-center gap-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <Filter size={14} />
                              抽样预览数据
                            </h4>
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Read Only 实时模式</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                type="text"
                                placeholder="在当前预览中过滤..."
                                className="h-9 bg-white border border-gray-200 rounded-xl pl-9 pr-4 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 min-w-[200px]"
                              />
                            </div>
                            <button className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-xs font-bold flex items-center gap-2">
                              <RefreshCw size={14} />
                              刷新抽样
                            </button>
                          </div>
                        </div>

                        {/* Static Data Table */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                              <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                  {currentColumns.map(col => (
                                    <th key={col.name} className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-gray-900 border-b border-gray-100 pb-1 mb-1 font-bold">{col.chineseName || '未命名'}</span>
                                        <span className="font-mono text-[9px] opacity-60 flex items-center gap-1">
                                          <Hash size={8} /> {col.name}
                                        </span>
                                      </div>
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {currentDataRows.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((row, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    {currentColumns.map(col => (
                                      <td key={col.name} className="px-6 py-4">
                                        {col.name.includes('amount') ? (
                                          <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-900 font-mono tracking-tight">¥{row[col.name]}</span>
                                          </div>
                                        ) : col.name === 'is_compliant' || col.name === 'has_approval_doc' || col.name === 'has_explanation' ? (
                                          <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                                            row[col.name] === 1 ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                                          )}>
                                            <div className={cn("w-1 h-1 rounded-full", row[col.name] === 1 ? "bg-green-500" : "bg-red-500")} />
                                            {row[col.name] === 1 ? '是' : '否'}
                                          </div>
                                        ) : (
                                          <span className={cn(
                                            "text-xs font-mono text-gray-600 tracking-tight block max-w-[200px] truncate",
                                            row[col.name] === 'NULL' && "text-red-400 italic"
                                          )}>
                                            {row[col.name]}
                                          </span>
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Pagination Bar */}
                          <div className="px-8 py-5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">每页显示规模</span>
                                <select 
                                  value={pageSize}
                                  onChange={(e) => setPageSize(Number(e.target.value))}
                                  className="h-8 bg-white border border-gray-200 rounded-lg px-2 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                                >
                                  <option value={10}>10</option>
                                  <option value={20}>20</option>
                                  <option value={50}>50</option>
                                </select>
                              </div>
                              <div className="h-4 w-px bg-gray-200" />
                              <span className="text-xs text-gray-500 font-medium">总记录规模估算: <span className="text-gray-900 font-bold">{currentTableInfo?.rows.toLocaleString()}</span></span>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button 
                                  disabled={currentPage === 1}
                                  onClick={() => setCurrentPage(p => p - 1)}
                                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 disabled:opacity-20 transition-all"
                                >
                                  <ChevronLeft size={16} />
                                </button>
                                
                                <div className="flex items-center gap-1 px-1 bg-white border border-gray-200 rounded-lg shadow-sm py-0.5">
                                  {Array.from({ length: Math.min(5, Math.ceil(currentDataRows.length / pageSize)) || 1 }).map((_, i) => (
                                    <button
                                      key={i + 1}
                                      onClick={() => setCurrentPage(i + 1)}
                                      className={cn(
                                        "w-7 h-7 rounded-md text-[11px] font-bold transition-all",
                                        currentPage === (i + 1) ? "bg-blue-600 text-white" : "text-gray-500 hover:text-blue-600"
                                      )}
                                    >
                                      {i + 1}
                                    </button>
                                  ))}
                                </div>
                                
                                <button 
                                  disabled={currentPage >= Math.ceil(currentDataRows.length / pageSize)}
                                  onClick={() => setCurrentPage(p => p + 1)}
                                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 disabled:opacity-20 transition-all"
                                >
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-white shadow-xl shadow-gray-200/50 text-gray-200 rounded-[2rem] flex items-center justify-center mb-8 border border-gray-50">
                  <Database size={48} className="text-gray-100" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">选择一个数据库表开始</h3>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                  请从左侧列表中点击选择数据库表或视图，系统将自动加载元数据结构，并支持您进行业务层级的字段及字典配置。
                </p>
                <div className="mt-8 flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl text-xs font-bold border border-blue-100">
                  <Info size={14} />
                  <span>提示：配置后的数据字典将直接影响 AI 自动映射的精准度</span>
                </div>
              </div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}
