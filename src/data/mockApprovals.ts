import { v4 as uuidv4 } from 'uuid';

export interface ApprovalRecord {
  id: string;
  project: string;
  applicant: string;
  database: string;
  applyTime: string;
  applyNote: string;
  approver: string;
  approveTime: string;
  status: 'pending' | 'approved' | 'rejected';
}

class ApprovalStore {
  private data: ApprovalRecord[] = [
    {
      id: 'AP-2026-001',
      project: 'A分公司三公经费专项审计',
      applicant: '张审核',
      database: '财务中心_费用库 (MySQL)',
      applyTime: '2026-04-20 10:30',
      applyNote: '需要调取2025年度A分公司全部差旅和业务招待费明细数据进行比对分析。',
      approver: '-',
      approveTime: '-',
      status: 'pending'
    },
    {
      id: 'AP-2026-002',
      project: '国企领导干部经济责任审计',
      applicant: '李主审',
      database: '人力资源库 (Oracle)',
      applyTime: '2026-04-18 14:15',
      applyNote: '需审核任期内高管薪酬发放情况。',
      approver: '王局长',
      approveTime: '2026-04-18 16:00',
      status: 'approved'
    },
    {
      id: 'AP-2026-003',
      project: '市属重点工程决算审计',
      applicant: '赵基建',
      database: '工程项目管理系统 (SQLServer)',
      applyTime: '2026-04-15 09:00',
      applyNote: '获取第一标段各项材料采购明细数据。',
      approver: '王局长',
      approveTime: '2026-04-15 11:30',
      status: 'rejected'
    }
  ];

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  get snapshot() {
    return this.data;
  }

  addApproval(record: Omit<ApprovalRecord, 'id' | 'approver' | 'approveTime' | 'status'>) {
    this.data = [
      {
        ...record,
        id: `AP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        approver: '-',
        approveTime: '-',
        status: 'pending'
      },
      ...this.data
    ];
    this.notify();
  }

  updateApprovalStatus(id: string, status: 'approved' | 'rejected') {
    this.data = this.data.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          approver: '当前管理员',
          approveTime: new Date().toLocaleString('zh-CN', { hour12: false }).substring(0, 16).replace(/\//g, '-')
        };
      }
      return item;
    });
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const approvalStore = new ApprovalStore();
