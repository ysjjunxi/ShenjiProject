export type Role = 'user' | 'assistant';
export type UserRole = 'admin' | 'auditor';

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  files?: FileInfo[];
  citations?: { title: string; url: string }[];
}

export interface ChatModel {
  id: string;
  name: string;
  score: number;
  summary: string;
  isDefault?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  config: {
    modelId: string;
    knowledgeBases: string[];
    files: FileInfo[];
  };
}

export type ProjectStatus = 'authorizing' | 'suspicion' | 'evidence' | 'working_paper' | 'report_generated';

export interface AuditProject {
  id: string;
  name: string;
  code: string;
  object: string;
  period: string;
  members: { name: string; isLeader: boolean }[];
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
}

export interface SuspicionRecord {
  id: string;
  description: string;
  amount: number;
  level: 'low' | 'medium' | 'high';
  law: string;
  sourceType?: 'database' | 'document';
  sourceDetails?: {
    dbName?: string;
    tableName?: string;
    dataSnapshot?: string | Record<string, any>;
    documentName?: string;
    chapter?: string;
    fragment?: string;
  };
}

export interface Evidence {
  id: string;
  title: string;
  templateId: string;
  content: string;
  version: number;
  updatedAt: number;
}

export interface WorkingPaper {
  id: string;
  title: string;
  templateId: string;
  content: string;
  version: number;
  updatedAt: number;
  evidenceIds: string[];
}

export interface AuditReport {
  id: string;
  title: string;
  status: 'draft' | 'final';
  type: 'first' | 'revised';
  author: string;
  content: string;
  updatedAt: number;
}

export interface LawDocument {
  id: string;
  title: string;
  department: string;
  publishDate: string;
  effectiveDate: string;
  category: string;
  description: string;
  content: string;
  markdownContent?: string;
  clauses: LawClause[];
  fileUrl?: string;
  fileType?: string;
  creator: string;
  createdAt: number;
  updatedAt: number;
}

export interface LawClause {
  id: string;
  title: string;
  content: string;
}

export interface LawQA {
  id: string;
  userId: string;
  messages: QAMessage[];
  createdAt: number;
}

export interface QAMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

export interface Citation {
  lawId: string;
  lawTitle: string;
  clauseId?: string;
  clauseTitle?: string;
}

export interface CorrectionTask {
  id: string;
  files: FileInfo[];
  selectedRuleCategories: string[];
  status: 'idle' | 'processing' | 'completed' | 'failed';
  progress: number;
  results: CorrectionResult[];
  error?: string;
}

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export interface CorrectionResult {
  fileId: string;
  originalContent: string;
  correctedContent: string;
  diffs: CorrectionDiff[];
}

export interface CorrectionDiff {
  type: 'spelling' | 'sensitive' | 'logic' | 'knowledge' | 'consistency';
  original: string;
  corrected: string;
  explanation: string;
  index: number;
  length: number;
  confidence?: number;
}

export interface CorrectionRule {
  id: string;
  name: string;
  category: 'spelling' | 'sensitive' | 'logic' | 'knowledge' | 'consistency';
  docTypes: ('evidence' | 'working_paper' | 'report')[];
  logic: string;
  suggestion: string;
  status: 'enabled' | 'disabled';
  params: RuleParam[];
  creator: string;
  createdAt: number;
  updatedAt: number;
}

export interface RuleParam {
  key: string;
  label: string;
  value: string | number;
  type: 'string' | 'number' | 'select' | 'boolean';
  options?: string[];
  rangeMin?: string | number;
  rangeMax?: string | number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'evidence' | 'working_paper' | 'report' | 'other';
  templateType?: string; // Specific type from TEMPLATE_TYPES
  scenario: string;
  content: string;
  fields: TemplateField[];
  prompts: string[];
  creator: string;
  createdAt: number;
  updatedAt: number;
  isUsed: boolean;
  version: number;
}

export const TEMPLATE_TYPES = [
  '审计通知书',
  '协助查询单位账户通知书',
  '协助查询个人存款通知书',
  '责令改正通知书',
  '封存通知书',
  '解除封存通知书',
  '审计报告',
  '专项审计调查报告',
  '审计报告征求意见书',
  '审计决定书',
  '审计决定执行催告书',
  '强制执行申请书',
  '审计事项移送处理书',
  '审计处罚决定书',
  '审计处罚听证告知书',
  '审计处罚听证申请书',
  '审计处罚听证通知书',
  '审计处罚听证笔录',
  '审计文书送达回证',
  '审理意见书',
  '审计业务会议纪要',
  '审计取证单',
  '审计询问笔录',
  '审计工作底稿',
  '调查了解记录'
] as const;

export const COMMON_TEMPLATE_TYPES = [
  '审计取证单',
  '审计工作底稿',
  '审计报告'
] as const;

export interface TemplateField {
  id: string;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'date';
  required: boolean;
  options?: string[];
}

export interface ModelDataSource {
  db: string;
  table: string;
  fields: string[];
}

export interface ModelCheckpoint {
  id: string;
  name: string;
  description: string;
  standardTables: {
    tableName: string;
    fields: string[];
  }[];
  script: string;
  ruleId?: string; // Track which rule this was based on
}

export interface AuditModel {
  id: string;
  name: string;
  category: string;
  status: 'published' | 'draft';
  version: string;
  creator: string;
  createdAt: number;
  updatedAt: number;
  description: string;
  auditLogic: string;
  laws: string[];
  knowledgeBaseId?: string;
  materialIds?: string[];
  checkpoints: ModelCheckpoint[];
  auditProcessMd?: string;
  scripts: {
    generation: string;
    view: string;
    statistics: string;
  };
  params: {
    statistics: ToolParam[];
    details: ToolParam[];
    navigation: ToolParam[];
  };
  versions: ModelVersion[];
  callUrl?: string;
}

