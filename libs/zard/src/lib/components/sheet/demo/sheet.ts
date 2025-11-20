import { ZardDemoSheetBasicComponent } from './basic';
import { ZardDemoSheetDimensionsComponent } from './dimensions';
import { ZardDemoSheetSideComponent } from './side';

export const SHEET = {
  componentName: 'sheet',
  componentType: 'sheet',
  description: 'Extends the Dialog component to display content that complements the main content of the screen.',
  examples: [
    {
      name: 'basic',
      component: ZardDemoSheetBasicComponent,
    },
    {
      name: 'side',
      component: ZardDemoSheetSideComponent,
    },
    {
      name: 'dimensions',
      component: ZardDemoSheetDimensionsComponent,
    },
  ],
};
