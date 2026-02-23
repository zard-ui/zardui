import { ZardDemoTreeBasicComponent } from './basic';
import { ZardDemoTreeCheckableComponent } from './checkable';
import { ZardDemoTreeSelectionComponent } from './selection';
import { ZardDemoTreeVirtualScrollComponent } from './virtual-scroll';

export const TREE = {
  componentName: 'tree',
  componentType: 'tree',
  description:
    'A hierarchical tree view for displaying nested data structures with expand/collapse, selection, and checkboxes.',
  examples: [
    {
      name: 'basic',
      component: ZardDemoTreeBasicComponent,
      column: false,
    },
    {
      name: 'checkable',
      component: ZardDemoTreeCheckableComponent,
      column: false,
    },
    {
      name: 'selection',
      component: ZardDemoTreeSelectionComponent,
      column: false,
    },
    {
      name: 'virtual-scroll',
      component: ZardDemoTreeVirtualScrollComponent,
      column: false,
    },
  ],
};
