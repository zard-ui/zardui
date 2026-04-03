import { TREE_DEMO_BASIC } from '@generated/components/tree/demo/basic';
import { TREE_DEMO_CHECKABLE } from '@generated/components/tree/demo/checkable';
import { TREE_DEMO_SELECTION } from '@generated/components/tree/demo/selection';
import { TREE_DEMO_VIRTUAL_SCROLL } from '@generated/components/tree/demo/virtual-scroll';
import { TREE_CLI_ADD } from '@generated/installation/cli/add-tree';
import { TREE_MANUAL_CODE } from '@generated/installation/manual/tree';

import { ZardDemoTreeBasicComponent } from './basic';
import { ZardDemoTreeCheckableComponent } from './checkable';
import { ZardDemoTreeSelectionComponent } from './selection';
import { ZardDemoTreeVirtualScrollComponent } from './virtual-scroll';
import { TREE_API } from '../doc/api';

export const TREE = {
  componentName: 'tree',
  componentType: 'tree',
  api: TREE_API,
  description:
    'A hierarchical tree view for displaying nested data structures with expand/collapse, selection, and checkboxes.',
  installData: {
    cliAdd: TREE_CLI_ADD,
    manualCode: TREE_MANUAL_CODE,
  },
  examples: [
    {
      name: 'basic',
      component: ZardDemoTreeBasicComponent,
      column: false,
      codeData: TREE_DEMO_BASIC,
    },
    {
      name: 'checkable',
      component: ZardDemoTreeCheckableComponent,
      column: false,
      codeData: TREE_DEMO_CHECKABLE,
    },
    {
      name: 'selection',
      component: ZardDemoTreeSelectionComponent,
      column: false,
      codeData: TREE_DEMO_SELECTION,
    },
    {
      name: 'virtual-scroll',
      component: ZardDemoTreeVirtualScrollComponent,
      column: false,
      codeData: TREE_DEMO_VIRTUAL_SCROLL,
    },
  ],
};
