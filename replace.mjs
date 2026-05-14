import fs from 'fs';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // remove the whole parameterization UI
  content = content.replace(/<div className="w-px h-6 bg-gray-200 mx-1"><\/div>[\s\S]*?\{lb\.rightType === 'param' && \([\s\S]*?<\/div>[\s\S]*?\)\}/g, '');

  let inputHtml = `
                                        <input placeholder="变量如(5%)" value={lb.preLeftTerm || ''} onChange={e => { const lgs = JSON.parse(JSON.stringify(MODIFIED_GROUPS)); lgs[lgIndex].logicBlocks[bIdx] = { ...lgs[lgIndex].logicBlocks[bIdx], preLeftTerm: e.target.value }; UPDATE_FUNC; }} className="w-24 bg-gray-50 border border-transparent hover:border-gray-300 focus:border-orange-400 focus:bg-white rounded-lg px-2 py-1.5 text-xs outline-none transition-all" />
                                        <select value={lb.preOperator || ''} onChange={e => { const lgs = JSON.parse(JSON.stringify(MODIFIED_GROUPS)); lgs[lgIndex].logicBlocks[bIdx] = { ...lgs[lgIndex].logicBlocks[bIdx], preOperator: e.target.value }; UPDATE_FUNC; }} className="w-16 bg-gray-50 border border-transparent hover:border-gray-300 focus:border-orange-400 focus:bg-white rounded-lg px-1 py-1.5 text-xs outline-none font-mono font-bold text-center transition-all appearance-none">
                                          <option value=""></option><option value=">">&gt;</option><option value="<">&lt;</option><option value=">=">&gt;=</option><option value="<=">&lt;=</option><option value="==">==</option><option value="!=">!=</option>
                                        </select>`;

  // for AuditRuleMgmt:
  if (filePath.includes('AuditRuleMgmt')) {
    inputHtml = inputHtml.replace(/MODIFIED_GROUPS/g, 'cc.logicGroups');
    inputHtml = inputHtml.replace(/UPDATE_FUNC;/g, 'updateConfigurableCheckpoint(index, { logicGroups: lgs });');
  } else {
    // for AuditProjectDetail
    inputHtml = inputHtml.replace(/MODIFIED_GROUPS/g, 'formData.logicGroups');
    inputHtml = inputHtml.replace(/UPDATE_FUNC;/g, 'setFormData({ ...formData, logicGroups: lgs });');
  }

  // insert before <input placeholder="变量A
  content = content.replace(/(<input placeholder="变量A.*?value=\{lb\.leftTerm\})/g, inputHtml + '\n                                        $1');

  fs.writeFileSync(filePath, content, 'utf-8');
}

processFile('src/components/AuditRuleMgmt.tsx');
processFile('src/components/AuditProjectDetail.tsx');
console.log('Done!');
