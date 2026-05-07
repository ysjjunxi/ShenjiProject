
export interface SavedDocument {
  id: string;
  name: string;
  type: string;
  content: string;
  createdAt: number;
}

export const MOCK_SAVED_DOCUMENTS: SavedDocument[] = [
  {
    id: '1',
    name: '2023年度XX单位财务收支审计报告',
    type: '审计报告',
    content: '# 2023年度XX单位财务收支审计报告\n\n## 一、审计背景\n根据审计局年度计划安排...',
    createdAt: Date.now() - 86400000 * 10
  },
  {
    id: '2',
    name: 'XX项目绩效评价审计底稿',
    type: '审计底稿',
    content: '# XX项目绩效评价审计底稿\n\n## 审计事项：绩效目标达成情况\n审计描述：...',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: '3',
    name: '关于XX部门违规发放津补贴的情况说明',
    type: '审计调查',
    content: '# 情况说明\n\n审计发现，XX部门在2023年期间...',
    createdAt: Date.now() - 86400000 * 2
  }
];
