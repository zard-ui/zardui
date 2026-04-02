import { generateDemoFiles } from './demo-writer';
import { generateDocsFiles } from './docs-writer';
import { disposeHighlighter } from './highlighter';
import { generateInstallationFiles } from './installation-writer';
import { generatePageDataFiles } from './page-data-writer';
import { startWatcher } from './watch';

const isWatch = process.argv.includes('--watch');

async function generate(): Promise<void> {
  console.log('🔄 Generating highlighted code files...\n');

  const [demoCount, installCount, docsCount, pageCount] = await Promise.all([
    generateDemoFiles(),
    generateInstallationFiles(),
    generateDocsFiles(),
    generatePageDataFiles(),
  ]);

  console.log(`✅ Generated ${demoCount} demo files`);
  console.log(`✅ Generated ${installCount} installation files`);
  console.log(`✅ Generated ${docsCount} documentation files`);
  console.log(`✅ Generated ${pageCount} page data files`);
  console.log('');
}

async function main(): Promise<void> {
  await generate();

  if (isWatch) {
    startWatcher(async () => {
      await generateInstallationFiles();
    });
  } else {
    disposeHighlighter();
  }
}

main().catch(err => {
  console.error('❌ Generation failed:', err);
  process.exit(1);
});
