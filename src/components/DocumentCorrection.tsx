import React from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  Database, 
  BookOpen, 
  Layers, 
  Play, 
  Download, 
  RotateCcw, 
  Settings,
  ChevronRight, 
  Info,
  FileUp,
  Loader2,
  Check,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Share2,
  Clock,
  Eye,
  Calendar
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { FileInfo, CorrectionTask, CorrectionResult, CorrectionDiff } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = [
  { id: 'spelling', label: '拼写/语法', icon: <Zap size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'sensitive', label: '敏感词', icon: <ShieldCheck size={16} />, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'logic', label: '数据逻辑', icon: <Database size={16} />, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'knowledge', label: '知识性错误', icon: <BookOpen size={16} />, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'consistency', label: '上下文', icon: <Layers size={16} />, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const MOCK_RULES_DB = [
  { id: 'sp1', category: 'spelling', name: '常见错别字自动修正' },
  { id: 'sp2', category: 'spelling', name: '标点符号规范校验' },
  { id: 'se1', category: 'sensitive', name: '政治敏感词库过滤' },
  { id: 'se2', category: 'sensitive', name: '涉密人员脱敏检测' },
  { id: 'l1', category: 'logic', name: '金额单位一致性校验' },
  { id: 'l2', category: 'logic', name: '总分勾稽关系校验' },
  { id: 'l3', category: 'logic', name: '同比环比计算验证' },
  { id: 'k1', category: 'knowledge', name: '法规引用时效性分析' },
  { id: 'c1', category: 'consistency', name: '审计发现与建议匹配度' },
];

const MOCK_ORIGINAL = `关于某单位采购项目的审计报告。
在本次审计过程中，我们发现该单位在采购流程中存在一些违规行为。
首先，部分采购合同未经过法律部门审核。
其次，采购金额达到了500万元，但未进行公开招标。
最后，部分供应商的资质审核不严，存在关联交易的嫌疑。依据中华人民共和国预算法（2014年修正）的规定。
综合以上情况，建议该单位加强内部控制，确保采购流程的合规性。`;

const MOCK_DIFFS: CorrectionDiff[] = [
  { type: 'sensitive', original: '违规', corrected: '不合规', explanation: '敏感词“违规”需替换为“不合规”，符合审计文书规范。', index: 35, length: 2 },
  { type: 'logic', original: '500万元', corrected: '500.00万元', explanation: '根据金额逻辑规则，金额应保留两位小数。', index: 85, length: 5, confidence: 96 },
  { type: 'spelling', original: '审核不严', corrected: '审核不严谨', explanation: '语法修正，使表述更专业。', index: 115, length: 4 },
  { type: 'knowledge', original: '中华人民共和国预算法（2014年修正）', corrected: '中华人民共和国预算法（2018年修正）', explanation: '引用的法规版本已过期，应使用2018年最新修正版。', index: 140, length: 18, confidence: 92 },
  { type: 'consistency', original: '建议该单位', corrected: '审计建议该采购单位', explanation: '上下文主语一致性调整，更明确指向被审计实体。', index: 180, length: 5, confidence: 88 },
];

const MOCK_HISTORY = [
  {
    id: 'h1',
    fileName: '某市自来水集团审计报告初稿.docx',
    date: '2024-03-12 14:30',
    status: 'completed',
    issuesCount: 12
  }
];

export default function DocumentCorrection() {
  const [files, setFiles] = React.useState<FileInfo[]>([]);
  const [selectedRules, setSelectedRules] = React.useState<string[]>(MOCK_RULES_DB.map(r => r.id));
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = React.useState(0);
  const [results, setResults] = React.useState<CorrectionResult[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [activeFileId, setActiveFileId] = React.useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (uploadedFiles.length === 0) return;

    if (uploadedFiles.length > 1) {
      setError('单次限上传 1 个文件');
      return;
    }

    const file = uploadedFiles[0];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isSupported = ['pdf', 'doc', 'docx'].includes(extension || '');
    const isTooLarge = file.size > 50 * 1024; // 50KB
    const isCorrupted = Math.random() < 0.1; // 10% chance to simulate corrupted file

    let newFile: FileInfo;

    if (!isSupported) {
      newFile = { id: Math.random().toString(), name: file.name, size: file.size, type: file.type, status: 'error', errorMessage: '文件格式不支持' };
    } else if (isTooLarge) {
      newFile = { id: Math.random().toString(), name: file.name, size: file.size, type: file.type, status: 'error', errorMessage: '文件过大' };
    } else if (isCorrupted) {
      newFile = { id: Math.random().toString(), name: file.name, size: file.size, type: file.type, status: 'error', errorMessage: '文件损坏' };
    } else {
      newFile = { id: Math.random().toString(), name: file.name, size: file.size, type: file.type, status: 'success' };
    }

    setFiles([newFile]);
    setError(null);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const toggleRule = (id: string) => {
    setSelectedRules(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedRules.length === MOCK_RULES_DB.length) setSelectedRules([]);
    else setSelectedRules(MOCK_RULES_DB.map(r => r.id));
  };

  const handleExport = () => {
    if (!activeResult) return;
    const file = files.find(f => f.id === activeResult.fileId);
    if (!file) return;

    const originalName = file.name;
    const dotIndex = originalName.lastIndexOf('.');
    const nameWithoutExt = dotIndex > -1 ? originalName.substring(0, dotIndex) : originalName;
    const ext = dotIndex > -1 ? originalName.substring(dotIndex) : '';
    
    // YYYY-MM-DD HH:mm
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    
    const exportName = `${nameWithoutExt}${formattedDate}${ext}`;
    
    alert(`成功导出：${exportName}`);
  };

  const startCorrection = () => {
    if (files.filter(f => f.status === 'success').length === 0) {
      setError('请先上传有效的审计文书');
      return;
    }
    
    setStatus('processing');
    setProgress(0);
    setError(null);

    const isMockFailure = Math.random() < 0.1; // 10% chance to mock failure
    const errorMessages = ['解析失败：无法正确读取文档内容，请检查文件格式。', '规则配置异常：选取的规则中存在逻辑冲突。', '网络超时：连接云端矫正引擎失败。'];
    const randomErrorMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];

    const interval = setInterval(() => {
      setProgress(prev => {
        if (isMockFailure && prev >= 40) {
          clearInterval(interval);
          setStatus('failed');
          setError(randomErrorMsg);
          return prev;
        }

        if (prev >= 100) {
          clearInterval(interval);
          setStatus('completed');
          const mockResults: CorrectionResult[] = files.filter(f => f.status === 'success').map(f => ({
            fileId: f.id,
            originalContent: MOCK_ORIGINAL,
            correctedContent: MOCK_ORIGINAL.replace('违规', '不合规').replace('500万元', '500.00万元').replace('审核不严', '审核不严谨'),
            diffs: MOCK_DIFFS
          }));
          setResults(mockResults);
          setActiveFileId(mockResults[0].fileId);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const reset = () => {
    setStatus('idle');
    setProgress(0);
    setResults([]);
    setActiveFileId(null);
  };

  const handleViewHistory = (record: any) => {
    const newFile: FileInfo = {
      id: record.id,
      name: record.fileName,
      size: 2048000,
      type: 'application/pdf',
      status: 'success'
    };
    setFiles([newFile]);
    setStatus('completed');
    const mockResult: CorrectionResult = {
      fileId: record.id,
      originalContent: MOCK_ORIGINAL,
      correctedContent: MOCK_ORIGINAL.replace('违规', '不合规').replace('500万元', '500.00万元').replace('审核不严', '审核不严谨'),
      diffs: MOCK_DIFFS
    };
    setResults([mockResult]);
    setActiveFileId(record.id);
  };

  const activeResult = results.find(r => r.fileId === activeFileId);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="h-[90px] px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex flex-col justify-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            {status === 'completed' && (
              <button 
                onClick={reset}
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                title="返回上一级"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-normal text-gray-900 tracking-tight">
                {status === 'completed' ? '比对结果' : '智能文书矫正'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {status === 'completed' ? '查看错误详情与修改建议' : '自动化检测拼写、语法、逻辑及一致性错误'}
              </p>
            </div>
          </div>
          {status === 'completed' && (
            <div className="flex items-center gap-3">
              <button 
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              >
                <RotateCcw size={16} />
                <span>重新矫正</span>
              </button>
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <Download size={18} />
                <span className="font-medium">导出结果</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {error && status === 'idle' && (
            <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {status === 'idle' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6 w-full"
            >
              {/* History Banner */}
              {MOCK_HISTORY.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between text-sm transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-600 text-xs">最近矫正记录:</span>
                        <span className="text-gray-900 text-sm font-medium">{MOCK_HISTORY[0]?.fileName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar size={10} />{MOCK_HISTORY[0]?.date}</span>
                        <span className="flex items-center gap-1"><AlertCircle size={10} />发现错误 {MOCK_HISTORY[0]?.issuesCount} 处</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleViewHistory(MOCK_HISTORY[0])}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Eye size={14} />
                    查看结果
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                {/* Upload Section */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                  <h3 className="text-lg font-normal tracking-tight text-gray-900 mb-4 flex items-center gap-2">
                    <FileUp size={20} className="text-blue-600" />
                    文档上传
                  </h3>
                  
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all group relative">
                    <input 
                      type="file" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept=".doc,.docx,.pdf"
                      multiple={false}
                    />
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={20} />
                    </div>
                    <p className="text-sm font-bold text-gray-900">点击或拖着文件上传</p>
                    <p className="text-xs text-gray-400 mt-1.5">单次限1个文件，最大50K</p>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-6 flex-1 space-y-3">
                      {files.map(file => (
                        <div key={file.id} className={cn(
                          "flex items-center justify-between p-3 rounded-xl border transition-all",
                          file.status === 'error' ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"
                        )}>
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              file.status === 'error' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                            )}>
                              <FileText size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                              <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {file.status === 'error' && (
                              <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                                <AlertCircle size={14} />
                              </span>
                            )}
                            <button 
                              onClick={() => removeFile(file.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all relative z-20"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rule Selection Section */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-normal tracking-tight text-gray-900 flex items-center gap-2">
                      <Settings size={20} className="text-blue-600" />
                      规则选择
                    </h3>
                    <button 
                      onClick={handleSelectAll}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      {selectedRules.length === MOCK_RULES_DB.length ? '取消全选' : '全选'}
                    </button>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CATEGORIES.map(cat => {
                      const rulesInCat = MOCK_RULES_DB.filter(r => r.category === cat.id);
                      return (
                        <div key={cat.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-3">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", cat.bg, cat.color)}>
                              {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 14 })}
                            </div>
                            <span className="text-sm font-bold text-gray-800">{cat.label}</span>
                          </div>
                          <div className="space-y-2 pl-9">
                            {rulesInCat.map(rule => (
                              <label key={rule.id} className="flex items-start gap-2.5 cursor-pointer group">
                                <div className={cn(
                                  "w-3.5 h-3.5 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-all",
                                  selectedRules.includes(rule.id) ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 group-hover:border-blue-400 bg-white"
                                )}>
                                  {selectedRules.includes(rule.id) && <Check size={8} strokeWidth={3} />}
                                </div>
                                <input 
                                  type="checkbox"
                                  className="hidden"
                                  checked={selectedRules.includes(rule.id)}
                                  onChange={() => toggleRule(rule.id)}
                                />
                                <span className={cn(
                                  "text-xs leading-relaxed transition-colors",
                                  selectedRules.includes(rule.id) ? "text-gray-900 font-medium" : "text-gray-500 group-hover:text-gray-900"
                                )}>
                                  {rule.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={startCorrection}
                      disabled={files.filter(f => f.status === 'success').length === 0 || selectedRules.length === 0}
                      className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none active:scale-95 text-sm"
                    >
                      <Play size={16} fill="currentColor" />
                      <span>开始智能矫正</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'processing' && (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <Loader2 size={48} className="text-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600">
                  {progress}%
                </div>
              </div>
              <h3 className="text-xl font-normal text-gray-900 tracking-tight mb-2">正在智能矫正中...</h3>
              <p className="text-gray-500 mb-8">系统正在根据选择的规则对文书进行深度解析与修正，请勿关闭页面</p>
              
              <div className="max-w-md mx-auto h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-500/30"
                />
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <AlertCircle size={48} className="text-red-600" />
              </div>
              <h3 className="text-xl font-normal text-gray-900 tracking-tight mb-2">智能矫正失败</h3>
              <p className="text-red-500 mb-8 max-w-md mx-auto">{error}</p>
              
              <button 
                onClick={reset}
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <RotateCcw size={16} />
                <span>返回重试</span>
              </button>
            </div>
          )}

          {status === 'completed' && activeResult && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* File Selector */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {results.map(res => (
                  <button
                    key={res.fileId}
                    onClick={() => setActiveFileId(res.fileId)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all shrink-0",
                      activeFileId === res.fileId
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    <FileText size={16} />
                    <span>{files.find(f => f.id === res.fileId)?.name}</span>
                  </button>
                ))}
              </div>

              {/* Comparison View */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                  <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">原始文档内容</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase">原文</span>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto font-serif text-lg leading-relaxed text-gray-600">
                    <HighlightedText text={activeResult.originalContent} diffs={activeResult.diffs} mode="original" />
                  </div>
                </div>

                {/* Corrected */}
                <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-500/5 overflow-hidden flex flex-col h-[600px]">
                  <div className="px-6 py-4 border-b border-blue-50 bg-blue-50/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">智能矫正后内容</span>
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase">矫正后</span>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto font-serif text-lg leading-relaxed text-gray-800">
                    <HighlightedText text={activeResult.correctedContent} diffs={activeResult.diffs} mode="corrected" />
                  </div>
                </div>
              </div>

              {/* Correction Details */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-lg font-normal text-lg tracking-tight text-gray-900">矫正详情清单</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="text-xs text-gray-500">敏感词</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400" />
                      <span className="text-xs text-gray-500">拼写/语法</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-400" />
                      <span className="text-xs text-gray-500">数据逻辑</span>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {activeResult.diffs.map((diff, idx) => (
                    <div key={idx} className="p-6 hover:bg-gray-50/50 transition-colors flex items-start gap-6">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        CATEGORIES.find(c => c.id === diff.type)?.bg,
                        CATEGORIES.find(c => c.id === diff.type)?.color
                      )}>
                        {CATEGORIES.find(c => c.id === diff.type)?.icon}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-900">{CATEGORIES.find(c => c.id === diff.type)?.label}</span>
                            {['consistency', 'knowledge', 'logic'].includes(diff.type) && diff.confidence && (
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                                <Zap size={10} />
                                置信度: {diff.confidence}%
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400">位置: {diff.index}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-[10px] text-red-400 font-bold uppercase mb-1">原始内容</p>
                            <p className="text-sm text-red-700 line-through">{diff.original}</p>
                          </div>
                          <ArrowRight size={20} className="text-gray-300 shrink-0" />
                          <div className="flex-1 p-3 bg-green-50 border border-green-100 rounded-lg">
                            <p className="text-[10px] text-green-400 font-bold uppercase mb-1">修正内容</p>
                            <p className="text-sm text-green-700 font-bold">{diff.corrected}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                          <p>{diff.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}

function HighlightedText({ text, diffs, mode }: { text: string; diffs: CorrectionDiff[]; mode: 'original' | 'corrected' }) {
  // Simple highlighting logic for demo
  let lastIndex = 0;
  const parts: React.ReactNode[] = [];

  // Sort diffs by index to process sequentially
  const sortedDiffs = [...diffs].sort((a, b) => a.index - b.index);

  sortedDiffs.forEach((diff, i) => {
    // Add text before the diff
    parts.push(text.substring(lastIndex, diff.index));
    
    // Add the highlighted diff
    const content = mode === 'original' ? diff.original : diff.corrected;
    parts.push(
      <span 
        key={i} 
        className={cn(
          "relative group cursor-help px-1 rounded transition-all",
          mode === 'original' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700 font-bold"
        )}
      >
        {content}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 shadow-xl">
          <div className="font-bold mb-1 flex items-center gap-1">
            <Zap size={10} className="text-yellow-400" />
            矫正解释
          </div>
          {diff.explanation}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
        </div>
      </span>
    );
    
    lastIndex = diff.index + (mode === 'original' ? diff.original.length : diff.corrected.length);
  });

  // Add remaining text
  parts.push(text.substring(lastIndex));

  return <div className="whitespace-pre-wrap">{parts}</div>;
}
