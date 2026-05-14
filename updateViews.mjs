import fs from 'fs';

function updateFile(filePath, searchRegex, replaceText) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(searchRegex, replaceText);
  fs.writeFileSync(filePath, content, 'utf-8');
}

// 1. AuditProjectDetail.tsx line 1721
// {lb.leftTerm} <span className="text-blue-500 font-bold">{lb.operator}</span> {lb.rightTerm}{lb.paramUnit || ''}
updateFile(
  'src/components/AuditProjectDetail.tsx',
  /\{lb\.leftTerm\} <span className="text-blue-500 font-bold">\{lb\.operator\}<\/span> \{lb\.rightTerm\}\{lb\.paramUnit \|\| ''\}/g,
  `{lb.preLeftTerm && <>{lb.preLeftTerm} <span className="text-blue-500 font-bold">{lb.preOperator}</span> </>}{lb.leftTerm} <span className="text-blue-500 font-bold">{lb.operator}</span> {lb.rightTerm}`
);

// 2. AuditModelEditor.tsx lines 623-625
// <span className="text-gray-600">{lb.leftTerm}</span>
// <span className="font-bold text-blue-600">{lb.operator}</span>
// <span className="text-gray-900">{lb.rightType === 'param' ? `${lb.paramValue}${lb.paramUnit}` : lb.rightTerm}</span>
const modelEditorText1 = `<span className="text-gray-600">{lb.leftTerm}</span>
                                                    <span className="font-bold text-blue-600">{lb.operator}</span>
                                                    <span className="text-gray-900">{lb.rightType === 'param' ? \`\${lb.paramValue}\${lb.paramUnit}\` : lb.rightTerm}</span>`;
const newModelEditorText1 = `{lb.preLeftTerm && (
                                                      <>
                                                        <span className="text-gray-600">{lb.preLeftTerm}</span>
                                                        <span className="font-bold text-blue-600">{lb.preOperator}</span>
                                                      </>
                                                    )}
                                                    <span className="text-gray-600">{lb.leftTerm}</span>
                                                    <span className="font-bold text-blue-600">{lb.operator}</span>
                                                    <span className="text-gray-900">{lb.rightTerm}</span>`;
updateFile('src/components/AuditModelEditor.tsx', modelEditorText1, newModelEditorText1);

// 3. AuditModelEditor.tsx lines 941-945
const modelEditorText2 = `<span className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 font-mono">{block.leftTerm}</span>
                                      <span className="font-bold text-blue-600">{block.operator}</span>
                                      <span className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 font-mono">
                                        {block.rightType === 'param' ? \`\${block.paramValue}\${block.paramUnit}\` : block.rightTerm}
                                      </span>`;
const newModelEditorText2 = `{block.preLeftTerm && (
                                        <>
                                          <span className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 font-mono">{block.preLeftTerm}</span>
                                          <span className="font-bold text-blue-600">{block.preOperator}</span>
                                        </>
                                      )}
                                      <span className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 font-mono">{block.leftTerm}</span>
                                      <span className="font-bold text-blue-600">{block.operator}</span>
                                      <span className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 font-mono">
                                        {block.rightTerm}
                                      </span>`;
updateFile('src/components/AuditModelEditor.tsx', modelEditorText2, newModelEditorText2);

console.log('Update views done!');
