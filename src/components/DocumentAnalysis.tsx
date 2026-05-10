import React from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter,
  FileSearch,
  Copy,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Download,
  MoreVertical,
  Plus,
  ArrowRight,
  ArrowLeft,
  Bot,
  Zap,
  Book,
  ArrowUp,
  FileCode,
  ShieldAlert,
  ArrowUpDown,
  FileCheck2,
  Table as TableIcon,
  Library,
  List,
  Check,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AnalyzableDocument, ComparisonResult, AnalysisExtractionResult, Message, KNOWLEDGE_BASES } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

const SAMPLE_KB_DOCS = [
  { id: 'kb-inv-1', name: '增值税专用发票示例_北京华胜科技有限公司.pdf', kbId: 'audit_data', type: 'invoice' },
  { id: 'kb-bid-1', name: '2024年市政监控扩容项目投标文件_中信系统集成.pdf', kbId: 'audit_data', type: 'bid' },
  { id: 'kb-con-1', name: '智能化工程承包合同_龙湖熙上二期项目.docx', kbId: 'audit_data', type: 'contract' },
  { id: 'kb-ten-1', name: '2024年市政道路建设工程招标公告.pdf', kbId: 'audit_data', type: 'tender_announcement' },
  { id: 'kb1', name: '2024年市属企业财务监督检查工作指南.pdf', kbId: 'audit_data' },
  { id: 'kb2', name: '关于进一步加强政府投资项目审计工作的通知.docx', kbId: 'laws' },
  { id: 'kb3', name: '基建工程项目招标文件通用模板2023版.pdf', kbId: 'personal' },
  { id: 'kb4', name: '审计署关于内部审计工作的规定.pdf', kbId: 'laws' },
  { id: 'kb5', name: '国有企业领导人员经济责任审计操作指引.pdf', kbId: 'audit_data' },
  { id: 'kb6', name: '中华人民共和国审计法(2021修正).pdf', kbId: 'laws' },
  { id: 'kb7', name: '项目成本控制审计典型案例集.pdf', kbId: 'audit_data' },
  { id: 'kb8', name: '个人审计笔记-招投标疑点识别机制.txt', kbId: 'personal' },
  { id: 'kb9', name: '2023年度财政支出绩效评价报告汇总.pdf', kbId: 'audit_data' },
  { id: 'kb10', name: '固定资产投资审计常见问题手册.pdf', kbId: 'audit_data' },
  { id: 'kb11', name: '工程造价审计实务与案例分析.pdf', kbId: 'audit_data' },
  { id: 'kb12', name: '审计取证技巧与底稿编制规范演练.pdf', kbId: 'audit_data' },
  { id: 'kb13', name: '往年投标文件及评分标准参考.docx', kbId: 'personal' },
  { id: 'kb14', name: '招标疑点自查清单-基建类.xlsx', kbId: 'personal' },
  { id: 'kb15', name: '2024年个人工作总结与审计计划.docx', kbId: 'personal' },
];

const SAMPLE_DOCS: AnalyzableDocument[] = [
  {
    id: 'doc-inv',
    name: '增值税专用发票_华胜科技_00124896.pdf',
    size: 1024 * 450,
    type: 'application/pdf',
    source: 'library',
    format: 'pdf',
    status: 'completed',
    progress: 100,
    selected: false,
    suggestedModel: 'invoice'
  },
  {
    id: 'doc-bid',
    name: '市政监控项目投标文件_中信系统集成.pdf',
    size: 1024 * 1024 * 12.5,
    type: 'application/pdf',
    source: 'library',
    format: 'pdf',
    status: 'completed',
    progress: 100,
    selected: false,
    suggestedModel: 'bid'
  },
  {
    id: 'doc-con',
    name: '2024年市政道路建设工程招标公告.pdf',
    size: 1024 * 780,
    type: 'application/pdf',
    source: 'library',
    format: 'pdf',
    status: 'completed',
    progress: 100,
    selected: false,
    suggestedModel: 'tender_announcement'
  },
  {
    id: 'doc-1',
    name: '龙湖熙上智能化工程承包合同.docx',
    size: 1024 * 1024 * 2.5,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    source: 'library',
    format: 'docx',
    status: 'completed',
    progress: 100,
    selected: false,
    suggestedModel: 'contract'
  }
];

interface AnalysisExtractionField {
  label: string;
  value: string;
  status: 'normal' | 'warning' | 'error';
  sourceLocation?: string;
  similarity?: number;
}

const EXTRACTION_RESULTS: Record<string, any> = {
  invoice: {
    type: 'invoice',
    summary: '这是一份来自北京华胜科技有限公司的增值税专用发票，开票金额为人民币45,210.00元，涉及电子元器件采购。',
    categories: [
      {
        title: '发票基础信息',
        fields: [
          { label: '开票日期', value: '2024-03-20', status: 'normal', similarity: 1.0, sourceLocation: '左上角 P1' },
          { label: '发票号码', value: '00124896', status: 'normal', similarity: 0.99, sourceLocation: '右上角 P1' },
          { label: '发票代码', value: '110023456789', status: 'normal', similarity: 0.99, sourceLocation: '右上角 P1' },
          { label: '发票类型', value: '增值税专用发票', status: 'normal', similarity: 1.0 }
        ]
      },
      {
        title: '购销方主体',
        fields: [
          { label: '购方名称', value: 'XX审计局', status: 'normal', similarity: 0.98, sourceLocation: 'Purchaser Section' },
          { label: '购方税号', value: '91110108MA00XXXXXX', status: 'normal', similarity: 0.99 },
          { label: '销方名称', value: '北京华胜科技有限公司', status: 'normal', similarity: 0.99, sourceLocation: 'Seller Section' },
          { label: '销方税号', value: '91110105MA01YYYYYY', status: 'normal', similarity: 0.99 }
        ]
      },
      {
        title: '金额与税额',
        fields: [
          { label: '不含税金额', value: '¥40,008.85', status: 'normal', similarity: 0.99 },
          { label: '税额', value: '¥5,201.15', status: 'normal', similarity: 0.99 },
          { label: '价税合计', value: '¥45,210.00', status: 'normal', similarity: 0.95 },
          { label: '税率', value: '13%', status: 'normal', similarity: 0.99 }
        ]
      },
      {
        title: '项目与商品',
        fields: [
          { label: '物品名称', value: '电子元器件', status: 'normal', similarity: 0.98, sourceLocation: 'Table 1' },
          { label: '数量', value: '1000', status: 'normal', similarity: 0.99 },
          { label: '单价', value: '¥40.00', status: 'normal', similarity: 0.99 }
        ]
      }
    ],
    entities: [
      { label: '金额', value: '4.5万', type: 'money' },
      { label: '税率', value: '13%', type: 'percent' }
    ]
  },
  bid: {
    type: 'bid',
    summary: '中信系统集成提交的市政监控扩容项目投标文件，投标总价为2,100,000.00元，项目经理具备高级审计职称。',
    categories: [
      {
        title: '投标主体信息',
        fields: [
          { label: '投标人名称', value: '中信系统集成技术有限公司', status: 'normal', similarity: 0.99, sourceLocation: 'Cover Page' },
          { label: '法定代表人', value: '王五', status: 'normal', similarity: 0.95 },
          { label: '授权代表', value: '赵六', status: 'normal', similarity: 0.94 }
        ]
      },
      {
        title: '项目基本信息',
        fields: [
          { label: '项目名称', value: '市政监控扩容项目', status: 'normal', similarity: 0.98 },
          { label: '招标编号', value: 'SZ-2024-0315', status: 'normal', similarity: 0.99 },
          { label: '投标日期', value: '2024-03-15', status: 'normal', similarity: 0.99 }
        ]
      },
      {
        title: '投标报价信息',
        fields: [
          { label: '投标报价', value: '¥2,100,000.00', status: 'normal', similarity: 0.94, sourceLocation: 'Quote Summary' },
          { label: '报价构成', value: '硬件 70% / 软件 30%', status: 'normal', similarity: 0.85 }
        ]
      },
      {
        title: '项目人员信息',
        fields: [
          { label: '项目经理', value: '张三', status: 'normal', similarity: 0.99 },
          { label: '技术负责人', value: '李四', status: 'normal', similarity: 0.98 }
        ]
      },
      {
        title: '资质业绩财务',
        fields: [
          { label: '企业资质', value: '一级承包资质', status: 'normal', similarity: 0.99 },
          { label: '类似业绩', value: 'XX市政工程项目', status: 'normal', similarity: 0.95 }
        ]
      },
      {
        title: '技术服务方案',
        fields: [
          { label: '施工方案', value: '已提供', status: 'normal', similarity: 0.95 },
          { label: '质保承诺', value: '3年质保', status: 'normal', similarity: 0.99 }
        ]
      },
      {
        title: '文档版式特征',
        fields: [
          { label: '字体规范', value: '合规', status: 'normal', similarity: 0.99 },
          { label: '页眉页脚', value: '完整', status: 'normal', similarity: 0.99 }
        ]
      }
    ],
    entities: [
      { label: '总额', value: '210万', type: 'money' },
      { label: '甲方', value: 'XX市公安局', type: 'organization' }
    ]
  },
  contract: {
    type: 'contract',
    summary: '本合同为龙湖熙上二期项目智能化工程承包合同，甲方为龙湖地产，乙方为XX集成公司，工程总额1.25亿。',
    categories: [
      {
        title: '合同基础信息',
        fields: [
          { label: '合同名称', value: '龙湖熙上二期智能化工程承包合同', status: 'normal', similarity: 0.98, sourceLocation: 'Title Page' },
          { label: '合同编号', value: 'LH-XS2-2023-088', status: 'normal', similarity: 0.95 },
          { label: '签订日期', value: '2023-06-01', status: 'normal', similarity: 0.95 }
        ]
      },
      {
        title: '甲乙双方主体',
        fields: [
          { label: '甲方', value: '龙湖地产(北京)有限公司', status: 'normal', similarity: 0.99, sourceLocation: 'Article 1' },
          { label: '乙方', value: 'XX智联科技有限公司', status: 'normal', similarity: 0.99, sourceLocation: 'Article 1' }
        ]
      },
      {
        title: '标的与金额',
        fields: [
          { label: '合同金额', value: '¥125,000,000.00', status: 'normal', similarity: 0.95, sourceLocation: 'Section 4' },
          { label: '支付比例', value: '首付30%', status: 'error', similarity: 0.45, sourceLocation: 'Section 4' },
          { label: '支付节点', value: '完工后一次性支付', status: 'warning', similarity: 0.65, sourceLocation: 'Section 4' }
        ]
      },
      {
        title: '履约信息',
        fields: [
          { label: '工期', value: '365日历天', status: 'normal', similarity: 0.92 },
          { label: '交付标准', value: '国家一类标准', status: 'normal', similarity: 0.99 }
        ]
      },
      {
        title: '权责与风险',
        fields: [
          { label: '违约责任', value: '合同额的0.5%/日', status: 'warning', similarity: 0.72, sourceLocation: 'Liability Clause' },
          { label: '争议解决', value: '法院起诉', status: 'normal', similarity: 0.99 }
        ]
      }
    ],
    entities: [
      { label: '金额', value: '1.25亿', type: 'money' },
      { label: '地点', value: '朝阳区', type: 'location' }
    ]
  },
  general: {
    type: 'contract',
    summary: '这是一份通用文档解析结果，提取了文档中的关键属性和实体。',
    categories: [
      {
        title: '基本信息',
        fields: [
          { label: '创建人', value: '系统管理员', status: 'normal', similarity: 0.98 },
          { label: '最后修改', value: '2024-03-01', status: 'normal', similarity: 0.99 }
        ]
      }
    ],
    entities: []
  },
  tender_announcement: {
    type: 'tender_announcement',
    summary: '这是一份关于2024年市政道路建设工程的招标公告，概括了工程的基本信息与资格预审要求。',
    categories: [
      {
        title: '公告基础信息',
        fields: [
          { label: '招标名称', value: '2024年市政道路建设工程', status: 'normal', similarity: 1.0 },
          { label: '招标编号', value: 'SZ-ROAD-2024-001', status: 'normal', similarity: 0.99 },
          { label: '招标人', value: 'XX市住房和城乡建设局', status: 'normal', similarity: 0.99 }
        ]
      }
    ],
    entities: []
  }
};

