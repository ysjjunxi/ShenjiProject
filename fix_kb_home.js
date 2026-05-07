import fs from 'fs';
const filePath = 'src/components/KnowledgeBaseHome.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Match the specific corrupted pattern: one space, Name..., until the next )}
const messRegex = / Name="text-gray-300" \/> :[\s\S]*?<\/div>\s+<\/div>\s+\)}/m;
content = content.replace(messRegex, ')}');

fs.writeFileSync(filePath, content);
console.log('Fixed KnowledgeBaseHome.tsx');
