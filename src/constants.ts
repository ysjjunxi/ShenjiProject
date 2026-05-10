import { ModelCategory, KnowledgeBase, AuditRule } from './types';

export const MOCK_CATEGORIES: ModelCategory[] = [
  {
    id: 'c1',
    name: '财政收支审计类模型',
    description: '审计预算编制是否科学、执行是否严格符合规定，包含三公经费、国库支付等。',
    parentId: null,
    level: 1,
    modelCount: 12,
  },
  {
    id: 'c2',
    name: '重大政策贯彻执行审计模型',
    description: '审计重大政策落实及资金使用效果，如乡村振兴、专项债券等。',
    parentId: null,
    level: 1,
    modelCount: 11,
  },
  {
    id: 'c3',
    name: '重大项目建设审计模型',
    description: '针对基建工程、水利工程、市政工程的全生命周期审计。',
    parentId: null,
    level: 1,
    modelCount: 10,
  },
  {
    id: 'c4',
    name: '民生保障审计模型',
    description: '审计医保、惠农、低保、教育等民生领域资金使用。',
    parentId: null,
    level: 1,
    modelCount: 12,
  },
  {
    id: 'c5',
    name: '国有资产资源审计模型',
    description: '审计农村集体“三资”、国有资产处置、土地资源使用等。',
    parentId: null,
    level: 1,
    modelCount: 11,
  },
  {
    id: 'c6',
    name: '领导干部审计模型',
    description: '审计领导干部任职期间的经济责任履行、重大决策合规性等。',
    parentId: null,
    level: 1,
    modelCount: 10,
  }
];

export const KNOWLEDGE_BASES: KnowledgeBase[] = [
  { 
    id: 'kb_laws', 
    name: '法律法规知识库', 
    category: 'law', 
    docCount: 156, 
    status: 'Normal', 
    storageType: 'Vector', 
    updatedAt: Date.now(),
    description: '收录国家及地方财经法律、法规、规章。'
  },
  { 
    id: 'kb_audit', 
    name: '审计资料知识库', 
    category: 'audit', 
    docCount: 89, 
    status: 'Normal', 
    storageType: 'Vector', 
    updatedAt: Date.now(),
    description: '包含审计工作底稿模板、审计案例、经验总结等。'
  },
  { 
    id: 'kb_personal', 
    name: '个人知识库', 
    category: 'personal', 
    docCount: 23, 
    status: 'Normal', 
    storageType: 'Vector', 
    updatedAt: Date.now(),
    description: '个人收集的审计相关参考资料。'
  },
];

export const MOCK_MATERIALS = [
  { id: 'mat1', kbId: 'kb_audit', name: '2023年度财政预决算报告.pdf' },
  { id: 'mat2', kbId: 'kb_audit', name: '三公经费管理规定.docx' },
  { id: 'mat3', kbId: 'kb_audit', name: '部门预算执行情况表.xlsx' },
  { id: 'mat4', kbId: 'kb_audit', name: '专项资金管理办法.pdf' },
];

export const STANDARD_CHECKPOINTS = [
  {
    id: 'scp1',
    name: '三公经费支出合规性审查',
    description: '检查三公经费支出是否超预算、超标准。',
    standardTables: [
      { tableName: '标准表', fields: ['amount', 'date', 'type'] },
      { tableName: '预算限制表', fields: ['limit_amount', 'category'] }
    ]
  },
  {
    id: 'scp2',
    name: '虚增收入异常检测',
    description: '通过对账单匹配发现潜在的收入造假。',
    standardTables: [
      { tableName: '收入流水表', fields: ['order_id', 'amount', 'customer'] },
      { tableName: '合同对应表', fields: ['contract_id', 'planned_amount'] }
    ]
  }
];

export const MOCK_RULES: AuditRule[] = [
  {
    id: 'r1',
    name: '三公经费超预算校验规则',
    businessType: '财务审计业务',
    ruleType: 'general',
    description: '用于识别三公经费超限额或无预算支出的违规情况。',
    fixedCheckpoints: [
      {
        name: '预算刚性约束审查点',
        description: '三公经费支出必须控制在年度预算额度内，不得超预算、无预算支出，无合规预算调整审批的超预算支出，自动触发疑点标记。'
      }
    ],
    configurableCheckpoints: [
      {
        id: 'cc_1',
        name: '三公经费超限额支出分析',
        logicGroups: [
          {
            id: 'lg_1',
            logicBlocks: [
              {
                id: 'lb_1',
                leftTerm: '三公经费年度支出金额',
                operator: '>',
                rightTerm: '年度预算金额',
                rightType: 'param',
                paramValue: '10',
                paramUnit: '%',
                paramRangeMin: '5',
                paramRangeMax: '20',
                relation: 'AND'
              }
            ],
            penaltyBasis: {
              source: '《党政机关厉行节约反对浪费条例》',
              chapter: '第八条',
              content: '党政机关应当严格执行综合预算，不得超预算或者无预算安排支出，不得虚列支出、转移或者套取预算资金。'
            }
          }
        ]
      }
    ],
    standardTables: [
      { tableName: '三公经费预算表', fields: ['dept_id', 'budget_amount', 'year'] },
      { tableName: '三公经费支出流水', fields: ['dept_id', 'amount', 'date', 'purpose'] }
    ],
    outputData: '超过阈值的资金明细记录',
    apiUrl: '/api/rules/check_amount',
    status: 'enabled',
    creator: '张审计',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'r2',
    name: '合同签订违规校验规则',
    businessType: '工程审计业务',
    ruleType: 'dedicated',
    description: '识别潜在的违规拖延合同签订以及合同金额偏差。',
    fixedCheckpoints: [
      {
        name: '合同签订时效与金额审查点',
        description: '合同签订应及时且金额不得擅自偏离中标金额。'
      }
    ],
    configurableCheckpoints: [
      {
        id: 'cc_2',
        name: '合同违规判定',
        logicGroups: [
          {
            id: 'lg_2',
            logicBlocks: [
              {
                id: 'lb_3',
                leftTerm: '中标至签订时间',
                operator: '>',
                rightTerm: '30',
                rightType: 'fixed',
                paramUnit: '天',
                relation: 'OR'
              }
            ],
            penaltyBasis: {
              source: '《中华人民共和国政府采购法》',
              chapter: '第四十六条',
              content: '采购人与中标、成交供应商应当在中标、成交通知书发出之日起三十日内，按照采购文件确定的事项签订政府采购合同。'
            }
          }
        ]
      }
    ],
    standardTables: [
      { tableName: '中标通知单', fields: ['bid_id', 'bid_amount', 'bid_date'] },
      { tableName: '工程合同登记表', fields: ['contract_id', 'bid_id', 'contract_amount', 'sign_date'] }
    ],
    outputData: '违规拖延或金额异常的合同清单',
    apiUrl: '/api/rules/check_contract',
    status: 'enabled',
    creator: '李审计',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 7200000
  },
  {
    id: 'r3',
    name: '项目超概算预警规则',
    businessType: '工程审计业务',
    ruleType: 'general',
    description: '实时监测工程项目支出是否超过概算额度。',
    fixedCheckpoints: [
      { name: '超概算强制审计点', description: '项目累计支出超过概算10%时，必须启动专项审计。' }
    ],
    configurableCheckpoints: [],
    standardTables: [
      { tableName: '工程概算表', fields: ['project_id', 'total_investment'] },
      { tableName: '工程结算明细表', fields: ['project_id', 'settlement_amount'] }
    ],
    outputData: '超概算预警清单',
    apiUrl: '/api/rules/project_budget',
    status: 'enabled',
    creator: '王审计',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now()
  }
];