const EXTRACTION_DETAILS: Record<string, Record<string, string[]>> = {
  invoice: {
    '发票基础信息': ['发票代码', '发票号码', '开票日期', '发票类型（专票/普票/电子）'],
    '购销双方': ['购买方名称', '购买方税号', '销售方名称', '销售方税号', '销售方地址电话'],
    '金额信息': ['金额（不含税）', '税额', '价税合计', '税率'],
    '货物信息': ['货物/服务名称', '规格型号', '单位', '数量', '单价', '金额'],
    '备注信息': ['备注内容', '收款人', '复核人', '开票人'],
    '校验信息': ['发票校验码', '机器编号', '二维码信息']
  },
  bid: {
    '投标主体信息': ['投标人名称', '社会代码', '法人', '代表', '注册地址', '办公地址', '联系电话', '邮箱'],
    '项目基本信息': ['项目名称', '招标编号', '标段', '投标日期', '投标有效期', '版本编号'],
    '项目人员信息': ['项目经理姓名', '身份证号', '职称证', '技术负责人', '主要人员', '资格证', '社保单位'],
    '投标报价信息': ['总报价(大/小写)', '分项报价', '报价币种', '税率', '缺漏项', '报价构成', '软件标识'],
    '资质业绩财务': ['企业资质', '安全许可证', '类似业绩', '财务状况', '信用/失信记录', '认证体系'],
    '技术服务方案': ['施工方案摘要', '质量保证措施', '进度安排', '安全保障', '售后方案', '培训方案'],
    '文档版式特征': ['文档作者', '软件信息', '目录结构', '章节编号', '字体页眉页脚', '错误特征']
  },
  contract: {
    '合同基础信息': ['合同名称', '合同编号', '签订日期', '签订地点', '有效期'],
    '甲乙双方主体': ['甲方名称/税号', '甲方法人', '乙方名称/税号', '乙方法人', '授权代表'],
    '标的与金额': ['合同标的', '合同总金额(大小写)', '币种', '税率', '付款方式'],
    '履约信息': ['履约期限', '履约地点', '交付标准', '质保期'],
    '权责与风险': ['违约责任', '争议解决方式', '签章信息']
  },
  tender_announcement: {
    '公告基础信息': ['招标名称', '招标编号', '招标人', '招标代理', '公告日期'],
    '标内容概要': ['项目概况', '招标范围', '最高限价', '工期要求', '质量标准'],
    '投标人资格要求': ['资质要求', '业绩要求', '项目经理要求', '财务要求', '联合投标规定'],
    '递交与开标': ['文件获取时间', '文件获取方式', '递交截止时间', '开标时间', '开标地点']
  }
};

const SAMPLE_COMPARISON: any = {
  id: 'comp-1',
  sourceDocId: 'doc-bid',
  targetDocId: 'kb-bid-1',
  type: 'bid',
  similarity: 88,
  summary: '检测到两份标书在商业条款与技术规格上存在高度趋同，多处段落海明距离小于5，疑似存在同源套用风险。',
  // 内容查重面板数据
  contentDuplication: {
    docCount: 3,
    totalPageCount: 156,
    maxSimilarity: 92,
    riskCount: 12,
    similarityMatrix: [
      [100, 92, 45],
      [92, 100, 38],
      [45, 38, 100]
    ]
  },
  // 文本雷同面板数据
  duplicateFragments: [
    { 
      sourceContent: '本工程施工组织设计方案旨在通过科学、合理、先进的施工技术及管理手段，确保项目在预定工期内高质量完成。',
      targetContent: '本工程施工组织设计方案旨在通过科学、合理、先进的施工技术及管理和手段，确保项目在预定工期内高质量完成。',
      sourceDocName: '投标人A_技术标.pdf',
      targetDocName: '投标人B_技术标.pdf',
      location: '第24页',
      similarity: 98,
      hammingDistance: 2
    },
    { 
      sourceContent: '质量保证体系包括ISO9001认证及内部巡检机制，由项目经理直接挂帅成立质量领导小组。',
      targetContent: '质量保证体系包括ISO9001认证及内部巡检机制，由项目经理直接负责成立质量领导小组。',
      sourceDocName: '投标人A_技术标.pdf',
      targetDocName: '投标人C_技术标.pdf',
      location: '第15页',
      similarity: 95,
      hammingDistance: 4
    },
    { 
      sourceContent: '在对于其后之进行过程中的由于对于施工现场之由于管理不周全进而导致的质量问题。',
      targetContent: '在对于其后之进行过程中的由于对于施工现场之由于管理不周全进而导致的质量问题。',
      sourceDocName: '投标人A_技术标.pdf',
      targetDocName: '投标人B_技术标.pdf',
      location: '第45页',
      similarity: 100,
      hammingDistance: 0
    },
    { 
      sourceContent: '确保本工程的“履约保正金”于规定时间内完成支付。',
      targetContent: '确保本工程的“履约保正金”于规定时间内完成支付。',
      sourceDocName: '投标人A_技术标.pdf',
      targetDocName: '投标人B_技术标.pdf',
      location: '第12页',
      similarity: 100,
      hammingDistance: 0
    }
  ],
  // 围串标异常线索数据
  collusionAnomalyClues: {
    rareCharHeatmap: [
      { page: 1, count: 5 }, { page: 5, count: 12 }, { page: 12, count: 8 }, { page: 25, count: 2 }
    ],
    pricingRegularity: [
      { x: 100, y: 105, type: 'proportional' },
      { x: 200, y: 210, type: 'proportional' },
      { x: 300, y: 315, type: 'proportional' }
    ],
    pricingAnomaly: [
      { item: '分项名称/数量', value: '高度一致', status: 'error', reason: '分项清单序列Jaccard相似度 0.98' },
      { item: '异常缺项/多项', value: '完全重合', status: 'error', reason: '均缺少“监控杆基座补强”等3个必选科目' }
    ],
    metadataComparison: [
      { item: '文档账号', docA: 'wps_user_66892', docB: 'wps_user_66892', status: 'error', level: '高风险', detail: '解析文档底层残留相同云同步账号' },
      { item: '联络信息', docA: '138****0001 / hz@test.com', docB: '138****0001 / hz@test.com', status: 'warning', level: '中风险', detail: '地址、电话、邮箱指纹高度撞车' },
      { item: '标书预留手机号', docA: '159****8888', docB: '159****8888', status: 'warning', level: '中风险', detail: '监测到不同单位预留同一联系人号码' },
      { item: '时间戳分析', docA: '2024-03-20 14:00', docB: '2024-03-20 14:02', status: 'info', level: '低风险', detail: '文档创建/修改时间高度集中，疑似批量制作' },
      { item: '硬件指纹 (MAC)', docA: '00-50-56-C0-00-08', docB: '00-50-56-C0-00-08', status: 'error', level: '高风险', detail: '生成文档的硬件物理地址完全一致' }
    ],
    structureComparison: [
      { item: '排版一致性', metric: '树编辑距离', value: '0.05', status: 'critical', desc: '文档DOM/XML结构拓扑近乎等价' },
      { item: '字体一致性', metric: '字体集相似度', value: '98.5%', status: 'warning', desc: '非标准字体引用序列完全一致' },
      { item: '页眉页脚一致性', metric: '文本匹配', value: '100%', status: 'critical', desc: '包含特定的私有排版标记残留' },
      { item: '目录结构一致性', metric: '层级相似度', value: '99%', status: 'critical', desc: '章节标题及其缩进逻辑完全相同' },
      { item: '章节编号一致性', metric: '自动编号格式', value: '完全一致', status: 'info', desc: '采用相同的不规范编号修正逻辑' }
    ],
    paraphraseAnalysis: [
      { 
        type: '同义词替换', 
        evidence: '“实施”替换为“执行”，“确保”替换为“保障”', 
        confidence: 94, 
        status: 'critical',
        details: '在技术实施方案第12段，近义词替换率达到 85%' 
      },
      { 
        type: '语序倒装/句子结构调整', 
        evidence: '“通过...手段实现...”调整为“基于...手段完成了...的实现”', 
        confidence: 88, 
        status: 'warning',
        details: '检测到大量被动语态与主动语态的转换，核心逻辑链完全吻合' 
      },
      { 
        type: '段落重组/顺序调整', 
        evidence: '原第3章第2节内容被拆分合并至文档B第4章', 
        confidence: 92, 
        status: 'critical',
        details: '逻辑演进路径（Plan-Do-Check）拓扑拓扑一致性 92%' 
      },
      { 
        type: '修饰语增删', 
        evidence: '删除了“先进的”、“科学的”等限定词，保留了核心技术参数', 
        confidence: 96, 
        status: 'critical',
        details: '技术参数矩阵提取对比，数值完全重合' 
      }
    ],
    personnelAssociation: [
      { role: '项目经理', personA: '王五', personB: '王五', conflict: true },
      { role: '技术负责人', personA: '赵六', personB: '张一', conflict: false }
    ]
  },
  collusionEvidence: [
    { type: '元数据指纹碰撞', description: '两份标书的MAC地址、文档账户标识及原始作者完全相同', evidence: 'Account: wps_user_66892 | MAC: 00-50-56-C0-00-08' },
    { type: '内容同源错误', description: '在第15页关于“履约保证金”的描述中存在相同的中文字符简繁错写', evidence: '“履约保正金” (冷僻错别字同步)' },
    { type: 'AI病句检测', description: '检测到两份文档在描述施工难点时，同时出现了不符合中文语法的异常长难句', evidence: '“在对于其后之进行过程中的...”' }
  ]
};

