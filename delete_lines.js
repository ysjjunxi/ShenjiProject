import fs from 'fs';
const filePath = 'src/components/KnowledgeBaseHome.tsx';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');
// Indices are 0-based, so line 555 is index 554
const newLines = [
    ...lines.slice(0, 554),
    ...lines.slice(564)
];
fs.writeFileSync(filePath, newLines.join('\n'));
console.log('Deleted lines 555-564 from KnowledgeBaseHome.tsx');
