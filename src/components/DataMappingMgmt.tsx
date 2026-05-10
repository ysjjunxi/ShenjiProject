import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Download, 
  Trash2,
  Database,
  Table,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Filter,
  ChevronRight,
  X,
  History,
  Clock,
  Info,
  Play,
  Save
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './Pagination';

// Mock Data
const MOCK_DATABASES = [
  { id: 'db2', name: '人社局社保基金系统', tablesCount: 150, mappedCount: 20 },
  { id: 'db3', name: '税务局金税三期系统', tablesCount: 300, mappedCount: 300 },
  { id: 'db1', name: '财政局财务一体化系统', tablesCount: 120, mappedCount: 85 },
].sort((a, b) => a.name.localeCompare(b.name));

const MOCK_MAPPING_DATA = [
  {
    id: 'm1',
    dbId: 'db1',
    dbName: '财政局财务一体化系统',
    sourceTable: 'fin_voucher_detail',
    sourceField: 'vchr_amt',
    targetDb: '系统生产标准库',
    targetTable: 'std_finance_voucher',
    targetField: 'amount',
    targetFieldCn: '金额',
    matched: true,
    confidence: 0.98,
    status: '生效',
    matchDesc: '完全匹配',
    unmatchedSampleData: '12500.50, 480.00'
  },
  {
    id: 'm2',
    dbId: 'db1',
    dbName: '财政局财务一体化系统',
    sourceTable: 'fin_voucher_detail',
    sourceField: 'vchr_dt',
    targetDb: '系统生产标准库',
    targetTable: 'std_finance_voucher',
    targetField: 'voucher_date',
    targetFieldCn: '凭证日期',
    matched: true,
    confidence: 0.95,
    status: '生效',
    matchDesc: '语义匹配',
    unmatchedSampleData: '2023-12-01, 2024/01/15'
  },
  {
    id: 'm3',
    dbId: 'db1',
    dbName: '财政局财务一体化系统',
    sourceTable: 'fin_budg_item',
    sourceField: 'chk_stat',
    targetDb: '系统生产标准库',
    targetTable: 'std_budget',
    targetField: 'status',
    targetFieldCn: '状态',
    matched: true,
    confidence: 0.82,
    status: '草稿',
    matchDesc: '依赖上下文',
    unmatchedSampleData: '0, 1, 2 (编码需映射)'
  },
  {
    id: 'm5',
    dbId: 'db1',
    dbName: '财政局财务一体化系统',
    sourceTable: 'fin_budg_item',
    sourceField: 'budg_stat',
    targetDb: '系统生产标准库',
    targetTable: 'std_budget',
    targetField: 'status', // mapped to the same target field as above
    targetFieldCn: '状态',
    matched: true,
    confidence: 0.88,
    status: '草稿',
    matchDesc: '语义匹配',
    unmatchedSampleData: 'ACTIVE, PENDING'
  },
  {
    id: 'm4',
    dbId: 'db2',
    dbName: '人社局社保基金系统',
    sourceTable: 'ins_person_info',
    sourceField: 'id_no',
    targetDb: '系统生产标准库',
    targetTable: 'std_person',
    targetField: 'id_card',
    targetFieldCn: '身份证号',
    matched: true,
    confidence: 0.99,
    status: '生效',
    matchDesc: '-',
    unmatchedSampleData: '33010219***, 33021019***'
  },
  {
    id: 'm_unmap_1',
    dbId: 'db1',
    dbName: '无',
    sourceTable: '无',
    sourceField: '无',
    targetDb: '系统生产标准库',
    targetTable: 'std_finance_voucher',
    targetField: 'voucher_no',
    targetFieldCn: '凭证编号',
    matched: false,
    confidence: 0,
    status: '未映射',
    matchDesc: '-',
    unmatchedSampleData: 'VCR2024001, VCR2024002'
  },
  {
    id: 'm_unmap_2',
    dbId: 'db1',
    dbName: '无',
    sourceTable: '无',
    sourceField: '无',
    targetDb: '系统生产标准库',
    targetTable: 'std_budget',
    targetField: 'budget_dept',
    targetFieldCn: '预算部门',
    matched: false,
    confidence: 0,
    status: '未映射',
    matchDesc: '-',
    unmatchedSampleData: '教育局, 财政局'
  },
  {
    id: 'm_unmap_3',
    dbId: 'db1',
    dbName: '无',
    sourceTable: '无',
    sourceField: '无',
    targetDb: '系统生产标准库',
    targetTable: 'std_finance_voucher',
    targetField: 'amount_type',
    targetFieldCn: '金额类型',
    matched: false,
    confidence: 0,
    status: '未映射',
    matchDesc: '-',
    unmatchedSampleData: '借方, 贷方'
  },
  {
    id: 'm6',
    dbId: 'db3',
    dbName: '税务局金税三期系统',
    sourceTable: 'tax_invoice_main',
    sourceField: 'inv_code',
    targetDb: '系统生产标准库',
    targetTable: 'std_tax_invoice',
    targetField: 'invoice_code',
    targetFieldCn: '发票代码',
    matched: true,
    confidence: 0.98,
    status: '生效',
    matchDesc: '完全匹配',
    unmatchedSampleData: '1100234567, 1100234568'
  },
  {
    id: 'm7',
    dbId: 'db3',
    dbName: '税务局金税三期系统',
    sourceTable: 'tax_invoice_main',
    sourceField: 'inv_no',
    targetDb: '系统生产标准库',
    targetTable: 'std_tax_invoice',
    targetField: 'invoice_number',
    targetFieldCn: '发票号码',
    matched: true,
    confidence: 0.99,
    status: '生效',
    matchDesc: '语义匹配',
    unmatchedSampleData: '00123456, 00123457'
  },
  {
    id: 'm_unmap_db3',
    dbId: 'db3',
    dbName: '无',
    sourceTable: '无',
    sourceField: '无',
    targetDb: '系统生产标准库',
    targetTable: 'std_tax_invoice',
    targetField: 'tax_period',
    targetFieldCn: '税款所属期',
    matched: false,
    confidence: 0,
    status: '未映射',
    matchDesc: '-',
    unmatchedSampleData: '202312, 202401'
  }
];