const COMPARISON_CONFIG = [
  {
    id: 'metadata', label: '元数据', options: [
      { id: 'meta_ip', label: '电脑IP/MAC地址' },
      { id: 'meta_author', label: '标书作者' },
      { id: 'meta_wps', label: '文档账号' },
      { id: 'meta_contact', label: '联络信息（地址、电话、邮箱）' },
      { id: 'meta_phone', label: '预留手机号' },
      { id: 'meta_timestamp', label: '文档时间戳' }
    ]
  },
  {
    id: 'structure', label: '文档结构', options: [
      { id: 'struct_layout', label: '排版一致性' },
      { id: 'struct_font', label: '字体一致性' },
      { id: 'struct_header', label: '页眉页脚一致性' },
      { id: 'struct_toc', label: '目录结构一致性' },
      { id: 'struct_chapter', label: '章节编号一致性' }
    ]
  },
  {
    id: 'pricing', label: '报价规律', options: [
      { id: 'price_arithmetic', label: '等差规律' },
      { id: 'price_geometric', label: '等比规律' },
      { id: 'price_proportional', label: '成比例增减' },
      { id: 'price_items', label: '分项一致' },
      { id: 'price_missing', label: '相同缺项/多项' }
    ]
  },
  {
    id: 'duplication', label: '内容查重', options: [
      { id: 'dup_snippet', label: '重复片段' },
      { id: 'dup_grammar', label: '内容语法/表达' },
      { id: 'dup_typo', label: '冷僻错别字' }
    ]
  },
  {
    id: 'paraphrase', label: '洗稿分析', options: [
      { id: 'para_synonym', label: '同义词替换' },
      { id: 'para_order', label: '语序倒装/句子结构调整' },
      { id: 'para_restructure', label: '段落重组/顺序调整' },
      { id: 'para_modifier', label: '修饰语增删' }
    ]
  }
];

const DEFAULT_OPTIONS = [
  'meta_ip', 'meta_author', 'meta_wps', 'meta_contact', 'meta_phone', 'meta_timestamp',
  'struct_layout', 'struct_font', 'struct_header', 'struct_toc', 'struct_chapter',
  'price_arithmetic', 'price_geometric', 'price_proportional', 'price_items', 'price_missing',
  'dup_snippet', 'dup_grammar', 'dup_typo',
  'para_synonym', 'para_order', 'para_restructure', 'para_modifier'
];

type ActiveTab = 'list' | 'extraction' | 'comparison';

