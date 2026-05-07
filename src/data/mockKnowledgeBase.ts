export interface KBDocument {
  id: string;
  name: string;
  category: 'audit' | 'personal';
  type: 'pdf' | 'docx' | 'txt' | 'xlsx';
  size: string;
  updatedAt: number;
  description: string;
}

export const MOCK_KB_DOCUMENTS: KBDocument[] = [
  {
    id: 'kb-doc-1',
    name: '2025年度财政预算审计工作重点.pdf',
    category: 'audit',
    type: 'pdf',
    size: '1.2 MB',
    updatedAt: Date.now() - 86400000 * 2,
    description: '包含本年度财政审计的核心流程与关注点。'
  },
  {
    id: 'kb-doc-2',
    name: '内控风险评价模型标准手册.docx',
    category: 'audit',
    type: 'docx',
    size: '456 KB',
    updatedAt: Date.now() - 86400000 * 5,
    description: '标准化审计流程参考。'
  },
  {
    id: 'kb-doc-3',
    name: '往年社保审计发现问题汇总.xlsx',
    category: 'audit',
    type: 'xlsx',
    size: '2.1 MB',
    updatedAt: Date.now() - 86400000 * 10,
    description: '常见审计疑点与证据链参考。'
  },
  {
    id: 'kb-doc-4',
    name: '某单位关于固定资产管理的回复函.pdf',
    category: 'personal',
    type: 'pdf',
    size: '890 KB',
    updatedAt: Date.now() - 86400000 * 1,
    description: '真实业务反馈样例，可作为编写模板参考。'
  },
  {
    id: 'kb-doc-5',
    name: '项目审计经验总结心得.txt',
    category: 'personal',
    type: 'txt',
    size: '12 KB',
    updatedAt: Date.now() - 86400000 * 3,
    description: '个人在往期项目中积累的措辞技巧与注意事项。'
  }
];
