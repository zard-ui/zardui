import { ZardDemoInputGroupBorderlessComponent } from './borderless';
import { ZardDemoInputGroupDefaultComponent } from './default';
import { ZardDemoInputGroupLoadingComponent } from './loading';
import { ZardDemoInputGroupSizeComponent } from './size';
import { ZardDemoInputGroupTextComponent } from './text';

export const INPUT_GROUP = {
  componentName: 'input-group',
  componentType: 'input-group',
  description: 'Display additional information or actions to an input or textarea.',
  examples: [
    {
      name: 'default',
      component: ZardDemoInputGroupDefaultComponent,
      column: true,
    },
    {
      name: 'text',
      component: ZardDemoInputGroupTextComponent,
      column: true,
    },

    {
      name: 'size',
      component: ZardDemoInputGroupSizeComponent,
      column: true,
    },
    {
      name: 'borderless',
      component: ZardDemoInputGroupBorderlessComponent,
      column: true,
    },
    {
      name: 'loading',
      component: ZardDemoInputGroupLoadingComponent,
      column: true,
    },
  ],
};
