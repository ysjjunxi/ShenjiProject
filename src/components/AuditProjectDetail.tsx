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
  X,
  Eye,
  Cpu,
  Check,
  BookOpen,
  Database,
  Table2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  AuditProject, 
  ProjectStatus, 
  SuspicionRecord, 
  Evidence, 
  WorkingPaper, 
  AuditReport,
  KNOWLEDGE_BASES
} from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { approvalStore } from '../data/mockApprovals';

interface AuditProjectDetailProps {
  projectId: string;
  onBack: () => void;
  onNavigateToDocWriting?: () => void;
}

type TabType = 'basic' | 'auth' | 'screening' | 'suspicion' | 'evidence' | 'working_paper' | 'report';

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'basic', label: '基本信息', icon: <FileText size={18} /> },
  { id: 'auth', label: '数据申请', icon: <ShieldCheck size={18} /> },
  { id: 'screening', label: '审查点', icon: <Search size={18} /> },
  { id: 'suspicion', label: '疑点数据', icon: <BrainCircuit size={18} /> },
  { id: 'evidence', label: '取证单', icon: <ClipboardList size={18} /> },
  { id: 'working_paper', label: '审计底稿', icon: <FileCheck size={18} /> },
  { id: 'report', label: '审计报告', icon: <FileText size={18} /> },
];

const MODEL_CATEGORIES = [
  { id: 'cat1', name: '财政收支审计类模型' },
  { id: 'cat2', name: '重大政策贯彻执行审计模型' },
  { id: 'cat3', name: '重大项目建设审计模型' },
  { id: 'cat4', name: '民生保障审计模型' },
  { id: 'cat5', name: '国有资产资源审计模型' },
  { id: 'cat6', name: '领导干部审计模型' },
];

const MOCK_MODELS = [
  // 财政收支审计类模型
  { id: 'm411', name: '预算编制 / 执行合规性审计模型', categoryId: 'cat1', description: '审计预算编制是否科学、执行是否严格符合规定。' },
  { id: 'm412', name: '三公经费合规性审计模型', categoryId: 'cat1', description: '审计因公出国、公务用车、公务接待经费支出。' },
  { id: 'm413', name: '国库支付合规性审计模型', categoryId: 'cat1', description: '审计国库集中支付流程及资金去向。' },
  { id: 'm414', name: '乡镇财政收支合规性审计模型', categoryId: 'cat1', description: '审计乡镇财政收支的真实性与合规性。' },
  { id: 'm415', name: '非税收入合规性审计模型', categoryId: 'cat1', description: '审计非税收入征收管理情况。' },
  { id: 'm416', name: '往来款项合规性审计模型', categoryId: 'cat1', description: '审计往来款项的真实性、合法性。' },
  { id: 'm417', name: '财务核算合规性审计模型', categoryId: 'cat1', description: '审计会计核算是否符合财务准则。' },
  { id: 'm418', name: '村级代管资金专项审计模型', categoryId: 'cat1', description: '审计村级代管资金的安全与合规使用。' },
  { id: 'm419', name: '政府采购合规性专项审计模型', categoryId: 'cat1', description: '审计政府采购程序及合同执行情况。' },
  { id: 'm4110', name: '财政直达资金专项审计模型', categoryId: 'cat1', description: '审计财政直达资金的分配、下达与使用。' },
  { id: 'm4111', name: '财政存量资金专项审计模型', categoryId: 'cat1', description: '审计财政存量资金的清理与盘活情况。' },
  { id: 'm4112', name: '零余额账户使用合规性审计模型', categoryId: 'cat1', description: '审计零余额账户资金支付的真实合规性。' },
  
  // 重大政策贯彻执行审计模型
  { id: 'm421', name: '乡村振兴政策执行审计模型', categoryId: 'cat2', description: '审计乡村振兴相关政策落实及资金使用效果。' },
  { id: 'm422', name: '专项债券及国债资金管理审计模型', categoryId: 'cat2', description: '审计专项债资金投向及项目进展。' },
  { id: 'm423', name: '中央预算内投资项目执行审计模型', categoryId: 'cat2', description: '审计中央预算内投资项目的建设与管理。' },
  { id: 'm424', name: '惠农政策落实审计模型', categoryId: 'cat2', description: '审计各项惠农补贴政策的执行情况。' },
  { id: 'm425', name: '政策执行进度管控审计模型', categoryId: 'cat2', description: '审计重大政策执行的时间节点与进度。' },
  { id: 'm426', name: '政策佐证材料合规性审计模型', categoryId: 'cat2', description: '审计政策执行过程中的支撑材料真实性。' },
  { id: 'm427', name: '政策资金绩效评价审计模型', categoryId: 'cat2', description: '评价政策资金投入后的产出与效益。' },
  { id: 'm428', name: '跨部门政策协同执行审计模型', categoryId: 'cat2', description: '审计多部门协作政策的衔接与落实。' },
  { id: 'm429', name: '减税降费政策落实专项审计模型', categoryId: 'cat2', description: '审计减税降费政策对企业的惠及情况。' },
  { id: 'm4210', name: '稳就业保民生政策落实审计模型', categoryId: 'cat2', description: '审计就业补贴及民生保障政策落实。' },
  { id: 'm4211', name: '优化营商环境政策落实审计模型', categoryId: 'cat2', description: '审计营商环境优化措施的实际效果。' },
  
  // 重大项目建设审计模型
  { id: 'm431', name: '项目立项审批合规性审计模型', categoryId: 'cat3', description: '审计项目立项程序是否合法合规。' },
  { id: 'm432', name: '工程招投标合规性审计模型', categoryId: 'cat3', description: '审计招投标过程是否存在违规行为。' },
  { id: 'm433', name: '工程施工管理合规性审计模型', categoryId: 'cat3', description: '审计施工现场管理及变更签证合规性。' },
  { id: 'm434', name: '工程价款结算审计模型', categoryId: 'cat3', description: '审计工程进度款及结算款拨付准确性。' },
  { id: 'm435', name: '工程竣工决算审计模型', categoryId: 'cat3', description: '审计工程整体投资完成情况及决算。' },
  { id: 'm436', name: '项目管护及运营审计模型', categoryId: 'cat3', description: '审计项目建成后的后期管护与运行。' },
  { id: 'm437', name: '项目资金使用合规性审计模型', categoryId: 'cat3', description: '审计项目建设资金的流向与用途。' },
  { id: 'm438', name: '项目合规性佐证材料审计模型', categoryId: 'cat3', description: '审计项目全过程合规性支撑材料。' },
  { id: 'm439', name: '工程征地拆迁补偿专项审计模型', categoryId: 'cat3', description: '审计征拆补偿资金的发放与管理。' },
  { id: 'm4310', name: '政府投资项目全生命周期绩效审计模型', categoryId: 'cat3', description: '评价政府投资项目的全过程绩效。' },

  // 民生保障审计模型
  { id: 'm441', name: '医保基金使用合规性审计模型', categoryId: 'cat4', description: '审计医保基金支付及监管情况。' },
  { id: 'm442', name: '惠农补贴“一卡通”审计模型', categoryId: 'cat4', description: '审计补贴资金是否通过一卡通精准发放。' },
  { id: 'm443', name: '助残、低保等民生专项资金审计模型', categoryId: 'cat4', description: '审计特殊群体保障资金的精准发放。' },
  { id: 'm444', name: '校园膳食经费审计模型', categoryId: 'cat4', description: '审计学校食堂经费管理及学生餐补。' },
  { id: 'm445', name: '民生资金监管审计模型', categoryId: 'cat4', description: '审计各类民生资金的动态监管机制。' },
  { id: 'm446', name: '民生项目资金使用审计模型', categoryId: 'cat4', description: '审计民生工程项目的资金投入与产出。' },
  { id: 'm447', name: '民生资金佐证材料审计模型', categoryId: 'cat4', description: '审计民生资金发放的原始凭证真实性。' },
  { id: 'm448', name: '涉农补贴资金专项审计模型', categoryId: 'cat4', description: '审计农业生产相关补贴的落实情况。' },
  { id: 'm449', name: '养老保险基金专项审计模型', categoryId: 'cat4', description: '审计养老保险基金的征缴与发放。' },
  { id: 'm4410', name: '义务教育经费保障专项审计模型', categoryId: 'cat4', description: '审计义务教育阶段经费的投入与使用。' },
  { id: 'm4411', name: '困难群众救助补助资金专项审计模型', categoryId: 'cat4', description: '审计困难群众救助资金的兜底保障。' },
  { id: 'm4412', name: '住房公积金管理专项审计模型', categoryId: 'cat4', description: '审计住房公积金的归集、提取与贷款。' },

  // 国有资产资源审计模型
  { id: 'm451', name: '农村集体“三资”管理审计模型', categoryId: 'cat5', description: '审计农村集体资金、资产、资源管理情况。' },
  { id: 'm452', name: '国有资产处置合规性审计模型', categoryId: 'cat5', description: '审计国有资产转让、报废等处置程序。' },
  { id: 'm453', name: '土地资源使用合规性审计模型', categoryId: 'cat5', description: '审计土地出让、租赁及用途变更合规性。' },
  { id: 'm454', name: '生态资源保护审计模型', categoryId: 'cat5', description: '审计自然资源资产保护及生态修复情况。' },
  { id: 'm455', name: '特色产业集体资产审计模型 (预留)', categoryId: 'cat5', description: '审计乡村特色产业中的集体资产运营。' },
  { id: 'm456', name: '国有资产台账管理审计模型', categoryId: 'cat5', description: '审计国有资产登记、清查及台账完整性。' },
  { id: 'm457', name: '集体资产租赁管理审计模型', categoryId: 'cat5', description: '审计集体资产租赁合同及收益收缴。' },
  { id: 'm458', name: '资源资产收益管理审计模型', categoryId: 'cat5', description: '审计自然资源开发利用的收益分配。' },
  { id: 'm459', name: '政府债务专项审计模型', categoryId: 'cat5', description: '审计政府债务规模、结构及风险防控。' },
  { id: 'm4510', name: '行政事业单位国有资产管理专项审计模型', categoryId: 'cat5', description: '审计行政事业单位资产配置与使用。' },
  { id: 'm4511', name: '自然资源资产管理专项审计模型', categoryId: 'cat5', description: '审计森林、水流、矿藏等自然资源管理。' },

  // 领导干部审计模型
  { id: 'm461', name: '重大经济决策合规性审计模型', categoryId: 'cat6', description: '审计领导干部重大经济决策程序的合规性。' },
  { id: 'm462', name: '任职期间财政收支管理审计模型', categoryId: 'cat6', description: '审计领导干部任期内财政收支真实合规性。' },
  { id: 'm463', name: '任职期间资产资源管理审计模型', categoryId: 'cat6', description: '审计领导干部任职期间对资产资源的监管责任。' },
  { id: 'm464', name: '任职期间民生资金监管审计模型', categoryId: 'cat6', description: '审计领导干部对民生领域资金的统筹与监管。' },
  { id: 'm465', name: '离任交接合规性审计模型', categoryId: 'cat6', description: '审计领导干部离任时事项交接的完整性。' },
  { id: 'm466', name: '廉洁自律相关审计模型', categoryId: 'cat6', description: '审计领导干部在经济活动中的廉洁从业情况。' },
  { id: 'm467', name: '政策执行与审计整改责任审计模型', categoryId: 'cat6', description: '审计领导干部落实政策及审计整改的力度。' },
  { id: 'm468', name: '领导干部自然资源资产离任（任中）审计模型', categoryId: 'cat6', description: '审计领导干部任期内自然资源资产管理责任。' },
  { id: 'm469', name: '领导干部经济责任履职评价模型', categoryId: 'cat6', description: '综合评价领导干部履行经济责任的成效。' },
  { id: 'm4610', name: '审计整改闭环管理专项审计模型 (预留)', categoryId: 'cat6', description: '审计审计发现问题的整改闭环落实情况。' },
];

const MOCK_CHECKPOINTS: Record<string, { fixed: any[], configurable: any[] }> = {
  'm411': {
    fixed: [
      { title: '预算刚性约束审查点', description: '预算支出必须以经批准的预算为依据，未列入预算的不得支出' },
      { title: '预算科目合规性审查点', description: '预算支出必须按照批复的预算科目执行，不得擅自串用、挪用' },
      { title: '预算调整法定程序审查点', description: '预算调整必须编制调整方案报本级人大常委会批准' },
      { title: '预算资金专款专用审查点', description: '上级专项转移支付资金必须按照规定的用途使用' },
      { title: '决算数据真实性审查点', description: '决算草案必须符合法律、行政法规规定，做到收支真实' },
    ],
    configurable: [
      { title: '预算执行率异常校验规则', threshold: '下限 80%，上限 95%', basis: '《河北省县级财政预算管理业务操作规程》' },
      { title: '超预算支出校验规则', threshold: '超支幅度下限 3%，上限 10%', basis: '《中华人民共和国预算法》' },
      { title: '预算资金闲置校验规则', threshold: '闲置时长 3-12 个月；金额 5-30 万元', basis: '审计署《财政存量资金审计实务指引》' },
      { title: '违规追加预算校验规则', threshold: '追加次数下限 2 次，上限 5 次', basis: '《中华人民共和国预算法》' },
      { title: '预算编制与执行科目错位校验规则', threshold: '金额下限 1 万元，上限 5 万元', basis: '《中华人民共和国预算法实施条例》' },
    ]
  }
};

