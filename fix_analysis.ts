import fs from 'fs';
let file = 'src/components/DocumentAnalysis.tsx';
let content = fs.readFileSync(file, 'utf8');

// replace duplicateFragments 2 and 3
content = content.replace(`,
    { 
      sourceContent: '在对于其后之进行过程中的由于对于施工现场之由于管理不周全进而导致的质量问题。',
      targetContent: '在对于其后之进行过程中的由于对于施工现场之由于管理不周全进而导致的质量问题。',
      sourceDocName: '投标人A_技术标.pdf',
      targetDocName: '投标人B_技术标.pdf',
      location: '第45页',
      similarity: 100,
      hammingDistance: 0
    },
    { 
      sourceContent: '确保本工程的“履约保正金”于规定时间内完成支付。',
      targetContent: '确保本工程的“履约保正金”于规定时间内完成支付。',
      sourceDocName: '投标人A_技术标.pdf',
      targetDocName: '投标人B_技术标.pdf',
      location: '第12页',
      similarity: 100,
      hammingDistance: 0
    }`, '');

// add to paraphraseAnalysis
const paraInsert = `,
      { 
        type: '病句与异常表达', 
        evidence: '“在对于其后之进行过程中的由于对于施工现场之由于管理不周全进而导致的质量问题。”', 
        confidence: 100, 
        status: 'critical',
        details: '检测到两份文档同时出现了极其罕见的不符合中文语法的异常长难句' 
      },
      { 
        type: '冷僻错别字', 
        evidence: '“履约保正金” (错误使用“正”代替“证”)', 
        confidence: 100, 
        status: 'critical',
        details: '在第12页关于“履约保证金”的描述中存在完全一致的生僻错别字' 
      }`;

content = content.replace(/(type: '段落重组\/顺序调整'[\s\S]*?details: '[^']*'\s*\}\s*)(?=])/, '$1' + paraInsert);

// fix JSX rendering
content = content.replace(
  /<h4 className="text-sm font-black text-gray-900">\{idx === 2 \? '内容语法\/表达异常检测' : idx === 3 \? '冷僻错别字一致性检测' : `重复片段 #\$\{idx \+ 1\}`\}<\/h4>/,
  '<h4 className="text-sm font-black text-gray-900">{`重复片段 #${idx + 1}`}</h4>'
);

content = content.replace(
  /\s*\{idx >= 2 && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-md text-xs font-black uppercase">语义特征碰撞<\/span>\}/,
  ''
);

fs.writeFileSync(file, content);
