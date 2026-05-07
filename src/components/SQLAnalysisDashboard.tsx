import React, { useState, useEffect } from 'react';
import SQLEditor from './SQLEditor';
import SQLExecutionAnalysis from './SQLExecutionAnalysis';

interface SQLAnalysisDashboardProps {
  initialSql?: string;
  initialTab?: string;
  executeTrigger?: number;
}

export default function SQLAnalysisDashboard({ initialSql = '', executeTrigger = 0 }: SQLAnalysisDashboardProps) {
  const [sql, setSql] = useState(initialSql);
  const [executedSql, setExecutedSql] = useState(initialSql);

  useEffect(() => {
    if (initialSql) {
      setSql(initialSql);
    }
  }, [initialSql]);

  useEffect(() => {
    if (executeTrigger > 0) {
      setExecutedSql(initialSql);
    }
  }, [executeTrigger, initialSql]);

  return (
    <div className="flex w-full h-full bg-white overflow-hidden relative">
      
      {/* Middle pane: SQL Editor over Execution Analysis */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 relative">
        <div className="flex-1 flex flex-col min-h-0 border-b border-gray-200 shadow-sm relative z-0">
          <SQLEditor 
            initialSql={sql}
            onExecute={(execSql) => {
              setSql(execSql);
              setExecutedSql(execSql);
            }}
            hideHeader={false}
          />
        </div>
        
        <div className="flex-1 flex flex-col min-h-0 bg-white relative z-0">
          {executedSql ? (
            <SQLExecutionAnalysis 
              sql={executedSql}
              onBackToEditor={() => {}}
              hideHeader={false}
            />
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50/50">
               <h3 className="text-lg font-normal text-gray-900 tracking-tight mb-2">执行分析结果</h3>
               <p className="text-sm text-gray-500 max-w-xs">
                 请在上方编辑器中编写 SQL 并点击执行查询。
               </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
