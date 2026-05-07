import { AuditProject } from '../types';

export const MOCK_PROJECTS: AuditProject[] = [
  {
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
  {
    id: 'p1',
    name: '2024年度某市重大水利项目专项审计',
    code: 'AUDIT-2024-001',
    object: '某市水利局',
    period: '2024-01-01 至 2024-12-31',
    members: [
      { name: '张审计', isLeader: true },
      { name: '李成员', isLeader: false }
    ],
    status: 'report_generated',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'p2',
    name: '某国有企业2023年度财务收支审计',
    code: 'AUDIT-2024-002',
    object: '某国有集团',
    period: '2023-01-01 至 2023-12-31',
    members: [
      { name: '李审计', isLeader: true },
      { name: '王成员', isLeader: false }
    ],
    status: 'working_paper',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 7200000
  },
  {
    id: 'p3',
    name: '2024年上半年全市保障性安居工程审计',
    code: 'AUDIT-2024-003',
    object: '某市住建局',
    period: '2024-01-01 至 2024-06-30',
    members: [
      { name: '王审计', isLeader: true }
    ],
    status: 'evidence',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000
  },
  {
    id: 'p4',
    name: '某高校校长任期经济责任审计',
    code: 'AUDIT-2024-004',
    object: '某大学',
    period: '2020-01-01 至 2023-12-31',
    members: [
      { name: '赵审计', isLeader: true },
      { name: '刘成员', isLeader: false }
    ],
    status: 'authorizing',
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 2
  }
];
