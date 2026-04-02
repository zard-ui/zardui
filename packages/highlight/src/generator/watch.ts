import fs from 'node:fs';
import path from 'node:path';

import { generateSingleDemo } from './demo-writer';

const COMPONENTS_PATH = path.resolve('libs/zard/src/lib/shared/components');

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 3000;

export function startWatcher(onInstallationChange: () => Promise<void>): void {
  console.log('👀 Watching for file changes...\n');

  fs.watch(COMPONENTS_PATH, { persistent: true, recursive: true }, (eventType, fileName) => {
    if (eventType !== 'change' || !fileName) return;

    const isDemoFile = fileName.includes('demo') && fileName.endsWith('.ts');
    const isComponentFile = fileName.endsWith('.component.ts') || fileName.endsWith('.variants.ts');

    if (!isDemoFile && !isComponentFile) return;

    if (debounceTimer) return;
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
    }, DEBOUNCE_MS);

    if (isDemoFile) {
      const fullPath = path.join(COMPONENTS_PATH, fileName);
      console.log(`📝 ${fileName} changed — regenerating demo...`);
      generateSingleDemo(fullPath).then(() => {
        console.log('✅ Demo updated\n');
      });
    }

    if (isComponentFile) {
      console.log(`🔧 ${fileName} changed — regenerating installation guides...`);
      onInstallationChange().then(() => {
        console.log('✅ Installation guides updated\n');
      });
    }
  });
}
