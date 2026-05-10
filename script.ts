import fs from 'fs';

const filePath = 'src/components/DocumentAnalysis.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace standard tailwind arbitrary text sizes
content = content.replace(/text-\[8px\]/g, 'text-xs');
content = content.replace(/text-\[9px\]/g, 'text-xs');
content = content.replace(/text-\[10px\]/g, 'text-xs');
content = content.replace(/text-\[11px\]/g, 'text-xs');

fs.writeFileSync(filePath, content);
console.log('Replaced all small text sizes with text-xs (12px)');
