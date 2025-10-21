import { ZardDemoIconColorsComponent } from './colors';
import { ZardDemoIconDefaultComponent } from './default';
import { ZardDemoIconSizesComponent } from './sizes';
import { ZardDemoIconStrokeWidthComponent } from './stroke-width';

export const ICON = {
  componentName: 'icon',
  componentType: 'icon',
  description:
    "A versatile icon component that encapsulates lucide-angular's icons with a consistent API and styling, providing an abstraction layer that facilitates future icon library swapping.",
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
      name: 'strokeWidth',
      component: ZardDemoIconStrokeWidthComponent,
    },
  ],
};
