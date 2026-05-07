const fs = require('fs');
const path = require('path');

const componentsDir = path.join(process.cwd(), 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Change heading classes
  content = content.replace(/text-2xl font-bold/g, 'text-xl text-gray-800');
  content = content.replace(/text-2xl font-black/g, 'text-xl text-gray-800');
  content = content.replace(/text-xl font-bold/g, 'text-lg text-gray-800');
  content = content.replace(/text-xl font-black/g, 'text-lg text-gray-800');

  // Make margins/paddings around the titles compact. Let's specifically target common wrappers
  // For example, <div className="flex items-center justify-between mb-8">
  content = content.replace(/justify-between mb-8"/g, 'justify-between mb-4"');
  content = content.replace(/justify-between items-end mb-8"/g, 'justify-between items-end mb-4"');
  content = content.replace(/mb-6/g, 'mb-4'); // common under titles
  content = content.replace(/py-8/g, 'py-4'); // common top-level padding
  content = content.replace(/p-8/g, 'p-6');   // common top-level padding

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Update complete.');
