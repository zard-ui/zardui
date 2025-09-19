import { ZardDemoSheetBasicComponent } from './basic';
import { ZardDemoSheetSideComponent } from './side';
import { ZardDemoSheetDimensionsComponent } from './dimensions';

export const SHEET = {
  componentName: 'sheet',
  componentType: 'sheet',
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
