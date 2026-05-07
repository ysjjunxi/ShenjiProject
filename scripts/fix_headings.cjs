const fs = require('fs');
const path = require('path');

const componentsDir = path.join(process.cwd(), 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the previously broken text classes
  content = content.replace(/text-xl text-gray-800 text-gray-900/g, 'text-xl font-normal text-gray-900 tracking-tight');
  content = content.replace(/text-lg text-gray-800 text-gray-900/g, 'text-lg font-normal text-gray-900 tracking-tight');

  // Any remaining font-bold or font-black on headings
  content = content.replace(/text-2xl font-bold text-gray-900/g, 'text-xl font-normal text-gray-900 tracking-tight');
  content = content.replace(/text-2xl font-black text-gray-900/g, 'text-xl font-normal text-gray-900 tracking-tight');
  content = content.replace(/text-xl font-bold text-gray-900/g, 'text-lg font-normal text-gray-900 tracking-tight');
  content = content.replace(/text-xl font-black text-gray-900/g, 'text-lg font-normal text-gray-900 tracking-tight');

  // Ensure any other basic <h2> or <h3> instances don't have font-bold (just in case)
  content = content.replace(/<h1 className="[^"]*font-bold[^"]*"/g, match => match.replace('font-bold', 'font-normal text-2xl tracking-tight'));
  content = content.replace(/<h2 className="[^"]*font-bold[^"]*"/g, match => match.replace('font-bold', 'font-normal text-xl tracking-tight'));
  content = content.replace(/<h3 className="[^"]*font-bold[^"]*"/g, match => match.replace('font-bold', 'font-normal text-lg tracking-tight'));
  
  content = content.replace(/<h1 className="[^"]*font-black[^"]*"/g, match => match.replace('font-black', 'font-normal text-2xl tracking-tight'));
  content = content.replace(/<h2 className="[^"]*font-black[^"]*"/g, match => match.replace('font-black', 'font-normal text-xl tracking-tight'));
  content = content.replace(/<h3 className="[^"]*font-black[^"]*"/g, match => match.replace('font-black', 'font-normal text-lg tracking-tight'));


  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Fixed headings.');