export interface ModelVersion {
  version: string;
  creator: string;
  createdAt: number;
  content: string;
  isDefault: boolean;
  status?: 'published' | 'draft';
}

export interface RuleFixedCheckpoint {
  name: string;
  description: string;
}

export interface LogicBlock {
  id: string;
  leftTerm: string;
  operator: string;
  rightTerm: string;
  rightType: 'fixed' | 'param';
  paramValue?: string;
  paramUnit?: string;
  paramRangeMin?: string;
  paramRangeMax?: string;
  relation: string;
}

export interface LogicGroup {
  id: string;
  relation?: string;
  logicBlocks: LogicBlock[];
  penaltyBasis: {
    source: string;
    chapter: string;
    content: string;
  };
}

export interface RuleConfigurableCheckpoint {
  id: string;
  name: string;
  logicGroups: LogicGroup[];
}

export interface AuditRule {
  id: string;
  name: string;
  description: string;
  businessType: string;
  ruleType: 'general' | 'dedicated';
  fixedCheckpoints: RuleFixedCheckpoint[];
  configurableCheckpoints: RuleConfigurableCheckpoint[];
  standardTables: {
    tableName: string;
    fields: string[];
  }[];
  outputData: string;
  apiUrl: string;
  status: 'enabled' | 'disabled';
  creator: string;
  createdAt: number;
  updatedAt: number;
}

export interface AuditTool {
  id: string;
  name: string;
  description: string;
  scenario: string;
  type: 'reading' | 'processing' | 'conversion' | 'analysis';
  isBuiltIn: boolean;
  inputParams: ToolParam[];
  outputParams: ToolParam[];
  script?: string;
  isTested: boolean;
  callCount: number;
  usedByModels: number;
}

export interface ToolParam {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  description: string;
  required: boolean;
}

export interface ModelCategory {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  level: number;
  modelCount: number;
  children?: ModelCategory[];
}

export type DataSourceType = 'SQLServer' | 'Oracle' | 'MySQL' | '神通';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password?: string;
  status: 'connected' | 'disconnected' | 'error' | 'disabled';
  errorMessage?: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  isReferenced: boolean;
  config?: {
    semanticInterface?: SemanticInterfaceConfig;
    descriptionFile?: string;
    dataDictionary?: DictionaryEntry[];
    configFiles?: ConfigFile[];
  };
}

export type ParseStatus = 'pending' | 'parsing' | 'completed' | 'failed';

export interface AnalyzableDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  source: 'library' | 'personal' | 'local';
  format: string;
  status: ParseStatus;
  progress: number;
  selected: boolean;
  parsedContent?: string;
  extractedInfo?: AnalysisExtractionResult;
  suggestedModel?: 'invoice' | 'bid' | 'contract' | 'tender_announcement';
}

export interface PersonalKnowledgeDoc {
  id: string;
  name: string;
  description: string;
  size: number;
  format: string;
  type: string;
  tags: string[];
  status: ParseStatus;
  progress: number;
  content?: string;
  markdownContent?: string;
  userId: string;
  uploadDate: number;
}

export interface DocChunk {
  id: string;
  docId: string;
  docName: string;
  index: number;
  content: string;
  metadata: Record<string, any>;
}

export interface AnalysisExtractionResult {
  type: 'invoice' | 'contract' | 'bid' | 'tender_announcement' | 'general';
  summary: string;
  keyFields: {
    label: string;
    value: string;
    status: 'normal' | 'warning' | 'error' | 'pending';
    sourceLocation?: string;
  }[];
  entities: {
    label: string;
    value: string;
    type: string;
  }[];
}

export interface ComparisonResult {
  id: string;
  sourceDocId: string;
  targetDocId: string;
  type: 'full' | 'clauses' | 'fields' | 'duplicate';
  similarity: number;
  differences: {
    type: 'added' | 'removed' | 'modified' | 'identical';
    content: string;
    location?: string;
    severity?: 'info' | 'warning' | 'error';
  }[];
  duplicateRate?: number;
  duplicateFragments?: {
    content: string;
    sourceDocName: string;
    location: string;
  }[];
  collusionEvidence?: {
    type: string;
    description: string;
    evidence: string;
  }[];
  reportUrl?: string;
}

export interface DocumentAnalysisQATask {
  id: string;
  documentIds: string[];
  messages: Message[];
}

export interface SemanticInterfaceConfig {
  url: string;
  params: string;
  apiKey: string;
}

export interface DictionaryEntry {
  tableName: string;
  tableChineseName: string;
  tableDescription?: string;
  fields: {
    name: string;
    chineseName: string;
    type: string;
    description: string;
  }[];
}

export interface ConfigFile {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  category: 'law' | 'audit' | 'personal';
  docCount: number;
  status: 'Normal' | 'Error';
  storageType: string;
  updatedAt: number;
  userId?: string;
}

export const KNOWLEDGE_BASES = [
  { id: 'laws', name: '法律法规知识库', category: 'law' },
  { id: 'audit_data', name: '审计资料知识库', category: 'audit' },
  { id: 'personal', name: '个人知识库', category: 'personal' },
];

export const AUDIT_MODELS: ChatModel[] = [
  { id: 'deepseek-chat', name: 'deepseek-chat', score: 100, summary: '通用大模型' },
  { id: 'gpt4-audit', name: 'GPT-4 审计大模型', score: 98, summary: '专业审计分析大模型' },
  { id: 'financial', name: '财务审计专项模型', score: 95, summary: '针对财务报表、资金流向进行深度审计分析。' },
];