const MOCK_EXECUTION_STEPS = [
  { 
    id: 1, 
    name: '表数据读取器', 
    description: '读取授权数据源内的预算编制、执行全量表数据，按设定时间范围过滤',
    content: {
      type: 'table',
      title: '数据源读取：xxx县财政预算管理库',
      headers: ['表名', '记录数', '状态'],
      data: [
        ['t_budget_approval', '12', '成功'],
        ['t_budget_execution', '16', '成功'],
        ['t_budget_adjustment', '8', '成功'],
        ['t_budget_idle_funds', '7', '成功']
      ]
    }
  },
  { 
    id: 2, 
    name: 'SQL 执行器', 
    description: '执行规则校验对应的 SQL 查询语句，返回匹配的疑点数据',
    content: {
      type: 'code',
      title: '执行合规性校验 SQL',
      code: `SELECT e.*, a.approved_amount 
FROM t_budget_execution e 
LEFT JOIN t_budget_approval a ON e.approval_id = a.approval_id 
WHERE e.expense_amount > a.approved_amount * 1.05 
OR e.has_approval_doc = 0`
    }
  },
  { 
    id: 3, 
    name: '字段映射器', 
    description: '实现不同数据源的同类型字段自动匹配，适配异构数据库差异',
    content: {
      type: 'list',
      title: '字段自动映射结果',
      items: [
        'dept_code -> 部门编码 (String)',
        'expense_amount -> 支出金额 (Decimal)',
        'budget_year -> 预算年度 (Integer)',
        'payee -> 收款单位 (String)'
      ]
    }
  },
  { 
    id: 4, 
    name: '预算执行率计算器', 
    description: '自动计算单个 / 全量预算科目的执行进度，识别执行率异常数据',
    content: {
      type: 'table',
      title: '预算执行率计算结果 (Top 5 异常)',
      headers: ['部门', '预算', '支出', '执行率'],
      data: [
        ['xxx县农业农村局', '485.00万', '4.50万', '0.9%'],
        ['xxx县教育局', '4280.00万', '65.00万', '1.5%'],
        ['xxx县卫生健康局', '860.00万', '72.00万', '8.3%']
      ]
    }
  },
  { 
    id: 5, 
    name: '数值阈值校验器', 
    description: '按配置的阈值参数，校验超支幅度、闲置时长、追加次数等数值型合规性',
    content: {
      type: 'list',
      title: '阈值校验触发记录',
      items: [
        '触发规则：超预算支出校验规则 (阈值 > 5%)',
        '命中记录数：12 条',
        '触发规则：预算资金闲置校验规则 (阈值 > 6个月)',
        '命中记录数：8 条'
      ]
    }
  },
  { 
    id: 6, 
    name: '多表合规性比对器', 
    description: '实现预算批复表、执行明细表、支付凭证三表数据交叉比对，识别无预算、超预算支出疑点',
    content: {
      type: 'table',
      title: '三表比对异常 (无预算支出)',
      headers: ['凭证号', '金额', '摘要', '异常类型'],
      data: [
        ['JZ-2025-06-067', '12,800.00', '上级来人接待费', '未关联预算指标'],
        ['JZ-2025-04-032', '28,500.00', '印刷费', '无采购审批单']
      ]
    }
  },
  { 
    id: 7, 
    name: '数据快照生成器', 
    description: '对筛查出的疑点数据自动留存原始数据快照，符合审计证据留存要求',
    content: {
      type: 'info',
      title: '数据快照已生成',
      text: '已对 45 条疑似违规记录生成原始数据快照，存储路径：/audit/snapshots/20260409/YSZX-001/。快照包含：原始凭证、记账凭证、审批附件。'
    }
  },
  { 
    id: 8, 
    name: '法规条款匹配器', 
    description: '自动关联法律法规知识库，为疑点匹配对应的法定定性依据',
    content: {
      type: 'list',
      title: '法定定性依据匹配',
      items: [
        '《中华人民共和国预算法》第七十二条',
        '《财政违法行为处罚处分条例》第七条',
        '《河北省县级财政预算管理业务操作规程》'
      ]
    }
  },
];

