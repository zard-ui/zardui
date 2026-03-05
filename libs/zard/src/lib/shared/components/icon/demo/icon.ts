import { ZardDemoIconColorsComponent } from './colors';
import { ZardDemoIconDefaultComponent } from './default';
import { ZardDemoIconSearchableComponent } from './searchable';
import { ZardDemoIconSizesComponent } from './sizes';
import { ZardDemoIconStrokeWidthComponent } from './stroke-width';

export const ICON = {
  componentName: 'icon',
  componentType: 'icon',
  description:
    'A versatile icon component using ng-icons with a consistent API and styling. Supports Lucide icons out of the box with the ability to swap icon families.',
  examples: [
    {
      name: 'default',
      component: ZardDemoIconDefaultComponent,
    },
    {
      name: 'sizes',
      component: ZardDemoIconSizesComponent,
    },
    {
      name: 'colors',
      component: ZardDemoIconColorsComponent,
    },
    {
      name: 'stroke-width',
      component: ZardDemoIconStrokeWidthComponent,
    },
    {
      name: 'searchable',
      component: ZardDemoIconSearchableComponent,
      fullWidth: true,
      flexAlign: 'start',
    },
  ],
};
