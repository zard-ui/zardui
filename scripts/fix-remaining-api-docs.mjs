import { readFileSync, writeFileSync } from 'fs';

// Manual mapping for files that need to be fixed
const manualFixes = {
  'libs/zard/src/lib/components/select/doc/api.md': {
    type: 'Component',
    name: '[z-select]',
    multiComponent: true,
  },
  'libs/zard/src/lib/components/icon/doc/api.md': {
    type: 'Component',
    name: '[z-icon]',
  },
  'libs/zard/src/lib/components/radio/doc/api.md': {
    type: 'Component',
    name: '[z-radio]',
  },
  'libs/zard/src/lib/components/toggle-group/doc/api.md': {
    type: 'Component',
    name: '[z-toggle-group]',
  },
  'libs/zard/src/lib/components/sheet/doc/api.md': {
    type: 'Component',
    name: '[z-sheet]',
  },
  'libs/zard/src/lib/components/segmented/doc/api.md': {
    type: 'Component',
    name: '[z-segmented]',
  },
  'libs/zard/src/lib/components/resizable/doc/api.md': {
    type: 'Component',
    name: '[z-resizable]',
  },
  'libs/zard/src/lib/components/progress-bar/doc/api.md': {
    type: 'Component',
    name: '[z-progress-bar]',
  },
  'libs/zard/src/lib/components/menu/doc/api.md': {
    type: 'Component',
    name: '[z-menu]',
  },
  'libs/zard/src/lib/components/layout/doc/api.md': {
    type: 'Component',
    name: '[z-layout]',
  },
  'libs/zard/src/lib/components/input-group/doc/api.md': {
    type: 'Component',
    name: '[z-input-group]',
  },
  'libs/zard/src/lib/components/form/doc/api.md': {
    type: 'Component',
    name: '[z-form-field]',
    multiComponent: true,
  },
  'libs/zard/src/lib/components/date-picker/doc/api.md': {
    type: 'Component',
    name: '[z-date-picker]',
  },
  'libs/zard/src/lib/components/combobox/doc/api.md': {
    type: 'Component',
    name: '[z-combobox]',
  },
  'libs/zard/src/lib/components/calendar/doc/api.md': {
    type: 'Component',
    name: '[z-calendar]',
  },
  'libs/zard/src/lib/components/alert-dialog/doc/api.md': {
    type: 'Component',
    name: '[z-alert-dialog]',
  },
};

for (const [filePath, info] of Object.entries(manualFixes)) {
  try {
    const content = readFileSync(filePath, 'utf-8');

    // Replace title
    let newContent = content.replace(/^#\s+.*$/m, '# API Reference');

    // For multi-component files, just fix the title
    if (info.multiComponent) {
      // Try to find the first heading (### or ##) and convert it to the standard format
      newContent = newContent.replace(/^###?\s+([\w-[\]]+).*$/m, (match, componentName) => {
        // Clean component name
        const cleanName = componentName.startsWith('[') ? componentName : `[${componentName}]`;
        return `${cleanName} ${info.type}`;
      });
    } else {
      // For single component files, replace the first ## or ### with the standard format
      newContent = newContent.replace(/^###+?\s+.*$/m, `${info.name} ${info.type}`);
    }

    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ Fixed ${filePath}`);
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}:`, error.message);
  }
}

console.log('\n✨ Remaining api.md files have been fixed!');