const PROJECT_DETAILS_MAP: Record<string, {
  project: AuditProject;
  suspicions: SuspicionRecord[];
  evidences: Evidence[];
  workingPapers: WorkingPaper[];
  reports: AuditReport[];
}> = {
  'p1': {
    project: {
      id: 'p1',
      name: '2025年度某市重大水利项目专项审计',
      code: 'AUDIT-2025-001',
      object: '某市水利局',
      period: '2025-01-01 至 2025-12-31',
      members: [
        { name: '张审计', isLeader: true },
        { name: '李成员', isLeader: false }
      ],
      status: 'report_generated',
      createdAt: Date.now() - 86400000 * 30,
      updatedAt: Date.now() - 3600000
    },
    suspicions: [
      { id: 's1', description: '某水利工程项目存在重复拨付资金，涉及金额50万元', amount: 500000, level: 'high', law: '《审计法》第二十二条' },
      { id: 's2', description: '部分工程物资采购价格明显高于市场价，疑似利益输送', amount: 120000, level: 'medium', law: '《招标投标法》' },
      { id: 's3', description: '项目进度款拨付与实际工程进度不符，超前拨付', amount: 80000, level: 'low', law: '《基本建设财务管理办法》' },
    ],
    evidences: [
      { 
        id: 'e1', 
        title: '关于某水利项目重复拨付资金的取证单', 
        templateId: 't1', 
        content: `# 审计取证单\n\n**项目名称**：2025年度某市重大水利项目专项审计\n**被审计单位**：某市水利局\n**编号**：某审证〔2025〕001号\n\n**审计事项**：专项资金拨付情况审查 —— 重复拨付资金问题\n\n**审计事实**：\n经审计，某市水利局在“城南水库加固工程”项目中，存在向同一供应商（市第一建筑工程有限公司）就同一工程进度款重复拨付的情况。具体明细如下：\n1. 2025年02月15日，第记-0023号凭证拨付金额500,000.00元（大写：伍拾万元整），资金用途为城南水库加固工程第一期进度款。\n2. 2025年03月10日，第记-0089号凭证再次拨付金额500,000.00元（大写：伍拾万元整），资金用途同为城南水库加固工程第一期进度款（摘要与第一次完全一致，且未见冲销记录）。\n（附：记-0023号记账凭证及后附银行回单复印件1份，记-0089号记账凭证及后附银行回单复印件1份，城南水库加固工程施工合同及进度确认单1份）\n\n**被审计单位意见**：\n□ 属实\n□ 基本属实\n□ 不属实\n具体意见：\n\n**被审计单位签章**：\n负责人签字：\n经办人签字：\n（单位公章）\n日期：2025年03月22日\n\n**审计人员**：\n张审计\n李审计\n日期：2025年03月22日`, 
        version: 1, 
        updatedAt: Date.now() - 86400000 * 2 
      },
      { id: 'e2', title: '工程物资采购价格异常取证记录', templateId: 't2', content: '', version: 2, updatedAt: Date.now() - 3600000 * 5 },
      { id: 'e3', title: '项目进度款超前拨付情况说明', templateId: 't1', content: '', version: 1, updatedAt: Date.now() - 1800000 },
      { id: 'e4', title: '关联企业投标资质审查取证单', templateId: 't3', content: '', version: 3, updatedAt: Date.now() - 86400000 * 5 }
    ],
    workingPapers: [
      {
        id: 'wp1',
        title: '关于某市水利局“城南水库加固工程”重复拨付资金问题的审计底稿',
        templateId: 't1',
        content: `# 审计工作底稿\n\n**项目名称**：2025年度某市重大水利项目专项审计  \n**被审计单位**：某市水利局  \n**审计事项**：专项资金拨付情况审查  \n**编制人**：张审计  \n**编制日期**：2025年03月25日  \n**复核人**：王主审  \n**复核日期**：2025年03月26日  \n\n---\n\n## 一、 审计目标\n核实某市水利局“城南水库加固工程”项目专项资金拨付的真实性、合法性和合规性，检查是否存在虚报冒领、截留挪用、重复拨付等违规问题。\n\n## 二、 审计程序与方法\n1. 导出并分析某市水利局2025年度财务账套，筛选“城南水库加固工程”相关的所有资金拨付凭证。\n2. 运用“专项资金重复拨付检测模型”对收款单位、金额、用途及拨付时间进行多维比对分析。\n3. 调取疑似重复拨付的记账凭证及原始附件（银行回单、施工合同、进度确认单）进行交叉核对。\n4. 约谈某市水利局财务负责人及项目经办人，了解资金拨付审批流程及重复拨付原因。\n\n## 三、 审计发现问题及事实\n经抽查凭证及相关附件，发现某市水利局在“城南水库加固工程”项目中，向市第一建筑工程有限公司重复拨付第一期进度款，涉及金额 500,000.00 元。\n具体情况如下：\n- 2025年02月15日，通过第记-0023号凭证拨付城南水库加固工程第一期进度款 500,000.00 元。\n- 2025年03月10日，通过第记-0089号凭证再次拨付城南水库加固工程第一期进度款 500,000.00 元。\n两次拨付的摘要完全一致，且截至审计日未见冲销或退回记录。\n\n## 四、 审计结论及定性依据\n**定性依据**：上述行为违反了《中华人民共和国预算法》第五十六条“各部门、各单位应当按照批复的预算安排支出”及《基本建设财务规则》的相关规定。\n**审计结论**：某市水利局未严格执行资金拨付审批制度，财务审核把关不严，导致重复拨付财政资金 500,000.00 元，形成资金损失风险。\n\n## 五、 附件及索引\n1. 审计取证单（编号：某审证〔2025〕001号）及后附凭证复印件 —— 索引号：A-01\n2. 约谈记录（某市水利局财务负责人） —— 索引号：A-02`,
        version: 1,
        updatedAt: Date.now() - 86400000 * 1,
        evidenceIds: ['e1']
      }
    ],
    reports: [
      {
        id: 'r1',
        title: '2025年度某市重大水利项目专项审计报告',
        status: 'draft',
        type: 'first',
        author: '张审计',
        content: `# 审计报告\n\n**报告文号**：某审报〔2025〕005号  \n**被审计单位**：某市水利局  \n**审计项目**：2025年度某市重大水利项目专项审计  \n**审计期间**：2025年1月1日至2025年3月31日  \n\n---\n\n## 一、 审计基本情况\n根据《中华人民共和国审计法》的规定，我局派出审计组，自2025年3月1日至3月25日，对某市水利局2025年度重大水利项目（重点为“城南水库加固工程”）的资金管理和使用情况进行了专项审计。\n\n## 二、 审计评价意见\n审计结果表明，某市水利局在“城南水库加固工程”项目建设中，总体上能够按照国家相关法律法规开展工作，但在专项资金的拨付和审核环节存在把关不严、管理不规范的问题，需引起高度重视并加以整改。\n\n## 三、 审计发现的主要问题\n**（一）专项资金重复拨付，涉及金额 500,000.00 元**\n经抽查凭证及相关附件，发现某市水利局在“城南水库加固工程”项目中，向市第一建筑工程有限公司重复拨付第一期进度款。\n具体为：2025年02月15日（第记-0023号凭证）与2025年03月10日（第记-0089号凭证），分别拨付城南水库加固工程第一期进度款各 500,000.00 元，摘要完全一致，且未见冲销或退回记录。\n上述行为违反了《中华人民共和国预算法》第五十六条及《基本建设财务规则》的相关规定，形成资金损失风险。\n\n## 四、 审计处理处罚意见及建议\n针对上述问题，提出以下处理意见及建议：\n1. **责令限期追回重复拨付资金**：某市水利局应立即启动追缴程序，向市第一建筑工程有限公司全额追回重复拨付的 500,000.00 元资金，并调整相关会计账目。\n2. **完善资金拨付审批内控制度**：建议某市水利局进一步健全财务审核机制，严格执行工程进度款拨付的多级审批制度，利用信息化手段建立台账，杜绝类似重复付款问题再次发生。\n3. **追究相关责任人责任**：对此次重复拨付事件中审核把关不严的相关责任人员进行批评教育或按内部规定处理。\n\n某市审计局  \n2025年3月28日`,
        updatedAt: Date.now() - 86400000 * 1
      }
    ]
  },
  'p5': {
    project: {
      id: 'p5',
      name: 'xxx县财政预算审计',
      code: 'AUDIT-2025-001',
      object: 'xxx县财政局',
      period: '2025-01-01 至 2025-12-31',
      members: [
        { name: '王审计', isLeader: true },
        { name: '李审计', isLeader: false }
      ],
      status: 'report_generated',
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 3600000
    },
    suspicions: [
      { 
        id: 's5-1', description: '印刷费支出28,500.00元，一般支出超5000元未见采购审批单，存在违规支出疑点', amount: 28500, level: 'high', law: '《财政违法行为处罚处分条例》第七条',
        sourceType: 'database',
        sourceDetails: { dbName: 'xxx县财政预算管理库', tableName: '支出明细表 (expense_details)', dataSnapshot: { id: 'EXP2025001', amount: '28,500.00', purpose: '第一季度印刷费', department: '综合办', apply_time: '2025-03-01' } }
      },
      { 
        id: 's5-2', description: '办公楼外墙维修支出850,000.00元，使用“教育其他普通教育支出”科目，存在预算项目错用疑点', amount: 850000, level: 'medium', law: '《预算法实施条例》',
        sourceType: 'database',
        sourceDetails: { dbName: 'xxx县财政预算管理库', tableName: '预算执行表 (budget_execution)', dataSnapshot: { id: 'BE2025089', amount: '850,000.00', project: '办公楼外墙维修', subject: '教育其他普通教育支出（错用）', apply_time: '2025-04-12' } }
      },
      { id: 's5-3', description: '接待费支出12,800.00元，未关联预算指标，存在无预算支出疑点', amount: 12800, level: 'high', law: '《预算法》第十三条' },
      { id: 's5-4', description: '采购B类设备支出720,000.00元，无采购审批单，存在违规采购疑点', amount: 720000, level: 'high', law: '《财政违法行为处罚处分条例》第七条' },
      { 
        id: 's5-5', description: '绿化苗木支出550,000.00元，累计支出超出预算限额，存在超预算支出疑点', amount: 550000, level: 'high', law: '《预算法》第七十二条',
        sourceType: 'document',
        sourceDetails: { documentName: '2025城市绿化项目审批说明.pdf', chapter: '第三章 资金来源与预算', fragment: '...本项目年度绿化苗木预算总额批准为400,000.00元，任何超额支出需重新报批市建委及财政局...' }
      },
      { id: 's5-6', description: '医院应急物资追加450,000.00元，审批权限不合规（未报政府常务会），存在违规追加预算疑点', amount: 450000, level: 'medium', law: '《预算法》第六十七条' },
      { id: 's5-7', description: '农业农村局办公经费追加60,000.00元，属于“三公”经费性质追加且审批不合规，存在违规追加预算疑点', amount: 60000, level: 'high', law: '《预算法》第六十七条' },
      { id: 's5-8', description: '农村人居环境整治专项资金5,800,000.00元，到账后闲置8个月未支出，存在资金闲置疑点', amount: 5800000, level: 'medium', law: '《关于进一步做好财政存量资金清理核实工作的通知》' },
      { id: 's5-9', description: '县医院设备购置项目资金3,600,000.00元，闲置221天，进度缓慢，存在资金闲置疑点', amount: 3600000, level: 'medium', law: '《关于进一步做好财政存量资金清理核实工作的通知》' },
      { id: 's5-10', description: '水系连通及水美乡村建设试点资金21,000,000.00元，闲置324天未支出，存在资金闲置疑点', amount: 21000000, level: 'high', law: '《关于进一步做好财政存量资金清理核实工作的通知》' },
    ],
    evidences: [
      { 
        id: 'e5-1', 
        title: '关于xxx县财政局预算追加程序不合规的取证单', 
        templateId: 't1', 
        content: `# 审计取证单\n\n**项目名称**：xxx县财政预算审计\n**被审计单位**：xxx县财政局\n**编号**：x审证〔2025〕001号\n\n**审计事项**：预算追加审批合规性检查\n\n**审计事实**：\n经审计发现，xxx县财政局在2025年7月拨付“县医院发热门诊改造应急工程”资金450,000.00元时，仅凭县卫健局党组会会议纪要即办理了预算追加拨付，未按规定报县政府常务会审批。该事项涉及金额较大，审批程序存在严重缺失。\n\n**被审计单位意见**：\n□ 属实\n□ 基本属实\n□ 不属实\n具体意见：\n\n**被审计单位签章**：\n负责人签字：\n经办人签字：\n（单位公章）\n日期：2025-08-15\n\n**审计人员**：\n王审计\n李审计\n日期：2025-08-15`, 
        version: 1, 
        updatedAt: Date.now() - 86400000 * 1 
      },
      {
        id: 'e5-2',
        title: 'xxx县财政预算审计取证单-2',
        templateId: 't1',
        content: `<div class="text-center text-xl text-gray-800 mb-4">审计取证单</div>
<div class="text-right mb-2 text-sm">第 &nbsp;&nbsp;&nbsp;&nbsp; 页（共 &nbsp;&nbsp;&nbsp;&nbsp; 页）</div>
<table class="w-full border-collapse border border-gray-800 text-sm !m-0">
  <tbody>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold w-1/5">项目名称</td>
      <td class="border border-gray-800 p-3" colspan="3">xxx县财政预算审计</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">审计（调查）<br/>事项</td>
      <td class="border border-gray-800 p-3" colspan="3">取证单汇总核查</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 align-top" colspan="4">
        <div class="min-h-[300px]">
          <div class="mb-4">
            <div><strong>1. </strong>印刷费支出28,500.00元，一般支出超5000元未见采购审批单，存在违规支出疑点。</div>
            <div><strong>定性依据及法律法规条款：</strong>《财政违法行为处罚处分条例》第七条。</div>
          </div>
          <div class="mb-4">
            <div><strong>2. </strong>办公楼外墙维修支出850,000.00元，使用“教育其他普通教育支出”科目，存在预算项目错用疑点。</div>
            <div><strong>定性依据及法律法规条款：</strong>《预算法实施条例》。</div>
          </div>
          <div class="mb-4">
            <div><strong>3. </strong>接待费支出12,800.00元，未关联预算指标，存在无预算支出疑点。</div>
            <div><strong>定性依据及法律法规条款：</strong>《预算法》第十三条。</div>
          </div>
          <div class="mb-4">
            <div><strong>4. </strong>采购B类设备支出720,000.00元，无采购审批单，存在违规采购疑点。</div>
            <div><strong>定性依据及法律法规条款：</strong>《财政违法行为处罚处分条例》第七条。</div>
          </div>
          <div class="mb-4">
            <div><strong>5. </strong>绿化苗木支出550,000.00元，累计支出超出预算限额，存在超预算支出疑点。</div>
            <div><strong>定性依据及法律法规条款：</strong>《预算法》第七十二条。</div>
          </div>
          <div class="mb-4">
            <div><strong>6. </strong>医院应急物资追加450,000.00元，审批权限不合规（未报政府常务会），存在违规追加预算疑点。</div>
            <div><strong>定性依据及法律法规条款：</strong>《预算法》第六十七条。</div>
          </div>
          <div class="mb-4">
            <div><strong>7. </strong>农业农村局办公经费追加60,000.00元，属于“三公”经费性质追加且审批不合规，存在违规追加预算疑点。</div>
            <div><strong>定性依据及法律法规条款：</strong>《预算法》第六十七条。</div>
          </div>
          <div class="mb-4">
            <div><strong>8. </strong>农村人居环境整治专项资金5,800,000.00元，到账后闲置8个月未支出，存在资金闲置疑点。</div>
            <div><strong>定性依据及法律法规条款：</strong>《关于进一步做好财政存量资金清理核实工作的通知》。</div>
          </div>
          <div class="mb-4">
            <div><strong>9. </strong>县医院设备购置项目资金3,600,000.00元，闲置221天，进度缓慢，存在资金闲置疑点。</div>
            <div><strong>定性依据及法律法规条款：</strong>《关于进一步做好财政存量资金清理核实工作的通知》。</div>
          </div>
          <div class="mb-4">
            <div><strong>10. </strong>水系连通及水美乡村建设试点资金21,000,000.00元，闲置324天未支出，存在资金闲置疑点。</div>
            <div><strong>定性依据及法律法规条款：</strong>《关于进一步做好财政存量资金清理核实工作的通知》。</div>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">证据提供<br/>单位意见</td>
      <td class="border border-gray-800 p-3 align-top" colspan="3">
        <div class="min-h-[150px] flex flex-col justify-between">
          <div>
            <div>□ 情况属实</div>
            <div class="mt-2">□ 异议说明：</div>
          </div>
          <div class="text-right pr-12 mt-8">（盖章）</div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">证据提供单位负责人<br/>（签名）</td>
      <td class="border border-gray-800 p-3"></td>
      <td class="border border-gray-800 p-3 text-center font-bold">日期</td>
      <td class="border border-gray-800 p-3">&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</td>
    </tr>
  </tbody>
</table>`,
        version: 1,
        updatedAt: Date.now()
      }
    ],
    workingPapers: [
      {
        id: 'wp5-1',
        title: 'xxx县财政预算审计底稿-1',
        templateId: 't1',
        content: `<div class="text-center text-xl text-gray-800 mb-4">审计工作底稿</div>
<div class="flex justify-between mb-2 text-sm">
  <div>索引号：</div>
  <div>第 &nbsp;&nbsp;&nbsp;&nbsp; 页（共 &nbsp;&nbsp;&nbsp;&nbsp; 页）</div>
</div>
<table class="w-full border-collapse border border-gray-800 text-sm !m-0">
  <tbody>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold w-1/5">项目名称</td>
      <td class="border border-gray-800 p-3" colspan="3">xxx县财政预算审计</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">审计（调查）<br/>事项</td>
      <td class="border border-gray-800 p-3" colspan="3">取证单汇总核查</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">审计人员</td>
      <td class="border border-gray-800 p-3 w-[30%]"></td>
      <td class="border border-gray-800 p-3 text-center font-bold w-1/5">编制日期</td>
      <td class="border border-gray-800 p-3 w-[30%]">2026 年 4 月 10 日</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 align-top" colspan="4">
        <div class="min-h-[150px]">
<div class="font-bold mb-2">审计过程：</div>
<div class="space-y-2">
<p><strong>1. 审计准备与数据采集</strong><br/>
根据《中华人民共和国预算法》及平台市、县级预算管理规范，确定审计范围为<strong>xxx县农业农村局、住建局、卫健委、交通局</strong>2025年度预算编制、执行、决算及资金使用全过程。通过连接预算管理系统、国库集中支付系统、财务核算系统，采集<strong>预算指标、支付明细、会计凭证、资金结余等表</strong>等结构化数据，同时收集项目立项、情况说明等非结构化电子证据，确保数据真实、全面、完整。</p>

<p><strong>2. 模型构建与疑点筛查</strong><br/>
构建<strong>预算编制/执行合规性分析模型</strong>，设定固定阈值与业务规则开展自动比对校验：<br/>
- 校验<strong>超预算支出、无预算支出、超预算标准</strong>等风险事项；<br/>
- 校验<strong>预算执行率低于90%、资金闲置超6个月、项目单位违规追加预算</strong>等疑点；<br/>
- 通过数据多维比对、字段映射、阈值校验、异常预警，生成标准化疑点清单。</p>

<p><strong>3. 疑点核实与取证</strong><br/>
对模型筛查生成的疑点进行人工核查，核对支付凭证、项目合同、审批单等，与被审计单位沟通确认，固定相关证据，形成取证单并编制底稿。</p>

<p><strong>4. 定性与定责</strong><br/>
根据《预算法实施条例》等规定，对违规行为进行定性，明确违规事实、判断违规性质、划分责任等级，形成最终审计结论。</p>
</div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 align-top" colspan="4">
        <div class="min-h-[150px]">
<div class="font-bold mb-2">审计认定的事实摘要及审计结论：</div>
<div class="space-y-4">
<div>
<h4 class="font-bold">1. 审计认定的事实摘要</h4>
<div class="ml-2 space-y-2 mt-1">
<p class="font-bold">1）预算执行合规性问题</p>
<p>（1）<strong>无预算支出</strong><br/>
县农业农村局于2025年6月18日支付下级乡镇接待费<strong>12,800元</strong>，无对应预算指标号（approval_id为NULL），未编制相关预算，属于临时性无预算支出，违反预算管理支出规定。</p>

<p>（2）<strong>超标准支出/不合规采购</strong><br/>
- 县农业农村局2025年4月12日支付印刷费<strong>28,500元</strong>，属于未按采购标准执行的超标准采购/超范围采购。<br/>
- 县卫健委2025年8月22日采购彩色B超设备<strong>720,000元</strong>，超出原定采购范围，属于超预算采购。</p>

<p>（3）<strong>超预算支出</strong><br/>
县农业农村局<strong>2130599（巩固脱贫攻坚成果衔接资金）</strong> 预算2350万元，2025年9月2日支付绿化苗木款<strong>550,000元</strong>，累计支出超出预算额度，无合规审批手续。</p>

<p>（4）<strong>预算项目挪用/挤占</strong><br/>
县住建局2025年5月20日使用<strong>2050299（农村公路畅通工程资金）</strong> 支付局机关办公楼外墙维修<strong>850,000元</strong>，项目使用偏离原定用途，存在挤占挪用预算项目资金。</p>

<p class="font-bold mt-3">2）预算调整合规性问题</p>
<p>1. <strong>预算追加审批不合规</strong><br/>
- 县卫健委2025年7月5日追加县医院医疗设备购置资金<strong>450,000元</strong>，仅有局党组会议记录，未按规定报财政局审批，缺乏应有的审批文件。<br/>
- 县农业农村局2025年8月1日追加课题研究费<strong>60,000元</strong>，属于日常办公经费，无重大政策调整/突发事件等原因，属于违规追加预算。</p>

<p class="font-bold mt-3">3）预算资金闲置问题</p>
<p>（1） <strong>资金闲置且说明无充分理由</strong><br/>
- 县农业农村局<strong>农机具购置补贴专项</strong>580万元，其中240万未使用，无合理说明。<br/>
- 县卫健委<strong>县级医院重点专科建设项目</strong>360万元，其中221万未支付，38万元项目推进缓慢。<br/>
- 县农业农村局<strong>水系连通及水美乡村建设试点</strong>2100万元，其中324万未拨付，资金长期沉淀。<br/>
以上项目均无合理原因说明及处理计划，违反资金使用要求。</p>

<p class="font-bold mt-3">4）预算执行率异常</p>
<p>部分项目因项目推进、资金拨付等受影响，<strong>总体预算执行率低于90%</strong>，部分资金长期停滞，未达到预期预算支出目标。</p>
</div>
</div>

<div>
<h4 class="font-bold">2. 审计结论</h4>
<div class="ml-2 space-y-2 mt-1">
<p><strong>1）总体评价</strong><br/>
xxx县2025年度县级本级预算编制及规范，<strong>预算执行、决算及资金使用环节存在较多违规问题</strong>，整体风险等级较高，预算约束力不强，部分单位存在管理不规范、资金使用效益不高等问题。</p>

<p><strong>2）主要问题</strong><br/>
- 预算执行管控不严，存在<strong>无预算支出、超预算支出、超标准支出</strong>，违反《预算法》第五十三、五十四条。<br/>
- 预算调整违规：存在<strong>未按规定程序追加预算</strong>，削弱预算管理的权威性及严肃性规定。<br/>
- 项目管理规范性差：存在<strong>预算项目挪用、挤占</strong>，未按规定项目执行。<br/>
- 资金盘活不力：部分项目资金<strong>闲置超6个月</strong>，且说明无充分理由，造成部分资金使用低效。<br/>
- 内部控制薄弱：部分采购及预算调整内控制度未有效执行。</p>
</div>
</div>
</div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold w-1/5">审核人员</td>
      <td class="border border-gray-800 p-3 w-[30%]"></td>
      <td class="border border-gray-800 p-3 text-center font-bold w-1/5">审核日期</td>
      <td class="border border-gray-800 p-3 w-[30%]">&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</td>
    </tr>
  </tbody>
</table>`,
        version: 1,
        updatedAt: Date.now(),
        evidenceIds: ['e5-2']
      }
    ],
    reports: []
  }
};

