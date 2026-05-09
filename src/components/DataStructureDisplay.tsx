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
  BarChart3,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Code2,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface DataStructureDisplayProps {
  onGenerateSql: (sql: string) => void;
  hideHeader?: boolean;
}

const MOCK_DATA_SOURCES = [
  { id: 'ds1', name: 'xxx县财政预算管理库', type: 'Oracle', status: 'connected', host: '10.10.1.21' },
  { id: 'ds2', name: 'xxx县国库集中支付系统', type: 'SQLServer', status: 'connected', host: '192.168.10.5' },
  { id: 'ds3', name: 'xxx行政事业单位财务核算库', type: 'MySQL', status: 'connected', host: '192.168.10.12' },
  { id: 'ds4', name: 'xxx乡镇财政管理及三资平台', type: 'SQLServer', status: 'connected', host: '10.0.1.55' },
];

const MOCK_TABLES_MAP: Record<string, any[]> = {
  ds1: [
    { name: 't_budget_approval', type: 'TABLE', columns: 9, rows: 12, comment: '部门预算批复表' },
    { name: 't_budget_execution', type: 'TABLE', columns: 10, rows: 16, comment: '预算执行明细表' },
    { name: 't_budget_adjustment', type: 'TABLE', columns: 9, rows: 8, comment: '预算调整审批表' },
    { name: 't_budget_idle_funds', type: 'TABLE', columns: 9, rows: 7, comment: '预算项目资金闲置监控表' },
  ]
};

const MOCK_COLUMNS_MAP: Record<string, any[]> = {
  t_budget_approval: [
    { name: 'approval_id', type: 'VARCHAR', length: 32, isPrimary: true, comment: '批复单号' },
    { name: 'dept_code', type: 'VARCHAR', length: 20, isPrimary: false, comment: '部门编码' },
    { name: 'dept_name', type: 'VARCHAR', length: 100, isPrimary: false, comment: '部门名称' },
    { name: 'budget_year', type: 'INT', length: 4, isPrimary: false, comment: '预算年度' },
    { name: 'account_code', type: 'VARCHAR', length: 20, isPrimary: false, comment: '科目编码' },
    { name: 'account_name', type: 'VARCHAR', length: 100, isPrimary: false, comment: '科目名称' },
    { name: 'approved_amount', type: 'DECIMAL', length: '18,2', isPrimary: false, comment: '批复金额' },
    { name: 'approver', type: 'VARCHAR', length: 50, isPrimary: false, comment: '审批人' },
    { name: 'approve_date', type: 'DATE', length: null, isPrimary: false, comment: '审批日期' }
  ],
  t_budget_execution: [
    { name: 'exec_id', type: 'VARCHAR', length: 32, isPrimary: true, comment: '执行流水号' },
    { name: 'approval_id', type: 'VARCHAR', length: 32, isPrimary: false, comment: '关联批复单号' },
    { name: 'dept_code', type: 'VARCHAR', length: 20, isPrimary: false, comment: '部门编码' },
    { name: 'voucher_no', type: 'VARCHAR', length: 50, isPrimary: false, comment: '凭证号' },
    { name: 'payee', type: 'VARCHAR', length: 200, isPrimary: false, comment: '收款方' },
    { name: 'expense_date', type: 'DATE', length: null, isPrimary: false, comment: '支出日期' },
    { name: 'expense_amount', type: 'DECIMAL', length: '18,2', isPrimary: false, comment: '支出金额' },
    { name: 'expense_usage', type: 'VARCHAR', length: 500, isPrimary: false, comment: '支出用途' },
    { name: 'actual_account_code', type: 'VARCHAR', length: 20, isPrimary: false, comment: '实际支出科目' },
    { name: 'has_approval_doc', type: 'INT', length: 1, isPrimary: false, comment: '是否有审批单' }
  ],
  t_budget_adjustment: [
    { name: 'adjust_id', type: 'VARCHAR', length: 32, isPrimary: true, comment: '调整单号' },
    { name: 'dept_code', type: 'VARCHAR', length: 20, isPrimary: false, comment: '部门编码' },
    { name: 'original_approval_id', type: 'VARCHAR', length: 32, isPrimary: false, comment: '原批复单号' },
    { name: 'adjust_type', type: 'VARCHAR', length: 20, isPrimary: false, comment: '调整类型' },
    { name: 'adjust_amount', type: 'DECIMAL', length: '18,2', isPrimary: false, comment: '调整金额' },
    { name: 'adjust_reason', type: 'VARCHAR', length: 500, isPrimary: false, comment: '调整原因' },
    { name: 'approver', type: 'VARCHAR', length: 50, isPrimary: false, comment: '审批机构/人' },
    { name: 'approve_date', type: 'DATE', length: null, isPrimary: false, comment: '审批日期' },
    { name: 'is_compliant', type: 'INT', length: 1, isPrimary: false, comment: '是否合规' }
  ],
  t_budget_idle_funds: [
    { name: 'project_id', type: 'VARCHAR', length: 32, isPrimary: true, comment: '项目编号' },
    { name: 'project_name', type: 'VARCHAR', length: 200, isPrimary: false, comment: '项目名称' },
    { name: 'dept_code', type: 'VARCHAR', length: 20, isPrimary: false, comment: '部门编码' },
    { name: 'budget_amount', type: 'DECIMAL', length: '18,2', isPrimary: false, comment: '预算金额' },
    { name: 'fund_received_date', type: 'DATE', length: null, isPrimary: false, comment: '资金到账日期' },
    { name: 'last_use_date', type: 'DATE', length: null, isPrimary: false, comment: '最后支出日期' },
    { name: 'used_amount', type: 'DECIMAL', length: '18,2', isPrimary: false, comment: '已支出金额' },
    { name: 'idle_days', type: 'INT', length: 11, isPrimary: false, comment: '闲置天数' },
    { name: 'has_explanation: ', type: 'INT', length: 1, isPrimary: false, comment: '是否有书面说明' }
  ]
};

