import React from 'react';
import { 
  Plus,
  Settings, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  FileCheck,
  ShieldCheck,
  Zap,
  Library,
  BarChart3,
  HardDrive,
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  Menu,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Conversation } from '@/src/types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: { id: string; label: string }[];
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'ai_chat', label: '智能 AI 对话', icon: <MessageSquare size={18} /> },
  { 
    id: 'audit_project', 
    label: '审计项目管理', 
    icon: <FileCheck size={18} />,
    children: [
      { id: 'project_list', label: '审计项目列表' },
      { id: 'template_mgmt', label: '文书模板管理' },
      { id: 'smart_doc_writing', label: '智能文书编写' },
      { id: 'my_docs', label: '我的文书管理' }
    ]
  },
  { 
    id: 'doc_correction', 
    label: '智能文档矫正', 
    icon: <ShieldCheck size={18} />,
    children: [
      { id: 'rule_config', label: '矫正规则配置' },
      { id: 'doc_correct', label: '智能文书矫正' }
    ]
  },
  { 
    id: 'audit_skills', 
    label: '智能审计模型库', 
    icon: <Zap size={18} />,
    children: [
      { id: 'cat_mgmt', label: '模型分类管理' },
      { id: 'rule_mgmt', label: '审查点管理' },
      { id: 'skill_mgmt', label: '审计模型管理' }
    ]
  },
  { 
    id: 'knowledge_base', 
    label: '知识库', 
    icon: <Library size={18} />,
    children: [
      { id: 'kb_analysis', label: '智能文档分析' },
      { id: 'law_kb', label: '法律法规知识库' },
      { id: 'kb_audit', label: '审计资料知识库' },
      { id: 'kb_personal', label: '个人资料知识库' }
    ]
  },
  { 
    id: 'data_analysis', 
    label: '智能数据分析', 
    icon: <BarChart3 size={18} />
  },
  { 
    id: 'data_source', 
    label: '数据源', 
    icon: <HardDrive size={18} />,
    children: [
      { id: 'ds_access', label: '数据源接入' },
      { id: 'ds_preview', label: '数据结构预览' },
      { id: 'ds_mapping', label: '数据映射管理' },
      { id: 'ds_approval', label: '数据审批' }
    ]
  },
  { 
    id: 'system_management', 
    label: '系统管理', 
    icon: <Settings size={18} />,
    children: [
      { id: 'sys_llm', label: 'LLM管理' },
      { id: 'sys_org', label: '组织管理' },
      { id: 'sys_role', label: '角色管理' },
      { id: 'sys_user', label: '用户管理' },
      { id: 'sys_permission', label: '权限管理' },
      { id: 'sys_log', label: '日志查询' },
      { id: 'sys_ops', label: '综合管理' }
    ]
  },
];

export default function Sidebar({ activeView, onViewChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>(['audit_project']);

  const toggleMenu = (item: MenuItem) => {
    if (isCollapsed) {
      onToggleCollapse();
      setExpandedMenus([item.id]);
      if (item.children && item.children.length > 0) {
        onViewChange(item.children[0].id);
      }
      return;
    }
    const isExpanding = !expandedMenus.includes(item.id);
    setExpandedMenus(prev => 
      prev.includes(item.id) ? [] : [item.id]
    );
    if (isExpanding && item.children && item.children.length > 0) {
      onViewChange(item.children[0].id);
    }
  };

  return (
    <div className={cn(
      "h-full bg-[#E0E7F2] border-r border-gray-200 flex flex-col text-gray-700 transition-all duration-300 shrink-0 overflow-hidden",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">
        <nav className="space-y-1 py-4">
          {MENU_ITEMS.map((item) => (
            <div key={item.id} className="space-y-1">
              <div 
                onClick={() => {
                  if (item.children) {
                    toggleMenu(item);
                  } else {
                    onViewChange(item.id);
                  }
                }}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all text-sm font-medium group",
                  activeView === item.id 
                    ? "bg-white/40 backdrop-blur-md text-blue-600 shadow-[0_4px_12px_-2px_rgba(59,130,246,0.12)] border border-white/50" 
                    : "hover:bg-white/60",
                  isCollapsed && "justify-center px-0"
                )}
                title={isCollapsed ? item.label : ""}
              >
                <div className={cn("flex items-center gap-3", isCollapsed && "gap-0")}>
                  <span className={cn(
                    "transition-colors",
                    activeView === item.id ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                  )}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.children && (
                  <span className="ml-auto text-gray-300 group-hover:text-blue-400 transition-colors">
                    {expandedMenus.includes(item.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                )}
              </div>
              
              {item.children && expandedMenus.includes(item.id) && !isCollapsed && (
                <div className="ml-4 space-y-1">
                  {item.children.map((child) => (
                    <div 
                      key={child.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewChange(child.id);
                      }}
                      className={cn(
                        "px-8 py-2.5 text-xs cursor-pointer transition-all rounded-xl relative",
                        activeView === child.id 
                          ? "text-blue-600 font-bold bg-blue-50/50" 
                          : "text-gray-500 hover:text-blue-600 hover:bg-white"
                      )}
                    >
                      {activeView === child.id && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                      )}
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
