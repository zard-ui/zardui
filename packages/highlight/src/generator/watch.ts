import fs from 'node:fs';
import path from 'node:path';

import { generateSingleDemo } from './demo-writer';

const COMPONENTS_PATH = path.resolve('libs/zard/src/lib/shared/components');
const DEBOUNCE_MS = 300;

type Timer = ReturnType<typeof setTimeout>;

export function startWatcher(onInstallationChange: () => Promise<void>): void {
  console.log('👀 Watching for file changes...\n');

  const demoTimers = new Map<string, Timer>();
  let installationTimer: Timer | null = null;

  const scheduleDemo = (fullPath: string, fileName: string) => {
    const existing = demoTimers.get(fullPath);
    if (existing) clearTimeout(existing);

    demoTimers.set(
      fullPath,
      setTimeout(() => {
        demoTimers.delete(fullPath);
        console.log(`📝 ${fileName} changed — regenerating demo...`);
        generateSingleDemo(fullPath)
          .then(() => console.log('✅ Demo updated\n'))
          .catch(err => console.error('❌ Demo regeneration failed:', err));
      }, DEBOUNCE_MS),
    );
  };

  const scheduleInstallation = (fileName: string) => {
    if (installationTimer) clearTimeout(installationTimer);

    installationTimer = setTimeout(() => {
      installationTimer = null;
      console.log(`🔧 ${fileName} changed — regenerating installation guides...`);
      onInstallationChange()
        .then(() => console.log('✅ Installation guides updated\n'))
        .catch(err => console.error('❌ Installation regeneration failed:', err));
    }, DEBOUNCE_MS);
  };

  fs.watch(COMPONENTS_PATH, { persistent: true, recursive: true }, (eventType, fileName) => {
    if (!fileName) return;
    if (eventType !== 'change' && eventType !== 'rename') return;

    const normalized = fileName.replace(/\\/g, '/');
    const isDemoFile = normalized.includes('/demo/') && normalized.endsWith('.ts');
    const isComponentFile = normalized.endsWith('.component.ts') || normalized.endsWith('.variants.ts');

    if (!isDemoFile && !isComponentFile) return;

    const fullPath = path.join(COMPONENTS_PATH, fileName);
    if (!fs.existsSync(fullPath)) return;

    if (isDemoFile) {
      scheduleDemo(fullPath, normalized);
    }

    if (isComponentFile) {
      scheduleInstallation(normalized);
    }
  });
}