export default function AuditProjectDetail({ projectId, onBack, onNavigateToDocWriting }: AuditProjectDetailProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('basic');
  
  const details = PROJECT_DETAILS_MAP[projectId] || PROJECT_DETAILS_MAP['p1'];
  const project = details.project;
  const suspicions = details.suspicions;
  const initialPapers = details.workingPapers;
  const initialReports = details.reports;

  const [evidences, setEvidences] = React.useState<Evidence[]>(details.evidences || []);
  const [workingPapers, setWorkingPapers] = React.useState<WorkingPaper[]>(details.workingPapers || []);

  React.useEffect(() => {
    setEvidences(PROJECT_DETAILS_MAP[projectId]?.evidences || PROJECT_DETAILS_MAP['p1'].evidences);
    setWorkingPapers(PROJECT_DETAILS_MAP[projectId]?.workingPapers || PROJECT_DETAILS_MAP['p1'].workingPapers);
  }, [projectId]);

  const handleGenerateEvidence = (selectedIds: string[], templateId: string) => {
    const selectedSuspicions = suspicions.filter(s => selectedIds.includes(s.id));
    
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const factsHtml = selectedSuspicions.map((s, i) => 
      `<div class="mb-4">
        <div><strong>${i + 1}. </strong>${s.description}。</div>
        <div><strong>定性依据及法律法规条款：</strong>${s.law}。</div>
      </div>`
    ).join('');

    const content = `<div class="text-center text-xl text-gray-800 mb-4">审计取证单</div>
<div class="text-right mb-2 text-sm">第 &nbsp;&nbsp;&nbsp;&nbsp; 页（共 &nbsp;&nbsp;&nbsp;&nbsp; 页）</div>
<table class="w-full border-collapse border border-gray-800 text-sm !m-0">
  <tbody>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold w-1/5">项目名称</td>
      <td class="border border-gray-800 p-3" colspan="3">${project.name}</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">被审计（调查）<br/>单位或个人</td>
      <td class="border border-gray-800 p-3" colspan="3">${project.object}</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">审计（调查）事项</td>
      <td class="border border-gray-800 p-3" colspan="3">疑点数据核查</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">审计（调查）<br/>事项摘要</td>
      <td class="border border-gray-800 p-3 align-top" colspan="3">
        <div class="min-h-[200px]">
          ${factsHtml}
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">审计人员</td>
      <td class="border border-gray-800 p-3 w-[30%]"></td>
      <td class="border border-gray-800 p-3 text-center font-bold w-1/5">编制日期</td>
      <td class="border border-gray-800 p-3 w-[30%]">${year} 年 ${month} 月 ${day} 日</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">证据提供<br/>单位意见</td>
      <td class="border border-gray-800 p-3 align-top" colspan="3">
        <div class="min-h-[150px] flex flex-col justify-between">
          <div>
            <div>□ 情况属实</div>
            <div class="mt-2">□ 异议说明：</div>
          </div>
          <div class="text-right pr-12 mt-8">（盖章）</div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">证据提供单位负责人<br/>（签名）</td>
      <td class="border border-gray-800 p-3"></td>
      <td class="border border-gray-800 p-3 text-center font-bold">日期</td>
      <td class="border border-gray-800 p-3">&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</td>
    </tr>
  </tbody>
</table>`;

    const newEvidence: Evidence = {
      id: `e-${Date.now()}`,
      title: `${project.name}取证单-${evidences.length + 1}`,
      templateId: templateId,
      content: content,
      version: 1,
      updatedAt: Date.now()
    };
    
    setEvidences([newEvidence, ...evidences]);
    setActiveTab('evidence');
  };

  const handleGenerateWorkingPaper = (selectedEvidenceIds: string[], templateId: string) => {
    const selectedEvidences = evidences.filter(e => selectedEvidenceIds.includes(e.id));
    
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const auditProcessHtml = `
<div class="font-bold mb-2">审计过程：</div>
<div class="space-y-2">
<p><strong>1. 审计准备与数据采集</strong><br/>
根据《中华人民共和国预算法》及平台市、县级预算管理规范，确定审计范围为<strong>xxx县农业农村局、住建局、卫健委、交通局</strong>2025年度预算编制、执行、决算及资金使用全过程。通过连接预算管理系统、国库集中支付系统、财务核算系统，采集<strong>预算指标、支付明细、会计凭证、资金结余等表</strong>等结构化数据，同时收集项目立项、情况说明等非结构化电子证据，确保数据真实、全面、完整。</p>

<p><strong>2. 模型构建与疑点筛查</strong><br/>
构建<strong>预算编制/执行合规性分析模型</strong>，设定固定阈值与业务规则开展自动比对校验：<br/>
- 校验<strong>超预算支出、无预算支出、超预算标准</strong>等风险事项；<br/>
- 校验<strong>预算执行率低于90%、资金闲置超6个月、项目单位违规追加预算</strong>等疑点；<br/>
- 通过数据多维比对、字段映射、阈值校验、异常预警，生成标准化疑点清单。</p>

<p><strong>3. 疑点核实与取证</strong><br/>
对模型筛查生成的疑点进行人工核查，核对支付凭证、项目合同、审批单等，与被审计单位沟通确认，固定相关证据，形成取证单并编制底稿。</p>

<p><strong>4. 定性与定责</strong><br/>
根据《预算法实施条例》等规定，对违规行为进行定性，明确违规事实、判断违规性质、划分责任等级，形成最终审计结论。</p>
</div>`;

    const auditConclusionHtml = `
<div class="font-bold mb-2">审计认定的事实摘要及审计结论：</div>
<div class="space-y-4">
<div>
<h4 class="font-bold">1. 审计认定的事实摘要</h4>
<div class="ml-2 space-y-2 mt-1">
<p class="font-bold">1）预算执行合规性问题</p>
<p>（1）<strong>无预算支出</strong><br/>
县农业农村局于2025年6月18日支付下级乡镇接待费<strong>12,800元</strong>，无对应预算指标号（approval_id为NULL），未编制相关预算，属于临时性无预算支出，违反预算管理支出规定。</p>

<p>（2）<strong>超标准支出/不合规采购</strong><br/>
- 县农业农村局2025年4月12日支付印刷费<strong>28,500元</strong>，属于未按采购标准执行的超标准采购/超范围采购。<br/>
- 县卫健委2025年8月22日采购彩色B超设备<strong>720,000元</strong>，超出原定采购范围，属于超预算采购。</p>

<p>（3）<strong>超预算支出</strong><br/>
县农业农村局<strong>2130599（巩固脱贫攻坚成果衔接资金）</strong> 预算2350万元，2025年9月2日支付绿化苗木款<strong>550,000元</strong>，累计支出超出预算额度，无合规审批手续。</p>

<p>（4）<strong>预算项目挪用/挤占</strong><br/>
县住建局2025年5月20日使用<strong>2050299（农村公路畅通工程资金）</strong> 支付局机关办公楼外墙维修<strong>850,000元</strong>，项目使用偏离原定用途，存在挤占挪用预算项目资金。</p>

<p class="font-bold mt-3">2）预算调整合规性问题</p>
<p>1. <strong>预算追加审批不合规</strong><br/>
- 县卫健委2025年7月5日追加县医院医疗设备购置资金<strong>450,000元</strong>，仅有局党组会议记录，未按规定报财政局审批，缺乏应有的审批文件。<br/>
- 县农业农村局2025年8月1日追加课题研究费<strong>60,000元</strong>，属于日常办公经费，无重大政策调整/突发事件等原因，属于违规追加预算。</p>

<p class="font-bold mt-3">3）预算资金闲置问题</p>
<p>（1） <strong>资金闲置且说明无充分理由</strong><br/>
- 县农业农村局<strong>农机具购置补贴专项</strong>580万元，其中240万未使用，无合理说明。<br/>
- 县卫健委<strong>县级医院重点专科建设项目</strong>360万元，其中221万未支付，38万元项目推进缓慢。<br/>
- 县农业农村局<strong>水系连通及水美乡村建设试点</strong>2100万元，其中324万未拨付，资金长期沉淀。<br/>
以上项目均无合理原因说明及处理计划，违反资金使用要求。</p>

<p class="font-bold mt-3">4）预算执行率异常</p>
<p>部分项目因项目推进、资金拨付等受影响，<strong>总体预算执行率低于90%</strong>，部分资金长期停滞，未达到预期预算支出目标。</p>
</div>
</div>

<div>
<h4 class="font-bold">2. 审计结论</h4>
<div class="ml-2 space-y-2 mt-1">
<p><strong>1）总体评价</strong><br/>
xxx县2025年度县级本级预算编制及规范，<strong>预算执行、决算及资金使用环节存在较多违规问题</strong>，整体风险等级较高，预算约束力不强，部分单位存在管理不规范、资金使用效益不高等问题。</p>

<p><strong>2）主要问题</strong><br/>
- 预算执行管控不严，存在<strong>无预算支出、超预算支出、超标准支出</strong>，违反《预算法》第五十三、五十四条。<br/>
- 预算调整违规：存在<strong>未按规定程序追加预算</strong>，削弱预算管理的权威性及严肃性规定。<br/>
- 项目管理规范性差：存在<strong>预算项目挪用、挤占</strong>，未按规定项目执行。<br/>
- 资金盘活不力：部分项目资金<strong>闲置超6个月</strong>，且说明无充分理由，造成部分资金使用低效。<br/>
- 内部控制薄弱：部分采购及预算调整内控制度未有效执行。</p>
</div>
</div>
</div>`;

    const content = `<div class="text-center text-xl text-gray-800 mb-4">审计工作底稿</div>
<div class="flex justify-between mb-2 text-sm">
  <div>索引号：</div>
  <div>第 &nbsp;&nbsp;&nbsp;&nbsp; 页（共 &nbsp;&nbsp;&nbsp;&nbsp; 页）</div>
</div>
<table class="w-full border-collapse border border-gray-800 text-sm !m-0">
  <tbody>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold w-1/5">项目名称</td>
      <td class="border border-gray-800 p-3" colspan="3">${project.name}</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">审计（调查）<br/>事项</td>
      <td class="border border-gray-800 p-3" colspan="3">取证单汇总核查</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold">审计人员</td>
      <td class="border border-gray-800 p-3 w-[30%]"></td>
      <td class="border border-gray-800 p-3 text-center font-bold w-1/5">编制日期</td>
      <td class="border border-gray-800 p-3 w-[30%]">${year} 年 ${month} 月 ${day} 日</td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 align-top" colspan="4">
        <div class="min-h-[150px]">
          ${auditProcessHtml}
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 align-top" colspan="4">
        <div class="min-h-[150px]">
          ${auditConclusionHtml}
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-800 p-3 text-center font-bold w-1/5">审核人员</td>
      <td class="border border-gray-800 p-3 w-[30%]"></td>
      <td class="border border-gray-800 p-3 text-center font-bold w-1/5">审核日期</td>
      <td class="border border-gray-800 p-3 w-[30%]">&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</td>
    </tr>
  </tbody>
</table>`;

    const newWorkingPaper: WorkingPaper = {
      id: `wp-${Date.now()}`,
      title: `${project.name}底稿-${workingPapers.length + 1}`,
      templateId: templateId,
      content: content,
      version: 1,
      updatedAt: Date.now(),
      evidenceIds: selectedEvidenceIds
    };
    
    setWorkingPapers([newWorkingPaper, ...workingPapers]);
    setActiveTab('working_paper');
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[90px] shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-normal text-gray-900 tracking-tight">{project.name}</h2>
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider border border-blue-100">
                {project.code}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">项目进度：已归档</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigateToDocWriting?.()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100 rounded-lg hover:bg-orange-100 transition-all shadow-sm text-sm"
          >
            <BrainCircuit size={16} className="text-orange-500" />
            智能文书编写
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-sm">
            导出项目包
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm">
            完成归档
          </button>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <ProgressStep label="数据申请" status="completed" />
          <ProgressLine status="completed" />
          <ProgressStep label="审查点" status="completed" />
          <ProgressLine status="completed" />
          <ProgressStep label="疑点生成" status="completed" />
          <ProgressLine status="completed" />
          <ProgressStep label="取证" status="completed" />
          <ProgressLine status="completed" />
          <ProgressStep label="底稿编制" status="completed" />
          <ProgressLine status="completed" />
          <ProgressStep label="报告生成" status="completed" />
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
              {activeTab === 'basic' && <BasicInfoTab project={project} />}
              {activeTab === 'auth' && <AuthTab project={project} />}
              {activeTab === 'screening' && <ScreeningTab project={project} />}

              {activeTab === 'suspicion' && <SuspicionTab suspicions={suspicions} onGenerateEvidence={handleGenerateEvidence} />}
              {activeTab === 'evidence' && <EvidenceTab evidences={evidences} setEvidences={setEvidences} onGenerateWorkingPaper={(selectedIds, templateId) => handleGenerateWorkingPaper(selectedIds, templateId)} />}
              {activeTab === 'working_paper' && <WorkingPaperTab papers={workingPapers} setPapers={setWorkingPapers} />}
              {activeTab === 'report' && <ReportTab initialReports={initialReports} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProgressStep({ label, status }: { label: string; status: 'completed' | 'active' | 'pending' }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
        status === 'completed' ? "bg-green-100 text-green-600" :
        status === 'active' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" :
        "bg-gray-200 text-gray-400"
      )}>
        {status === 'completed' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
      </div>
      <span className={cn(
        "text-xs font-medium",
        status === 'completed' ? "text-green-600" :
        status === 'active' ? "text-blue-600" :
        "text-gray-400"
      )}>{label}</span>
    </div>
  );
}

function ProgressLine({ status }: { status: 'completed' | 'pending' }) {
  return (
    <div className="flex-1 h-[2px] mx-4 bg-gray-200 relative">
      {status === 'completed' && (
        <div className="absolute inset-0 bg-green-500" />
      )}
    </div>
  );
}

function BasicInfoTab({ project }: { project: AuditProject }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-normal tracking-tight text-gray-900 mb-4">项目基本信息</h3>
        <div className="space-y-4">
          <InfoItem label="项目名称" value={project.name} />
          <InfoItem label="项目编码" value={project.code} />
          <InfoItem label="被审计单位" value={project.object} />
          <InfoItem label="审计周期" value={project.period} />
          <InfoItem label="创建时间" value={new Date(project.createdAt).toLocaleString()} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-normal tracking-tight text-gray-900 mb-4">项目成员</h3>
        <div className="space-y-4">
          {project.members.map((member, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                  member.isLeader ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                )}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.isLeader ? '项目负责人' : '审计员'}</p>
                </div>
              </div>
              <span className={cn(
                "px-2 py-1 text-[10px] font-bold rounded uppercase",
                member.isLeader ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
              )}>
                {member.isLeader ? '主审' : '成员'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function AuthTab({ project }: { project: AuditProject }) {
  const [showSchemaModal, setShowSchemaModal] = React.useState(false);
  const [selectedTableId, setSelectedTableId] = React.useState('budget_plan');
  const [showApplyModal, setShowApplyModal] = React.useState(false);
  
  const [applyForm, setApplyForm] = React.useState({ databases: [], note: '' });

  const [data, setData] = React.useState(approvalStore.snapshot);
  React.useEffect(() => {
    return approvalStore.subscribe(() => {
      setData(approvalStore.snapshot);
    });
  }, []);

  const projectApprovals = data.filter(d => d.project === project.name);

  // Mock available databases
  const AVAILABLE_DATABASES = [
    { id: 'db1', name: '财务中心_费用库 (MySQL)' },
    { id: 'db2', name: '人力资源库 (Oracle)' },
    { id: 'db3', name: '工程项目管理系统 (SQLServer)' },
    { id: 'db4', name: 'xxx县财政预算管理库' },
    { id: 'db5', name: '智慧税务平台数据库' },
  ];

  const MOCK_TABLES = [
    { id: 'budget_plan', name: 'budget_plan', description: '预算编制表', fields: [
      { name: 'id', type: 'varchar(32)', desc: '主键' },
      { name: 'dept_id', type: 'varchar(32)', desc: '部门ID' },
      { name: 'amount', type: 'decimal(15,2)', desc: '预算金额' },
      { name: 'year', type: 'int(4)', desc: '预算年份' },
    ]},
    { id: 'budget_execution', name: 'budget_execution', description: '预算执行明细表', fields: [
      { name: 'id', type: 'varchar(32)', desc: '主键' },
      { name: 'plan_id', type: 'varchar(32)', desc: '关联预算表ID' },
      { name: 'spent_amount', type: 'decimal(15,2)', desc: '支付金额' },
      { name: 'pay_time', type: 'datetime', desc: '支付时间' },
    ]}
  ];

  const selectedTable = MOCK_TABLES.find(t => t.id === selectedTableId) || MOCK_TABLES[0];

  const handleApply = () => {
    if (applyForm.databases.length === 0) {
      alert("请选择至少一个数据库");
      return;
    }
    
    applyForm.databases.forEach(dbId => {
       const db = AVAILABLE_DATABASES.find(d => d.id === dbId);
       if (db) {
         approvalStore.addApproval({
           project: project.name,
           applicant: '当前用户',
           database: db.name,
           applyTime: new Date().toLocaleString('zh-CN', { hour12: false }).substring(0, 16).replace(/\//g, '-'),
           applyNote: applyForm.note
         });
       }
    });
    
    setApplyForm({ databases: [], note: '' });
    setShowApplyModal(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-normal tracking-tight text-gray-900">数据申请管理</h3>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
            <RefreshCw size={16} />
            <span>手动同步</span>
          </button>
          <button 
            onClick={() => setShowApplyModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
          >
            <Plus size={18} />
            <span>发起申请</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 font-medium">申请数据库名称</th>
              <th className="px-4 py-3 font-medium">申请用途</th>
              <th className="px-4 py-3 font-medium">申请时间</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {projectApprovals.map(approval => (
              <tr key={approval.id}>
                <td className="px-4 py-4 font-medium text-gray-900">{approval.database}</td>
                <td className="px-4 py-4 text-gray-500 max-w-[200px] truncate" title={approval.applyNote}>{approval.applyNote}</td>
                <td className="px-4 py-4 text-gray-500">{approval.applyTime}</td>
                <td className="px-4 py-4">
                  {approval.status === 'approved' && <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase">已通过</span>}
                  {approval.status === 'rejected' && <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase">已驳回</span>}
                  {approval.status === 'pending' && <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase">申请中</span>}
                </td>
                <td className="px-4 py-4">
                  <button 
                    onClick={() => setShowSchemaModal(true)}
                    className={cn("hover:underline", approval.status === 'approved' ? "text-blue-600" : "text-gray-400 cursor-not-allowed")}
                    disabled={approval.status !== 'approved'}
                  >
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
            {projectApprovals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                  当前项目暂无数据申请记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <Database size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">发起数据申请</h2>
                    <p className="text-sm text-gray-500 mt-1">向数据安全管理员提交访问权限请求</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">所属审计项目</label>
                  <input 
                    type="text" 
                    value={project.name} 
                    disabled 
                    className="w-full h-10 px-3 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                    <span>选择所需数据库 <span className="text-red-500">*</span></span>
                    <span className="text-xs font-normal text-gray-500">已选 {applyForm.databases.length} 项</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto p-1">
                    {AVAILABLE_DATABASES.map(db => (
                      <label key={db.id} className="flex items-center w-full p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all select-none">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5"
                          checked={applyForm.databases.includes(db.id as never)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setApplyForm(prev => ({ ...prev, databases: [...prev.databases, db.id as never] }));
                            } else {
                              setApplyForm(prev => ({ ...prev, databases: prev.databases.filter(id => id !== db.id) }));
                            }
                          }}
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          {db.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">申请用途 / 备注 <span className="text-red-500">*</span></label>
                  <textarea 
                    value={applyForm.note}
                    onChange={(e) => setApplyForm(prev => ({ ...prev, note: e.target.value }))}
                    placeholder="请详细描述需要调取该数据的目的和所需要的数据范围..."
                    className="w-full h-24 p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                >
                  取消
                </button>
                <button 
                  onClick={handleApply}
                  disabled={applyForm.databases.length === 0 || !applyForm.note.trim()}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  提交申请
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSchemaModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Database size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-normal text-gray-900 tracking-tight">xxx县财政预算管理库</h2>
                    <p className="text-xs text-gray-500 font-medium">数据库表结构详情</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedTableId}
                    onChange={(e) => setSelectedTableId(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  >
                    {MOCK_TABLES.map(table => (
                      <option key={table.id} value={table.id}>
                        {table.name} ({table.description})
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setShowSchemaModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="space-y-6">
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Table2 size={16} className="text-blue-600" />
                        <span className="font-bold text-gray-900 text-sm">{selectedTable.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{selectedTable.description}</span>
                    </div>
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white text-xs text-gray-400 uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-2 font-medium">字段名</th>
                          <th className="px-4 py-2 font-medium">类型</th>
                          <th className="px-4 py-2 font-medium">说明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedTable.fields.map(field => (
                          <tr key={field.name}>
                            <td className="px-4 py-2 text-xs text-gray-900">{field.name}</td>
                            <td className="px-4 py-2 text-xs text-blue-600">{field.type}</td>
                            <td className="px-4 py-2 text-gray-500 text-xs">{field.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
                <button 
                  onClick={() => setShowSchemaModal(false)}
                  className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScreeningTab({ project }: { project: AuditProject }) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [hasExecuted, setHasExecuted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isModelModalOpen, setIsModelModalOpen] = React.useState(false);
  const [selectedModelId, setSelectedModelId] = React.useState<string | null>('m411');
  const [activeCategoryId, setActiveCategoryId] = React.useState<string>('cat1');
  const [visibleSteps, setVisibleSteps] = React.useState<number>(0);
  const [selectedStepId, setSelectedStepId] = React.useState<number | null>(null);

  const [projectCheckpoints, setProjectCheckpoints] = React.useState<any>(null);
  const [editingCheckpointIndex, setEditingCheckpointIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (selectedModelId) {
      const cps = JSON.parse(JSON.stringify(MOCK_CHECKPOINTS[selectedModelId] || MOCK_CHECKPOINTS['m411']));
      cps.fixed = cps.fixed.map((cp: any) => ({ ...cp, checked: true }));
      cps.configurable = cps.configurable.map((cp: any) => ({ ...cp, checked: true }));
      setProjectCheckpoints(cps);
    } else {
      setProjectCheckpoints(null);
    }
  }, [selectedModelId]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setHasExecuted(true);
    setProgress(0);
    setVisibleSteps(0);
    setSelectedStepId(null);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        const next = prev + 1;
        const currentVisibleSteps = Math.floor((next / 100) * MOCK_EXECUTION_STEPS.length);
        setVisibleSteps(currentVisibleSteps);
        // Automatically select the latest visible step during generation
        if (currentVisibleSteps > 0) {
          setSelectedStepId(currentVisibleSteps);
        }
        return next;
      });
    }, 1200);
  };

  const selectedModel = MOCK_MODELS.find(m => m.id === selectedModelId);
  const checkpoints = selectedModelId ? MOCK_CHECKPOINTS[selectedModelId] || MOCK_CHECKPOINTS['m411'] : null;
  const selectedStep = MOCK_EXECUTION_STEPS.find(s => s.id === selectedStepId);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">已选模型</span>
            <span className="text-sm font-bold text-gray-900">
              {selectedModel ? selectedModel.name : '未选择模型'}
            </span>
          </div>
          <div className="w-[1px] h-8 bg-gray-100" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">数据范围</span>
            <span className="text-sm font-bold text-gray-900">{project.period}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModelModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
          >
            选择模型
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !selectedModelId}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <Play size={18} />
            <span>开始审计</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Checkpoints */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" />
              <h3 className="text-sm font-normal tracking-tight text-gray-900">模型执行审查点</h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {projectCheckpoints ? (
              <>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <div className="w-1 h-3 bg-blue-600 rounded-full" />
                    法定底层固定审查点
                  </h4>
                  <div className="space-y-3">
                    {projectCheckpoints.fixed.map((cp: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:border-blue-100 hover:shadow-sm group flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={cp.checked !== false}
                          onChange={(e) => {
                            const newCp = [...projectCheckpoints.fixed];
                            newCp[idx].checked = e.target.checked;
                            setProjectCheckpoints({...projectCheckpoints, fixed: newCp});
                          }}
                          className="mt-1 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer w-4 h-4 shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900 leading-snug">{cp.title}</p>
                          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{cp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <div className="w-1 h-3 bg-green-600 rounded-full" />
                    可配置业务执行审查点
                  </h4>
                  <div className="space-y-3">
                    {projectCheckpoints.configurable.map((cp: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:border-green-100 hover:shadow-sm">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={cp.checked !== false}
                            onChange={(e) => {
                              const newCp = [...projectCheckpoints.configurable];
                              newCp[idx].checked = e.target.checked;
                              setProjectCheckpoints({...projectCheckpoints, configurable: newCp});
                            }}
                            className="mt-1 w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 cursor-pointer w-4 h-4 shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm font-bold text-gray-900 leading-snug pr-2">{cp.title}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 font-bold rounded shrink-0">可调阈值</span>
                                {editingCheckpointIndex === idx ? (
                                  <button onClick={() => setEditingCheckpointIndex(null)} className="p-1 hover:bg-gray-200 rounded text-green-600">
                                    <Check size={14} />
                                  </button>
                                ) : (
                                  <button onClick={() => setEditingCheckpointIndex(idx)} className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-blue-600">
                                    <Edit2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                            {editingCheckpointIndex === idx ? (
                              <div className="space-y-2 mt-3 bg-white p-2 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-600 font-medium w-10 shrink-0">阈值:</span>
                                  <input 
                                    className="flex-1 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-blue-400 focus:bg-white" 
                                    value={cp.threshold}
                                    onChange={(e) => {
                                      const newCp = [...projectCheckpoints.configurable];
                                      newCp[idx].threshold = e.target.value;
                                      setProjectCheckpoints({...projectCheckpoints, configurable: newCp});
                                    }}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-600 font-medium w-10 shrink-0">依据:</span>
                                  <span className="flex-1 text-[10px] text-gray-500 bg-gray-50 border border-transparent rounded px-2 py-1.5">{cp.basis}</span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-xs text-gray-600 mt-1">阈值：<span className="font-medium">{cp.threshold}</span></p>
                                <p className="text-[10px] text-gray-400 mt-1.5 italic">依据：{cp.basis}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Search size={48} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-sm">请先选择审计模型</p>
              </div>
            )}
          </div>
        </div>

        {/* Middle: Execution Steps */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Cpu size={18} className="text-purple-600" />
            <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900">模型执行步骤</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="relative pl-8 space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              {MOCK_EXECUTION_STEPS.map((step, idx) => {
                const isVisible = idx < visibleSteps || (!isGenerating && hasExecuted);
                const isActive = idx === visibleSteps && isGenerating;
                const isSelected = selectedStepId === step.id;
                
                return (
                  <motion.div 
                    key={step.id}
                    onClick={() => isVisible && setSelectedStepId(step.id)}
                    className={cn(
                      "relative cursor-pointer p-2 rounded-xl transition-all",
                      isSelected ? "bg-purple-50 ring-1 ring-purple-100" : "hover:bg-gray-50",
                      !isVisible && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "absolute -left-[23px] top-4 w-4 h-4 rounded-full border-2 bg-white z-10 transition-all duration-300 flex items-center justify-center",
                      isVisible ? "border-purple-600 bg-purple-600" : "border-gray-200",
                      isActive && "animate-pulse border-purple-400"
                    )}>
                      {isVisible && !isActive && <Check size={10} className="text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-bold",
                          isVisible ? "text-gray-900" : "text-gray-400"
                        )}>
                          {step.id}. {step.name}
                        </span>
                        {isActive && (
                          <span className="text-[10px] text-purple-600 font-bold animate-pulse">执行中...</span>
                        )}
                      </div>
                      <p className={cn(
                        "text-[11px] mt-0.5 leading-relaxed",
                        isVisible ? "text-gray-500" : "text-gray-300"
                      )}>
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Execution Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <FileText size={18} className="text-orange-600" />
            <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900">执行过程详情</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedStep ? (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 border-l-4 border-orange-500 pl-3 py-1 bg-orange-50/50 rounded-r-lg">
                  {selectedStep.content.title}
                </h4>
                
                {selectedStep.content.type === 'table' && (
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-gray-50 text-gray-500 font-bold">
                        <tr>
                          {selectedStep.content.headers.map((h: string, i: number) => (
                            <th key={i} className="px-3 py-2">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedStep.content.data.map((row: string[], i: number) => (
                          <tr key={i} className="hover:bg-gray-50/50">
                            {row.map((cell: string, j: number) => (
                              <td key={j} className="px-3 py-2 text-gray-600">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedStep.content.type === 'code' && (
                  <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-[11px] text-blue-400 font-mono leading-relaxed">
                      <code>{selectedStep.content.code}</code>
                    </pre>
                  </div>
                )}

                {selectedStep.content.type === 'list' && (
                  <div className="space-y-2">
                    {selectedStep.content.items.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5" />
                        <span className="text-[11px] text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedStep.content.type === 'info' && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      {selectedStep.content.text}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <FileText size={48} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-sm">点击步骤查看详情</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Selection Modal */}
      <AnimatePresence>
        {isModelModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModelModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[600px]"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">选择审计模型</h3>
                <button onClick={() => setIsModelModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                {/* Left Tree */}
                <div className="w-64 border-r border-gray-100 overflow-y-auto p-4 bg-gray-50/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 p-2 text-sm font-bold text-gray-900">
                      <ChevronRight size={16} className="rotate-90" />
                      <span>审计模型</span>
                    </div>
                    <div className="pl-4 space-y-1">
                      {MODEL_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategoryId(cat.id)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                            activeCategoryId === cat.id 
                              ? "bg-blue-50 text-blue-600 font-bold" 
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right List */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                  <div className="grid grid-cols-1 gap-4">
                    {MOCK_MODELS.filter(m => m.categoryId === activeCategoryId).map(model => (
                      <div 
                        key={model.id}
                        onClick={() => setSelectedModelId(model.id)}
                        className={cn(
                          "p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4",
                          selectedModelId === model.id 
                            ? "border-blue-600 bg-blue-50/50" 
                            : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                        )}
                      >
                        <div className="pt-1">
                          <div className={cn(
                            "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                            selectedModelId === model.id 
                              ? "border-blue-600 bg-blue-600" 
                              : "border-gray-300 bg-white"
                          )}>
                            {selectedModelId === model.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{model.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{model.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModelModalOpen(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => setIsModelModalOpen(false)}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                >
                  确认选择
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuspicionTab({ suspicions, onGenerateEvidence }: { suspicions: SuspicionRecord[], onGenerateEvidence: (selectedIds: string[], templateId: string) => void }) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState('t1'); // Default to general evidence template
  const [selectedLawItem, setSelectedLawItem] = React.useState<string | null>(null);
  const [isLawModalOpen, setIsLawModalOpen] = React.useState(false);
  const [selectedSourceSuspicion, setSelectedSourceSuspicion] = React.useState<SuspicionRecord | null>(null);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = React.useState(false);

  const toggleAll = () => {
    if (selectedIds.length === suspicions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(suspicions.map(s => s.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">疑点数据列表</h3>
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <span className="text-sm text-gray-500">已选 {selectedIds.length} 项</span>
            )}
            <button 
              disabled={selectedIds.length === 0}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
              <span>生成取证单</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 font-medium w-10">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500" 
                    checked={selectedIds.length === suspicions.length && suspicions.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-3 font-medium">疑点描述</th>
                <th className="px-4 py-3 font-medium">涉及金额 (元)</th>
                <th className="px-4 py-3 font-medium">风险等级</th>
                <th className="px-4 py-3 font-medium">关联法规</th>
                <th className="px-4 py-3 font-medium">数据溯源</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {suspicions.map((s) => (
                <tr key={s.id} className={cn(
                  "hover:bg-gray-50/50 transition-colors",
                  selectedIds.includes(s.id) && "bg-blue-50/30"
                )}>
                  <td className="px-4 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-600 focus:ring-blue-500" 
                      checked={selectedIds.includes(s.id)}
                      onChange={() => toggleOne(s.id)}
                    />
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 max-w-md">{s.description}</td>
                  <td className="px-4 py-4 text-gray-500">{s.amount.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-bold rounded uppercase",
                      s.level === 'high' ? "bg-red-50 text-red-600" :
                      s.level === 'medium' ? "bg-orange-50 text-orange-600" :
                      "bg-blue-50 text-blue-600"
                    )}>
                      {s.level === 'high' ? '高风险' : s.level === 'medium' ? '中风险' : '低风险'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-blue-600 hover:underline cursor-pointer" onClick={() => { setSelectedLawItem(s.law); setIsLawModalOpen(true); }}>{s.law}</td>
                  <td className="px-4 py-4">
                    {s.sourceType ? (
                      <button 
                        onClick={() => { setSelectedSourceSuspicion(s); setIsSourceDrawerOpen(true); }}
                        className="flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Search size={14} />
                        查看溯源
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">暂无溯源信息</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">选择取证单模板</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20}/>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div 
                  onClick={() => setSelectedTemplate('t1')}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3",
                    selectedTemplate === 't1' ? "border-blue-600 bg-blue-50/50" : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center shrink-0",
                    selectedTemplate === 't1' ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                  )}>
                    {selectedTemplate === 't1' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">通用取证单模版</h4>
                    <p className="text-xs text-gray-500 mt-1">适用于大多数常规审计发现问题的取证记录。</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    onGenerateEvidence(selectedIds, selectedTemplate);
                    setIsModalOpen(false);
                    setSelectedIds([]); // Clear selection after generating
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                >
                  确认生成
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Law/Knowledge Base Viewer Drawer */}
      <AnimatePresence>
        {isLawModalOpen && selectedLawItem && (
          <div className="fixed inset-0 z-[70] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLawModalOpen(false)}
              className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">关联法规/文档</h2>
                  </div>
                </div>
                <button 
                  onClick={() => setIsLawModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto bg-white flex-1 text-sm text-gray-700 leading-relaxed">
                <h3 className="font-bold text-lg text-gray-900 mb-4">{selectedLawItem}</h3>
                <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100 mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">匹配条款展示</h4>
                  <p className="whitespace-pre-wrap flex flex-col gap-2">
                    <span>此处为系统通过大模型辅助自动匹配的『{selectedLawItem}』相关内容解读及片段补充展示。</span>
                    <span className="text-gray-500 mt-2">在实际生产系统中，该内容将直接从法律知识库或审计资料知识库中提取对应的切片段落并呈现。</span>
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsLawModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Source Trace Drawer */}
      <AnimatePresence>
        {isSourceDrawerOpen && selectedSourceSuspicion && selectedSourceSuspicion.sourceType && (
          <div className="fixed inset-0 z-[80] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSourceDrawerOpen(false)}
              className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col border-l border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                    <Database size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">数据溯源快照</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      来源: {selectedSourceSuspicion.sourceType === 'database' ? '结构化数据库' : '非结构化文档'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSourceDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                <div className="space-y-6">
                  {selectedSourceSuspicion.sourceType === 'database' && selectedSourceSuspicion.sourceDetails && (
                    <>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">数据来源路径</h4>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-medium">{selectedSourceSuspicion.sourceDetails.dbName}</span>
                          <span className="text-gray-400">/</span>
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium">{selectedSourceSuspicion.sourceDetails.tableName}</span>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <h4 className="text-sm font-bold text-gray-900">疑点数据快照</h4>
                        </div>
                        <div className="p-0 overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <tbody className="divide-y divide-gray-100">
                              {selectedSourceSuspicion.sourceDetails.dataSnapshot && typeof selectedSourceSuspicion.sourceDetails.dataSnapshot === 'object' ? (
                                Object.entries(selectedSourceSuspicion.sourceDetails.dataSnapshot as Record<string, any>).map(([key, value]) => (
                                  <tr key={key} className="hover:bg-gray-50">
                                    <td className="px-4 py-2.5 font-medium text-gray-500 bg-gray-50/50 w-1/3 border-r border-gray-100">{key}</td>
                                    <td className="px-4 py-2.5 text-gray-900 font-mono text-xs max-w-xs truncate" title={String(value)}>{value}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td className="p-4 text-gray-500">{JSON.stringify(selectedSourceSuspicion.sourceDetails.dataSnapshot)}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedSourceSuspicion.sourceType === 'document' && selectedSourceSuspicion.sourceDetails && (
                    <>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FileText size={14} className="text-purple-600" />
                          关联文档
                        </h4>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-2 bg-red-50 text-red-600 rounded-lg">
                            <FileText size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{selectedSourceSuspicion.sourceDetails.documentName}</p>
                            <p className="text-xs text-gray-500 mt-1">{selectedSourceSuspicion.sourceDetails.chapter}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <h4 className="text-sm font-bold text-gray-900">文本片段</h4>
                        </div>
                        <div className="p-4 bg-[#fdfbf7] font-serif text-gray-800 leading-relaxed text-sm">
                          {selectedSourceSuspicion.sourceDetails.fragment?.split('...').map((part, i) => (
                            <span key={i}>
                              {i > 0 && <span className="text-red-500 font-bold bg-red-50 px-1 rounded">...</span>}
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EvidenceTab({ evidences, setEvidences, onGenerateWorkingPaper }: { evidences: Evidence[], setEvidences: (evidences: Evidence[]) => void, onGenerateWorkingPaper: (selectedIds: string[], templateId: string) => void }) {
  const [editingEvidence, setEditingEvidence] = React.useState<Evidence | null>(null);
  const [viewingEvidence, setViewingEvidence] = React.useState<Evidence | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState('wp1'); // Default to general working paper template
  const contentRef = React.useRef<HTMLDivElement>(null);

  const toggleAll = () => {
    if (selectedIds.length === evidences.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(evidences.map(e => e.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handlePrint = () => {
    if (!contentRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('请允许浏览器弹出窗口以进行打印/导出');
      return;
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${viewingEvidence?.title || '审计取证单'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              @page { margin: 15mm; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            body { font-family: sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
            th, td { border: 1px solid #1f2937; padding: 0.75rem; text-align: left; }
            th { background-color: #f9fafb; font-weight: 600; }
            p { margin-bottom: 0.5rem; }
            h1, h2, h3, h4, h5, h6 { margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; }
          </style>
        </head>
        <body class="bg-white p-6 text-gray-900">
          <div class="max-w-4xl mx-auto">
            ${contentRef.current.innerHTML}
          </div>
          <script>
            setTimeout(() => {
              window.print();
            }, 1000);
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvidence) {
      setEvidences(evidences.map(ev => ev.id === editingEvidence.id ? editingEvidence : ev));
      setEditingEvidence(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">取证单管理</h3>
          <div className="flex items-center gap-2 ml-4">
            <input 
              type="checkbox" 
              className="rounded text-blue-600 focus:ring-blue-500" 
              checked={selectedIds.length === evidences.length && evidences.length > 0}
              onChange={toggleAll}
              id="selectAllEvidences"
            />
            <label htmlFor="selectAllEvidences" className="text-sm text-gray-600 cursor-pointer">全选</label>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <span className="text-sm text-gray-500">已选 {selectedIds.length} 项</span>
          )}
          <button 
            disabled={selectedIds.length === 0}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            <span>新建底稿编制</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidences.map((evidence) => (
            <div 
              key={evidence.id} 
              onClick={() => setViewingEvidence(evidence)}
              className={cn(
                "p-4 border rounded-xl hover:shadow-md transition-all group cursor-pointer relative",
                selectedIds.includes(evidence.id) ? "border-blue-500 bg-blue-50/30" : "border-gray-100 hover:border-blue-200"
              )}
            >
              <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" 
                  checked={selectedIds.includes(evidence.id)}
                  onChange={() => toggleOne(evidence.id)}
                />
              </div>
              <div className="flex items-start justify-between mb-3 pr-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{evidence.title}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">V{evidence.version}.0</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setViewingEvidence(evidence); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                    title="查看"
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingEvidence(evidence); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                    title="编辑"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEvidences(evidences.filter(ev => ev.id !== evidence.id)); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                    title="删除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>编制人：张审计</span>
                <span>最后更新：{new Date(evidence.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {viewingEvidence && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingEvidence(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">查看取证单</h3>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-widest">
                    V{viewingEvidence.version}.0
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePrint()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Download size={14} />
                    <span>导出PDF / 打印</span>
                  </button>
                  <button 
                    onClick={() => {
                      setEditingEvidence(viewingEvidence);
                      setViewingEvidence(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={14} />
                    <span>编辑</span>
                  </button>
                  <button onClick={() => setViewingEvidence(null)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={20}/>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div ref={contentRef} className="max-w-3xl mx-auto prose prose-blue prose-sm md:prose-base prose-td:border-gray-800 prose-th:border-gray-800">
                  {viewingEvidence.content ? (
                    <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeRaw]}>{viewingEvidence.content}</ReactMarkdown>
                  ) : (
                    <div className="text-center text-gray-400 py-12">暂无内容</div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {editingEvidence && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingEvidence(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">编辑取证单</h3>
                <button onClick={() => setEditingEvidence(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20}/>
                </button>
              </div>
              <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">取证单标题</label>
                  <input 
                    type="text" 
                    required
                    value={editingEvidence.title}
                    onChange={e => setEditingEvidence({...editingEvidence, title: e.target.value})}
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">取证单内容 (Markdown)</label>
                  <textarea 
                    value={editingEvidence.content}
                    onChange={e => setEditingEvidence({...editingEvidence, content: e.target.value})}
                    className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                    placeholder="请输入 Markdown 格式的取证单内容..."
                  />
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setEditingEvidence(null)}
                    className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    保存修改
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">选择底稿模板</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20}/>
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    { id: 'wp1', name: '通用底稿模板', desc: '适用于常规审计事项的底稿编制' }
                  ].map(template => (
                    <div 
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selectedTemplate === template.id 
                          ? "border-blue-600 bg-blue-50/50" 
                          : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900">{template.name}</h4>
                        {selectedTemplate === template.id && (
                          <CheckCircle2 size={18} className="text-blue-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{template.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    onGenerateWorkingPaper(selectedIds, selectedTemplate);
                    setIsModalOpen(false);
                    setSelectedIds([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-500/20"
                >
                  确认生成
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WorkingPaperTab({ papers, setPapers }: { papers: WorkingPaper[], setPapers: (papers: WorkingPaper[]) => void }) {
  const [editingPaper, setEditingPaper] = React.useState<WorkingPaper | null>(null);
  const [viewingPaper, setViewingPaper] = React.useState<WorkingPaper | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!contentRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('请允许浏览器弹出窗口以进行打印/导出');
      return;
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${viewingPaper?.title || '审计工作底稿'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              @page { margin: 15mm; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            body { font-family: sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
            th, td { border: 1px solid #1f2937; padding: 0.75rem; text-align: left; }
            th { background-color: #f9fafb; font-weight: 600; }
            p { margin-bottom: 0.5rem; }
            h1, h2, h3, h4, h5, h6 { margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; }
          </style>
        </head>
        <body class="bg-white p-6 text-gray-900">
          <div class="max-w-4xl mx-auto">
            ${contentRef.current.innerHTML}
          </div>
          <script>
            setTimeout(() => {
              window.print();
            }, 1000);
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPaper) {
      setPapers(papers.map(wp => wp.id === editingPaper.id ? editingPaper : wp));
      setEditingPaper(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">审计底稿管理</h3>
      </div>
      
      {papers.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheck size={32} className="text-gray-300" />
          </div>
          <h4 className="text-lg font-medium text-gray-900">暂无审计底稿</h4>
          <p className="text-gray-500 mt-1 max-w-sm mx-auto">
            您可以基于已生成的取证单快速生成审计底稿，或手动创建。
          </p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {papers.map((paper) => (
              <div 
                key={paper.id} 
                onClick={() => setViewingPaper(paper)}
                className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{paper.title}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">V{paper.version}.0</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setViewingPaper(paper); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                      title="查看"
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingPaper(paper); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                      title="编辑"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPapers(papers.filter(p => p.id !== paper.id)); }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>编制人：张审计</span>
                  <span>最后更新：{new Date(paper.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {viewingPaper && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingPaper(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">查看审计底稿</h3>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase tracking-widest">
                    V{viewingPaper.version}.0
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePrint()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Download size={14} />
                    <span>导出PDF / 打印</span>
                  </button>
                  <button 
                    onClick={() => {
                      setEditingPaper(viewingPaper);
                      setViewingPaper(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={14} />
                    <span>编辑</span>
                  </button>
                  <button onClick={() => setViewingPaper(null)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={20}/>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div ref={contentRef} className="max-w-3xl mx-auto prose prose-blue prose-sm md:prose-base prose-td:border-gray-800 prose-th:border-gray-800">
                  {viewingPaper.content ? (
                    <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeRaw]}>{viewingPaper.content}</ReactMarkdown>
                  ) : (
                    <div className="text-center text-gray-400 py-12">暂无内容</div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {editingPaper && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingPaper(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">编辑审计底稿</h3>
                <button onClick={() => setEditingPaper(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20}/>
                </button>
              </div>
              <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">底稿标题</label>
                  <input 
                    type="text" 
                    required
                    value={editingPaper.title}
                    onChange={e => setEditingPaper({...editingPaper, title: e.target.value})}
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">底稿内容 (Markdown)</label>
                  <textarea 
                    value={editingPaper.content}
                    onChange={e => setEditingPaper({...editingPaper, content: e.target.value})}
                    className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                    placeholder="请输入 Markdown 格式的底稿内容..."
                  />
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setEditingPaper(null)}
                    className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    保存修改
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReportTab({ initialReports }: { initialReports: AuditReport[] }) {
  const [reports, setReports] = React.useState(initialReports);
  const [viewingReport, setViewingReport] = React.useState<AuditReport | null>(null);
  const [editingReport, setEditingReport] = React.useState<AuditReport | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const reportContentRef = React.useRef<HTMLDivElement>(null);

  const REPORT_TEMPLATE = `<div style="text-align: center; margin-top: 100px;">
  <h1 style="font-size: 36px; font-weight: bold;">审计报告</h1>
  <br/><br/>
  <h2 style="font-size: 24px; font-weight: bold;">xxx 县财政预算</h2>
  <br/><br/>
  <p style="font-size: 18px; font-weight: bold;">编号：XTSJ-2025-YSZX-001</p>
</div>

<div style="page-break-after: always;"></div>

# 一、审计概况

## （一）审计依据

根据《中华人民共和国审计法》第十八条、第十九条，《中华人民共和国预算法》第十二条、第十三条、第三十二条、第五十三条、第六十七条、第七十条、第七十二条，《中华人民共和国预算法实施条例》第四十一条、第四十三条、第五十五条、第五十七条、第六十条，《中华人民共和国国家审计准则》第九十四条，《财政违法行为处罚处分条例》第七条，审计署《中央部门预算执行计算机审计方法体系》，《河北省县级财政预算管理业务操作规程》，邢台市审计局《县级部门预算执行审计操作指南》《审计项目质量控制办法》等法律法规和制度规定，对 xxx 县 2025 年 1-9 月部门预算执行情况进行审计。

## （二）审计范围

审计期间：2025 年 1 月 1 日至 2025 年 12 月 31 日

审计对象：xxx 县农业农村局、教育局、卫生健康局、交通运输局四个部门

审计内容：上述部门 2025 年预算编制、预算执行、预算调整、资金使用、决算编制等环节的合规性，重点核查无预算支出、超预算支出、预算调整无审批、资金闲置、预算科目错位、违规追加预算等问题。

## （三）审计方法

本次审计采用预算编制/执行合规性审计模型（SKILL-CZSZ-001-YSZX V1.0.0）进行全量数据自动化筛查，结合人工核查、现场取证、延伸调查等方法。通过读取县级财政预算管理系统、行政事业单位财务核算系统、国库集中支付系统等数据源的结构化数据，运用 SQL 执行器、预算执行率计算器、多表合规性比对器等原子工具，对预算批复、执行、调整、资金拨付等数据进行交叉比对，筛查疑点后进行人工核实取证。

## （四）审计时间

审计准备时间：2025 年 9 月 25 日至 2025 年 10 月 7 日
现场审计时间：2025 年 10 月 8 日至 2026 年 3 月 20 日
报告撰写时间：2026 年 3 月 21 日至 2026 年 4 月 10 日

# 二、审计总体评价

2025 年 1-9 月，xxx 县农业农村局、教育局、卫生健康局、交通运输局四个部门基本能够按照《中华人民共和国预算法》及相关规定开展预算管理工作，预算编制基本规范，预算执行总体平稳，大部分财政资金能够按照批复的用途使用，为县域经济社会发展提供了有力保障。

但审计也发现，上述部门在预算执行过程中仍存在一些不容忽视的问题，主要表现为：无预算支出、大额支出无审批、预算科目串用、超预算支出、违规追加预算、预算资金长期闲置等。这些问题反映出部分单位预算刚性约束意识不强，内部控制制度执行不到位，资金使用效益有待进一步提高。

# 三、审计发现的问题及整改建议

## （一）无预算支出问题

**具体问题：**
2025 年 6 月 18 日，县农业农村局支付 xxx 县蓝天大酒店上级调研接待餐费 12,800.00 元（凭证号：JZ-2025-06-067），该笔支出无对应预算批复单号（approval_id 为 NULL），未纳入年初预算管理，也未办理临时预算补充审批手续，违反了《中华人民共和国预算法》第十三条“各级政府、各部门、各单位的支出必须以经批准的预算为依据，未列入预算的不得支出”的规定。

**整改建议：**
县农业农村局应立即对该笔无预算支出进行整改，严格按照预算管理规定补办相关审批手续，明确资金来源。各部门应加强预算刚性约束意识，严格执行“无预算不支出”原则，确需发生的临时支出，必须按规定程序办理预算追加手续。

## （二）大额支出无审批问题

**具体问题：**
2025 年 4 月 12 日，县农业农村局支付 xxx 县宏达印刷厂乡村振兴宣传手册印刷费 28,500.00 元（凭证号：JZ-2025-04-032），该笔支出无审批文件（has_approval_doc=0），且超出日常零星采购标准（一般超 5000 元需政府采购或三方比价手续）。

2025 年 8 月 22 日，县卫生健康局支付 xxx 县医疗器械公司彩色 B 超设备采购款 720,000.00 元（凭证号：JZ-2025-08-101），该笔支出属于政府采购范围，但无审批文件（has_approval_doc=0），未按规定履行政府采购程序。

上述问题违反了《中华人民共和国预算法》第七十二条及政府采购相关规定。

**整改建议：**
县农业农村局、卫生健康局应立即对上述大额支出无审批问题进行整改，补充完善相关审批手续和采购资料。各部门应建立健全大额支出审批制度，明确审批权限和流程，严格执行政府采购规定，确保支出合规。

## （三）预算科目串用问题

**具体问题：**
2025 年 5 月 20 日，县住建局支付 xxx 县建筑安装公司局机关办公楼外墙维修费 850,000.00 元（凭证号：JZ-2025-05-089），该笔支出在“其他普通教育支出”科目（科目代码：2050299）列支，但实际用途为行政办公类维修，未使用房屋修缮专项科目，违反了《中华人民共和国预算法实施条例》第五十七条的规定。

**整改建议：**
县住建局应立即对该笔预算科目串用问题进行整改，调整相关会计账目，确保预算支出与批复科目一致。各部门应加强预算科目管理，严格按照批复的预算科目执行支出，确需调剂使用预算资金的，必须按规定程序办理审批手续。

## （四）违规追加预算问题

**具体问题：**
2025 年 7 月 5 日，县卫生健康局追加县医院发热门诊改造应急工程预算 450,000.00 元（调整单号：TZ2025005），审批机构仅为县卫健局党组会，未报县政府审批，且未见应急管理部门出具的应急工程认定文件。

2025 年 8 月 1 日，县农业农村局追加行政运行经费 60,000.00 元（调整单号：TZ2025006），审批层级仅为局长办公会，理由为“弥补局机关办公经费不足”，不符合预算追加的法定情形（重大政策调整或突发事件）。

上述问题违反了《中华人民共和国预算法》第六十七条的规定。

**整改建议：**
县卫生健康局、农业农村局应立即撤销上述违规追加的预算，收回相关资金，并按规定程序重新办理预算调整手续。各部门应严格执行预算调整审批程序，规范预算追加行为，不得擅自扩大预算调整范围和审批权限。

## （五）超预算支出问题

**具体问题：**
2025 年 9 月 2 日，县农业农村局支付绿化苗木款 550,000.00 元（凭证号详见审计底稿），该笔支出对应的项目为“巩固脱贫攻坚成果衔接资金”（科目代码：2130599），年初预算金额 23,500,000.00 元。截至支付当日，该项目累计支出已超出预算额度，且无合规审批手续，违反了《中华人民共和国预算法》第七十二条“严格控制不同预算科目、预算级次或者项目间的预算资金的调剂”的规定。

**整改建议：**
县农业农村局应立即对该笔超预算支出进行整改，调整相关账目，追回超预算资金或按规定程序补办预算调剂手续。各部门应加强预算执行监控，严禁无审批超预算支出，确需超预算的必须依法报批。

## （六）预算资金闲置问题

**具体问题：**
截至 2025 年 9 月 30 日，部分项目预算资金长期闲置未使用，且无任何书面说明和处置计划：

**农村人居环境整治专项项目**（项目编号：XM2025-002），资金到账日期为 2025 年 2 月 1 日，闲置天数 240 天，闲置金额 5,800,000.00 元，未发生任何支出。

**县医院设备购置项目**（项目编号：XM2025-004），资金到账日期为 2025 年 1 月 15 日，闲置天数 221 天，预算金额 3,600,000.00 元，仅支出 380,000.00 元，完成率 10.5%。

**水系连通及水美乡村建设试点项目**（项目编号：XM2025-006），资金到账日期为 2024 年 11 月 10 日，闲置天数 324 天，闲置金额 21,000,000.00 元，未发生任何支出。

上述问题违反了审计署《财政存量资金审计实务指引》及《河北省县级财政预算管理业务操作规程》关于加快预算执行进度、提高资金使用效益的相关规定，造成财政资金沉淀，影响了资金使用效益。

**整改建议：**
县农业农村局、卫生健康局应立即对上述闲置资金项目进行梳理，加快项目实施进度，尽快形成实际支出。对于确实无法实施的项目，应按规定将闲置资金上缴财政统筹使用。各部门应加强项目前期准备工作，提高预算编制的科学性和准确性，避免资金闲置浪费。

# 四、审计结论

本次审计共发现 xxx 县农业农村局、教育局、卫生健康局、交通运输局四个部门在 2025 年 1-9 月预算执行过程中存在 **6 类 10 个问题**，涉及金额 **33,071,300.00 元**。

各被审计单位应高度重视审计发现的问题，切实采取有效措施进行整改。整改工作应于 2025 年 12 月 31 日前完成，并将整改情况书面报送县审计局。县审计局将对整改情况进行跟踪检查，对整改不到位的单位，将依法依规追究相关人员的责任。

# 五、其他事项

## （一）报告使用范围

本报告仅供 xxx 县委、县政府、县人大常委会及相关部门使用，未经县审计局批准，不得对外公开。

## （二）资料真实性声明

被审计单位对其提供的与审计相关的会计资料、其他证明材料的真实性和完整性负责。

## （三）异议复核程序

被审计单位如对本审计报告有议，可在收到审计报告之日起 10 日内，向县审计局书面申请复核。县审计局将在收到复核申请之日起 30 日内作出复核决定。

<div style="text-align: right; margin-top: 40px; line-height: 1.2;">
  <p style="margin-bottom: 4px;"><strong>审计组组长：</strong> ________________________</p>
  <p style="margin-bottom: 4px;"><strong>审计组成员：</strong> ________________________</p>
  <p style="margin-bottom: 4px;"><strong>审计报告出具日期：</strong> ________________________</p>
  <p style="margin-bottom: 4px;"><strong>被审计单位签收人：</strong> ________________________</p>
  <p style="margin-bottom: 0;"><strong>签收日期：</strong> ________________________</p>
</div>`;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const baseTitle = 'xxx县财政预算审计报告';
      const existingVersions = reports
        .filter(r => r.title.startsWith(baseTitle))
        .map(r => {
          const match = r.title.match(/-v(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
      
      const nextVersion = existingVersions.length > 0 ? Math.max(...existingVersions) + 1 : 1;
      const newTitle = `${baseTitle}-v${nextVersion}`;

      const newReport: AuditReport = {
        id: 'r' + Date.now(),
        title: newTitle,
        status: 'draft',
        type: 'first',
        author: 'AI助手',
        content: REPORT_TEMPLATE,
        updatedAt: Date.now()
      };
      setReports([newReport, ...reports]);
      setIsGenerating(false);
      setViewingReport(newReport);
    }, 1500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReport) {
      setReports(reports.map(r => r.id === editingReport.id ? editingReport : r));
      setEditingReport(null);
    }
  };

  const handleExport = (report: AuditReport) => {
    const blob = new Blob([report.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReportPrint = () => {
    if (!reportContentRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('请允许浏览器弹出窗口以进行打印/导出');
      return;
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${viewingReport?.title || '审计报告'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              @page { 
                size: A4;
                margin: 20mm 25mm; 
              }
              body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
              }
            }
            body { 
              font-family: "SimSun", "STSong", serif; 
              line-height: 1.6;
              color: #000;
            }
            .report-content p { 
              text-indent: 2em; 
              margin-bottom: 0.8rem;
              text-align: justify;
              line-height: 1.8;
            }
            .report-content h1, .report-content h2, .report-content h3 { 
              text-indent: 0; 
              margin-top: 1.5rem; 
              margin-bottom: 1rem; 
              font-weight: bold;
              line-height: 1.4;
            }
            .report-content h1 { font-size: 24pt; text-align: center; margin-bottom: 2rem; }
            .report-content h2 { font-size: 18pt; border-bottom: none; }
            .report-content h3 { font-size: 15pt; }
            .report-content strong { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; text-indent: 0; }
            th, td { border: 1px solid #000; padding: 0.5rem; text-align: left; text-indent: 0; }
            .report-content div[style*="text-align: right"] p {
              text-indent: 0;
            }
          </style>
        </head>
        <body class="bg-white p-0">
          <div class="report-content">
            ${reportContentRef.current.innerHTML}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <FileText size={40} />
        </div>
        <h3 className="text-lg font-normal text-gray-900 tracking-tight mb-2">生成审计报告</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
          系统将调用大模型，结合本项目已编制的底稿与取证单，自动生成符合《国家审计准则》格式的审计报告初稿。
        </p>
        
        <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <><RefreshCw size={18} className="animate-spin" /> 生成中...</>
            ) : (
              <><BrainCircuit size={18} /> 一键生成报告</>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">报告列表</h3>
        </div>
        
        {reports.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">暂无生成的报告</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  onClick={() => setViewingReport(report)}
                  className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">{report.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className={cn("w-2 h-2 rounded-full", report.status === 'final' ? 'bg-green-500' : 'bg-orange-500')}></span>
                          {report.status === 'final' ? '定稿' : '草稿'}
                        </span>
                        <span>编制人：{report.author}</span>
                        <span>更新时间：{new Date(report.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setViewingReport(report); }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="查看"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleExport(report); }}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                      title="导出"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingReport(report); }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="编辑"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setReports(reports.filter(r => r.id !== report.id)); }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewingReport && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingReport(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">查看审计报告</h3>
                  <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-widest", viewingReport.status === 'final' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600')}>
                    {viewingReport.status === 'final' ? '定稿' : '草稿'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleReportPrint()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Download size={14} />
                    <span>导出PDF / 打印</span>
                  </button>
                  <button 
                    onClick={() => {
                      setEditingReport(viewingReport);
                      setViewingReport(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={14} />
                    <span>编辑</span>
                  </button>
                  <button onClick={() => setViewingReport(null)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={20}/>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-gray-100/50">
                <div ref={reportContentRef} className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg p-[20mm] prose prose-blue prose-sm md:prose-base prose-td:border-gray-800 prose-th:border-gray-800 report-preview">
                  {viewingReport.content ? (
                    <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeRaw]}>{viewingReport.content}</ReactMarkdown>
                  ) : (
                    <div className="text-center text-gray-400 py-12">暂无内容</div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {editingReport && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingReport(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">编辑审计报告</h3>
                <button onClick={() => setEditingReport(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20}/>
                </button>
              </div>
              <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 shrink-0 flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">报告标题</label>
                    <input 
                      type="text" 
                      required
                      value={editingReport.title}
                      onChange={e => setEditingReport({...editingReport, title: e.target.value})}
                      className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                    <select 
                      value={editingReport.status}
                      onChange={e => setEditingReport({...editingReport, status: e.target.value as 'draft' | 'final'})}
                      className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                    >
                      <option value="draft">草稿</option>
                      <option value="final">定稿</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">报告内容 (Markdown)</label>
                  <textarea 
                    value={editingReport.content}
                    onChange={e => setEditingReport({...editingReport, content: e.target.value})}
                    className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                    placeholder="请输入 Markdown 格式的报告内容..."
                  />
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setEditingReport(null)}
                    className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    保存修改
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
