import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Database, 
  Code, 
  CheckCircle2, 
  FileText, 
  CheckSquare, 
  Settings, 
  TableProperties, 
  Eye, 
  X,
  BookOpen,
  Layers,
  Trash2,
  ChevronDown,
  Info,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  Send,
  Bot,
  MessageSquare,
  Zap,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuditModel, ModelCheckpoint, AuditRule } from '@/src/types';
import { MOCK_CATEGORIES, KNOWLEDGE_BASES, MOCK_MATERIALS, STANDARD_CHECKPOINTS, MOCK_RULES } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

const BUSINESS_TYPES = ['通用业务', '财务审计业务', '专项资金业务', '工程审计业务', '经济责任审计业务'];
const RULE_TYPES = [
  { value: 'all', label: '全部类型' },
  { value: 'general', label: '通用规则' },
  { value: 'dedicated', label: '专用规则' }
];

const AVAILABLE_TABLES = [
  { id: 't1', name: '标准表', fields: [{ name: 'id', type: 'VARCHAR(32)' }, { name: 'amount', type: 'DECIMAL(18,2)' }, { name: 'date', type: 'DATE' }, { name: 'department_id', type: 'VARCHAR(32)' }] },
  { id: 't2', name: '凭证清单表', fields: [{ name: 'voucher_id', type: 'VARCHAR(32)' }, { name: 'amount', type: 'DECIMAL(18,2)' }, { name: 'subject_code', type: 'VARCHAR(20)' }, { name: 'date', type: 'DATE' }] },
  { id: 't3', name: '项目台账表', fields: [{ name: 'project_id', type: 'VARCHAR(32)' }, { name: 'project_name', type: 'VARCHAR(255)' }, { name: 'budget', type: 'DECIMAL(18,2)' }, { name: 'manager', type: 'VARCHAR(50)' }] },
  { id: 't4', name: '付款记录表', fields: [{ name: 'payment_id', type: 'VARCHAR(32)' }, { name: 'payee', type: 'VARCHAR(255)' }, { name: 'amount', type: 'DECIMAL(18,2)' }, { name: 'payment_date', type: 'DATE' }] }
];

interface AuditModelEditorProps {
  mode: 'auto' | 'manual';
  initialModel?: AuditModel;
  onBack: () => void;
  onSave: (model: AuditModel) => void;
}

