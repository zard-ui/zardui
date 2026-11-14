import { CODE_BLOCK_DEMO_PREVIEW } from '@generated/components/code-block/demo/preview';
import { COLOR_PICKER_DEMO_PREVIEW } from '@generated/components/color-picker/demo/preview';
import { DATA_TABLE_DEMO_PREVIEW } from '@generated/components/data-table/demo/preview';
import { MENUBAR_DEMO_PREVIEW } from '@generated/components/menubar/demo/preview';
import { MESSAGE_SCROLLER_DEMO_PREVIEW } from '@generated/components/message-scroller/demo/preview';
import { NATIVE_SELECT_DEMO_PREVIEW } from '@generated/components/native-select/demo/preview';
import { QUESTIONNAIRE_DEMO_DEFAULT } from '@generated/components/questionnaire/demo/default';
import { TRACE_DEMO_PREVIEW } from '@generated/components/trace/demo/preview';
import { CODE_BLOCK_CLI_ADD } from '@generated/installation/cli/add-code-block';
import { COLOR_PICKER_CLI_ADD } from '@generated/installation/cli/add-color-picker';
import { DATA_TABLE_CLI_ADD } from '@generated/installation/cli/add-data-table';
import { MENUBAR_CLI_ADD } from '@generated/installation/cli/add-menubar';
import { MESSAGE_SCROLLER_CLI_ADD } from '@generated/installation/cli/add-message-scroller';
import { NATIVE_SELECT_CLI_ADD } from '@generated/installation/cli/add-native-select';
import { QUESTIONNAIRE_CLI_ADD } from '@generated/installation/cli/add-questionnaire';
import { TRACE_CLI_ADD } from '@generated/installation/cli/add-trace';

import { ZardDemoCodeBlockPreviewComponent } from '@zard/components/code-block/demo/preview';
import { ZardDemoColorPickerPreviewComponent } from '@zard/components/color-picker/demo/preview';
import { ZardDemoDataTablePreviewComponent } from '@zard/components/data-table/demo/preview';
import { ZardDemoMenubarPreviewComponent } from '@zard/components/menubar/demo/preview';
import { ZardDemoMessageScrollerPreviewComponent } from '@zard/components/message-scroller/demo/preview';
import { ZardDemoNativeSelectPreviewComponent } from '@zard/components/native-select/demo/preview';
import { ZardDemoQuestionnaireDefaultComponent } from '@zard/components/questionnaire/demo/default';
import { ZardDemoTracePreviewComponent } from '@zard/components/trace/demo/preview';

import { type ChangelogExample } from '../changelog-entry.interface';

export const NOVEMBER_2026_EXAMPLES: ChangelogExample[] = [
  {
    name: 'preview',
    description:
      'A table built on TanStack Table that sorts, filters, paginates and selects rows, with ready-made column header, pagination and view-options parts.',
    component: ZardDemoDataTablePreviewComponent,
    componentName: 'data-table',
    codeData: DATA_TABLE_DEMO_PREVIEW,
    cliAdd: DATA_TABLE_CLI_ADD,
    fillContainer: true,
  },
  {
    name: 'preview',
    description: 'Pick a color in several formats, with optional alpha and presets, and bind it to Angular forms.',
    component: ZardDemoColorPickerPreviewComponent,
    componentName: 'color-picker',
    codeData: COLOR_PICKER_DEMO_PREVIEW,
    cliAdd: COLOR_PICKER_CLI_ADD,
  },
  {
    name: 'preview',
    description: 'A desktop-style menu bar with checkbox items, radio items and submenus.',
    component: ZardDemoMenubarPreviewComponent,
    componentName: 'menubar',
    codeData: MENUBAR_DEMO_PREVIEW,
    cliAdd: MENUBAR_CLI_ADD,
  },
  {
    name: 'preview',
    description: "Style the browser's own select element, with sizes, option groups and invalid states.",
    component: ZardDemoNativeSelectPreviewComponent,
    componentName: 'native-select',
    codeData: NATIVE_SELECT_DEMO_PREVIEW,
    cliAdd: NATIVE_SELECT_CLI_ADD,
  },
  {
    name: 'default',
    description:
      'A multi-step form that asks one question at a time, with choices, free-text answers, progress, validation and keyboard shortcuts.',
    component: ZardDemoQuestionnaireDefaultComponent,
    componentName: 'questionnaire',
    codeData: QUESTIONNAIRE_DEMO_DEFAULT,
    cliAdd: QUESTIONNAIRE_CLI_ADD,
    fillContainer: true,
  },
  {
    name: 'preview',
    description:
      'Show code with Shiki highlighting, line numbers, diffs, tabs and a copy action, even while it streams in.',
    component: ZardDemoCodeBlockPreviewComponent,
    componentName: 'code-block',
    codeData: CODE_BLOCK_DEMO_PREVIEW,
    cliAdd: CODE_BLOCK_CLI_ADD,
    fillContainer: true,
  },
  {
    name: 'preview',
    description: 'A chat scroll area that follows streaming replies and loads older messages without jumping.',
    component: ZardDemoMessageScrollerPreviewComponent,
    componentName: 'message-scroller',
    codeData: MESSAGE_SCROLLER_DEMO_PREVIEW,
    cliAdd: MESSAGE_SCROLLER_CLI_ADD,
    fillContainer: true,
  },
  {
    name: 'preview',
    description:
      "A timeline of an agent's steps, from reasoning to tool calls and sources, with a status and collapsible details for each one.",
    component: ZardDemoTracePreviewComponent,
    componentName: 'trace',
    codeData: TRACE_DEMO_PREVIEW,
    cliAdd: TRACE_CLI_ADD,
    fillContainer: true,
  },
];
