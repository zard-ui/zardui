import { EMPTY_DEMO_PREVIEW } from '@generated/components/empty/demo/preview';
import { SHEET_DEMO_PREVIEW } from '@generated/components/sheet/demo/preview';
import { EMPTY_CLI_ADD } from '@generated/installation/cli/add-empty';
import { SHEET_CLI_ADD } from '@generated/installation/cli/add-sheet';

import { ZardDemoEmptyPreviewComponent } from '@zard/components/empty/demo/preview';
import { ZardDemoSheetPreviewComponent } from '@zard/components/sheet/demo/preview';

import { type ChangelogExample } from '../changelog-entry.interface';

export const OCTOBER_2025_EXAMPLES: ChangelogExample[] = [
  {
    name: 'preview',
    description:
      'A versatile sheet component for side panels and overlays with customizable positioning and smooth transitions.',
    component: ZardDemoSheetPreviewComponent,
    componentName: 'sheet',
    codeData: SHEET_DEMO_PREVIEW,
    cliAdd: SHEET_CLI_ADD,
  },
  {
    name: 'preview',
    description: 'Clean empty state component for "no data" scenarios with customizable messages and icons.',
    component: ZardDemoEmptyPreviewComponent,
    componentName: 'empty',
    codeData: EMPTY_DEMO_PREVIEW,
    cliAdd: EMPTY_CLI_ADD,
  },
];
