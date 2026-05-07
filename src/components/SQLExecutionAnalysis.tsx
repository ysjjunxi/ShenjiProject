import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Settings2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Search,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  MoreHorizontal,
  X,
  Check,
  Info,
  Database,
  Terminal,
  Clock,
  Layers
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SQLExecutionAnalysisProps {
  sql: string;
  dataSourceName?: string;
  onBackToEditor: () => void;
  hideHeader?: boolean;
}

interface ColumnConfig {
  key: string;
  label: string;
  isPrimaryKey: boolean;
  visible: boolean;
}

const TABLE_CONFIGS: Record<string, { columns: ColumnConfig[], data: any[] }> = {
  t_budget_approval: {
    columns: [
      { key: 'approval_id', label: '批复单号', isPrimaryKey: true, visible: true },
      { key: 'dept_code', label: '部门编码', isPrimaryKey: false, visible: true },
      { key: 'dept_name', label: '部门名称', isPrimaryKey: false, visible: true },
      { key: 'budget_year', label: '预算年度', isPrimaryKey: false, visible: true },
      { key: 'account_code', label: '科目编码', isPrimaryKey: false, visible: true },
      { key: 'account_name', label: '科目名称', isPrimaryKey: false, visible: true },
      { key: 'approved_amount', label: '批复金额', isPrimaryKey: false, visible: true },
      { key: 'approver', label: '审批人', isPrimaryKey: false, visible: true },
      { key: 'approve_date', label: '审批日期', isPrimaryKey: false, visible: true },
    ],
    data: [
      { approval_id: 'YS2025-001-01', dept_code: '301001', dept_name: 'xxx县农业农村局', budget_year: 2025, account_code: '2130101', account_name: '行政运行', approved_amount: '4850000.00', approver: '财政局预算股', approve_date: '2025-01-18' },
      { approval_id: 'YS2025-001-02', dept_code: '301001', dept_name: 'xxx县农业农村局', budget_year: 2025, account_code: '2130153', account_name: '农产品质量安全', approved_amount: '18200000.00', approver: '财政局预算股', approve_date: '2025-01-18' },
      { approval_id: 'YS2025-001-03', dept_code: '301001', dept_name: 'xxx县农业农村局', budget_year: 2025, account_code: '2130599', account_name: '其他巩固脱贫衔接乡村振兴支出', approved_amount: '23500000.00', approver: '财政局预算股', approve_date: '2025-01-18' },
      { approval_id: 'YS2025-002-01', dept_code: '302001', dept_name: 'xxx县教育局', budget_year: 2025, account_code: '2050202', account_name: '小学教育', approved_amount: '42800000.00', approver: '财政局预算股', approve_date: '2025-01-18' },
      { approval_id: 'YS2025-002-02', dept_code: '302001', dept_name: 'xxx县教育局', budget_year: 2025, account_code: '2050203', account_name: '初中教育', approved_amount: '31500000.00', approver: '财政局预算股', approve_date: '2025-01-18' },
      { approval_id: 'YS2025-002-03', dept_code: '302001', dept_name: 'xxx县教育局', budget_year: 2025, account_code: '2050299', account_name: '其他普通教育支出', approved_amount: '6200000.00', approver: '财政局预算股', approve_date: '2025-01-18' },
      { approval_id: 'YS2025-003-01', dept_code: '303001', dept_name: 'xxx县卫生健康局', budget_year: 2025, account_code: '2100301', account_name: '综合医院', approved_amount: '8600000.00', approver: '财政局预算股', approve_date: '2025-01-20' },
      { approval_id: 'YS2025-003-02', dept_code: '303001', dept_name: 'xxx县卫生健康局', budget_year: 2025, account_code: '2100408', account_name: '基本公共卫生服务', approved_amount: '12400000.00', approver: '财政局预算股', approve_date: '2025-01-20' },
      { approval_id: 'YS2025-004-01', dept_code: '304001', dept_name: 'xxx县交通运输局', budget_year: 2025, account_code: '2140104', account_name: '公路建设', approved_amount: '35000000.00', approver: '财政局预算股', approve_date: '2025-01-21' },
      { approval_id: 'YS2025-004-02', dept_code: '304001', dept_name: 'xxx县交通运输局', budget_year: 2025, account_code: '2140106', account_name: '公路养护', approved_amount: '9500000.00', approver: '财政局预算股', approve_date: '2025-01-21' },
      { approval_id: 'YS2025-004-03', dept_code: '304001', dept_name: 'xxx县交通运输局', budget_year: 2025, account_code: '2140199', account_name: '其他公路水路运输支出', approved_amount: '3200000.00', approver: '财政局预算股', approve_date: '2025-01-21' },
      { approval_id: 'YS2025-001-04', dept_code: '301001', dept_name: 'xxx县农业农村局', budget_year: 2025, account_code: '2130504', account_name: '农村基础设施建设', approved_amount: '7800000.00', approver: '财政局预算股', approve_date: '2025-01-18' }
    ]
  },
  t_budget_execution: {
    columns: [
      { key: 'exec_id', label: '执行流水号', isPrimaryKey: true, visible: true },
      { key: 'approval_id', label: '关联批复单号', isPrimaryKey: false, visible: true },
      { key: 'dept_code', label: '部门编码', isPrimaryKey: false, visible: true },
      { key: 'voucher_no', label: '凭证号', isPrimaryKey: false, visible: true },
      { key: 'payee', label: '收款方', isPrimaryKey: false, visible: true },
      { key: 'expense_date', label: '支出日期', isPrimaryKey: false, visible: true },
      { key: 'expense_amount', label: '支出金额', isPrimaryKey: false, visible: true },
      { key: 'expense_usage', label: '支出用途', isPrimaryKey: false, visible: true },
      { key: 'actual_account_code', label: '实际支出科目', isPrimaryKey: false, visible: true },
      { key: 'has_approval_doc', label: '是否有审批单', isPrimaryKey: false, visible: true },
    ],
    data: [
      { exec_id: 'EX2501012', approval_id: 'YS2025-001-01', dept_code: '301001', voucher_no: 'JZ-2025-01-021', payee: 'xxx县环球加油站', expense_date: '2025-01-22', expense_amount: '4500.00', expense_usage: '公务用车充值卡充值', actual_account_code: '2130101', has_approval_doc: '是' },
      { exec_id: 'EX2501035', approval_id: 'YS2025-001-02', dept_code: '301001', voucher_no: 'JZ-2025-01-088', payee: 'xxx县水利工程公司', expense_date: '2025-01-28', expense_amount: '1200000.00', expense_usage: '2024年高标准农田项目进度款', actual_account_code: '2130153', has_approval_doc: '是' },
      { exec_id: 'EX2502076', approval_id: 'YS2025-001-03', dept_code: '301001', voucher_no: 'JZ-2025-02-103', payee: '各乡镇人民政府财政所', expense_date: '2025-02-15', expense_amount: '2800000.00', expense_usage: '脱贫人口产业奖补资金', actual_account_code: '2130599', has_approval_doc: '是' },
      { exec_id: 'EX2503112', approval_id: 'YS2025-001-03', dept_code: '301001', voucher_no: 'JZ-2025-03-045', payee: 'xxx县晨曦职业培训学校', expense_date: '2025-03-10', expense_amount: '185000.00', expense_usage: '脱贫劳动力技能培训费', actual_account_code: '2130599', has_approval_doc: '是' },
      { exec_id: 'EX2504220', approval_id: 'YS2025-001-01', dept_code: '301001', voucher_no: 'JZ-2025-04-032', payee: 'xxx县恒印印刷厂', expense_date: '2025-04-12', expense_amount: '28500.00', expense_usage: '印刷费-政策宣传手册', actual_account_code: '2130101', has_approval_doc: '否' },
      { exec_id: 'EX2505187', approval_id: 'YS2025-002-01', dept_code: '302001', voucher_no: 'JZ-2025-05-022', payee: 'xxx县第一小学', expense_date: '2025-05-08', expense_amount: '650000.00', expense_usage: '公用经费拨付-生均经费', actual_account_code: '2050202', has_approval_doc: '是' },
      { exec_id: 'EX2505190', approval_id: 'YS2025-002-02', dept_code: '302001', voucher_no: 'JZ-2025-05-025', payee: 'xxx县第二中学', expense_date: '2025-05-08', expense_amount: '480000.00', expense_usage: '公用经费拨付-生均经费', actual_account_code: '2050203', has_approval_doc: '是' },
      { exec_id: 'EX2505223', approval_id: 'YS2025-002-03', dept_code: '302001', voucher_no: 'JZ-2025-05-089', payee: 'xxx县建工装饰公司', expense_date: '2025-05-20', expense_amount: '850000.00', expense_usage: '局机关办公楼外墙维修', actual_account_code: '2050299', has_approval_doc: '是' },
      { exec_id: 'EX2506034', approval_id: 'YS2025-001-02', dept_code: '301001', voucher_no: 'JZ-2025-06-012', payee: 'xxx县农业农村局（往来款）', expense_date: '2025-06-05', expense_amount: '45000.00', expense_usage: '支付农产品质量抽检费', actual_account_code: '2130153', has_approval_doc: '是' },
      { exec_id: 'EX2506155', approval_id: 'NULL', dept_code: '301001', voucher_no: 'JZ-2025-06-067', payee: 'xxx县盛世大酒店', expense_date: '2025-06-18', expense_amount: '12800.00', expense_usage: '上级调研接待餐费', actual_account_code: '2130101', has_approval_doc: '否' },
      { exec_id: 'EX2507012', approval_id: 'YS2025-004-01', dept_code: '304001', voucher_no: 'JZ-2025-07-005', payee: 'xxx县路桥公司', expense_date: '2025-07-03', expense_amount: '3500000.00', expense_usage: '县道Y208改建工程进度款', actual_account_code: '2140104', has_approval_doc: '是' },
      { exec_id: 'EX2507025', approval_id: 'YS2025-004-02', dept_code: '304001', voucher_no: 'JZ-2025-07-018', payee: 'xxx县公路养护中心', expense_date: '2025-07-08', expense_amount: '350000.00', expense_usage: '乡道X302日常养护', actual_account_code: '2140106', has_approval_doc: '是' },
      { exec_id: 'EX2508123', approval_id: 'YS2025-003-02', dept_code: '303001', voucher_no: 'JZ-2025-08-022', payee: '各乡镇卫生院', expense_date: '2025-08-15', expense_amount: '2100000.00', expense_usage: '基本公共卫生服务补助资金', actual_account_code: '2100408', has_approval_doc: '是' },
      { exec_id: 'EX2508234', approval_id: 'YS2025-003-01', dept_code: '303001', voucher_no: 'JZ-2025-08-101', payee: 'xxx县医用器械公司', expense_date: '2025-08-22', expense_amount: '720000.00', expense_usage: '采购彩色B超设备', actual_account_code: '2100301', has_approval_doc: '否' },
      { exec_id: 'EX2509012', approval_id: 'YS2025-001-03', dept_code: '301001', voucher_no: 'JZ-2025-09-005', payee: 'xxx县绿源苗木基地', expense_date: '2025-09-02', expense_amount: '550000.00', expense_usage: '乡村振兴示范村绿化苗木费', actual_account_code: '2130599', has_approval_doc: '是' },
      { exec_id: 'EX2509045', approval_id: 'YS2025-002-02', dept_code: '302001', voucher_no: 'JZ-2025-09-033', payee: 'xxx县第三中学', expense_date: '2025-09-10', expense_amount: '320000.00', expense_usage: '秋季学期免作业本费补助', actual_account_code: '2050203', has_approval_doc: '是' }
    ]
  },
  t_budget_adjustment: {
    columns: [
      { key: 'adjust_id', label: '调整单号', isPrimaryKey: true, visible: true },
      { key: 'dept_code', label: '部门编码', isPrimaryKey: false, visible: true },
      { key: 'original_approval_id', label: '原批复单号', isPrimaryKey: false, visible: true },
      { key: 'adjust_type', label: '调整类型', isPrimaryKey: false, visible: true },
      { key: 'adjust_amount', label: '调整金额', isPrimaryKey: false, visible: true },
      { key: 'adjust_reason', label: '调整原因', isPrimaryKey: false, visible: true },
      { key: 'approver', label: '审批人', isPrimaryKey: false, visible: true },
      { key: 'approve_date', label: '审批日期', isPrimaryKey: false, visible: true },
      { key: 'is_compliant', label: '是否合规', isPrimaryKey: false, visible: true },
    ],
    data: [
      { adjust_id: 'TZ2025001', dept_code: '302001', original_approval_id: 'YS2025-002-01', adjust_type: '调剂', adjust_amount: '-200000.00', adjust_reason: '小学教育公用经费结余，调剂至初中教育', approver: '财政局预算股', approve_date: '2025-04-15', is_compliant: '是' },
      { adjust_id: 'TZ2025002', dept_code: '302001', original_approval_id: 'YS2025-002-03', adjust_type: '追加', adjust_amount: '300000.00', adjust_reason: '新增进城务工子女教育补助配套资金', approver: '县政府常务会', approve_date: '2025-04-20', is_compliant: '是' },
      { adjust_id: 'TZ2025003', dept_code: '301001', original_approval_id: 'YS2025-001-03', adjust_type: '追加', adjust_amount: '1800000.00', adjust_reason: '省级下达第二批衔接资金，需配套县级资金', approver: '县政府常务会', approve_date: '2025-05-10', is_compliant: '是' },
      { adjust_id: 'TZ2025004', dept_code: '304001', original_approval_id: 'YS2025-004-01', adjust_type: '调剂', adjust_amount: '-1200000.00', adjust_reason: '公路建设项目进度滞后，调出至养护科目应急', approver: '财政局预算股', approve_date: '2025-06-18', is_compliant: '是' },
      { adjust_id: 'TZ2025005', dept_code: '303001', original_approval_id: 'YS2025-003-01', adjust_type: '追加', adjust_amount: '450000.00', adjust_reason: '县医院发热门诊改造应急工程', approver: '县卫健局党组会', approve_date: '2025-07-05', is_compliant: '否' },
      { adjust_id: 'TZ2025006', dept_code: '301001', original_approval_id: 'YS2025-001-01', adjust_type: '追加', adjust_amount: '60000.00', adjust_reason: '弥补局机关办公经费不足', approver: '局长办公会', approve_date: '2025-08-01', is_compliant: '否' },
      { adjust_id: 'TZ2025007', dept_code: '302001', original_approval_id: 'YS2025-002-02', adjust_type: '调剂', adjust_amount: '-350000.00', adjust_reason: '初中教育部分项目未实施，资金调剂至小学教育', approver: '财政局预算股', approve_date: '2025-08-12', is_compliant: '是' },
      { adjust_id: 'TZ2025008', dept_code: '304001', original_approval_id: 'YS2025-004-03', adjust_type: '追加', adjust_amount: '220000.00', adjust_reason: '农村客运班线冷僻线路补贴', approver: '县政府常务会', approve_date: '2025-09-05', is_compliant: '是' }
    ]
  },
  t_budget_idle_funds: {
    columns: [
      { key: 'project_id', label: '项目编号', isPrimaryKey: true, visible: true },
      { key: 'project_name', label: '项目名称', isPrimaryKey: false, visible: true },
      { key: 'dept_code', label: '部门编码', isPrimaryKey: false, visible: true },
      { key: 'budget_amount', label: '预算金额', isPrimaryKey: false, visible: true },
      { key: 'fund_received_date', label: '资金到账日期', isPrimaryKey: false, visible: true },
      { key: 'last_use_date', label: '最后支出日期', isPrimaryKey: false, visible: true },
      { key: 'used_amount', label: '已支出金额', isPrimaryKey: false, visible: true },
      { key: 'idle_days', label: '闲置天数', isPrimaryKey: false, visible: true },
      { key: 'has_explanation', label: '是否有书面说明', isPrimaryKey: false, visible: true },
    ],
    data: [
      { project_id: 'XM2025-001', project_name: '2024年高标准农田建设（续建）', dept_code: '301001', budget_amount: '12500000.00', fund_received_date: '2024-12-20', last_use_date: '2025-03-15', used_amount: '9200000.00', idle_days: 0, has_explanation: '是' },
      { project_id: 'XM2025-002', project_name: '农村人居环境整治专项', dept_code: '301001', budget_amount: '5800000.00', fund_received_date: '2025-02-01', last_use_date: 'NULL', used_amount: '0.00', idle_days: 240, has_explanation: '否' },
      { project_id: 'XM2025-003', project_name: '义务教育薄弱环节改善与能力提升', dept_code: '302001', budget_amount: '8200000.00', fund_received_date: '2025-03-10', last_use_date: '2025-08-20', used_amount: '4100000.00', idle_days: 41, has_explanation: '是' },
      { project_id: 'XM2025-004', project_name: '县级医院救治能力提升项目', dept_code: '303001', budget_amount: '3600000.00', fund_received_date: '2025-01-15', last_use_date: '2025-02-20', used_amount: '380000.00', idle_days: 221, has_explanation: '否' },
      { project_id: 'XM2025-005', project_name: '农村公路危桥改造工程', dept_code: '304001', budget_amount: '4500000.00', fund_received_date: '2025-04-01', last_use_date: '2025-09-05', used_amount: '2800000.00', idle_days: 25, has_explanation: '是' },
      { project_id: 'XM2025-006', project_name: '水系连通及水美乡村建设试点', dept_code: '301001', budget_amount: '21000000.00', fund_received_date: '2024-11-10', last_use_date: 'NULL', used_amount: '0.00', idle_days: 324, has_explanation: '否' },
      { project_id: 'XM2025-007', project_name: '学前教育发展专项资金', dept_code: '302001', budget_amount: '2400000.00', fund_received_date: '2025-05-20', last_use_date: '2025-07-15', used_amount: '1200000.00', idle_days: 76, has_explanation: '是' }
    ]
  }
};

