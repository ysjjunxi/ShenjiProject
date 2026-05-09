import React from 'react';
import { GoogleGenAI } from "@google/genai";
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HistoryPanel from './components/HistoryPanel';
import ChatInterface from './components/ChatInterface';
import AuditProjectList from './components/AuditProjectList';
import AuditProjectDetail from './components/AuditProjectDetail';
import ModelCategoryMgmt from './components/ModelCategoryMgmt';
import ToolMgmt from './components/ToolMgmt';
import AuditModelMgmt from './components/AuditModelMgmt';
import AuditRuleMgmt from './components/AuditRuleMgmt';
import SmartDocWriting from './components/SmartDocWriting';
import TemplateMgmt from './components/TemplateMgmt';
import CorrectionRuleMgmt from './components/CorrectionRuleMgmt';
import DocumentCorrection from './components/DocumentCorrection';
import DocumentAnalysis from './components/DocumentAnalysis';
import KnowledgeBaseHome from './components/KnowledgeBaseHome';
import DataSourceAccess from './components/DataSourceAccess';
import DataSourcePreview from './components/DataSourcePreview';
import DataMappingMgmt from './components/DataMappingMgmt';
import DataSourceApproval from './components/DataSourceApproval';
import DataAnalysisMerged from './components/DataAnalysisMerged';
import MyDocuments from './components/MyDocuments';
import SystemOpsManagement from './components/SystemOpsManagement';
import SystemPermissionManagement from './components/SystemPermissionManagement';
import SystemLLMManagement from './components/SystemLLMManagement';
import { SystemOrg, SystemRole, SystemUser, SystemLog } from './components/SystemPlaceholders';
import { 
  Conversation, 
  Message, 
  FileInfo, 
  AUDIT_MODELS, 
  AuditModel 
} from './types';
import { v4 as uuidv4 } from 'uuid';
import { BrainCircuit, HardDrive, BarChart3, List, ArrowLeft, CheckCircle2, Terminal, RefreshCw, Play } from 'lucide-react';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: 'sample-1',
    title: '2024年专项资金拨付异常分析',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: '请帮我分析一下2024年第一季度专项资金拨付中是否存在异常数据？',
        timestamp: Date.now() - 86400000 * 2, // 2 days ago
      },
      {
        id: 'm2',
        role: 'assistant',
        content: '经过对2024年第一季度专项资金拨付数据的初步扫描，我发现了以下几点潜在异常：\n\n1. **重复支付风险**：在“中小企业扶持资金”项目中，有3笔金额完全一致（均为50万元）的款项在同一天拨付给了同一家企业，建议核实是否存在重复申报或误操作。\n2. **拨付进度滞后**：部分环保专项资金的拨付进度仅为15%，远低于序时进度要求。\n3. **收款方资质风险**：有2家收款企业的经营状态显示为“注销”，需重点关注资金去向。\n\n您可以点击下方按钮，让我为您生成详细的审计疑点清单。',
        timestamp: Date.now() - 86400000 * 2 + 5000,
        citations: [
          { title: '《2024年度专项资金管理办法》', url: '#' },
          { title: '企业信用信息公示系统数据', url: '#' }
        ]
      }
    ],
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    config: {
      modelId: 'gpt4-audit',
      knowledgeBases: ['audit_data'],
      files: []
    }
  },
  {
    id: 'sample-2',
    title: '预算执行差异情况解读',
    messages: [
      {
        id: 'm3',
        role: 'user',
        content: '为什么本月行政办公费用的实际支出比预算高出了20%？',
        timestamp: Date.now() - 86400000, // 1 day ago
      },
      {
        id: 'm4',
        role: 'assistant',
        content: '通过对比预算指标与实际支出明细，行政办公费用超支20%的主要原因如下：\n\n- **集中采购影响**：本月进行了年度办公耗材的集中采购，涉及金额约12万元，该项支出在预算编制时是按季度分摊的，导致单月数据激增。\n- **差旅费增加**：由于开展了为期两周的异地审计项目，差旅费实际支出超出预算约5万元。\n\n建议在后续预算执行分析中，将此类周期性集中采购支出进行平滑处理。',
        timestamp: Date.now() - 86400000 + 3000,
      }
    ],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    config: {
      modelId: 'financial',
      knowledgeBases: ['personal'],
      files: []
    }
  },
  {
    id: 'sample-3',
    title: '审计法相关条款查询',
    messages: [
      {
        id: 'm5',
        role: 'user',
        content: '审计机关在审计过程中有哪些权限？',
        timestamp: Date.now() - 3600000 * 5, // 5 hours ago
      },
      {
        id: 'm6',
        role: 'assistant',
        content: '根据《中华人民共和国审计法》，审计机关在审计过程中主要拥有以下权限：\n\n1. **检查权**：有权检查被审计单位的会计凭证、会计账簿、财务会计报告等资料。\n2. **调查取证权**：有权就审计事项向有关单位和个人进行调查，并取得有关证明材料。\n3. **强制措施权**：在特定情况下，经批准可以封存账簿和资料，或者暂停拨付有关款项。\n4. **建议处理权**：对审计发现的问题，有权提出纠正、处理、处罚的建议。\n\n详细条款请参考《审计法》第三章。',
        timestamp: Date.now() - 3600000 * 5 + 2000,
        citations: [
          { title: '《中华人民共和国审计法》', url: '#' }
        ]
      }
    ],
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 5,
    config: {
      modelId: 'deepseek-chat',
      knowledgeBases: ['laws'],
      files: []
    }
  }
];