export default function DocumentAnalysis() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('list');
  const [comparisonSubTab, setComparisonSubTab] = React.useState<'duplication' | 'similarity' | 'collusion'>('duplication');
  const [docs, setDocs] = React.useState<AnalyzableDocument[]>(SAMPLE_DOCS);
  const [selectedDocs, setSelectedDocs] = React.useState<string[]>(['doc-bid']);
  const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null);
  const [chatDocId, setChatDocId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [showKbModal, setShowKbModal] = React.useState(false);
  const [showParseModal, setShowParseModal] = React.useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = React.useState<string | null>(null);
  
  // Comparison process state
  const [comparisonStatus, setComparisonStatus] = React.useState<'idle' | 'comparing' | 'completed'>('idle');
  const [comparisonProgress, setComparisonProgress] = React.useState(0);
  const [comparisonOptions, setComparisonOptions] = React.useState<string[]>(DEFAULT_OPTIONS);
  const [comparisonDocs, setComparisonDocs] = React.useState<{ a: string | null, b: string | null }>({
    a: 'doc-bid',
    b: null
  });
  const [showDocSelector, setShowDocSelector] = React.useState<{ side: 'a' | 'b' | null }>({ side: null });

  const [parsingConfig, setParsingConfig] = React.useState<{
    docId: string | null;
    docName: string;
    docType: 'invoice' | 'bid' | 'contract' | 'tender_announcement';
    options: string[];
  }>({
    docId: null,
    docName: '',
    docType: 'contract',
    options: []
  });
  const [activeKbId, setActiveKbId] = React.useState<string>('audit_data');
  const [kbSearchQuery, setKbSearchQuery] = React.useState('');
  const [selectedKbDocIds, setSelectedKbDocIds] = React.useState<string[]>([]);
  const [auditedFields, setAuditedFields] = React.useState<Record<string, string[]>>({});
  const [isHeaderCollapsed, setIsHeaderCollapsed] = React.useState(false);
  const [activeReportSection, setActiveReportSection] = React.useState('summary');
  const [editedSimilarities, setEditedSimilarities] = React.useState<Record<string, number>>({});
  const [editingSimilarityField, setEditingSimilarityField] = React.useState<string | null>(null);
  const [tempSimilarity, setTempSimilarity] = React.useState<string>('');
  
  const [editingValueField, setEditingValueField] = React.useState<string | null>(null);
  const [editedValues, setEditedValues] = React.useState<Record<string, string>>({});
  const [tempValue, setTempValue] = React.useState<string>('');
  const [activeCategoryIdx, setActiveCategoryIdx] = React.useState<number>(0);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const extractionContainerRef = React.useRef<HTMLDivElement>(null);

  const handleExtractionScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollTop;
    
    const categories = Array.from(document.querySelectorAll('[id^="category-"]'));
    let activeIdx = 0;
    
    categories.forEach((cat, index) => {
      const el = cat as HTMLElement;
      if (el.offsetTop - container.offsetTop <= scrollPosition + 150) {
        activeIdx = index;
      }
    });
    
    setActiveCategoryIdx(activeIdx);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsHeaderCollapsed(scrollTop > 60);

    // Simple scroll spy logic
    const sections = ['summary', 'metadata', 'structure', 'pricing', 'duplication', 'similarity', 'collusion'];
    for (const section of sections) {
      const element = document.getElementById(`report-section-${section}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 300) {
          setActiveReportSection(section);
          break;
        }
      }
    }
  };

  const handleStartComparison = () => {
    if (!comparisonDocs.a || !comparisonDocs.b) return;
    setComparisonStatus('comparing');
    setComparisonProgress(0);
    const interval = setInterval(() => {
      setComparisonProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setComparisonStatus('completed');
          setIsHeaderCollapsed(false);
          setTimeout(() => {
            containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const filteredDocs = docs.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleToggleAudit = (docId: string, fieldIdx: any) => {
    setAuditedFields(prev => {
      const current = prev[docId] || [];
      const updated = current.includes(fieldIdx) 
        ? current.filter(i => i !== fieldIdx) 
        : [...current, fieldIdx];
      return { ...prev, [docId]: updated };
    });
  };

  const handleResetComparison = () => {
    setComparisonStatus('idle');
    setComparisonProgress(0);
    setComparisonDocs({ a: 'doc-bid', b: null });
  };

  const handleViewResult = (id: string) => {
    setSelectedDocId(id);
    setActiveTab('extraction');
  };

  const startParsing = (targetIds: string[]) => {
    // Simulate analysis for documents that are not completed
    setDocs(prev => prev.map(doc => {
      if (targetIds.includes(doc.id) && doc.status !== 'completed' && doc.status !== 'parsing') {
        return { ...doc, status: 'parsing', progress: 0 };
      }
      return doc;
    }));

    // Start interval to simulate progress
    const interval = setInterval(() => {
      setDocs(prev => {
        const stillParsing = prev.some(d => d.status === 'parsing' && d.progress < 100);
        if (!stillParsing) {
          clearInterval(interval);
          return prev;
        }

        return prev.map(doc => {
          if (doc.status === 'parsing' && doc.progress < 100) {
            const nextProgress = doc.progress + Math.floor(Math.random() * 20) + 5;
            if (nextProgress >= 100) {
              return { ...doc, status: 'completed', progress: 100 };
            }
            return { ...doc, progress: nextProgress };
          }
          return doc;
        });
      });
    }, 800);
  };

  const handleAddFromKb = (kbDocIds: string[]) => {
    const selectedKbDocs = SAMPLE_KB_DOCS.filter(d => kbDocIds.includes(d.id));
    
    const newDocs: AnalyzableDocument[] = selectedKbDocs.map(kbDoc => ({
      id: `kb-${Date.now()}-${Math.random()}`,
      name: kbDoc.name,
      size: 1024 * 1024 * (Math.random() * 5 + 1),
      type: 'application/pdf',
      source: 'library',
      format: 'pdf',
      status: 'pending',
      progress: 0,
      selected: false,
      suggestedModel: (kbDoc as any).type as any
    }));
    
    setDocs(prev => [...newDocs, ...prev]);
    setShowKbModal(false);
    setSelectedKbDocIds([]);
  };

  const handleToggleKbDoc = (id: string) => {
    setSelectedKbDocIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelect = (id: string) => {
    setSelectedDocs(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleLocalUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const newDocs: AnalyzableDocument[] = Array.from(target.files).map(file => ({
          id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'unknown',
          source: 'local',
          format: file.name.split('.').pop()?.toLowerCase() || 'unknown',
          status: 'pending',
          progress: 0,
          selected: false,
        }));
        setDocs(prev => [...newDocs, ...prev]);
      }
    };
    input.click();
  };

  const getStatusBadge = (status: AnalyzableDocument['status']) => {
    switch(status) {
      case 'completed': return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-sm flex items-center gap-1"><CheckCircle2 size={12} />分析完成</span>;
      case 'parsing': return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-sm flex items-center gap-1 animate-pulse"><Clock size={12} />分析中</span>;
      case 'failed': return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-sm flex items-center gap-1"><AlertCircle size={12} />解析失败</span>;
      case 'pending': return <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-sm flex items-center gap-1"><AlertCircle size={12} />待分析</span>;
      default: return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-sm flex items-center gap-1"><Clock size={12} />待分析</span>;
    }
  };

  const openParseModal = (docId: string, docName: string) => {
    const doc = docs.find(d => d.id === docId);
    const docType = doc?.suggestedModel || 'contract';
    // By default, check all options for this document type
    const defaultOptions = Object.keys(EXTRACTION_DETAILS[docType] || {});
    
    setParsingConfig({
      docId,
      docName,
      docType,
      options: defaultOptions
    });
    setShowParseModal(true);
  };

  const handleStartParsing = () => {
    if (parsingConfig.docId) {
      startParsing([parsingConfig.docId]);
      setShowParseModal(false);
    }
  };

  const toggleParsingOption = (opt: string) => {
    setParsingConfig(prev => ({
      ...prev,
      options: prev.options.includes(opt) 
        ? prev.options.filter(o => o !== opt) 
        : [...prev.options, opt]
    }));
  };

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* Module Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
        <div>
          <h2 className="text-lg font-normal text-xl tracking-tight text-gray-900 flex items-center gap-2">
            <FileSearch size={22} className="text-blue-600" />
            智能文档分析
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            多维度、智能化文档深度剖析与比对引擎
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-gray-100 rounded-xl">
            {[
              { id: 'list', label: '文档分析', icon: <FileText size={16} /> },
              { id: 'comparison', label: '标书比对', icon: <ArrowUpDown size={16} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  (activeTab === tab.id) || (tab.id === 'list' && activeTab === 'extraction')
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Column: Analyze Documents, Results, Comparison */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden",
          activeTab === 'list' && "border-r border-gray-100"
        )}>
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'list' && (
          <div className="flex-1 overflow-hidden flex flex-col p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="搜索文档名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowKbModal(true)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm font-medium"
                  >
                    <Library size={16} />
                    从知识库选择
                  </button>
                  <button 
                    onClick={handleLocalUpload}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all shadow-sm"
                  >
                    <Upload size={16} />
                    本地上传
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white z-10 border-b border-gray-100">
                    <tr className="text-xs text-gray-400 uppercase tracking-wider">
                      <th className="px-4 py-3 font-medium w-12 text-center">选择</th>
                      <th className="px-4 py-3 font-medium">文档名称</th>
                      <th className="px-4 py-3 font-medium">大小</th>
                      <th className="px-4 py-3 font-medium">来源</th>
                      <th className="px-4 py-3 font-medium">类型</th>
                      <th className="px-4 py-3 font-medium">分析状态</th>
                      <th className="px-4 py-3 font-medium text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredDocs.map(doc => (
                      <tr 
                        key={doc.id} 
                        className={cn(
                          "hover:bg-gray-50/50 transition-colors group",
                          selectedDocs.includes(doc.id) && "bg-blue-50/30"
                        )}
                      >
                        <td className="px-4 py-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedDocs.includes(doc.id)}
                            onChange={() => handleToggleSelect(doc.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <FileText size={18} />
                            </div>
                            <span className="text-sm font-normal text-gray-900 truncate max-w-[300px]">
                              {doc.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium">
                            {doc.source === 'library' ? '审计资料库' : doc.source === 'personal' ? '个人知识库' : '本地上传'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 font-bold">
                          {(() => {
                            switch(doc.suggestedModel) {
                              case 'invoice': return '发票';
                              case 'bid': return '标书';
                              case 'contract': return '合同';
                              case 'tender_announcement': return '招标公告';
                              default: return '未知';
                            }
                          })()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(doc.status)}
                            {doc.status === 'parsing' && (
                              <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                  style={{ width: `${doc.progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 transition-opacity">
                            {doc.status === 'completed' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChatDocId(doc.id);
                                }}
                                title="文档对话"
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              >
                                <MessageSquare size={16} />
                              </button>
                            )}
                            {doc.status === 'completed' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewResult(doc.id);
                                }}
                                title="查看结果"
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              >
                                <FileSearch size={16} />
                              </button>
                            )}
                            {doc.status === 'pending' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openParseModal(doc.id, doc.name);
                                }}
                                title="分析文档"
                                className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                              >
                                <Zap size={16} />
                              </button>
                            )}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowConfirmDelete(doc.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  共 {docs.length} 个文档，已选 {selectedDocs.length} 个
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={selectedDocs.length !== 2}
                    onClick={() => setActiveTab('comparison')}
                    className="px-4 py-2 bg-white text-purple-600 border border-purple-200 rounded-xl text-xs font-bold hover:bg-purple-50 transition-all disabled:opacity-40 disabled:grayscale shadow-sm"
                  >
                    文档比对
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'extraction' && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Header / Sub-nav */}
            {(() => {
              const currentDoc = docs.find(d => d.id === selectedDocId);
              const modelType = currentDoc?.suggestedModel || 'general';
              const result = EXTRACTION_RESULTS[modelType] || EXTRACTION_RESULTS.general;
              
              return (
                <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div 
                      onClick={() => setActiveTab('list')}
                      className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-100 cursor-pointer transition-all text-gray-400 hover:text-blue-600 shadow-sm group"
                      title="返回列表"
                    >
                      <ArrowLeft size={20} className="group-active:scale-95 transition-transform" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-blue-600 font-black uppercase tracking-[0.2em] bg-blue-50 px-1.5 py-0.5 rounded">分析报告</span>
                        <h3 className="text-sm font-normal text-lg tracking-tight text-gray-400 tracking-tight">文档解析结果</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">当前文档:</span>
                        <select 
                          value={selectedDocId || ''} 
                          onChange={(e) => setSelectedDocId(e.target.value)}
                          className="bg-transparent text-xs font-black text-gray-900 focus:outline-none cursor-pointer border-none p-0 hover:text-blue-600 transition-colors"
                        >
                          {docs.filter(d => d.status === 'completed').map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                      <Download size={14} />
                      下载提取报告
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
                  {/* Category Sidebar */}
                  <div className="col-span-12 lg:col-span-2 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex items-center gap-3 mb-4 px-2">
                       <Filter size={14} className="text-gray-400" />
                       <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">提取目录</h4>
                    </div>
                    {result.categories.map((cat: any, i: number) => (
                      <button 
                        key={i}
                        onClick={() => {
                          const element = document.getElementById(`category-${i}`);
                          element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          setActiveCategoryIdx(i);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-2xl text-xs font-black transition-all hover:bg-white hover:shadow-sm border flex items-center justify-between group",
                          activeCategoryIdx === i 
                            ? "bg-white border-blue-100 shadow-sm" 
                            : "border-transparent hover:border-gray-100"
                        )}
                      >
                        <span className={cn("truncate transition-colors", activeCategoryIdx === i ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600")}>{cat.title}</span>
                        <ChevronRight size={12} className={cn("transition-colors", activeCategoryIdx === i ? "text-blue-600" : "text-gray-300 group-hover:text-blue-400")} />
                      </button>
                    ))}
                  </div>
                    
                  {/* Extraction Results Content */}
                  <div 
                    ref={extractionContainerRef}
                    onScroll={handleExtractionScroll}
                    className="col-span-12 lg:col-span-5 space-y-8 overflow-y-auto pr-4 custom-scrollbar scroll-smooth"
                  >
                    {/* Summary Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-20 -translate-y-32 translate-x-32" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">智能语义摘要</h4>
                        </div>
                        <p className="text-lg font-black text-gray-900 leading-snug">
                          {result.summary}
                        </p>
                      </div>
                    </div>

                    {/* Groups */}
                    {result.categories.map((category: any, catIdx: number) => (
                      <div key={catIdx} id={`category-${catIdx}`} className="space-y-4">
                        <div className="flex items-center justify-between px-2 pt-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.1em]">{category.title}</h4>
                            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-bold">{category.fields.length}</span>
                          </div>
                          {catIdx === 0 && (
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> 疑点</div>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {category.fields.map((field: any, fieldIdx: number) => {
                            // Removed second field of first category
                            if (catIdx === 0 && fieldIdx === 1) return null;

                            const globalIdx = `${selectedDocId || 'default'}-${catIdx}-${fieldIdx}`;
                            const isAudited = selectedDocId && auditedFields[selectedDocId]?.includes(globalIdx as any);
                            const needsAudit = field.status !== 'normal';

                            return (
                              <div 
                                key={fieldIdx} 
                                className={cn(
                                  "p-6 rounded-[24px] border transition-all duration-300 relative group/card",
                                  isAudited ? "bg-white border-green-200 shadow-sm" :
                                  field.status === 'normal' ? "bg-white border-gray-100 hover:border-blue-200" : 
                                  field.status === 'warning' ? "bg-yellow-50/30 border-yellow-100 hover:border-yellow-300" : 
                                  "bg-red-50/30 border-red-100 hover:border-red-300"
                                )}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{field.label}</span>
                                  <div className="flex items-center gap-2">
                                    {(editedSimilarities[globalIdx] !== undefined || field.similarity !== undefined) && !isAudited && (
                                      <div className="flex items-center">
                                        {(field.status === 'warning' || field.status === 'error') && editingSimilarityField === globalIdx ? (
                                          <div className="flex items-center gap-1 bg-white border border-blue-200 rounded-full pl-2 pr-1 py-0.5 shadow-sm">
                                            <input 
                                              type="text"
                                              className="w-8 text-xs font-bold text-blue-600 focus:outline-none bg-transparent text-center"
                                              value={tempSimilarity}
                                              onChange={(e) => {
                                                const val = e.target.value.replace(/[^\d]/g, '');
                                                if (val.length <= 3) {
                                                  setTempSimilarity(val);
                                                }
                                              }}
                                              autoFocus
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  const val = parseInt(tempSimilarity);
                                                  if (!isNaN(val)) {
                                                    setEditedSimilarities(prev => ({ ...prev, [globalIdx]: Math.min(100, Math.max(0, val)) / 100 }));
                                                  }
                                                  setEditingSimilarityField(null);
                                                } else if (e.key === 'Escape') {
                                                  setEditingSimilarityField(null);
                                                }
                                              }}
                                            />
                                            <span className="text-xs font-bold text-blue-600 mr-1">%</span>
                                            <div className="flex items-center gap-0.5">
                                              <button 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  const val = parseInt(tempSimilarity);
                                                  if (!isNaN(val)) {
                                                    setEditedSimilarities(prev => ({ ...prev, [globalIdx]: Math.min(100, Math.max(0, val)) / 100 }));
                                                  }
                                                  setEditingSimilarityField(null);
                                                }}
                                                className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                              >
                                                <Check size={10} strokeWidth={3} />
                                              </button>
                                              <button 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditingSimilarityField(null);
                                                }}
                                                className="w-4 h-4 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                              >
                                                <X size={10} strokeWidth={3} />
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <span 
                                            onClick={(e) => {
                                              if (field.status === 'warning' || field.status === 'error') {
                                                e.stopPropagation();
                                                setEditingSimilarityField(globalIdx);
                                                setTempSimilarity(Math.round((editedSimilarities[globalIdx] ?? field.similarity) * 100).toString());
                                              }
                                            }}
                                            className={cn(
                                              "text-xs px-2 py-0.5 rounded-full font-bold transition-all",
                                              (editedSimilarities[globalIdx] ?? field.similarity) > 0.9 ? "bg-blue-50 text-blue-600" : 
                                              field.status === 'error' ? "bg-red-50 text-red-600" :
                                              "bg-orange-50 text-orange-600",
                                              (field.status === 'warning' || field.status === 'error') && "cursor-pointer hover:scale-105 hover:shadow-sm active:scale-95"
                                            )}
                                          >
                                            置信度: {Math.round((editedSimilarities[globalIdx] ?? field.similarity) * 100)}%
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    {isAudited && (
                                      <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                        <CheckCircle2 size={12} />
                                        已审核
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-end justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    {((field.status === 'warning' || field.status === 'error') && editingValueField === globalIdx) ? (
                                      <div className="flex flex-col gap-2 mt-1 relative z-10" onClick={e => e.stopPropagation()}>
                                        <textarea 
                                          autoFocus
                                          className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm resize-none custom-scrollbar"
                                          rows={3}
                                          value={tempValue}
                                          onChange={e => setTempValue(e.target.value)}
                                          onKeyDown={e => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                setEditedValues(prev => ({...prev, [globalIdx]: tempValue}));
                                                setEditingValueField(null);
                                                if (!isAudited) handleToggleAudit(selectedDocId || 'default', globalIdx as any);
                                            } else if (e.key === 'Escape') {
                                                setEditingValueField(null);
                                            }
                                          }}
                                        />
                                        <div className="flex items-center gap-2">
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditedValues(prev => ({...prev, [globalIdx]: tempValue}));
                                              setEditingValueField(null);
                                              if (!isAudited) handleToggleAudit(selectedDocId || 'default', globalIdx as any);
                                            }}
                                            className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100 flex items-center gap-1 shadow-sm"
                                          >
                                            <Check size={12}/> 保存
                                          </button>
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingValueField(null);
                                            }}
                                            className="px-2 py-1 bg-gray-50 text-gray-400 rounded text-xs hover:bg-gray-100"
                                          >
                                            取消
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                       <div 
                                         className={cn(
                                          "text-base tracking-tight font-medium w-full cursor-pointer rounded -ml-1 py-0.5 transition-colors relative group/val",
                                          isAudited ? "text-gray-700" :
                                          field.status === 'normal' ? "text-gray-700" : 
                                          field.status === 'warning' ? "text-yellow-700 hover:bg-yellow-50 px-1" : 
                                          "text-red-700 hover:bg-red-50 px-1"
                                         )}
                                         onClick={(e) => {
                                            if (field.status === 'warning' || field.status === 'error') {
                                                e.stopPropagation();
                                                setEditingValueField(globalIdx);
                                                setTempValue(editedValues[globalIdx] ?? field.value);
                                            }
                                         }}
                                       >
                                         <div className="whitespace-pre-wrap break-words" title="点击编辑">
                                            {editedValues[globalIdx] ?? field.value}
                                         </div>
                                       </div>
                                    )}

                                    {needsAudit && !isAudited && (
                                      <p className="text-xs font-bold text-gray-400 mt-2 flex items-center gap-1.5 italic">
                                        <AlertCircle size={10} className={field.status === 'warning' ? "text-yellow-500" : "text-red-500"} />
                                        {field.status === 'warning' ? '建议核查：提取逻辑置信度偏低' : '疑点：检测到法规条文冲突'}
                                      </p>
                                    )}
                                  </div>

                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      ))}
                    </div>

                    {/* Right Column: Doc Preview Content */}
                    <div className="col-span-12 lg:col-span-5 bg-gray-50 rounded-[32px] border border-gray-100 p-6 flex flex-col overflow-hidden relative h-[420px]">
                      {docs.find(d => d.id === selectedDocId) ? (
                         <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 border border-gray-100">
                                     <FileSearch size={20} />
                                  </div>
                                  <div className="min-w-0">
                                     <p className="text-xs font-black text-gray-900 truncate max-w-[200px]">
                                       {docs.find(d => d.id === selectedDocId)?.name}
                                     </p>
                                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">原文预览内容</p>
                                  </div>
                               </div>
                            </div>
                            <div className="space-y-4 font-serif text-xs text-gray-600 leading-relaxed">
                               <p>本项目投标要求：投标人具备电子与智能化工程专业承包一级资质。技术方案核心指标：边缘端算法响应延迟需≤50ms，且支持在极端天气条件（大雾、暴雪）下的高精度识别...</p>
                               <p>系统架构设计应满足高可用性，前端采集设备要求支持IP67级防水防尘...</p>
                               <p className="not-italic text-xs text-gray-300 select-none text-center pt-4 border-t border-gray-50">-- 文档加载中 --</p>
                            </div>
                         </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
                          <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 text-gray-200">
                             <FileSearch size={48} />
                          </div>
                          <div className="text-center">
                             <p className="text-xs font-black tracking-widest uppercase text-gray-400">原文预览</p>
                             <p className="text-xs font-bold text-gray-300 mt-1 uppercase">请选择上方文档查看详情</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

            {activeTab === 'comparison' && (
              <div 
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto flex flex-col gap-6 scroll-smooth custom-scrollbar relative"
              >
                  {/* Sticky Minimized Header for Comparison Context */}
                  <AnimatePresence>
                    {isHeaderCollapsed && activeTab === 'comparison' && (
                      <motion.div 
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="sticky top-0 z-[60] bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-md shadow-gray-200/20"
                      >
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                               <FileText size={16} />
                             </div>
                             <div className="max-w-[120px]">
                               <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">基准文件 (A)</p>
                               <p className="text-xs font-black text-gray-900 truncate">{docs.find(d => d.id === comparisonDocs.a)?.name || '未选择'}</p>
                             </div>
                           </div>
                           <div className="text-gray-300">
                              <ArrowRight size={14} />
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                               <FileText size={16} />
                             </div>
                             <div className="max-w-[120px]">
                               <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">比对文件 (B)</p>
                               <p className="text-xs font-black text-gray-900 truncate">{docs.find(d => d.id === comparisonDocs.b)?.name || '未选择'}</p>
                             </div>
                           </div>
                           <div className="ml-4 flex flex-wrap items-center gap-2">
                             {COMPARISON_CONFIG.filter(group => group.options.some(opt => comparisonOptions.includes(opt.id))).map(group => (
                               <span key={group.id} className="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-black text-gray-500 uppercase tracking-tighter">
                                 {group.label}
                               </span>
                             ))}
                           </div>
                        </div>
                        <button 
                          onClick={() => {
                            containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black hover:bg-blue-100 transition-colors"
                        >
                          修改配置
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="px-6 py-6 shrink-0">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900 tracking-tight flex items-center gap-2">
                             <ArrowUpDown size={20} className="text-blue-600" />
                             标书比对配置
                          </h3>
                        </div>
                        {comparisonStatus === 'completed' && (
                          <button 
                            onClick={handleResetComparison}
                            className="px-4 py-2 bg-gray-50 border border-gray-100 text-gray-600 rounded-xl text-xs font-black hover:bg-gray-100 transition-all flex items-center gap-2"
                          >
                            <Plus className="rotate-45" size={14} />
                            重新选择比对
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                        <div 
                          onClick={() => comparisonStatus === 'idle' && setShowDocSelector({ side: 'a' })}
                          className={cn(
                            "p-5 rounded-[32px] border-2 flex items-center gap-5 transition-all group relative overflow-hidden",
                            comparisonStatus === 'idle' ? "cursor-pointer" : "bg-white",
                            comparisonDocs.a 
                              ? "bg-blue-50/50 border-blue-100 hover:bg-blue-50" 
                              : "bg-gray-50 border-dashed border-gray-200 hover:border-blue-300"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl shadow-sm flex items-center justify-center transition-transform group-hover:scale-105",
                            comparisonDocs.a ? "bg-white text-blue-600 shadow-blue-500/10" : "bg-white text-gray-300 border border-gray-100"
                          )}>
                            {comparisonDocs.a ? <FileCheck2 size={24} /> : <Plus size={24} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">基准标书 (A)</p>
                            <p className="text-sm font-black text-gray-900 truncate tracking-tight pr-4">
                              {docs.find(d => d.id === comparisonDocs.a)?.name || '未选择标书'}
                            </p>
                          </div>
                        </div>

                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 shrink-0">
                           <ArrowRight size={18} strokeWidth={3} />
                        </div>

                        <div 
                          onClick={() => comparisonStatus === 'idle' && setShowDocSelector({ side: 'b' })}
                          className={cn(
                            "p-5 rounded-[32px] border-2 flex items-center gap-5 transition-all group relative overflow-hidden",
                            comparisonStatus === 'idle' ? "cursor-pointer" : "bg-white",
                            comparisonDocs.b 
                              ? "bg-purple-50/50 border-purple-100 hover:bg-purple-50" 
                              : "bg-gray-50 border-dashed border-gray-200 hover:border-blue-300"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl shadow-sm flex items-center justify-center transition-transform group-hover:scale-105",
                            comparisonDocs.b ? "bg-white text-purple-600 shadow-purple-500/10" : "bg-white text-gray-300 border border-gray-100"
                          )}>
                            {comparisonDocs.b ? <FileCheck2 size={24} /> : <Plus size={24} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">比对标书 (B)</p>
                            <p className="text-sm font-black text-gray-900 truncate tracking-tight pr-4">
                              {docs.find(d => d.id === comparisonDocs.b)?.name || '未选择比对标书'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                          {COMPARISON_CONFIG.map(group => {
                            const groupOptions = group.options.map(o => o.id);
                            const selectedCount = groupOptions.filter(id => comparisonOptions.includes(id)).length;
                            const isAllSelected = selectedCount === groupOptions.length;
                            const isIndeterminate = selectedCount > 0 && !isAllSelected;

                            return (
                              <div key={group.id} className="flex flex-col gap-3 bg-gray-50/50 rounded-xl p-4 border border-gray-100 transition-colors hover:border-blue-100/50 hover:bg-white shadow-sm hover:shadow-md hover:shadow-blue-500/5">
                                <label className="flex items-center gap-2 cursor-pointer group w-fit pb-2 border-b border-gray-100 border-dashed">
                                  <input 
                                    type="checkbox" 
                                    checked={isAllSelected}
                                    ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                                    disabled={comparisonStatus !== 'idle'}
                                    onChange={() => {
                                       if (isAllSelected) {
                                         // deselect all
                                         setComparisonOptions(prev => prev.filter(id => !groupOptions.includes(id)));
                                       } else {
                                         // select all missing
                                         setComparisonOptions(prev => [...prev, ...groupOptions.filter(id => !prev.includes(id))]);
                                       }
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 transition-colors" 
                                  />
                                  <span className="text-[13px] font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{group.label}</span>
                                </label>
                                <div className="flex flex-col gap-2.5">
                                  {group.options.map(opt => (
                                    <label key={opt.id} className="flex items-start gap-2 group">
                                      <input 
                                        type="checkbox" 
                                        checked={isAllSelected}
                                        readOnly
                                        disabled
                                        className="w-3.5 h-3.5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 opacity-70 transition-colors shrink-0" 
                                      />
                                      <span className="text-xs font-medium text-gray-500 transition-colors leading-tight">{opt.label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {comparisonStatus === 'idle' && (
                          <div className="flex justify-end pt-4 border-t border-gray-50">
                            <button 
                              disabled={!comparisonDocs.a || !comparisonDocs.b || comparisonOptions.length === 0}
                              onClick={handleStartComparison}
                              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
                            >
                              <Zap size={14} fill="currentColor" />
                              开始立即比对
                            </button>
                          </div>
                        )}
                      </div>

                      {comparisonStatus === 'comparing' && (
                        <div className="pt-4 border-t border-gray-50 flex flex-col items-center gap-3">
                          <div className="w-full max-w-md space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] animate-pulse">深度分析比错中... {comparisonProgress}%</span>
                            </div>
                            <div className="h-2 w-full bg-blue-50 rounded-full overflow-hidden border border-blue-100 p-0.5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${comparisonProgress}%` }}
                                className="h-full bg-blue-600 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      </div>
                  </div>

                {comparisonStatus === 'completed' && (
                  <div className="flex flex-col gap-6">
                    {/* Report Navigation Bar */}
                    <div className={cn(
                      "sticky z-50 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-all mx-6",
                      isHeaderCollapsed ? "top-[60px] shadow-lg shadow-gray-200/30" : "top-0"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
                          {[
                            { id: 'summary', label: '概览' },
                            { id: 'metadata', label: '元数据异常' },
                            { id: 'structure', label: '结构分析' },
                            { id: 'pricing', label: '价格规律' },
                            { id: 'duplication', label: '内容查重' },
                            { id: 'paraphrase', label: '洗稿分析' },
                            { id: 'collusion', label: '线索判定' },
                          ].map(sec => (
                            <button
                              key={sec.id}
                              onClick={() => {
                                const element = document.getElementById(`report-section-${sec.id}`);
                                if (element && containerRef.current) {
                                  const offset = isHeaderCollapsed ? 120 : 100;
                                  containerRef.current.scrollTo({
                                    top: element.offsetTop - offset,
                                    behavior: 'smooth'
                                  });
                                }
                                setActiveReportSection(sec.id);
                              }}
                              className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-black transition-all",
                                activeReportSection === sec.id 
                                  ? "bg-white text-blue-600 shadow-sm" 
                                  : "text-gray-400 hover:text-gray-600"
                              )}
                            >
                              {sec.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 relative group/export">
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black hover:bg-black transition-all shadow-lg shadow-gray-900/10">
                          <Download size={14} />
                          导出比对报告
                          <ChevronDown size={14} className="ml-1 opacity-50" />
                        </button>
                        
                        {/* Export Dropdown */}
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-[70] overflow-hidden">
                           <div className="p-2 space-y-1">
                             <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors text-left group/item">
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                   <FileText size={16} />
                                 </div>
                                 <div className="min-w-0">
                                   <p className="text-xs font-black text-gray-900">Word 格式 (.docx)</p>
                                   <p className="text-xs text-gray-400 font-bold">标准审计文档及报表</p>
                                 </div>
                               </div>
                               <ArrowRight size={14} className="text-gray-300 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0" />
                             </button>
                             <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors text-left group/item">
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                   <FileCode size={16} />
                                 </div>
                                 <div className="min-w-0">
                                   <p className="text-xs font-black text-gray-900">PDF 格式 (.pdf)</p>
                                   <p className="text-xs text-gray-400 font-bold">不可篡改的电子存档版本</p>
                                 </div>
                               </div>
                               <ArrowRight size={14} className="text-gray-300 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0" />
                             </button>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Report Content - Sequential Sections */}
                    <div className="space-y-12 px-6">
                      
                      {/* 1. Summary Section */}
                      <section id="report-section-summary" className="scroll-mt-32">
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm px-10 py-4 relative overflow-hidden group/summary hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[120px] opacity-20 -translate-y-48 translate-x-48 group-hover:bg-blue-100 transition-colors" />
                          <div className="flex flex-col gap-6 relative z-10 font-black">
                            {/* Unified Stats Row */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                                  <ShieldAlert size={28} />
                                </div>
                                <div>
                                  <h2 className="text-xl font-normal text-gray-900 tracking-tight tracking-tight">围串标深度比对报告</h2>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-black text-blue-600 px-2 py-0.5 bg-blue-50 rounded-lg border border-blue-100">
                                      {docs.find(d => d.id === comparisonDocs.a)?.name || '未定义标书'}
                                    </span>
                                    <ArrowRight size={10} className="text-gray-300" />
                                    <span className="text-xs font-black text-purple-600 px-2 py-0.5 bg-purple-50 rounded-lg border border-purple-100">
                                      {docs.find(d => d.id === comparisonDocs.b)?.name || '未定义标书'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 h-10 px-5 bg-red-50 text-red-600 rounded-full border border-red-100 animate-in fade-in slide-in-from-right-10 duration-700">
                                <AlertCircle size={18} />
                                <span className="text-sm font-black tracking-tight">判定结论：存在高度串标嫌疑</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                               <div className="flex items-center gap-6 py-4 px-6 bg-gray-50/50 rounded-2xl border border-gray-100 overflow-x-auto scrollbar-hide" style={{ fontFamily: 'Arial, "Microsoft YaHei", sans-serif' }}>
                                 <div className="flex items-center gap-2 shrink-0">
                                   <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">合规评分</span>
                                   <span className="text-lg text-gray-800 text-orange-600 tracking-tighter">72.5</span>
                                 </div>
                                 <div className="w-px h-4 bg-gray-200 shrink-0" />
                                 <div className="flex items-center gap-2 shrink-0">
                                   <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">异常项统计</span>
                                   <span className="text-lg text-gray-800 text-red-600 tracking-tighter">12 <span className="text-xs opacity-60">项</span></span>
                                 </div>
                                 <div className="w-px h-4 bg-gray-200 shrink-0" />
                                 <div className="flex items-center gap-2 shrink-0">
                                   <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">高风险</span>
                                   <span className="text-lg text-red-600 tracking-tighter">3 <span className="text-xs opacity-60">项</span></span>
                                 </div>
                                 <div className="w-px h-4 bg-gray-200 shrink-0" />
                                 <div className="flex items-center gap-2 shrink-0">
                                   <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">中风险</span>
                                   <span className="text-lg text-yellow-600 tracking-tighter">5 <span className="text-xs opacity-60">项</span></span>
                                 </div>
                                 <div className="w-px h-4 bg-gray-200 shrink-0" />
                                 <div className="flex items-center gap-2 shrink-0">
                                   <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">低风险</span>
                                   <span className="text-lg text-gray-500 tracking-tighter">4 <span className="text-xs opacity-60">项</span></span>
                                 </div>
                               </div>
                               <p className="text-xs text-gray-400 uppercase tracking-[0.2em] px-2 italic">由 AI 审计引擎于 2024.03.20 14:05:12 生成 · 安全多维校验已完成</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* 2. Metadata Section */}
                      <section id="report-section-metadata" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-3 px-4">
                          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <Bot size={16} />
                          </div>
                          <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900 uppercase tracking-widest">一、元数据分析</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           {SAMPLE_COMPARISON.collusionAnomalyClues.metadataComparison.map((meta: any, idx: number) => (
                              <div key={idx} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all gap-4">
                                 <div className="space-y-4">
                                   <div className="flex items-center justify-between">
                                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{meta.item}</p>
                                      <div className={cn(
                                        "p-1 px-2.5 rounded-lg text-xs font-black tracking-tight",
                                        meta.status === 'error' ? "bg-red-100 text-red-600" : 
                                        meta.status === 'warning' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                                      )}>
                                        {meta.level}
                                      </div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-3">
                                      <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-xs font-black text-gray-400 uppercase">文档 A</span>
                                        <span className="text-xs font-bold text-gray-600 truncate">{meta.docA}</span>
                                      </div>
                                      <div className="flex flex-col gap-1 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                        <span className="text-xs font-black text-blue-400 uppercase">文档 B</span>
                                        <span className="text-xs font-bold text-gray-800 truncate">{meta.docB}</span>
                                      </div>
                                   </div>
                                   <div className="p-3 bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
                                      <p className="text-xs text-gray-500 font-bold leading-relaxed flex items-center gap-2">
                                        <Search size={10} className="text-gray-400" />
                                        {meta.detail}
                                      </p>
                                   </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                      </section>

                      {/* 2.5 Document Structure Analysis */}
                      <section id="report-section-structure" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-3 px-4">
                          <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                            <Book size={16} />
                          </div>
                          <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900 uppercase tracking-widest">二、文档结构排版深度判定</h3>
                        </div>
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-4 text-xs font-normal text-gray-400 uppercase tracking-widest w-1/4">判定维度</th>
                                <th className="px-8 py-4 text-xs font-normal text-gray-400 uppercase tracking-widest w-1/4">算法引擎</th>
                                <th className="px-8 py-4 text-xs font-normal text-gray-400 uppercase tracking-widest w-1/4">比对测算值</th>
                                <th className="px-8 py-4 text-xs font-normal text-gray-400 uppercase tracking-widest w-1/4">风险判定</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {SAMPLE_COMPARISON.collusionAnomalyClues.structureComparison.map((item: any, idx: number) => (
                                <tr key={idx} className="group hover:bg-purple-50/30 transition-colors">
                                  <td className="px-8 py-6">
                                    <p className="text-sm font-normal text-gray-900">{item.item}</p>
                                  </td>
                                  <td className="px-8 py-6">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-black uppercase">{item.metric}</span>
                                  </td>
                                  <td className="px-8 py-6">
                                    <p className="text-sm font-mono font-black text-gray-900">{item.value}</p>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="flex flex-col gap-1">
                                      <div className={cn(
                                        "w-fit px-2 py-0.5 rounded text-xs font-black uppercase tracking-widest",
                                        item.status === 'critical' ? "bg-red-600 text-white" : 
                                        item.status === 'warning' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                                      )}>
                                        {item.status === 'critical' ? '极高匹配' : item.status === 'warning' ? '疑似雷同' : '基本合规'}
                                      </div>
                                      <p className="text-xs text-gray-400 font-normal">{item.desc}</p>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>

                      {/* 3. Pricing Regularity Section */}
                      <section id="report-section-pricing" className="scroll-mt-32 space-y-6 text-black">
                        <div className="flex items-center gap-3 px-4">
                          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <ArrowUpDown size={16} />
                          </div>
                          <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900 uppercase tracking-widest">三、报价规律性耦合检测</h3>
                        </div>
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 space-y-10">
                          <div className="grid grid-cols-12 gap-10">
                            <div className="col-span-8">
                               <div className="bg-gray-50 rounded-[40px] border border-gray-100 p-6 h-[360px] flex items-center justify-center relative shadow-inner">
                                  <div className="absolute inset-0 p-6 opacity-10">
                                     <div className="w-full h-full border-2 border-gray-400 rounded-3xl grid grid-cols-4 grid-rows-4" />
                                  </div>
                                  <div className="relative w-full h-full flex items-center justify-center">
                                     <svg className="w-full h-full">
                                        <motion.line 
                                           initial={{ pathLength: 0 }}
                                           animate={{ pathLength: 1 }}
                                           x1="10%" y1="90%" x2="90%" y2="10%" 
                                           stroke="#2563EB" strokeWidth="2" strokeDasharray="5,5" 
                                        />
                                        {SAMPLE_COMPARISON.collusionAnomalyClues.pricingRegularity.map((p: any, i: number) => (
                                           <motion.circle 
                                              key={i}
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              transition={{ delay: i * 0.2 }}
                                              cx={`${p.x / 4}%`} cy={`${100 - p.y / 4}%`} r="6" fill="#EF4444" 
                                              className="shadow-xl"
                                           />
                                        ))}
                                     </svg>
                                     <div className="absolute top-10 right-10 p-6 bg-white/90 backdrop-blur shadow-xl border border-gray-100 rounded-3xl">
                                        <p className="text-xs font-black text-red-500 uppercase tracking-[0.2em] mb-2 font-black italic">! 高频等比例报价拟合</p>
                                        <p className="text-xl font-normal text-gray-900 tracking-tight font-mono tracking-tighter">R² = 0.9997</p>
                                        <p className="text-xs text-gray-400 font-bold mt-1">这意味着两份标书价格具有极强的数学相关性</p>
                                     </div>
                                  </div>
                               </div>
                            </div>
                            <div className="col-span-4 flex flex-col justify-center space-y-6">
                              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                                <h5 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">异常判定逻辑</h5>
                                <p className="text-xs text-gray-600 font-bold leading-relaxed">
                                  系统检测到文档 B 的分项报价在 95% 以上的科目中均呈现出文档 A 报价的 105.00% (浮动 ±0.01%)。
                                </p>
                              </div>
                              <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100">
                                <h5 className="text-xs font-black text-red-600 uppercase tracking-widest mb-4">审计建议</h5>
                                <p className="text-xs text-gray-600 font-bold leading-relaxed">
                                  建议对投标方的历史参标记录进行关联比对，核查是否存在代编行为。
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Itemized Consistency Table */}
                          <div className="pt-8 border-t border-gray-100">
                             <div className="flex items-center gap-2 mb-4">
                               <Bot size={14} className="text-blue-600" />
                               <span className="text-xs font-black text-gray-400 uppercase tracking-widest">分项及缺漏项耦合分析</span>
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                               {SAMPLE_COMPARISON.collusionAnomalyClues.pricingAnomaly.map((item: any, idx: number) => (
                                 <div key={idx} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:bg-white hover:border-blue-200 transition-all">
                                   <div>
                                     <p className="text-xs font-black text-gray-400 uppercase mb-1">{item.item}</p>
                                     <p className="text-sm font-black text-gray-900">{item.value}</p>
                                     <p className="text-xs text-gray-500 font-bold mt-1 italic">{item.reason}</p>
                                   </div>
                                   <div className="w-10 h-10 rounded-full bg-red-100/50 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                      <ShieldAlert size={18} />
                                   </div>
                                 </div>
                               ))}
                             </div>
                          </div>
                        </div>
                      </section>

                      {/* 4. Content Duplication Section */}
                      <section id="report-section-duplication" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-3 px-4">
                          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <Copy size={16} />
                          </div>
                          <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900 uppercase tracking-widest">四、全文档内容深度查重</h3>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                          <div className="col-span-4 bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center relative overflow-hidden h-[400px]">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-50/50 to-transparent pointer-events-none" />
                            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-10 relative z-10">综合重合率</span>
                            <div className="relative mb-10 scale-110">
                              <svg className="w-48 h-48 transform -rotate-90">
                                <circle cx="96" cy="96" r="88" fill="transparent" stroke="#F8FAFC" strokeWidth="12"/>
                                <circle cx="96" cy="96" r="88" fill="transparent" stroke="#EF4444" strokeWidth="12"
                                  strokeDasharray={553} strokeDashoffset={553 * (1 - 0.155)}
                                  strokeLinecap="round" className="transition-all duration-1000 ease-out"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-gray-900 font-mono tracking-tighter">15.5<span className="text-2xl">%</span></span>
                                <div className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-black uppercase mt-2 shadow-lg shadow-red-500/20 tracking-wider">高危风险</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 w-full border-t border-gray-100 pt-6">
                               <div className="text-center">
                                  <p className="text-xs font-black text-gray-400 uppercase">重复片段数</p>
                                  <p className="text-lg font-black text-gray-900">{SAMPLE_COMPARISON.duplicateFragments.length} 处</p>
                               </div>
                               <div className="text-center">
                                  <p className="text-xs font-black text-gray-400 uppercase">查重总余量</p>
                                  <p className="text-lg font-black text-gray-900">84.5%</p>
                               </div>
                            </div>
                          </div>
                          <div className="col-span-8 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                              <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] font-black">查重详情列表</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {SAMPLE_COMPARISON.duplicateFragments.map((frag: any, idx: number) => (
                                 <div key={idx} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 relative group/ev hover:bg-white hover:border-blue-200 transition-all">
                                    <div className="absolute top-4 right-4">
                                      <div className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-black uppercase tracking-widest border border-red-200">100% 匹配</div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                       <span className="w-1.5 h-4 bg-red-500 rounded-full" />
                                       <div className="flex items-center gap-3">
                                          <h4 className="text-sm font-black text-gray-900">{idx === 2 ? '内容语法/表达异常检测' : idx === 3 ? '冷僻错别字一致性检测' : `重复片段 #${idx + 1}`}</h4>
                                          {idx >= 2 && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-md text-xs font-black uppercase">语义特征碰撞</span>}
                                       </div>
                                    </div>
                                    <p className="text-xs text-gray-400 font-bold mb-2 italic">来源: {frag.sourceDocName} · 位置: {frag.location}</p>
                                    <div className="bg-white p-3 rounded-xl border border-dashed border-gray-200 relative">
                                       <div className="absolute top-2 left-3 text-[14px] font-serif text-gray-300 opacity-50 font-black italic">“</div>
                                       <p className="text-xs text-gray-600 leading-snug px-4 italic font-bold">
                                         {frag.sourceContent}
                                       </p>
                                       <div className="absolute bottom-2 right-3 text-[14px] font-serif text-gray-300 opacity-50 font-black italic">”</div>
                                    </div>
                                 </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* 4.5 Paraphrase Analysis Section */}
                      <section id="report-section-paraphrase" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-3 px-4">
                          <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                            <Zap size={16} />
                          </div>
                          <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900 uppercase tracking-widest">五、疑似智能洗稿重组分析</h3>
                        </div>
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 font-black">
                          <div className="grid grid-cols-2 gap-6">
                             {SAMPLE_COMPARISON.collusionAnomalyClues.paraphraseAnalysis.map((item: any, idx: number) => (
                               <div key={idx} className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 flex flex-col gap-4 group hover:bg-white hover:border-orange-200 transition-all">
                                  <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                        <h4 className="text-sm font-black text-gray-900">{item.type}</h4>
                                     </div>
                                     <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 font-bold uppercase">雷同判定</span>
                                        <span className="text-lg text-gray-800 text-orange-600 font-mono tracking-tighter">{item.confidence}%</span>
                                     </div>
                                  </div>
                                  <div className="space-y-2">
                                     <div className="p-4 bg-white/80 rounded-2xl border border-gray-100 italic text-xs text-gray-600 leading-relaxed">
                                        <span className="text-orange-500 font-black mr-2">雷同证据:</span>
                                        {item.evidence}
                                     </div>
                                     <div className="px-4 py-2 bg-orange-50/50 rounded-xl">
                                        <p className="text-xs text-orange-700 font-bold leading-relaxed">{item.details}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
                                     <span className="text-xs text-gray-400 font-bold uppercase">判定结论</span>
                                     <div className={cn(
                                       "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
                                       item.status === 'critical' ? "bg-red-600 text-white shadow-lg shadow-red-200" : "bg-orange-100 text-orange-600"
                                     )}>
                                       {item.status === 'critical' ? '确定雷同' : '疑似洗稿'}
                                     </div>
                                  </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </section>

                      {/* 5. Collusion Evidence Section */}
                      <section id="report-section-collusion" className="scroll-mt-32 space-y-6 pb-20">
                         <div className="flex items-center gap-3 px-4">
                          <div className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                            <ShieldAlert size={16} />
                          </div>
                          <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900 uppercase tracking-widest">六、串通投标特征判定依据</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                           {SAMPLE_COMPARISON.collusionEvidence.map((ev: any, idx: number) => (
                              <div key={idx} className="bg-white px-6 py-5 rounded-[24px] border border-gray-100 shadow-sm relative overflow-hidden group hover:border-red-200 transition-all flex items-center gap-6 cursor-default">
                                 <div className="absolute top-0 left-0 w-1 h-full bg-red-600/40" />
                                 <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-red-600/80 border border-gray-100 shrink-0 group-hover:scale-105 transition-transform group-hover:bg-red-50 group-hover:border-red-100">
                                   <Bot size={24} />
                                 </div>
                                 <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center justify-between">
                                       <h4 className="text-sm font-black text-gray-900 tracking-tight">{ev.type}</h4>
                                       <div className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs font-black uppercase tracking-widest border border-red-100">核心证据</div>
                                    </div>
                                    <p className="text-xs text-gray-500 font-bold leading-relaxed">{ev.description}</p>
                                    <div className="px-3 py-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-100 font-mono text-xs text-gray-400 break-all">
                                       <span className="text-gray-300 mr-2 uppercase tracking-tighter">[ 原始凭证 ]</span>
                                       {ev.evidence}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                      </section>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

          {/* Doc Selector Modal - Only for Bids */}
          <AnimatePresence>
            {showDocSelector.side && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowDocSelector({ side: null })}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: 20 }}
                   className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl border border-white overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-normal text-gray-900 tracking-tight">选择待比对文档</h3>
                      <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">仅支持“标书”类型文档进行核验</p>
                    </div>
                    <button 
                      onClick={() => setShowDocSelector({ side: null })}
                      className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors"
                    >
                      <Plus className="rotate-45" size={24} />
                    </button>
                  </div>
                  
                  <div className="p-6 max-h-[500px] overflow-y-auto space-y-3 custom-scrollbar">
                    {docs.filter(d => d.suggestedModel === 'bid').map(doc => (
                      <div 
                        key={doc.id}
                        onClick={() => {
                          setComparisonDocs(prev => ({ ...prev, [showDocSelector.side!]: doc.id }));
                          setShowDocSelector({ side: null });
                        }}
                        className={cn(
                          "p-5 rounded-3xl border transition-all cursor-pointer flex items-center gap-4 group",
                          (showDocSelector.side === 'a' ? comparisonDocs.a : comparisonDocs.b) === doc.id
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5"
                        )}
                      >
                         <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm border",
                           (showDocSelector.side === 'a' ? comparisonDocs.a : comparisonDocs.b) === doc.id
                             ? "bg-blue-600 text-white border-blue-700"
                             : "bg-gray-50 text-gray-400 border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600"
                         )}>
                            <FileText size={20} />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-black text-gray-900 truncate pr-4">{doc.name}</p>
                           <p className="text-xs text-gray-400 font-bold mt-0.5 tracking-tight uppercase">
                             {(doc.size / 1024 / 1024).toFixed(1)} MB · 标书文件
                           </p>
                         </div>
                         {(showDocSelector.side === 'a' ? comparisonDocs.a : comparisonDocs.b) === doc.id && (
                           <CheckCircle2 size={20} className="text-blue-600" />
                         )}
                      </div>
                    ))}
                    {docs.filter(d => d.suggestedModel === 'bid').length === 0 && (
                      <div className="py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-300 mx-auto">
                          <FileText size={40} />
                        </div>
                        <p className="text-sm font-bold text-gray-400">未检测到已解析的标书文件</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 bg-gray-50/50 border-t border-gray-50">
                    <p className="text-xs text-gray-400 font-bold text-center italic">注：若您的标书未出现在列表中，请先前往“文档分析”进行解析</p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        {activeTab === 'list' && (
          <div className="w-[450px] bg-white flex flex-col border-l border-gray-100 relative group/chat">
             {/* Chat Header */}
             <div className="p-4 border-b border-gray-100 bg-white shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-[#1890ff] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                   <Bot size={22} />
                 </div>
                 <div>
                   <h3 className="text-sm font-normal text-lg tracking-tight text-gray-900 leading-tight">切线详情</h3>
                   <div className="flex items-center gap-1.5 mt-0.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-xs font-medium text-gray-400">AI 审计专家在线</span>
                   </div>
                 </div>
               </div>
             </div>

             {/* Chat Messages */}
             <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white scrollbar-hide">
               {/* Sample Messages */}
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                   <Bot size={20} />
                 </div>
                 <div className="flex-1 space-y-2">
                   <div className="inline-block max-w-full p-4 rounded-2xl text-sm bg-white text-gray-800 border border-gray-100 shadow-sm font-medium leading-relaxed">
                     您好！我是您的审计助手。我已经准备好对左侧选中的文档进行深度解读。您可以问我任何关于合同条款、合规性、财务数据的问题。
                   </div>
                   <div className="flex flex-wrap gap-2 mt-3">
                     {[
                       '总结核心风险点',
                       '提取所有支付节点',
                       '检查违约责任条款'
                     ].map(q => (
                       <button key={q} className="px-3 py-1.5 bg-blue-50/50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100/50">
                         {q}
                       </button>
                     ))}
                  </div>
                 </div>
               </div>

               <div className="flex items-start gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shrink-0 shadow-sm font-black text-xs font-mono">
                    U
                  </div>
                  <div className="inline-block max-w-[85%] p-4 rounded-2xl text-sm bg-blue-100 text-blue-900 shadow-sm font-bold text-right">
                    上述文档中，合同总金额是多少？支付流程是怎么安排的？
                  </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                   <Bot size={20} />
                 </div>
                 <div className="flex-1 space-y-2">
                   <div className="inline-block max-w-full p-4 rounded-2xl text-sm bg-white text-gray-800 border border-gray-100 shadow-sm font-medium leading-relaxed">
                     根据《XX工程项目施工合同》第四章：
                     <div className="mt-3 p-3 bg-gray-50 rounded-xl font-bold text-xs text-gray-600 border border-gray-100 space-y-1.5">
                      <p>1. **合同总额**：¥125,000,000.00</p>
                      <p>2. **预付款**：合同金额的20%</p>
                      <p>3. **进度款**：按月完成工程量的70%拨付</p>
                     </div>
                   </div>
                   <div className="flex flex-wrap gap-2 mt-2">
                     <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50/50 border border-blue-100 rounded-md text-xs text-blue-600 font-medium">
                       <span className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center text-xs">1</span>
                       <span className="truncate max-w-[150px]">《XX工程项目合同》 P5</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Chat Input Area - Matched with ChatInterface.tsx */}
             <div className="px-5 pb-8 pt-2 bg-white shrink-0">
               <div className="relative">
                 <div className="bg-white border border-gray-200 rounded-[24px] shadow-xl shadow-gray-200/40 overflow-hidden transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50">
                   {chatDocId && docs.find(d => d.id === chatDocId) && (
                     <div className="px-6 pt-4 flex flex-col gap-2">
                       <div className="flex flex-wrap gap-2">
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 group/chip animate-in fade-in slide-in-from-bottom-2">
                           <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                              <FileText size={10} />
                           </div>
                           <span className="text-xs font-bold text-gray-600 truncate max-w-[150px]">{docs.find(d => d.id === chatDocId)?.name}</span>
                           <button 
                             onClick={() => setChatDocId(null)}
                             className="w-3.5 h-3.5 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors cursor-pointer"
                           >
                              <Plus size={8} className="rotate-45" />
                           </button>
                         </div>
                       </div>
                     </div>
                   )}
                   <textarea
                    disabled={!chatDocId}
                    placeholder={
                      !chatDocId 
                        ? "请在左侧点击文档对话按钮选择文档..." 
                        : "询问文档明细、审计规则、或是比对疑点..."
                    }
                    rows={2}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none py-4 px-6 min-h-[80px] max-h-[200px] placeholder:text-gray-300 font-medium disabled:cursor-not-allowed"
                   />
                   
                   <div className="flex items-center justify-between px-4 pb-4 pt-1">
                     <div className="flex items-center gap-1">
                       
                       <div className="h-4 w-[1px] bg-gray-100 mx-2" />
                       
                       <div className="relative inline-flex items-center group/select">
                         <select className="appearance-none bg-gray-50 border border-gray-100 rounded-full px-3 py-1 pr-6 text-xs font-bold text-gray-500 focus:outline-none hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50" disabled={!chatDocId}>
                           <option>DeepSeek-V3</option>
                         </select>
                         <ChevronDown size={10} className="absolute right-2 text-gray-400 pointer-events-none" />
                       </div>
                     </div>
                     
                     <button 
                       disabled={!chatDocId}
                       className="w-9 h-9 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center transition-all hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-400"
                     >
                       <ArrowUp size={20} />
                     </button>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
      
      {/* Knowledge Base Modal */}
      <AnimatePresence>
        {showKbModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKbModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <h3 className="font-normal text-lg tracking-tight text-gray-900 flex items-center gap-2">
                  <Library size={18} className="text-blue-600" />
                  从知识库选择文档分析
                </h3>
                <button onClick={() => setShowKbModal(false)} className="text-gray-400 hover:text-gray-600">
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                {/* KB Sidebar */}
                <div className="w-48 border-r border-gray-100 bg-gray-50/50 p-2 space-y-1">
                  {KNOWLEDGE_BASES.filter(kb => kb.id !== 'laws').map(kb => (
                    <button
                      key={kb.id}
                      onClick={() => setActiveKbId(kb.id)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between leading-tight",
                        activeKbId === kb.id 
                          ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" 
                          : "text-gray-500 hover:bg-white/60 hover:text-gray-700"
                      )}
                    >
                      {kb.name}
                      {activeKbId === kb.id && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>

                {/* Document List */}
                <div className="flex-1 flex flex-col bg-white">
                  <div className="p-4 border-b border-gray-50 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {KNOWLEDGE_BASES.find(k => k.id === activeKbId)?.name} (共 {SAMPLE_KB_DOCS.filter(d => d.kbId === activeKbId).length} 个文档)
                      </span>
                    </div>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="在当前库中搜索..."
                        value={kbSearchQuery}
                        onChange={(e) => setKbSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-2">
                    {SAMPLE_KB_DOCS
                      .filter(d => d.kbId === activeKbId)
                      .filter(d => d.name.toLowerCase().includes(kbSearchQuery.toLowerCase()))
                      .map(kbDoc => {
                    const isSelected = selectedKbDocIds.includes(kbDoc.id);
                    return (
                      <div 
                        key={kbDoc.id}
                        onClick={() => handleToggleKbDoc(kbDoc.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl cursor-pointer border transition-all flex items-center gap-3 group relative",
                          isSelected 
                            ? "bg-blue-50 border-blue-200" 
                            : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center transition-all",
                          isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 bg-white"
                        )}>
                          {isSelected && <Plus size={14} className="rotate-45" />}
                        </div>
                        <div className="p-2.5 bg-gray-100 group-hover:bg-white rounded-xl text-gray-400 group-hover:text-blue-600 transition-all shadow-sm">
                          <FileText size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 font-bold group-hover:text-blue-700 truncate">{kbDoc.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">PDF · 3.2MB · 2024-03-15</p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {SAMPLE_KB_DOCS.filter(d => d.kbId === activeKbId).length > 0 && 
                   SAMPLE_KB_DOCS.filter(d => d.kbId === activeKbId && d.name.toLowerCase().includes(kbSearchQuery.toLowerCase())).length === 0 && (
                    <div className="py-20 text-center">
                      <Search size={48} className="mx-auto text-gray-100 mb-4" />
                      <p className="text-sm text-gray-400 font-medium">未找到匹配文档</p>
                    </div>
                  )}

                  {SAMPLE_KB_DOCS.filter(d => d.kbId === activeKbId).length === 0 && (
                    <div className="pt-20 text-center">
                      <Library size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-sm text-gray-400 font-medium">该分类下暂无文档</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0 flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  已选择 {selectedKbDocIds.length} 个文档
                </p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setShowKbModal(false);
                      setSelectedKbDocIds([]);
                    }}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                  >
                    取消
                  </button>
                  <button 
                    disabled={selectedKbDocIds.length === 0}
                    onClick={() => handleAddFromKb(selectedKbDocIds)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:grayscale transition-all active:scale-95"
                  >
                    确认添加
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Parse Configuration Modal */}
      <AnimatePresence>
        {showParseModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowParseModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-normal text-gray-900 tracking-tight tracking-tight">解析配置</h3>
                    <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">当前文档: {parsingConfig.docName}</p>
                  </div>
                </div>
                <button onClick={() => setShowParseModal(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-10 custom-scrollbar">
                {/* Document Type Selection */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">选择解析模型</h4>
                  </div>
                  <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1.5">
                    {[
                      { id: 'invoice', label: '发票模型', icon: <FileText size={14} /> },
                      { id: 'bid', label: '标书模型', icon: <FileCheck2 size={14} /> },
                      { id: 'contract', label: '合同模型', icon: <ShieldAlert size={14} /> },
                      { id: 'tender_announcement', label: '招标公告', icon: <Bot size={14} /> }
                    ].filter(type => type.id === parsingConfig.docType).map(type => (
                      <button
                        key={type.id}
                        onClick={() => setParsingConfig(prev => ({ ...prev, docType: type.id as any, options: Object.keys(EXTRACTION_DETAILS[type.id] || []) }))}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
                          parsingConfig.docType === type.id 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        {type.icon}
                        {type.label}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Extraction Options Selection */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">配置提取字段</h4>
                    </div>
                    <button 
                      onClick={() => {
                        const allOpts = Object.keys(EXTRACTION_DETAILS[parsingConfig.docType]);
                        setParsingConfig(prev => ({ ...prev, options: prev.options.length === allOpts.length ? [] : allOpts }));
                      }}
                      className="text-xs font-black text-blue-600 hover:underline px-2"
                    >
                      一键快速选择
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(EXTRACTION_DETAILS[parsingConfig.docType]).map(([opt, details]) => (
                      <div 
                        key={opt}
                        onClick={() => toggleParsingOption(opt)}
                        className={cn(
                          "p-4 rounded-3xl border transition-all cursor-pointer group flex flex-col gap-3",
                          parsingConfig.options.includes(opt)
                            ? "bg-white border-blue-300 ring-2 ring-blue-500/10 shadow-md"
                            : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-sm font-black transition-colors tracking-tight",
                            parsingConfig.options.includes(opt) ? "text-gray-900" : "text-gray-600"
                          )}>{opt}</span>
                          <div className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-all",
                            parsingConfig.options.includes(opt) 
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm" 
                              : "border-gray-200 bg-gray-50 group-hover:bg-gray-100"
                          )}>
                            {parsingConfig.options.includes(opt) && <Check size={14} />}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {details.map(d => (
                            <span 
                              key={d} 
                              className={cn(
                                "text-[9.5px] px-2 py-1 rounded-md font-medium transition-colors",
                                parsingConfig.options.includes(opt) 
                                  ? "bg-gray-50 text-gray-600" 
                                  : "bg-gray-50/50 text-gray-400 group-hover:bg-gray-50 group-hover:text-gray-500"
                              )}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-xs font-black text-gray-400 uppercase tracking-widest">已勾选任务项</span>
                   <span className="text-sm font-black text-blue-600">{parsingConfig.options.length} 个配置类</span>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setShowParseModal(false)} className="px-6 py-2.5 text-sm font-black text-gray-500 hover:text-gray-700">取消</button>
                  <button 
                    disabled={parsingConfig.options.length === 0}
                    onClick={handleStartParsing}
                    className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-500/20 disabled:opacity-40 disabled:grayscale transition-all active:scale-95 flex items-center gap-2"
                  >
                    立即解析
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowConfirmDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">确认删除文档？</h3>
                <p className="text-sm text-gray-500 mb-6">
                  删除后该文档的所有分析结果、比对记录将无法恢复。是否确认删除？
                </p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowConfirmDelete(null)}
                    className="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      setDocs(prev => prev.filter(d => d.id !== showConfirmDelete));
                      setSelectedDocs(prev => prev.filter(id => id !== showConfirmDelete));
                      if (selectedDocId === showConfirmDelete) setSelectedDocId(null);
                      if (chatDocId === showConfirmDelete) setChatDocId(null);
                      setShowConfirmDelete(null);
                    }}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all active:scale-95"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