export default function AuditModelEditor({ initialModel, onBack, onSave }: AuditModelEditorProps) {
  // 1. Basic Info
  const [skillId] = useState(initialModel?.id || `sk-${Date.now().toString(36).toUpperCase()}`);
  const [modelName, setModelName] = useState(initialModel?.name || '');
  const [category, setCategory] = useState(initialModel?.category || MOCK_CATEGORIES[0].name);
  const [description, setDescription] = useState(initialModel?.description || '');
  const [version] = useState(initialModel?.version || 'v1.0.0');
  
  // 2. Knowledge Base
  const [knowledgeBaseId, setKnowledgeBaseId] = useState(initialModel?.knowledgeBaseId || '');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(initialModel?.materialIds || []);
  const [isKbModalOpen, setIsKbModalOpen] = useState(false);

  // 3. Checkpoints
  const [checkpoints, setCheckpoints] = useState<ModelCheckpoint[]>(
    initialModel?.checkpoints || []
  );

  // 4. Rule Selector Drawer
  const [isRuleDrawerOpen, setIsRuleDrawerOpen] = useState(false);
  const [ruleSearch, setRuleSearch] = useState('');
  const [ruleBusinessType, setRuleBusinessType] = useState('all');
  const [ruleType, setRuleType] = useState('all');
  const [tempSelectedRuleIds, setTempSelectedRuleIds] = useState<string[]>([]);

  // 5. Audit Process (Markdown)
  const [auditProcessMd, setAuditProcessMd] = useState(initialModel?.auditProcessMd || '');

  // 6. View Rule Detail
  const [viewingRule, setViewingRule] = useState<AuditRule | null>(null);

  // 7. Smart AI Agent
  const [isSmartAgentOpen, setIsSmartAgentOpen] = useState(false);
  const [agentInput, setAgentInput] = useState('');
  const [agentMessages, setAgentMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: '您好！请提供以下信息，我将为您自动生成审计模型结构：\n\n1. 模型名称\n2. 模型分类\n3. 适用场景\n4. 关联审计资料知识库\n5. 法定固定审查点 (例如: 三公经费支出合规性)\n6. 判定规则 (例如: 支出金额 > 预算金额)\n7. 审计流程说明'
    }
  ]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const handleSmartGenerate = async () => {
    if (!agentInput.trim() || isAiProcessing) return;

    const userMessage = { role: 'user', content: agentInput };
    setAgentMessages(prev => [...prev, userMessage]);
    const currentInput = agentInput;
    setAgentInput('');
    setIsAiProcessing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3-flash-preview";
      
      const systemInstruction = `你是一个辅助构建审计模型的 AI 专家。你的任务是解析用户的聊天内容，并将其映射到审计模型的表单字段中。
      
      你可以使用的选项信息：
      - 可用分类: ${MOCK_CATEGORIES.map(c => c.name).join(', ')}
      - 可用知识库: ${KNOWLEDGE_BASES.map(k => `[ID: ${k.id}, Name: ${k.name}]`).join('; ')}
      - 现有规则库（可用于匹配判定规则）: ${MOCK_RULES.map(r => `[ID: ${r.id}, Name: ${r.name}, Desc: ${r.description}]`).join('; ')}

      你需要提取并返回以下 JSON 格式的数据：
      {
        "modelName": "提取的模型名称",
        "category": "从[可用分类]中选出一个最贴切的名称",
        "description": "提取的适用场景或详细描述",
        "knowledgeBaseId": "从[可用知识库]中选出一个最匹配的 ID",
        "ruleIds": ["根据用户描述的判定规则，从[现有规则库]中选出相关的 ID 列表"],
        "auditProcessMd": "提取或生成的审计流程 Markdown 说明",
        "response": "给用户的一段简洁回复，告诉他你提取了哪些信息并已填表。"
      }

      注意：
      1. 如果由于用户输入含糊导致无法通过关键词完全匹配知识库或规则，请尽量选择最接近的。
      2. 如果用户某些字段没提供，JSON 中对应的字段保持 null 或不返回。
      3. 必须严格返回合法 JSON。`;

      const response = await ai.models.generateContent({
        model,
        contents: [
          { role: 'user', parts: [{ text: `历史对话: ${JSON.stringify(agentMessages.slice(-5))}\n用户输入: ${currentInput}` }] }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              modelName: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              knowledgeBaseId: { type: Type.STRING },
              ruleIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              auditProcessMd: { type: Type.STRING },
              response: { type: Type.STRING }
            },
            required: ["response"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      // Auto-fill form fields if values were extracted
      if (result.modelName) setModelName(result.modelName);
      if (result.category) setCategory(result.category);
      if (result.description) setDescription(result.description);
      if (result.knowledgeBaseId) setKnowledgeBaseId(result.knowledgeBaseId);
      if (result.auditProcessMd) setAuditProcessMd(result.auditProcessMd);
      
      if (result.ruleIds && result.ruleIds.length > 0) {
        const rulesToAdd = MOCK_RULES.filter(r => result.ruleIds.includes(r.id));
        const newCheckpoints = rulesToAdd.map(rule => ({
          id: 'cp-' + Math.random().toString(36).substr(2, 9) + Date.now(),
          name: rule.name,
          description: rule.description,
          standardTables: rule.standardTables,
          script: '',
          ruleId: rule.id
        }));
        setCheckpoints(prev => [...prev, ...newCheckpoints]);
      }

      setAgentMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.response 
      }]);
    } catch (error) {
      console.error('AI Smart Generate Error:', error);
      setAgentMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，智能生成时遇到错误，请重试。' 
      }]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSave = (targetStatus: 'draft' | 'published') => {
    // Validation for publication
    if (targetStatus === 'published') {
      if (!modelName.trim()) {
        alert('请填模型名称');
        return;
      }
      if (!description.trim()) {
        alert('请填写适用场景（模型描述）');
        return;
      }
      if (checkpoints.length === 0) {
        alert('请至少添加一个审查点');
        return;
      }
      if (checkpoints.some(cp => !cp.script || !cp.script.trim())) {
        alert('请为所有审查点编写数据查询脚本');
        return;
      }
      if (!auditProcessMd.trim()) {
        alert('请填写审计流程说明');
        return;
      }
    }

    let finalVersion = version;
    let newVersions = [...(initialModel?.versions || [])];

    // If it was already published, generate a new version
    if (initialModel && initialModel.status === 'published') {
      const vParts = version.replace('v', '').split('.').map(Number);
      if (vParts.length === 3) {
        vParts[2] += 1; // Increment patch version
        finalVersion = `v${vParts.join('.')}`;
      } else {
        finalVersion = `v${version}_new`;
      }
      
      // Add new version record
      newVersions.push({
        version: finalVersion,
        creator: '当前用户',
        createdAt: Date.now(),
        content: targetStatus === 'published' ? '模型更新并发布' : '保存草稿',
        isDefault: targetStatus === 'published',
        status: targetStatus
      });
      
      // If we set new as default, unset others
      if (targetStatus === 'published') {
        newVersions = newVersions.map(v => ({ ...v, isDefault: v.version === finalVersion }));
      }
    } else if (!initialModel) {
      // New model
      newVersions = [
        { version: finalVersion, creator: '当前用户', createdAt: Date.now(), content: '初始生成', isDefault: true, status: targetStatus }
      ];
    } else if (initialModel.status === 'draft' && targetStatus === 'draft') {
      // Still draft, update current version status if needed (mostly redundant but safe)
      newVersions = newVersions.map(v => v.version === finalVersion ? { ...v, status: 'draft' } : v);
    } else if (initialModel.status === 'draft' && targetStatus === 'published') {
       // Just publishing the draft
       newVersions = newVersions.map(v => v.version === finalVersion ? { ...v, content: '初始发布', isDefault: true, status: 'published' } : v);
    }

    const newModel: AuditModel = {
      id: skillId,
      name: modelName || '未命名模型',
      category: category,
      status: targetStatus,
      version: finalVersion,
      creator: initialModel?.creator || '当前用户',
      createdAt: initialModel?.createdAt || Date.now(),
      updatedAt: Date.now(),
      description: description,
      auditLogic: checkpoints.map(cp => `-- ${cp.name}\n${cp.script}`).join('\n\n'),
      laws: initialModel?.laws || [],
      knowledgeBaseId,
      materialIds: selectedMaterials,
      checkpoints,
      auditProcessMd: auditProcessMd,
      scripts: initialModel?.scripts || {
        generation: '-- 生成脚本',
        view: '-- 视图',
        statistics: '-- 统计'
      },
      params: initialModel?.params || {
        statistics: [],
        details: [],
        navigation: []
      },
      versions: newVersions,
      callUrl: initialModel?.callUrl
    };
    onSave(newModel);
  };

  const handleOpenRuleDrawer = () => {
    setTempSelectedRuleIds([]);
    setIsRuleDrawerOpen(true);
  };

  const toggleRuleSelection = (id: string) => {
    setTempSelectedRuleIds(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const confirmRuleBatch = () => {
    const rulesToAdd = MOCK_RULES.filter(r => tempSelectedRuleIds.includes(r.id));
    const newCheckpoints = rulesToAdd.map(rule => ({
      id: 'cp-' + Math.random().toString(36).substr(2, 9) + Date.now(),
      name: rule.name,
      description: rule.description,
      standardTables: rule.standardTables,
      script: '',
      ruleId: rule.id
    }));
    setCheckpoints([...checkpoints, ...newCheckpoints]);
    setIsRuleDrawerOpen(false);
  };

  const handleSelectKB = (kbId: string) => {
    setKnowledgeBaseId(kbId);
    // Auto-select all materials for this KB
    const kbMaterials = MOCK_MATERIALS.filter(m => m.kbId === kbId).map(m => m.id);
    setSelectedMaterials(kbMaterials);
    setIsKbModalOpen(false);
  };

  const filteredRules = MOCK_RULES.filter(r => {
    if (r.status !== 'enabled') return false;
    const matchesSearch = r.name.toLowerCase().includes(ruleSearch.toLowerCase());
    const matchesBiz = ruleBusinessType === 'all' || r.businessType === ruleBusinessType;
    const matchesType = ruleType === 'all' || r.ruleType === ruleType;
    return matchesSearch && matchesBiz && matchesType;
  });

  const removeCheckpoint = (id: string) => {
    setCheckpoints(checkpoints.filter(cp => cp.id !== id));
  };

  const updateCheckpointScript = (id: string, script: string) => {
    setCheckpoints(checkpoints.map(cp => cp.id === id ? { ...cp, script } : cp));
  };

  const toggleMaterial = (matId: string) => {
    setSelectedMaterials(prev => 
      prev.includes(matId) ? prev.filter(id => id !== matId) : [...prev, matId]
    );
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
            <h2 className="text-xl font-normal text-gray-900 tracking-tight">
              {initialModel ? '编辑审计模型' : '新增审计模型'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">配置模型基本信息、数据源、审查点和流程说明</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSmartAgentOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95 text-sm font-bold"
          >
            <Sparkles size={18} className="text-indigo-600" />
            <span>智能生成</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          <div className="p-8 pb-32">
            <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Section 1: Basic Info */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              1. 基本信息
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Skill ID</label>
                <input 
                  type="text"
                  value={skillId}
                  disabled
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">版本</label>
                <input 
                  type="text"
                  value={version}
                  disabled
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">模型名称</label>
                <input 
                  type="text"
                  value={modelName}
                  onChange={e => setModelName(e.target.value)}
                  placeholder="请输入模型名称"
                  className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">模型分类</label>
                <div className="relative">
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none pr-10 font-medium"
                  >
                    {MOCK_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">适用场景</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="描述该模型的适用业务场景..."
                  rows={3}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">数据权限</label>
                <input 
                  type="text"
                  value="默认（只读访问，不可篡改源数据）"
                  disabled
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Knowledge Base association */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-600" />
                2. 关联审计资料知识库
              </h3>
              <button 
                onClick={() => setIsKbModalOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all flex items-center gap-1.5"
              >
                <Settings size={14} />
                更改知识库
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">已选知识库</label>
                {knowledgeBaseId ? (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {KNOWLEDGE_BASES.find(k => k.id === knowledgeBaseId)?.name}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                        {KNOWLEDGE_BASES.find(k => k.id === knowledgeBaseId)?.docCount} 份资料
                      </p>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsKbModalOpen(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-all text-gray-400"
                  >
                    <Plus size={20} />
                    <span className="text-xs font-bold">请选择审计资料知识库</span>
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">包含资料 (默认全选)</label>
                <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedMaterials.length === 0 ? (
                    <div className="text-xs text-gray-400 italic py-4">暂无资料或未选知识库</div>
                  ) : (
                    MOCK_MATERIALS.filter(m => selectedMaterials.includes(m.id)).map(material => (
                      <div key={material.id} className="flex items-center gap-2 p-2 bg-white border border-gray-50 rounded-lg">
                        <FileText size={12} className="text-gray-400" />
                        <span className="text-[11px] font-medium text-gray-700 truncate">{material.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Checkpoints */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckSquare size={20} className="text-purple-600" />
                3. 审查点配置
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleOpenRuleDrawer}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all text-xs font-bold ring-1 ring-purple-200"
                >
                  <Plus size={14} />
                  <span>选择审查点</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-8">
              {checkpoints.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Layers size={32} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">暂无审查点，请从上方添加标准审查点</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {checkpoints.map((cp, idx) => (
                    <div key={cp.id} className="relative bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900">{cp.name}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => {
                              const rule = MOCK_RULES.find(r => r.id === cp.ruleId);
                              if (rule) setViewingRule(rule);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="查看审查点详情"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => removeCheckpoint(cp.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="移除审查点"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        {/* Rule Sub-Checkpoints Display */}
                        {(() => {
                          const rule = MOCK_RULES.find(r => r.id === cp.ruleId);
                          if (!rule) return null;
                          
                          return (
                            <div className="space-y-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                              {rule.fixedCheckpoints.length > 0 && (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest pl-1">
                                    <div className="w-1 h-3 bg-blue-500 rounded-full" />
                                    法定底层固定审查点
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {rule.fixedCheckpoints.map((fcp, fIdx) => (
                                      <div key={fIdx} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <h5 className="text-[11px] font-bold text-gray-900">{fcp.name}</h5>
                                        <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{fcp.description}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {rule.configurableCheckpoints.length > 0 && (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest pl-1">
                                    <div className="w-1 h-3 bg-orange-500 rounded-full" />
                                    可配置业务执行审查点
                                  </div>
                                  <div className="space-y-3">
                                    {rule.configurableCheckpoints.map((ccp, cIdx) => (
                                      <div key={cIdx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                        <div className="flex items-center justify-between">
                                          <h5 className="text-[11px] font-bold text-gray-900">{ccp.name}</h5>
                                          <span className="text-[9px] px-1.5 py-0.5 bg-orange-50 text-orange-600 font-bold rounded">可调阈值</span>
                                        </div>
                                        
                                        {/* Logic Preview */}
                                        <div className="flex flex-wrap items-center gap-2">
                                          {ccp.logicGroups?.map((lg, lgIdx) => (
                                            <React.Fragment key={lg.id}>
                                              {lgIdx > 0 && (
                                                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded uppercase">{lg.relation}</span>
                                              )}
                                              <div className="flex flex-wrap gap-2 p-1.5 bg-gray-50/50 rounded-lg border border-gray-100">
                                                {lg.logicBlocks.map((lb, lIdx, arr) => (
                                                  <div key={lb.id} className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-gray-200 text-[10px] font-mono shadow-sm">
                                                    <span className="text-gray-600">{lb.leftTerm}</span>
                                                    <span className="font-bold text-blue-600">{lb.operator}</span>
                                                    <span className="text-gray-900">{lb.rightType === 'param' ? `${lb.paramValue}${lb.paramUnit}` : lb.rightTerm}</span>
                                                    {lIdx < arr.length - 1 && (
                                                      <span className="ml-1 text-blue-500 font-bold">{lb.relation}</span>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </React.Fragment>
                                          ))}
                                        </div>

                                        {ccp.logicGroups?.map((lg, lgIdx) => (
                                          <p key={lgIdx} className="text-[10px] text-gray-400 italic mt-1 border-t border-gray-50 pt-2 break-all">
                                            依据：{lg.penaltyBasis.source} · {lg.penaltyBasis.chapter}
                                          </p>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                            <Code size={14} /> 数据查询脚本
                          </h5>
                          <textarea 
                            value={cp.script}
                            onChange={e => updateCheckpointScript(cp.id, e.target.value)}
                            placeholder="-- 请在此编写该审查点的 SQL 逻辑或查询脚本..."
                            rows={5}
                            className="w-full bg-gray-900 border border-gray-800 text-purple-100 font-mono rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none shadow-inner"
                          />
                        </div>

                        {cp.script && cp.script.trim().length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 pt-4 border-t border-gray-50"
                          >
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">关联的标准表与字段</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {cp.standardTables.map((table, tIdx) => (
                                <div key={tIdx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Database size={14} className="text-gray-400" />
                                    <span className="text-sm font-bold text-gray-700">{table.tableName}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {table.fields.map((field, fIdx) => (
                                      <span key={fIdx} className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                                        {field}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Section 4: Audit Process */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Settings size={20} className="text-orange-600" />
              4. 审计流程说明
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">支持 Markdown 格式</label>
              <textarea 
                value={auditProcessMd}
                onChange={e => setAuditProcessMd(e.target.value)}
                placeholder="在此输入审计流程说明 (支持 Markdown)...&#10;&#10;例如:&#10;1. 提取全量支付数据&#10;2. 过滤超授权额度的记录&#10;3. ..."
                rows={8}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
              />
            </div>
          </section>
        </div>
      </div>
    </div>

    {/* Smart Agent Integrated Sidebar */}
        <AnimatePresence>
          {isSmartAgentOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 450, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white border-l border-gray-100 flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0 min-h-[64px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-none mb-1">智能生成助手</h3>
                    <p className="text-[10px] text-gray-500">通过对话快速构建审计模型</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSmartAgentOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                {agentMessages.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3 max-w-[90%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      msg.role === 'user' ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-gray-100"
                    )}>
                      {msg.role === 'user' ? <MessageSquare size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user' ? "bg-blue-600 text-white shadow-blue-500/10" : "bg-white border border-gray-100 text-gray-800 shadow-sm"
                    )}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isAiProcessing && (
                  <div className="flex gap-3 mr-auto">
                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 text-blue-600 flex items-center justify-center animate-pulse">
                      <Zap size={16} />
                    </div>
                    <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">思考并提取内容中...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                <div className="relative">
                    <div className="absolute inset-0 pointer-events-none p-4 text-sm text-gray-400">
                      {!agentInput && (
                        <div className="space-y-1">
                          <p>AI提取后将自动填充左侧表单</p>
                          <p className="text-[10px] opacity-70">建议包含：模型名称、分类、适用场景、关联知识库、审查点、判定规则、流程说明</p>
                        </div>
                      )}
                    </div>
                    <textarea 
                      value={agentInput}
                      onChange={(e) => setAgentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSmartGenerate();
                        }
                      }}
                      placeholder=""
                      className="w-full min-h-[140px] max-h-[200px] bg-gray-50 border border-gray-200 rounded-2xl p-4 pr-12 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                    />
                  <button 
                    onClick={handleSmartGenerate}
                    disabled={!agentInput.trim() || isAiProcessing}
                    className="absolute bottom-4 right-4 w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-end gap-3 shrink-0 z-10 shadow-[0_-4px_20px_0_rgba(0,0,0,0.03)]">
        <button 
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all border border-gray-200"
        >
          取消
        </button>
        <button 
          onClick={() => handleSave('draft')}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-blue-200"
        >
          保存草稿
        </button>
        <button 
          onClick={() => handleSave('published')}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20 active:scale-95 text-sm font-medium"
        >
          <CheckCircle2 size={16} />
          <span>发布模型</span>
        </button>
      </div>

      {/* Rule Detail Modal */}
      <AnimatePresence>
        {viewingRule && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingRule(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-lg z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">{viewingRule.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                      {viewingRule.businessType} · {viewingRule.ruleType === 'general' ? '通用规则' : '专用规则'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingRule(null)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    审查点描述
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    {viewingRule.description}
                  </p>
                </div>

                {/* Fixed Checkpoints */}
                {viewingRule.fixedCheckpoints.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      固定审查点 (只读)
                    </h4>
                    <div className="space-y-3">
                      {viewingRule.fixedCheckpoints.map((fcp, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <h5 className="text-sm font-bold text-gray-900 mb-1">{fcp.name}</h5>
                          <p className="text-xs text-gray-500 leading-relaxed">{fcp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Configurable Checkpoints */}
                {viewingRule.configurableCheckpoints.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      内置计算逻辑 (不可更改)
                    </h4>
                    <div className="space-y-4">
                      {viewingRule.configurableCheckpoints.map((ccp, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-bold text-indigo-600 italic">逻辑: {ccp.name}</h5>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {ccp.logicGroups?.map((lg, lgIdx) => (
                              <React.Fragment key={lg.id}>
                                {lgIdx > 0 && (
                                  <div className="w-full flex items-center justify-center my-1">
                                    <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full uppercase">{lg.relation}</span>
                                  </div>
                                )}
                                <div className="w-full bg-gray-50/50 rounded-2xl p-4 border border-gray-100 space-y-3">
                                  {lg.logicBlocks.map((block, bIdx, arr) => (
                                    <div key={block.id} className="flex flex-wrap items-center gap-2 text-sm">
                                      <span className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 font-mono">{block.leftTerm}</span>
                                      <span className="font-bold text-blue-600">{block.operator}</span>
                                      <span className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 font-mono">
                                        {block.rightType === 'param' ? `${block.paramValue}${block.paramUnit}` : block.rightTerm}
                                      </span>
                                      {bIdx < arr.length - 1 && (
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase ml-2">{block.relation}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </React.Fragment>
                            ))}
                          </div>

                          {ccp.logicGroups?.map((lg, lgIdx) => lg.penaltyBasis.source && (
                            <div key={lgIdx} className="bg-red-50/30 border border-red-100 rounded-2xl p-4 mt-2">
                              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                <CheckCircle2 size={12} />
                                定度依据
                              </p>
                              <p className="text-xs text-red-800 leading-relaxed">
                                {lg.penaltyBasis.source} · {lg.penaltyBasis.chapter}: {lg.penaltyBasis.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Standard Tables */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    标准表及字段定义
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingRule.standardTables.map((table, tIdx) => (
                      <div key={tIdx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
                          <Database size={14} className="text-gray-400" />
                          <span className="text-sm font-bold text-gray-900">{table.tableName}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {table.fields.map((field, fIdx) => (
                            <span key={fIdx} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-mono text-gray-500">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10 flex justify-end">
                <button 
                  onClick={() => setViewingRule(null)}
                  className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* KB Selection Modal */}
      <AnimatePresence>
        {isKbModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsKbModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-lg z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">选择审计资料知识库</h3>
                    <p className="text-xs text-gray-500">只能选择一个作为审计参考底座</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsKbModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50/30">
                {KNOWLEDGE_BASES.filter(kb => kb.category === 'audit').map(kb => (
                  <button
                    key={kb.id}
                    onClick={() => handleSelectKB(kb.id)}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left transition-all group flex items-center justify-between",
                      knowledgeBaseId === kb.id 
                        ? "bg-indigo-50 border-indigo-200 ring-4 ring-indigo-500/5 shadow-sm" 
                        : "bg-white border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/10"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                         "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                         knowledgeBaseId === kb.id ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                      )}>
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{kb.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{kb.docCount} 份资料</p>
                      </div>
                    </div>
                    {knowledgeBaseId === kb.id && <CheckCircle2 size={18} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rule Selection Drawer */}
      <AnimatePresence>
        {isRuleDrawerOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRuleDrawerOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">选择审查点</h3>
                    <p className="text-xs text-gray-500">从已启用的规则库中选择并添加到模型</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsRuleDrawerOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filters */}
              <div className="p-6 bg-gray-50/50 space-y-4 shrink-0">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    value={ruleSearch}
                    onChange={e => setRuleSearch(e.target.value)}
                    placeholder="搜索审查点名称..."
                    className="w-full h-11 bg-white border border-gray-200 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <select 
                      value={ruleBusinessType}
                      onChange={e => setRuleBusinessType(e.target.value)}
                      className="w-full h-10 bg-white border border-gray-200 rounded-xl px-4 text-xs font-bold text-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
                    >
                      <option value="all">全部业务类型</option>
                      {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="flex-1 relative">
                    <select 
                      value={ruleType}
                      onChange={e => setRuleType(e.target.value)}
                      className="w-full h-10 bg-white border border-gray-200 rounded-xl px-4 text-xs font-bold text-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
                    >
                      {RULE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Rule List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {filteredRules.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={32} className="text-gray-200" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">未找到符合条件的审查点</p>
                  </div>
                ) : (
                  filteredRules.map(rule => (
                    <div 
                      key={rule.id}
                      onClick={() => toggleRuleSelection(rule.id)}
                      className={cn(
                        "group p-5 bg-white border rounded-2xl transition-all cursor-pointer relative overflow-hidden",
                        tempSelectedRuleIds.includes(rule.id) 
                          ? "border-purple-500 bg-purple-50/20 shadow-lg shadow-purple-500/5" 
                          : "border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0 left-0 w-1 h-full bg-purple-500 transition-opacity",
                        tempSelectedRuleIds.includes(rule.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )} />
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors",
                            tempSelectedRuleIds.includes(rule.id) ? "bg-purple-600 border-purple-600" : "border-gray-300 group-hover:border-purple-400"
                          )}>
                            {tempSelectedRuleIds.includes(rule.id) && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <div>
                            <h4 className={cn(
                              "font-bold transition-colors",
                              tempSelectedRuleIds.includes(rule.id) ? "text-purple-700" : "text-gray-900 group-hover:text-purple-600"
                            )}>
                              {rule.name}
                            </h4>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 mt-1 block">
                              {rule.businessType} · {rule.ruleType === 'general' ? '通用' : '专用'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed ml-8">
                        {rule.description}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsRuleDrawerOpen(false)}
                  className="h-11 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-white hover:border-gray-300 transition-all shadow-sm"
                >
                  关闭
                </button>
                <button 
                  onClick={confirmRuleBatch}
                  disabled={tempSelectedRuleIds.length === 0}
                  className="h-11 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  确认添加 ({tempSelectedRuleIds.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
