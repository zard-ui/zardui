import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('libs/zard/src/lib/components/**/doc/api.md');

console.log(`Found ${files.length} api.md files to standardize\n`);

for (const file of files) {
  const content = readFileSync(file, 'utf-8');

  // Extract component name and type from the span tag
  const typeMatch = content.match(/##\s*(\[?[\w-`]+\]?)\s*<span class="api-type-label (component|directive|service|pipe)">(Component|Directive|Service|Pipe)<\/span>/i);

  if (!typeMatch) {
    console.log(`⚠️  Skipping ${file} - couldn't find type label`);
    continue;
  }

  let componentName = typeMatch[1];
  const typeName = typeMatch[3]; // Component, Directive, Service, or Pipe

  // Clean up component name - remove extra brackets, backticks, etc
  componentName = componentName.replace(/`/g, '').trim();

  // Ensure it has brackets if it's a selector
  if (!componentName.startsWith('[') && componentName.startsWith('z-')) {
    componentName = `[${componentName}]`;
  }

  // Replace title with standard "# API Reference"
  let newContent = content.replace(/^#\s+API.*$/m, '# API Reference');

  // Replace the component header line with standard format
  newContent = newContent.replace(
    /##\s*(\[?[\w-`]+\]?)\s*(?:\(.*?\))?\s*<span class="api-type-label.*?<\/span>/,
    `${componentName} ${typeName}`
  );

  // Write the updated content
  writeFileSync(file, newContent, 'utf-8');
  console.log(`✅ Updated ${file}`);
}

console.log('\n✨ All api.md files have been standardized!');