export default function DataStructureDisplay({ onGenerateSql, hideHeader }: DataStructureDisplayProps) {
  const [selectedDsId, setSelectedDsId] = React.useState('ds1');
  const [dsSearchQuery, setDsSearchQuery] = React.useState('');
  const [tableSearchQuery, setTableSearchQuery] = React.useState('');
  const [selectedTables, setSelectedTables] = React.useState<string[]>([]);
  const [viewTableFields, setViewTableFields] = React.useState<string | null>(null);
  const [showDsDropdown, setShowDsDropdown] = React.useState(false);
  const dsDropdownRef = React.useRef<HTMLDivElement>(null);
  const [loadedDsCount, setLoadedDsCount] = React.useState(1);
  const [showAlert, setShowAlert] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dsDropdownRef.current && !dsDropdownRef.current.contains(event.target as Node)) {
        setShowDsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedDs = MOCK_DATA_SOURCES.find(ds => ds.id === selectedDsId);
  
  const filteredDs = MOCK_DATA_SOURCES.filter(ds => 
    ds.name.toLowerCase().includes(dsSearchQuery.toLowerCase()) || 
    ds.type.toLowerCase().includes(dsSearchQuery.toLowerCase())
  );

  const tables = MOCK_TABLES_MAP[selectedDsId] || [];
  const filteredTables = tables.filter(t => 
    t.name.toLowerCase().includes(tableSearchQuery.toLowerCase()) || 
    t.comment.includes(tableSearchQuery)
  );

  const handleDsChange = (id: string) => {
    if (loadedDsCount >= 5 && id !== selectedDsId) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    setSelectedDsId(id);
    setShowDsDropdown(false);
    setSelectedTables([]);
    // In a real app, we'd increment loadedDsCount if it's a new DS being loaded
  };

  const toggleTableSelection = (tableName: string) => {
    setSelectedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName) 
        : [...prev, tableName]
    );
  };

  const generateSql = () => {
    if (selectedTables.length === 0) return;

    const dsType = selectedDs?.type || 'MySQL';
    let sql = '';

    const getLimitClause = (limit: number) => {
      switch (dsType) {
        case 'Oracle': return `FETCH FIRST ${limit} ROWS ONLY`;
        case 'SQLServer': return ''; // SQLServer uses TOP in SELECT
        case 'ShenTong': return `LIMIT ${limit}`;
        default: return `LIMIT ${limit}`;
      }
    };

    const getSelectPrefix = (limit: number) => {
      if (dsType === 'SQLServer') return `SELECT TOP ${limit} `;
      return 'SELECT ';
    };

    if (selectedTables.length === 1) {
      const tableName = selectedTables[0];
      const columns = MOCK_COLUMNS_MAP[tableName] || [];
      const colList = columns.length > 0 ? columns.map(c => c.name).join(', ') : '*';
      
      sql = `${getSelectPrefix(100)}${colList}\nFROM ${tableName}`;
      const limitClause = getLimitClause(100);
      if (limitClause) sql += `\n${limitClause};`;
      else sql += ';';
      
      // Add a comment for auditing context
      sql = `-- 审计查询: ${tableName} 数据预览\n` + sql;
    } else {
      // Multiple tables join logic
      const selectParts: string[] = [];
      const fromParts: string[] = [];
      const joinParts: string[] = [];

      selectedTables.forEach((tableName, idx) => {
        const columns = MOCK_COLUMNS_MAP[tableName] || [];
        const pk = columns.find(c => c.isPrimary)?.name || 'id';
        
        selectParts.push(`${tableName}.*`);
        if (idx === 0) {
          fromParts.push(tableName);
        } else {
          const prevTable = selectedTables[idx - 1];
          const prevPk = (MOCK_COLUMNS_MAP[prevTable] || []).find(c => c.isPrimary)?.name || 'id';
          joinParts.push(`JOIN ${tableName} ON ${tableName}.${pk} = ${prevTable}.${prevPk}`);
        }
      });

      sql = `-- 审计查询: 多表关联分析\n`;
      sql += `${getSelectPrefix(100)}${selectParts.join(', ')}\nFROM ${fromParts.join(', ')}\n${joinParts.join('\n')}`;
      const limitClause = getLimitClause(100);
      if (limitClause) sql += `\n${limitClause};`;
      else sql += ';';
    }

    onGenerateSql(sql);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      {!hideHeader && (
        <div className="px-5 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20 shrink-0 flex flex-col justify-center min-h-[64px]">
          <div className="flex items-center gap-2 mb-2">
             <Database size={16} className="text-gray-400" />
             <h2 className="text-sm font-bold text-gray-900 tracking-tight">数据源</h2>
          </div>
          
          {/* Data Source Selector */}
          <div className="relative" ref={dsDropdownRef}>
            <button 
              onClick={() => setShowDsDropdown(!showDsDropdown)}
              className="w-full h-8 bg-gray-50 border border-gray-200 rounded-lg px-2.5 flex items-center justify-between gap-2 text-xs font-medium text-gray-700 hover:bg-white hover:border-gray-300 transition-all shadow-sm"
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Database size={12} className="text-blue-600 shrink-0" />
                <span className="truncate">{selectedDs?.name}</span>
              </div>
              <ChevronDown size={14} className={cn("text-gray-400 shrink-0 transition-transform", showDsDropdown && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showDsDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 mt-1 w-full min-w-[280px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-2 border-b border-gray-50">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text"
                        value={dsSearchQuery}
                        onChange={(e) => setDsSearchQuery(e.target.value)}
                        placeholder="搜索数据源..."
                        className="w-full h-8 bg-gray-50 border border-gray-100 rounded pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto p-1.5 scrollbar-none">
                    {filteredDs.map(ds => (
                      <button
                        key={ds.id}
                        onClick={() => handleDsChange(ds.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded-lg transition-all text-left mb-0.5 last:mb-0",
                          selectedDsId === ds.id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Database size={14} className={selectedDsId === ds.id ? "text-blue-600" : "text-gray-400"} />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate">{ds.name}</p>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase opacity-50 shrink-0">{ds.type}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Main List */}
        <div className="flex-1 border-r border-gray-100 bg-gray-50/10 flex flex-col min-w-0">
          
          {/* Table Search */}
          <div className="p-4 pb-2 shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                value={tableSearchQuery}
                onChange={(e) => setTableSearchQuery(e.target.value)}
                placeholder="搜索表或视图..."
                className="w-full h-9 bg-white border border-gray-200 shadow-sm rounded-lg pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pt-1 space-y-3">
            {filteredTables.map(table => (
              <div 
                key={table.name}
                onClick={() => toggleTableSelection(table.name)}
                className={cn(
                  "rounded-lg border bg-white p-3 cursor-pointer transition-all hover:border-blue-300 hover:shadow-md group relative",
                  selectedTables.includes(table.name) ? "border-blue-500 shadow-sm ring-1 ring-blue-500/20" : "border-gray-200 shadow-sm"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <input 
                      type="checkbox"
                      checked={selectedTables.includes(table.name)}
                      readOnly
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer pointer-events-none"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-sm font-bold text-gray-900 truncate">{table.name}</span>
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0",
                        table.type === 'TABLE' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      )}>
                        {table.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mb-3">{table.comment}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                        <div className="flex items-center gap-1">
                          <Columns size={12} />
                          <span>{table.columns} 字段</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <List size={12} />
                          <span>{table.rows.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewTableFields(table.name);
                        }}
                        className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 px-2 py-1 rounded transition-colors hidden group-hover:block absolute right-3 bottom-2.5"
                      >
                        查看
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action */}
          <div className="p-4 bg-white border-t border-gray-100 z-10 shrink-0">
            <button 
              onClick={generateSql}
              disabled={selectedTables.length === 0}
              className="w-full h-10 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
            >
              <Code2 size={16} />
              生成基础 SQL
              {selectedTables.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded font-mono text-[10px]">{selectedTables.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Alert Toast */}
      <AnimatePresence>
        {showAlert && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-amber-600 text-white rounded-2xl shadow-2xl"
          >
            <AlertCircle size={20} />
            <span className="font-bold">最多同时加载 5 个数据源，请先切换其他数据源</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Fields Modal */}
      <AnimatePresence>
        {viewTableFields && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setViewTableFields(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Table size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{viewTableFields}</h3>
                    <p className="text-[10px] text-gray-500">
                      {MOCK_TABLES_MAP[selectedDsId]?.find(t => t.name === viewTableFields)?.comment}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewTableFields(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-0 scrollbar-none">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-100 shadow-sm">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">字段名称</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">类型</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">说明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {(MOCK_COLUMNS_MAP[viewTableFields] || []).map((col) => (
                      <tr key={col.name} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-normal text-gray-800">{col.name}</span>
                            {col.isPrimary && <Key size={12} className="text-amber-500 shrink-0" />}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-[11px] font-mono text-gray-500">
                            {col.type}{col.length ? `(${col.length})` : ''}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-xs text-blue-600 font-medium">
                          {col.comment}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
