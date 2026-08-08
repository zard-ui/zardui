import { generateDemoFiles } from './demo-writer';
import { generateDocsFiles } from './docs-writer';
import { generateFormDemoFiles, generateFormSnippetFiles } from './forms-writer';
import { disposeHighlighter } from './highlighter';
import { generateInstallationFiles } from './installation-writer';
import { generatePageDataFiles } from './page-data-writer';
import { generateSnippetFiles } from './snippet-writer';
import { generateUsageFiles } from './usage-writer';
import { startWatcher } from './watch';

const isWatch = process.argv.includes('--watch');

async function generate(): Promise<void> {
  console.log('🔄 Generating highlighted code files...\n');

  const [demoCount, installCount, docsCount, pageCount, usageCount, snippetCount, formDemoCount, formSnippetCount] =
    await Promise.all([
      generateDemoFiles(),
      generateInstallationFiles(),
      generateDocsFiles(),
      generatePageDataFiles(),
      generateUsageFiles(),
      generateSnippetFiles(),
      generateFormDemoFiles(),
      generateFormSnippetFiles(),
    ]);

  console.log(`✅ Wrote ${demoCount} demo files`);
  console.log(`✅ Wrote ${installCount} installation files`);
  console.log(`✅ Wrote ${docsCount} documentation files`);
  console.log(`✅ Wrote ${pageCount} page data files`);
  console.log(`✅ Wrote ${usageCount} usage files`);
  console.log(`✅ Wrote ${snippetCount} snippet files`);
  console.log(`✅ Wrote ${formDemoCount} form guide demo files`);
  console.log(`✅ Wrote ${formSnippetCount} form guide snippet files`);
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