const MOCK_HISTORY = [
  {
    id: 'h1',
    time: '2026-04-28 14:30:00',
    dbName: '财政局财务一体化系统',
    user: 'system',
    details: '提交了 3 个字段的映射关系 (vchr_amt, vchr_dt, chk_stat)'
  }
];

const TABLE_DESCS: Record<string, string> = {
  'std_finance_voucher': '包含财务凭证主信息及明细数据规范',
  'std_budget': '包含各预算单位的项目、指标及执行数据规范',
  'std_person': '包含人员基础属性及关联身份信息规范',
  'std_tax_invoice': '包含税务系统发票全量业务字段规范'
};

export default function DataMappingMgmt() {
  const [selectedDb, setSelectedDb] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableFilter, setTableFilter] = useState('all');
  const [mappingData, setMappingData] = useState(MOCK_MAPPING_DATA);
  const [databases, setDatabases] = useState(MOCK_DATABASES);
  const [isAiMapping, setIsAiMapping] = useState(false);
  const [mappingProgress, setMappingProgress] = useState<Record<string, number>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState(MOCK_HISTORY);
  const [showManualMapModal, setShowManualMapModal] = useState<string | null>(null);
  const [manualMapQuery, setManualMapQuery] = useState('');
  const [manualDb, setManualDb] = useState('');
  const [manualTable, setManualTable] = useState('');
  const [manualField, setManualField] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);
  const [testScript, setTestScript] = useState("SELECT\n  source.id_no,\n  source.name\nFROM \n  ins_person_info source\nLIMIT 10;");
  const [testResult, setTestResult] = useState<any[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset to first page when filtering or selecting database
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, tableFilter, selectedDb]);

  const handleManualMapSubmit = () => {
    if (!showManualMapModal) return;
    
    setMappingData(prev => prev.map(m => {
      if (m.id === showManualMapModal) {
        const dbName = databases.find(d => d.id === manualDb)?.name || manualDb || '已选择库';
        return {
          ...m,
          dbName: dbName,
          sourceTable: manualTable || '已选择表',
          sourceField: manualField || '已选择字段',
          status: '草稿',
          matched: true,
          confidence: 1.0,
          matchDesc: '手动映射',
          dbId: selectedDb || m.dbId,
          unmatchedSampleData: 'MAPPED_SAMPLE_1, MAPPED_SAMPLE_2'
        };
      }
      return m;
    }));
    setShowManualMapModal(null);
  };

  const handleAiMapDb = () => {
    setIsAiMapping(true);
    // Simulate mapping all or selected
    let dbToMap = selectedDb;
    if (!dbToMap) dbToMap = 'db1';
    
    setMappingProgress(prev => ({ ...prev, [dbToMap as string]: 0 }));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress > 100) {
        clearInterval(interval);
        setDatabases(prev => prev.map(db => 
          db.id === dbToMap ? { ...db, mappedCount: db.tablesCount } : db
        ));
        
        // Add some draft mapping data automatically
        const newDbInfo = databases.find(d => d.id === dbToMap);
        if (newDbInfo && !mappingData.some(m => m.dbId === dbToMap)) {
          setMappingData(prev => [
            {
              id: `m_ai_${Date.now()}`,
              dbId: dbToMap as string,
              dbName: newDbInfo.name,
              sourceTable: 'auto_gen_table',
              sourceField: 'auto_gen_field',
              targetDb: '系统生产标准库',
              targetTable: 'std_auto_target',
              targetField: 'mapped_field',
              targetFieldCn: '机器映射字段',
              matched: true,
              confidence: 0.85,
              status: '草稿',
              matchDesc: 'AI 语义映射',
              unmatchedSampleData: 'SAMPLE_DATA_1, SAMPLE_DATA_2'
            },
            ...prev
          ]);
        }
        
        setIsAiMapping(false);
      } else {
        setMappingProgress(prev => ({ ...prev, [dbToMap as string]: progress }));
      }
    }, 300);
  };

  const handleSubmit = () => {
    if (!selectedDb) return;
    const drafted = mappingData.filter(m => m.dbId === selectedDb && m.status === '草稿');
    if (drafted.length > 0) {
      const now = new Date();
      const newHistory = {
        id: `h${Date.now()}`,
        time: now.toLocaleString('zh-CN'),
        dbName: databases.find(d => d.id === selectedDb)?.name || '',
        user: 'system',
        details: `提交了 ${drafted.length} 个字段的映射关系`
      };
      setHistoryData([newHistory, ...historyData]);
    }
    
    setMappingData(prev => prev.map(m => 
      m.dbId === selectedDb && m.status === '草稿' ? { ...m, status: '生效' } : m
    ));
    // Simulate immediate submit
  };

  const handleManualSync = () => {
    if (!selectedDb) return;
    const hasEffective = mappingData.some(m => m.dbId === selectedDb && m.status === '生效');
    if (!hasEffective) {
      alert("当前库未配置映射或映射未生效，不允许数据同步。");
      return;
    }
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("手动同步完成");
    }, 2500);
  };

  const handleClearAll = () => {
    if (!selectedDb) return;
    setShowConfirmClear(true);
  };

  const confirmClearAll = () => {
    setMappingData(prev => prev.filter(m => m.dbId !== selectedDb));
    setShowConfirmClear(false);
  };

  const handleDeleteMapping = (id: string) => {
    setShowConfirmDelete(id);
  };

  const confirmDelete = () => {
    if (showConfirmDelete) {
      setMappingData(prev => prev.filter(m => m.id !== showConfirmDelete));
      setShowConfirmDelete(null);
    }
  };

  const activeDbInfo = databases.find(db => db.id === selectedDb);

  const filteredData = mappingData.filter(item => {
    if (item.dbId !== selectedDb) return false;
    if (tableFilter !== 'all') {
      if (item.targetTable !== tableFilter) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.sourceTable.toLowerCase().includes(q) || 
             item.targetTable?.toLowerCase().includes(q) ||
             item.sourceField.toLowerCase().includes(q) ||
             item.targetField?.toLowerCase().includes(q);
    }
    return true;
  });

  // Group by standard field
  const groupedData = Object.values(filteredData.reduce((acc, curr) => {
    const key = `${curr.targetTable}-${curr.targetField}`;
    if (!acc[key]) {
      acc[key] = {
        targetTable: curr.targetTable,
        targetField: curr.targetField,
        targetFieldCn: curr.targetFieldCn,
        targetDb: curr.targetDb,
        targetTableDesc: TABLE_DESCS[curr.targetTable] || '包含系统数据标准规范要求',
        sources: []
      };
    }
    acc[key].sources.push(curr);
    return acc;
  }, {} as Record<string, any>));

  const totalPages = Math.ceil(groupedData.length / pageSize);
  const paginatedGroups = groupedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const uniqueStandardTables = Array.from(new Set(mappingData.filter(m => m.dbId === selectedDb).map(m => m.targetTable))).filter(Boolean);

  return (
    <div className="flex w-full h-full bg-[#F9FAFB] overflow-hidden">
      {/* Left Sidebar: Database List */}
      <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-sm font-normal text-gray-900 tracking-tight">数据库列表</h2>
          <button 
            onClick={handleAiMapDb}
            disabled={isAiMapping}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 rounded-lg hover:bg-purple-100 transition-all text-xs font-bold shadow-sm disabled:opacity-50 disabled:shadow-none"
          >
            <Sparkles size={14} className={isAiMapping ? "animate-pulse" : ""} />
            <span>按库 AI 映射</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {databases.map(db => {
            const mappedCount = db.mappedCount;
            const percentage = mappingProgress[db.id] !== undefined ? mappingProgress[db.id] : Math.round((mappedCount / db.tablesCount) * 100);
            const isSelected = selectedDb === db.id;
            const isMapping = mappingProgress[db.id] !== undefined && mappingProgress[db.id] < 100;
            const canSelect = percentage === 100; // 只有映射完成的库才可以点击
            
            return (
              <button
                key={db.id}
                onClick={() => canSelect && setSelectedDb(db.id)}
                disabled={!canSelect && !isMapping}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden group",
                  isSelected 
                    ? "bg-blue-50/50 border-blue-200 shadow-sm ring-1 ring-blue-500/10" 
                    : canSelect ? "bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm cursor-pointer" : "bg-gray-50/50 border-gray-100 opacity-70 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                  )}>
                    <Database size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "text-xs font-bold truncate mb-1.5",
                      isSelected ? "text-blue-900" : "text-gray-900"
                    )}>{db.name}</h3>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className={cn("font-medium", isMapping ? "text-purple-600" : "text-gray-500")}>
                          {isMapping ? 'AI 映射中...' : `进度 ${percentage}%`}
                        </span>
                        {!isMapping && (
                          <span className="text-gray-400 font-mono">
                            {percentage === 100 ? db.tablesCount : mappedCount} <span className="text-gray-300">/ {db.tablesCount}</span>
                          </span>
                        )}
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            isMapping ? "bg-purple-500" : percentage === 100 ? "bg-green-500" : "bg-blue-500"
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Validation Button */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={() => setShowTestModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-sm active:scale-95"
          >
            <Play size={16} />
            测试验证
          </button>
        </div>
      </div>

      {/* Right Content: Mapping Fields */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {selectedDb ? (
          <>
            <div className="px-6 h-[72px] border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div>
                <h2 className="text-lg font-normal text-gray-900 tracking-tight flex items-center gap-2">
                  <span>{activeDbInfo?.name}</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-widest">字段映射</span>
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => setShowHistory(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-xs font-bold shadow-sm"
                >
                  <History size={14} />
                  <span>提交历史</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 flex flex-col space-y-4">
              {showGuide && (
                <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-100/50 flex items-start gap-2.5 shadow-sm shrink-0">
                  <Sparkles size={16} className="text-purple-500 mt-0.5 shrink-0" />
                  <div className="text-xs text-purple-900 space-y-1 flex-1">
                    <p className="font-bold tracking-wide">按库 AI 映射模式</p>
                    <p className="text-purple-700/80 leading-relaxed font-medium">
                      自动进行语义级字段映射匹配。映射支持手动干预进行编辑替换、删除，并需要通过上方“提交生效”后才可用于数据同步以及数据分析场景下流转使用。
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowGuide(false)}
                    className="p-1 hover:bg-purple-100/50 rounded text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Filters */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="relative">
                  <select 
                    value={tableFilter}
                    onChange={(e) => setTableFilter(e.target.value)}
                    className="h-9 bg-white border border-gray-200 rounded-lg pl-3 pr-8 text-xs font-bold text-gray-700 hover:border-blue-200 focus:ring-2 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer min-w-[120px] shadow-sm"
                  >
                    <option value="all">全部分类 (标准表)</option>
                    {uniqueStandardTables.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter size={12} className="text-gray-400" />
                  </div>
                </div>

                <div className="relative flex-1 max-w-md group">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索源表、源字段、标准表、标准字段..."
                    className="w-full h-9 bg-white border border-gray-200 rounded-lg pl-8 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              {/* Mapping Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 shrink-0">
                <div className="overflow-x-auto h-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100 sticky top-0 z-10">
                        <th className="px-4 py-3 text-xs font-normal text-gray-500 uppercase tracking-widest min-w-[200px] bg-gray-50/80 backdrop-blur-sm">标准表 (所属库)</th>
                        <th className="px-4 py-3 text-xs font-normal text-gray-500 uppercase tracking-widest min-w-[180px] bg-gray-50/80 backdrop-blur-sm">标准字段 (字段名 / 中文)</th>
                        <th className="px-4 py-3 text-xs font-normal text-gray-500 uppercase tracking-widest min-w-[150px] bg-gray-50/80 backdrop-blur-sm">源数据库</th>
                        <th className="px-4 py-3 text-xs font-normal text-gray-500 uppercase tracking-widest min-w-[150px] bg-gray-50/80 backdrop-blur-sm">源表</th>
                        <th className="px-4 py-3 text-xs font-normal text-gray-500 uppercase tracking-widest min-w-[120px] bg-gray-50/80 backdrop-blur-sm">源字段</th>
                        <th className="px-4 py-3 text-xs font-normal text-gray-500 uppercase tracking-widest text-center bg-gray-50/80 backdrop-blur-sm">置信度</th>
                        <th className="px-4 py-3 text-xs font-normal text-gray-500 uppercase tracking-widest text-center bg-gray-50/80 backdrop-blur-sm">状态</th>
                        <th className="px-4 py-3 text-xs font-normal text-gray-500 uppercase tracking-widest text-right bg-gray-50/80 backdrop-blur-sm">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedGroups.length > 0 ? paginatedGroups.map((group, groupIdx) => {
                        return group.sources.map((item: any, itemIdx: number) => {
                          const isFirstRow = itemIdx === 0;
                          return (
                            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group/row">
                              {/* Grouped standard columns */}
                              {isFirstRow && (
                                <>
                                  <td className="px-4 py-3 bg-gray-50/30" rowSpan={group.sources.length}>
                                    <div className="flex flex-col gap-1.5">
                                      <div className="flex items-center gap-1.5 text-blue-700 font-normal text-sm relative group/tooltip">
                                        <Table size={14} className="text-blue-400" />
                                        <span>{group.targetTable || '-'}</span>
                                        {group.targetTableDesc && (
                                          <div className="flex items-center">
                                            <Info size={14} className="text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 border border-gray-100 bg-white shadow-lg text-gray-600 font-medium text-xs rounded py-1.5 px-2.5 w-max max-w-[200px] opacity-0 group-hover/tooltip:opacity-100 pointer-events-none z-50 transition-all scale-95 group-hover/tooltip:scale-100 origin-bottom">
                                              {group.targetTableDesc}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Database size={12} className="text-gray-400" />
                                        <span>{group.targetDb || '-'}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 bg-gray-50/30" rowSpan={group.sources.length}>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-sm text-blue-600 font-mono font-medium">{group.targetField || '-'}</span>
                                      <span className="text-xs text-gray-500">{group.targetFieldCn || '-'}</span>
                                    </div>
                                  </td>
                                </>
                              )}
                              
                              {/* Source columns */}
                              <td className="px-4 py-3">
                                <span className={cn("text-sm font-normal", item.dbName === '无' ? "text-gray-400 italic" : "text-gray-700")}>{item.dbName}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={cn("text-sm font-medium", item.sourceTable === '无' ? "text-gray-400 italic" : "text-gray-700")}>{item.sourceTable}</span>
                              </td>
                              <td className="px-4 py-3">
                                {item.sourceField === '无' ? (
                                  <span className="text-sm font-medium text-gray-400 italic">无</span>
                                ) : (
                                  <div className="inline-block px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-sm text-gray-600 font-mono">
                                    {item.sourceField}
                                  </div>
                                )}
                              </td>
                              
                              {/* Status columns */}
                              <td className="px-4 py-3 text-center">
                                {item.matched ? (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <span className={cn(
                                      "text-xs font-bold px-1.5 py-0.5 rounded border",
                                      (item.confidence || 0) > 0.9 ? "bg-green-50 text-green-700 border-green-100" :
                                      (item.confidence || 0) > 0.7 ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                                      "bg-red-50 text-red-700 border-red-100"
                                    )}>
                                      {Math.round((item.confidence || 0) * 100)}%
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {item.status === '生效' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                                    <CheckCircle2 size={12} />
                                    生效
                                  </span>
                                )}
                                {item.status === '草稿' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 text-xs font-bold border border-yellow-100">
                                    <AlertCircle size={12} />
                                    草稿
                                  </span>
                                )}
                                {item.status === '未映射' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 text-gray-500 text-xs font-bold border border-gray-100">
                                    未映射
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {item.status === '未映射' ? (
                                    <button 
                                      onClick={() => setShowManualMapModal(item.id)}
                                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline px-1 transition-colors"
                                    >
                                      手动映射
                                    </button>
                                  ) : (
                                    <>
                                      <button 
                                        onClick={() => setShowManualMapModal(item.id)}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline px-1 transition-colors"
                                      >
                                        重新匹配
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteMapping(item.id)}
                                        className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline px-1 transition-colors"
                                      >
                                        删除
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      }) : (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                            <Database size={24} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-xs">暂无映射数据</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={groupedData.length}
                pageSize={pageSize}
                className="mt-0"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-white border border-gray-200 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database size={24} className="text-blue-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">请选择数据库</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                在左侧列表中选择一个数据库，右侧将呈现该数据源下所有表和字段的与标准库映射详情进行配置及编辑。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Clear Modal */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 text-red-600">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">清空确认</h3>
                    <p className="text-xs text-gray-500 mt-0.5">此操作不可逆转</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 pl-[52px]">
                  是否确认清空当前库 <span className="font-bold text-gray-900">"{activeDbInfo?.name}"</span> 的全部映射关系？
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowConfirmClear(false)}
                    className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 shadow-sm"
                  >
                    取消
                  </button>
                  <button 
                    onClick={confirmClearAll}
                    className="px-4 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors shadow-md shadow-red-500/20"
                  >
                    确认清空
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Mapping Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 text-red-600">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">确认删除</h3>
                    <p className="text-xs text-gray-500 mt-0.5">即将移除该条映射</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 pl-[52px]">
                  是否确认删除这条字段映射关系？删除后源字段将恢复为未映射状态。
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowConfirmDelete(null)}
                    className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 shadow-sm"
                  >
                    取消
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors shadow-md shadow-red-500/20"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col pt-16 md:pt-0"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <History className="text-blue-500" size={20} />
                  <h3 className="text-base font-bold text-gray-900">提交历史记录</h3>
                </div>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {historyData.length > 0 ? (
                  <div className="relative border-l border-gray-200 ml-3 space-y-6 before:absolute before:inset-y-0 before:-left-[0.5px]">
                    {historyData.map((item, idx) => (
                      <div key={item.id} className="relative pl-6">
                        {/* Timeline dot */}
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white shadow-sm" />
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">{item.dbName}</span>
                            <div className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                              <Clock size={12} />
                              {item.time}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                            {item.details}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-700 font-bold">
                              {item.user.substring(0, 1).toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">操作人: {item.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                    <History size={32} className="text-gray-300" />
                    <p className="text-sm font-medium">暂无提交历史记录</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Map Modal */}
      <AnimatePresence>
        {showManualMapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Database className="text-blue-500" size={20} />
                  <h3 className="text-base font-bold text-gray-900">手动指定映射字段</h3>
                </div>
                <button 
                  onClick={() => setShowManualMapModal(null)}
                  className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4 overflow-y-auto">
                <p className="text-xs text-gray-500 mb-2">请在下方搜索并选择业务数据库、表及对应的源字段。</p>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">关键字搜索</label>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text"
                        value={manualMapQuery}
                        onChange={(e) => setManualMapQuery(e.target.value)}
                        placeholder="搜索库名、表名或字段名..."
                        className="w-full h-9 bg-white border border-gray-200 rounded-lg pl-8 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">选择业务数据库</label>
                    <select 
                      value={manualDb}
                      onChange={(e) => setManualDb(e.target.value)}
                      className="h-9 w-full bg-white border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 transition-all font-medium text-gray-700"
                    >
                      <option value="">请选择数据库</option>
                      {databases.map(db => (
                        <option key={db.id} value={db.id}>{db.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">选择业务表</label>
                    <select 
                      value={manualTable}
                      onChange={(e) => setManualTable(e.target.value)}
                      className="h-9 w-full bg-white border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 transition-all font-medium text-gray-700"
                    >
                      <option value="">请选择业务表</option>
                      <option value="table1">table_1</option>
                      <option value="table2">table_2</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">选择源字段</label>
                    <select 
                      value={manualField}
                      onChange={(e) => setManualField(e.target.value)}
                      className="h-9 w-full bg-white border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 transition-all font-medium text-gray-700"
                    >
                      <option value="">请选择源字段</option>
                      <option value="field1">field_1</option>
                      <option value="field2">field_2</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setShowManualMapModal(null)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 shadow-sm bg-white"
                >
                  取消
                </button>
                <button 
                  onClick={handleManualMapSubmit}
                  className="px-4 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-md shadow-blue-500/20"
                >
                  确认映射
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Validation Drawer */}
      <AnimatePresence>
        {showTestModal && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTestModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Play className="text-blue-500" size={20} />
                  <h3 className="text-base font-bold text-gray-900">数据映射测试验证</h3>
                </div>
                <button 
                  onClick={() => setShowTestModal(false)}
                  className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-4 shrink-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-700">标准库类型</label>
                      <select className="h-9 w-full bg-white border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 transition-all font-medium text-gray-700">
                        <option>系统生产标准库</option>
                        <option>离线数仓标准库</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-700">选择业务表关联</label>
                      <select className="h-9 w-full bg-white border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 transition-all font-medium text-gray-700">
                        <option>人社局社保基金系统 - ins_person_info</option>
                        <option>财政局财务一体化系统 - fin_voucher_detail</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 shrink-0">
                   <div className="flex items-center justify-between">
                     <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                       <Database size={16} className="text-blue-600" />
                       查询脚本 (测试只取前10条)
                     </label>
                     <div className="flex gap-2">
                       <button
                         onClick={() => alert("脚本已保存")}
                         className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded shadow-sm transition-all"
                       >
                         <Save size={14} /> 保存脚本
                       </button>
                       <button
                         onClick={() => {
                           setTestResult([
                             { id_no: '33010219900101XXXX', name: '王大锤', age: 34, status: '正常参保' },
                             { id_no: '33010619850505XXXX', name: '李翠花', age: 39, status: '停保' },
                             { id_no: '33018219920808XXXX', name: '张三丰', age: 32, status: '正常参保' }
                           ])
                         }}
                         className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm transition-all"
                       >
                         <Play size={14} /> 执行
                       </button>
                     </div>
                   </div>
                   <textarea
                     className="w-full h-40 bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none shadow-inner"
                     value={testScript}
                     onChange={(e) => setTestScript(e.target.value)}
                   />
                </div>

                <div className="flex-1 flex flex-col gap-3 min-h-0">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Table size={16} className="text-purple-600" />
                    验证结果
                  </label>
                  <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col min-h-[200px]">
                    {testResult ? (
                      <div className="overflow-auto flex-1 p-0">
                         <table className="w-full text-left text-sm whitespace-nowrap">
                           <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                             <tr>
                               {Object.keys(testResult[0]).map(k => (
                                 <th key={k} className="px-4 py-2 font-bold text-gray-600">{k}</th>
                               ))}
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                             {testResult.map((row, i) => (
                               <tr key={i} className="hover:bg-blue-50/30">
                                 {Object.values(row).map((val: any, vi) => (
                                   <td key={vi} className="px-4 py-2 text-gray-700 min-w-[100px]">{val}</td>
                                 ))}
                               </tr>
                             ))}
                           </tbody>
                         </table>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <Database size={32} className="mb-2 text-gray-300" />
                        <span className="text-sm">点击执行以查看测试结果</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