const generateMockData = (sql: string) => {
  const sqlLower = sql.toLowerCase();
  let tableName = 't_budget_execution'; // Default
  
  if (sqlLower.includes('t_budget_approval')) tableName = 't_budget_approval';
  else if (sqlLower.includes('t_budget_adjustment')) tableName = 't_budget_adjustment';
  else if (sqlLower.includes('t_budget_idle_funds')) tableName = 't_budget_idle_funds';
  
  return TABLE_CONFIGS[tableName] || TABLE_CONFIGS.t_budget_execution;
};

export default function SQLExecutionAnalysis({ sql, dataSourceName = 'xxx县财政预算管理库', onBackToEditor, hideHeader }: SQLExecutionAnalysisProps) {
  const [status, setStatus] = React.useState<'idle' | 'executing' | 'success' | 'error'>(sql ? 'executing' : 'idle');
  const [progress, setProgress] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [data, setData] = React.useState<any[]>([]);
  const [columns, setColumns] = React.useState<ColumnConfig[]>(TABLE_CONFIGS.t_budget_execution.columns);
  const [showFieldConfig, setShowFieldConfig] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(20);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportProgress, setExportProgress] = React.useState(0);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());

  // Simulate execution
  React.useEffect(() => {
    if (!sql) {
      setStatus('idle');
      return;
    }

    setStatus('executing');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Randomly fail for demo
          if (sql.toLowerCase().includes('error')) {
            setStatus('error');
            setErrorMessage('语法错误: 在 "WHERE" 附近存在语法不正确。 (SQLServer Error 156)');
          } else {
            setStatus('success');
            const config = generateMockData(sql);
            setColumns(config.columns);
            setData(config.data);
          }
          return 100;
        }
        return prev + 20;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [sql]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
    setSortConfig({ key, direction });
  };

  const toggleField = (key: string) => {
    const col = columns.find(c => c.key === key);
    if (col?.isPrimaryKey) {
      // Show warning or just prevent
      return;
    }
    setColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
  };

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            alert(`导出成功！文件已保存至：/Downloads/SQL查询结果_20240402_${dataSourceName}.xlsx`);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedRows(newSelected);
  };

  const visibleColumns = columns.filter(c => c.visible);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      {!hideHeader && status !== 'idle' && (
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToEditor}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-sm font-bold text-gray-900 tracking-tight">执行结果</h2>
              <div className="flex items-center gap-3 mt-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <Database size={10} />
                  <span>{dataSourceName}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <Clock size={10} />
                  <span>耗时: 124ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFieldConfig(!showFieldConfig)}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                showFieldConfig ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <Settings2 size={14} />
              字段选择
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExport}
                disabled={status !== 'success' || isExporting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
              >
                <Download size={14} />
                导出 Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Execution Status Banner */}
      <AnimatePresence mode="wait">
        {status === 'executing' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border-b border-blue-100 px-8 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <RefreshCw size={16} className="text-blue-600 animate-spin" />
              <span className="text-sm font-bold text-blue-700">正在执行 SQL 语句...</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-mono text-blue-600 w-8">{progress}%</span>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-50 border-b border-red-100 px-8 py-4 flex items-start gap-3"
          >
            <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-700">执行失败</h4>
              <p className="text-xs text-red-600 mt-1 font-mono">{errorMessage}</p>
              <button 
                onClick={onBackToEditor}
                className="mt-3 text-xs font-bold text-red-700 hover:underline flex items-center gap-1"
              >
                返回编辑器修改 SQL <ChevronRight size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto bg-gray-50/30">
            {status === 'success' ? (
              <table className="w-full border-collapse min-w-max">
                <thead className="sticky top-0 z-20 bg-white shadow-sm">
                  <tr>
                    <th className="px-4 py-4 border-b border-gray-100 w-12 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedRows.size === data.length && data.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedRows(new Set(data.map(d => d.id || d.exec_id || d.approval_id || d.adjust_id || d.project_id)));
                          else setSelectedRows(new Set());
                        }}
                      />
                    </th>
                    {visibleColumns.map(col => (
                      <th 
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className="px-6 py-4 border-b border-gray-100 text-left cursor-pointer hover:bg-gray-50 transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{col.label}</span>
                          <div className="text-gray-300 group-hover:text-gray-500 transition-all">
                            {sortConfig.key === col.key ? (
                              sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                            ) : (
                              <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" />
                            )}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {data.map((row, idx) => {
                    const rowId = row.id || row.exec_id || row.approval_id || row.adjust_id || row.project_id || `row-${idx}`;
                    return (
                      <tr 
                        key={rowId} 
                        className={cn(
                          "hover:bg-blue-50/30 transition-colors group",
                          selectedRows.has(rowId) && "bg-blue-50/50"
                        )}
                      >
                        <td className="px-4 py-4 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedRows.has(rowId)}
                            onChange={() => toggleRow(rowId)}
                          />
                        </td>
                        {visibleColumns.map(col => (
                          <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                            {col.key === 'has_approval_doc' || col.key === 'is_compliant' || col.key === 'has_explanation' ? (
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold",
                                row[col.key] === '是' || row[col.key] === 1 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                              )}>
                                {row[col.key] === 1 ? '是' : row[col.key] === 0 ? '否' : row[col.key]}
                              </span>
                            ) : col.key === 'approval_id' && row[col.key] === 'NULL' ? (
                              <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">NULL</span>
                            ) : (
                              <span className={cn(
                                "text-xs",
                                col.isPrimaryKey ? "font-mono text-gray-400" : "text-gray-700 font-medium"
                              )}>
                                {(col.key.includes('amount') || (col.key.includes('budget') && !col.key.includes('year'))) ? `¥${Number(row[col.key]).toLocaleString()}` : row[col.key]}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : status === 'executing' ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium">正在获取数据...</p>
              </div>
            ) : status === 'idle' ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-8">
                  <Terminal size={48} />
                </div>
                <h3 className="text-lg font-normal text-gray-900 tracking-tight mb-2">暂无执行数据</h3>
                <p className="text-sm text-gray-500 max-w-xs mb-8">
                  请先在 SQL 编辑器中编写并执行查询语句，执行结果将在此处展示。
                </p>
                <button 
                  onClick={onBackToEditor}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                  <Play size={18} fill="currentColor" />
                  前往 SQL 编辑器
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <AlertCircle size={48} className="opacity-20 mb-4" />
                <p className="text-sm font-medium">执行出错，请检查 SQL 语句</p>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {status !== 'idle' && (
            <div className="px-8 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">每页显示</span>
                  <select 
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-bold text-gray-700 focus:outline-none"
                  >
                    {[10, 20, 50, 100].map(size => (
                      <option key={size} value={size}>{size} 条</option>
                    ))}
                  </select>
                </div>
                <span className="text-xs text-gray-400">共 {data.length} 条记录</span>
                {selectedRows.size > 0 && (
                  <span className="text-xs text-blue-600 font-bold">已选择 {selectedRows.size} 条</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30" disabled={currentPage === 1}>
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, '...', 15].map((p, i) => (
                    <button 
                      key={i}
                      className={cn(
                        "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                        p === currentPage ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Field Config Sidebar */}
        <AnimatePresence>
          {showFieldConfig && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-100 bg-white flex flex-col shadow-2xl z-30"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-blue-600" />
                  <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900">显示字段配置</h3>
                </div>
                <button onClick={() => setShowFieldConfig(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="bg-blue-50 p-4 rounded-2xl flex gap-3">
                  <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-700 leading-relaxed">
                    主键字段不可隐藏，以确保数据的可追溯性。您可以拖动字段进行排序。
                  </p>
                </div>
                <div className="space-y-1">
                  {columns.map(col => (
                    <div 
                      key={col.key}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl transition-all group",
                        col.visible ? "bg-gray-50" : "opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleField(col.key)}
                          disabled={col.isPrimaryKey}
                          className={cn(
                            "w-5 h-5 rounded flex items-center justify-center transition-all",
                            col.visible ? "bg-blue-600 text-white" : "border border-gray-300 bg-white"
                          )}
                        >
                          {col.visible && <Check size={12} />}
                        </button>
                        <span className="text-xs font-bold text-gray-700">{col.label}</span>
                      </div>
                      {col.isPrimaryKey && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">PK</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                <button 
                  onClick={() => setColumns(TABLE_CONFIGS.t_budget_execution.columns)}
                  className="flex-1 h-10 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
                >
                  恢复默认
                </button>
                <button 
                  onClick={() => setShowFieldConfig(false)}
                  className="flex-1 h-10 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  保存配置
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Progress Overlay */}
      <AnimatePresence>
        {isExporting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet size={32} />
              </div>
              <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 mb-2">正在导出 Excel...</h3>
              <p className="text-xs text-gray-500 mb-4">正在为您准备数据，请稍候</p>
              
              <div className="space-y-4">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${exportProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>进度</span>
                  <span>{exportProgress}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
