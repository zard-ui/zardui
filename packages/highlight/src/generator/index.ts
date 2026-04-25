import { generateDemoFiles } from './demo-writer';
import { generateDocsFiles } from './docs-writer';
import { disposeHighlighter } from './highlighter';
import { generateInstallationFiles } from './installation-writer';
import { generatePageDataFiles } from './page-data-writer';
import { generateUsageFiles } from './usage-writer';
import { startWatcher } from './watch';

const isWatch = process.argv.includes('--watch');

async function generate(): Promise<void> {
  console.log('🔄 Generating highlighted code files...\n');

  const [demoCount, installCount, docsCount, pageCount, usageCount] = await Promise.all([
    generateDemoFiles(),
    generateInstallationFiles(),
    generateDocsFiles(),
    generatePageDataFiles(),
    generateUsageFiles(),
  ]);

  console.log(`✅ Wrote ${demoCount} demo files`);
  console.log(`✅ Wrote ${installCount} installation files`);
  console.log(`✅ Wrote ${docsCount} documentation files`);
  console.log(`✅ Wrote ${pageCount} page data files`);
  console.log(`✅ Wrote ${usageCount} usage files`);
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
