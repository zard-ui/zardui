import { ZardDemoDialogBasicComponent } from './basic';
import { ZardDemoDialogWithIconsComponent } from './icons';

export const DIALOG = {
  componentName: 'dialog',
  componentType: 'dialog',
  description: 'Visually or semantically separates content.',
  examples: [
    {
      name: 'basic',
      component: ZardDemoDialogBasicComponent,
    },
    {
      name: 'with-icons',
      component: ZardDemoDialogWithIconsComponent,
    },
  ],
};