export default function App() {
  const [activeView, setActiveView] = React.useState('ai_chat');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);
  const [selectedDataSourceId, setSelectedDataSourceId] = React.useState<string | null>(null);
  const [generatedSql, setGeneratedSql] = React.useState<string>('');
  const [generatedSqlTab, setGeneratedSqlTab] = React.useState<string>('structure');
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Load from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('audit_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to parse saved conversations', e);
      }
    } else {
      setConversations(SAMPLE_CONVERSATIONS);
      setActiveId(SAMPLE_CONVERSATIONS[0].id);
    }
  }, []);

  // Save to localStorage
  React.useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('audit_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeId);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveView('project_detail');
  };

  const handleNewConversation = () => {
    const newId = uuidv4();
    const newConv: Conversation = {
      id: newId,
      title: '新任务 ' + new Date().toLocaleTimeString(),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      config: {
        modelId: 'deepseek-chat',
        knowledgeBases: ['personal'],
        files: []
      }
    };
    setConversations([newConv, ...conversations]);
    setActiveId(newId);
    setActiveView('ai_chat');
  };

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    setActiveView('ai_chat');
  };

  const handleRemoveConversation = (id: string) => {
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleSendMessage = async (text: string) => {
    let currentConv = activeConversation;
    let currentId = activeId;

    if (!currentConv) {
      const newId = uuidv4();
      const newConv: Conversation = {
        id: newId,
        title: text.slice(0, 20),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        config: {
          modelId: 'deepseek-chat',
          knowledgeBases: ['personal'],
          files: []
        }
      };
      setConversations([newConv, ...conversations]);
      setActiveId(newId);
      currentConv = newConv;
      currentId = newId;
    }

    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      files: currentConv.config.files.length > 0 ? [...currentConv.config.files] : undefined
    };

    const updatedMessages = [...currentConv.messages, userMsg];
    
    let title = currentConv.title;
    if (currentConv.messages.length === 0) {
      title = text.slice(0, 20);
    }

    setConversations(prev => prev.map(c => 
      c.id === currentId ? { ...c, title, messages: updatedMessages, updatedAt: Date.now() } : c
    ));

    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: updatedMessages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: `你是一个专业的审计AI大模型助手。`
        }
      });

      const result = await model;
      const responseText = result.text || '抱歉，我无法生成回答。';

      const assistantMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
        citations: [
          { title: '《中华人民共和国审计法》', url: '#' }
        ]
      };

      setConversations(prev => prev.map(c => 
        c.id === currentId ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() } : c
      ));
    } catch (error) {
      console.error('Gemini API Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    if (activeId) {
      setConversations(conversations.map(c => 
        c.id === activeId ? { ...c, messages: [], updatedAt: Date.now() } : c
      ));
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden font-sans antialiased text-gray-900">
      <Header 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeView={activeView}
          onViewChange={setActiveView}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
          {activeView === 'ai_chat' && (
            <div className="flex flex-1 overflow-hidden">
              <HistoryPanel 
                conversations={conversations}
                activeId={activeId || undefined}
                onSelect={handleSelectConversation}
                onNew={handleNewConversation}
                onDelete={handleRemoveConversation}
              />
              <ChatInterface 
                messages={activeConversation?.messages || []}
                onSend={handleSendMessage}
                onClear={handleClear}
                isGenerating={isGenerating}
                selectedModelId={activeConversation?.config.modelId || 'deepseek-chat'}
                onModelChange={(id) => {
                  setConversations(conversations.map(c => 
                    c.id === activeId ? { ...c, config: { ...c.config, modelId: id } } : c
                  ));
                }}
              />
            </div>
          )}

          {activeView === 'project_list' && (
            <AuditProjectList onSelectProject={handleSelectProject} />
          )}

          {activeView === 'project_detail' && selectedProjectId && (
            <AuditProjectDetail 
              projectId={selectedProjectId} 
              onBack={() => setActiveView('project_list')}
              onNavigateToDocWriting={() => setActiveView('smart_doc_writing')}
            />
          )}

          {activeView === 'cat_mgmt' && (
            <ModelCategoryMgmt />
          )}

          {activeView === 'tool_mgmt' && (
            <ToolMgmt />
          )}

          {activeView === 'skill_mgmt' && (
            <AuditModelMgmt />
          )}

          {activeView === 'rule_mgmt' && (
            <AuditRuleMgmt />
          )}

          {activeView === 'template_mgmt' && (
            <TemplateMgmt />
          )}

          {activeView === 'smart_doc_writing' && (
            <SmartDocWriting 
              onNavigate={(view) => setActiveView(view)} 
              initialProjectId={selectedProjectId || undefined}
            />
          )}

          {activeView === 'my_docs' && (
            <MyDocuments />
          )}

          {activeView === 'rule_config' && (
            <CorrectionRuleMgmt />
          )}

          {activeView === 'doc_correct' && (
            <DocumentCorrection />
          )}

          {activeView === 'law_kb' && (
            <KnowledgeBaseHome category="law" title="法律法规知识库" />
          )}

          {activeView === 'kb_audit' && (
            <KnowledgeBaseHome category="audit" title="审计资料知识库" />
          )}

          {activeView === 'kb_personal' && (
            <KnowledgeBaseHome category="personal" title="个人知识库" />
          )}

          {activeView === 'kb_analysis' && (
            <DocumentAnalysis />
          )}

          {activeView === 'ds_access' && (
            <DataSourceAccess 
              onConfigure={(id) => {
                setSelectedDataSourceId(id);
                setActiveView('ds_config');
              }} 
            />
          )}

          {activeView === 'ds_mapping' && (
            <DataMappingMgmt />
          )}

          {activeView === 'ds_approval' && (
            <DataSourceApproval />
          )}

          {activeView === 'ds_preview' && (
            <DataSourcePreview />
          )}

          {activeView === 'data_analysis' && (
            <DataAnalysisMerged />
          )}
 
          {activeView === 'sys_llm' && <SystemLLMManagement />}
          {activeView === 'sys_org' && <SystemOrg />}
          {activeView === 'sys_role' && <SystemRole />}
          {activeView === 'sys_user' && <SystemUser />}
          {activeView === 'sys_permission' && <SystemPermissionManagement />}
          {activeView === 'sys_log' && <SystemLog />}
          {activeView === 'sys_ops' && <SystemOpsManagement />}

          {!['ai_chat', 'project_list', 'project_detail', 'cat_mgmt', 'tool_mgmt', 'skill_mgmt', 'rule_mgmt', 'template_mgmt', 'rule_config', 'doc_correct', 'law_kb', 'kb_audit', 'kb_personal', 'kb_analysis', 'ds_access', 'ds_preview', 'ds_mapping', 'ds_approval', 'data_analysis', 'smart_doc_writing', 'my_docs', 'sys_llm', 'sys_org', 'sys_role', 'sys_user', 'sys_permission', 'sys_log', 'sys_ops'].includes(activeView) && (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-400">功能开发中...</h2>
                <p className="text-gray-400 mt-2">当前视图: {activeView}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
