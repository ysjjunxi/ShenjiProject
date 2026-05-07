import React, { useState } from 'react';
import AIAssistedAnalysisChat from './AIAssistedAnalysisChat';
import SQLAnalysisDashboard from './SQLAnalysisDashboard';

export default function DataAnalysisMerged() {
  const [generatedSql, setGeneratedSql] = useState<string>('');
  const [executeTrigger, setExecuteTrigger] = useState<number>(0);

  const handleLoadToEditor = (sql: string) => {
    setGeneratedSql(sql);
  };

  const handleExecute = (sql: string) => {
    setGeneratedSql(sql);
    setExecuteTrigger(Date.now());
  };

  return (
    <div className="flex-1 flex w-full h-full overflow-hidden bg-white">
      {/* Left side: AI Assistant */}
      <div className="w-[400px] xl:w-[450px] shrink-0 border-r border-gray-200 shadow-[2px_0_15px_rgba(0,0,0,0.03)] z-10 flex flex-col relative">
        <AIAssistedAnalysisChat 
          onLoadToEditor={handleLoadToEditor}
          onExecute={handleExecute}
        />
      </div>
      
      {/* Right side: SQL Analysis Dashboard */}
      <div className="flex-1 min-w-0 flex flex-col relative z-0">
        <SQLAnalysisDashboard 
          initialSql={generatedSql}
          executeTrigger={executeTrigger}
        />
      </div>
    </div>
  );
}
