import { DocumentTemplate } from '../types';

export const MOCK_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tpl1',
    name: '通用取证单模板',
    type: 'evidence',
    templateType: '审计取证单',
    scenario: '适用于各类审计项目的常规取证。',
    content: '取证事项：\n疑点描述：\n取证依据：\n被审计单位意见：',
    fields: [
      { id: 'f1', label: '取证事项', type: 'input', required: true },
      { id: 'f2', label: '疑点描述', type: 'textarea', required: true },
      { id: 'f3', label: '取证依据', type: 'textarea', required: true }
    ],
    prompts: ['请详细描述疑点发现过程', '引用具体法规条款'],
    creator: '张审计',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 3600000,
    isUsed: true,
    version: 1
  },
  {
    id: 'tpl2',
    name: '通用底稿模板',
    type: 'working_paper',
    templateType: '审计工作底稿',
    scenario: '适用于各类审计项目的通用审计工作底稿。',
    content: '审计过程：\n审计结论：\n审核意见：',
    fields: [
      { id: 'f4', label: '审计目标', type: 'input', required: true },
      { id: 'f5', label: '审计程序', type: 'textarea', required: true }
    ],
    prompts: ['核对资金拨付明细'],
    creator: '李审计',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 7200000,
    isUsed: false,
    version: 2
  },
  {
    id: 'tpl3',
    name: '通用审计报告模板',
    type: 'report',
    templateType: '审计报告',
    scenario: '适用于各类审计项目的标准审计报告。',
    content: '一、审计概况\n二、审计总体评价\n三、审计发现的问题及整改建议\n四、审计结论\n五、其他事项\n六、附件',
    fields: [
      { id: 'f6', label: '审计概况', type: 'textarea', required: true },
      { id: 'f7', label: '总体评价', type: 'textarea', required: true }
    ],
    prompts: ['客观评价被审计单位工作'],
    creator: '王审计',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 1800000,
    isUsed: false,
    version: 1
  }
];
